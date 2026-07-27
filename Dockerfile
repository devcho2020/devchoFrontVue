FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG BUILD_ENV=prod
RUN echo "================== CURRENT BUILD_ENV: ${BUILD_ENV} =================="

RUN npm run build:${BUILD_ENV}

FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]