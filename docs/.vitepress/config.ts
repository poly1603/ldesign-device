import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@ldesign/device',
  description: '现代化的设备信息检测库，深度集成 Vue 3',
  lang: 'zh-CN',

  themeConfig: {
    logo: '📱',

    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API 参考', link: '/api/' },
      { text: '示例', link: '/examples/' },
      { text: '更新日志', link: '/CHANGELOG' },
      {
        text: '相关链接',
        items: [
          { text: 'GitHub', link: 'https://github.com/ldesign/device' },
          { text: 'NPM', link: 'https://www.npmjs.com/package/@ldesign/device' },
          { text: 'Playground', link: 'https://stackblitz.com/edit/ldesign-device' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '快速参考', link: '/guide/quick-reference' },
            { text: '安装配置', link: '/guide/configuration' },
            { text: '核心概念', link: '/guide/index' }
          ]
        },
        {
          text: '核心功能',
          items: [
            { text: '设备检测', link: '/guide/device-detection' },
            { text: '事件系统', link: '/guide/events' },
            { text: '模块系统', link: '/guide/modules' }
          ]
        },
        {
          text: '功能模块',
          items: [
            { text: '电池状态', link: '/guide/battery-module' },
            { text: '网络状态', link: '/guide/network-module' },
            { text: '地理位置', link: '/guide/geolocation-module' }
          ]
        },
        {
          text: '示例和实践',
          items: [
            { text: '示例总览', link: '/guide/examples-overview' },
            { text: '最佳实践', link: '/guide/best-practices' },
            { text: '性能优化', link: '/guide/performance' },
            { text: '常见问题', link: '/guide/faq' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 文档',
          items: [
            { text: '概览', link: '/api/' },
            { text: '类型定义', link: '/api/types' }
          ]
        },
        {
          text: '核心 API',
          items: [
            { text: 'DeviceDetector', link: '/api/device-detector' },
            { text: 'EventEmitter', link: '/api/event-emitter' },
            { text: 'ModuleLoader', link: '/api/module-loader' }
          ]
        },
        {
          text: '功能模块',
          items: [
            { text: 'BatteryModule', link: '/api/battery-module' },
            { text: 'NetworkModule', link: '/api/network-module' },
            { text: 'GeolocationModule', link: '/api/geolocation-module' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例',
          items: [
            { text: '示例总览', link: '/examples/' },
            { text: '响应式设计', link: '/examples/responsive' },
            { text: '电池状态', link: '/examples/battery' },
            { text: '网络状态', link: '/examples/network' },
            { text: '地理位置', link: '/examples/geolocation' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ldesign/device' }
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024-present ldesign'
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },

    editLink: {
      pattern: 'https://github.com/ldesign/device/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    langMenuLabel: '多语言'
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#4facfe' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'og:site_name', content: '@ldesign/device' }],
    ['meta', { name: 'og:image', content: 'https://via.placeholder.com/1200x630/4facfe/ffffff?text=@ldesign/device' }]
  ],

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  }
})


