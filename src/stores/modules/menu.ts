import { defineStore } from 'pinia'
import type {MenuItemProp, tabsProp} from '@/types/menuItem.ts'
import {reactive} from 'vue'

export const menuStore = defineStore('menu', () => {
    const menuArr: MenuItemProp[] = [
        {
            index: '1',
            title: '工作台',
            icon: 'HomeFilled',
            path: '/workbench'
        },
        {
            index: '2',
            title: '内容运营',
            icon: 'Histogram',
            children: [
                {
                    index: '2-1',
                    title: '内容管理',
                    icon: 'Comment',
                    path: '/contain/management'
                },
                {
                    index: '2-2',
                    title: '动态表单',
                    icon: 'Tools',
                    path: '/contain/myForm'
                },
                {
                    index: '2-3',
                    title: '审核管理',
                    icon: 'QuestionFilled',
                    path: '/contain/audit'
                }
            ]
        },
        {
            index: '3',
            title: '系统管理',
            icon: 'Tools',
            children: [
                {
                    index: '3-1',
                    title: '用户管理',
                    icon: 'Avatar',
                    path: '/user/management'
                },
                {
                    index: '3-2',
                    title: '角色管理',
                    icon: 'Avatar',
                    path: '/user/role'
                }
            ]
        }
    ]

    const tabsArr= reactive<tabsProp[]>([])

    const addTabs = (object: tabsProp) => {
        const index = tabsArr.findIndex(item => {
            return item['name'] === object['name']
        })
        if(index === -1) {
            tabsArr.push(object)
        } else {
            tabsArr[index] = {
                ...object
            }
        }
        // 选中最后一个
        setTabCheck(object)
    }

    const deleteTab = (object: tabsProp) => {
        const index = tabsArr.findIndex(item => {
            return item['name'] === object['name']
        })
        if(index !== -1) {
            const isCheck = tabsArr[index]['isCheck'] === true
            tabsArr.splice(index, 1)
            if(isCheck && tabsArr.length > 0) {
                // 选中最后一个
                setTabCheck(tabsArr[tabsArr.length - 1])
            }
        }
    }

    const setTabCheck = (object: tabsProp) => {
        tabsArr.forEach(item => {
            item['isCheck'] = item['name'] === object['name']
        })
    }

    return {
        menuArr,
        tabsArr,
        addTabs,
        deleteTab,
        setTabCheck
    }
})
