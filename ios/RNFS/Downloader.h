#import <Foundation/Foundation.h>

typedef void (^DownloadCompleteCallback)();
typedef void (^ErrorCallback)(NSError*);
typedef void (^BeginCallback)();
typedef void (^ProgressCallback)(NSNumber*);
typedef void (^ResumableCallback)();

@interface RNFSDownloadParams : NSObject

@property (copy) NSString* fromUrl;
@property (copy) NSString* toFile;
@property (copy) NSDictionary* headers;
@property (copy) DownloadCompleteCallback completeCallback;   // Download has finished (data written)
@property (copy) ErrorCallback errorCallback;                 // Something went wrong
@property (copy) BeginCallback beginCallback;                 // Download has started (headers received)
@property (copy) ProgressCallback progressCallback;           // Download is progressing
@property (copy) ResumableCallback resumableCallback;         // Download has stopped but is resumable
@property        bool background;                             // Whether to continue download when app is in background
@property        bool discretionary;                          // Whether the file may be downloaded at the OS's discretion (iOS only)
@property        bool cacheable;                              // Whether the file may be stored in the shared NSURLCache (iOS only)
@property (copy) NSNumber* progressDivider;
@property (copy) NSNumber* readTimeout;


@end

@protocol RNFSDownloaderFinishDelegate <NSObject>

-(void)RNFSDownloaderFinishCallback:(id)task;

@end
@interface RNFSDownloader : NSObject < NSURLSessionDownloadDelegate>
- (NSString *)downloadFile:(RNFSDownloadParams*)params;
- (void)stopDownload;
- (void)resumeDownload;
- (BOOL)isResumable;
-(void)cancleDownloadTask;
- (void)redownload;
-(void)startDownload;
//0：等待 1:开始 2:完成
@property(nonatomic)int taskState;
@property(nonatomic)id<RNFSDownloaderFinishDelegate> delegate;
@end
