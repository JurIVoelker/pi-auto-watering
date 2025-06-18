from queue import Queue
from rest import get_sync, post_measure_weight, post_upload
import time
import datetime
from utils import get_current_time, get_current_time_string
from pump import water
from scale import measure_value
import RPi.GPIO as GPIO
from camera_testing import capture_image
import os
from minio_test import upload_image

q = Queue()
last_weight_measurement = None
measure_delay = datetime.timedelta(seconds=600)
last_image_upload = None
image_delay = datetime.timedelta(seconds=3600)

print("Starting the queue processing loop...")

GPIO.cleanup()

folder_path = "./camera-data"
filenames = [os.path.join(folder_path, f) for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
target_file = filenames[0] if filenames else None
print("Getting filenames from ./camera-data folder...")
for file in filenames[1:]:
  print(f"Adding file to queue for upload: {file}")
  q.put({"type": "image_upload", "file": file})



def process_measure_weight():
  try:
    print("Measuring weight...")
    value = measure_value()
    print(f"Raw weight value: {value}")
    value = max(0, round((value - 255162) / 100.5, 1))
    print(f"Processed weight value: {value}")
    res = post_measure_weight([{"value": value, "measuredAt": get_current_time_string()}])
    print(f"Response from post_measure_weight: {res}")
  except Exception as e:
    print(f"Error in process_measure_weight: {e}")

def process_water(amount):
  try:
    print(f"Watering {amount}ml")
    water(amount)
  except Exception as e:
    print(f"Error in process_water: {e}")
  finally:
    GPIO.cleanup()
    print("Watering done")

def process_image_capture():
  try:
    print("Capturing image...")
    file_name = capture_image()
    q.put({"type": "image_upload", "file": file_name})
  except Exception as e:
    print(f"Error in process_image_capture: {e}")

def process_image_upload(file):
  try:
    print("Uploading image...")
    if file:
      upload_image(file)
      os.remove(file)
    else:
      print("No files to upload.")
  except Exception as e:
    print(f"Error in process_image_upload: {e}")

def process_queue_item(item):
  try:
    print(f"Processing item from queue: {item}")
    if item["type"] == "measure_weight":
      process_measure_weight()
    elif item["type"] == "water":
      process_water(item["amount"])
    elif item["type"] == "image_capture":
      process_image_capture()
    elif item["type"] == "image_upload":
      process_image_upload(item["file"])
    else:
      print(f"Unknown item type: {item}")
  except Exception as e:
    print(f"Error processing item: {e}")
    GPIO.cleanup()

while True:
  while not q.empty():
    item = q.get()
    process_queue_item(item)
    q.task_done()

  try:
    if last_weight_measurement is None or get_current_time() - last_weight_measurement >= measure_delay:
      print("Adding measure_weight task to queue.")
      q.put({"type": "measure_weight"})
      last_weight_measurement = get_current_time()

    if (
      (last_image_upload is None or get_current_time() - last_image_upload >= image_delay)
      and 8 < get_current_time().hour < 18
    ):
      print("Adding image_capture and image_upload tasks to queue.")
      q.put({"type": "image_capture"})
      q.put({"type": "image_upload"})
      last_image_upload = get_current_time()

    if q.empty():
      print("Queue is empty. Fetching data from get_sync...")
      res = get_sync()
      print(f"Response from get_sync: {res}")
      if res["waterAmount"] is not None and res["waterAmount"] != 0:
        print(f"Adding water task to queue with amount: {res['waterAmount']}ml")
        q.put({"type": "water", "amount": res["waterAmount"]})
  except KeyboardInterrupt:
    print("KeyboardInterrupt detected. Exiting...")
    exit(1)
  except Exception as e:
    print(f"Unexpected error: {e}. Retrying in 5 seconds...")
  except:
    print("An unexpected error occurred. Retrying in 5 seconds...")
  finally:
    GPIO.cleanup()
    print("Sleeping for 5 seconds...")
    time.sleep(30)
