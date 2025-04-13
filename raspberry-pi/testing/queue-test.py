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
image_delay = datetime.timedelta(seconds=600)

print("Starting the queue processing loop...")

GPIO.cleanup()

folder_path = "./camera-data"
filenames = [os.path.join(folder_path, f) for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
target_file = filenames[0] if filenames else None
print("Getting filenames from ./camera-data folder...")
for file in filenames[1:]:
  print(f"Adding file to queue for upload: {file}")
  q.put({"type": "image_upload", "file": file})

while True:
  while not q.empty():
    try:
      item = q.get()
      print(f"Processing item from queue: {item}")
      if item["type"] == "measure_weight":
        print("Measuring weight...")
        value = measure_value()
        print(f"Raw weight value: {value}")
        value = max(0, round((value - 255162) / 100.5, 1))
        print(f"Processed weight value: {value}")
        res = post_measure_weight([{"value": value, "measuredAt": get_current_time_string()}])
        print(f"Response from post_measure_weight: {res}")
      elif item["type"] == "water":
        print(f"Watering {item['amount']}ml")
        try:
          water(item['amount'])
        except Exception as e:
          print(f"Error watering: {e}")
        finally:
          q.task_done()
          GPIO.cleanup()
          print("Watering done")
      elif item["type"] == "image_capture":
        print("Capturing image...")
        file_name = capture_image()
        q.put({"type": "image_upload", "file": file_name})
      elif item["type"] == "image_upload":
        print("Uploading image...")
        try:
          if item["file"]:
            upload_image(item["file"])
            os.remove(item["file"])
          else:
            print("No files to upload.")
        except Exception as e:
          print(f"Error retrieving filenames: {e}")
      else:
        print(f"Unknown item type: {item}")
    except KeyboardInterrupt:
      print("KeyboardInterrupt detected. Exiting...")
      exit(1)
    except Exception as e:
      print(f"Error processing item: {e}")

  if last_weight_measurement is None or get_current_time() - last_weight_measurement >= measure_delay:
    print("Adding measure_weight task to queue.")
    q.put({"type": "measure_weight"})
    last_weight_measurement = get_current_time()
  if (last_image_upload is None or get_current_time() - last_image_upload >= image_delay):
    print("Adding image_upload task to queue.")
    q.put({"type": "image_capture"})
    q.put({"type": "image_upload"})
    last_image_upload = get_current_time()
    

  if q.empty():
    try:
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
    finally:
      GPIO.cleanup()
      print("Sleeping for 5 seconds...")
      time.sleep(5)
