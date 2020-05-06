@echo off
title TERA Client
cd /d "%~dp0"

node -e "" 2> NUL
if %errorlevel% NEQ 0 (
	echo Node.JS not found.
	echo Please install the latest Current from https://nodejs.org/
	pause
	exit
)

if not exist ./settings/_tera-client_.json (
	node --use-strict bin/configurator
	cls
)

node --use-strict --harmony .
pause