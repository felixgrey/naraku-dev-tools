:: ����ļ��������������Ե�

:: node .\bin\ndt.js swagger apiList tagApi=��Ժʱ��

@echo off
set NDT_NODE_ENV=test
set NODE_ENV=develop
node .\bin\ndt.js readme
set NODE_ENV=
set NDT_NODE_ENV=