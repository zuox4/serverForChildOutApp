# Этап сборки
FROM node:14 AS build

# Установка рабочей директории
WORKDIR /app

# Копируем только файлы с зависимостями
COPY package.json package-lock.json ./
RUN npm install

# Копируем весь код приложения
COPY . .

# Собираем приложение
RUN npm run build

# Этап продакшн
FROM nginx:alpine

# Копируем собранное приложение в директорию Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Копируем конфигурацию Nginx (подробнее об этом ниже)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Экспортируем порт, на котором будет работать Nginx
EXPOSE 80

# Команда для запуска Nginx
CMD ["nginx", "-g", "daemon off;"]