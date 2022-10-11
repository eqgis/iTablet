package com.supermap.itablet.splashscreen;

import android.app.Activity;
import android.app.Dialog;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Handler;

import com.supermap.itablet.R;

import java.lang.ref.WeakReference;

import pl.droidsonroids.gif.GifImageView;

public class SplashScreen {
    private static Dialog mSplashDialog;
    private static WeakReference<Activity> mActivity;

    private static int intCounter = 0;
    private static Handler mHandler = new Handler();

    static GifImageView gifImageView;

    private static Runnable fadeInTask = new Runnable() {
        public void run() {
            if (intCounter < 17) {
                intCounter = intCounter + 1;
                gifImageView.setImageAlpha(intCounter * 15);
                mHandler.postDelayed(fadeInTask, 50);
            } else {
                intCounter = 0;
            }
        }
    };

    /**
     * 打开启动屏
     */
    public static void show(final Activity activity, final int themeResId) {
        if (activity == null) return;
        mActivity = new WeakReference<Activity>(activity);
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (!activity.isFinishing()) {
                    mSplashDialog = new Dialog(activity, themeResId);
                    mSplashDialog.setContentView(R.layout.launch_screen_img);
//                    gifImageView = mSplashDialog.findViewById(R.id.slogan);
//
//                    SharedPreferences pref = activity.getApplicationContext().getSharedPreferences("SmData", 0);
//                    String language = pref.getString("language","");
//                    if (language == null || language.equals("")) {
//                        language = "CN";
//                    }
//
//                    if (!language.equals("CN") && !language.equals("")) {
//                        gifImageView.setImageResource(R.drawable.launch_slogan_en);
//                    } else {
//                        gifImageView.setImageResource(R.drawable.launch_slogan_cn);
//                    }

                    mSplashDialog.setCancelable(false);

                    if (!mSplashDialog.isShowing()) {
                        mSplashDialog.show();
                    }
                }
            }
        });
    }

    /**
     * 打开启动屏
     */
    public static void show(final Activity activity, final boolean fullScreen) {
        int resourceId = fullScreen ? R.style.SplashScreen_Fullscreen : R.style.SplashScreen_SplashTheme;

//        mHandler.post(fadeInTask);

        show(activity, resourceId);
    }

    /**
     * 打开启动屏
     */
    public static void show(final Activity activity) {
        show(activity, false);
    }

    /**
     * 关闭启动屏
     */
    public static void hide(Activity activity) {
        if (activity == null) {
            if (mActivity == null) {
                return;
            }
            activity = mActivity.get();
        }

        if (activity == null) return;

        final Activity _activity = activity;

        _activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (mSplashDialog != null && mSplashDialog.isShowing()) {
                    boolean isDestroyed = false;

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
                        isDestroyed = _activity.isDestroyed();
                    }

                    if (!_activity.isFinishing() && !isDestroyed) {
                        mSplashDialog.dismiss();
                    }
                    mSplashDialog = null;
                }
            }
        });
    }
}
