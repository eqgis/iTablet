#import "Downloader.h"
#import "AFNetworking.h"
#import "Common/YYDownloadManager.h"

@implementation RNFSDownloadParams
{
  //  NSMutableData* m_curDownload;
}
@end

@interface RNFSDownloader()
{
    FILE* writeHandle;
    NSMutableData* m_spliteData;
    NSString* _PathTmp;
}


@property (copy) RNFSDownloadParams* params;

//当前获取到的数据长度
@property(nonatomic,assign)long long currentLength;
//完整数据长度
@property(nonatomic,assign)long long sumLength;
//是否正在下载
@property(nonatomic,assign,getter = isdownLoading)BOOL downLoading;
@property(nonatomic,strong)NSURLSessionDataTask *cnnt;
@property(nonatomic,strong)NSURLSession *session;
@property(nonatomic,strong)NSMutableData *fileData;
//@property(nonatomic,strong)NSFileHandle *writeHandle;
@property(nonatomic,strong)NSMutableData *m_curDownload;

//@property (retain) AFURLSessionManager *manager;
@end

@implementation RNFSDownloader
-(id)init{
    
    if(self =[super init]){
        _taskState = 0;
    }
    return self;
}
//////////////////////////////////////
static int g_uuid = 1;
- (NSString *)downloadFile:(RNFSDownloadParams*)params
{
    _taskState = 1;
//    NSString *uuid = nil;
    
    _params = params;
    
    _m_curDownload = [[NSMutableData alloc]init];
    
    //    NSURL* url = [NSURL URLWithString:_params.fromUrl];
    
    // 后台切换到前台通知监听
    //    [[NSNotificationCenter defaultCenter] addObserver:self
    //                                             selector:@selector(resumeDownload) name:@"dowloadFile"
    //                                               object:nil];
    //断网通知
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(stopDownload) name:@"stoploadFile"
                                               object:nil];
    //网络连接成功监听
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(startDownload) name:@"startdowloadFile"
                                               object:nil];
    
    [self startDownload];
    
    
    return [NSString stringWithFormat:@"%d",g_uuid++];
}

-(NSString*)getFileSize:(NSString *)path
{
    NSFileManager* manager = [NSFileManager defaultManager];
    NSString* fileSize = @"0";
    if ([manager fileExistsAtPath:path]){
        
        fileSize = [NSString stringWithFormat:@"%llu",[[manager attributesOfItemAtPath:path error:nil] fileSize]];
    }
    
    return fileSize;
}
-(void)startDownload
{
    if(self.cnnt != nil){
        [self.cnnt suspend];
        self.cnnt = nil;
    }
    NSURL* url = [NSURL URLWithString:_params.fromUrl];
    
    NSLog(@"\n\n%@\n\n",_params.toFile);
    
    NSString* curSize = @"0";
    _PathTmp = [NSString stringWithFormat:@"%@_tmp",_params.toFile];
    curSize = [self getFileSize:_PathTmp];
    self.currentLength = [curSize longLongValue];
    //创建一个请求
    NSMutableURLRequest *request=[NSMutableURLRequest requestWithURL:url];
    //设置请求头信息
    //self.currentLength字节部分重新开始读取
    NSString *value=[NSString stringWithFormat:@"bytes=%@-",curSize];
    [request setValue:value forHTTPHeaderField:@"Range"];
    [request setTimeoutInterval:60];
    //发送请求（使用代理的方式）
    
        NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration] delegate:self delegateQueue:[NSOperationQueue mainQueue]];
    
    //4.根据会话对象创建一个Task(发送请求）
    self.cnnt = [session dataTaskWithRequest:request];
    
    //5.执行任务
    [ self.cnnt resume];
}

//1.接收到服务器响应的时候调用该方法
-(void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask didReceiveResponse:(NSURLResponse *)response completionHandler:(void (^)(NSURLSessionResponseDisposition))completionHandler
{
    if(self.cnnt != dataTask){
        return;
    }
    NSDictionary *dict = [(NSHTTPURLResponse *)response allHeaderFields];
    NSLog(@"%@",dict);
    //     self.sumLength = (long long)[dict objectForKey:@"Content-Length"];
    //1.创建文件存储路径
    //    NSArray* tmp = [mData.pathName componentsSeparatedByString:@"/"];
    NSString *filePath= _PathTmp;//[NSHomeDirectory() stringByAppendingPathComponent:[NSString stringWithFormat:@"/Library/Caches/%@/%@.zip",tmp[0],tmp[1]]];
    if(![[NSFileManager defaultManager] fileExistsAtPath:filePath isDirectory:nil])
    {
        //2.创建一个空的文件,到沙盒中
        NSFileManager *mgr=[NSFileManager defaultManager];
        //刚创建完毕的大小是o字节
        [mgr createFileAtPath:filePath contents:nil attributes:nil];
    }
    //3.创建写数据的文件句柄
    
    writeHandle = fopen(filePath.UTF8String, "a+");//open(filePath.UTF8String, O_RDWR,S_IRUSR);
    //     self.writeHandle=[NSFileHandle fileHandleForWritingAtPath:filePath];
    //4.获取完整的文件的长度
    NSDictionary* dic = ((NSHTTPURLResponse*)response).allHeaderFields;
    self.sumLength = ((NSString*)[dic[@"Content-Range"] componentsSeparatedByString:@"/"][1]).longLongValue;
    //     NSLog(@"%@",sumLen);
    
    completionHandler(NSURLSessionResponseAllow);
}


//2.接收到服务器返回数据的时候会调用该方法，如果数据较大那么该方法可能会调用多次
-(void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask didReceiveData:(NSData *)data
{
    if(self.cnnt != dataTask){
        return;
    }
    //add yangsl
    if (self.sumLength == 0) {
        NSError* error = [NSError errorWithDomain:@"Downloader" code:NSURLErrorFileDoesNotExist userInfo:@{NSLocalizedDescriptionKey: [NSString stringWithFormat: @"Failed to open target resource"]}];
        _params.errorCallback(error);
        return;
    }
     if(!m_spliteData){
         m_spliteData = [[NSMutableData alloc]init];
     }
    [m_spliteData appendData:data];
    //拼接服务器返回的数据
    //累加接收到的数据
    self.currentLength+=data.length;
    double progress=(double)(self.currentLength)/self.sumLength;
    NSLog(@"Progress--%f--%d--%d--",progress,(int)self.currentLength,(int)self.sumLength);
    
    int n = (int)(progress*100);
    _params.progressCallback(@(n));
    if(self.currentLength > self.sumLength){
        [self redownload];
        return;
    }
    
    //每2%写入一次
    if(n%2 == 0){
      [self saveData];
    }
}
//3.当请求完成(成功|失败)的时候会调用该方法，如果请求失败，则error有值
-(void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error
{
    if(self.cnnt != task){
        return;
    }
    [self saveData];
    NSLog(@"didCompleteWithError--%@--%lld--%lld",[NSThread currentThread],self.currentLength,self.sumLength);
    if(self.currentLength == self.sumLength){
        fclose(writeHandle);
        
        NSFileManager *fileManager = [NSFileManager defaultManager];
           //通过移动该文件对文件重命名
           BOOL isSuccess = [fileManager moveItemAtPath:_PathTmp toPath:_params.toFile error:nil];
           if (isSuccess) {
               NSLog(@"rename success");
           }else{
               NSLog(@"rename fail");
           }
        
        _params.completeCallback();
        _taskState = 2;
        if([self.delegate respondsToSelector:@selector(RNFSDownloaderFinishCallback:)]){
            [self.delegate RNFSDownloaderFinishCallback:self];
        }
    }else{
        if(self.currentLength > self.sumLength)
        {
            [self redownload:true];
        }else{
             [self redownload:false];
        }
      
        NSLog(@"%@",error);
    }

}
-(void)saveData{
    if(m_spliteData){
           fseek(writeHandle, 0, SEEK_END);
           fwrite(m_spliteData.bytes, m_spliteData.length, 1, writeHandle);
           fflush(writeHandle);
           m_spliteData = nil;
       }
}
-(void)redownload:(BOOL)bRemove{
    fclose(writeHandle);
    if(bRemove){
        [[NSFileManager defaultManager] removeItemAtPath:[_PathTmp stringByAppendingString:@""] error:nil];
    }
   
//    [[NSFileManager defaultManager] removeItemAtPath:[_params.toFile stringByAppendingString:@"_tmp"] error:nil];
    [self.cnnt suspend];
    [self.cnnt cancel];
    self.cnnt = nil;
    [self startDownload];
}
- (void)stopDownload
{
    [self saveData];
    fclose(writeHandle);
}

@end
