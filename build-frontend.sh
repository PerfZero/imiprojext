#!/bin/bash

echo "🔨 Сборка фронтенда..."

cd /root/imiprojext/client

echo "📦 Обновляю проект..."
git pull

echo "📦 Устанавливаю зависимости..."
npm install

echo "🔨 Собираю фронтенд..."
npm run build

echo "✅ Фронтенд собран!"
echo "📁 Файлы находятся в: /root/imiprojext/client/dist"

echo "🔄 Перезапускаю Nginx..."
systemctl restart nginx

echo "✅ Готово!"

