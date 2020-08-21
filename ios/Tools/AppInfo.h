//
//  Version.h
//  Supermap
//
//  Created by Shanglong Yang on 2020/8/19.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface AppInfo : NSObject<RCTBridgeModule>
+(NSString *)getBundleFile;
@end
