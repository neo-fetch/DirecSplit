'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import styles from './page.module.css';

interface Result {
  edited_video_url: string;
  directions: any;
}

export default function Home() {
  const [video, setVideo] = useState<File | null>(null);
  const [context, setContext] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedResult = localStorage.getItem('processedResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
  }, []);

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setVideo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('rawVideo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!video || !termsAccepted) {
      setError('Please select a video and accept the terms and conditions.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('video', video);
    formData.append('context', context);

    try {
      const response = await axios.post('http://localhost:5000/api/split', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
      localStorage.setItem('processedResult', JSON.stringify(response.data));
    } catch (err) {
      setError('An error occurred while processing the video.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.App}>
      <header className={styles.App_header}>
        <h1>DirecSplit</h1>
      </header>
      <main>
        <div className={styles.upload_section}>
          <h2>Upload Your Video</h2>
          <p>Split your video into meaningful chunks.</p>
          <form onSubmit={handleSubmit}>
            <div className={styles.form_group}>
              <input type="file" onChange={handleVideoChange} accept="video/*" />
            </div>
            <div className={styles.form_group}>
              <textarea
                placeholder="Add any additional context here..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              ></textarea>
            </div>
            <div className={`${styles.form_group} ${styles.terms}`}>
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <label htmlFor="terms">I accept the terms and conditions.</label>
            </div>
            <button type="submit" disabled={isLoading || !termsAccepted}>
              {isLoading ? 'Processing...' : 'Submit'}
            </button>
          </form>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {isLoading && (
          <div className={styles.loading}>
            <p>Analyzing and editing your video... This may take a moment.</p>
            <div className={styles.spinner}></div>
          </div>
        )}

        {result && (
          <div className={styles.result_section}>
            <h2>Your Video is Ready!</h2>
            <div className={styles.video_container}>
              <video controls src={result.edited_video_url}></video>
            </div>
            <div className={styles.directions}>
              <h3>Editing Directions</h3>
              <pre>{JSON.stringify(result.directions, null, 2)}</pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
