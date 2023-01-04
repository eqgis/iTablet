
注意：
* Step 1:
在"RCTJCoreModule.m" 添加下面代码
```
/*
- (NSArray<NSString *> *)supportedEvents
{
    return @[
             ];
}
*/
```
* Step 2:
在“logging.cc”中“inline void LogDestination::SetLogDestination(LogSeverity severity,
					      const char* base_filename)”方法添加如下代码

```
/*
//  assert(severity >= 0 && severity < NUM_SEVERITIES);
 if(!(severity >= 0 && severity < NUM_SEVERITIES) ){
        return;
    }
*/
```
* Step 3:
RCTBridge.m新增bundle加载接口
```
- (void)executeSourceCode:(NSData *)sourceCode
                     sync:(BOOL)sync
{
  [self.batchedBridge executeSourceCode:sourceCode sync:sync];
}
```
RCTBridge.h新增接口
```
- (void)executeSourceCode:(NSData *)sourceCode
                     sync:(BOOL)sync;
```
