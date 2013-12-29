pushd "%~dp0"
start "webserver" run-server-js.cmd
call grunt
start "watching" grunt watch