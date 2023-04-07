package com.supermap.itablet.pager;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.viewpager.widget.PagerAdapter;

import java.util.ArrayList;
import java.util.List;

public class ImagePagerAdapter extends PagerAdapter {// 声明一个图像视图列表
    private List<View> mViewList = new ArrayList<>();

    // 声明一个商品信息列表
//    private List<View> mLaunchList = new ArrayList();
//    public ImagePagerAdapter(Context context, List<LaunchItem> launchList) {
//        mLaunchList = launchList;
//        // 给每个商品分配一个专用的图像视图
//        for (int i = 0; i < mLaunchList.size(); i++) {
//            String title = mLaunchList.get(i).getTitle();
//            String subTitle = mLaunchList.get(i).getSubTitle();
//            int imageID = mLaunchList.get(i).getImageId();
//
//            LaunchImageView launchImageView = new LaunchImageView(context, title, subTitle, imageID);
//
//            mViewList.add(launchImageView); // 把该商品的图像视图添加到图像视图列表
//        }
//    }

    public ImagePagerAdapter(Context context, List<View> launchList) {
        // 给每个商品分配一个专用的图像视图
        for (int i = 0; i < launchList.size(); i++) {
//            String title = mLaunchList.get(i).getTitle();
//            String subTitle = mLaunchList.get(i).getSubTitle();
//            int imageID = mLaunchList.get(i).getImageId();
//
//            LaunchImageView launchImageView = new LaunchImageView(context, title, subTitle, imageID);

            mViewList.add(launchList.get(i)); // 把该商品的图像视图添加到图像视图列表
        }
    }

//    public ImagePagerAdapter(Context context, List<LinearLayout> launchList) {
////        mLaunchList = launchList;
//        // 给每个商品分配一个专用的图像视图
//        for (int i = 0; i < mLaunchList.size(); i++) {
//            String title = mLaunchList.get(i).getTitle();
//            String subTitle = mLaunchList.get(i).getSubTitle();
//            int imageID = mLaunchList.get(i).getImageId();
//
//            LaunchImageView launchImageView = new LaunchImageView(context, title, subTitle, imageID);
//
//            mViewList.add(launchImageView); // 把该商品的图像视图添加到图像视图列表
//        }
//    }

    @Override
    public int getCount() {
        return mViewList.size();
    }

    @Override
    public boolean isViewFromObject(@NonNull View view, @NonNull Object object) {
        return view == object;
    }
    // 从容器中销毁指定位置的页面
    public void destroyItem(ViewGroup container, int position, Object object) {
        container.removeView(mViewList.get(position));
    }

    // 实例化指定位置的页面，并将其添加到容器中
    public Object instantiateItem(ViewGroup container, int position) {
        container.addView(mViewList.get(position));
        return mViewList.get(position);
    }

//    // 获得指定页面的标题文本
//    public CharSequence getPageTitle(int position) {
//        return mLaunchList.get(position).name;
//    }
}
