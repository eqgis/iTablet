开发模式：
-------
iTablet小插件开发需要修改以下文件
1. iTablet小插件添加到首页

   在 [iTablet/configs/mapModules/index.js](../../configs/mapModules/index.js)
   
   添加import：
   ```javascript
   import { ExhibitionModule } from '../../applets/exhibition/src/mapModules'
   ```

   在 mapModules 中添加 ExhibitionModule
   ```javascript
   const mapModules = [
      ..., //其他模块
      ExhibitionModule,
      ]
   ```

2. 添加 Toolbar 开发的 typescript

   在 [iTablet/src/Toolbar/modules/index.ts](../../src/Toolbar/modules/index.ts)

   添加import：
   ```javascript
   import { EXHIBITION } from '../../../applets/exhibition/src/toolbarModules/exhibition'
   ```

   ModuleList 类型后面添加 EXHIBITION 类型
   ```javascript
   export type ModuleList = ARSANDTABLE
                       & ... //其他模块类型
                       & EXHIBITION
   ```

   
 发布模式：
 --------
 发布时务必删除以上添加
