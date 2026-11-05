import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import type { App } from 'vue'

export const setUpElementPlus = (app: App) => {
    app.use(ElementPlus)
}
