define('zxl/index', function (require, exports, module) {
    var global = require('zxl/global');
    var $ = require('jquery');
    var layout = require('layout');
    require('zxl/test');
    require('jqueryExtend');
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
                url: this.option.frag
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
                seajs.use('ui', function (ui) {
                    ui();
                });
                seajs.use('room', function (room) {
                    room.init(index.option);
                });

            });
        },
        on: function (_obj) {
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
        config: function (_option) {
            //            console.info(_option);
            this.option = $.extend(this.option, _option);
        },
        option: {
            frag: '',
            taskBar: '',
            defaultPage: '',
        }
    }
    module.exports = index;
});