import { defineStore } from 'pinia'
import type {MenuItemProp, tabsProp} from '@/types/menuItem.ts'
import {ref} from 'vue'
import { useUserStore } from '@/stores/modules/user.ts'
import { menus } from '@/api/user/index.ts'
import {REQUEST_CODE} from "@/constants/request.ts";

export const menuStore = defineStore('menu', () => {
    const userStore = useUserStore()
    const menuArr = ref<MenuItemProp[]>([])

    const tabsArr= ref<tabsProp[]>([])

    const getMenu = async () => {
        console.log(userStore.user, '---')
        const res = await menus(userStore.user || { role: 'guest' })
        if(res['code'] === REQUEST_CODE.success) {
            menuArr.value = res['data'] || []
        }
    }

    const addTabs = (object: tabsProp) => {
        const index = tabsArr.value.findIndex(item => {
            return item['name'] === object['name']
        })
        if(index === -1) {
            tabsArr.value.push(object)
        } else {
            tabsArr.value[index] = {
                ...object
            }
        }
        // 选中最后一个
        setTabCheck(object)
    }

    const deleteTab = (object: tabsProp) => {
        const index = tabsArr.value.findIndex(item => {
            return item['name'] === object['name']
        })
        if(index !== -1) {
            const isCheck = tabsArr.value[index]['isCheck'] === true
            tabsArr.value.splice(index, 1)
            if(isCheck && tabsArr.value.length > 0) {
                // 选中最后一个
                setTabCheck(tabsArr.value[tabsArr.value.length - 1])
            }
        }
    }

    const setTabCheck = (object: tabsProp) => {
        tabsArr.value.forEach(item => {
            item['isCheck'] = item['name'] === object['name']
        })
    }

    const clearTab = () => {
        tabsArr.value = []
    }

    return {
        menuArr,
        getMenu,
        tabsArr,
        addTabs,
        deleteTab,
        setTabCheck,
        clearTab
    }
})
