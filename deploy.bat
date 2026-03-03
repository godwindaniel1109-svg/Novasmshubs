@echo off
REM NovaSMSHubs Deployment Script for Windows
REM This script helps deploy all components of NovaSMSHubs

echo 🚀 NovaSMSHubs Deployment Script
echo ==================================

REM Function to check if command exists
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [INFO] Node.js version: %NODE_VERSION% ✓

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [INFO] npm version: %NPM_VERSION% ✓

REM Function to install dependencies
:install_dependencies
set DIR=%1
set NAME=%2

if exist "%DIR%" (
    echo [INFO] Installing dependencies for %NAME%...
    cd "%DIR%"
    npm install --production
    if %ERRORLEVEL% EQU 0 (
        echo [INFO] %NAME% dependencies installed successfully ✓
    ) else (
        echo [ERROR] Failed to install %NAME% dependencies
        pause
        exit /b 1
    )
    cd ..
) else (
    echo [ERROR] Directory %DIR% not found
    pause
    exit /b 1
)
goto :eof

REM Function to build frontend
:build_frontend
set DIR=%1
set NAME=%2

if exist "%DIR%" (
    echo [INFO] Building %NAME%...
    cd "%DIR%"
    npm run build
    if %ERRORLEVEL% EQU 0 (
        echo [INFO] %NAME% built successfully ✓
    ) else (
        echo [ERROR] Failed to build %NAME%
        pause
        exit /b 1
    )
    cd ..
) else (
    echo [ERROR] Directory %DIR% not found
    pause
    exit /b 1
)
goto :eof

REM Install backend dependencies
echo [INFO] Setting up backend dependencies...
call :install_dependencies "backend" "Main Backend"

REM Install admin backend dependencies
echo [INFO] Setting up admin backend dependencies...
call :install_dependencies "admin-backend" "Admin Backend"

REM Build main frontend
echo [INFO] Building main frontend...
call :build_frontend "frontend" "Main Frontend"

REM Build admin frontend
echo [INFO] Building admin frontend...
call :build_frontend "admin-frontend" "Admin Frontend"

REM Create uploads directory if it doesn't exist
if not exist "backend\uploads" (
    mkdir "backend\uploads"
    echo [INFO] Created uploads directory ✓
)

if not exist "admin-backend\uploads" (
    mkdir "admin-backend\uploads"
    echo [INFO] Created admin uploads directory ✓
)

REM Database setup reminder
echo [WARNING] Please ensure your MySQL database is set up:
echo   - Database name: novasmshubs
echo   - User: root ^(or your configured user^)
echo   - Tables will be created automatically

REM Environment setup reminder
echo [WARNING] Please configure your environment variables:
echo   - Copy backend\.env.example to backend\.env
echo   - Copy admin-backend\.env.example to admin-backend\.env
echo   - Update with your actual credentials

REM Deployment instructions
echo.
echo [INFO] Deployment Ready! 🎉
echo.
echo To start the services:
echo   Main Backend:    cd backend ^&^& npm start ^(Port 5000^)
echo   Admin Backend:    cd admin-backend ^&^& npm start ^(Port 5001^)
echo   Main Frontend:   Deploy frontend\build\ to your web server
echo   Admin Frontend:  Deploy admin-frontend\build\ to your admin web server
echo.
echo Default Admin Credentials:
echo   Email: admin@novasmshubs.com
echo   Password: admin123
echo.
echo [INFO] Deployment script completed successfully! 🚀
pause
