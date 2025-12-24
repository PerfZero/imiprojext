import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { loadSessionToken } from './utils/sessionStorage'

// Загружаем токен из хранилища перед монтированием приложения
loadSessionToken().then(() => {
    const app = createApp(App)
    app.use(router)
    app.mount('#app')
})
