#!/bin/bash

set -e

echo "🚀 Начинаю установку всего необходимого на сервере..."

echo "📦 Обновляю систему..."
apt-get update

echo "📦 Устанавливаю базовые инструменты..."
apt-get install -y curl git build-essential python3 nginx

echo "📦 Устанавливаю Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "✅ Node.js установлен: $(node --version)"
echo "✅ npm установлен: $(npm --version)"

echo "📦 Устанавливаю PM2..."
npm install -g pm2

echo "✅ PM2 установлен: $(pm2 --version)"

echo "📦 Клонирую проект..."
cd /root
if [ -d "imiprojext" ]; then
    echo "⚠️  Папка imiprojext уже существует, обновляю..."
    cd imiprojext
    git pull
    cd server
else
    git clone https://github.com/PerfZero/imiprojext.git
    cd imiprojext/server
fi

echo "📝 Создаю .env файл..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
PORT=3000
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
DB_FILE_NAME=./data/app.db
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=$(openssl rand -base64 16)
EOF
    echo "✅ .env файл создан"
else
    echo "✅ .env файл уже существует"
fi

echo "📦 Устанавливаю зависимости..."
npm install

echo "📁 Создаю папку для данных..."
mkdir -p data

echo "🔨 Собираю проект..."
npm run build

echo "🚀 Запускаю сервер через PM2..."
pm2 delete imi-server 2>/dev/null || true
pm2 start dist/index.js --name imi-server
pm2 save

echo "📦 Собираю фронтенд..."
cd /root/imiprojext/client
npm install
npm run build

echo "📝 Настраиваю Nginx..."
cat > /etc/nginx/sites-available/imiprojext << 'NGINX_CONFIG'
server {
    listen 80;
    server_name _;

    root /root/imiprojext/client/dist;
    index index.html;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX_CONFIG

ln -sf /etc/nginx/sites-available/imiprojext /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo "✅ Сервер запущен!"
echo "✅ Фронтенд собран!"
echo "✅ Nginx настроен!"
echo ""
echo "🌐 Приложение доступно по адресу: http://$(hostname -I | awk '{print $1}')"
echo ""
echo "📊 Статус сервера: pm2 status"
echo "📋 Логи сервера: pm2 logs imi-server"
echo "🛑 Остановка: pm2 stop imi-server"
echo "🔄 Перезапуск: pm2 restart imi-server"
echo ""
echo "⚠️  Не забудьте выполнить: pm2 startup"
echo "   (и выполните команду, которую выведет PM2)"
