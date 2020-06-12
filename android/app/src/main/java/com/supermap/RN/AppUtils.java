package com.supermap.RN;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.location.LocationManager;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.CatalystInstanceImpl;
import com.facebook.react.bridge.JSBundleLoader;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.supermap.containts.EventConst;
import com.supermap.itablet.MainActivity;
import com.supermap.itablet.MainApplication;

import java.io.File;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
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
    public void AppExit(){
        appManager.getAppManager().AppExit(getReactApplicationContext());

    }

    @ReactMethod
    public void isPad(Promise promise) {
        try {
            Boolean res =  (mReactContext.getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE;
            promise.resolve(res);
        } catch (Exception e) {
            promise.reject(e);
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
            promise.reject(e);
        }
     }

    @ReactMethod
    public void isWXInstalled(Promise promise) {
        try {
            promise.resolve(appManager.getAppManager().isWXInstalled());
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void  sendFileOfWechat(ReadableMap map, Promise promise){
        try {
            Map params = map.toHashMap();
            Boolean result=appManager.getAppManager().sendFileOfWechat(params);
            promise.resolve(result);
        }catch (Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void isLocationOpen(Promise promise) {
        LocationManager locationManager = (LocationManager) mReactContext.getSystemService(Context.LOCATION_SERVICE);
        promise.resolve(locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER));
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
            promise.reject(e);
        }
    }

    @ReactMethod
    public void reloadBundle(Promise promise){
        try {
            if (!MainActivity.getInstance().isFinishing()) {
                MainActivity.getInstance().loadBundle();
            }
        } catch (Exception e){
            promise.reject(e);
        }
    }

    public static void sendShareResult(String result) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EventConst.MESSAGE_SHARERESULT, result);
    }

}
