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
import { useRouter } from 'vue-router'
defineOptions({
  name: 'MenuItem'
})

defineProps<{
  object: MenuItemProp
}>()

const router = useRouter()

const menuClick = (menu: MenuItemProp) => {
  router.push(menu['path'] || '')
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
