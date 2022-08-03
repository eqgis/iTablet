package com.supermap.itablet.bundleCore;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactInstanceManagerBuilder;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactRootView;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.shell.MainReactPackage;
import com.supermap.itablet.BuildConfig;
import com.supermap.itablet.R;

import java.io.File;
import java.util.List;

/**
 * @Author: shanglongyang
 * Date:        7/11/22
 * project:     iTablet
 * package:     iTablet
 * class:
 * description:
 */
public class AppActivity extends ReactActivity {

    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;
    private ReactNativeHost reactNativeHost;

    @Override
    protected String getMainComponentName() {
        return BundleUtils.dispatchModel;
    }

//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//
//////        Intent intent = this.getIntent();
//////        //从前一个MainActivity获取参数
//////        String appletName = intent.getStringExtra("appletName");
////        Bundle bundle = new Bundle();
////        bundle.putString("appletName", BundleUtils.dispatchModel);
////
////        mReactRootView = new ReactRootView(this);
////        mReactInstanceManager = ReactInstanceManager.builder()
////            .setApplication(getApplication())
////            .setBundleAssetName("index.android.bundle") //可远程地址
//////            .setJSMainModuleName("index.android")//根目录下index.android.js文件
////            .setJSBundleFile(getJSBundleFile())
////            .addPackage(new MainReactPackage())//如果为true，则会启用诸如JS重新加载和调试之类的开发人员选项.反之打包
//////            .setUseDeveloperSupport(BuildConfig.DEBUG)
////            .setInitialLifecycleState(LifecycleState.BEFORE_CREATE)
////            .build();
////        //将参数传递到RN端
////        mReactRootView.startReactApplication(mReactInstanceManager, BundleUtils.dispatchModel, bundle);
//
//        mReactRootView = new ReactRootView(this);
//        reactNativeHost = new ReactNativeHost(getApplication()) {
//            @Override
//            public boolean getUseDeveloperSupport() {
//                return false;
//            }
//
//            @Override
//            protected List<ReactPackage> getPackages() {
//                return null;
//            }
//
//            @Override
//            protected ReactInstanceManager createReactInstanceManager() {
//                ReactInstanceManagerBuilder builder = ReactInstanceManager.builder()
//                    .setApplication(getApplication())
//                    .setJSMainModulePath(getJSMainModuleName())
//                    .setUseDeveloperSupport(getUseDeveloperSupport())
//                    .setRedBoxHandler(getRedBoxHandler())
//                    .setJavaScriptExecutorFactory(getJavaScriptExecutorFactory())
////                    .setUIImplementationProvider(getUIImplementationProvider())
//                    .setJSIModulesPackage(getJSIModulePackage())
////              .setUseDeveloperSupport(BuildConfig.DEBUG)
//                    .setInitialLifecycleState(LifecycleState.BEFORE_CREATE);
//
//                for (ReactPackage reactPackage : getPackages()) {
//                    builder.addPackage(reactPackage);
//                }
//                String jsBundleFile = getJSBundleFile();
//                if (jsBundleFile != null) {
//                    builder.setJSBundleFile(jsBundleFile);
//                } else {
//                    builder.setBundleAssetName(Assertions.assertNotNull(getBundleAssetName()));
//                }
//                mReactInstanceManager = builder.build();
//
//                mReactRootView.startReactApplication(mReactInstanceManager, BundleUtils.dispatchModel);
//                setContentView(mReactRootView);
//
//                return mReactInstanceManager;
//            }
//        };
//    }
//
//    public String getJSBundleFile() {
//        String path = BundleUtils.dispatchModelUrl;
//        if (
//            (path == null || path.equals("")) &&
//                !BundleUtils.dispatchModel.equals("")
//        ) {
//            path = getFilesDir().getAbsolutePath() + "/bundles/" + BundleUtils.dispatchModel + "/" + BundleUtils.dispatchModel + ".bundle";
//        }
//        if (!(new File(path).exists())) {
//            path = null;
//        }
//        return path;
//    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new MyReactActivityDelegate(this, getMainComponentName());
    }


    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostResume(this, this);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostDestroy(this);
        }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finish();
        overridePendingTransition(R.anim.activity_lrt, R.anim.activity_lrt);
    }
}
