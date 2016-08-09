define('zxl/myUi', function (require, exports, module) {
    var $ = require('jquery');
    var ui = require('ui');
    var global = require('global');
    var layout = require('layout');
    var room = require('room');
    var layer = require('layer');
    var ajax = require('ajax');
    var grid = require('grid');
    var datepicker = require('datepicker');
    require('umeditor');
    require('validate');
    require('poshytip');

    ui.on({
        parse: function (_$g) {
            var $g = _$g || document;
            //            console.info('myUi init');
            //            console.info($('[date]', $g));
            // 项目功能js
            // 案例大图删除
            var $seDtLayout = $('.se-dtLayout', $g);
            console.info($seDtLayout);
            if ($seDtLayout.length) {
                if ($seDtLayout.attr('data-url')) {
                    //                    初始化大图
                    var arr = $seDtLayout.attr('data-url').split(',');
                    var pre = $seDtLayout.attr('url-pre');
                    var str = '<div class="x-unit l-col"><img src="" alt=""><div class="x-del">删除</div</div>';
                    for (var i = 0; i < arr.length; i++) {
                        $seDtLayout.append(str);
                        $seDtLayout.find('.x-unit:last').find('img').attr({
                            src: pre + arr[i],
                            width: '100%'
                        });
                    }
                }

                //计算大图所有的值
                function creatDt() {
                    var str = '';
                    $seDtLayout.find('.x-unit img').each(function (index, ement) {
                        if (index == 0) str += $(this).attr('src').replace(pre, '');
                        else str += (',' + $(this).attr('src').replace(pre, ''));
                    });
                    $('input[name=dtpath]').val(str);
                }
                //                大图删除
                $seDtLayout.on({
                    click: function () {
                        var $this = $(this);
                        var $unit = $this.closest('.x-unit');
                        var uploader = $seDtLayout.data().uploader;
                        if($unit.data().file) uploader.removeFile($unit.data().file, true);
                        $unit.remove();
                        creatDt();
                    }
                }, '.x-del');
            }
            // 案例缩略图删除

            var $seSltLayout = $('.se-sltLayout', $g);
            $seSltLayout.on({
                click: function () {
                    var $unit = $seSltLayout.find('.x-unit');
                    var uploader = $seSltLayout.data().uploader;
                    if($unit.data().file) uploader.removeFile($unit.data().file, true);
                    $unit.find('img').remove();
                    $unit.hide();
                    $('input[name=sltpath]').val('');
                }
            }, '.x-del');



        }
    });

});