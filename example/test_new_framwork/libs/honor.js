(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Honor", [], factory);
	else if(typeof exports === 'object')
		exports["Honor"] = factory();
	else
		root["Honor"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./Honor.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Honor.js":
/*!******************!*\
  !*** ./Honor.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Utils = exports.director = exports.run = exports.class = exports.version = exports.name = undefined;

var _Director = __webpack_require__(/*! ./UI/Director */ "./UI/Director.js");

var _Director2 = _interopRequireDefault(_Director);

var _Utils = __webpack_require__(/*! ./Utils */ "./Utils/index.js");

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var name = "Honor";
var version = "0.0.1-beta";
var Class = Laya.class;

function run(GameConfig, callback) {
    if (!callback) {
        console.error("需要引擎启动以后的回调函数，用来启动起始页等");
        return;
    }
    if (!Laya.View) {
        console.error("需要laya.ui库");
        return;
    }
    //根据IDE设置初始化引擎		
    if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    Laya["Physics"] && Laya["Physics"].enable();
    Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    Laya.stage.scaleMode = GameConfig.scaleMode;
    Laya.stage.screenMode = GameConfig.screenMode;
    Laya.stage.alignV = GameConfig.alignV;
    Laya.stage.alignH = GameConfig.alignH;
    //兼容微信不支持加载scene后缀场景
    Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") {
        this.DEBUG_MODE = true;
        Laya.enableDebugPanel();
    } else {
        this.DEBUG_MODE = false;
    }
    if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    // if (GameConfig.stat) Laya.Stat.show();
    Laya.alertGlobalError = false;

    _Director2.default.__init__();

    //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(null, callback));
}

exports.name = name;
exports.version = version;
exports.class = Class;
exports.run = run;
exports.director = _Director2.default;
exports.Utils = _Utils2.default;

/***/ }),

/***/ "./UI/Base/Dialog.js":
/*!***************************!*\
  !*** ./UI/Base/Dialog.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Dialog = __webpack_require__(/*! ../Manager/Dialog */ "./UI/Manager/Dialog.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dialog = function (_Laya$Dialog) {
    _inherits(Dialog, _Laya$Dialog);

    function Dialog() {
        _classCallCheck(this, Dialog);

        var _this = _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).call(this));

        _this._$config = Object.assign({}, _Dialog.DEFAULT_CONFIG);
        return _this;
    }

    _createClass(Dialog, [{
        key: "loadScene",
        value: function loadScene(path) {
            this._$needWaitForData = true;
            var url = path.indexOf(".") > -1 ? path : path + ".scene";
            var view = Laya.loader.getRes(url);
            if (view) {
                this.createView(view);
            } else {
                // loader.showLoadingPage("Dialog");
                var loader = null;
                Laya.loader.resetProgress();
                var dialogLoader = new Laya.SceneLoader();
                // dialogLoader.on(/*laya.events.Event.PROGRESS*/"progress", loader, loader.onLoadProgress, ["Dialog", url]);
                dialogLoader.on( /*laya.events.Event.COMPLETE*/"complete", this, this._onSceneLoaded, [url]);
                dialogLoader.load(url);
            }
        }
    }, {
        key: "onMounted",
        value: function onMounted() {}
    }, {
        key: "onResize",
        value: function onResize(width, height) {}
    }, {
        key: "config",
        set: function set(config) {
            this._$config = Object.assign(this._$config, config);
        }
    }]);

    return Dialog;
}(Laya.Dialog);

Laya["Dialog"] = laya.ui["Dialog"] = Dialog;
exports.default = Dialog;

/***/ }),

/***/ "./UI/Base/Scene.js":
/*!**************************!*\
  !*** ./UI/Base/Scene.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scene = function (_Laya$View) {
    _inherits(Scene, _Laya$View);

    function Scene() {
        _classCallCheck(this, Scene);

        var _this = _possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).call(this));

        _this._$libraryName = "Honor";
        _this._$viewType = "Scene";
        return _this;
    }

    _createClass(Scene, [{
        key: "loadScene",
        value: function loadScene(path) {
            this._$needWaitForData = true;
            var url = path.indexOf(".") > -1 ? path : path + ".scene";
            var view = Laya.loader.getRes(url);
            if (view) {
                this.createView(view);
            } else {
                // loader.showLoadingPage("Dialog");
                var loader = null;
                Laya.loader.resetProgress();
                var dialogLoader = new Laya.SceneLoader();
                dialogLoader.on( /*laya.events.Event.PROGRESS*/"progress", loader, loader.onLoadProgress, ["Dialog", url]);
                dialogLoader.on( /*laya.events.Event.COMPLETE*/"complete", this, this._onSceneLoaded, [url, loader, dialogLoader]);
                dialogLoader.load(url);
            }
        }
    }, {
        key: "createView",
        value: function createView(view) {
            _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "createView", this).call(this, view);

            this.callLater(function () {
                this.event("DialogViewCreated");
            });
        }
    }, {
        key: "_onSceneLoaded",
        value: function _onSceneLoaded(url, loader, dialogLoader) {
            // dialogLoader.off(/*laya.events.Event.PROGRESS*/"progress", loader, loader.onLoadProgress);
            this.createView(Laya.Loader.getRes(url));
            // loader.hideLoadingPage("Dialog");
        }
    }, {
        key: "onResize",
        value: function onResize(width, height) {}
    }]);

    return Scene;
}(Laya.View);

// delete Laya.Scene.open;
// delete Laya.Scene.load;
// delete Laya.Scene._onSceneLoaded;
// delete Laya.Scene.close;
// delete Laya.Scene.closeAll;
// delete Laya.Scene.destroy;
// delete Laya.Scene.setLoadingPage;
// delete Laya.Scene.showLoadingPage;
// delete Laya.Scene._showLoading;
// delete Laya.Scene._hideLoading;
// delete Laya.Scene.hideLoadingPage;
// delete Laya.Scene._root;
// delete Laya.Scene._loadPage;

Laya["Scene"] = laya.display["Scene"] = Scene;
exports.default = Scene;

/***/ }),

/***/ "./UI/Director.js":
/*!************************!*\
  !*** ./UI/Director.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Scene = __webpack_require__(/*! ./Manager/Scene */ "./UI/Manager/Scene.js");

var _Scene2 = _interopRequireDefault(_Scene);

var _Loader = __webpack_require__(/*! ./Manager/Loader */ "./UI/Manager/Loader.js");

var _Loader2 = _interopRequireDefault(_Loader);

var _Dialog = __webpack_require__(/*! ./Manager/Dialog */ "./UI/Manager/Dialog.js");

var _Dialog2 = _interopRequireDefault(_Dialog);

var _View = __webpack_require__(/*! ./View */ "./UI/View.js");

var _View2 = _interopRequireDefault(_View);

var _Scene3 = __webpack_require__(/*! ./Base/Scene */ "./UI/Base/Scene.js");

var _Scene4 = _interopRequireDefault(_Scene3);

var _Dialog3 = __webpack_require__(/*! ./Base/Dialog */ "./UI/Base/Dialog.js");

var _Dialog4 = _interopRequireDefault(_Dialog3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Director = {
    __init__: function __init__() {
        _View2.default.__init__();
        _Scene2.default.__init__();
        _Loader2.default.__init__();
        _Dialog2.default.__init__();

        Laya.stage.on(Laya.Event.RESIZE, this, this._onResize);
    },
    _onResize: function _onResize() {
        var _Laya$stage = Laya.stage,
            width = _Laya$stage.width,
            height = _Laya$stage.height;

        _View2.default._onResize(width, height);
        _Scene2.default._onResize(width, height);
        _Dialog2.default._onResize(width, height);
    },
    runScene: function runScene(url, params) {
        var scene = _View2.default.getViewByPool(url);
        if (scene) {
            _Scene2.default.switchzScene(params, scene);
            return;
        }
        switch (typeof url === "undefined" ? "undefined" : _typeof(url)) {
            // case "function":
            //     let scene = new url;
            //     scene.once("onViewCreated", SceneManager, SceneManager.switchScene, [params, scene]);
            // 	break;
            case "string":
                _Loader2.default.load("Scene", url, Laya.Handler.create(_Scene2.default, _Scene2.default.runScene, [url, params]));
                break;
        }
    },


    get runningScene() {
        return _Scene2.default._curScene;
    },

    openDialog: function openDialog(url, params, config) {
        var dialog = _View2.default.getViewByPool(typeof url === "function" ? url.name : url);
        if (dialog) {
            params && dialog.onMounted.apply(dialog, params);
            _Dialog2.default.openDialogByClass(config, dialog);
            return;
        }
        switch (typeof url === "undefined" ? "undefined" : _typeof(url)) {
            case "function":
                dialog = new url();
                params && dialog.onMounted.apply(dialog, params);
                if (!dialog._$needWaitForData) {
                    _Dialog2.default.openDialogByClass(config, dialog);
                } else {
                    dialog.once("onViewCreated", _Dialog2.default, _Dialog2.default.openDialogByClass, [config, dialog]);
                }
                break;
            case "string":
                _Loader2.default.load("Dialog", url, Laya.Handler.create(_Dialog2.default, _Dialog2.default.openDialogByData, [url, params, config]));
                break;
        }
    },
    getDialogByName: function getDialogByName(name) {
        return _Dialog2.default.getDialogByName(name);
    },
    getDialogsByGroup: function getDialogsByGroup(group) {
        return _Dialog2.default.getDialogsByGroup(group);
    },
    closeDialogByName: function closeDialogByName(name) {
        _Dialog2.default.closeDialogByName(name);
    },
    closeDialogsByGroup: function closeDialogsByGroup(group) {
        _Dialog2.default.closeDialogsByGroup(group);
    },
    closeAllDialogs: function closeAllDialogs() {
        _Dialog2.default.closeAll();
    },
    setLoadPageForScene: function setLoadPageForScene(url) {
        _View2.default.setLoadView("Scene", url);
    },
    setLoadPageForDialog: function setLoadPageForDialog(url) {
        _View2.default.setLoadView("Dialog", url);
    }
};

exports.default = Director;

/***/ }),

/***/ "./UI/Manager/Dialog.js":
/*!******************************!*\
  !*** ./UI/Manager/Dialog.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DEFAULT_CONFIG = undefined;

var _View = __webpack_require__(/*! ../View */ "./UI/View.js");

var _View2 = _interopRequireDefault(_View);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tween = Laya.Tween;
var Sprite = Laya.Sprite;

var DEFAULT_CONFIG = exports.DEFAULT_CONFIG = {
	// "isModal"      : true,       //是否是模式窗口
	"closeOther": false, //在弹窗模式为multiple时，是否在弹窗弹窗的时候关闭其他显示中的弹窗
	"closeOnSide": false, //模式窗口点击遮罩，是否关闭窗口，默认是关闭的
	"closeByGroup": false, //在弹窗模式为multiple时，是否在弹窗弹窗的时候关闭相同group属性的弹窗
	"closeByName": false, //在弹窗模式为multiple时，是否在弹窗弹窗的时候关闭相同name属性的弹窗
	// "popupCenter"  : true,       //指定对话框是否居中弹。 如果值为true，则居中弹出，否则，则根据对象坐标显示，默认为true。
	"shadowAlpha": 0.5, //弹出框背景透明度
	"shadowColor": "#000000", //弹出框背景颜色
	"autoClose": false //指定时间内自动关闭，单位为ms，默认不打开此功能
};

/**@private 全局默认弹出对话框效果，可以设置一个效果代替默认的弹出效果，如果不想有任何效果，可以赋值为null*/
var defaultPopupEffect = function defaultPopupEffect(dialog) {
	dialog.scale(1, 1);
	dialog._effectTween = Laya.Tween.from(dialog, { x: Laya.stage.width / 2, y: Laya.stage.height / 2, scaleX: 0, scaleY: 0 }, 300, Laya.Ease.backOut, Laya.Handler.create(this, this.doOpen, [dialog]), 0, false, false);
};
/**@private 全局默认关闭对话框效果，可以设置一个效果代替默认的关闭效果，如果不想有任何效果，可以赋值为null*/
var defaultCloseEffect = function defaultCloseEffect(dialog) {
	dialog._effectTween = Laya.Tween.to(dialog, { x: Laya.stage.width / 2, y: Laya.stage.height / 2, scaleX: 0, scaleY: 0 }, 300, Laya.Ease.backIn, Laya.Handler.create(this, this.doClose, [dialog]), 0, false, false);
};

/**
*<code>DialogManager</code> 对话框管理容器，所有的对话框都在该容器内，并且受管理器管理。
*任意对话框打开和关闭，都会触发管理类的open和close事件
*可以通过UIConfig设置弹出框背景透明度，模式窗口点击边缘是否关闭，点击窗口是否切换层次等
*通过设置对话框的zOrder属性，可以更改弹出的层次
*/
var DialogManager = {
	viewContent: null,
	dialogClassMap: {},

	/**@public 覆盖默认弹窗配置 */
	setDefaultConfig: function setDefaultConfig(config) {
		Object.assign(DEFAULT_CONFIG, config);
	},
	__init__: function __init__(type) {
		this.dialogType = type == "single" || type == "multiple" ? type : "single";
		this.maskLayerName = "__$DialogManagerMaskLayer:" + Math.random();
		this.popupEffectHandler = new Laya.Handler(this, defaultPopupEffect);
		this.closeEffectHandler = new Laya.Handler(this, defaultCloseEffect);

		this.maskLayer = new Sprite();
		this.maskLayer.on("click", this, this._closeOnSide);
		this.maskLayer.name = this.maskLayerName;

		_View2.default.addView("Dialog", this.maskLayer);
		_View2.default.setViewVisible("Dialog", false);

		this.viewContent = _View2.default.getView("Dialog");
		this.viewContent.mouseThrough = true;

		Laya.Dialog.manager = this;
		this._onResize();
	},
	_closeOnSide: function _closeOnSide() {
		var content = this.viewContent;
		var dialog = content.getChildAt(content.numChildren - 1);
		if (dialog instanceof laya.ui.Dialog && dialog.name !== this.maskLayerName && dialog.isModal && dialog._$configtmp.closeOnSide) {
			dialog.close();
		}
	},


	/**@private */
	_onResize: function _onResize(width, height) {
		var content = this.viewContent;
		this.maskLayer.size(width, height);

		// this.maskLayer.graphics.clear(true);
		// this.maskLayer.graphics.drawRect(0, 0, width, height, UIConfig.popupBgColor);
		// this.maskLayer.alpha=UIConfig.popupBgAlpha;

		for (var i = content.numChildren - 1; i > -1; i--) {
			var item = content.getChildAt(i);
			if (item.name !== this.maskLayerName) {
				if (item.isPopupCenter) {
					this._centerDialog(item);
				} else {
					item.onResize(width, height);
				}
			}
		}

		this._checkMask();
	},
	_centerDialog: function _centerDialog(dialog) {
		dialog.x = Math.round((Laya.stage.width - dialog.width >> 1) + dialog.pivotX);
		dialog.y = Math.round((Laya.stage.height - dialog.height >> 1) + dialog.pivotY);
	},


	/**@private */
	_clearDialogEffect: function _clearDialogEffect(dialog) {
		Laya.timer.clear(dialog, dialog.close);
		if (dialog._effectTween) {
			Tween.clear(dialog._effectTween);
			dialog._effectTween = null;
		}
	},


	/**@private 发生层次改变后，重新检查遮罩层是否正确*/
	_checkMask: function _checkMask() {
		var content = this.viewContent;
		this.maskLayer.removeSelf();

		for (var i = content.numChildren - 1; i > -1; i--) {
			var dialog = content.getChildAt(i);
			if (dialog && dialog.isModal) {
				this.maskLayer.graphics.clear(true);
				this.maskLayer.graphics.drawRect(0, 0, content.width, content.height, dialog._$configtmp.shadowColor);
				this.maskLayer.alpha = dialog._$configtmp.shadowAlpha;

				_View2.default.addViewAt("Dialog", this.maskLayer, i);
				// this.addChildAt(this.maskLayer, i);
				return;
			}
		}

		if (content.numChildren == 0) {
			_View2.default.setViewVisible("Dialog", false);
			// this.visible = false;
		}
	},
	openDialogByData: function openDialogByData(url, params, config, obj) {
		if (!obj) {
			throw "Can not find \"Dialog\":" + url;
		}
		if (!obj.props) {
			throw "\"Dialog\" data is error:" + url;
		}

		var runtime = obj.props.runtime ? obj.props.runtime : obj.type;
		var clas = Laya.ClassUtils.getClass(runtime);
		this.dialogClassMap[url] = clas;

		_View2.default.createView(obj, clas, url, params, Laya.Handler.create(this, this.openDialogByClass, [config]));
	},
	openDialogByClass: function openDialogByClass(cfg, dialog) {
		Laya.timer.callLater(this, function () {
			// this.visible = true;
			_View2.default.setViewVisible("Dialog", true);
		});

		this._clearDialogEffect(dialog);

		// const config = dialog._$config = Object.assign({}, DEFAULT_CONFIG, dialog._$config, cfg);
		var config = dialog._$configtmp = Object.assign({}, dialog._$config, cfg);
		// dialog._$customParams = params;

		_View2.default.addView("Dialog", dialog);
		// this.addChild(dialog);
		if (dialog.isPopupCenter) this._centerDialog(dialog);
		if (config.closeOther) this.closeAll();
		if (dialog.group && config.closeByGroup) this.closeByGroup(dialog.group);
		if (dialog.name && config.closeByName) this.closeByName(dialog.name);

		if (dialog.isModal || this.viewContent._getBit( /*laya.Const.HAS_ZORDER*/0x20)) {
			Laya.timer.callLater(this, this._checkMask);
		}

		if (config.onOpened) {
			if (dialog.onOpened) {
				dialog._$onOpened = dialog.onOpened;
			}
			dialog.onOpened = config.onOpened;
		}
		if (config.onClosed) {
			if (dialog.onClosed) {
				dialog._$onClosed = dialog.onClosed;
			}
			dialog.onClosed = config.onClosed;
		}

		if (dialog.isShowEffect && dialog.popupEffect != null) {
			dialog.popupEffect.runWith(dialog);
		} else {
			this.doOpen(dialog);
		}
	},


	/**@private */
	lock: function lock() {},

	/**@private */
	setLockView: function setLockView() {},


	/**
 *执行打开对话框。
 *@param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
 */
	doOpen: function doOpen(dialog) {
		// dialog.onOpened(dialog._$customParams);
		if (dialog._$configtmp.autoClose) {
			Laya.timer.once(dialog._$configtmp.autoClose, dialog, dialog.close);
		}
	},


	/**
 *关闭对话框。
 *@param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
 */
	close: function close(dialog) {
		this._clearDialogEffect(dialog);
		if (dialog.closeEffect != null && dialog.closeEffect instanceof Laya.Handler) {
			dialog.closeEffect.runWith([dialog]);
		} else {
			this.doClose(dialog);
		}
	},


	/**
 *执行关闭对话框。
 *@param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
 */
	doClose: function doClose(dialog) {
		if (dialog.name === this.maskLayerName) {
			dialog.removeSelf();
			return;
		}
		dialog.removeSelf();
		dialog.onClosed(dialog.closeType);
		if (dialog.autoDestroyAtClosed) {
			dialog.destroy();
		} else {
			_View2.default.recoverView(dialog);
		}
		if (this.maskLayer.parent) {
			Laya.timer.callLater(this, this._checkMask);
			// this._checkMask();
		}
	},


	/**
 *关闭所有的对话框。
 */
	closeAll: function closeAll() {
		var content = this.viewContent;
		for (var i = content.numChildren - 1; i > -1; i--) {
			var item = content.getChildAt(i);
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
	closeDialogByName: function closeDialogByName(name) {
		if (!name) {
			return;
		}
		var content = this.viewContent;

		for (var i = content.numChildren - 1; i > -1; i--) {
			var item = content.getChildAt(i);
			if (item.name == name) {
				this.close(item);
				break;
			}
		}
	},


	/**
  *根据组关闭所有弹出框
  *@param group 需要关闭的组名称
  */
	closeDialogsByGroup: function closeDialogsByGroup(group) {
		var content = this.viewContent;
		for (var i = content.numChildren - 1; i > -1; i--) {
			var item = content.getChildAt(i);
			if (item && item.group === group) {
				this.close(item);
			}
		}
	},


	/**
 *根据组获取所有对话框
 *@param group 组名称
 *@return 对话框数组
 */
	getDialogsByGroup: function getDialogsByGroup(group) {
		var content = this.viewContent;
		var arr = [];
		for (var i = content.numChildren - 1; i > -1; i--) {
			var item = content.getChildAt(i);
			if (item && item.group === group) {
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
	getDialogByName: function getDialogByName(name) {
		var content = this.viewContent;
		for (var i = content.numChildren - 1; i > -1; i--) {
			var item = content.getChildAt(i);
			if (item && item.name === name) {
				return item;
			}
		}
	}
};

exports.default = DialogManager;

/***/ }),

/***/ "./UI/Manager/Loader.js":
/*!******************************!*\
  !*** ./UI/Manager/Loader.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _View = __webpack_require__(/*! ../View */ "./UI/View.js");

var _View2 = _interopRequireDefault(_View);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoaderManager = {
    __init__: function __init__() {},
    load: function load(type, url, complete) {
        var sceneData = Laya.Loader.getRes(url);
        if (sceneData) {
            return complete.runWith(sceneData);
        }
        type && _View2.default.setLoadViewVisible(type, true);

        Laya.loader.resetProgress();
        var loader = new Laya.SceneLoader();
        loader.on( /*laya.events.Event.PROGRESS*/"progress", this, this.onLoadProgress, [type]);
        loader.once( /*laya.events.Event.COMPLETE*/"complete", this, this.onLoadComplete, [type, url, loader, complete]);
        loader.load(url);
    },
    onLoadProgress: function onLoadProgress(type, val) {
        type && _View2.default.setLoadProgress(type, val);
    },
    onLoadComplete: function onLoadComplete(type, url, loader, complete) {
        loader.off( /*laya.events.Event.PROGRESS*/"progress", null, this.onLoadProgress);
        var obj = Laya.Loader.getRes(url);

        complete.runWith(obj);
        type && _View2.default.setLoadViewVisible(type, false);
    }
};

exports.default = LoaderManager;

/***/ }),

/***/ "./UI/Manager/Scene.js":
/*!*****************************!*\
  !*** ./UI/Manager/Scene.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _View = __webpack_require__(/*! ../View */ "./UI/View.js");

var _View2 = _interopRequireDefault(_View);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SceneManager = {
    sceneClassMap: {},
    _curScene: null,
    __init__: function __init__() {},
    _onResize: function _onResize(width, height) {
        this._curScene && this._curScene.onResize(width, height);
    },
    switchScene: function switchScene(params, scene) {
        scene.onOpened && scene.onOpened.apply(scene, params);
        _View2.default.addView("Scene", scene);

        if (this._curScene) {
            this._curScene.onClosed && this._curScene.onClosed();
            this._curScene.destroy();
        }
        this._curScene = scene;
    },
    runScene: function runScene(url, params, obj) {
        if (!obj) {
            throw "Can not find \"Scene\":" + url;
        }
        if (!obj.props) {
            throw "\"Scene\" data is error:" + url;
        }

        var runtime = obj.props.runtime ? obj.props.runtime : obj.type;
        var clas = Laya.ClassUtils.getClass(runtime);
        this.sceneClassMap[url] = clas;

        _View2.default.createView(obj, clas, url, null, Laya.Handler.create(this, this.switchScene, [params]));
    }
};

exports.default = SceneManager;

/***/ }),

/***/ "./UI/View.js":
/*!********************!*\
  !*** ./UI/View.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var VIEW_MAP = ["SceneManager", "DialogManager", "LoadManager", "AlertManager"];
var LOAD_VIEW_MAP = {
    "Scene": null,
    "Dialog": null
};
var POOL = {};

var DirectorView = {
    __init__: function __init__() {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = VIEW_MAP[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var name = _step.value;

                var view = new Laya.Sprite();
                view.name = "_$" + name;
                this[view.name] = view;
                console.log(name);

                Laya.stage.addChild(view);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        Laya.stage.on(Laya.Event.RESIZE, this, this._onResize);
        this._onResize();
    },
    _onResize: function _onResize(width, height) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = VIEW_MAP[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var name = _step2.value;

                this["_$" + name].size(width, height);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        for (var i in LOAD_VIEW_MAP) {
            var view = LOAD_VIEW_MAP[i];
            view && view.onResize && view.onResize(width, height);
        }
    },
    _createLoadViewByClass: function _createLoadViewByClass(loadType, view) {
        this.addView("Load", view);
        LOAD_VIEW_MAP[loadType] = view;
    },
    _createLoadViewByData: function _createLoadViewByData(type, url, obj) {
        if (!obj) {
            throw "Can not find \"Scene\":" + url;
        }
        if (!obj.props) {
            throw "\"Scene\" data is error:" + url;
        }

        var runtime = obj.props.runtime ? obj.props.runtime : obj.type;
        var clas = Laya.ClassUtils.getClass(runtime);

        this.createView(obj, clas, url, Laya.Handler.create(this, this._createLoadViewByClass, [type]));
    },
    recoverView: function recoverView(view) {
        var key = view.url || view.constructor.name;
        if (!POOL[key]) {
            POOL[key] = [];
        }
        POOL[key].push(view);
    },
    getViewByPool: function getViewByPool(url) {
        if (POOL[url]) {
            return POOL[url].pop();
        }
        return null;
    },
    createView: function createView(data, clas, url, params, complete) {
        var scene = new clas();
        // var scene = params ? new clas(...params) : new clas();
        params && scene.onMounted && scene.onMounted.apply(scene, params);

        if (data.props.renderType == "instance") {
            scene = clas.instance || (clas.instance = scene);
        }
        if (scene && scene instanceof laya.display.Node) {
            scene.url = url;
            if (!scene._getBit( /*laya.Const.NOT_READY*/0x08)) {
                complete && complete.runWith(scene);
            } else {
                scene.on("onViewCreated", null, function () {
                    complete && complete.runWith(scene);
                });
                scene.createView(data);
            }
        } else {
            throw "Can not find \"Scene\":" + runtime;
        }
    },
    setLoadView: function setLoadView(type, url) {
        switch (typeof url === "undefined" ? "undefined" : _typeof(url)) {
            case "function":
                var view = new url();
                view.once("onViewCreated", this, this._createLoadViewByClass, [type]);
                break;
            case "string":
                LoaderManager.load(null, url, Laya.Handler.create(this, this._createLoadViewByData, [type, url]));
                break;
        }
    },
    setLoadViewVisible: function setLoadViewVisible(type, visible) {
        var view = LOAD_VIEW_MAP[type];
        view && (LOAD_VIEW_MAP[type].visible = visible);
    },
    setLoadProgress: function setLoadProgress(type, val) {
        var view = LOAD_VIEW_MAP[type];
        view && view.onProgress && view.onProgress(val);
    },
    getView: function getView(type) {
        return this["_$" + type + "Manager"];
    },
    setViewVisible: function setViewVisible(type, visible) {
        this["_$" + type + "Manager"].visible = visible;
    },
    addView: function addView(type, view) {
        this["_$" + type + "Manager"].addChild(view);
    },
    addViewAt: function addViewAt(type, view, index) {
        this["_$" + type + "Manager"].addChildAt(view, index);
    }
};

exports.default = DirectorView;

/***/ }),

/***/ "./Utils/createSkeleton.js":
/*!*********************************!*\
  !*** ./Utils/createSkeleton.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @public
 * 创建骨骼动画
 * @param {String} path 骨骼动画路径
 * @param {Number} rate 骨骼动画帧率，引擎默认为30，一般传24
 * @param {Number} type 动画类型 0,使用模板缓冲的数据，模板缓冲的数据，不允许修改	（内存开销小，计算开销小，不支持换装） 1,使用动画自己的缓冲区，每个动画都会有自己的缓冲区，相当耗费内存 （内存开销大，计算开销小，支持换装） 2,使用动态方式，去实时去画	（内存开销小，计算开销大，支持换装,不建议使用）
 * 
 * @return 骨骼动画
 */
function createSkeleton(path, rate, type) {
    rate = rate || 30;
    type = type || 0;
    var png = Laya.loader.getRes(path + ".png");
    var sk = Laya.loader.getRes(path + ".sk");
    if (!png || !sk) {
        return null;
    }

    var templet = new Laya.Templet();
    templet.parseData(png, sk, rate);

    return templet.buildArmature(type);
}

exports.default = createSkeleton;

/***/ }),

/***/ "./Utils/cutStr.js":
/*!*************************!*\
  !*** ./Utils/cutStr.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @public
 * 按指定长度截取字符串
 * @param {String} str 要截取长度的字符串
 * @param {Number} length 字符串长度
 * 
 * @return 截取长度后的字符串
 */
function cutStr(text, length) {
    text = text + "";
    var reg = /[^\x00-\xff]/g;
    if (text.replace(reg, "mm").length <= length) {
        return text;
    }
    var m = Math.floor(length / 2);
    for (var i = m; i < text.length; i++) {
        if (text.substr(0, i).replace(reg, "mm").length >= length) {
            return text.substr(0, i) + "...";
        }
    }
    return text;
}

exports.default = cutStr;

/***/ }),

/***/ "./Utils/extends.js":
/*!**************************!*\
  !*** ./Utils/extends.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isPlainObject = function () {
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call(Object);

    function isPlainObject(obj) {
        var proto, Ctor;

        if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
        }

        proto = Object.getPrototypeOf(obj);

        if (!proto) {
            return true;
        }

        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    };

    return isPlainObject;
}();

/**
 * @public
 * 将两个或更多对象的内容合并到第一个对象。使用方式见Jquery.extend
 * 调用方式
 * Sail.Utils.extend( [deep ], target, object1 [, objectN ] )
 * Sail.Utils.extend( target [, object1 ] [, objectN ] )
 * 
 * @return 合并后的对象
 */
function extend() {
    var options,
        name,
        src,
        copy,
        copyIsArray,
        clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    if (typeof target === "boolean") {
        deep = target;target = arguments[i] || {};i++;
    }
    if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object" && !(typeof target === "undefined" ? "undefined" : _typeof(target)) !== "function") {
        target = {};
    }
    if (i === length) {
        target = this;i--;
    }

    for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (target === copy) {
                    continue;
                }
                if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    target[name] = Utils.extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    return target;
};

exports.default = extend;

/***/ }),

/***/ "./Utils/formatTime.js":
/*!*****************************!*\
  !*** ./Utils/formatTime.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @public
 * 将毫秒转换为`{h}小时{m}分钟{s}秒`的格式
 * @param {Number} total 毫秒数
 * 
 * @return 格式化后的字符串
 */
function formatTime(total) {
    var time = "";
    var h = 0;
    var m = 0;
    var s = total % 60;
    if (total > 60) {
        m = total / 60 | 0;
    }
    if (m > 60) {
        h = m / 60 | 0;
        m = m % 60;
    }

    if (s > 0) {
        time = s + "秒";
    }
    if (m > 0) {
        time = m + "分钟" + time;
    }
    if (h > 0) {
        time = h + "小时" + time;
    }

    return time;
}

exports.default = formatTime;

/***/ }),

/***/ "./Utils/getStringLength.js":
/*!**********************************!*\
  !*** ./Utils/getStringLength.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @public
 * 获取字符串长度，支持中文
 * @param {String} str 要获取长度的字符串
 * 
 * @return 字符串长度
 */
function getStringLength(str) {
  return ("" + str.replace(/[^\x00-\xff]/gi, "ox")).length;
}

exports.default = getStringLength;

/***/ }),

/***/ "./Utils/index.js":
/*!************************!*\
  !*** ./Utils/index.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createSkeleton = __webpack_require__(/*! ./createSkeleton */ "./Utils/createSkeleton.js");

var _createSkeleton2 = _interopRequireDefault(_createSkeleton);

var _extends = __webpack_require__(/*! ./extends */ "./Utils/extends.js");

var _extends2 = _interopRequireDefault(_extends);

var _cutStr = __webpack_require__(/*! ./cutStr */ "./Utils/cutStr.js");

var _cutStr2 = _interopRequireDefault(_cutStr);

var _getStringLength = __webpack_require__(/*! ./getStringLength */ "./Utils/getStringLength.js");

var _getStringLength2 = _interopRequireDefault(_getStringLength);

var _formatTime = __webpack_require__(/*! ./formatTime */ "./Utils/formatTime.js");

var _formatTime2 = _interopRequireDefault(_formatTime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    createSkeleton: _createSkeleton2.default,
    extend: _extends2.default,
    cutStr: _cutStr2.default,
    getStringLength: _getStringLength2.default,
    formatTime: _formatTime2.default
};

/***/ })

/******/ });
});
//# sourceMappingURL=honor.js.map