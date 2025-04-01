from queue import Queue
from rest import get_sync, post_measure_weight
import time
import datetime
from utils import get_current_time, get_current_time_string
from pump import water
from scale import measure_value
import RPi.GPIO as GPIO

q = Queue()
last_weight_measurement = None
measure_delay = datetime.timedelta(seconds=600)

print("Starting the queue processing loop...")

GPIO.cleanup()

while True:
  while not q.empty():
    try:
      item = q.get()
      print(f"Processing item from queue: {item}")
      if item["type"] == "measure_weight":
        print("Measuring weight...")
        value = measure_value()
        print(f"Raw weight value: {value}")
        value = 123
        value = max(0, round((value - 110000) / 94, 1))
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
          GPIO.cleanup()
          print("Watering done")
      else:
        print(f"Unknown item type: {item}")
      q.task_done()
    except KeyboardInterrupt:
      print("KeyboardInterrupt detected. Exiting...")
      exit(1)
    except Exception as e:
      print(f"Error processing item: {e}")

  if last_weight_measurement is None:
    print("No previous weight measurement found. Adding measure_weight task to queue.")
    q.put({"type": "measure_weight"})
    last_weight_measurement = get_current_time()
  elif get_current_time() - last_weight_measurement >= measure_delay:
    print("Time to measure weight again. Adding measure_weight task to queue.")
    q.put({"type": "measure_weight"})
    last_weight_measurement = get_current_time()

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
