import { HonorDialogConfig, HonorDialog, DEFAULT_CONFIG } from '../base/Dialog';
import { loaderManager, directorView } from '../../state';
import { Ctor } from '../../type';

const Tween = Laya.Tween;
const Sprite = Laya.Sprite;

/**
 * 全局默认弹出对话框效果，可以设置一个效果代替默认的弹出效果，
 * 如果不想有任何效果，可以赋值为null
 */
const defaultPopupEffect = function(dialog) {
    dialog.scale(1, 1);
    dialog._effectTween = Laya.Tween.from(
        dialog,
        {
            x: Laya.stage.width / 2,
            y: Laya.stage.height / 2,
            scaleX: 0,
            scaleY: 0,
        },
        300,
        Laya.Ease.backOut,
        Laya.Handler.create(this, this.doOpen, [dialog]),
        0,
        false,
        false,
    );
};
/** 全局默认关闭对话框效果，可以设置一个效果代替默认的关闭效果，
 * 如果不想有任何效果，可以赋值为null
 */
const defaultCloseEffect = function(dialog) {
    dialog._effectTween = Laya.Tween.to(
        dialog,
        {
            x: Laya.stage.width / 2,
            y: Laya.stage.height / 2,
            scaleX: 0,
            scaleY: 0,
        },
        300,
        Laya.Ease.backIn,
        Laya.Handler.create(this, this.doClose, [dialog]),
        0,
        false,
        false,
    );
};

type DialogRefKey = string | Ctor<HonorDialog>;
type DialogInfo = {
    url: DialogRefKey;
    dialog: HonorDialog;
    config: HonorDialogConfig;
};
type WaitOpenDialogMap = Map<DialogRefKey, Promise<HonorDialog>>;
/**
 * <code>DialogManager</code> 对话框管理容器，所有的对话框都在该容器内，并且受管理器管理。
 * 任意对话框打开和关闭，都会触发管理类的open和close事件
 * 可以通过UIConfig设置弹出框背景透明度，模式窗口点击边缘是否关闭，点击窗口是否切换层次等
 * 通过设置对话框的zOrder属性，可以更改弹出的层次
 */

export class DialogManagerCtor extends Laya.DialogManager {
    private viewContent: Laya.Sprite = null;
    private maskLayerName: string;
    public popupEffectHandler: Laya.Handler;
    public closeEffectHandler: Laya.Handler;
    public maskLayer: Laya.Sprite;
    private wait_open_dialog_map = new Map() as WaitOpenDialogMap;
    /** dialog的缓存列表 @ques 在什么时候清除 */
    private dialog_list: DialogInfo[] = [];
    constructor() {
        super();
        this.maskLayerName = `__$DialogManagerMaskLayer:${Math.random()}`;
        this.popupEffectHandler = new Laya.Handler(this, defaultPopupEffect);
        this.closeEffectHandler = new Laya.Handler(this, defaultCloseEffect);

        this.maskLayer = new Sprite();
        this.maskLayer.on('click', this, this.closeOnSide);
        this.maskLayer.name = this.maskLayerName;

        directorView.addView('Dialog', this.maskLayer);
        directorView.setViewVisible('Dialog', false);

        this.viewContent = directorView.getView('Dialog');
        this.viewContent.mouseThrough = true;

        Laya.Dialog.manager = this as any;
    }

    /** 获取dialog的配置  */
    private getDialogConfig(dialog: HonorDialog) {
        for (const item of this.dialog_list) {
            if (item.dialog === dialog) {
                return item.config;
            }
        }
    }
    private closeOnSide() {
        const content = this.viewContent;
        const dialog = content.getChildAt(
            content.numChildren - 1,
        ) as HonorDialog;
        const config = this.getDialogConfig(dialog);
        if (
            dialog instanceof laya.ui.Dialog &&
            dialog.name !== this.maskLayerName &&
            dialog.isModal &&
            config.closeOnSide
        ) {
            dialog.close();
        }
    }

    public onResize(width?: number, height?: number) {
        const content = this.viewContent;
        this.maskLayer.size(width, height);

        for (let i = content.numChildren - 1; i > -1; i--) {
            const item = content.getChildAt(i) as HonorDialog;
            if (item.name !== this.maskLayerName) {
                if (item.isPopupCenter) {
                    this.centerDialog(item);
                }
                if (item.onResize) {
                    item.onResize(width, height);
                }
            }
        }

        this.checkMask();
    }

    /** Dialog 居中 */
    private centerDialog(dialog: Laya.Dialog) {
        dialog.x = Math.round(
            ((Laya.stage.width - dialog.width) >> 1) + dialog.pivotX,
        );
        dialog.y = Math.round(
            ((Laya.stage.height - dialog.height) >> 1) + dialog.pivotY,
        );
    }

    private clearDialogEffect(dialog: Laya.Dialog) {
        Laya.timer.clear(dialog, dialog.close);
        if (dialog._effectTween) {
            Tween.clear(dialog._effectTween);
            dialog._effectTween = null;
        }
    }

    /** 发生层次改变后，重新检查遮罩层是否正确 */
    private checkMask() {
        const content = this.viewContent;
        this.maskLayer.removeSelf();

        for (let i = content.numChildren - 1; i >= 0; i--) {
            const dialog = content.getChildAt(i) as HonorDialog;
            const config = this.getDialogConfig(dialog);
            if (dialog && dialog.isModal) {
                this.maskLayer.graphics.clear(true);
                this.maskLayer.graphics.drawRect(
                    0,
                    0,
                    content.width,
                    content.height,
                    config.shadowColor,
                );
                this.maskLayer.alpha = config.shadowAlpha;

                directorView.addViewAt('Dialog', this.maskLayer, i);
                return;
            }
        }

        if (content.numChildren === 0) {
            directorView.setViewVisible('Dialog', false);
        }
    }
    /** @todo 逻辑需要整理下 getViewByPool 不再使用... */
    public async openDialog(
        url: DialogRefKey,
        params?: any[],
        config?: HonorDialogConfig,
        use_exist = false,
    ) {
        if (use_exist) {
            /** 正在打开的dialog */
            const wait_open_dialog = this.wait_open_dialog_map.get(url);
            let dialog: HonorDialog;
            if (wait_open_dialog) {
                dialog = await wait_open_dialog.then(_dialog => {
                    return _dialog;
                });
            } else {
                /** 已经打开的dialog */
                const item = this.dialog_list.find(_item => {
                    return _item.url === url;
                });
                if (item) {
                    dialog = item.dialog;
                }
            }
            if (dialog) {
                dialog.onMounted(...params);
                return dialog;
            }
        }

        const wait_open = new Promise((resolve, reject) => {
            let dialog = directorView.getViewByPool(
                typeof url === 'function' ? url.name : url,
            );
            if (dialog) {
                if (params) {
                    dialog.onMounted.apply(dialog, params);
                }
                this.openDialogByClass(url, config, dialog);
                return resolve(dialog);
            }

            if (typeof url === 'string') {
                loaderManager.loadScene('Dialog', url, obj => {
                    this.openDialogByData(url, params, config, obj).then(
                        _dialog => {
                            resolve(_dialog);
                        },
                    );
                });
                return;
            }
            if (typeof url === 'function') {
                dialog = new url();
                if (params) {
                    dialog.onMounted.apply(dialog, params);
                }
                dialog.once('onViewCreated', this, () => {
                    this.openDialogByClass(url, config, dialog);
                    return resolve(dialog);
                });
            }
        }) as Promise<HonorDialog>;

        this.wait_open_dialog_map.set(
            url,
            wait_open.then(dialog => {
                this.wait_open_dialog_map.delete(url);
                return dialog;
            }),
        );
        return await wait_open;
    }
    /** 通过dialog的配置来打开 dialog */
    private openDialogByData(
        url: string,
        params: any[],
        config: HonorDialogConfig,
        obj,
    ): Promise<HonorDialog> {
        return new Promise((resolve, reject) => {
            if (!obj) {
                throw new Error(`Can not find "Dialog":${url}`);
            }
            if (!obj.props) {
                throw new Error(`"Dialog" data is error:${url}`);
            }

            const runtime = obj.props.runtime ? obj.props.runtime : obj.type;
            const ctor = Laya.ClassUtils.getClass(runtime);

            directorView
                .createView(obj, ctor, url, params)
                .then((dialog: HonorDialog) => {
                    this.openDialogByClass(url, config, dialog);
                    resolve(dialog);
                });
        });
    }

    private openDialogByClass(
        url: DialogRefKey,
        cfg: HonorDialogConfig,
        dialog: HonorDialog,
    ) {
        Laya.timer.callLater(this, () => {
            directorView.setViewVisible('Dialog', true);
        });

        this.clearDialogEffect(dialog);

        const config = {
            ...DEFAULT_CONFIG,
            ...dialog.config,
            ...cfg,
        };

        this.dialog_list.push({
            dialog,
            config,
            url,
        });

        directorView.addView('Dialog', dialog);
        if (dialog.isPopupCenter) {
            this.centerDialog(dialog);
        }
        if (config.closeOther) {
            this.closeAll();
        }
        if (dialog.group && config.closeByGroup) {
            this.closeDialogsByGroup(dialog.group);
        }
        if (dialog.name && config.closeByName) {
            this.closeDialogByName(dialog.name);
        }

        if (
            dialog.isModal ||
            this.viewContent._getBit(/*laya.Const.HAS_ZORDER*/ 0x20)
        ) {
            Laya.timer.callLater(this, this.checkMask);
        }

        // 首次打开计算界面组件自适应
        if (dialog.onResize) {
            dialog.scale(1, 1);
            dialog.onResize();
        }

        if (dialog.isShowEffect && dialog.popupEffect != null) {
            dialog.popupEffect.runWith(dialog);
        } else {
            this.doOpen(dialog);
        }
    }

    /**
     * 执行打开对话框。
     * @param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
     */
    public doOpen(dialog) {
        const config = this.getDialogConfig(dialog);
        if (config.autoClose) {
            Laya.timer.once(config.autoClose as number, dialog, dialog.close);
        }
    }

    /**
     * 关闭对话框。
     * @param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
     */
    public close(dialog: HonorDialog) {
        this.clearDialogEffect(dialog);
        if (
            dialog.closeEffect != null &&
            dialog.closeEffect instanceof Laya.Handler
        ) {
            dialog.closeEffect.runWith([dialog]);
        } else {
            this.doClose(dialog);
        }
    }

    /**
     * 执行关闭对话框。
     * @param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
     */
    public doClose(dialog: HonorDialog) {
        const { dialog_list } = this;
        super.doClose(dialog);
        if (!dialog.autoDestroyAtClosed) {
            directorView.recoverView(dialog);
        }
        for (const [i, item] of dialog_list.entries()) {
            if (item.dialog === dialog) {
                dialog_list.splice(i, 1);
            }
        }
        Laya.timer.callLater(this, this.checkMask);
    }

    /**
     * 关闭所有的对话框。
     */
    public closeAll() {
        const content = this.viewContent;
        for (let i = content.numChildren - 1; i > -1; i--) {
            const item = content.getChildAt(i) as HonorDialog;
            /** 背景蒙层直接清除 */
            if (item.name === this.maskLayerName) {
                break;
            }
            this.close(item);
        }
    }

    /**
     * 关闭指定name值的对话框。
     */
    public closeDialogByName(name: string) {
        if (!name) {
            return;
        }
        const content = this.viewContent;

        for (let i = content.numChildren - 1; i > -1; i--) {
            const item = content.getChildAt(i) as HonorDialog;
            if (item.name === name) {
                this.close(item);
                break;
            }
        }
    }

    /**
     * 根据组关闭所有弹出框
     * @param group 需要关闭的组名称
     */
    public closeDialogsByGroup(group: string) {
        const content = this.viewContent;
        for (let i = content.numChildren - 1; i > -1; i--) {
            const item = content.getChildAt(i) as HonorDialog;
            if (item && item.group === group) {
                this.close(item);
            }
        }
    }

    /**
     * 根据组获取所有对话框
     * @param group 组名称
     * @return 对话框数组
     */
    public getDialogsByGroup(group: string) {
        const content = this.viewContent;
        const arr = [];
        for (let i = content.numChildren - 1; i > -1; i--) {
            const item = content.getChildAt(i) as HonorDialog;
            if (item && item.group === group) {
                arr.push(item);
            }
        }
        return arr;
    }

    /**
     * 根据name获取所有对话框
     * @param name 对话框的name
     * @return 对话框
     */
    public getDialogByName(name: string) {
        const content = this.viewContent;
        for (let i = content.numChildren - 1; i > -1; i--) {
            const item = content.getChildAt(i);
            if (item && item.name === name) {
                return item;
            }
        }
    }
}
