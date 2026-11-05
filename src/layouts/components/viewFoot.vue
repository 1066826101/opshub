<template>
  <el-tabs
      style="width: 100%"
      v-model="editableTabsValue"
      type="card"
      closable
      @tab-remove="removeTab"
      @tab-click="tabClick"
  >
    <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :closable="editableTabs.length > 1"
        :label="item.title"
        :name="item.name"
    />
  </el-tabs>
</template>

<script setup lang="ts">
import {computed, watch, ref} from 'vue'
import type { TabPaneName, TabsPaneContext } from 'element-plus'
import { menuStore } from '@/stores/modules/menu.ts'
import { useRouter } from 'vue-router'
defineOptions({
  name: 'ViewFoot'
})

const tabsStore = menuStore()
const router = useRouter()

const editableTabsValue = ref('')
const editableTabs = tabsStore.tabsArr

const activeTab = computed(() => {
  return editableTabs.find(item => {
    return item['isCheck']
  })
})

watch(
    activeTab,
    () => {
      editableTabsValue.value = String(activeTab.value?.name)
    },
    { immediate: true }
)

const removeTab = (targetName: TabPaneName) => {
  const object = editableTabs.find(item => {
    return item['name'] === targetName
  })
  if(object) {
    tabsStore.deleteTab(object)
  }
  if(activeTab.value) {
    router.push({
      ...activeTab.value['route']
    })
  }
}

const tabClick = (tab: TabsPaneContext) => {
  const object = editableTabs.find(item => {
    return item['name'] === tab.paneName
  })
  if(!object) {
    return
  }
  tabsStore.setTabCheck(object)
  router.push({
    ...object['route']
  })
}
</script>

<style scoped>

:deep(.el-tabs__header) {
  margin-bottom: 0;
  border: none;
}

:deep(.el-tabs__header .el-tabs__nav) {
  border: none;
  border-radius: 0;
}

:deep(.el-tabs__item),
:deep(.el-tabs__item .el-icon) {
  color: #FFF;
}

:deep(.el-tabs__header .el-tabs__item:first-child) {
  border-left: 1px solid #FFF;
}

:deep(.el-tabs__header .el-tabs__item) {
  border: 1px solid #FFF;
  margin: 0 10px 0 0;
  border-radius: 4px;
}

</style>
