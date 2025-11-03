@echo off
echo Starting Web Cuu Ho application...

REM Check if MongoDB is installed
mongod --version > nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB is not installed. Please install MongoDB first.
    pause
    exit /b
)

REM Start MongoDB
echo Starting MongoDB...
start mongod

REM Wait for MongoDB to start
timeout /t 5

REM Install backend dependencies
cd backend
echo Installing backend dependencies...
call npm install

REM Start backend server
echo Starting backend server...
start npm run dev

REM Wait for backend to start
timeout /t 5

REM Open frontend in browser
echo Opening application in browser...
start http://localhost:5000

echo Application is running!
echo Press Ctrl+C to stop the servers
pause