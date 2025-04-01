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

while True:
  while not q.empty():
    try: 
      item = q.get()
      if item["type"] == "measure_weight":
        value = measure_value()
        value = 123
        value = round((value - 110000) / 94, 1)
        res = post_measure_weight([{"value": value, "measuredAt": get_current_time_string()}])
        print(f"Res: {res}")
      elif item["type"] == "water":
        try:
          water(item['amount'])
        except Exception as e:
          print(f"Error watering: {e}")
        finally:
          GPIO.cleanup()
          print("Watering done")
      else: 
        print(f"Unknown item: {item}")
      q.task_done()
    except KeyboardInterrupt:
      exit(1)
  
  if last_weight_measurement == None:
    q.put({"type": "measure_weight"})
    last_weight_measurement = get_current_time()
  elif get_current_time() - last_weight_measurement >= measure_delay:
    q.put({"type": "measure_weight"})
    last_weight_measurement = get_current_time()

  if q.empty():
    try:
      res = get_sync()
      if res["waterAmount"] != None and res["waterAmount"] != 0:
        q.put({"type": "water", "amount": res["waterAmount"]})
    except KeyboardInterrupt:
      exit(1)
    except Exception as e:
      print(f"Unexpected error: {e}. Retrying in 5 seconds...")
    finally:
      time.sleep(5)
    
