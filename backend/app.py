from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import sys

# Add the src directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from direcsplit import analyze_video, edit_video

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/split', methods=['POST'])
def split_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video_file = request.files['video']
    user_context = request.form.get('context', '')

    if video_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if video_file:
        filename = secure_filename(video_file.filename)
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])
        video_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        video_file.save(video_path)

        shotstack_json = analyze_video(video_path, user_context)

        if shotstack_json:
            edited_video_url = edit_video(shotstack_json)
            if edited_video_url:
                return jsonify({
                    'edited_video_url': edited_video_url,
                    'directions': shotstack_json
                })
            else:
                return jsonify({'error': 'Failed to edit video'}), 500
        else:
            return jsonify({'error': 'Failed to analyze video'}), 500

if __name__ == '__main__':
    app.run(debug=True)
