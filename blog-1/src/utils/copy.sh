# 当前系统执行shell脚本的一个执行文件，这是一个执行文件
#!/bin/sh

# cd到项目下logs日志目录下
cd /Users/jinyan/Desktop/blog-webserver/blog-1/logs
# 拷贝文件生成并重命名文件 date全局变量是当前的日期
cp access.log $(date +%Y-%m-%d).access.log
# 清空access.log文件
echo "" > access.log