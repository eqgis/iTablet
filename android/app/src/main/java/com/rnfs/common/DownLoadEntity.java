package com.rnfs.common;


import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;


public class DownLoadEntity extends Thread {

    final int BUFFER_SIZE=1024;
    //0：等待 1:开始 2:完成
    public int taskState = 0;
    public DownloadListener downloadListener;;
    public String url;
    public String m_path;

    boolean isCanceled=false;
    public boolean isFirstDownload=true;
    //文件下载了多少
    private long downSize = 0;
    private String TAG = "tag";
    //文件对象
    private File file;
    //随机读取流
    private RandomAccessFile m_raf;
    //文件的总长度
    private long totalLength;
    public ReadableMap headers;


    public DownLoadEntity(String url,String path,DownloadListener downloadListener) {
        this.m_path = path;
        this.url=url;
        this.downloadListener=downloadListener;
    }

    @Override
    public void run() {

        downLoad();
    }

    private void downloadSuccess(){
        //先存一个临时文件，下载成功后再改回去 add xiezhy
        File fileTmp = new File(m_path+"_tmp");
        fileTmp.renameTo(new File(m_path));
        taskState = 2;
        downloadListener.onSuccess(this);
    }
    public void downLoad() {
        taskState = 1;
        HttpURLConnection conn = null;
        try {
            URL url = new URL(this.url);
            conn = (HttpURLConnection) url.openConnection();

            ReadableMapKeySetIterator iterator = headers.keySetIterator();

            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                String value = headers.getString(key);
                conn.setRequestProperty(key, value);
            }

            file = new File(m_path+"_tmp");
            downSize=file.length();
            //创建文件的读取流对象
            m_raf = new RandomAccessFile(file, "rwd");
            if (downSize < 1) {
                totalLength = conn.getContentLength();
            } else {

                long offset=downSize-downSize%(BUFFER_SIZE);
                //设置文件请求的位置
                conn.setRequestProperty("Range", "bytes=" + offset + "-");
                //设置文件  写入的位置
                m_raf.seek(offset);
                downSize=offset;
                totalLength = conn.getContentLength();
                if(downSize == totalLength){
                    downloadSuccess();
                    return;
                }
                conn.connect();
            }



            //下面是对文件的写入操作
            InputStream stream = conn.getInputStream();
            byte[] by = new byte[BUFFER_SIZE];
            int len = 0;

            long endTime = System.currentTimeMillis();
            if(isFirstDownload) {
                downloadListener.startDownload();
            }

            int currentProgress;
            int lastProgress = 0;
            while ((len = stream.read(by)) != -1&&!isCanceled) {
                m_raf.write(by, 0, len);
                downSize += len;
                final double dd = downSize / (totalLength * 1.0);
                currentProgress= (int) (downSize*100/totalLength);
                if ((System.currentTimeMillis() - endTime > 1000&&currentProgress>lastProgress)||currentProgress==100) {
                    lastProgress=currentProgress;
                    downloadListener.onProgress(currentProgress);
                    endTime=System.currentTimeMillis();
                }
            }
            if(isCanceled){
                downloadListener.onCanceled();
            }else
            {
                m_raf.close();
                downloadSuccess();
            }
            return;

        } catch (MalformedURLException e) {
            e.printStackTrace();
            downloadListener.onFailed(this, e);
        } catch (IOException e) {
            e.printStackTrace();
            //以此判断为断网
            if(e.toString().contains("javax.net.ssl.SSLException: Read error: ssl=")){
                downloadListener.onCanceled();
            }else {
                File fileTmp = new File(m_path+"_tmp");
                if (fileTmp.length() == totalLength) {
                    downloadSuccess();
//                    taskState = 2;
//                    fileTmp.renameTo(new File(m_path));
//                    downloadListener.onSuccess(this);
                } else
                    downloadListener.onFailed(this, e);
            }
        }finally {
            if (conn!=null){
                conn.disconnect();
            }
        }
    }

    /**
     * 取消下载
     */
    public void cancel() {
        isCanceled = true;
    }
}
