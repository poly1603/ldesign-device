# @ldesign/device TypeScript 示例

这个示例展示了如何充分利用 TypeScript 的类型系统来使用 `@ldesign/device` 库。

## 特点

- ✅ 完整的 TypeScript 类型支持
- ✅ 类型守卫和类型安全
- ✅ 严格的类型检查
- ✅ 智能代码提示
- ✅ 编译时错误检测

## 运行示例

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 预览
pnpm preview
```

## 示例内容

### 1. 基础设备检测
展示如何获取和使用完整类型的设备信息。

### 2. 类型守卫
演示如何使用类型守卫进行类型安全的设备判断。

```typescript
function isMobileDevice(type: DeviceType): type is 'mobile' {
  return type === 'mobile'
}
```

### 3. 事件监听
类型安全的事件监听和处理。

### 4. 动态模块加载
展示如何动态加载和使用扩展模块。

### 5. 性能监控
测量和展示库的性能表现。

### 6. 自定义配置
类型安全的配置选项使用。

## TypeScript 配置亮点

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true
  }
}
```

启用了最严格的类型检查，确保代码质量。

## 学习要点

1. **类型定义** - 充分利用 TypeScript 的类型系统
2. **类型守卫** - 编写类型安全的判断逻辑
3. **泛型使用** - 在需要时使用泛型提高灵活性
4. **类型推断** - 让 TypeScript 自动推断类型
5. **严格模式** - 在严格模式下编写更安全的代码

## 许可证

MIT


