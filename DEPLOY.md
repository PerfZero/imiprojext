# Инструкция по настройке для продакшена imiclub.pro

## 1. DNS настройки на reg.ru

В панели управления reg.ru для домена `imiclub.pro` нужно настроить DNS записи:

### A-запись (основная)
- **Тип:** A
- **Имя:** @ (или пустое)
- **Значение:** IP-адрес вашего сервера
- **TTL:** 3600 (по умолчанию)

### CNAME для www (опционально)
- **Тип:** CNAME
- **Имя:** www
- **Значение:** @ (или imiclub.pro)
- **TTL:** 3600

## 2. Настройка веб-сервера (nginx)

Пример конфигурации nginx для `/etc/nginx/sites-available/imiclub.pro`:

```nginx
server {
    listen 80;
    server_name imiclub.pro www.imiclub.pro;

    location / {
        root /root/imiprojext/client/dist;
        try_files $uri $uri/ /index.html;
    }

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
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /socket {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

После создания конфигурации:
```bash
sudo ln -s /etc/nginx/sites-available/imiclub.pro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 3. SSL сертификат (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d imiclub.pro -d www.imiclub.pro
```

Certbot автоматически обновит конфигурацию nginx для HTTPS.

## 4. Переменные окружения

### Сервер (.env в папке server/)
```env
PORT=3000
BETTER_AUTH_SECRET=ваш-секретный-ключ-для-продакшена
NODE_ENV=production
```

### Клиент (опционально, если нужен отдельный API URL)
Создать `.env.production` в папке client/:
```env
VITE_API_URL=https://imiclub.pro
```

## 5. Запуск приложения

### Backend (PM2)
```bash
cd /root/imiprojext/server
npm run build
pm2 start dist/index.js --name imi-server
pm2 save
```

### Frontend
После сборки фронтенд будет в `client/dist/` и обслуживаться через nginx.

## 6. Проверка

После настройки проверьте:
- `https://imiclub.pro` - открывается фронтенд
- `https://imiclub.pro/api/docs` - доступна документация API
- Авторизация работает корректно

## 7. Обновление через Git

Приложение автоматически обновляется через GitHub Actions при push в main ветку (см. `.github/workflows/deploy.yml`).

Или вручную:
```bash
cd /root/imiprojext
git pull origin main
cd server && npm install && npm run build
cd ../client && npm install && npm run build
pm2 restart imi-server
```
