import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index.ts'
import pinia from '@/stores/index.ts'
import { setUpComponent } from '@/components/index.ts'
import '@/style/style.css'

const app = createApp(App)
app.use(pinia)
setUpComponent(app)
app.use(router)
app.mount('#app')
