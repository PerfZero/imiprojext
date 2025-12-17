#!/bin/bash

echo "🔍 Диагностика проблемы 500 Internal Server Error"
echo ""

echo "1️⃣ Проверка статуса PM2:"
pm2 status
echo ""

echo "2️⃣ Проверка логов сервера:"
pm2 logs imi-server --lines 30 --nostream
echo ""

echo "3️⃣ Проверка работы API напрямую:"
curl -v http://localhost:3000/api/docs.json 2>&1 | head -20
echo ""

echo "4️⃣ Проверка логов Nginx (последние ошибки):"
tail -30 /var/log/nginx/error.log
echo ""

echo "5️⃣ Проверка конфигурации Nginx:"
nginx -t
echo ""

echo "6️⃣ Проверка доступности порта 3000:"
netstat -tlnp | grep 3000 || ss -tlnp | grep 3000
echo ""

echo "7️⃣ Проверка прав доступа к файлам:"
ls -la /root/imiprojext/client/dist/ | head -10
echo ""

echo "8️⃣ Проверка конфигурации Nginx:"
cat /etc/nginx/sites-available/imiprojext | head -20

