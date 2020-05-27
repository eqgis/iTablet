//
//  JSZipArchive.h
//  iTablet
//
//  Created by Yang Shang Long on 2018/9/21.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <UIKit/UIKit.h>
#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"
#import <SuperMap/Environment.h>
#import <SuperMap/Workspace.h>
#import <SuperMap/DatasourceConnectionInfo.h>
#import <SuperMap/Datasource.h>
#import <SuperMap/Datasources.h>

//NSString *USER_NAME;
static BOOL hasImportedData = NO;

@interface FileTools : RCTEventEmitter<RCTBridgeModule>
//@property(nonatomic) id<SSZipArchiveDelegate> zipArchiveDelegate;



+(BOOL)zipFile:(NSString *)archivePath targetPath:(NSString *)targetPath;
+(BOOL)zipFiles:(NSArray *)archivePaths targetPath:(NSString *)targetPath;
+(BOOL)unZipFile:(NSString *)archivePath targetPath:(NSString *)targetPath;
+(BOOL)deleteFile:(NSString *)path;
+(BOOL)createFileDirectories:(NSString*)path;
+(BOOL)copyFile:(NSString *)fromPath targetPath:(NSString *)toPath;
+(BOOL)initUserDefaultData:(NSString *)userName;
+(NSString*)getLastModifiedTime:(NSDate*) nsDate;
+ (NSDictionary *)readLocalFileWithPath:(NSString *)path;
+(BOOL)getUriState:(NSURL *)url;
+(void)sendShareResult;
+ (BOOL)copyFiles:(NSString *)from targetDictionary:(NSString *)to filterFileSuffix:(NSString *)filterFileSuffix
filterFileDicName:(NSString*)filterFileDicName otherFileDicName:(NSString*)otherFileDicName isOnly:(BOOL)isOnly;
@end
