import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@ldesign/device',
  description: '🔍 功能强大的设备信息检测库',

  // 基础配置
  base: '/device/',
  lang: 'zh-CN',

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '示例', link: '/examples/' },
      { text: '演示', link: '/playground/' },
      {
        text: '相关链接',
        items: [
          { text: 'GitHub', link: 'https://github.com/poly1603/ldesign-device' },
          { text: 'NPM', link: 'https://www.npmjs.com/package/@ldesign/device' },
          { text: 'LDesign', link: 'https://ldesign.dev' },
        ],
      },
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
          ],
        },
        {
          text: '核心概念',
          items: [
            { text: '设备类型检测', link: '/guide/device-detection' },
            { text: '屏幕方向检测', link: '/guide/orientation-detection' },
            { text: '响应式监听', link: '/guide/reactive-listening' },
          ],
        },
        {
          text: 'Vue 集成',
          items: [
            { text: 'Composition API', link: '/guide/vue-composition' },
            { text: '组件', link: '/guide/vue-components' },
            { text: '指令', link: '/guide/vue-directives' },
            { text: '插件', link: '/guide/vue-plugin' },
          ],
        },
      ],
      '/api/': [
        {
          text: '核心 API',
          items: [
            { text: '概览', link: '/api/' },
            { text: '设备检测器', link: '/api/device-detector' },
            { text: '特性检测器', link: '/api/feature-detector' },
            { text: '工具函数', link: '/api/utils' },
          ],
        },
        {
          text: 'Vue API',
          items: [
            { text: 'Composition API', link: '/api/vue-composition' },
            { text: '组件', link: '/api/vue-components' },
            { text: '指令', link: '/api/vue-directives' },
          ],
        },
      ],
      '/examples/': [
        {
          text: '基础示例',
          items: [
            { text: '概览', link: '/examples/' },
            { text: '设备检测', link: '/examples/device-detection' },
            { text: '响应式布局', link: '/examples/responsive-layout' },
          ],
        },
      ],
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/poly1603/ldesign-device' },
    ],

    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 LDesign Team',
    },

    // 搜索
    search: {
      provider: 'local',
    },
  },

  // Markdown 配置
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
  },

  // Vite 配置
  vite: {
    resolve: {
      alias: {
        '@ldesign/device': '../src',
      },
    },
  },
})
