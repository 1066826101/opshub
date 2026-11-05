import MyEcharts from './my-echarts.vue'
import type { App, Component } from 'vue'

const businessComponent: Record<string, Component> = {
    MyEcharts
}

export const setUpBusiness = (app: App) => {
    for (const appKey in businessComponent) {
        app.component(appKey, businessComponent[appKey])
    }
}
