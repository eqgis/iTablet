#!/bin/bash
#------------------
#   echo_color
#   对于一些特殊操作进行颜色提示
#------------------
echoc()
{
    echo -e "\033[36m $1 \033[0m"
}

#-------------------------------
#   echo_error
#   执行过程中产生错误的的信息提示
#-------------------------------
echoe()
{
    echo -e "\033[31m $1 \033[0m"
}

#-------------------------------
#   build
#   创建bundle文件
#-------------------------------
buildCommon() {
    echoc "react_native_bundle"
    echoc "创建common.bundle"
    mkdir -p bundle/android/common
    echoc "生成common.bundle"
    react-native bundle --entry-file common/index.ts --platform android --dev false --config package_common.config.js --bundle-output bundle/android/common/common.bundle --assets-dest bundle/android/common

    echoc "创建base.bundle"
    mkdir -p bundle/android/base
    echoc "生成base.bundle"
    react-native bundle --entry-file index.js --platform android --dev false --config package.config.js --bundle-output bundle/android/base/base.bundle --assets-dest bundle/android/base
    # echoc "创建demo.bundle"
    # mkdir -p bundle/android/demo
    # echoc "生成demo.bundle"
    # react-native bundle --entry-file applets/demo/index.ts --platform android --dev false --config package.config.js --bundle-output bundle/android/demo/index.android.bundle --assets-dest bundle/android/demo/assets
    # echoc "创建demo2.bundle"
    # mkdir -p bundle/android/demo2
    # echoc "生成demo2.bundle"
    # react-native bundle --entry-file applets/demo2/index.ts --platform android --config package.config.js --dev false --bundle-output bundle/android/demo2/index.android.bundle --assets-dest bundle/android/demo2/assets
}

buildApplets() {
    # echoc "react_native_bundle"
    # echoc "创建common.bundle"
    # mkdir -p bundle/android/common
    # echoc "生成common.bundle"
    # react-native bundle --entry-file common/index.ts --platform android --dev false --config package_common.config.js --bundle-output bundle/android/common/common.bundle --assets-dest bundle/android/common/assets

    # echoc "创建base.bundle"
    # mkdir -p bundle/android/base
    # echoc "生成base.bundle"
    # react-native bundle --entry-file index.js --platform android --dev false --config package.config.js --bundle-output bundle/android/base/index.android.bundle --assets-dest bundle/android/base/assets
    
    echoc "创建demo.bundle"
    mkdir -p bundle/android/demo
    echoc "生成demo.bundle"
    react-native bundle --entry-file applets/demo/index.ts --platform android --config package_demo.config.js --dev false --bundle-output bundle/android/demo/index.android.bundle --assets-dest bundle/android/demo
    
    echoc "创建demo2.bundle"
    mkdir -p bundle/android/demo2
    echoc "生成demo2.bundle"
    react-native bundle --entry-file applets/demo2/index.ts --platform android --config package_demo2.config.js --dev false --bundle-output bundle/android/demo2/index.android.bundle --assets-dest bundle/android/demo2
    
    echoc "创建tour.bundle"
    mkdir -p bundle/android/tour
    echoc "生成tour.bundle"
    react-native bundle --entry-file applets/tour/index.ts --platform android --config package_tour.config.js --dev false --bundle-output bundle/android/tour/index.android.bundle --assets-dest bundle/android/tour
}

#-------------------------------
#   patch
#   创建区别文件
#-------------------------------
patch() {
  # echoc "生成差分base.bundle文件"
  # comm -2 -3 bundle/android/base/index.android.bundle bundle/android/common/common.bundle > bundle/android/base/base.bundle
  # echoc "生成差分base.bundle配置文件"
  # node makeBundleConfig bundle/android/base/base.bundle package.json
  # echoc "删除bundle/android/base/index.android.bundle"
  # rm bundle/android/base/index.android.bundle

  echoc "生成差分demo.bundle文件"
  comm -2 -3 bundle/android/demo/index.android.bundle bundle/android/common/common.bundle > bundle/android/demo/demo.bundle
  # echoc "demo.bundle配置文件"
  # node makeBundleConfig bundle/android/demo/demo.bundle applets/demo/package.json
  echoc "删除bundle/android/demo/index.android.bundle"
  rm bundle/android/demo/index.android.bundle
  
  echoc "生成差分demo2.bundle文件"
  comm -2 -3 bundle/android/demo2/index.android.bundle bundle/android/common/common.bundle > bundle/android/demo2/demo2.bundle
  # echoc "生成差分demo2.bundle配置文件"
  # node makeBundleConfig bundle/android/demo2/demo2.bundle applets/demo2/package.json
  echoc "删除bundle/android/demo2/index.android.bundle"
  rm bundle/android/demo2/index.android.bundle
  
  echoc "生成差分TourModule.bundle文件"
  comm -2 -3 bundle/android/tour/index.android.bundle bundle/android/common/common.bundle > bundle/android/tour/tour.bundle
  # echoc "生成差分demo2.bundle配置文件"
  # node makeBundleConfig bundle/android/tour/tour.bundle applets/tour/package.json
  echoc "删除bundle/android/tour/index.android.bundle"
  rm bundle/android/tour/index.android.bundle
}

#-------------------------------
#   moveBundle
#   拷贝bundle文件到assets
#-------------------------------
moveBundle() {
  mkdir -p android/app/src/main/assets/bundles

  # echoc "拷贝common.bundle文件"
  # cp bundle/android/common/common.bundle android/app/src/main/assets/bundles

  # echoc "生成差分base.bundle配置文件"
  # node makeBundleConfig bundle/android/base/base.bundle package.json
  # echoc "拷贝base.bundle文件"
  # cp bundle/android/base.zip android/app/src/main/assets/bundles
  echoc "拷贝base.bundle文件"
  node makeBundleConfig bundle/android/base/base.bundle package.json
  cp bundle/android/base.zip android/app/src/main/assets

  echoc "demo.bundle配置文件"
  node makeBundleConfig bundle/android/demo/demo.bundle applets/demo/package.json
  adb push bundle/android/demo.zip sdcard/iTablet/Bundles
  # echoc "拷贝demo.bundle文件"
  # cp bundle/android/demo.zip android/app/src/main/assets/bundles

  echoc "生成差分demo2.bundle配置文件"
  node makeBundleConfig bundle/android/demo2/demo2.bundle applets/demo2/package.json
  adb push bundle/android/demo2.zip sdcard/iTablet/Bundles
  # echoc "拷贝demo2.bundle文件"
  # cp bundle/android/demo2.zip android/app/src/main/assets/bundles

  echoc "生成差分TourModule.bundle配置文件"
  node makeBundleConfig bundle/android/tour/tour.bundle applets/tour/package.json
  adb push bundle/android/tour.zip sdcard/iTablet/Bundles
  # echoc "拷贝TourModule.bundle文件"
  # cp bundle/android/tour.zip android/app/src/main/assets/bundles
}

#-------------------------------
#   clear
#   清除文件
#-------------------------------
clear() {
  echoc "清除bundle"
  rm -rf bundle/android/*
}

#-------------------------------
#   clear
#   清除文件
#-------------------------------
clearAndroid() {
  echoc "清除Android assets"
  rm -rf android/app/src/main/assets/bundles
  rm android/app/src/main/assets/base.zip
}

#-------------------------------
#   clear
#   清除文件
#-------------------------------
clearApplets() {
  echoc "清除Android applets"
  rm -rf bundle/android/demo*
  adb shell rm -rf sdcard/iTablet/Bundles/*
}

if [ $1 == "c" ];then
  clear
elif [ $1 == "ca" ];then
  clearAndroid
elif [ $1 == "cap" ];then
  clearApplets
elif [ $1 == "p" ];then
  patch
elif [ $1 == "b" ];then
  buildCommon
  buildApplets
elif [ $1 == "bc" ];then
  buildCommon
elif [ $1 == "ba" ];then
  buildApplets
elif [ $1 == "m" ];then
  moveBundle
else
  echo b: build; p: patch; c: clear
fi