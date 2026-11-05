<template>
  <div class="head">
    <div class="left">
      <span>{{ name }}</span>
      <span class="version">{{ version }}</span>
    </div>
    <div class="right">
      <el-tag type="info">运营</el-tag>
      <el-avatar />
      <div class="cursion">登录</div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineOptions({
  name: 'ViewHead'
})

const version = __APP_VERSION__
const name = __APP_NAME__

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

</style>
