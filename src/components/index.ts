// 外部组件
import { setUpElementPlus } from './base/element-plus.ts'
import {setUpIcon} from './base/icons-vue.ts'

// 内部组件、业务组件
import { setUpBusiness } from './business/index.ts'

import type { App } from 'vue'

const arr = [
    setUpElementPlus,
    setUpIcon,
    setUpBusiness
]

export const setUpComponent = (app: App) => {
    arr.forEach(setUp => {
        setUp(app)
    })
}
