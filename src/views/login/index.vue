<template>
<div class="login">
  <div class="card">
    <div class="title">
      <div>OpsHub</div>
      <div>内容运营管理平台</div>
    </div>
    <el-form
        ref="ruleFormRef"
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
    >
      <el-form-item label="用户" prop="userName">
        <el-input v-model="ruleForm.userName" maxlength="10" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" show-password maxlength="10" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          登录
        </el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="login-tip">
      演示账号（三种角色菜单不同）：<br>
      <b>admin / 123456</b> — 超级管理员，全部权限<br>
      <b>operator / 123456</b> — 运营，不能审核<br>
      <b>auditor / 123456</b> — 审核员，只能审核
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { login } from '@/api/user/index.ts'
import { REQUEST_CODE } from '@/constants/request.ts'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { LoginResult, LoginParams } from '@/api/user/index.ts'
import type { ApiResult } from '@/types/http.ts'

defineOptions({
  name: 'Login'
})

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<LoginParams>({
  userName: '',
  password: ''
})

const rules = reactive<FormRules<LoginParams>>({
  userName: [
    {
      required: true, message: '请输入用户名称', trigger: 'change'
    }
  ],
  password: [
    {
      required: true, message: '请输入密码', trigger: 'change'
    }
  ]
})

const submitForm = () => {
  ruleFormRef.value?.validate(async (valid: boolean) => {
    if(!valid) {
      return
    }
    const res: ApiResult<LoginResult> = await login(ruleForm)
    if(res['code'] === REQUEST_CODE.success) {
      // 跳转
      ElMessage.success('登录成功')
    } else {
      ElMessage.error(res['message'])
    }
    console.log(res)
  })
}
const resetForm = () => {
  ruleFormRef.value?.resetFields()
}
</script>

<style scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg,#1f2d3d 0%,#2d4a68 55%,#3a6ea5 100%);
}

.card {
  padding: 20px;
  min-width: 300px;
  background: #FFF;
  border-radius: 4px;
}

.title {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 10px;
}

.title div:first-child {
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: 600;
}

.title div:last-child {
  font-size: 12px;
}

.login-tip {
  margin-top: 20px;
  padding: 10px 12px;
  background: #f4f8ff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  font-size: 12px;
  color: #5b7fa6;
}

</style>
