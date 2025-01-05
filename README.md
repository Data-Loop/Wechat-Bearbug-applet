# 小熊虫小程序

一个基于微信小程序开发的多功能AI识别应用，集成了多种识别功能和互动体验。

## 主要功能模块

### 1. 首页 (index)
- 响应式布局设计
- 高级搜索系统
  - 双模式搜索（精确/模糊）
  - 实时搜索响应
  - 搜索结果动态重排
- 小熊虫弹射动画系统
- 功能导航卡片

### 2. 车辆识别 (car)
- 车型识别功能
- 品牌识别系统
- 车辆信息展示
- 历史记录保存

### 3. 动物识别 (dragon)
- 动物种类识别
- 特征信息展示
- 相似度分析
- 识别历史记录

### 4. 游戏界面 (game)
- 互动游戏系统
- 得分记录功能
- 动画效果展示
- 游戏状态管理

### 5. 人脸对比 (face)
- 人脸特征识别
- 相似度对比
- 多人脸检测
- 表情识别功能

### 6. 植物识别 (plant)
- 植物种类识别
- 详细信息展示
- 生长环境建议
- 识别历史记录

### 7. 文字识别 (word)
- OCR文字识别
- 多语言支持
- 文本提取功能
- 识别结果导出

## 技术实现

### 1. AI识别系统
- 图像识别API集成
- 实时识别处理
- 结果准确度优化
- 识别速度优化

### 2. 性能优化
- 图片资源预加载
- 识别请求优化
- 内存管理优化
- 缓存策略实现

## 项目结构

### 目录说明

#### pages 目录
- **index/** - 首页模块，包含主要导航和搜索功能
- **car/** - 车辆识别模块，提供车型识别功能
- **dragon/** - 动物识别模块，提供动物识别功能
- **game/** - 游戏模块，提供互动游戏功能
- **face/** - 人脸对比模块，提供人脸识别功能
- **plant/** - 植物识别模块，提供植物识别功能
- **word/** - 文字识别模块，提供OCR功能

#### 核心文件
- **app.js** - 应用入口，包含全局配置和API密钥
- **app.json** - 应用配置，定义页面路由和全局设置
- **app.wxss** - 全局样式，定义通用样式规则

#### 工具目录
- **utils/** - 存放公共工具函数和通用方法

```tree
project/
├── pages/
│ ├── index/ # 首页
│ │ ├── index.js # 首页逻辑
│ │ ├── index.wxml # 首页结构
│ │ └── index.wxss # 首页样式
│ │
│ ├── car/ # 车辆识别
│ │ ├── car.js # 识别逻辑
│ │ ├── car.wxml # 界面布局
│ │ └── car.wxss # 页面样式
│ │
│ ├── dragon/ # 动物识别
│ │ ├── dragon.js # 识别逻辑
│ │ ├── dragon.wxml # 界面布局
│ │ └── dragon.wxss # 页面样式
│ │
│ ├── game/ # 游戏界面
│ │ ├── game.js # 游戏逻辑
│ │ ├── game.wxml # 游戏界面
│ │ └── game.wxss # 游戏样式
│ │
│ ├── face/ # 人脸对比
│ │ ├── face.js # 对比逻辑
│ │ ├── face.wxml # 界面布局
│ │ └── face.wxss # 页面样式
│ │
│ ├── plant/ # 植物识别
│ │ ├── plant.js # 识别逻辑
│ │ ├── plant.wxml # 界面布局
│ │ └── plant.wxss # 页面样式
│ │
│ └── word/ # 文字识别
│ ├── word.js # 识别逻辑
│ ├── word.wxml # 界面布局
│ └── word.wxss # 页面样式
│
├── app.js # 应用入口
├── app.json # 应用配置
└── app.wxss # 全局样式
```

## 核心功能实现

### 1. 图像识别处理
// 通用识别函数
async function recognize(imageData, type) {
try {
const result = await wx.cloud.callFunction({
name: 'aiRecognition',
data: {
type: type,
image: imageData
}
});
return result.data;
} catch (error) {
console.error('识别失败:', error);
throw error;
}
}

### 2. 识别结果展示
showResult(result) {
this.setData({
recognitionResult: result,
showResultView: true
});
}


## 开发环境要求

- 微信开发者工具 v1.06.2405020+
- 微信小程序基础库 2.x+
- Node.js v12+

## 注意事项

1. API使用
- 配置正确的API密钥
- 注意API调用限制
- 处理超时情况

2. 性能优化
- 压缩上传图片
- 优化识别请求
- 合理使用缓存

3. API 密钥有效期为一个月
- 请及时更新过期的 API 密钥
- 建议设置密钥到期提醒
- 请勿泄露 API 密钥信息

## 后续计划

1. 功能扩展
- [ ] 增加更多识别类型
- [ ] 优化识别准确度
- [ ] 添加批量识别功能

2. 性能优化
- [ ] 提高识别速度
- [ ] 优化内存使用
- [ ] 改进缓存策略

## 版本历史

- v1.0.0 (2024-01-20)
  - 初始版本发布
  - 实现基础识别功能


## 致谢

感谢所有贡献者的支持。

## API 配置说明

本项目使用百度云 AI 接口，需要配置以下 API：

### 百度云 API 配置
1. **人脸识别 API**
   - 有效期：一个月
   - 配置位置：`app.js` 中 `globalData`
   - 到期后需要在百度云控制台更新

2. **文字识别 API**
   - 有效期：一个月
   - 配置位置：`app.js` 中 `globalData`
   - 到期后需要在百度云控制台更新

3. **图像识别 API**
   - 有效期：一个月
   - 配置位置：`app.js` 中 `globalData`
   - 到期后需要在百度云控制台更新

### API 配置示例
```javascript
// app.js
App({
  globalData: {
    // 百度云 API 配置
    baiduAPI: {
      face: 'your_face_api_key',
      ocr: 'your_ocr_api_key',
      image: 'your_image_api_key'
    }
  }
})
```
