```
██╗  ██╗ ██████╗ ███╗   ██╗ ██████╗ ██████╗ 
██║  ██║██╔═══██╗████╗  ██║██╔═══██╗██╔══██╗
███████║██║   ██║██╔██╗ ██║██║   ██║██████╔╝
██╔══██║██║   ██║██║╚██╗██║██║   ██║██╔══██╗
██║  ██║╚██████╔╝██║ ╚████║╚██████╔╝██║  ██║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝
```

# Honor是一个LayaAir引擎扩展库
提供LayaAir引擎扩展功能，主要包括director，scene，page，widget等区分，提供了dataManager，cacheManager及一些函数库等扩展，集成了net（socket、http），system（平台环境判断，系统时间，浏览器类型等）等功能。

## Honor特点

- 极致性能

Honor优先使用webgl渲染，如果webgl不可用，自动无缝转为canvas渲染，引擎设计过程中处处以性能为优先原则，Honor是为裸跑而设计的HTML5引擎。

- 轻量易用

Honor API设计上追求精简，简单易用，上手容易，引擎本身非常注意自身大小，是目前同等功能最小的HTML5引擎。

- 支持多语言开发

Honor同时支持ActionScript3、TypeScript、JavaScript三种语言开发HTML5

- 开源免费

引擎全部开源并托管到github，并且全部免费使用，包括商用

## 当前功能
- Webgl渲染
- Canvas渲染
- 矢量图
- 图集支持
- 加载管理器
- HTML富文本
- 位图字体
- 遮罩
- 滤镜
- 时间轴动画
- UI
- 粒子
- 骨骼
- 物理系统
- 可视化IDE
- 3D
- VR

## 开始使用
#### JS版本
    Laya.init(550, 400);
    Laya.stage.scaleMode = "showall";

    var ape = new laya.Sprite();
    //加载猩猩图片
    ape.loadImage("res/apes/monkey2.png");

    Laya.stage.addChild(ape);

#### TS版本
    /// <reference path="../../libs/LayaAir.d.ts" />
    class Sprite_DisplayImage{

        constructor(){
            Laya.init(550, 400);
            Laya.stage.scaleMode = "showall";

            var ape = new Laya.Sprite();
            //加载猩猩图片
            ape.loadImage("res/apes/monkey2.png");

            Laya.stage.addChild(ape);
        }
    }
    new Sprite_DisplayImage();

## 演示Demo

- http://layaair.ldc.layabox.com/demo/
- http://layabox.github.io/layaair-examples/

## 游戏展示
http://game.layabox.com/265

## API帮助

http://layaair.ldc.layabox.com/api/

##文档教程
http://ldc.layabox.com/index.php?m=content&c=index&a=show&catid=8&id=10

## 开发者中心

http://ldc.layabox.com/

## 社区

http://ask.layabox.com/

## QQ群
104144216

## 目录结构
- bin 编译好的类库，里面分为as，js，ts三种
- samples 示例项目
- src 类库源代码
- utils 自动化编译及其他工具
