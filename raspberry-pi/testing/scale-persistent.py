import RPi.GPIO as GPIO
from hx711 import HX711
import json
import os
from datetime import datetime
import time

GPIO.setmode(GPIO.BCM)

DT_PIN = 20  # Data pin
SCK_PIN = 16  # Clock pin

hx = HX711(DT_PIN, SCK_PIN)

# Directory to save the data
base_dir = "scale-data" 
file_prefix = "basic-reading"  

# Ensure the directory exists
os.makedirs(base_dir, exist_ok=True)

def measure_value():
    try:
        raw_value = hx.get_raw_data()
        average = 0
        for i in range(len(raw_value)):
            average += raw_value[i]
        average /= len(raw_value)
        return average
    except KeyboardInterrupt:
        raise
    except:
        return 0

def save_data(data, timestamp):
    # Create file name based on the current date and hour
    file_name = os.path.join(base_dir, f"{file_prefix}_{timestamp.strftime('%Y-%m-%d_%H')}.json")

    # If the file doesn't exist, create a new one and add the data
    if not os.path.exists(file_name):
        with open(file_name, 'w') as f:
            json.dump([data], f)
    else:
        # If the file exists, append the data
        with open(file_name, 'r+') as f:
            current_data = json.load(f)
            current_data.append(data)
            f.seek(0)
            json.dump(current_data, f)

try:
    while True:
        # Get the current timestamp
        current_time = datetime.now()

        # Measure the value
        value = measure_value()

        # Prepare the data to be saved
        data = {
            "timestamp": current_time.isoformat(),
            "value": value
        }

        # Save the data
        save_data(data, current_time)

        print(f"Saved value: {value} at {current_time}")

        # Wait for 5 seconds
        time.sleep(5)

except KeyboardInterrupt:
    print("Exiting program...")

finally:
    GPIO.cleanup()
