package com.supermap.collection;

import androidx.multidex.MultiDexApplication;

import com.beefe.picker.PickerViewPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.infer.annotation.Assertions;
import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactInstanceManagerBuilder;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.github.yamill.orientation.OrientationPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.reactnative.photoview.PhotoViewPackage;
//import com.rnfs.RNFSPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.supermap.RNUtils.AppInfo;
//import com.supermap.SupermapFullPackage;
import com.supermap.file.CrashHandler;
import com.supermap.rnsupermap.BuildConfig;
import com.supermap.rnsupermap.SupermapFullPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;

import org.reactnative.camera.RNCameraPackage;

import java.io.File;
import java.util.Arrays;
import java.util.List;

import javax.annotation.Nullable;

import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
//import cn.jpush.reactnativejpush.JPushPackage;
import cn.qiuxiang.react.geolocation.AMapGeolocationPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;

public class MainApplication extends MultiDexApplication implements ReactApplication {
    public static String SDCARD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/";
    private static MainApplication sInstance = null;
    private static ReactInstanceManager mReactInstanceManager;
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new RNFetchBlobPackage(),
            new CookieManagerPackage(),
            new ImageResizerPackage(),
            new PhotoViewPackage(),
            new PickerViewPackage(),
            new RNGestureHandlerPackage(),
            new ExtraDimensionsPackage(),
            new BackgroundTimerPackage(),
            new RNCameraPackage(),
//            new JPushPackage(!BuildConfig.DEBUG, !BuildConfig.DEBUG),
            new ReactVideoPackage(),
//            new JPushPackage(!BuildConfig.DEBUG, !BuildConfig.DEBUG),
//            new JPushPackage(true, true),
            new ReactNativeContacts(),
            new AMapGeolocationPackage(),
            new OrientationPackage(),
                    new SupermapFullPackage(),
                    new MyReactpackge()

            );
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
    
    public static ReactInstanceManager getReactInstanceManager() {
        return mReactInstanceManager;
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    public static MainApplication getInstance() {
        return sInstance;
    }

    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SupermapFullPackage(),
              new MyReactpackge(),
              new OrientationPackage()
      );
    }

    @Override
    public void onCreate() {
        super.onCreate();
        sInstance = this;
        SoLoader.init(this, /* native exopackage */ false);
        CrashHandler.getInstance().init(getApplicationContext());
    }

}