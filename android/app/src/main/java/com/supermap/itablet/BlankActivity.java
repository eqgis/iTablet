package com.supermap.itablet;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.Settings;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.viewpager.widget.ViewPager;

import com.supermap.RN.appManager;
import com.supermap.itablet.pager.ImagePagerAdapter;
import com.supermap.itablet.splashscreen.SplashScreen;

import java.util.ArrayList;
import java.util.List;

public class BlankActivity extends AppCompatActivity implements ViewPager.OnPageChangeListener {
    //动态获取权限需要添加的常量
    private static final int REQUEST_EXTERNAL_STORAGE = 1;
    private static String[] PERMISSIONS_STORAGE = {
            "android.permission.READ_EXTERNAL_STORAGE",
            "android.permission.WRITE_EXTERNAL_STORAGE" };

    Button exitButton, applyButton;
    TextView tipsTxt, applyTxt;

    androidx.constraintlayout.widget.ConstraintLayout nextBtn_1;
    androidx.constraintlayout.widget.ConstraintLayout nextBtn_2;
    androidx.constraintlayout.widget.ConstraintLayout applyImgTxtBtn;

    View view1, view2, view3;

    TextView textView1;
    TextView subTextView1;

    TextView textView2;
    TextView subTextView2;

    TextView textView3;
    TextView subTextView3;

    Context mContext;
    public ActivityResultLauncher<Intent> intentActivityResultLauncher;

    private List<View> launchList;

    private ViewPager viewPager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_blank);
        setContentView(R.layout.launch_pager);

        mContext = this;
        appManager.getAppManager().addActivity(this);

        if (checkPermissions()) {
            new Thread(){
                public void run(){
                    try {
                        sleep(2000);
                        goToApp();
                        SplashScreen.hide(BlankActivity.this);
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                }
            }.start();
        } else {
//            initView();
            initLaunchView();
        }

    }

//    @Override
//    protected void onPause() {
//        super.onPause();
//    }

    //    public void initView() {
//        intentActivityResultLauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
//            if (checkPermissions()) {
//                goToApp();
//            }
//        });
//
//        TextView tipsTxt = findViewById(R.id.blank_tips);
//        tipsTxt.setVisibility(View.VISIBLE);
//
//        exitButton = findViewById(R.id.blank_exit);
//        Button applyButton = findViewById(R.id.blank_request_permissions);
//
//        SharedPreferences pref = getApplicationContext().getSharedPreferences("SmData", 0);
//        String language = pref.getString("language","");
//        if (language == null || language.equals("")) {
//            language = "CN";
//        }
//
//        if (language.equals("CN")) {
//            exitButton.setText("退出APP");
//            applyButton.setText("申请权限");
//            tipsTxt.setText("App需要申请文件读写权限");
//        } else {
//            exitButton.setText("Exit");
//            applyButton.setText("Permissions");
//            tipsTxt.setText("App needs to apply for file read and write permissions");
//        }
//
//        exitButton.setVisibility(View.VISIBLE);
//        applyButton.setVisibility(View.VISIBLE);
//
//        applyButton.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                requestPermissions();
//            }
//        });
//
//        exitButton.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                BlankActivity.this.finish();
//                System.exit(0);
//            }
//        });
//    }

    public void initLaunchView() {
        intentActivityResultLauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
            if (checkPermissions()) {
                goToApp();
            }
        });

        SharedPreferences pref = getApplicationContext().getSharedPreferences("SmData", 0);
        String language = pref.getString("language","");
        if (language == null || language.equals("")) {
            language = "CN";
        }

        view1 = View.inflate(this, R.layout.launch_image_viewer1, null);
        view2 = View.inflate(this, R.layout.launch_image_viewer2, null);
        view3 = View.inflate(this, R.layout.launch_image_viewer3, null);

        textView1 = view1.findViewById(R.id.launch_title_1);
        subTextView1 = view1.findViewById(R.id.launch_subtitle_1);
        nextBtn_1 = view1.findViewById(R.id.launch_next_1);

        textView2 = view2.findViewById(R.id.launch_title_2);
        subTextView2 = view2.findViewById(R.id.launch_subtitle_2);
        nextBtn_2 = view2.findViewById(R.id.launch_next_2);

        textView3 = view3.findViewById(R.id.launch_title_3);
        subTextView3 = view3.findViewById(R.id.launch_subtitle_3);

//        applyButton = view3.findViewById(R.id.launch_apply_btn);
        applyImgTxtBtn = view3.findViewById(R.id.launch_applyBtn);
        applyTxt = view3.findViewById(R.id.applyTxt);
        exitButton = view3.findViewById(R.id.launch_exit_btn);

        nextBtn_1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                viewPager.setCurrentItem(1);
            }
        });

        nextBtn_2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                viewPager.setCurrentItem(2);
            }
        });

        applyImgTxtBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                requestPermissions();
            }
        });

        exitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                BlankActivity.this.finish();
                System.exit(0);
            }
        });

        if (language.equals("CN")) {
            textView1.setText("AR测图");
            subTextView1.setText("AR快速测量，矢量数据采集");
            textView2.setText("专题地图");
            subTextView2.setText("指滑制作20+专题图");
            textView3.setText("室内外导航");
            subTextView3.setText("编译路网，实时导航");
//            applyButton.setText("申请权限");
            applyTxt.setText("申请权限");
            exitButton.setText("退出APP");
        } else {
            textView1.setText("AR Surveying");
            subTextView1.setText("Surveying with AR, collecting vector data");
            textView2.setText("Thematic Map");
            subTextView2.setText("Supporting 20+ thematic maps");
            textView3.setText("Navigation");
            subTextView3.setText("Compiling road net, navigating instantly");
//            applyButton.setText("Apply Permissions");
            applyTxt.setText("Apply Permissions");
            exitButton.setText("Exit");
        }

        launchList = new ArrayList<>();
        launchList.add(view1);
        launchList.add(view2);
        launchList.add(view3);

//        String title1, title2, title3;
//        String subTitle1, subTitle2, subTitle3;
//        int imgID1, imgID2, imgID3;
//        if (language.equals("CN")) {
//            title1 = "AR测图";
//            subTitle1 = "AR快速测量，矢量数据采集";
//            title2 = "专题地图";
//            subTitle2 = "指滑制作20+专题图";
//            title3 = "室内外导航";
//            subTitle3 = "编译路网，实时导航";
//        } else {
//            title1 = "AR Surveying";
//            subTitle1 = "Surveying with AR, collecting vector data";
//            title2 = "Thematic Map";
//            subTitle2 = "Supporting 20+ thematic maps";
//            title3 = "Navigation";
//            subTitle3 = "Compiling road net, navigating instantly";
//        }
//        imgID1 = R.drawable.ar_analyst;
//        imgID2 = R.drawable.theme;
//        imgID3 = R.drawable.navigation;
//
//        launchList = new ArrayList<>();
//
//        launchList.add(new LaunchItem(title1, subTitle1, imgID1));
//        launchList.add(new LaunchItem(title2, subTitle2, imgID2));
//        launchList.add(new LaunchItem(title3, subTitle3, imgID3));

        viewPager = findViewById(R.id.image_pager);

        ImagePagerAdapter imagePagerAdapter = new ImagePagerAdapter(this, launchList);

        viewPager.setAdapter(imagePagerAdapter);
        viewPager.setCurrentItem(0);
        viewPager.addOnPageChangeListener(this);



        new Thread(){
            public void run(){
                try {
                    sleep(2000);
                    SplashScreen.hide(BlankActivity.this);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }.start();
    }

    public void goToApp() {
        MainApplication.getInstance().initEnvironment();
        Intent intent = new Intent(BlankActivity.this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        this.startActivity(intent);
        overridePendingTransition(R.anim.sm_fade_in, R.anim.sm_fade_out);
    }

    public boolean checkPermissions() {
        int permission = ActivityCompat.checkSelfPermission(this,
                "android.permission.WRITE_EXTERNAL_STORAGE");
        boolean hasPermission = permission == PackageManager.PERMISSION_GRANTED;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && !Environment.isExternalStorageManager()) {
            hasPermission = false;
        }
        return hasPermission;
    }

//    @SuppressLint("CheckResult")
    private void requestPermissions() {
        if (!checkPermissions()) {
            // 没有写的权限，去申请写的权限，会弹出对话框
            ActivityCompat.requestPermissions(this, PERMISSIONS_STORAGE, REQUEST_EXTERNAL_STORAGE);
        } else {
            requestPermissionR();
        }
    }

    private void requestPermissionR() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && !Environment.isExternalStorageManager()) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
            intent.setData(Uri.parse("package:" + this.getPackageName()));
            intentActivityResultLauncher.launch(intent);
        } else {
            goToApp();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        boolean isGrant = true;
        // 判断是否有读写权限
        for (int i = 0; i < permissions.length; i++) {
            if (permissions[i].equals("android.permission.READ_EXTERNAL_STORAGE")) {
                isGrant = isGrant && grantResults[i] == 0;
            } else if (permissions[i].equals("android.permission.WRITE_EXTERNAL_STORAGE")) {
                isGrant = isGrant && grantResults[i] == 0;
            }
        }
        // 若有读写权限，则检测R版本的读写权限
        if (isGrant) {
            requestPermissionR();
        }
    }

    @Override
    public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

    }

    @Override
    public void onPageSelected(int position) {

    }

    @Override
    public void onPageScrollStateChanged(int state) {

    }
}