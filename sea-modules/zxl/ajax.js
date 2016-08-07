define('zxl/ajax', function (require, exports, module) {
    var index = require('index');
    var $ = require('jquery');
    var msg = require('msg');
    //    ajax模块
    var ajax = {
            name: 'ajax',
            sayName: function () {
                console.info(this.name);
            },
            callback: {
                beforeBack: function () {
                    return true;
                },
                afterBack: function () {},
            },
            init: function () {
                //        全局遮罩，ajax设置
                $.ajaxSetup({
                    timeout: 40000,
                    cache: false,
                    type: 'post'
                });
                $('body').append('<div id="m-ajax-mask"><div id="m-ajax-animate"></div></div>');
                $(document).on({
                    ajaxStart: function () {

                        // console.info('ajaxStart');
                        $('#m-ajax-mask').show();
                    },
                    ajaxSend: function (event, xhr, options) {
                        // options.data = options.data || {};
                        // options.data.tmp = 100;
                        // console.info(options);
                        // return false;
                        // console.info('ajaxStart');
                        // return false
                        //                    $ajaxMask.show();
                    },
                    ajaxStop: function () {
                        $('#m-ajax-mask').hide();
                        // console.info('ajaxStop');

                    },
                    ajaxSuccess: function () {},
                    ajaxError: function (event, xhr, ajaxOptions, thrownError) {
                        $('#m-ajax-mask').hide();
                        //                console.info(event);
                        //                console.info(xhr);
                        //                console.info(ajaxOptions);
                        //                console.info(thrownError);
                        // index.alert("<div>Http status: " + xhr.status + " " + xhr.statusText + "</div>" + "<div>ajaxOptions: " + ajaxOptions + "</div>" + "<div>thrownError: " + thrownError + "</div>" + "<div>" + xhr.responseText + "</div>");
                        //                    global.isTimeout(xhr.responseText);
                        //                    index.alert("<div>" + xhr.responseText + "</div>");
                        msg.alert(xhr.responseText, true);

                    }
                });

            },
            ajaxSubmit: function (_$form) {
                var callback = _$form.data().callback;
                if (!callback.beforeBack()) return;
                $.ajax({
                    url: _$form.attr('action'),
                    data: _$form.serialize(),
                    dataType: 'json'
                }).done(function (_json) {
                    callback.afterBack(_$form, _json);
                    ajax.done(_json);
                });
            },
            ajax: function (_$this) {
                var _options = {
                    url: '',
                    message: '',
                    beforeBack: function (_$this) {
                        //                        _$this当前点击的组件对象
                        return true;
                    },
                    afterBack: function (_json, _$this) {}
                };
                var options = $.zJSON(_$this.attr('m-ajax'));
                options = $.extend({}, _options, options);
                if (options.message) msg.confirm(options.message, {
                    enter: function () {
                        if (options.beforeBack(_$this)) ajax._ajax(options, _$this);
                    },
                    mask: false
                });
                else ajax._ajax(options, _$this);
            },
            _ajax: function (_options, _$this) {
                $.ajax({
                    url: _options.url
                }).done(function (_json) {
                    ajax.done(_json);
                    _options.afterBack(_json, _$this);
                });
            },
            pageSubmit: function (_$form) {
                var callback = $.extend({}, ajax.callback, $.zJSON(_$form.attr('callback')));
                var $pageLayout = _$form.closest('.pageLayout');
                if (!callback.beforeBack()) return;
                $.ajax({
                    url: _$form.attr('action'),
                    data: _$form.serialize(),
                    dataType: 'html'
                }).done(function (_html) {
                    $pageLayout.html(_html);
                    //                console.info($pageLayout.find('>.pageLayout'));
                    $pageLayout.find('>.pageLayout').children().unwrap();
                    seajs.use('ui', function (ui) {
                        ui($pageLayout);
                    });
                    callback.afterBack(_$form);
                });
            },
            done: function (_json) {
                //                console.info(_json);

                //            msg.alert(_json.message,true);
                //            var callback = _$form.data().callback;
                //            callback.afterBack(_$form, _json);
                //        自定义全局成功回调事件
                userDone(_json);

            },
            on: function (_obj) {
                console.info(_obj.done);
                var obj = _obj || {};
                if ($.isFunction(obj.done)) {
                    this.uid += 1;
                    this.cache[this.uid.toString()] = {
                        handle: obj.done
                    }

                }
            },
            cache: {
                //
            },
            uid: 0,
        }
        //    加载用户自定义u全局成功回调事件

    function userDone(_json) {
        for (var i = 1; i <= ajax.uid; i++) {
            if (ajax.cache[i.toString()]) {
                ajax.cache[i.toString()].handle(_json);
            }
        }
    }
    module.exports = ajax;

});