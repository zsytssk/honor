import { HonorDialog, HonorDialogConfig, DEFAULT_CONFIG } from './view';
import { injectAfter, createScene } from 'honor/utils/tool';
import { loaderManager } from 'honor/state';

/**
 * 全局默认弹出对话框效果，可以设置一个效果代替默认的弹出效果，
 * 如果不想有任何效果，可以赋值为null
 */
const defaultPopupEffect = function(dialog: HonorDialog) {
    if (dialog.HonorEffectTween) {
        (dialog.HonorEffectTween as Laya.Tween).complete();
    }
    dialog.HonorEffectTween = Laya.Tween.from(
        dialog,
        {
            x: Laya.stage.width / 2,
            y: Laya.stage.height / 2,
            scaleX: 0.2,
            scaleY: 0.2,
            alpha: 0,
        },
        300,
        Laya.Ease.backOut,
        Laya.Handler.create(this, () => {
            dialog.HonorEffectTween = undefined;
            dialog.scale(1, 1);
            dialog.alpha = 1;
            this.doOpen(dialog);
        }),
        0,
        false,
        false,
    );
};
/** 全局默认关闭对话框效果，可以设置一个效果代替默认的关闭效果，
 * 如果不想有任何效果，可以赋值为null
 */
const defaultCloseEffect = function(dialog: HonorDialog) {
    if (dialog.HonorEffectTween) {
        (dialog.HonorEffectTween as Laya.Tween).complete();
    }

    dialog.HonorEffectTween = Laya.Tween.to(
        dialog,
        {
            x: Laya.stage.width / 2,
            y: Laya.stage.height / 2,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
        },
        300,
        Laya.Ease.backIn,
        Laya.Handler.create(this, () => {
            dialog.HonorEffectTween = undefined;
            dialog.scale(1, 1);
            dialog.alpha = 1;
            this.doClose(dialog);
        }),
        0,
        false,
        false,
    );
};

export type DialogRefUrl = string | Ctor<HonorDialog> | HonorDialog;
type DialogInfo = {
    url: DialogRefUrl;
    dialog: HonorDialog;
    config: HonorDialogConfig;
};
type WaitOpenDialogMap = Map<DialogRefUrl, Promise<HonorDialog>>;
/**
 * <code>DialogManager</code> 对话框管理容器，所有的对话框都在该容器内，并且受管理器管理。
 * 任意对话框打开和关闭，都会触发管理类的open和close事件
 * 可以通过UIConfig设置弹出框背景透明度，模式窗口点击边缘是否关闭，点击窗口是否切换层次等
 * 通过设置对话框的zOrder属性，可以更改弹出的层次
 */
export class DialogManagerCtor {
    /** 正在打开的 dialog */
    private wait_dialog_task = new Map() as WaitOpenDialogMap;
    /** 已经打开的 dialog */
    private open_dialog_list: DialogInfo[] = [];
    /** 缓存关闭的 dialog */
    private dialog_pool_list: DialogInfo[] = [];
    private dialog_manager: Laya.DialogManager;
    constructor() {
        UIConfig.closeDialogOnSide = false;
        const dialog_manager = Laya.Dialog.manager;
        injectAfter(
            dialog_manager,
            'doClose',
            this.injectDoCloseAfter.bind(this),
        );
        injectAfter(
            dialog_manager,
            'doOpen',
            this.injectDoOpenAfter.bind(this),
        );
        dialog_manager.popupEffectHandler = new Laya.Handler(
            dialog_manager,
            defaultPopupEffect,
        );
        dialog_manager.closeEffectHandler = new Laya.Handler(
            dialog_manager,
            defaultCloseEffect,
        );
        this.dialog_manager = dialog_manager;
    }

    /** @todo 逻辑需要整理下 getViewByPool 不再使用... */
    public async openDialog(
        url: DialogRefUrl,
        params?: any[],
        config?: HonorDialogConfig,
        use_exist?: boolean,
        show_effect?: boolean,
    ) {
        const { wait_dialog_task, open_dialog_list } = this;

        /** 使用正在打开或者已经打开的弹出层... */
        let dialog: HonorDialog;
        if (use_exist) {
            /** 正在打开的dialog */
            const wait_open_dialog = wait_dialog_task.get(url);
            if (wait_open_dialog) {
                dialog = await wait_open_dialog.then(_dialog => {
                    return _dialog;
                });
            } else {
                /** 已经打开的dialog */
                const item = open_dialog_list.find(_item => {
                    return _item.url === url;
                });
                if (item) {
                    dialog = item.dialog;
                }
            }
        }

        /** 如果没有找到dialog(use_exist=true), 后者use_exist=false */
        if (!dialog) {
            /** 已经打开dialog, 从wait_dialog_task移除, 放到open_dialog_list中 */
            const wait_open_dialog = this.toOpenDialog(url);
            wait_dialog_task.set(
                url,
                wait_open_dialog.then(_dialog => {
                    wait_dialog_task.delete(url);
                    return _dialog;
                }),
            );

            dialog = await wait_open_dialog;
        }

        /** 设置dialog的配置 */
        const dialog_config = this.setDialogConfig(url, dialog, config);
        if (dialog.onMounted) {
            dialog.onMounted(...params);
        }

        /**  */
        const ori_show_effect = dialog.popupEffect;
        if (show_effect !== undefined && show_effect === false) {
            dialog.popupEffect = null;
        }
        dialog.open(dialog_config.closeOther);
        if (ori_show_effect) {
            dialog.popupEffect = ori_show_effect;
        }
        this.checkMask();
        return dialog;
    }
    public toOpenDialog(url: DialogRefUrl): Promise<HonorDialog> {
        return new Promise((resolve, reject) => {
            /** 使用dialog_pool_list的弹出层 */
            const { dialog_pool_list } = this;
            for (let i = 0; i < dialog_pool_list.length; i++) {
                const item = dialog_pool_list[i];
                if (item.url === url) {
                    dialog_pool_list.splice(i, 1);
                    const dialog = item.dialog;
                    return resolve(dialog);
                }
            }

            /** 创建弹出层 */
            if (typeof url === 'string') {
                loaderManager.loadScene('Dialog', url).then(_dialog => {
                    resolve(_dialog as HonorDialog);
                });
            } else if (typeof url === 'function') {
                createScene(url).then(dialog => {
                    return resolve(dialog);
                });
            } else if (url instanceof Laya.Dialog) {
                return resolve(url);
            }
        });
    }
    /** 在dialog关闭之后将没有destroy的dialog放在dialog_pool_list, 下次利用 */
    private setDialogConfig(
        url: DialogRefUrl,
        dialog: HonorDialog,
        config: HonorDialogConfig = {},
    ) {
        const { open_dialog_list } = this;
        config = {
            ...DEFAULT_CONFIG,
            ...dialog.config,
            ...config,
        };
        const item = open_dialog_list.find(_item => {
            return _item.dialog === dialog;
        });

        if (item) {
            item.config = config;
        } else {
            open_dialog_list.push({
                url,
                dialog,
                config,
            });
        }
        return config;
    }
    private getDialogConfig(dialog: HonorDialog): HonorDialogConfig {
        const { open_dialog_list } = this;
        const item = open_dialog_list.find(_item => {
            return _item.dialog === dialog;
        });
        return item && item.config;
    }
    /** 在dialog关闭之后将没有destroy的dialog放在dialog_pool_list, 下次利用 */
    private injectDoCloseAfter(dialog: HonorDialog) {
        const { open_dialog_list, dialog_pool_list } = this;
        let dialog_info: DialogInfo;
        for (let i = 0; i < open_dialog_list.length; i++) {
            const item = open_dialog_list[i];
            if (item.dialog === dialog) {
                dialog_info = item;
                open_dialog_list.splice(i, 1);
                break;
            }
        }
        this.checkMask();
        if (dialog_info && !dialog.destroyed) {
            dialog_pool_list.push(dialog_info);
        }
    }
    /** 在dialog打开之后 */
    private injectDoOpenAfter(dialog: HonorDialog) {
        const config = this.getDialogConfig(dialog);
        if (config && config.autoClose) {
            Laya.timer.once(config.autoClose as number, dialog, dialog.close);
        }
    }
    /** 在dialog打开之后, 设置背景 + 点击关闭 */
    private checkMask() {
        const { dialog_manager } = this;
        const { maskLayer } = dialog_manager;
        for (let i = dialog_manager.numChildren - 1; i > -1; i--) {
            const dialog = dialog_manager.getChildAt(i) as HonorDialog;
            if (dialog && dialog.isModal) {
                const dialog_config = this.getDialogConfig(dialog);
                if (!dialog_config) {
                    continue;
                }
                UIConfig.popupBgAlpha = dialog_config.shadowAlpha;
                UIConfig.popupBgColor = dialog_config.shadowColor;
                if (dialog_config.closeOnSide) {
                    maskLayer.offAllCaller(dialog_manager);
                    maskLayer.once(Laya.Event.CLICK, dialog_manager, () => {
                        dialog.close();
                    });
                }

                const { width, height } = maskLayer;
                maskLayer.graphics.clear(true);
                maskLayer.graphics.drawRect(
                    0,
                    0,
                    width,
                    height,
                    UIConfig.popupBgColor,
                );
                maskLayer.alpha = UIConfig.popupBgAlpha;
                return;
            }
        }
    }
    public closeAllDialogs() {
        this.dialog_manager.closeAll();
    }
    public getDialogsByGroup(group) {
        this.dialog_manager.getDialogsByGroup(group);
    }
    public closeDialogsByGroup(group) {
        this.dialog_manager.closeByGroup(group);
    }
    public getDialogByName(name: string) {
        const { open_dialog_list } = this;
        for (const item of open_dialog_list) {
            const { dialog } = item;
            if (dialog.name === name) {
                return dialog;
            }
        }
    }
    public closeDialogByName(name: string) {
        const { open_dialog_list } = this;
        for (const item of open_dialog_list) {
            const { dialog } = item;
            if (dialog.name === name) {
                return dialog.close();
            }
        }
    }
    /** 隐藏遮罩 */
    public hideMask(visible) {
        const { dialog_manager } = this;
        const { maskLayer } = dialog_manager;
        maskLayer.visible = visible;
    }
}
