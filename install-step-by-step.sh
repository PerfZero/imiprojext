#!/bin/bash

set -e

export DEBIAN_FRONTEND=noninteractive

STEP=${1:-all}

if [ "$STEP" = "all" ] || [ "$STEP" = "1" ]; then
    echo "=== ЭТАП 1: Установка базового ПО ==="
    apt-get update -qq
    apt-get install -y -qq curl git build-essential python3 nginx
    echo "✅ Этап 1 завершен"
fi

if [ "$STEP" = "all" ] || [ "$STEP" = "2" ]; then
    echo "=== ЭТАП 2: Установка Node.js ==="
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
    apt-get install -y -qq nodejs
    npm install -g pm2
    echo "✅ Node.js: $(node --version)"
    echo "✅ npm: $(npm --version)"
    echo "✅ PM2: $(pm2 --version)"
    echo "✅ Этап 2 завершен"
fi

if [ "$STEP" = "all" ] || [ "$STEP" = "3" ]; then
    echo "=== ЭТАП 3: Клонирование проекта ==="
    cd /root
    if [ -d "imiprojext" ]; then
        echo "⚠️  Обновляю существующий проект..."
        cd imiprojext
        git pull
    else
        git clone https://github.com/PerfZero/imiprojext.git
    fi
    echo "✅ Этап 3 завершен"
fi

if [ "$STEP" = "all" ] || [ "$STEP" = "4" ]; then
    echo "=== ЭТАП 4: Настройка сервера ==="
    cd /root/imiprojext/server
    
    if [ ! -f ".env" ]; then
        cat > .env << EOF
PORT=3000
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
DB_FILE_NAME=./data/app.db
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=$(openssl rand -base64 16)
EOF
    fi
    
    echo "📦 Устанавливаю зависимости сервера..."
    npm install --no-progress --silent || npm install
    
    mkdir -p data
    
    echo "🔨 Собираю сервер..."
    npm run build
    
    echo "🚀 Запускаю сервер..."
    pm2 delete imi-server 2>/dev/null || true
    pm2 start dist/index.js --name imi-server
    pm2 save
    
    echo "✅ Этап 4 завершен"
fi

if [ "$STEP" = "all" ] || [ "$STEP" = "5" ]; then
    echo "=== ЭТАП 5: Сборка фронтенда ==="
    cd /root/imiprojext/client
    
    echo "📦 Устанавливаю зависимости фронтенда..."
    npm install --no-progress --silent || npm install
    
    echo "🔨 Собираю фронтенд..."
    npm run build
    
    echo "✅ Этап 5 завершен"
fi

if [ "$STEP" = "all" ] || [ "$STEP" = "6" ]; then
    echo "=== ЭТАП 6: Настройка Nginx ==="
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
    
    if nginx -t > /dev/null 2>&1; then
        systemctl restart nginx
        echo "✅ Nginx настроен и перезапущен"
    else
        echo "❌ Ошибка в конфигурации Nginx!"
        nginx -t
        exit 1
    fi
    
    echo "✅ Этап 6 завершен"
fi

if [ "$STEP" = "all" ]; then
    echo ""
    echo "🎉 Установка завершена!"
    echo "🌐 Приложение доступно: http://$(hostname -I | awk '{print $1}')"
    echo ""
    echo "⚠️  Выполните: pm2 startup"
fi

