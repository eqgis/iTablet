package com.rnfs.common;

public interface DownloadListener {

    /**
     * 开始下载
     */
    void startDownload();
    /**
     * 当前下载进度
     *
     * @param progress 下载进度
     */
    void onProgress(int progress);

    /**
     * 下载成功
     */
    void onSuccess(DownLoadEntity task);

    /**
     * 下载失败
     */
    void onFailed(DownLoadEntity task, Exception e);

    /**
     * 暂停下载
     */
    void onPaused();

    /**
     * 取消下载
     */
    void onCanceled();
}
