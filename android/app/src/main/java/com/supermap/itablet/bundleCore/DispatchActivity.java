package com.supermap.itablet.bundleCore;

import android.content.Context;
import android.content.Intent;

import com.facebook.react.ReactActivity;
import com.supermap.itablet.R;

/**
 * @Author: shanglongyang
 * Date:        7/11/22
 * project:     iTablet
 * package:     iTablet
 * class:
 * description:
 */
public class DispatchActivity extends ReactActivity {

    public static void start(Context context) {
        Intent starter = new Intent(context, DispatchActivity.class);
        context.startActivity(starter);
    }

    @Override
    protected String getMainComponentName() {
        return BundleUtils.dispatchModel;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finish();
        overridePendingTransition(R.anim.activity_lrt, R.anim.activity_lrt);
    }
}
