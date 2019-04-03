import DirectorView from "../View";


const Tween = Laya.Tween;
const Sprite = Laya.Sprite;

export const DEFAULT_CONFIG = {
	// "isModal"      : true,       //是否是模式窗口
	"closeOther"   : false,      //在弹窗模式为multiple时，是否在弹窗弹窗的时候关闭其他显示中的弹窗
	"closeOnSide"  : false,      //模式窗口点击遮罩，是否关闭窗口，默认是关闭的
	"closeByGroup" : false,      //在弹窗模式为multiple时，是否在弹窗弹窗的时候关闭相同group属性的弹窗
	"closeByName"  : false,      //在弹窗模式为multiple时，是否在弹窗弹窗的时候关闭相同name属性的弹窗
	// "popupCenter"  : true,       //指定对话框是否居中弹。 如果值为true，则居中弹出，否则，则根据对象坐标显示，默认为true。
	"shadowAlpha"  : 0.5,        //弹出框背景透明度
	"shadowColor"  : "#000000",  //弹出框背景颜色
	"autoClose"    : false       //指定时间内自动关闭，单位为ms，默认不打开此功能
};

/**@private 全局默认弹出对话框效果，可以设置一个效果代替默认的弹出效果，如果不想有任何效果，可以赋值为null*/
const defaultPopupEffect = function(dialog){
	dialog.scale(1, 1);
	dialog._effectTween = Laya.Tween.from(dialog, {x : Laya.stage.width / 2, y : Laya.stage.height / 2, scaleX : 0, scaleY : 0}, 300, Laya.Ease.backOut, Laya.Handler.create(this, this.doOpen, [dialog]), 0, false, false);
};
/**@private 全局默认关闭对话框效果，可以设置一个效果代替默认的关闭效果，如果不想有任何效果，可以赋值为null*/
const defaultCloseEffect = function(dialog){
	dialog._effectTween = Laya.Tween.to(dialog, {x : Laya.stage.width / 2, y : Laya.stage.height / 2, scaleX : 0, scaleY : 0}, 300, Laya.Ease.backIn, Laya.Handler.create(this, this.doClose, [dialog]), 0, false, false);
};

/**
*<code>DialogManager</code> 对话框管理容器，所有的对话框都在该容器内，并且受管理器管理。
*任意对话框打开和关闭，都会触发管理类的open和close事件
*可以通过UIConfig设置弹出框背景透明度，模式窗口点击边缘是否关闭，点击窗口是否切换层次等
*通过设置对话框的zOrder属性，可以更改弹出的层次
*/
const DialogManager = {
	viewContent : null,
	dialogClassMap : {},

	/**@public 覆盖默认弹窗配置 */
	setDefaultConfig(config){
		Object.assign(DEFAULT_CONFIG, config);
	},
	
	__init__ (type) {
		this.dialogType = (type == "single" || type == "multiple") ? type : "single";
		this.maskLayerName = `__$DialogManagerMaskLayer:${Math.random()}`;
        this.popupEffectHandler = new Laya.Handler(this, defaultPopupEffect);
		this.closeEffectHandler = new Laya.Handler(this, defaultCloseEffect);
		
		this.maskLayer = new Sprite();
		this.maskLayer.on("click", this, this._closeOnSide);
		this.maskLayer.name = this.maskLayerName;
		
		
		DirectorView.addView("Dialog", this.maskLayer);
		DirectorView.setViewVisible("Dialog", false);

		this.viewContent = DirectorView.getView("Dialog");
		this.viewContent.mouseThrough = true;
		
		Laya.Dialog.manager = this;
		this._onResize();
    },

	_closeOnSide(){
		let content = this.viewContent;
		let dialog = content.getChildAt(content.numChildren - 1);
		if (dialog instanceof laya.ui.Dialog && dialog.name !== this.maskLayerName && dialog.isModal && dialog._$configtmp.closeOnSide){
			dialog.close();
		}
	},
	
	/**@private */
	_onResize(width, height){
		let content = this.viewContent;
		this.maskLayer.size(width, height);
		
		// this.maskLayer.graphics.clear(true);
		// this.maskLayer.graphics.drawRect(0, 0, width, height, UIConfig.popupBgColor);
		// this.maskLayer.alpha=UIConfig.popupBgAlpha;
		
		for (let i = content.numChildren - 1; i > -1; i--){
			let item = content.getChildAt(i);
			if(item.name !== this.maskLayerName){
				if (item.isPopupCenter) {
					this._centerDialog(item);
				}else{
					item.onResize(width, height);
				}
			}
		}

		this._checkMask();
	},
	
	_centerDialog(dialog){
		dialog.x = Math.round(((Laya.stage.width - dialog.width) >> 1) + dialog.pivotX);
		dialog.y = Math.round(((Laya.stage.height - dialog.height) >> 1) + dialog.pivotY);
	},

	/**@private */
	_clearDialogEffect(dialog){
		Laya.timer.clear(dialog, dialog.close);
		if (dialog._effectTween){
			Tween.clear(dialog._effectTween);
			dialog._effectTween=null;
		}
	},

	/**@private 发生层次改变后，重新检查遮罩层是否正确*/
	_checkMask(){
		let content = this.viewContent;
		this.maskLayer.removeSelf();

		for (let i = content.numChildren - 1; i > -1; i--){
			let dialog = content.getChildAt(i);
			if (dialog && dialog.isModal){
				this.maskLayer.graphics.clear(true);
                this.maskLayer.graphics.drawRect(0, 0, content.width, content.height, dialog._$configtmp.shadowColor);
				this.maskLayer.alpha = dialog._$configtmp.shadowAlpha;
				
				DirectorView.addViewAt("Dialog", this.maskLayer, i);
				// this.addChildAt(this.maskLayer, i);
				return;
			}
		}

		if(content.numChildren == 0){
			DirectorView.setViewVisible("Dialog", false);
            // this.visible = false;
        }
	},
	
	openDialogByData (url, params, config, obj) {
		if (!obj) {throw `Can not find "Dialog":${url}`;}
        if (!obj.props) {throw `"Dialog" data is error:${url}`;}
        
        let runtime = obj.props.runtime ? obj.props.runtime : obj.type;
        let clas = Laya.ClassUtils.getClass(runtime);
        this.dialogClassMap[url] = clas;

        DirectorView.createView(obj, clas, url, params, Laya.Handler.create(this, this.openDialogByClass, [config]));
	},

	openDialogByClass (cfg, dialog) {
        Laya.timer.callLater(this, function () {
			// this.visible = true;
			DirectorView.setViewVisible("Dialog", true);
        });

        this._clearDialogEffect(dialog);
        
        // const config = dialog._$config = Object.assign({}, DEFAULT_CONFIG, dialog._$config, cfg);
        const config = dialog._$configtmp = Object.assign({}, dialog._$config, cfg);
		// dialog._$customParams = params;
		
		DirectorView.addView("Dialog", dialog);
        // this.addChild(dialog);
        if (dialog.isPopupCenter) this._centerDialog(dialog);
        if (config.closeOther) this.closeAll();
        if (dialog.group && config.closeByGroup) this.closeByGroup(dialog.group);
        if (dialog.name && config.closeByName) this.closeByName(dialog.name);
        
		if (dialog.isModal || this.viewContent._getBit(/*laya.Const.HAS_ZORDER*/0x20)){
            Laya.timer.callLater(this, this._checkMask);
        }

        if(config.onOpened){
            if(dialog.onOpened){
                dialog._$onOpened = dialog.onOpened;
            }
            dialog.onOpened = config.onOpened;
        }
        if(config.onClosed){
            if(dialog.onClosed){
                dialog._$onClosed = dialog.onClosed;
            }
            dialog.onClosed = config.onClosed;
        }
        
		if (dialog.isShowEffect && dialog.popupEffect != null){
            dialog.popupEffect.runWith(dialog);
		}else{
            this.doOpen(dialog);
        }
	},

	/**@private */
	lock(){},
	/**@private */
	setLockView(){},

	/**
	*执行打开对话框。
	*@param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
	*/
	doOpen(dialog){
		// dialog.onOpened(dialog._$customParams);
		if(dialog._$configtmp.autoClose){
			Laya.timer.once(dialog._$configtmp.autoClose, dialog, dialog.close);
		}
	},

	/**
	*关闭对话框。
	*@param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
	*/
	close(dialog){
		this._clearDialogEffect(dialog);
		if (dialog.closeEffect != null && dialog.closeEffect instanceof Laya.Handler){
			dialog.closeEffect.runWith([dialog]);
		}else{
			this.doClose(dialog);
		}
	},

	/**
	*执行关闭对话框。
	*@param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
	*/
	doClose(dialog){
		if(dialog.name === this.maskLayerName){
			dialog.removeSelf();
			return;
		}
		dialog.removeSelf();
		dialog.onClosed(dialog.closeType);
		if (dialog.autoDestroyAtClosed){
			dialog.destroy();
		}else{
			DirectorView.recoverView(dialog);
		}
		if(this.maskLayer.parent){
			Laya.timer.callLater(this, this._checkMask);
			// this._checkMask();
		}
	},

	/**
	*关闭所有的对话框。
	*/
	closeAll(){
		let content = this.viewContent;
		for (let i = content.numChildren - 1; i > -1; i--){
            let item = content.getChildAt(i);
            // if(!item) {return;}

            // if(item.name === this.maskLayerName) {
            //     item.removeSelf();
            // }else{
				this.close(item);
			// }
        }
	},

	/**
	*关闭指定name值的对话框。
	*/
	closeDialogByName (name) {
		if(!name){return;}
		let content = this.viewContent;

        for (let i = content.numChildren - 1; i > -1; i--){
            let item = content.getChildAt(i);
            if(item.name == name){
                this.close(item);
                break;
            }
        }
	},

	/**
	 *根据组关闭所有弹出框
	 *@param group 需要关闭的组名称
	 */
	closeDialogsByGroup (group) {
		let content = this.viewContent;
		for (let i = content.numChildren - 1; i > -1; i--){
			let item = content.getChildAt(i);
			if (item && item.group === group){
				this.close(item);
			}
		}
	},

	/**
	*根据组获取所有对话框
	*@param group 组名称
	*@return 对话框数组
	*/
	getDialogsByGroup(group){
		let content = this.viewContent;
		let arr = [];
		for (let i = content.numChildren - 1; i > -1; i--){
			let item = content.getChildAt(i);
			if (item && item.group === group){
				arr.push(item);
			}
		}
		return arr;
	},

	/**
	*根据name获取所有对话框
	*@param name 对话框的name
	*@return 对话框
	*/
	getDialogByName(name){
		let content = this.viewContent;
		for (let i = content.numChildren - 1; i > -1; i--){
			let item = content.getChildAt(i);
			if (item && item.name === name){
				return item;
			}
		}
	}
}

export default DialogManager;