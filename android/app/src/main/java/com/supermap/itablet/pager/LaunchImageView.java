package com.supermap.itablet.pager;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.supermap.itablet.R;

public class LaunchImageView extends LinearLayout {
    private LinearLayout linearLayout;

    private String title;
    private String subTitle;
    private TextView titleView;
    private TextView subTitleView;
    private ImageView imageView;

    @SuppressLint("ResourceType")
    public LaunchImageView(Context context, String title, String subTitle, int imageId) {
        super(context);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        setLayoutParams(layoutParams);
        setBackgroundColor(android.graphics.Color.parseColor("#FF00FF"));

        titleView = new TextView(context);
        titleView.setText(title);
        titleView.setTextSize(44);
        ViewGroup.LayoutParams titleParams = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
//        titleParams.setMargins(0, 102, 0, 0);
        titleView.setLayoutParams(titleParams);
        titleView.setGravity(TEXT_ALIGNMENT_CENTER);

        subTitleView = new TextView(context);
        subTitleView.setText(subTitle);
        subTitleView.setTextSize(24);
        ViewGroup.LayoutParams subTitleParams = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
//        subTitleParams.setMargins(0, 22, 0, 0);
        subTitleView.setLayoutParams(subTitleParams);
        subTitleView.setGravity(TEXT_ALIGNMENT_CENTER);

        imageView = new ImageView(context);
        ViewGroup.LayoutParams imgParams = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,350);
//        imgParams.setMargins(0, 42, 0, 0);
        imageView.setLayoutParams(imgParams);
        imageView.setImageResource(imageId);

        addView(titleView);
        addView(subTitleView);
        addView(imageView);

//        this.title = title;
//        this.subTitle = subTitle;
//
//        this.titleView = findViewById(R.id.launch_title);
//        this.titleView.setText(title);
//
//        this.subTitleView = findViewById(R.id.launch_subtitle);
//        this.subTitleView.setText(subTitle);
//
//        this.imageView = findViewById(R.id.launch_img);
//        this.imageView.setImageResource(imageId);
    }
}
