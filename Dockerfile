# 1단계: 빌드 스테이지
FROM node:20 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 프로덕션 스테이지 (Nginx로 서빙)
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
# 아래 줄을 추가해주세요! (프로젝트 구조에 따라 경로 확인)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]