import { createApp, Vue } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

Vue.config.devtools = true;

const app = createApp(App)

app.use(router)

app.mount('#app')
