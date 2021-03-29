@echo off
@chcp 65001 1>NUL
:start
node server.js
pause
goto start