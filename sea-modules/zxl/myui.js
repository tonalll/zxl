define('zxl/myui', function (require, exports, module) {
    var $ = require('jquery');
    var zxl = require('index');
    var room = require('room');
    //    自定义ui模块 绑定相关事件
    //    console.info('myui init');

    zxl.on({
        init: function (_$g) {
            var $g = _$g || document;
            //            console.info('myui init');
            //            console.info($('[date]', $g));
            $('[date]', $g).each(function () {
                var $this = $(this);
                $this.on({
                    focusin: function () {
                        //                        console.info('focusin');
                        var _opts = {};
                        var opts = $.zJSON($this.attr('date'));
                        opts = $.extend({}, _opts, opts);
                        //                        if ($this.attr("dateFmt")) opts.pattern = $this.attr("dateFmt");
                        //                        if ($this.attr("minDate")) opts.minDate = $this.attr("minDate");
                        //                        if ($this.attr("maxDate")) opts.maxDate = $this.attr("maxDate");
                        //                        if ($this.attr("mmStep")) opts.mmStep = $this.attr("mmStep");
                        //                        if ($this.attr("ssStep")) opts.ssStep = $this.attr("ssStep");
                        $this.datepicker(opts);
                    }
                });
            });
            //    右键菜单 
            $('#unitContextMenu', $g).on({
                mouseleave: function () {
                    $(this).hide();
                }
            });
            //    关闭
            $('#unit-close', $g).on({
                click: function () {
                    var $unitContextMenu = $('#unitContextMenu');
                    console.info($unitContextMenu.data());
                    var data = $unitContextMenu.data();
                    room.window.remove(data.id);
                    room.taskBar.close(data.id);
                    var $sleep = $('#taskBar .x-layout .x-unit-sleep:last');
                    $sleep.click();
                    $unitContextMenu.hide();
                }
            });
            //    固定
            $('#unit-fix', $g).on({
                click: function () {
                    var $unitContextMenu = $('#unitContextMenu');
                    $.ajax({
                        url: index.config.unitFix,
                        dataType: 'json',
                        data: {
                            id: $unitContextMenu.data().id
                        }
                    }).done(function () {
                        index.alert('固定菜单成功');
                        // console.info($unitContextMenu.data());
                        var $unit = index.taskBar.getUnit($unitContextMenu.data().id);
                        $unit.addClass('unit-fixed');
                        var unitObj = $.zJSON($unit.attr('desk-option'));
                        //                index.taskBar.unit[unitObj.id]=unitObj;
                        index.taskBar.unit[unitObj.id] = $.extend({
                            $dom: $unit
                        }, unitObj);
                    });
                }
            });
            //    刷新
            $("#unit-refresh", $g).on({
                click: function () {
                    var $unitContextMenu = $('#unitContextMenu');
//                    console.info($unitContextMenu.data());
                    var data = $unitContextMenu.data();
                    room.window.refresh(data.id);
                    $('#unitContextMenu').hide();
                    // console.info($unitContextMenu);
                    // console.info($unitContextMenu.data())
                }
            });

            //    解除固定
            $('#unit-unfix', $g).on({
                click: function () {
                    var $unitContextMenu = $('#unitContextMenu');
                    $.ajax({
                        url: index.config.unitUnfix,
                        dataType: 'json',
                        data: {
                            id: $unitContextMenu.data().id
                        }
                    }).done(function () {
                        index.alert('解除固定菜单成功');
                        // console.info($unitContextMenu.data());
                        var $unit = index.taskBar.getUnit($unitContextMenu.data().id);
                        $unit.removeClass('unit-fixed');
                        if (!$unit.hasClass('unit-active') && !$unit.hasClass('unit-sleep')) {
                            $unit.remove();
                            $unitContextMenu.hide();
                            index.desk.window[$unitContextMenu.data().id] = undefined;
                            index.taskBar.unit[$unitContextMenu.data().id] = undefined;
                        }
                    });
                }
            });


        }
    });

});