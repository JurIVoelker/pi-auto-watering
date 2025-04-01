import requests
from env import SERVER_URL, SECRET
import base64
from utils import image_width, image_height

auth_header = {"api-key": SECRET}

def post_measure_weight(values):
  body = {
    "values": values,
  }
  r = requests.post(url=f"{SERVER_URL}/api/measure/weight", headers=auth_header, json=body)
  if r.status_code == 500:
    print(f"Error: {r.status_code}: {r.text}")
    exit(1)
  elif r.status_code != 200:
    print(f"Log: {r.status_code}: {r.text}")
    return None
  data = r.json()
  return data

def post_upload(filename, capturedAt):
  with open(filename, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
  
  body = {
    "file": encoded_string,
    "capturedAt": capturedAt,
    "width": image_height,
    "height": image_width,
  }
  
  r = requests.post(url=f"{SERVER_URL}/api/upload", headers=auth_header, json=body)
  if r.status_code == 500:
    print(f"Error: {r.status_code}: {r.text}")
    exit(1)
  elif r.status_code != 200:
    print(f"Log: {r.status_code}: {r.text}")
    return None
  data = r.json()
  return data

def get_sync():
  try:
    r = requests.get(url=f"{SERVER_URL}/api/sync", headers=auth_header)
  except requests.exceptions.RequestException as e:
    print("Connection Error")
    return None
  if r.status_code == 500:
    print(f"Error: {r.status_code}: {r.text}")
    exit(1)
  elif r.status_code != 200:
    print(f"Log: {r.status_code}: {r.text}")
    return None
  data = r.json()
  return data