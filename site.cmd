@echo off
cd /d "%~dp0"
call npm run site -- %*
exit /b %ERRORLEVEL%
