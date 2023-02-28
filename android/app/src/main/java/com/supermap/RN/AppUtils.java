package com.supermap.RN;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.supermap.containts.EventConst;
import com.supermap.interfaces.utils.SLocation;
import com.supermap.itablet.MainActivity;

import java.util.Locale;
import java.util.Map;

public class AppUtils extends ReactContextBaseJavaModule {
    private static ReactContext mReactContext;

    public AppUtils(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext=reactContext;
    }

    @Override
    public String getName() {
        return "AppUtils";
    }

    @ReactMethod
    public void initApp(Promise promise){
        try {
            appManager.getAppManager().registerWechat(mReactContext);
            promise.resolve(null);
        } catch (Exception e) {
            promise.resolve(null);
        }
    }


    @ReactMethod
    public void AppExit(){
        SLocation.closeGPS();
        appManager.getAppManager().AppExit(getReactApplicationContext());
        System.exit(0);
    }

    @ReactMethod
    public void isPad(Promise promise) {
        try {
            Boolean res =  (mReactContext.getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE;
            promise.resolve(res);
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    /**
     * android 11 external storage 读写权限申请code
     */
    public static final int REQUEST_CODE = 1234;

    static Promise permissionPromise;

    public static void onPermissionResult(boolean result) {
        if(permissionPromise != null) {
            permissionPromise.resolve(result);
            permissionPromise = null;
        }
    }

    @ReactMethod
    public void requestStoragePermissionR(Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                // 先判断有没有权限
                if (Environment.isExternalStorageManager()) {
                    promise.resolve(true);
                } else {
                    Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
                    intent.setData(Uri.parse("package:" + mReactContext.getPackageName()));
                    mReactContext.getCurrentActivity().startActivityForResult(intent, REQUEST_CODE);
                    permissionPromise = promise;
                }
            } else {
                promise.resolve(true);
            }
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    private  boolean is64bitCPU() {
        String CPU_ABI = null;
        try {
            if (Build.VERSION.SDK_INT >= 23) {
                return android.os.Process.is64Bit();
            } else {
                return false;
            }
        }catch (Exception e) {
            return false;
        }
    }

    @ReactMethod
    public void is64Bit(Promise promise) {
        try {
            Boolean res =  is64bitCPU();//
            promise.resolve(res);
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

     @ReactMethod
     public void getLocale(Promise promise) {
        try {
            Locale locale = Locale.getDefault();
            String language = locale.getLanguage();
            String contry = locale.getCountry();
            promise.resolve(language + '-'+ contry);
        } catch (Exception e) {
            promise.resolve("");
        }
     }

    @ReactMethod
    public void isWXInstalled(Promise promise) {
        try {
            promise.resolve(appManager.getAppManager().isWXInstalled());
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void  sendFileOfWechat(ReadableMap map, Promise promise){
        try {
            Map params = map.toHashMap();
            Boolean result=appManager.getAppManager().sendFileOfWechat(params);
            promise.resolve(result);
        }catch (Exception e){
            //需要通过异常判断文件大小是否超过10M
            promise.reject(e);
        }
    }

    @ReactMethod
    public void isLocationOpen(Promise promise) {
        LocationManager locationManager = (LocationManager) mReactContext.getSystemService(Context.LOCATION_SERVICE);
        // 通过GPS卫星定位，定位级别可以精确到街（通过24颗卫星定位，在室外和空旷的地方定位准确、速度快）
        boolean gps = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        // 通过WLAN或移动网络(3G/2G)确定的位置（也称作AGPS，辅助GPS定位。主要用于在室内或遮盖物（建筑群或茂密的深林等）密集的地方定位）
        boolean network = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
//        promise.resolve(locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER));
        promise.resolve(gps || network);
    }


    @ReactMethod
    public void startAppLoactionSetting(Promise promise) {
        Intent intent = new Intent();
        intent.setAction(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try{
            mReactContext.startActivity(intent);
            promise.resolve(true);
        } catch (ActivityNotFoundException e1){
            intent .setAction(Settings.ACTION_SETTINGS);
            try{
                mReactContext.startActivity(intent);
                promise.resolve(true);
            } catch (Exception e2) {
                promise.resolve(false);
            }
        }

    }

    @ReactMethod
    public void pause (int time, Promise promise){
        try {
            final int timeInMS = time * 1000;
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        Thread.sleep(timeInMS);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    promise.resolve(true);
                }
            }).start();
        }catch (Exception e){
            promise.resolve(false);
        }
    }

//    @ReactMethod
//    public void reloadBundle(Promise promise){
//        try {
//            if (!MainActivity.getInstance().isFinishing()) {
//                MainActivity.getInstance().loadBundle();
//            }
//            promise.resolve(true);
//        } catch (Exception e){
//            promise.resolve(false);
//        }
//    }

    public static void sendShareResult(String result) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EventConst.MESSAGE_SHARERESULT, result);
    }

}
