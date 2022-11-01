package com.supermap.RN;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;

import androidx.core.content.FileProvider;

import com.supermap.RNUtils.FileManager;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXFileObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Map;
import java.util.Stack;

public class appManager {
    private static Stack<Activity> activityStack;
    private static appManager instance;
    private IWXAPI iwxapi = null;

    private appManager() {
    }

    /**
     * 单一实例
     */
    public static appManager getAppManager() {
        if (instance == null) {
            instance = new appManager();
        }
        return instance;
    }

    /**
     * 添加Activity到堆栈
     */
    public void addActivity(Activity activity) {
        if (activityStack == null) {
            activityStack = new Stack<Activity>();
        }
        activityStack.add(activity);
    }

    /**
     * 获取当前Activity（堆栈中最后一个压入的）
     */
    public Activity currentActivity() {
        Activity activity = activityStack.lastElement();
        return activity;
    }

    /**
     * 结束当前Activity（堆栈中最后一个压入的）
     */
    public void finishActivity() {
        Activity activity = activityStack.lastElement();
        finishActivity(activity);
    }

    /**
     * 结束指定的Activity
     */
    public void finishActivity(Activity activity) {
        if (activity != null) {
            activityStack.remove(activity);
            activity.finish();
            activity = null;
        }
    }

    /**
     * 结束指定类名的Activity
     */
    public void finishActivity(Class<?> cls) {
        for (Activity activity : activityStack) {
            if (activity.getClass().equals(cls)) {
                finishActivity(activity);
            }
        }
    }

    /**
     * 结束所有Activity
     */
    public void finishAllActivity() {
        for (int i = 0, size = activityStack.size(); i < size; i++) {
            if (null != activityStack.get(i)) {
                activityStack.get(i).finish();
            }
        }
        activityStack.clear();
    }


    /**
     * 退出应用程序
     */
    public void AppExit(final Context context) {
        try {
//            android.os.Process.killProcess(android.os.Process.myPid());

            Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
//                    android.os.Process.killProcess(android.os.Process.myPid());
                    System.exit(0);
                }
            }, 1000);//1秒后执行Runnable中的run方法
            finishAllActivity();
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public IWXAPI registerWechat(Context context) {
        String APP_ID = "wxb38479195902d0cc"; // "wx06e9572a1d069aaa";
        iwxapi = WXAPIFactory.createWXAPI(context, APP_ID, false);
        iwxapi.registerApp(APP_ID);
        return iwxapi;
    }

    public boolean isWXInstalled() {
        return iwxapi.isWXAppInstalled();
    }

    public Boolean sendFileOfWechat(Map map) throws Exception {
        Boolean result = false;
        WXMediaMessage msg = new WXMediaMessage();
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        if (map.containsKey("title")) {
            msg.title = map.get("title").toString();
        }
        if (map.containsKey("description")) {
            msg.description = map.get("description").toString();
        }
        if (map.containsKey("filePath")) {
            File file=new File(map.get("filePath").toString());
            try {
                FileInputStream fis=new FileInputStream(file);
                long size=fis.available();
                if(size>10485760){
//                    return false;
                    throw new Exception("File size cannot exceeds 10M");
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            String filePath = map.get("filePath").toString();
            if (checkAndroidNotBelowN()) {
                Context context = activityStack.get(0);
//                String wechatShareCachePath = context.getCacheDir().getPath() + "/wechatShare";
                String wechatShareCachePath = context.getExternalFilesDir(null) + "/shareData";
                FileManager.getInstance().deleteDir(wechatShareCachePath);
                FileManager.getInstance().deleteFile(wechatShareCachePath);
                if (!new File(wechatShareCachePath).exists()) {
                    new File(wechatShareCachePath).mkdirs();
                }
                result = FileManager.getInstance().copy(filePath, wechatShareCachePath + "/" + file.getName());
                filePath = getFileUri(context, new File(wechatShareCachePath + "/" + file.getName()));
            }
            WXFileObject fileObject = new WXFileObject(filePath);
            msg.mediaObject = fileObject;
        }
        req.transaction = buildTransaction("file");
        req.message = msg;
        req.scene = SendMessageToWX.Req.WXSceneSession;
        if (iwxapi != null) {
            result = iwxapi.sendReq(req);
            int i=0;
            while (!result){
                result= iwxapi.sendReq(req);
                i++;
                if(result||i==10){
                    break;
                }
            }
        }
        return result;
    }

    public String getFileUri(Context context, File file) {
        if (file == null || !file.exists()) {
            return null;
        }

        Uri contentUri = FileProvider.getUriForFile(context,
                context.getPackageName() + ".wechatShare",  // 要与`AndroidManifest.xml`里配置的`authorities`一致，假设你的应用包名为com.example.app
                file);

        // 授权给微信访问路径
        context.grantUriPermission("com.tencent.mm",  // 这里填微信包名
                contentUri, Intent.FLAG_GRANT_READ_URI_PERMISSION);

        return contentUri.toString();   // contentUri.toString() 即是以"content://"开头的用于共享的路径
    }

    // 判断微信版本是否为7.0.13及以上
    public boolean checkVersionValid() {
        return iwxapi.getWXAppSupportAPI() >= 0x27000D00;
    }

    // 判断Android版本是否11 及以上
    public boolean checkAndroidNotBelowN() {
        return android.os.Build.VERSION.SDK_INT >= 30;
    }

    private String buildTransaction(String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }
}
