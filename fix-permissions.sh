#!/bin/bash

echo "🔧 Исправление прав доступа для Nginx..."

chmod 755 /root
chmod 755 /root/imiprojext
chmod 755 /root/imiprojext/client
chmod -R 755 /root/imiprojext/client/dist

chown -R www-data:www-data /root/imiprojext/client/dist 2>/dev/null || {
    echo "⚠️  Не удалось изменить владельца, используем альтернативный метод..."
    chmod -R o+rx /root
    chmod -R o+rx /root/imiprojext
    chmod -R o+rx /root/imiprojext/client
    chmod -R o+rx /root/imiprojext/client/dist
}

echo "✅ Права доступа исправлены"
echo "🔄 Перезапускаю Nginx..."
systemctl restart nginx

echo "✅ Готово! Проверьте: http://$(hostname -I | awk '{print $1}')"
