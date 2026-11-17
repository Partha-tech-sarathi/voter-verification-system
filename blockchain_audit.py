import psycopg2
import hashlib
import os
from datetime import datetime

# Connect to PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    database="voter_verification_db",
    user="postgres",
    password=os.environ["DB_PASSWORD"]
)

cursor = conn.cursor()

# Get the latest hash from blockchain_audit
cursor.execute("""
    SELECT current_hash
    FROM blockchain_audit
    ORDER BY timestamp DESC
    LIMIT 1
""")

last_record = cursor.fetchone()

if last_record:
    previous_hash = last_record[0]
else:
    previous_hash = "0"

# New audit record
audit_id = "AUD002"
verification_id = "VER002"
timestamp = datetime.now()
event_type = "VERIFICATION_COMPLETED"
result = "REVIEW"
risk_score = 0.72

# Create data for hashing
data = (
    audit_id
    + verification_id
    + str(timestamp)
    + event_type
    + result
    + str(risk_score)
    + previous_hash
)

current_hash = hashlib.sha256(data.encode()).hexdigest()

# Insert new audit record
cursor.execute("""
    INSERT INTO blockchain_audit
    (audit_id, verification_id, timestamp, event_type,
     result, risk_score, previous_hash, current_hash)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
""", (
    audit_id,
    verification_id,
    timestamp,
    event_type,
    result,
    risk_score,
    previous_hash,
    current_hash
))

conn.commit()

print("AUD002 inserted successfully")
print("Previous Hash:", previous_hash)
print("Current Hash :", current_hash)

cursor.close()
conn.close()