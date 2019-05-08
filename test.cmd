:: 这个文件是用来开发调试的

@echo off
set NDT_NODE_ENV=test
set NODE_ENV=develop
node .\bin\ndt.js swagger apiList tagApi=在院时间
set NODE_ENV=
set NDT_NODE_ENV=