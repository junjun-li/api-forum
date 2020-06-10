# build stage
# 指定一个运行环境
FROM node:10
# 谁在维护这个项目
LABEL maintainer="11776174@qq.com"
# 创建一个工作目录
WORKDIR /app
# 把所有的文件复制到镜像中去 添加.dockerignore文件 copy的时候就不会复制不相关的文件
COPY . .
# 使用淘宝源装包
RUN npm --registry https://registry.npm.taobao.org install

RUN npm run build

# 暴露一个端口
EXPOSE 12005

# 挂载一部分数据
VOLUME [ "/app/public" ]

# 运行项目
CMD [ "node", "dist/server.bundle.js" ]