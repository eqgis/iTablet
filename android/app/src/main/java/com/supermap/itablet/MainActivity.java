package com.supermap.itablet;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.net.ConnectivityManager;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.rnfs.RNFSManager;
import com.supermap.RN.AppUtils;
import com.supermap.RN.appManager;
import com.supermap.RNUtils.FileTools;
import com.supermap.RNUtils.Utils;
import com.supermap.component.activity.AiGestureBoneActivity;
import com.supermap.itablet.bundleCore.BundleBean;
import com.supermap.itablet.bundleCore.BundleUtils;
import com.supermap.itablet.splashscreen.SplashScreen;

import java.io.File;

public class MainActivity extends ReactActivity {
  public final static String SDCARD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
  public static boolean isActive;
  private static MainActivity sInstance;
  private boolean isFirstOnResume = true;


  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "base";
  }


  public static MainActivity getInstance() {
    return sInstance;
  }


  @Override
  protected void onCreate(Bundle savedInstanceState) {
//        if ((getApplicationContext().getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE) {
//            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
//        } else {
//            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
//        }
    SplashScreen.show(this);
    super.onCreate(savedInstanceState);
    // 在JS申请权限以免没有权限导致崩溃
//        requestPermissions();
//        initEnvironment();
//        initDefaultData();
    appManager.getAppManager().addActivity(this);
    FileTools.saveUri(this);

    //注册网络状态监听广播
    RNFSManager.NetWorkChangReceiver netWorkChangReceiver = new RNFSManager.NetWorkChangReceiver();
    IntentFilter filter = new IntentFilter();
    filter.addAction(WifiManager.WIFI_STATE_CHANGED_ACTION);
    filter.addAction(WifiManager.NETWORK_STATE_CHANGED_ACTION);
    filter.addAction(ConnectivityManager.CONNECTIVITY_ACTION);
    registerReceiver(netWorkChangReceiver, filter);
    sInstance = this;

    if (MainApplication.isBundle) {
      createContext();
    }
  }

  @Override
  protected void onResume() {
    super.onResume();
    if(!isFirstOnResume){
      SharedPreferences shared=this.getSharedPreferences("gestureBoneCamera", Context.MODE_PRIVATE);   //获取操作类
      boolean isBackground = shared.getBoolean("isGestureBoneAct",false);
      if(isBackground){
        this.startActivity(new Intent(this, AiGestureBoneActivity.class));
      }
    }
    isFirstOnResume = false;
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    this.sendBroadcast(intent);
  }
  @Override
  public void onNewIntent(Intent intent) {

    super.onNewIntent(intent);

    setIntent(intent);
    FileTools.getUriState(this);
    //must store the new intent unless getIntent() will return the old one
  }

  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
//        if(keyCode == KeyEvent.KEYCODE_BACK) { //监控/拦截/屏蔽返回键
//            return true;
//        }
    return super.onKeyDown(keyCode, event);
  }

  private void createContext() {
    final ReactInstanceManager manager = ((ReactApplication)getApplication()).getReactNativeHost().getReactInstanceManager();
    if (!manager.hasStartedCreatingInitialContext()) {
      manager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
        @Override
        public void onReactContextInitialized(ReactContext context) {
//          loadBundle("base");
//          IntentModule.loadBundle("base");
        }
      });
      ((ReactApplication)getApplication()).getReactNativeHost().getReactInstanceManager().createReactContextInBackground();
    }
  }

  private void loadBundle(String bundle) {
    // 若没有加载bundle则加载，并记录到DispatchUtils中
    if (!BundleUtils.findLoadedBundle(bundle)) {
      String bundlePath = "assets://bundles/" + bundle + "/" + bundle + ".bundle";
      IntentModule.loadBundleFromAssets(bundlePath);
      BundleBean bundleBean = new BundleBean();
      bundleBean.setPath(bundlePath);
      BundleUtils.addLoadedBundle(bundleBean);
    }
//    BundleUtils.dispatchModel = bundle;
//    DispatchActivity.start(MainActivity.this);
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == AppUtils.REQUEST_CODE && Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      AppUtils.onPermissionResult(android.os.Environment.isExternalStorageManager());
    }
  }

//  private void requestPermissions() {
//    RxPermissions rxPermission = new RxPermissions(this);
//    rxPermission
//        .requestEach(android.Manifest.permission.READ_PHONE_STATE,
//            android.Manifest.permission.ACCESS_FINE_LOCATION,
//            android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
//            android.Manifest.permission.READ_EXTERNAL_STORAGE,
//            android.Manifest.permission.KILL_BACKGROUND_PROCESSES,
//            android.Manifest.permission.RECORD_AUDIO,
//            Manifest.permission.CAMERA)
//        .subscribe(new Consumer<Permission>() {
//          @Override
//          public void accept(Permission permission) throws Exception {
//            if (permission.granted) {
//              // 用户已经同意该权限
//              Log.d("RxPermissionTest", permission.name + " is granted.");
//            } else if (permission.shouldShowRequestPermissionRationale) {
//              // 用户拒绝了该权限，没有选中『不再询问』（Never ask again）,那么下次再次启动时，还会提示请求权限的对话框
//              Log.d("RxPermissionTest", permission.name + " is denied. More info should be provided.");
//            } else {
//              // 用户拒绝了该权限，并且选中『不再询问』
//              Log.d("RxPermissionTest", permission.name + " is denied.");
//            }
//          }
//        });
//  }
//
//  private boolean isTablet(Activity context) {
//    return (context.getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE;
//  }

//  public void loadBundle() {
//    final ReactInstanceManager instanceManager;
//    try {
//
//      instanceManager = resolveInstanceManager();
//      if (instanceManager == null) {
//        return;
//      }
//
//      //获取本地的js代码 这里就不给出代码了。 如果本地没有就返回assets目录的
////            String latestJSBundleFile = Utils.getJSBundleFileInternal();
//      String latestJSBundleFile = getJSBundleFileInternal();
//
//      setJSBundle(instanceManager, latestJSBundleFile);
//
//      new Handler(Looper.getMainLooper()).post(new Runnable() {
//        @Override
//        public void run() {
//          try {
//
//            instanceManager.recreateReactContextInBackground();
//          } catch (Exception e) {
//            // The recreation method threw an unknown exception
//            // so just simply fallback to restarting the Activity (if it exists)
//            loadBundleLegacy();
//          }
//        }
//      });
//    }  catch (Exception e) {
//      e.printStackTrace();
//      loadBundleLegacy();
//    }
//  }

//  private String getJSBundleFileInternal() {
//    String path = AppInfo.getBundleFile();
//    if (path != null && new File(path).exists()) {
//      return path;
//    }
//    return "assets://index.android.bundle";
//  }

//  private ReactInstanceManager resolveInstanceManager(){
//    ReactInstanceManager instanceManager;
//    final Activity currentActivity = MainActivity.this;
//    if (currentActivity == null) {
//      return null;
//    }
//    ReactApplication reactApplication = (ReactApplication) currentActivity.getApplication();
//    instanceManager = reactApplication.getReactNativeHost().getReactInstanceManager();
//
//    return instanceManager;
//  }
//
//  private void setJSBundle(ReactInstanceManager instanceManager, String latestJSBundleFile) throws IllegalAccessException {
//    try {
//      JSBundleLoader latestJSBundleLoader;
//      if (latestJSBundleFile.toLowerCase().startsWith("assets://")) {
//        latestJSBundleLoader = JSBundleLoader.createAssetLoader(getApplicationContext(), latestJSBundleFile, false);
//      } else {
//        latestJSBundleLoader = JSBundleLoader.createFileLoader(latestJSBundleFile);
//      }
//      Field bundleLoaderField = instanceManager.getClass().getDeclaredField("mBundleLoader");
//      bundleLoaderField.setAccessible(true);
//      bundleLoaderField.set(instanceManager, latestJSBundleLoader);
//    } catch (Exception e) {
//      throw new IllegalAccessException("Could not setJSBundle");
//    }
//  }
//
//  private void loadBundleLegacy() {
//    Log.d("loadBundleLegacy","loadBundle #3 loadBundleLegacy...");
//    final Activity currentActivity =  MainActivity.this;
//    if (currentActivity == null) {
//      // The currentActivity can be null if it is backgrounded / destroyed, so we simply
//      // no-op to prevent any null pointer exceptions.
//      return;
//    }
//    currentActivity.runOnUiThread(new Runnable() {
//      @Override
//      public void run() {
//        currentActivity.recreate();
//      }
//    });
//  }
}
