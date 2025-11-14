# Backend (Flask) server Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Work in /app/server where server.py lives
WORKDIR /app/server

# system deps (sqlite and build tools if ever needed)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Copy backend app and requirements
COPY server/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY server/ .

# Ensure data and uploads directories exist inside the container
RUN mkdir -p data uploads

# Expose Flask/Gunicorn port
EXPOSE 5000

# Use gunicorn to serve the Flask app object "app" from server.py
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:5000", "server:app"]
