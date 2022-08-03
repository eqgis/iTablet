package com.supermap.itablet.bundleCore;

/**
 * @Author: shanglongyang
 * Date:        7/26/22
 * project:     iTablet
 * package:     iTablet
 * class:
 * description:
 */
public enum BundleStatus {
    EXIST ,          // bundle已存在，且信息全部一致
    NOT_EXIST ,      // bundle不存在
    NEED_UPDATE ,    // 要加载的bundle版本 或 日期都要比当前版本高，需要更新
    OLDER ,          // 要加载的bundle版本 或 日期都要比当前版本低，不需要更新
}
