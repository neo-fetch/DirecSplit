# DirecSplit

DirecSplit is a video editing tool that uses Gemini to analyze a video and generate editing directions. It then uses the Shotstack API to automatically edit the video based on these directions.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/direcsplit.git
    cd direcsplit
    ```

2.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Create a `.env` file by copying the example:**
    ```bash
    cp .env .env.example
    ```

4.  **Add your API keys to the `.env` file:**
    -   `GEMINI_API_KEY`: Your API key for the Gemini API.
    -   `SHOTSTACK_API_KEY`: Your API key for the Shotstack API.

## Usage

To run the application, use the following command:
```bash
python src/direcsplit.py
```

The application will prompt you to enter the path to the video file and any additional context. It will then analyze the video, generate editing directions, and output the URL of the edited video.