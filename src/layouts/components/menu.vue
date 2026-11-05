<template>
  <div class="menu">
    <el-menu
        active-text-color="#FFF"
        background-color="#304156"
        text-color="#bfcbd9"
        :default-active="defaultActive"
    >
      <MenuItem v-for="item in arr" :key="item['index']" :object="item" />
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import MenuItem from './menuItem.vue'
import type { MenuItemProp } from '@/types/menuItem.ts'
import {computed} from 'vue'
import { useRoute } from 'vue-router'
import { findMenu } from '../utils/index.ts'

const props = withDefaults(defineProps<{
  arr: MenuItemProp[]
}>(), {
  arr: () => {
    return []
  }
})

const route = useRoute()

const defaultActive = computed(() => {
  const menu = findMenu(props.arr, route.path)
  return menu ? String(menu.index) : ''
})

</script>

<style scoped>
.menu {
  height: 100%;
  background: #304156;
}
</style>
