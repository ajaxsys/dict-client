pushd %~dp0..\

REM start server at host 8088 (need cmdx)
start "ws" ws 8088

REM wait 5 seconds
ping 127.0.0.1 -n 5 > nul

start "default browser" http://localhost:8088/test/test_gateway.html
start "default browser" http://localhost:8088/test/test_plugin.html