import RPi.GPIO as GPIO
from hx711 import HX711

GPIO.setmode(GPIO.BCM)

DT_PIN = 20  # Data pin
SCK_PIN = 16  # Clock pin

hx = HX711(DT_PIN, SCK_PIN)

def measure_value(): 
	GPIO.setmode(GPIO.BCM)
	try:
		raw_value = hx.get_raw_data()
		print("raw_value: ", raw_value)
		average = 0
		for i in range(len(raw_value)):
			average += raw_value[i]
		average /= len(raw_value)
		return average
	except KeyboardInterrupt:
		raise
	except Exception as e:
		print(f"Error measuring value: {e}")
		return 0


# try:
# 	while True:
# 		print(f"value: {measure_value()}")
# except KeyboardInterrupt:
# 	print("Exiting program...")
# finally:
# 	GPIO.cleanup()
