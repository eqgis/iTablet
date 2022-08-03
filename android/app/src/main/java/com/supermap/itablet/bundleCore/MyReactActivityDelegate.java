package com.supermap.itablet.bundleCore;

import android.app.Activity;
import android.content.Context;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactNativeHost;

import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;

/**
 * @Author: shanglongyang
 * Date:        8/3/22
 * project:     iTablet
 * package:     iTablet
 * class:
 * description:
 */
public class MyReactActivityDelegate extends ReactActivityDelegate {

  private final @Nullable
  Activity mActivity ;
  private final @Nullable
  FragmentActivity mFragmentActivity;
  private final @Nullable String mMainComponentName ;

  public MyReactActivityDelegate(ReactActivity activity, @Nullable String mainComponentName) {
    super(activity, mainComponentName);
    mActivity = activity;
    mMainComponentName = mainComponentName;
    mFragmentActivity = null;
  }

  public MyReactActivityDelegate(FragmentActivity fragmentActivity, @Nullable String mainComponentName) {
    super(fragmentActivity, mainComponentName);
    mFragmentActivity = fragmentActivity;
    mMainComponentName = mainComponentName;
    mActivity = null;
  }

  @Override
  protected ReactNativeHost getReactNativeHost() {
    return ((MyReactApplication) getPlainActivity().getApplication()).getReactNativeMyHost();
  }

  protected Context getContext() {
    if (mActivity != null) {
      return mActivity;
    }
    return Assertions.assertNotNull(mFragmentActivity);
  }

  protected Activity getPlainActivity() {
    return ((Activity) getContext());
  }
}
