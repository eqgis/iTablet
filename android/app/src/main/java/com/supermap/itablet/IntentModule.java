package com.supermap.itablet;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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
    public static void loadBundle(String bundlePath, Promise promise) {
        try {
//            String source = bundlePath;
//            if (!bundlePath.startsWith("file://")) {
//                source = "file://" + source;
//            }
//            String source = context.getFilesDir().getAbsolutePath() + "/bundles/tour/tour.bundle
//            String source = SDCARD + "/iTablet/Bundles/tour/tour.bundle";
//            context.getCatalystInstance().loadScriptFromFile(source, source, false);

            String source = "assets://bundles/tour/tour.bundle";
            context.getCatalystInstance().loadScriptFromAssets(context.getAssets(), source, false);
            promise.resolve(true);
        } catch (Exception e) {
            e.printStackTrace();
            promise.resolve(false);
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

