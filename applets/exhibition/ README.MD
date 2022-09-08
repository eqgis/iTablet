开发模式：
iTablet小插件开发需要修改以下文件
1. iTablet小插件添加到首页
   在 iTablet/configs/mapModules/index.js 的 mapModules 中添加 ExhibitionModule

2. 添加 Toolbar 开发的 typescript
   在 iTablet/src/Toolbar/modules/index.ts 的 ModuleList 类型后面添加 EXHIBITION 类型
   
 发布模式：
 发布时务必删除以上添加
