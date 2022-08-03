package com.supermap.itablet.bundleCore;

/**
 * @Author: shanglongyang
 * Date:        8/2/22
 * project:     iTablet
 * package:     iTablet
 * class:
 * description:
 */
public enum BundleType {
  APP("APP"),
  CONFIG_MODULE("CONFIG_MODULE"),
  MODULE("MODULE");

  private String desc;//中文描述

  /**
   * 私有构造,防止被外部调用
   * @param desc
   */
  private BundleType(String desc){
    this.desc = desc;
  }

  @Override
  public String toString() {
    return desc;
  }
  
}
