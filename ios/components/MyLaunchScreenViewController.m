//
//  MyLaunchScreenViewController.m
//  iTablet
//
//  Created by Shanglong Yang on 2021/3/20.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "MyLaunchScreenViewController.h"

@interface MyLaunchScreenViewController ()

@end

@implementation MyLaunchScreenViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    [self setUI];
}

- (void)setUI{
  NSMutableArray *frames = [[NSMutableArray alloc] init];                                      // 定义数组存储拆分出来的图片
  
  // 从gif提取图片数组显示slogan
  NSURL* fileUrl = [[NSBundle mainBundle] URLForResource:@"launch_slogan" withExtension:@"gif"];
  CGImageSourceRef gifSource = CGImageSourceCreateWithURL((CFURLRef) fileUrl, NULL);          //将GIF图片转换成对应的图片源

  size_t frameCout = CGImageSourceGetCount(gifSource);                                        // 获取其中图片源个数，即由多少帧图片组成


  for (size_t i = 0; i < frameCout; i++) {
    CGImageRef imageRef = CGImageSourceCreateImageAtIndex(gifSource, i, NULL); // 从GIF图片中取出源图片

    UIImage *imageName = [UIImage imageWithCGImage:imageRef];                  // 将图片源转换成UIimageView能使用的图片源
    [frames addObject:imageName];                                              // 将图片加入数组中

    CGImageRelease(imageRef);

  }
  
// 从图片数组展示slogan
//  for (size_t i = 5; i < 80; i++) {
//    UIImage *imageName = [UIImage imageNamed:[NSString stringWithFormat:@"slogan-800_%d", i]];
//    [frames addObject:imageName];
//  }

  _slogan.animationImages = frames;
  _slogan.animationDuration = 8;
  [_slogan startAnimating];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

//-(void)dealloc{
//    if (_slogan.animating) {
//        [_slogan stopAnimating];
//    }
//}

@end
