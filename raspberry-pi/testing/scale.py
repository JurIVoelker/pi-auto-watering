import RPi.GPIO as GPIO
from hx711 import HX711

DT_PIN = 20  # Data pin
SCK_PIN = 16  # Clock pin

hx = HX711(DT_PIN, SCK_PIN)

def measure_raw_value():
	try:
		GPIO.setmode(GPIO.BCM)
		GPIO.setup(DT_PIN, GPIO.IN)
		GPIO.setup(SCK_PIN, GPIO.OUT)
		raw_value = hx.get_raw_data()
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
	finally:
		GPIO.cleanup()

def get_median(array):
	if len(array) == 0:
		return 0
	array.sort()
	mid = len(array) // 2
	if len(array) % 2 == 0:
		return (array[mid - 1] + array[mid]) / 2
	else:
		return array[mid]

def measure_value(): 
	values = []
	try:
		for i in range(20): 
			raw_value = measure_raw_value()
			if raw_value != 0:
				values.append(raw_value)
		return get_median(values)
	except KeyboardInterrupt:
		raise
	except Exception as e:
		print(f"Error measuring value: {e}")
		return 0
	finally:
		GPIO.cleanup()

# try:
# 	while True:
# 		print(f"value: {measure_value()}")
# except KeyboardInterrupt:
# 	print("Exiting program...")
# finally:
# 	GPIO.cleanup()
