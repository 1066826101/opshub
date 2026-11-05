import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

export default defineConfigWithVueTs(
    // ---------- 检查哪些文件 ----------
    {
        name: 'app/files-to-lint',
        files: ['**/*.{ts,mts,tsx,vue}'],
    },

    // ---------- 忽略哪些目录 ----------
    {
        name: 'app/files-to-ignore',
        ignores: [
            '**/dist/**',
            '**/node_modules/**',
            '**/coverage/**',
            '**/public/**',
            '**/docs/**',
            '**/src/assets/**',
        ],
    },

    // ---------- Vue 官方基础规则 ----------
    pluginVue.configs['flat/essential'],

    // ---------- TypeScript 推荐规则 ----------
    vueTsConfigs.recommended,

    // ---------- 项目自定义 ----------
    {
        name: 'app/custom-rules',
        rules: {
            // ✅ 必须关掉！否则 Menu.vue / Index.vue 这种单词组件名会全部报错
            'vue/multi-word-component-names': 'off',

            // 禁止 any（对应你"写完不出现 any"的目标）
            '@typescript-eslint/no-explicit-any': 'warn',

            // 未使用变量：tsconfig 已经开了 noUnusedLocals，这里放宽一点
            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],

            // 统一 SFC 块顺序：script → template → style
            'vue/block-order': ['error', {
                order: [['script', 'template'], 'style'],
            }],

            // 模板里组件名用 PascalCase
            'vue/component-name-in-template-casing': ['error', 'PascalCase', {
                registeredComponentsOnly: true,   // 只检查本地 import 的组件
            }],

            // 允许 console
            'no-console': 'off'
        },
    },
)
