define('zxl/ui', function (require, exports, module) {
    var $ = require('jquery');
    var index = require('index');
    var global = require('global');
    var layout = require('layout');
    var room = require('room');
    var layer = require('layer');
    var ajax = require('ajax');
    var grid = require('grid');
    var datepicker = require('datepicker');
    require('umeditor');
    //    ui模块
    function ui(_$g) {
        var $g = _$g || document;
        console.info('ui init');
        //                console.info(ui);
        //        ui.context = function () {
        //            console.info($g);
        //        }
        //                console.info(index.cache);
        //        logo按钮
        $('#start', $g).on({
            mouseover: function () {
                $('.x-menu', this).show();
            },
            mouseout: function () {
                $('.x-menu', this).hide();
            }
        });
        //        任务栏切换标题显示
        $('#toogle-TaskBar', $g).on({
            click: function () {
                if (global.$body.hasClass('taskBar-min')) global.$body.removeClass('taskBar-min');
                else global.$body.addClass('taskBar-min');
                layout.init();

            }
        });
        // 任务栏图标文字不同时显示时，兼容菜单过多滚动显示，标题动态显示
        $('#taskBar', $g).on({
            mouseover: function () {
                if (!$('body').hasClass('taskBar-min')) return;
                var $this = $(this);
                var name = $this.find('.x-name').text();
                var $nameMagic = $('.name-magic');
                $nameMagic.html(name).css({
                    top: $this.position().top,
                    left: $this.width(),
                }).show();
            },
            mouseleave: function () {
                $('.name-magic').hide();
            }
        }, '.x-unit');
        //        window
        $('[window]', $g).each(function (i, e) {
            var $this = $(this);
            //            console.info($this);
            var options = $.zJSON($this.attr('window'));
            $this.on({
                click: function () {
                    room.window.addAndOpen(options);
                }
            });
        });
        //        layer
        $('[layer]', $g).each(function (i, e) {
            var $this = $(this);
            var options = $.zJSON($this.attr('layer'));
            options.target = $this.closest('.layer').parent();
            $this.on({
                click: function () {
                    layer.addAndOpen(options);
                }
            });
        });
        //        edit点击编辑插件
        $('[edit]', $g).each(function () {
            var $this = $(this);
            $this.on({
                click: function () {
                    seajs.use('edit', function (edit) {
                        edit($this);
                    });
                }
            });
        });
        //        层关闭
        $('.layer-back', $g).each(function (i, e) {
            var $this = $(this);
            $this.on({
                click: function () {
                    layer.close($this.closest('.layer').attr('layer-id'));
                }
            });
        });
        //        ajax提交
        $('.m-ajaxSubmit', $g).each(function (i, e) {
            var $form = $('form');
            var callback = $.extend({}, ajax.callback, $.zJSON($form.attr('callback')));
            $form.data({
                callback: callback
            });
            console.info($form);
            $form.on({
                submit: function () {
                    ajax.ajaxSubmit($form);
                    return false;
                }
            });
        });
        // 单个按钮ajax点击
        $('[m-ajax]', $g).each(function () {
            var $this = $(this);
            $this.on({
                click: function () {
                    ajax.ajax($this);
                }
            });
        });
        // 上传组件
        $('[upload]', $g).each(function () {
            var $thisUpload = $(this);
            var _options = {
                auto: true,
                swf: index.options.swf,
                pick: {
                    id: $thisUpload[0]
                },
                eventsBack: {
                    init: function (_uploader) {
                        //                    上传组件初始化后调用传入_uploader为上传组件实例
                    },
                    // eventsBack是我自己新增，方便调用。
                    beforeFileQueued: function (file) {
                        // 当文件被加入队列之前触发，此事件的handler返回值为false，则此文件不会被添加进入队列。
                        // 参数File对象
                    },
                    uploadSuccess: function (file, data) {
                        //当文件上传成功时触发
                        // File对象
                        // data 服务端返回的数据
                    },
                    uploadError: function (file, data) {
                        console.info('uploadError');
                        //当文件上传出错时触发
                        // File对象
                        // data 服务端返回的数据
                    },
                    error: function (handler) {
                        console.info('error');
                        //                        console.info(handler);
                        // 当validate不通过时，会以派送错误事件的形式通知调用者
                        // type {String} 错误类型。
                        // 当validate不通过时，会以派送错误事件的形式通知调用者。通过upload.on('error', handler)可以捕获到此类错误，目前有以下错误会在特定的情况下派送错来。

                        // if (handler == "Q_EXCEED_NUM_LIMIT") {
                        //     index.alert("最多只能上传" + options.fileNumLimit + "个!");
                        // }
                        if (handler == "F_DUPLICATE") {
                            msg.notice("文件重复!");
                        }
                        // Q_EXCEED_NUM_LIMIT 在设置了fileNumLimit且尝试给uploader添加的文件数量超出这个值时派送。
                        // Q_EXCEED_SIZE_LIMIT 在设置了Q_EXCEED_SIZE_LIMIT且尝试给uploader添加的文件总大小超出这个值时派送。
                        // Q_TYPE_DENIED 当文件类型不满足时触发。。
                    }
                }
            };
            // $thisUpload.addClass('upload');
            var options = $.zJSON($(this).attr('upload'));
            options = $.extend(true, {}, _options, options);
            var uploader;
            //        初始化文件上传组件
            uploader = WebUploader.create(options);
            //            将上传组件缓存入上传节点数据
            $thisUpload.data({
                uploader: uploader
            });
            //            上传组件初始化成功后调用
            console.info(options.eventsBack);
            options.eventsBack.init(uploader);
            uploader.on('beforeFileQueued', options.eventsBack.beforeFileQueued);
            //        文件上传成功{}
            uploader.on('uploadSuccess', options.eventsBack.uploadSuccess);
            //        当文件上传出错时触发{}
            uploader.on('uploadError', options.eventsBack.uploadError);
            //        上传错误
            uploader.on('error', options.eventsBack.error);
        });
        //        分页组件
        $('.m-pageSubmit', $g).each(function (i, e) {
            var $form = $(this);
            var callback = $.extend({}, ajax.callback, $.zJSON($form.attr('callback')));
            $form.data({
                callback: callback
            });
            var $pageLayout = $form.closest('.pageLayout');
            var pageId = $pageLayout.attr('pageLayout-id') || Math.random().toString().replace('0.', '')
            $pageLayout.attr('pageLayout-id', pageId);
            $form.attr('pageForm-id', pageId);
            $form.on({
                submit: function () {
                    ajax.pageSubmit($form);
                    return false;
                }
            });
        });
        $('.m-pageBar', $g).each(function (i, e) {
            var $this = $(this);
            var $pageLayout = $this.closest('.pageLayout');
            var pageId = $pageLayout.attr('pageLayout-id') || Math.random().toString().replace('0.', '')
            $pageLayout.attr('pageLayout-id', pageId);
            $this.attr('pageBar-id', pageId);
            grid.pageBar($this);
        });
        // editor编辑器组件
        $('.m-editor', $g).each(function () {
            var $this = $(this);
            var id = 'editor-' + Math.random().toString().slice(2);
            $this.attr('id', id);
            UM.getEditor(id);
            UM.getEditor(id).focus();
        });

        //        自定义ui事件
        userUi($g);

    }
    //    加载用户自定义ui事件
    function userUi(_$g) {
        var $g = _$g || document;
        for (var i = 1; i <= index.uid; i++) {
            if (index.cache[i.toString()]) {
                index.cache[i.toString()].handle($g);
            }
        }
    }
    module.exports = ui;
});