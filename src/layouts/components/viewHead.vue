<template>
  <div class="head">
    <div class="left">
      <span>{{ name }}</span>
      <span class="version">{{ version }}</span>
    </div>
    <div class="right">
      <el-tag v-if="userStore.isLogin" type="primary">{{ userStore.user?.['role'] }}</el-tag>
      <el-popover
          v-if="userStore.isLogin"
          placement="bottom-start"
      >
        <template #reference>
          <el-avatar />
          <div class="user-name">{{ userStore.user?.['userName'] }}</div>
        </template>
        <div v-for="item in feature" :key="item['id']" class="feature" @click="handle(item['id'])">
          <el-icon>
            <component :is="item['icon']"></component>
          </el-icon>
          <span>{{ item['name'] }}</span>
        </div>
      </el-popover>
      <div v-if="!userStore.isLogin" class="cursion" @click="toLogin">登录</div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useUserStore} from '@/stores/modules/user.ts'
import {menuStore} from '@/stores/modules/menu.ts'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'ViewHead'
})

const version = __APP_VERSION__
const name = __APP_NAME__
const feature = [
  {
    id: 'detail',
    icon: 'UserFilled',
    name: '个人信息'
  },
  {
    id: 'loginOut',
    icon: 'Avatar',
    name: '退出'
  }
]

const router = useRouter()
const userStore = useUserStore()
const menuS = menuStore()

const toLogin = () => {
  router.push('/login')
}

const handle = (id: string) => {
  if(id === 'loginOut') {
    userStore.loginOut()
    menuS.clearTab()
    toLogin()
  }
}

</script>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 55px;
}

.left {
  font-size: 18px;
  color: #FFF;
}

.left .version {
  margin-left: 10px;
}

.right {
  display: flex;
  align-items: center;
  color: #FFF;
}

.right .el-tag,
.right .el-avatar {
  margin-right: 10px;
}

.right .cursion {
  cursor: pointer;
}

.feature {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.feature:hover {
  background: #409eff;
}

.feature span {
  margin-left: 10px;
}

</style>
