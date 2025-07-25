import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
import shotstack_sdk
from shotstack_sdk.api import edit_api
from shotstack_sdk.model.edit import Edit
from shotstack_sdk.model.output import Output
from shotstack_sdk.model.timeline import Timeline

def analyze_video(video_path, user_context):
    """
    Analyzes the video and returns the editing directions in Shotstack JSON format.
    """
    try:
        # Configure the generative AI model
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        model = genai.GenerativeModel('gemini-1.5-flash',
                                      system_instruction=open(os.path.join(os.path.dirname(__file__), 'prompts/Prompt.txt')).read())

        # In a real application, you would upload the video to a storage service
        # and provide the URL to the model. For this example, we'll use a placeholder.
        # For the purpose of this refactor, we'll continue to use the placeholder video.
        # In a future step, we can implement video uploading to a service.
        video_url = "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/skater.hd.mp4"
        prompt = f"Analyze the video at {video_url} and generate editing directions. User context: {user_context}"

        # Generate the content
        response = model.generate_content(prompt)

        # Extract the Shotstack JSON from the response
        shotstack_json = json.loads(response.text)

        return shotstack_json
    except Exception as e:
        print(f"Error analyzing video: {e}")
        return None


def edit_video(shotstack_json):
    """
    Edits the video using the Shotstack API.
    """
    try:
        # Configure the Shotstack API
        configuration = shotstack_sdk.Configuration(host = "https://api.shotstack.io/v1")
        configuration.api_key['Developer-Key'] = os.environ["SHOTSTACK_API_KEY"]

        with shotstack_sdk.ApiClient(configuration) as api_client:
            # Create an instance of the API class
            api_instance = edit_api.EditApi(api_client)
            edit = Edit(timeline=Timeline(**shotstack_json["timeline"]),
                        output=Output(format="mp4", resolution="1080"))

            # Render the video
            render = api_instance.post_render(edit)

            # Wait for the render to complete
            while True:
                status = api_instance.get_render(render.response.id).response.status
                if status == "done":
                    break
                elif status == "failed":
                    raise Exception("Video rendering failed.")
                # Add a sleep to avoid busy-waiting
                import time
                time.sleep(2)


            return api_instance.get_render(render.response.id).response.url
    except Exception as e:
        print(f"Error editing video: {e}")
        return None
