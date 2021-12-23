//
//  NativeUtil.m
//  iTablet
//
//  Created by Shanglong Yang on 2018/12/12.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "NativeMethod.h"
#import "AppInfo.h"

@implementation NativeMethod
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(getTemplates, getTemplatesByUserName:(NSString *)userName strModule:(NSString *)strModule resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    if (userName == nil || [userName isEqualToString:@""]) {
      userName = @"Customer";
    }
    NSString *templatePath = [NSHomeDirectory() stringByAppendingFormat:@"/Documents%@/ExternalData", [AppInfo getRootPath]];
//    NSString* templatePath = [NSHomeDirectory() stringByAppendingFormat:@"%@", @"/Documents/iTablet/ExternalData"];
    
    if(strModule == nil || [strModule isEqualToString:@""]){
      templatePath = templatePath;
    }else {
//      templatePath = [NSHomeDirectory() stringByAppendingFormat:@"%@%@", @"/Documents/iTablet/ExternalData/", strModule];
      templatePath = [NSString stringWithFormat:@"%@/%@", templatePath, strModule];
    }
    
    NSMutableArray* templateList = [NativeMethod getTemplate:templatePath];
    
    resolve(templateList);
  } @catch (NSException *exception) {
    reject(@"zipFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(getTemplatesList, getTemplatesListByUserName:(NSString *)userName strModule:(NSString *)strModule resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    if (userName == nil || [userName isEqualToString:@""]) {
      userName = @"Customer";
    }
//    NSString* templatePath = [NSHomeDirectory() stringByAppendingFormat:@"%@", @"/Documents/iTablet/ExternalData"];
    NSString *templatePath = [NSHomeDirectory() stringByAppendingFormat:@"/Documents%@/ExternalData", [AppInfo getRootPath]];
    
    if(strModule == nil || [strModule isEqualToString:@""]){
      templatePath = templatePath;
    }else if (strModule != nil && [strModule isEqualToString:@"XmlTemplate"]){
      templatePath = [NSString stringWithFormat:@"%@/%@", templatePath, strModule];
    }else {
      templatePath = [NSHomeDirectory() stringByAppendingFormat:@"/Documents%@/User/%@/Data/%@", [AppInfo getRootPath], userName, strModule];
    }
    
    NSMutableArray* templateList = [NativeMethod getTemplateList:templatePath];
    
    resolve(templateList);
  } @catch (NSException *exception) {
    reject(@"zipFile", exception.reason, nil);
  }
}

+ (NSMutableArray *)getTemplateList:(NSString *)path {
  NSMutableArray* templateList = [NSMutableArray array];
  BOOL flag = YES;
  if ([[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:&flag]) {
    NSArray* tempsArray = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:path error:nil];
    NSMutableDictionary* templateInfo = [[NSMutableDictionary alloc] init];
    
    for (NSString* fileName in tempsArray) {
      if (templateInfo == nil) {
        templateInfo = [[NSMutableDictionary alloc] init];
      }
        NSString* tempPath = [path stringByAppendingPathComponent:fileName];
        NSString* name = [fileName stringByDeletingPathExtension];
        [templateInfo setObject:name forKey:@"name"];
        [templateInfo setObject:tempPath forKey:@"path"];
        [templateList addObject:templateInfo];
        templateInfo = nil;
    }
  }
  return templateList;
}

+ (NSMutableArray *)getTemplate:(NSString *)path {
  NSMutableArray* templateList = [NSMutableArray array];
  BOOL flag = YES;
  if ([[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:&flag]) {
    NSArray* tempsArray = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:path error:nil];
    NSMutableDictionary* templateInfo = [[NSMutableDictionary alloc] init];
    BOOL hasTemplate = NO;
    
    for (NSString* fileName in tempsArray) {
      if ([fileName containsString:@"_EXAMPLE"]) continue;
      if (templateInfo == nil) {
        templateInfo = [[NSMutableDictionary alloc] init];
      }
      NSString* tempPath = [path stringByAppendingPathComponent:fileName];
      BOOL exist = [[NSFileManager defaultManager] fileExistsAtPath:tempPath isDirectory:&flag];
      if (!exist) continue;
      if (flag) {
        NSArray* subList = [NativeMethod getTemplate:tempPath];
        if (subList.count > 0) {
          [templateList addObjectsFromArray:subList];
        }
      } else {
        NSString* extension = [fileName pathExtension].lowercaseString;
        NSString* name = [fileName stringByDeletingPathExtension];
        
        if ([extension isEqualToString:@"smw"] || [extension isEqualToString:@"sxwu"] ||
            [extension isEqualToString:@"sxw"] || [extension isEqualToString:@"smwu"]) {
          
          if ([name containsString:@"~["] && [name containsString:@"]"]) continue; // 防止错误的工作空间文件
          
          [templateInfo setObject:name forKey:@"name"];
          [templateInfo setObject:tempPath forKey:@"path"];
          
          if (hasTemplate) { // 已有模板文件，且包含工作空间文件
            [templateList addObject:templateInfo];
            hasTemplate = NO;
            templateInfo = nil;
            break;
          }
        } else if ([extension isEqualToString:@"xml"]) { // 判断是否有模板文件
          hasTemplate = YES;
          if ([templateInfo objectForKey:@"name"]) { // 已有模板文件，且包含工作空间文件
            [templateList addObject:templateInfo];
            hasTemplate = NO;
            templateInfo = nil;
            break;
          }
        }
      }
    }
  }
  return templateList;
}

@end
