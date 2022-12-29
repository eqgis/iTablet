package com.supermap.itablet;

import android.app.Application;
import android.content.Context;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactInstanceManagerBuilder;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.common.LifecycleState;
import com.facebook.soloader.SoLoader;
import com.supermap.bundleCore.BundleUtils;

import java.io.File;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import javax.annotation.Nullable;

public class MainApplication extends Application implements ReactApplication {
  public static String SDCARD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/";
  private static MainApplication sInstance = null;
  private static ReactInstanceManager mReactInstanceManager;
  // 打包或测试bundle时为true，需要打包base.bundle，调试iTablet代码时为false
  public static boolean isBundle = true;

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
//            return false;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          packages.add(new MyReactpackge());
          return packages;
        }

        // Debug模式必备
        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

//        @Override
//        protected String getBundleAssetName() {
////            return "bundles/common.bundle";
//            return "bundles/base/base.bundle";
//        }

        @Nullable
        @Override
        protected String getJSBundleFile() {
          if (!isBundle) return null;
          // 指定base.bundle路径
          String path = getFilesDir().getAbsolutePath() + "/bundles/base/base.bundle";
          if (!(new File(path).exists())) {
            path = null;
          }
          return path;
        }

        @Override
        protected ReactInstanceManager createReactInstanceManager() {
          ReactInstanceManagerBuilder builder = ReactInstanceManager.builder()
              .setApplication(getApplication())
              .setJSMainModulePath(getJSMainModuleName())
              .setUseDeveloperSupport(getUseDeveloperSupport())
              .setRedBoxHandler(getRedBoxHandler())
              .setJavaScriptExecutorFactory(getJavaScriptExecutorFactory())
              .setJSIModulesPackage(getJSIModulePackage())
              .setInitialLifecycleState(LifecycleState.BEFORE_CREATE);

          for (ReactPackage reactPackage : getPackages()) {
            builder.addPackage(reactPackage);
          }
          String jsBundleFile = getJSBundleFile();
          if (jsBundleFile != null) {
            builder.setJSBundleFile(jsBundleFile);
          } else {
            builder.setBundleAssetName(Assertions.assertNotNull(getBundleAssetName()));
          }
          mReactInstanceManager = builder.build();
          return mReactInstanceManager;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  public static MainApplication getInstance() {
    return sInstance;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    sInstance = this;
    // 打包或测试bundle时开启，必须在initializeFlipper之前执行
    if (isBundle) {
      BundleUtils.initBundle(this);
    }
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.itablet.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
