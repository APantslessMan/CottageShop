# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 8000

# Run Gunicorn to serve the Flask app
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "wsgi:app"]

# Adjust the command if your app entry point is different