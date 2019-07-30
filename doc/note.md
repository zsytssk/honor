-   @todo 场景打开 dialog

    -   director openDialog
    -   直接调用场景打开 dialog

-   无法支持多个 dialogManager, 所以无法用

-   loading 使用弹出层...

-   dialogManager

-   @ques onMounted 应该放在 onEnable 之后

-   @ques syncBack rmDir

-   @ques onMounted 放在 onEnable 之后

-   @ques onMounted 蒙哥的 onMoutend 的书匈奴

## 2019-07-30 09:17:21

-   @ques 到底还要不要默认的 loading
-   @todo sceneChangeBeforeListener 可以用 Event 类

## 2019-07-26 15:21:33

-   @ques 如何设置默认的 loadingScene

    -   dialog + 场景的 scene

-   @ques Laya.dialog | laya.Scene 的 loadingPage 是否是一样的

-   @ques 场景有没有必要回收...

-   @ques Login resize 会不会自动调用

-   @ques scene Test

-   @ques scene 切换 loading 会在弹出层上面吗...

-   @ques dialogManager onMouted 在 onEabled 之后处理

## 2019-07-26 10:13:41

-   @ques 能不能场景中打开 dialog'

    -   会在场景中打开, 随着场景一起销毁
    -   能不能自己去新建一个 dialogManager, 放在场景里面..., zOrder = 10000
    -   ...切换场景自己销毁....,

-   @ques 足球怎么带球...

-   @ques dialog 添加 closeHandler

-   @todo dialog alpha 有没有必要存在

    -   Laya.UIConfig.popupBgAlpha
    -   Laya.UIConfig.popupBgColor
    -   可以通过这个来控制
    -   @todo test 两个弹出层的设置不一样..， 来控制背景的颜色...
    -   每次 `_checkMask` 之前都要调用
    -   我怎么找到对应的 dialog

-   @ques 如何监听 dialog 的 close

    -   两次打开的 dialog 是否是一个 dialog

-   @ques Laya.UIConfig 是私有属性我怎么处理

-   @ques 弹出层

    -   弹出层:> 关闭且 destroy | close(true)
    -   弹出层和场景相关
        -   用场景打开弹出层
    -   这些需求是否合理
    -   group 到底是做什么的...

-   Honor 原生的没有 closeDialogsByName

{
closeDialogsByGroup
closeDialogsByName
getDialogByName
closeAllDialogs
openDialog
config
}

## 2019-07-23 15:43:22

-   @opt honor 直接用原生的方法 来控制 弹出层+场景

    -   @todo honor 的优化
    -   新建分支来处理
    -   正常功能的实现 打开 + 关闭, 切换 + onMounted
    -   额外功能 - use_exit + 场景关联 弹出层
    -   单独新建仓库来处理这个事情 HonorTest...

-   @opt [honor] setLoadView :> createLoadViewByData + createLoadViewByClass

-   @opt [honor]

-   dialog 实在什么地方显示的
    -   directorView.addView('Dialog', dialog);

## todo

-   @ques [honor] onMounted 在 onAwake 之前怎么处理

-   dialog 设置 dialog dialog.popupEffect closeEffect
-   弹出层 this.popupEffect = null 时 无法再次打开
-   version.json config bin/res

    -   在项目中使用版本

-   清理 原来 scene 的逻辑...

Laya.dialog.manager

## 2019-06-17 13:42:57

-   @ques DialogManager 能不能最大化使用 原来 DialogManager 的 api
-   @ques SceneManager 能不能最大化使用 原来 DialogManager 的 api

    -   支持 class...
    -   Laya.Scene.
    -   Laya.Scene.setLoadingPage

## save

-   自动化发布流程

    -   webpack-prod tsc generateType release

-   [honor] @todo 关闭所有弹出层中出现还在加载资源的弹出层...
    -   能不能做 好不好做
    -   reject all openDialog
    -   会不会出现始终要打开的页面
    -   ***
    -   loading promise 可以中断 return reject
    -   一大堆异步过程 我怎么方便的去打断...
    -   只接在 wait_open_dialog_map 里面记录 但是我后面的 dialog 依赖 wait_open_dialog_map 又怎么处理
    -   ...

## honor

### 子模块

```bash
git log | grep git-subtree-dir | awk '{ print $2 }'
git subtree push --prefix=libs/honor http://172.21.1.184/jk_html/honor.git develop
git subtree split --rejoin --prefix=<prefix> <commit...>
mklink /J D:\zsytssk\job\legend\legend_demo\libs\honor D:\zsytssk\job\legend\honor\src
```

使用 symbol link 文件夹

-   @note 怎么像 react 一样 release
    -   master 只是用来发布的
    -   develop 用来开发

### 优化

-   @todo [Honor] 所有文件夹全部变成小写...
    -   所有 export 对象都在 honor 中抛出...

*   @ques 能不能将多个任务放在一个 load 中...

    -   就像 promise.all

*   @ques [honor] openDialog(ctor) 能不能自动加载资源...

    -   能不能将 加载额外资源 +

*   @todo [honor] 抽离一个干净的标准版 demo

### dialog

-   @todo [honor] openDialog `useExit: true`...

    -   我需要记录正在打开的 dialog 已经打开的...
    -   dialogList {status, promise...}
    -   我在 dialog 打开之前又怎么能获取 dialog 的 config...
    -   如果我在已经 new dialog 之后不将 dialog 放到页面中这也没有你意义

-   @ques [honor] dialog config 要不要放在 dailog 上面

### other

-   @ques [honor] DialogManager 能不能最大化使用 原来 DialogManager 的 api

*   @todo ctor type HonorView

    -   DirectorView createView

*   @todo [honor] dialog `_$configtmp` `_$config`

*   @todo [honor] 完全 ts 话

-   @ques 怎么将多个 loadprogress 合并成一个

    -   rxjs

-   @opt honor/view.ts this[`_$${name}`]

-   @opt 清理 `__init__`

-   [honor] 要不要换成 class 而不是对象

-   @ques Honor 自动补全 + lib 库的配置

    -   所有抛出全部放在 honor 中...

-   @ques Honor.DEBUG_MODE

### 删除对 laya 原生的修改, 使用 UiCtrl 来控制...

-   内容

    -   LoaderManager DialogManager
    -   laya.scene dialog

-   要基本保证现有的接口...

-   @ques openDialog 也改掉... 参数 能不能不用数组...

    -   不行 有三个参数... config

*   scene.loadScene 有一个 progress onResize
*   dialog 可能和 dialogManager 上面的设置

    -   设置是否一致...

*   @note dialogManager 之所以可以控制 ui

    -   `Laya.Dialog.manager = this;`

*   @ques [honor] 改写 Laya.Scene 的目的是什么 @mg
    -   给上面绑定新的方法...
    -   dialog --> 点击其他地方关闭 ...
    -   dialog 打开配置...
    -   阴影 + 颜色
    -   应该有更好的方法...
        -   我更喜欢 包裹一层...
        -   DialogCtrl --> 可以继承...
