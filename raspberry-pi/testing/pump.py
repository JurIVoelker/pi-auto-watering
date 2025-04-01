import RPi.GPIO as GPIO
import time

pin = 14

# Set GPIO mode to BCM
GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.OUT)
GPIO.output(pin, GPIO.LOW)

# Config
flow_delay = 0.4
time_for_one_liter = 127.0
time_per_ml = time_for_one_liter / 1000

def activate_pump(duration):
  GPIO.setmode(GPIO.BCM)
  GPIO.setup(pin, GPIO.OUT)
  GPIO.output(pin, GPIO.HIGH)
  time.sleep(duration)
  GPIO.cleanup()

def fill_tube():
  for _ in range(3):
    activate_pump(flow_delay)
    time.sleep(2)

def water(ml):
  time_to_water = flow_delay + (time_per_ml * ml)
  # Then, water the plant
  print(f"Watering plant for {time_to_water} seconds...")
  activate_pump(time_to_water)
  print("Watering done")

# try:
#   water(250)
# except KeyboardInterrupt:
#   print("\nProgram interrupted. Cleaning up GPIO...")
# finally:
#   GPIO.cleanup()