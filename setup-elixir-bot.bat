@echo off
cls
echo ========================================
echo   Azerra AI - Elixir Bot Setup
echo ========================================
echo.

REM Pause at the start so you can see what's happening
echo Starting setup process...
echo.

REM Check if Elixir is installed
echo Checking for Elixir installation...
where elixir >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Elixir is NOT installed!
    echo.
    echo Please install Elixir first using ONE of these methods:
    echo.
    echo METHOD 1 - Via Chocolatey (if installed):
    echo    choco install elixir -y
    echo.
    echo METHOD 2 - Via Scoop (if installed):
    echo    scoop install elixir
    echo.
    echo METHOD 3 - Manual Download:
    echo    Visit: https://elixir-lang.org/install.html#windows
    echo.
    echo After installing Elixir, run this script again.
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Elixir is installed!
    elixir --version
    echo.
)

REM Navigate to bot directory
echo Navigating to bot directory...
set BOT_DIR=%~dp0apps\discord_bot_elixir

if not exist "%BOT_DIR%" (
    echo.
    echo [ERROR] Bot directory not found at: %BOT_DIR%
    echo.
    echo Expected location: C:\Users\Azer\Desktop\AzerrA - AI\apps\discord_bot_elixir
    echo.
    pause
    exit /b 1
)

cd /d "%BOT_DIR%"
echo [OK] Changed to: %CD%
echo.

REM Check if mix.exs exists
if not exist "mix.exs" (
    echo.
    echo [ERROR] mix.exs not found! Bot files may be incomplete.
    echo Current directory: %CD%
    echo.
    dir /b
    echo.
    pause
    exit /b 1
)

echo ========================================
echo   Installing Elixir Tools
echo ========================================
echo.

REM Install Hex package manager
echo Installing Hex package manager...
call mix local.hex --force
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Hex!
    pause
    exit /b 1
)
echo [OK] Hex installed
echo.

REM Install Rebar build tool
echo Installing Rebar build tool...
call mix local.rebar --force
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Rebar!
    pause
    exit /b 1
)
echo [OK] Rebar installed
echo.

echo ========================================
echo   Installing Dependencies
echo ========================================
echo.
echo This may take 5-10 minutes on first run...
echo Please be patient!
echo.

REM Get dependencies
call mix deps.get
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies!
    echo.
    echo Check your internet connection and try again.
    echo.
    pause
    exit /b 1
)

echo.
echo [OK] Dependencies installed successfully!
echo.

echo ========================================
echo   Setting Up Database
echo ========================================
echo.

REM Create database
echo Creating database 'azerra_ai'...
call mix ecto.create
if %errorlevel% neq 0 (
    echo.
    echo [WARNING] Database creation failed or database already exists
    echo This is OK if the database already exists.
    echo.
)

echo ========================================
echo   Compiling Bot
echo ========================================
echo.

call mix compile
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Compilation failed!
    echo.
    echo Check the errors above and fix any issues.
    echo.
    pause
    exit /b 1
)

echo.
echo [OK] Bot compiled successfully!
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo The Elixir Discord bot is ready to run!
echo.
echo Next steps:
echo   1. Close this window
echo   2. Double-click START_BOT.bat to run the bot
echo.
echo Or press any key to start the bot now...
pause >nul

REM Set environment variables
echo.
echo Setting environment variables...
set DISCORD_BOT_TOKEN=MTQyMjQyNDI5MjAyNDM4NTU5OQ.GAA0Ne.GbN8Me4of06GULdu0Dr6Pls4IjfB5h6IkzyjdQ
set DISCORD_GUILD_ID=1422264938692345879
set DATABASE_URL=postgresql://azerra:azerra_dev_password@localhost:5432/azerra_ai
set REDIS_URL=redis://localhost:6379
set SITE_URL=http://localhost:3000
set WEBHOOK_SECRET=dev_secret

echo.
echo ========================================
echo   Starting Discord Bot
echo ========================================
echo.
echo Bot Configuration:
echo   - Guild ID: %DISCORD_GUILD_ID%
echo   - Database: localhost:5432/azerra_ai
echo   - Admin Console: http://localhost:4000/admin
echo.

REM Start bot in interactive mode
call iex -S mix phx.server

REM This will only run if iex exits
echo.
echo Bot stopped.
pause

