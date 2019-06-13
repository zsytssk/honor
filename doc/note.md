-   自动化发布流程
    -   webpack-prod tsc generateType release

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
