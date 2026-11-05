<template>
  <div class="layout">
    <el-container class="layout-container">
      <el-header>
        <ViewHead />
      </el-header>
      <el-container>
        <el-splitter lazy>
          <el-splitter-panel :size="size" :min="min" :max="max" @update:size="resizeEnd">
            <Menu :arr="menuS.menuArr" />
          </el-splitter-panel>
          <el-splitter-panel>
            <el-main>
              <router-view />
            </el-main>
          </el-splitter-panel>
        </el-splitter>
      </el-container>
      <el-footer>
        <ViewFoot />
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import ViewHead from './components/viewHead.vue'
import Menu from './components/menu.vue'
import ViewFoot from './components/viewFoot.vue'
import {computed, ref, watch} from 'vue'
import { MENU_MIN_WIDTH, MENU_MAX_WIDTH } from '@/constants/layout.ts'
import { menuStore } from '@/stores/modules/menu.ts'
import { useRoute }from 'vue-router'
import { findMenu } from './utils/index.ts'

defineOptions({
  name: 'Layout'
})

const size = ref(Number(localStorage.getItem('menuWidth') || '0') || MENU_MIN_WIDTH)

const route = useRoute()
const menuS = menuStore()

const min = computed(() => {
  return MENU_MIN_WIDTH
})
const max = computed(() => {
  return MENU_MAX_WIDTH
})
const resizeEnd = (size: number) => {
  localStorage.setItem('menuWidth', size.toString())
}

watch(
    () => route.fullPath,
    () => {
      const menu = findMenu(menuS.menuArr, route.path)
      if(!menu) {
        return
      }
      menuS.addTabs({
        ...menu,
        name: String(menu['index']),
        route: {
          ...route
        }
      })
    },
    { immediate: true }
)
</script>

<style scoped>

.layout, .layout-container {
  width: 100%;
  height: 100%;
}

.el-header {
  background: #1f2d3d;
}

:deep(.el-splitter-bar .el-splitter-bar__dragger:before),
:deep(.el-splitter-bar .el-splitter-bar__dragger:after) {
  background-color: #1f2d3d;
}

.el-footer {
  display: flex;
  align-items: center;
  padding: 2px 10px;
  background: #1f2d3d;
}

</style>
