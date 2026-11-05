import type {  RouteLocationNormalizedLoaded } from 'vue-router'
export interface MenuItemProp {
    index: string | number,
    title: string,
    icon: string,
    path?: string,
    children?: MenuItemProp[]
}

export interface tabsProp {
    title: string,
    name: string | number,
    isCheck?: boolean,
    closable?: boolean,
    route: RouteLocationNormalizedLoaded
}
