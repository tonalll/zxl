define('zxl/ajax', function (require, exports, module) {
    var index = require('index');
    var $ = require('jquery');
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

                }
            });

        },
        ajaxSubmit: function (_$form) {
            var callback = $.extend({}, ajax.callback, $.zJSON(_$form.attr('callback')));
            if (!callback.beforeBack()) return;
            $.ajax({
                url: _$form.attr('action'),
                data: _$form.serialize(),
                dataType: 'json'
            }).done(function (_json) {
                callback.afterBack(_$form, _json);
                ajax.done(_$form, _json);
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
        done: function (_$form, _json) {
            console.info(_json);
        },
    }
    module.exports = ajax;

});