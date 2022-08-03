package com.supermap.itablet.bundleCore;

import android.content.Context;

import com.supermap.RNUtils.FileTools;
import com.supermap.RNUtils.FileUtil;
import com.supermap.RNUtils.Utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;

/**
 * @Author: shanglongyang
 * Date:        7/11/22
 * project:     iTablet
 * package:     iTablet
 * class:
 * description: 记录加载的bundle信息
 */
public class BundleUtils {
    static public String dispatchModel = "demo";
    static public String dispatchModelUrl = "";

    /** 已加载的小程序 */
    static private ArrayList<BundleBean> loadedBundles = new ArrayList<>();

    static public void addLoadedBundle(BundleBean appletBundle) {
        loadedBundles.add(appletBundle);
    }

    static public ArrayList<BundleBean> getLoadedBundle() {
        return loadedBundles;
    }

    static public boolean findLoadedBundle(String bundlePath) {
        try {
            for (int i = 0; i < loadedBundles.size(); i++) {
                BundleBean bundleBean = loadedBundles.get(i);
                if (bundleBean.getPath() != null && bundleBean.getPath().equals(bundlePath)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    static public BundleStatus findLoadedBundle(BundleBean bundle) {
        try {
            for (int i = 0; i < loadedBundles.size(); i++) {
                BundleBean bundleBean = loadedBundles.get(i);
//            if (bundleBean.getPath() != null && bundleBean.getPath().equals(bundle.getPath())) {
//                return true;
//            }
                BundleStatus status = compareBundles(bundleBean, bundle);
                if (status != BundleStatus.NOT_EXIST) {
                    return status;
                }
            }
            return BundleStatus.NOT_EXIST;
        } catch (Exception e) {
            e.printStackTrace();
            return BundleStatus.NOT_EXIST;
        }
    }

    static public boolean removeLoadedBundle(BundleBean bundle) {
        try {
            for (int i = 0; i < loadedBundles.size(); i++) {
                BundleBean bundleBean = loadedBundles.get(i);
                BundleStatus status = compareBundles(bundleBean, bundle);
                if (status != BundleStatus.NOT_EXIST) {
                    loadedBundles.remove(i);
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    static public BundleStatus compareBundles(BundleBean bundle1, BundleBean bundle2) {
        try {
            // 路径和名称都不相同时，则表示不存在
            if (
                    !bundle1.getName().equals(bundle2.getName()) &&
                            !bundle1.getPath().equals(bundle2.getPath())
            ) {
                return BundleStatus.NOT_EXIST;
            }
            // 路径（含名称）和md5都相同时，则表示存在
            if (
                    bundle1.getPath().equals(bundle2.getPath()) &&
                            bundle1.getMd5().equals(bundle2.getMd5())
            ) {
                return BundleStatus.EXIST;
            }
            long time1 = Long.parseLong(bundle1.getCreate_date());
            long time2 = Long.parseLong(bundle2.getCreate_date());
            if (time1 >= time2) {
                return BundleStatus.OLDER;
            } else {
                return BundleStatus.NEED_UPDATE;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return BundleStatus.NOT_EXIST;
        }
    }

    static public String getBundleConfig(String bundlePath) {
        try {
            File file = new File(bundlePath);
            FileInputStream is = new FileInputStream(file);

            int length = is.available();

            byte[] buffer = new byte[length];

            is.read(buffer);

            String result = new String(buffer, "utf8");

            return result;

        } catch(IOException e) {

            return "";

        }
    }

    static public boolean initBundle(Context context) {
        boolean result = false;
        try {
            String baseBundleDirPath = context.getFilesDir().getAbsolutePath() + "/bundles/";
            if (!new File(baseBundleDirPath).exists()) {
                new File(baseBundleDirPath + "base").mkdirs();
            }
            // TODO 对比base包是否需要更新
            if (!new File(baseBundleDirPath + "base/index.android.bundle").exists()) {
                if (!Utils.fileIsExist(baseBundleDirPath + "base.zip")) {
                    Utils.copyAssetFileToSDcard(context, baseBundleDirPath, "base.zip", "base.zip");
                }
                if (Utils.fileIsExist(baseBundleDirPath + "base.zip")) {
                    result = FileTools.unZipFile(baseBundleDirPath + "base.zip", baseBundleDirPath);
                }
            } else {
                result = true;
            }

            // 删除zip包
            if (result && Utils.fileIsExist(baseBundleDirPath + "base.zip")) {
                Utils.deleteFile(baseBundleDirPath + "base.zip");
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            return result;
        }
    }

    /**
     * 把bundle zip包拷贝到app文件目录下，并解压，然后把图片合并到base中
     * @param context
     * @param bundleZipPath bundle zip文件位置
     * @return
     */
    static public String loadBundleFromDisk(Context context, String bundleZipPath) {
        boolean result = false;
        String bundlePath = "";
        try {
            File file = new File(bundleZipPath);
            if (!file.exists()) {
                return bundlePath;
            }
            String baseBundleDirPath = context.getFilesDir().getAbsolutePath() + "/bundles/";
            if (!new File(baseBundleDirPath).exists()) {
                return bundlePath;
            }

            String bundleName = bundleZipPath.substring(bundleZipPath.lastIndexOf("/") + 1, bundleZipPath.lastIndexOf("."));

            // 解压到app文件目录中
            result = FileTools.unZipFile(bundleZipPath, baseBundleDirPath);

            // 移动解压后bundle文件中的图片到base文件中
            if (result) {
                File bundleDir = new File(baseBundleDirPath + bundleName);
                if (!bundleDir.exists()) {
                    return bundlePath;
                }
                File[] files = bundleDir.listFiles();
                for (int i = 0; i < files.length; i++) {
                    if (files[i].getName().endsWith(".bundle")) {
                        bundlePath = files[i].getAbsolutePath();
                        break;
                    }
//                    if (
//                            files[i].isDirectory() &&
//                            (
//                                    files[i].getName().contains("raw") ||
//                                    files[i].getName().contains("drawable") ||
//                                    files[i].getName().contains("mipmap")
//                            )
//                    ) {
//                        result = FileUtil.copyDirFromPath(files[i].getAbsolutePath(), baseBundleDirPath + "base/" + files[i].getName());
//                        if (result) {
//                            // 拷贝完成后，删除原来的图片文件夹
//                            Utils.delDir(files[i].getAbsolutePath());
//                        }
//                    }
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            return bundlePath;
        }
    }

    static public boolean dealBundleSource(Context context, String bundlePath) {
        boolean result = false;
        try {
            String baseBundleDirPath = context.getFilesDir().getAbsolutePath() + "/bundles/";

            File bundleDir = new File(bundlePath).getParentFile();
            File[] files = bundleDir.listFiles();
            for (int i = 0; i < files.length; i++) {
                if (
                    files[i].isDirectory() &&
                        (
                            files[i].getName().contains("raw") ||
                                files[i].getName().contains("drawable") ||
                                files[i].getName().contains("mipmap")
                        )
                ) {
                    result = FileUtil.copyDirFromPath(files[i].getAbsolutePath(), baseBundleDirPath + "base/" + files[i].getName());
                    if (result) {
                        // 拷贝完成后，删除原来的图片文件夹
                        Utils.delDir(files[i].getAbsolutePath());
                    }
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            return result;
        }
    }
}
