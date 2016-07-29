define('zxl/ui', function (require, exports, module) {
    var $ = require('jquery');
    var index = require('index');
    var global = require('global');
    var layout = require('layout');
    var room = require('room');
    var layer = require('layer');
    var ajax = require('ajax');
    var grid = require('grid');
    //    ui模块
    function ui(_$g) {
        var $g = _$g || document;
        //                console.info('ui init');
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
        $('.m-ajaxSubmit', $g).each(function (i, e) {
            var $form = $('form');
            var callback = $.extend({}, ajax.callback, $.zJSON($form.attr('callback')));
            $form.data({
                callback: callback
            });
            $form.on({
                submit: function () {
                    ajax.ajaxSubmit($form);
                    return false;
                }
            });
        });
        $('.m-pageSubmit', $g).each(function (i, e) {
            var $form = $('form');
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
        //        自定义ui事件
        userUi($g);

    }
    //    加载用户自定义ui事件
    function userUi(_$g) {
        var $g = _$g || document;
        for (var i = 1; i < index.uid; i++) {
            if (index.cache[i.toString]) {
                index.cache[i.toString].handle($g);
            }
        }
    }
    module.exports = ui;
});