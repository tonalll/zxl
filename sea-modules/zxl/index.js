define('zxl/index', function (require, exports, module) {
    var global = require('zxl/global');
    var $ = require('jquery');
    var layout = require('layout');
    require('zxl/test');
    require('extend'); //js扩展
    require('jqueryExtend'); //jquery扩展
    //    require('zxl/test');
    //    console.info($);
    //    console.info($.sayHello);
    //    $.sayHello();
    //    index模块
    var index = {
        name: 'index',
        sayName: function () {
            console.info(this.name);
        },
        frag: {},
        init: function () {
            $.ajax({
                timeout: 40000,
                cache: false,
                url: this.options.frag
            }).done(function (_html) {
                $(_html).find('[role]').each(function (i, e) {
                    var $this = $(this);
                    index.frag[$this.attr('role')] = $this.html();
                });
                //                console.info(index.frag);
                index._init();
            }).fail(function () {
                alert('系统初始化失败，配置文件加载错误！');
            });
        },
        _init: function () {
            //            this.sayName();
            //                        var path=seajs.resolve('zxl/global');
            //            console.info(path);
            //            console.info(require);
            //            console.info(global);
            //            console.info($('body'));
            $(document).ready(function () {
                global.init();
                layout.init();
                seajs.use('ajax', function (ajax) {
                    ajax.init();
                });
                global.$window.on({
                    resize: function () {
                        // console.info('窗口大小改变了');
                        layout.resize();
                    }
                });
                
                seajs.use('room', function (room) {
                    room.init(index.options);
                });
                //                引入上传插件
                //                __PUBLIC__zxl/sea-modules/zxl/webuploader.js
                //                seajs.config().data.base
                //                    <script src="__PUBLIC__zxl/sea-modules/zxl/webuploader.js"></script>

                $('html').append('<script src="'+seajs.config().data.base + 'zxl/webuploader.min.js?v='+Math.random()+'"></script>');
//                $('script:last').attr('src', seajs.config().data.base + 'zxl/webuploader.js');

            });
        },
        on: function (_obj) {
            //            console.info(_obj.init);
            var obj = _obj || {};
            if ($.isFunction(obj.init)) {
                this.uid += 1;
                this.cache[this.uid.toString()] = {
                    handle: obj.init
                }

            }
        },
        cache: {
            //
        },
        uid: 0,
        config: function (_options) {
            //            console.info(_option);
            this.options = $.extend(this.options, _options);
        },
        options: {
            frag: '',
            taskBar: '',
            defaultPage: '',
        }
    }
    window.index = index;
    module.exports = index;
});