# Настройка API для мобильного приложения

## Важно!

В мобильном приложении нужно указать правильный IP-адрес вашего сервера.

## Как узнать IP-адрес сервера?

### На компьютере (Mac/Linux):
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### На компьютере (Windows):
```bash
ipconfig
```

Ищите IP-адрес в локальной сети (обычно начинается с 192.168.x.x или 10.x.x.x)

## Где изменить IP-адрес?

### Вариант 1: Через переменную окружения (рекомендуется)

Создайте файл `.env` в папке `client`:

```env
VITE_API_URL=http://ВАШ_IP_АДРЕС:3000
```

Например:
```env
VITE_API_URL=http://192.168.1.100:3000
```

После этого пересоберите проект:
```bash
npm run build
npm run cap:sync
```

### Вариант 2: Изменить в коде

Откройте файл `client/src/utils/apiConfig.js` и измените IP-адрес:

```javascript
if (window.Capacitor?.isNativePlatform()) {
    return 'http://ВАШ_IP_АДРЕС:3000';  // Замените на ваш IP
}
```

Также измените в файле `client/src/lib/auth-client.ts`:

```typescript
if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform()) {
    return 'http://ВАШ_IP_АДРЕС:3000';  // Замените на ваш IP
}
```

После изменений:
```bash
npm run build
npm run cap:sync
```

## Для продакшена

Если у вас есть домен (например, imiclub.pro), используйте его:

```env
VITE_API_URL=https://imiclub.pro
```

Или в коде:
```javascript
return 'https://imiclub.pro';
```

## Проверка

1. Убедитесь, что сервер запущен и доступен по указанному адресу
2. Убедитесь, что телефон и компьютер в одной сети Wi-Fi
3. Пересоберите APK в Android Studio

## Важно для сервера

Убедитесь, что на сервере разрешены запросы с мобильного приложения. Проверьте файл `server/src/app.ts` - там должен быть ваш IP-адрес в списке `allowedOrigins`.

