package com.supermap.itablet.splashscreen;

import android.app.Activity;
import android.app.Dialog;
import android.content.res.Configuration;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.widget.MediaController;

import com.supermap.itablet.R;

import java.lang.ref.WeakReference;

import pl.droidsonroids.gif.GifImageView;

public class SplashScreen {
    private static Dialog mSplashDialog;
    private static WeakReference<Activity> mActivity;

    private static int intCounter = 0;
    private static Handler mHandler = new Handler();

    static GifImageView gifImageView;
    private static MediaPlayer mediaPlayer;
    private static CustomVideoView videoView;
    public final static String SDCARD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
    private static int mVideoCurrantPosition = -1;

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
                    Uri uri;
                    Boolean isPad =  (activity.getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE;
                    if (isPad) {
                        uri = Uri.parse("android.resource://" + activity.getPackageName() + "/" + R.raw.launch_video_pad);
                    } else {
                        uri = Uri.parse("android.resource://" + activity.getPackageName() + "/" + R.raw.launch_video_imobile);
                    }

                    videoView = mSplashDialog.findViewById(R.id.video_view);
                    videoView.setMediaController(new MediaController(activity));
                    videoView.setVideoURI(uri);

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

                        videoView.requestFocus();
                        videoView.start();
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
        show(activity, true);
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
//                        if (mediaPlayer != null) mediaPlayer.stop();
                        if (videoView != null) videoView.suspend();
                        isDestroyed = _activity.isDestroyed();
                    }

                    if (!_activity.isFinishing() && !isDestroyed) {
                        mSplashDialog.dismiss();
                    }
                    mSplashDialog = null;
                    mVideoCurrantPosition = -1;
                }
            }
        });
    }

    public static void pauseVideo() {
        if (videoView != null) {
            mVideoCurrantPosition = videoView.getCurrentPosition();
            videoView.pause();
        }
    }

    public static void startVideo() {
        if (videoView != null && mVideoCurrantPosition >= 0) {
            videoView.seekTo(mVideoCurrantPosition);
            videoView.start();
        }
    }
}
