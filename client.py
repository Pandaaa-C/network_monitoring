import requests
import time
import psutil

SERVER_URL = "http://10.13.0.103:9999"

def collect_and_send():
    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory().percent
    disks = []

    for partition in psutil.disk_partitions(all=False):
        try:
            usage = psutil.disk_usage(partition.mountpoint)
            disks.append({
                'disk_name': partition.device,
                'disk_usage': usage.used,
                'disk_space': usage.total,
            })
        except PermissionError:
            continue

    data = {
        'cpu_usage': str(cpu),
        'memory_usage': str(ram),
        'storage_usage': str(psutil.disk_usage('/').percent),
        'disks': disks,
        'description': ''
    }

    try:
        requests.post(SERVER_URL + "/report", json=data)
    except Exception as e:
        print(f"Error sending report: {e}")

while True:
    collect_and_send()
    time.sleep(60)
