@echo off
chcp 65001
title jzo2o-fundations.jar
echo.
echo [信息] 打包运营基础工程。
echo.
call  mvn  package -Dmaven.test.skip=true
echo.
echo [信息] 启动运营基础工程。
echo.
java -Dfile.encoding=utf-8 -Xmx256m -jar target/jzo2o-foundations.jar
