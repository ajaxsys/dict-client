pushd "%~dp0"
start "webserver" run-server-js.cmd
call grunt
call grunt watch