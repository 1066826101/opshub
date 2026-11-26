<template>
  <el-sub-menu v-if="object['children'] && object['children'].length > 0" :index="object['index']">
    <template #title>
      <el-icon>
        <component :is="object['icon']" />
      </el-icon>
      <span>{{ object['title'] }}</span>
    </template>
    <menu-item v-for="item in object['children']" :key="item['index']" :object="item" />
  </el-sub-menu>
  <el-menu-item v-else :index="object['index']" @click="menuClick(object)">
    <template #title>
      <el-icon>
        <component :is="object['icon']" />
      </el-icon>
      <span>{{ object['title'] }}</span>
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import type { MenuItemProp } from '@/types/menuItem.ts'
import { useRouter, useRoute } from 'vue-router'
import {menuStore} from "@/stores/modules/menu.ts";
defineOptions({
  name: 'MenuItem'
})

defineProps<{
  object: MenuItemProp
}>()

const router = useRouter()
const route = useRoute()
const menuS = menuStore()
const menuClick = (menu: MenuItemProp) => {
  router.push(menu['path'] || '')
  menuS.addTabs({
    ...menu,
    name: String(menu['index']),
    route: {
      ...route
    }
  })
}

</script>

<style scoped>

.el-menu-item.is-active {
  background: #263445;
}

.el-menu-item.is-active .el-icon {
  color: #409eff;
}

</style>
