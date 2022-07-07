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
import com.supermap.itablet.BuildConfig;
import com.supermap.RNUtils.AppInfo;

import java.io.File;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import javax.annotation.Nullable;

public class MainApplication extends Application implements ReactApplication {
  public static String SDCARD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/";
  private static MainApplication sInstance = null;
  private static ReactInstanceManager mReactInstanceManager;

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
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

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
        @Nullable
        @Override
        protected String getJSBundleFile() {
          String path = AppInfo.getBundleFile();
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
//                    .setUIImplementationProvider(getUIImplementationProvider())
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
