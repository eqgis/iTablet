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

-(void)viewWillAppear:(BOOL)animated{
  [self setUI];
}
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
   
}

- (void)setUI{
//  NSMutableArray *frames = [[NSMutableArray alloc] init];                                      // 定义数组存储拆分出来的图片
  
  // 从gif提取图片数组显示slogan
  NSString* language = [SLanguage getLanguage];
  for(UIView* view in self.view.subviews){
    if(view.tag == 12 && [language isEqual:@"CN"] ){
      view.hidden = false;
      break;
    }else if (view.tag == 11 && ![language isEqual:@"CN"] ){
      view.hidden = false;
      break;
    }
  }
  
//  NSString* slogan = @"launch_slogan_cn";
//  self.slogan.hidden = true;
//  self.sloganEN.hidden = true;
//  if ([language isEqual:@"CN"] ) {
//    self.slogan.hidden = false;
//  }else{
//    self.sloganEN.hidden = false;
//  }
//  NSURL* fileUrl = [[NSBundle mainBundle] URLForResource:slogan withExtension:@"gif"];
//  CGImageSourceRef gifSource = CGImageSourceCreateWithURL((CFURLRef) fileUrl, NULL);          //将GIF图片转换成对应的图片源
//
//  size_t frameCout = CGImageSourceGetCount(gifSource);                                        // 获取其中图片源个数，即由多少帧图片组成
//
//
//  for (size_t i = 0; i < frameCout; i++) {
//    CGImageRef imageRef = CGImageSourceCreateImageAtIndex(gifSource, i, NULL); // 从GIF图片中取出源图片
//
//    UIImage *imageName = [UIImage imageWithCGImage:imageRef];                  // 将图片源转换成UIimageView能使用的图片源
//    [frames addObject:imageName];                                              // 将图片加入数组中
//
//    CGImageRelease(imageRef);
//
//  }
  
// 从图片数组展示slogan
//  for (size_t i = 5; i < 80; i++) {
//    UIImage *imageName = [UIImage imageNamed:[NSString stringWithFormat:@"slogan-800_%d", i]];
//    [frames addObject:imageName];
//  }
//  CATransition *transition = [CATransition animation];
//  transition.duration = 0.3;
//  transition.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseIn];
//  transition.type = kCATransitionFade;
//
//  _slogan.animationImages = frames;
//  _slogan.animationDuration = 8;
//  [_slogan startAnimating];
  
  
//  NSString* fileUrl = [[NSBundle mainBundle] pathForResource:slogan ofType:@"png"];
//  _slogan.image = [UIImage imageWithContentsOfFile:fileUrl];
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
