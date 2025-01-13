#!/bin/bash
set -e
BASE_DIR="/home/lamao/workdir/OllamaWrapper"
# activating env
echo "Activating Python environment..."
source "$BASE_DIR/env/bin/activate"
# backend
echo "Starting backend..."
cd "$BASE_DIR/backend"
bash run.bash &
BACKEND_PID=$!
# frontend
echo "Starting frontend..."
cd "$BASE_DIR/frontend/frontend"
npm start &
FRONTEND_PID=$!
# wait for the processes to terminate
echo "Backend (PID $BACKEND_PID) and frontend (PID $FRONTEND_PID) are running."
wait $BACKEND_PID $FRONTEND_PID



# opening in browser
open "http://localhost:3000"
