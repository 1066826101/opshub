import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import { mockPlugin } from './mock/index.ts'

// package.json
const pkg = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
)

export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      mockPlugin(),
      checker({
        eslint: {
          lintCommand: 'eslint src',
          useFlatConfig: true,
        },
        // 顺便把类型错误也显示出来（可选，会慢一点）
        // vueTsc: true,
        overlay: {
          initialIsOpen: false,   // 不自动弹全屏遮罩，只显示角标
        }
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },

    // 把版本号作为全局常量注入到前端代码
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __APP_NAME__: JSON.stringify(pkg.name)
    },

    // 生产构建：用 terser 压缩，顺手删掉 console 和 debugger
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: command === 'build',
          drop_debugger: true
        }
      }
    }
  }
})
