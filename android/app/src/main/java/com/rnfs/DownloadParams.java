package com.rnfs;

import com.facebook.react.bridge.ReadableMap;

import java.io.File;
import java.net.URL;

public class DownloadParams {
  public interface OnTaskCompleted {
    void onTaskCompleted(DownloadResult res);
  }

  public interface OnDownloadBegin {
//    void onDownloadBegin(int statusCode, long contentLength, Map<String, String> headers);
    void onDownloadBegin();
  }

  public interface OnDownloadProgress {
//    void onDownloadProgress(long contentLength, long bytesWritten);
    void onDownloadProgress(int progress);
  }

  public URL src;
  public File dest;
  public ReadableMap headers;
  public float progressDivider;
  public int readTimeout;
  public int connectionTimeout;
  public OnTaskCompleted onTaskCompleted;
  public OnDownloadBegin onDownloadBegin;
  public OnDownloadProgress onDownloadProgress;
}