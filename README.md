
## 前言

此项目是个人练习项目, 基于 vue.js, 使用 vue-cli3 搭建, 引用 element-ui 组件库配合 sass 做样式, axios 交互数据, vue-router 做前端路由. 用 express 搭建了一个简单的后端服务器,只用于数据读写,数据的逻辑处理全部由 view model 完成.
之前用原生 JS 和 node 做了一个桌面应用[LnTimeline](https://github.com/LynnnNa/LnTimeline), 此项目就是对 LnTimeline 的重构

## 运行项目

```
git clone https://github.com/LynnnNa/lnjx-vue-express.git
cd lnjx-vue-express/server
npm install
cd ../
npm install
npm run dev
```
## 打包
```
npm run build
```
## 功能

- [ ] 时间轴展示
- [ ] 设置
- [x] 时间轴数据展示
- [x] 副本集添加删除
- [x] boss 添加删除
- [x] part 添加删除
- [x] part 格式验证
- [x] 保存
- [ ] 导入导出
- [ ] 快捷键设置
- [ ] 外观设置
- [x] 生活技能

## 项目结构
```

|-- vue.config.js',                           //项目配置
|-- public',
|   |-- index.html',						  
|   |-- pages', 			                  //多页
|       |-- timeline.html',					
|-- server',                                  //后端
|   |-- app.js',							  //express设置
|   |-- bin',
|   |   |-- www',							  //后端服务器入口
|   |-- public',
|   |   |-- data',
|   |   |   |-- default.json',				  //时间轴数据
|   |   |   |-- tutorial.json',				  //教程实例数据
|   |-- routes',
|       |-- savetimeline.js',				  //savetimeline接口
|-- src',
    |-- axiosData.js',						  //axios数据交互
    |-- store.js',							  //vuex
    |-- assets',
    |   |-- app.scss',						  //公共样式
    |-- components',						  
    |   |-- common',
    |   |   |-- mUtils.js',					 //公共方法
    |   |-- pages',
    |       |-- app.js',					 //程序入口
    |       |-- App.vue',					 //首页
    |       |-- setting',						
    |       |   |-- index.vue',			     //设置主页
    |       |   |-- AppearSetting.vue',      //皮肤设置tab
    |       |   |-- HotkeysSetting.vue',	 //快捷键设置tab
    |       |   |-- TimelineSetting',        
    |       |       |-- index.vue',          //时间轴设置tab
    |       |       |-- BossList.vue',		 //boss列表
    |       |       |-- BossParts.vue',      //part组件
    |       |       |-- FBName.vue',         //副本集列表
    |       |       |-- ImportExport.vue',   //导入导出
    |       |-- timeline',					
    |           |-- timeline.js',            
    |           |-- Timeline.vue',
    |-- router',
        |-- index.js',						//前端路由

```

## 部分截图

<img src="/appimg/setting.png?raw=true" alt="设置">
<img src="/appimg/jobber.png?raw=true" alt="成本">