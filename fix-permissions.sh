#!/bin/bash

echo "🔧 Исправление прав доступа для Nginx..."

chmod -R 755 /root/imiprojext/client/dist
chmod -R 755 /root/imiprojext

chown -R www-data:www-data /root/imiprojext/client/dist 2>/dev/null || chmod -R o+r /root/imiprojext/client/dist

echo "✅ Права доступа исправлены"
echo "🔄 Перезапускаю Nginx..."
systemctl restart nginx

echo "✅ Готово! Проверьте: http://$(hostname -I | awk '{print $1}')"
