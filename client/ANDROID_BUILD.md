# Инструкция по сборке APK для Android

## Требования

1. **Node.js** версии 20.19.0 или выше (или 22.12.0+)
2. **Android Studio** с установленным Android SDK
3. **Java Development Kit (JDK)** версии 11 или выше

## Установка зависимостей

```bash
cd client
npm install
```

## Сборка приложения

### Шаг 1: Сборка веб-версии

```bash
npm run build
```

Эта команда создаст папку `dist` с собранными файлами.

### Шаг 2: Синхронизация с Android проектом

```bash
npm run cap:sync
```

Или используйте комбинированную команду:

```bash
npm run android:build
```

### Шаг 3: Открытие проекта в Android Studio

```bash
npm run cap:open:android
```

Или вручную откройте папку `android` в Android Studio.

## Сборка APK в Android Studio

1. Откройте проект в Android Studio
2. Дождитесь завершения индексации и синхронизации Gradle
3. Выберите **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
4. После сборки APK файл будет находиться в:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

## Сборка подписанного APK для релиза

### Создание keystore

```bash
keytool -genkey -v -keystore imi-club-release.keystore -alias imi-club -keyalg RSA -keysize 2048 -validity 10000
```

### Настройка подписи в Android Studio

1. Откройте `android/app/build.gradle`
2. Добавьте конфигурацию signingConfigs:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('path/to/imi-club-release.keystore')
            storePassword 'your-store-password'
            keyAlias 'imi-club'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

3. Выберите **Build** → **Generate Signed Bundle / APK**
4. Выберите **APK** и следуйте инструкциям

## Настройка API сервера для мобильного приложения

Для работы с API в мобильном приложении необходимо:

1. Убедиться, что сервер доступен по сети (не только localhost)
2. Обновить URL API в конфигурации приложения
3. Настроить CORS на сервере для разрешения запросов с мобильного приложения

## Полезные команды

- `npm run build` - сборка веб-версии
- `npm run cap:sync` - синхронизация с нативными проектами
- `npm run cap:open:android` - открыть Android проект
- `npm run android:build` - сборка и синхронизация

## Решение проблем

### Ошибка "SDK location not found"
Убедитесь, что Android SDK установлен и путь к нему указан в переменных окружения.

### Ошибка при синхронизации
Удалите папку `android` и выполните:
```bash
npx cap add android
npm run cap:sync
```

### Проблемы с разрешениями
Проверьте файл `android/app/src/main/AndroidManifest.xml` на наличие необходимых разрешений.



