import type {MenuItemProp} from '@/types/menuItem.ts'

export const findMenu = (arr: MenuItemProp[], path: string): MenuItemProp | undefined => {
    for (const item of arr) {
        if(item.path && (path === item.path || path.startsWith(item.path + '/'))) {
            return item
        }
        if(item['children']) {
            const found = findMenu(item['children'], path)
            if (found) return found
        }
    }
    return undefined
}
