#!/bin/bash

echo "🔍 Проверка работы сервера..."
echo ""

echo "1️⃣ Проверка PM2 процессов:"
pm2 status
echo ""

echo "2️⃣ Проверка логов сервера (последние 20 строк):"
pm2 logs imi-server --lines 20 --nostream
echo ""

echo "3️⃣ Проверка работы API:"
curl -s http://localhost:3000/docs.json | head -c 200
echo ""
echo ""

echo "4️⃣ Проверка Nginx:"
systemctl status nginx --no-pager | head -10
echo ""

echo "5️⃣ Проверка доступности через Nginx:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost/
echo ""

echo "6️⃣ Проверка портов:"
netstat -tlnp | grep -E ':(80|3000)' || ss -tlnp | grep -E ':(80|3000)'
echo ""

echo "✅ Проверка завершена!"
echo ""
echo "🌐 Откройте в браузере: http://$(hostname -I | awk '{print $1}')"
