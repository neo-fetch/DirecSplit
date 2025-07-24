# DirecSplit

DirecSplit is a web application that uses AI to split your videos into meaningful chunks. It's built with a Flask backend and a React frontend.

## How to Run

### Prerequisites

- Python 3
- Node.js and npm

### 1. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the Python dependencies:
    ```bash
    pip install -r ../requirements.txt
    ```
3.  Set up your environment variables by creating a `.flaskenv` file in the root directory and adding your API keys:
    ```
    FLASK_APP=backend/app.py
    FLASK_ENV=development
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    SHOTSTACK_API_KEY="YOUR_SHOTSTACK_API_KEY"
    ```
4.  Start the Flask server:
    ```bash
    flask run
    ```
    The backend will be running at `http://localhost:5000`.

### 2. Frontend Setup

1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the Node.js dependencies:
    ```bash
    npm install
    ```
3.  Start the React development server:
    ```bash
    npm start
    ```
    The frontend will be running at `http://localhost:3000`.

### 3. Usage

1.  Open your browser and go to `http://localhost:3000`.
2.  Upload a video file.
3.  Add any additional context in the text box.
4.  Accept the terms and conditions.
5.  Click "Submit" and wait for the video to be processed.
6.  Once complete, you will see the edited video and the editing directions.