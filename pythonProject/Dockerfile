# Dockerfile для Flask
FROM python:3.9-slim

# Установка зависимостей
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код приложения
COPY . .

# Экспортируем порт, на котором будет работать Flask
EXPOSE 5000

# Команда для запуска приложения
CMD ["flask", "run", "--host=0.0.0.0"]