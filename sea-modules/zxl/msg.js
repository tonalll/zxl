define('zxl/msg', function (require, exports, module) {
    var index = require('index');
    var $ = require('jquery');
    var msg = {
        name: 'msg',
        sayName: function () {
            console.info(this.name);
        },
        notice: function (_text) {
            $('body').append(index.frag['notice']);
            var $notice = $('.m-notice');
            var $con = $notice.find('.m-notice-con');
            $con.html(_text || '提示信息');

            $notice.css({
                top: -$notice.height(),
                left: ($(window).width() - $notice.width()) / 2
            }).animate({
                top: 0
            }, 300);
            //        自动关闭
            setTimeout(function () {
                $notice.remove();
            }, 4000);
        },
        alert: function (_text, _mask, _autoClose) {
            var showMask = _mask || false;
            $('.m-alert').remove();
            $('body').append(index.frag['alert']);
            if (showMask) $('body').append(index.frag['alert-mask']);
            var $alert = $('.m-alert:last'),
                $alertCon = $('.m-alert-con', $alert),
                $alertClose = $('.m-alert-close', $alert),
                $mask = $('#m-alert-mask');
            $mask.fadeTo(500, 0.2);
            $alertCon.html(_text || '提示信息');
            $alert.css({
                top: -$alert.height(),
                left: ($(window).width() - $alert.width()) / 2
            }).animate({
                top: 0
            }, 300);
            $alertClose.on({
                click: function () {
                    $alert.remove();
                    if (showMask) $mask.fadeOut(500, function () {
                        $mask.remove()
                    });
                },
                mouseover: function () {
                    $(this).addClass('m-alert-close-hover');
                },
                mouseleave: function () {
                    $(this).removeClass('m-alert-close-hover');
                }
            });
            //        自动关闭
            if (_autoClose) {
                setTimeout(function () {
                    $alert.remove();
                    if (showMask) $mask.fadeOut(500, function () {
                        $mask.remove()
                    });
                }, 4000);
            }
        },
        confirm: function (_text, _option) {
            var options = {
                enter: function () {},
                cancel: function () {},
                mask: false
            };
            options = $.extend(options, _option);
            $('body').append(index.frag['confirm']);
            if (options.mask) $('body').append(index.frag['alert-mask']);

            var $confirm = $('.m-confirm:last'),
                $confirmCon = $('.m-confirm-con', $confirm),
                $confirmClose = $('.m-confirm-close', $confirm),
                $confirmCancle = $('.m-confirm-cancle', $confirm);

            $mask = $('#m-alert-mask');

            $mask = $('#m-alert-mask');
            $mask.fadeTo(500, 0.2);
            $confirmCon.html(_text || '提示信息');


            $confirmClose.on({
                click: function () {
                    $('.m-confirm:last').remove();
                    if (options.mask) $mask.fadeOut(500, function () {
                        $mask.remove()
                    });
                    options.enter();
                },
                mouseover: function () {
                    $(this).addClass('m-confirm-close-hover');
                },
                mouseleave: function () {
                    $(this).removeClass('m-confirm-close-hover');
                }
            });
            $confirmCancle.on({
                click: function () {
                    $('.m-confirm:last').remove();
                    if (options.mask) $mask.fadeOut(500, function () {
                        $mask.remove()
                    });
                    options.cancel();
                },
                mouseover: function () {
                    $(this).addClass('m-confirm-cancle-hover');
                },
                mouseleave: function () {
                    $(this).removeClass('m-confirm-cancle-hover');
                }
            });

            $confirm.css({
                top: -$confirm.height(),
                left: ($(window).width() - $confirm.width()) / 2
            }).animate({
                top: 0
            }, 300);

        },

    }
    window.msg = msg;
    module.exports = msg;

});