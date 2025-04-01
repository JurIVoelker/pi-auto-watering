import requests
from env import SERVER_URL, SECRET

auth_header = {"api-key": SECRET}

def post_measure_weight(values):
  body = {
    "values": values,
  }
  r = requests.post(url = f"{SERVER_URL}/api/measure/weight", headers=auth_header, json=body)
  if r.status_code != 200:
    print(f"Error: {r.status_code}: {r.text}")
    exit(1)
  data = r.json()
  return data

def post_upload(filename, capturedAt):
  headers = { 
              "api-key": SECRET, 
              "x-captured-at": capturedAt, 
              "Content-Type": "image/jpg", 
             }
  files={'files': open(filename,'rb')}
  r = requests.post(url = f"{SERVER_URL}/api/upload", headers=headers, files=files)
  if r.status_code != 200:
    print(f"Error: {r.status_code}: {r.text}")
    exit(1)
  data = r.json()
  return data

def get_sync():
  try:
    r = requests.get(url = f"{SERVER_URL}/api/sync", headers=auth_header)
  except requests.exceptions.RequestException as e:
    print("Connection Error")
    return None
  if r.status_code != 200:
    print(f"Error: {r.status_code}: {r.text}")
    exit(1)
  data = r.json()
  return data


# print(get_current_time())

# res = post_upload("./camera-data/test-image.jpg", get_current_time())