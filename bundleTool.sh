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
    # echoc "react_native_bundle"
    # echoc "创建common.bundle"
    # mkdir -p bundle/android/common
    # echoc "生成common.bundle"
    # react-native bundle --entry-file common/index.ts --platform android --dev false --config package_common.config.js --bundle-output bundle/android/common/common.bundle --assets-dest bundle/android/common

    echoc "创建base.bundle"
    mkdir -p bundle/android/base
    echoc "生成base.bundle"
    react-native bundle --entry-file index.js --platform android --dev false --config package.config.js --bundle-output bundle/android/base/base.bundle --assets-dest bundle/android/base
    echoc "base.bundle配置文件"
    node makeBundleConfig bundle/android/base/base.bundle package.json
}

buildApplets() {
    # echoc "创建demo.bundle"
    # mkdir -p bundle/android/demo
    # echoc "生成demo.bundle"
    # react-native bundle --entry-file applets/demo/index.ts --platform android --config package_demo.config.js --dev false --bundle-output bundle/android/demo/demo.bundle --assets-dest bundle/android/demo
    # echoc "demo.bundle配置文件"
    # node makeBundleConfig bundle/android/demo/demo.bundle applets/demo/package.json

    # echoc "创建demo2.bundle"
    # mkdir -p bundle/android/demo2
    # echoc "生成demo2.bundle"
    # react-native bundle --entry-file applets/demo2/index.ts --platform android --config package_demo2.config.js --dev false --bundle-output bundle/android/demo2/demo2.bundle --assets-dest bundle/android/demo2
    # echoc "demo2.bundle配置文件"
    # node makeBundleConfig bundle/android/demo2/demo2.bundle applets/demo2/package.json
    
    echoc "创建tour.bundle"
    mkdir -p bundle/android/tour
    echoc "生成tour.bundle"
    react-native bundle --entry-file applets/tour/index.ts --platform android --config package_tour.config.js --dev false --bundle-output bundle/android/tour/tour.bundle --assets-dest bundle/android/tour
    echoc "tour.bundle配置文件"
    node makeBundleConfig bundle/android/tour/tour.bundle applets/tour/package.json
}

#-------------------------------
#   buildApplet
#   创建小程序bundle和zip
#-------------------------------
buildApplet() {
    echoc "创建$buildName.bundle"
    mkdir -p bundle/android/$buildName
    echoc "生成$buildName.bundle"
    react-native bundle --entry-file applets/$buildName/index.ts --platform android --config package_$buildName.config.js --dev false --bundle-output bundle/android/$buildName/$buildName.bundle --assets-dest bundle/android/$buildName
    echoc "$buildNamedemo.bundle配置文件"
    node makeBundleConfig bundle/android/$buildName/$buildName.bundle applets/$buildName/package.json
}

#-------------------------------
#   clearBase
#   清除小程序bundle和zip
#-------------------------------
clearBase() {
  echoc "清除base"
  rm android/app/src/main/assets/base.zip
}

#-------------------------------
#   clearApplet
#   清除小程序bundle和zip
#-------------------------------
clearApplet() {
  echoc "清除$clearName"
  rm -rf bundle/android/$clearName bundle/android/$clearName.zip
  adb shell rm -rf sdcard/iTablet/Bundles/$clearName
}

#-------------------------------
#   moveBase
#   拷贝base到指定位置
#-------------------------------
moveBase() {
  echoc "拷贝base.bundle文件"
  cp bundle/android/base.zip android/app/src/main/assets
}


#-------------------------------
#   clearApplet
#   清除小程序bundle和zip
#-------------------------------
moveApplet() {
  echoc "拷贝$moveName.bundle文件"
  adb push bundle/android/$moveName.zip sdcard/iTablet/Bundles
}

#-------------------------------
#   patch
#   创建区别文件
#   TODO 若需要拆分公共包,则开启接口
#-------------------------------
# patch() {
#   # echoc "生成差分base.bundle文件"
#   # comm -2 -3 bundle/android/base/index.android.bundle bundle/android/common/common.bundle > bundle/android/base/base.bundle
#   # echoc "生成差分base.bundle配置文件"
#   # node makeBundleConfig bundle/android/base/base.bundle package.json
#   # echoc "删除bundle/android/base/index.android.bundle"
#   # rm bundle/android/base/index.android.bundle

#   echoc "生成差分demo.bundle文件"
#   comm -2 -3 bundle/android/demo/index.android.bundle bundle/android/common/common.bundle > bundle/android/demo/demo.bundle
#   echoc "删除bundle/android/demo/index.android.bundle"
#   rm bundle/android/demo/index.android.bundle
  
#   echoc "生成差分demo2.bundle文件"
#   comm -2 -3 bundle/android/demo2/index.android.bundle bundle/android/common/common.bundle > bundle/android/demo2/demo2.bundle
#   echoc "删除bundle/android/demo2/index.android.bundle"
#   rm bundle/android/demo2/index.android.bundle
  
#   echoc "生成差分TourModule.bundle文件"
#   comm -2 -3 bundle/android/tour/index.android.bundle bundle/android/common/common.bundle > bundle/android/tour/tour.bundle
#   echoc "删除bundle/android/tour/index.android.bundle"
#   rm bundle/android/tour/index.android.bundle
# }

#-------------------------------
#   moveBundle
#   拷贝bundle文件到assets
#-------------------------------
moveBundle() {
  echoc "拷贝base.bundle文件"
  cp bundle/android/base.zip android/app/src/main/assets

  # echoc "拷贝demo.bundle文件"
  # adb push bundle/android/demo.zip sdcard/iTablet/Bundles

  # echoc "拷贝demo2.bundle文件"
  # adb push bundle/android/demo2.zip sdcard/iTablet/Bundles

  echoc "拷贝tour.bundle文件"
  adb push bundle/android/tour.zip sdcard/iTablet/Bundles
}

#-------------------------------
#   clear
#   清除文件
#-------------------------------
clear() {
  echoc "清除bundle"
  rm -rf bundle/android/*
}

key=$(echo $1 | awk -F"=" '{print $1}')
val=$(echo $1 | awk -F"=" '{print $2}')
case $key in
    -b)
        buildName=$val
    ;;
    -c)
        clearName=$val
    ;;
    -m)
        moveName=$val
    ;;
esac

if [[ $key == "-b" && $val == "base" ]];then
  buildCommon
elif [[ $key == "-b" && $val ]];then
  buildApplet
elif [ $key == "-b" ];then
  buildCommon
  buildApplets
elif [ $key == "-bc" ];then
  buildCommon
elif [ $key == "-ba" ];then
  buildApplets
elif [[ $key == "-ca" && $val == "base" ]];then
  clearBase
elif [[ $key == "-ca" && $val ]];then
  clearApplet
elif [ $key == "-c" ];then
  clear
elif [[ $key == "-m" && $val == "base" ]];then
  moveBase
elif [[ $key == "-m" && $val ]];then
  moveApplet
elif [ $key == "-m" ];then
  moveBundle
else
  echo "
  -b xxx:     创建xxx.bundle和xxx.zip;
              eg: bundleTools.sh -b=tour
              "
          
  echo "  -b:         创建base和小程序包;
  "

  echo "  -ba:        创建buildApplets中指定的applets;
  "

  echo "  -bc:        创建base bundle;
  "

  echo  "  -ca xxx:    清除xxx小程序包;
              eg: bundleTools.sh -ca=tour
              "

  echo "  -c:         清除 bundle/android/ 中的所有包;
  "

  echo "  -m xxx:     移动xxx小程序到iTablet文件目录;
              eg: bundleTools.sh -m=tour
              "

  echo "  -m:         移动base和所有小程序到默认位置;
  "
fi