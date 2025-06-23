from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime

app = Flask(__name__)
CORS(app)

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "network_monitor"
}

def get_connection():
    return mysql.connector.connect( **DB_CONFIG)


def create_tables():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS report (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ip_address VARCHAR(45) NOT NULL,
            cpu_usage VARCHAR(45) NOT NULL,
            memory_usage VARCHAR(45) NOT NULL,
            storage_usage VARCHAR(45) NOT NULL,
            description TEXT,
            created_at TIMESTAMP NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS report_storage (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ip_address VARCHAR(45) NOT NULL,
            disk_name VARCHAR(45) NOT NULL,
            disk_usage VARCHAR(64),
            disk_space VARCHAR(64),
            created_at TIMESTAMP NOT NULL
        )
    """)
    conn.commit()
    conn.close()

@app.route('/report', methods=['POST'])
def report():
    data = request.get_json()
    ip = request.remote_addr
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO report (
            ip_address, cpu_usage, memory_usage, storage_usage,
            description, created_at
        ) VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        ip,
        data['cpu_usage'],
        data['memory_usage'],
        data['storage_usage'],
        data.get('description', ''),
        timestamp
    ))

    for disk in data.get('disks', []):
        cursor.execute("""
            INSERT INTO report_storage (
                ip_address, disk_name, disk_usage, disk_space, created_at
            ) VALUES (%s, %s, %s, %s, %s)
        """, (
            ip,
            disk.get('disk_name', ''),
            disk.get('disk_usage', ''),
            disk.get('disk_space', ''),
            timestamp
        ))

    conn.commit()
    conn.close()
    return jsonify({"message": "ok"}), 200


@app.route('/clients', methods=['GET'])
def get_clients():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT ip_address FROM report")
    data = [row[0] for row in cursor.fetchall()]
    conn.close()
    return jsonify(data)

@app.route('/clients/<ip>', methods=['GET'])
def get_ip_metrics(ip):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT cpu_usage, memory_usage, storage_usage, description, created_at 
        FROM report 
        WHERE ip_address = %s 
        ORDER BY created_at DESC
        LIMIT 10
    """, (ip,))
    result = cursor.fetchall()
    conn.close()
    return jsonify(result)

@app.route('/clients/<ip>/disks', methods=['GET'])
def get_disk_metrics(ip):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT disk_name, disk_usage, disk_space, created_at
        FROM report_storage
        WHERE ip_address = %s
        ORDER BY created_at DESC
        LIMIT 50
    """, (ip,))
    result = cursor.fetchall()
    conn.close()
    return jsonify(result)


@app.route('/clients/<ip>/latest', methods=['GET'])
def get_ip_latest(ip):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM report 
        WHERE ip_address = %s 
        ORDER BY created_at DESC 
        LIMIT 1
    """, (ip,))
    result = cursor.fetchone()
    conn.close()
    return jsonify(result if result else {})


if __name__ == '__main__':
    create_tables()
    app.run(host='0.0.0.0', port=9999)
