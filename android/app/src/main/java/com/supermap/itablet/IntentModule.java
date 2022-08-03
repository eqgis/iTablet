package com.supermap.itablet;

import android.app.Activity;
import android.content.Intent;
import android.content.res.AssetManager;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.CatalystInstanceImpl;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.supermap.RNUtils.AppInfo;
import com.supermap.itablet.bundleCore.AppActivity;
import com.supermap.itablet.bundleCore.BundleBean;
import com.supermap.itablet.bundleCore.BundleStatus;
import com.supermap.itablet.bundleCore.BundleType;
import com.supermap.itablet.bundleCore.BundleUtils;
import com.supermap.itablet.bundleCore.DispatchActivity;

import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.Iterator;

public class IntentModule extends ReactContextBaseJavaModule {
    public final static String SDCARD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
    private static ReactContext context;

    public IntentModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "IntentModule";
    }
    @ReactMethod
    public void open(String name){
          switch (name){
              case "Visual":
                  name="com.supermap.imb.appconfig.StartupActivity";
                  break;
              case "Layer":
                  name="com.tronzzb.sampleapp.activity.MapLayer";
                  break;
          }
        try{
            Activity currentActivity = getCurrentActivity();
            if(null!=currentActivity){

                Class toActivity = Class.forName(name);
                Intent intent = new Intent(currentActivity,toActivity);
                currentActivity.startActivity(intent);
            }
        }catch(Exception e){
            throw new JSApplicationIllegalArgumentException(
                    "不能打开Activity : "+e.getMessage());
        }
    }


    @ReactMethod
    public void loadModel(String modelPath, Promise promise) {
        try {
            String bundlePath = BundleUtils.loadBundleFromDisk(getReactApplicationContext(), modelPath);
            if (!bundlePath.equals("")) {
//                String modelName = modelPath.substring(modelPath.lastIndexOf("/") + 1, modelPath.lastIndexOf("."));
//                String baseBundleDirPath = context.getFilesDir().getAbsolutePath() + "/bundles/";
//                modelPath = baseBundleDirPath + modelName + "/" + modelName + ".bundle";

                String configPath = bundlePath.substring(0, bundlePath.lastIndexOf("/") + 1) + "config.json";
                String configJson = BundleUtils.getBundleConfig(configPath);
                JSONObject jsonObject = new JSONObject(configJson);
                BundleBean bundleBean = new BundleBean(jsonObject);
                bundleBean.setPath(bundlePath);

                if (bundleBean.getBundleType().equals(BundleType.APP.name())) {
                    // 加载独立app类型的小程序

                } else if (
                    bundleBean.getBundleType().equals(BundleType.CONFIG_MODULE.name()) ||
                    bundleBean.getBundleType().equals(BundleType.MODULE.name())
                ) {
                    // 加载依赖于主App的模块小程序

                    // 处理图片
                    BundleUtils.dealBundleSource(context, bundlePath);

                    if (bundlePath.startsWith("assets://")) {
                        IntentModule.loadBundleFromAssets(bundlePath);
                    } else {
                        IntentModule.loadBundle(bundlePath);
                    }

                }


                // 需要更新的bundle，先移除原来的bundle信息
                if (
                    BundleUtils.findLoadedBundle(bundleBean) == BundleStatus.NEED_UPDATE) {
                    BundleUtils.removeLoadedBundle(bundleBean);
                }

                BundleUtils.addLoadedBundle(bundleBean);
            }
            promise.resolve(bundlePath != "");
        } catch (Exception e) {
            e.printStackTrace();
            promise.resolve(false);
        }
    }

    /**
     * 打开模块
     * @param bundlePath
     * @param promise
     */
    @ReactMethod
    public void openModel(String bundlePath, String bundleType, Promise promise) {
        try{
            Activity currentActivity = getCurrentActivity();
            if(null != currentActivity && new File(bundlePath).exists()){
                String bundleName = bundlePath.substring(bundlePath.lastIndexOf("/") + 1, bundlePath.lastIndexOf("."));

                String configPath = bundlePath.substring(0, bundlePath.lastIndexOf("/") + 1) + "config.json";
                String configJson = BundleUtils.getBundleConfig(configPath);
                JSONObject jsonObject = new JSONObject(configJson);
                BundleBean bundleBean = new BundleBean(jsonObject);
                bundleBean.setPath(bundlePath);

                // 不存在或需要更新的bundle
                BundleStatus bundleStatus = BundleUtils.findLoadedBundle(bundleBean);
                if (
                        bundleStatus == BundleStatus.NOT_EXIST ||
                                bundleStatus == BundleStatus.NEED_UPDATE
                ) {
//                    if (!bundleType.equals(BundleType.APP.name())) {
                        if (bundlePath.startsWith("assets://")) {
                            IntentModule.loadBundleFromAssets(bundlePath);
                        } else {
                            IntentModule.loadBundle(bundlePath);
                        }

//                    }

                    // 需要更新的bundle，先移除原来的bundle信息
                    if (
                        BundleUtils.findLoadedBundle(bundleBean) == BundleStatus.NEED_UPDATE) {
                        BundleUtils.removeLoadedBundle(bundleBean);
                    }

                    BundleUtils.addLoadedBundle(bundleBean);
                }

                if (bundleType.equals(BundleType.APP.name())) {
                    // 加载独立app类型的小程序
                    BundleUtils.dispatchModel = bundleName;
                    BundleUtils.dispatchModelUrl = bundlePath;

                    Intent starter = new Intent(currentActivity, AppActivity.class);
                    currentActivity.startActivity(starter);
                    currentActivity.overridePendingTransition(R.anim.activity_rtl, R.anim.activity_rtl);
                } else if (
                    bundleType.equals(BundleType.MODULE.name())
                ) {
                    BundleUtils.dispatchModel = bundleName;

                    Intent starter = new Intent(currentActivity, DispatchActivity.class);
                    currentActivity.startActivity(starter);
                    currentActivity.overridePendingTransition(R.anim.activity_rtl, R.anim.activity_rtl);

                }

                promise.resolve(true);
            } else {
                promise.resolve(false);
            }
        } catch (Exception e){
            promise.resolve(false);
        }
    }

    /**
     * 获取assets/bundles中的bundle文件
     * @param promise
     */
    @ReactMethod
    public void getAssetsBundles(Promise promise) {
        WritableArray filesArr = Arguments.createArray();
        try{
            AssetManager assetManager = getReactApplicationContext().getAssets();
            String[] files = assetManager.list("bundles");

            for (int i = 0; i < files.length; i++) {
                if (files[i].indexOf(".") >= 0) continue;
                String[] subFiles = assetManager.list("bundles/" + files[i]);
                if (subFiles.length > 0) {
                    // 判断bundle文件夹中文件是否完整
                    int configIndex = -1, bundleIndex = -1;
                    for (int j = 0; j < subFiles.length; j++) {
                        if (subFiles[j].equals("config.json")) {
                            configIndex = j;
                            continue;
                        }
                        if (subFiles[j].endsWith(".bundle")) {
                            bundleIndex = j;
                            continue;
                        }
                    }
                    // bundle文件完整，包含.bundle和config.json
                    if (configIndex > -1 && bundleIndex > -1) {
                        String configJson = readAssetsFile("bundles/" + files[i] + "/config.json");

                        JSONObject jsonObject = new JSONObject(configJson);
                        WritableMap configMap = Arguments.createMap();

                        Iterator<?> it = jsonObject.keys();
                        String value = "";
                        String key = null;
                        while (it.hasNext()) {// 遍历JSONObject
                            key = it.next().toString();
                            value = jsonObject.getString(key);
                            configMap.putString(key, value);
                        }
                        configMap.putString("path", "assets://bundles/" + files[i] + "/" + files[i] + ".bundle");

                        filesArr.pushMap(configMap);
                    }
                }
            }
            promise.resolve(filesArr);
        } catch (Exception e){
            promise.resolve(filesArr);
        }
    }

    /**
     * 获取项目文件目录中的bundle文件
     * @param promise
     */
    @ReactMethod
    public void getBundles(Promise promise) {
        WritableArray filesArr = Arguments.createArray();
        try{
//            String bundlePath = SDCARD + AppInfo.getRootPath() + "/Bundles/";
            String bundlePath = getReactApplicationContext().getFilesDir().getAbsolutePath() + "/bundles/";
            String[] files = new File(bundlePath).list();
            for (int i = 0; i < files.length; i++) {
                if (files[i].indexOf(".") >= 0) continue;
                String[] subFiles = new File(bundlePath + files[i]).list();
                if (subFiles.length > 0) {
                    // 判断bundle文件夹中文件是否完整
                    int configIndex = -1, bundleIndex = -1;
                    for (int j = 0; j < subFiles.length; j++) {
                        if (subFiles[j].equals("config.json")) {
                            configIndex = j;
                            continue;
                        }
                        if (subFiles[j].endsWith(".bundle")) {
                            bundleIndex = j;
                            continue;
                        }
                    }
                    // bundle文件完整，包含.bundle和config.json
                    if (configIndex > -1 && bundleIndex > -1) {
                        String configJson = readFile(bundlePath + files[i] + "/config.json");

                        JSONObject jsonObject = new JSONObject(configJson);
                        WritableMap configMap = Arguments.createMap();

                        Iterator<?> it = jsonObject.keys();
                        String value = "";
                        String key = null;
                        while (it.hasNext()) {// 遍历JSONObject
                            key = it.next().toString();
                            value = jsonObject.getString(key);
                            configMap.putString(key, value);
                        }
                        configMap.putString("path", bundlePath + files[i] + "/" + files[i] + ".bundle");

                        filesArr.pushMap(configMap);
                    }
                }
            }
            promise.resolve(filesArr);
        } catch (Exception e){
            promise.resolve(filesArr);
        }
    }

    /**
     * TODO 临时方法代替下载
     * @param promise
     */
    @ReactMethod
    public void getUnusedBundles(Promise promise) {
        WritableArray filesArr = Arguments.createArray();
        try{
            String bundlePath = SDCARD + AppInfo.getRootPath() + "/Bundles/";
            String[] files = new File(bundlePath).list();
            for (int i = 0; i < files.length; i++) {
                if (files[i].indexOf(".zip") < 0) continue;

                WritableMap configMap = Arguments.createMap();
                configMap.putString("path", files[i]);
                configMap.putString("path", bundlePath + files[i]);
                configMap.putString("name", files[i]);
                configMap.putString("create_date", new Date().getTime() + "");
                configMap.putString("md5", new Date().getTime() + "");
                configMap.putString("version", "0.0.1");
                filesArr.pushMap(configMap);
            }
            promise.resolve(filesArr);
        } catch (Exception e){
            promise.resolve(filesArr);
        }
    }

//    @ReactMethod
//    public void getUnusedBundles(Promise promise) {
//        WritableArray filesArr = Arguments.createArray();
//        try{
//            String bundlePath = SDCARD + AppInfo.getRootPath() + "/Bundles/";
////            String bundlePath = getReactApplicationContext().getFilesDir().getAbsolutePath() + "/bundles/";
//            String[] files = new File(bundlePath).list();
//            for (int i = 0; i < files.length; i++) {
//                if (files[i].indexOf(".") >= 0) continue;
//                String[] subFiles = new File(bundlePath + files[i]).list();
//                if (subFiles.length > 0) {
//                    // 判断bundle文件夹中文件是否完整
//                    int configIndex = -1, bundleIndex = -1;
//                    for (int j = 0; j < subFiles.length; j++) {
//                        if (subFiles[j].equals("config.json")) {
//                            configIndex = j;
//                            continue;
//                        }
//                        if (subFiles[j].endsWith(".bundle")) {
//                            bundleIndex = j;
//                            continue;
//                        }
//                    }
//                    // bundle文件完整，包含.bundle和config.json
//                    if (configIndex > -1 && bundleIndex > -1) {
//                        String configJson = readFile(bundlePath + files[i] + "/config.json");
//
//                        JSONObject jsonObject = new JSONObject(configJson);
//                        WritableMap configMap = Arguments.createMap();
//
//                        Iterator<?> it = jsonObject.keys();
//                        String value = "";
//                        String key = null;
//                        while (it.hasNext()) {// 遍历JSONObject
//                            key = it.next().toString();
//                            value = jsonObject.getString(key);
//                            configMap.putString(key, value);
//                        }
//                        configMap.putString("path", bundlePath + files[i] + "/" + files[i] + ".bundle");
//
//                        filesArr.pushMap(configMap);
//                    }
//                }
//            }
//            promise.resolve(filesArr);
//        } catch (Exception e){
//            promise.resolve(filesArr);
//        }
//    }

    public String readAssetsFile(String fileName) {
        try {
            AssetManager assetManager = getReactApplicationContext().getAssets();
            InputStream is = assetManager.open(fileName);

            int length = is.available();

            byte[] buffer = new byte[length];

            is.read(buffer);

            String result = new String(buffer, "utf8");

            return result;

        } catch(IOException e) {

            return "";

        }
    }

    public String readFile(String filePath) {
        try {
            File file = new File(filePath);
            FileInputStream is = new FileInputStream(file);

            int length = is.available();

            byte[] buffer = new byte[length];

            is.read(buffer);

            String result = new String(buffer, "utf8");

            return result;

        } catch(IOException e) {

            return "";

        }
    }

    /**
     * 加载assets中的bundle文件
     * @param bundlePath
     */
    public static void loadBundleFromAssets(String bundlePath) {
        String source = bundlePath;
        if (!bundlePath.startsWith("assets://")) {
            source = "assets://" + source;
        }
        Log.e("RNN", "loadScriptFromAsset:"+source);
        try {
//            Method method = CatalystInstanceImpl.class.getDeclaredMethod("loadScriptFromAssets",
//                    AssetManager.class,
//                    String.class,
//                    boolean.class);
//            method.setAccessible(true);
//            method.invoke(context.getCatalystInstance(), context.getAssets(), source, false);
            context.getCatalystInstance().loadScriptFromAssets(context.getAssets(), source, false);
//        } catch (IllegalAccessException e) {
//            e.printStackTrace();
//        } catch (NoSuchMethodException e) {
//            e.printStackTrace();
//        } catch (InvocationTargetException e) {
//            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 加载本地中的bundle文件
     * @param bundlePath
     */
    public static void loadBundle(String bundlePath) {
        try {
            String source = bundlePath;
            if (!bundlePath.startsWith("file://")) {
                source = "file://" + source;
            }
//            Method method = CatalystInstanceImpl.class.getDeclaredMethod("loadScriptFromFile",
//                    String.class,
//                    String.class,
//                    boolean.class);
//            method.setAccessible(true);
//            method.invoke(context.getCatalystInstance(), bundlePath, bundlePath, false);
            context.getCatalystInstance().loadScriptFromFile(bundlePath, source, false);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void goBack(Promise promise) {
        try {
            Activity activity = getCurrentActivity();
            if (activity == null) {
                promise.resolve(false);
                return;
            }
            activity.finish();
            activity.overridePendingTransition(R.anim.activity_lrt, R.anim.activity_lrt);
            promise.resolve(true);
        } catch (Exception e) {
            e.printStackTrace();
            promise.resolve(false);
        }
    }

}

