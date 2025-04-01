from rest import post_upload
import os
from utils import get_current_time_string, image_height, image_width

try:
  folder_path = "./camera-data"
  filenames = [os.path.join(folder_path, f) for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
  target_file = filenames[0] if filenames else None
  if target_file:
    print(f"Uploading file: {target_file}")
    res = post_upload(target_file, capturedAt=get_current_time_string())
    print(f"Response from post_upload: {res}")
    os.remove(target_file)
    print(f"Removed file: {target_file}")
  else:
    print("No files to upload.")
  print(f"Filenames found: {filenames}")
except Exception as e:
  print(f"Error retrieving filenames: {e}")