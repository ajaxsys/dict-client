pushd "%~dp0"
call grunt

start "webserver" run-server-js.cmd
start "watching" grunt watch

exit