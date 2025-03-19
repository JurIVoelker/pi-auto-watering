import RPi.GPIO as GPIO
import time
from hx711 import HX711
#test
GPIO.setmode(GPIO.BCM)

DT_PIN = 20  # Data pin
SCK_PIN = 16  # Clock pin

hx = HX711(DT_PIN, SCK_PIN)

try:
	while True:
		raw_value = hx.get_raw_data()
		print(f"value: {raw_value}")
except KeyboardInterrupt:
	print("Exiting program...")
finally:
	GPIO.cleanup()
