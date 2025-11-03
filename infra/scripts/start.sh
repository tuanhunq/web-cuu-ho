#!/bin/bash

# Start MongoDB
echo "Starting MongoDB..."
mongod --dbpath /data/db &

# Wait for MongoDB to be ready
sleep 5

# Start Backend
echo "Starting Backend Service..."
cd ../backend
npm start &

# Start Frontend
echo "Starting Frontend Service..."
cd ../frontend
npm start &

# Start Admin Service
echo "Starting Admin Service..."
cd ../admin
npm start &

wait