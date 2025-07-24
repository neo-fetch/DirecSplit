import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [video, setVideo] = useState(null);
  const [context, setContext] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
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
    } catch (err) {
      setError('An error occurred while processing the video.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>DirecSplit</h1>
      </header>
      <main>
        <div className="upload-section">
          <h2>Upload Your Video</h2>
          <p>Split your video into meaningful chunks.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="file" onChange={handleVideoChange} accept="video/*" />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Add any additional context here..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group terms">
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

        {error && <div className="error">{error}</div>}

        {isLoading && (
          <div className="loading">
            <p>Analyzing and editing your video... This may take a moment.</p>
            <div className="spinner"></div>
          </div>
        )}

        {result && (
          <div className="result-section">
            <h2>Your Video is Ready!</h2>
            <div className="video-container">
              <video controls src={result.edited_video_url}></video>
            </div>
            <div className="directions">
              <h3>Editing Directions</h3>
              <pre>{JSON.stringify(result.directions, null, 2)}</pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
