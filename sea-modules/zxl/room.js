var aaa = 'asdf';
define('zxl/room', function (require, exports, module) {
    var $ = require('jquery');
    var layer = require('layer');
    var room = {
        window: {
            options: {
                id: 'window' + Math.random().toString().replace('0.', ''),
                url: '',
                title: '',
                ico: '',
                autoRefresh: false, //激活时自动刷新
            },
            //            窗口缓存
            cache: {},
            //            增加窗口
            add: function (_options) {
                var options = $.extend({}, room.window.options, _options);

                if (!room.window.cache[options.id]) {
                    var $room = $('#room');
                    $room.append('<div class="window c-bgColor-f" layer-total="0"></div>');
                    var $window = $('.window:last', $room);
                    $window.hide();
                    $window.attr('layer-total', 0).attr('window-id', options.id);
                    room.window.cache[options.id] = options;
                    room.window.cache[options.id].$window = $window;
                    $window.data(options);
                }
                $(document).trigger('windowAdd.' + options.id, options.id);
                $(document).off('windowAdd.' + options.id);

                //                $room.append('<div class="window c-bgColor-f"><div class="layer" layer-index=0></div></div>');
                //                $.ajax({
                //                    url: options.url
                //                }).done(function (_html) {
                //                    var $layer = $window.find('.layer');
                //                    $layer.html(_html);
                //                    if (isOpen) room.window.open(options.id);
                //                    seajs.use('ui', function (ui) {
                //                        //                        ui($layer);
                //                    });
                //                });

            },
            refresh: function (_id) {
                //                刷新
                var $window = room.window.getWindow(_id);
                $window.attr('layer-total', 1);
                $window.find('.layer').slice(1).remove();
                $window.find('.layer').show();
                layer.refresh(_id);
            },
            remove: function (_id) {
                $('[window-id="' + _id + '"]').remove();
                delete room.window.cache[_id];
            },
            getWindow: function (_id) {

                if (_id == 'currentWindow') return $('.window:visible:first');
                return _id ? $('[window-id="' + _id + '"]') : $('.window:visible:first');
            },
            //            打开激活窗口
            open: function (_id) {
                //                显示窗口
                //                判断层总数
                //                无层则加载第一层并显示
                //                有层则显示最后一层


                var $window = room.window.getWindow(_id);
                $window.show().siblings('.window').hide();
                room.desk.hide();
                room.taskBar.add(room.window.cache[_id]);
                $('#taskBar .x-unit-open').removeClass('x-unit-open').addClass('x-unit-sleep');
                room.taskBar.cache[_id].$unit.addClass('x-unit-open').removeClass('x-unit-sleep');

                var total = Number($window.attr('layer-total')) || 0;
                if (total == 0) {
                    //加载并显示第一层
                    var options = room.window.cache[_id];
                    options.target = options.$window;
                    layer.addAndOpen(options);
                } else {
                    //                    显示最后一层
                    layer.open($window.find('.layer:last').attr('lyaer-id'));
                }
                //                console.info(room.taskBar.cache);
                //                seajs.use(['ui', 'layout'], function (ui, layout) {//                    ui($window);
                //                    layout.init($window);
                //                });
            },
            addAndOpen: function (_options) {
                var options = _options;
                //                console.info(options);
                $(document).on(
                    'windowAdd.' + options.id, function (e, id) {
                        //                        console.info('window addAndOpen');
                        //                        console.info(id);
                        room.window.open(options.id);
                    }
                );
                room.window.add(options);
            },
        },
        desk: {
            show: function () {},
            hide: function () {
                $('#desk').hide();
            },
        },
        taskBar: {
            //            任务栏按钮缓存 
            cache: {},
            init: function () {
                $.ajax({
                    url: room.options.taskBar,
                    type: 'get'
                }).done(function (_json) {
                    //                    console.info(_json);
                    for (var i = 0; i < _json.length; i++) {
                        room.taskBar.add(_json[i]);
                    }
                    seajs.use('ui', function (ui) {
                        ui();
                    });
                    if (room.options.defaultPage) room.taskBar.cache[room.options.defaultPage].$unit.click();
                });
            },
            getUnit: function (_id) {
                return room.taskBar.cache[_id]['$unit'];
            },
            //            增加任务栏按钮
            add: function (_options) {
                var options = _options;
                if (room.taskBar.cache[options.id]) return;
                seajs.use('index', function (index) {
                    var html = index.frag['taskBarUnit'].replace('{id}', options.id).replace('{url}', options.url).replace(/{title}/g, options.title).replace(/{ico}/g, options.ico).replace('{autoRefresh}', options.autoRefresh || false);
                    $('#taskBar .x-layout').append(html);
                    var $this = $('#taskBar .x-layout .x-unit:last');
                    if (options.fixed) $this.addClass('x-fixed');
                    $this.on({
                        //                        click: function () {
                        //                            if ($this.is('.x-unit-open')) return;
                        //                            else if ($this.is('.x-unit-sleep')) room.window.open(options.id);
                        //                            else room.window.addAndOpen(options);
                        //                        },
                        contextmenu: function (e) {
                            //                            右键菜单
                            //                    console.info(e);
                            //                    index.alert();
                            var $unitContextMenu = $('#unitContextMenu');
                            $unitContextMenu.css({
                                top: e.pageY - 5,
                                left: e.pageX - 5
                            });
                            // console.info('右键');
                            //                    菜单初始化 
                            if ($this.hasClass('x-unit-open') || $this.hasClass('x-unit-sleep')) {
                                $('#unit-close').show();
                                $('#unit-refresh').show();
                            } else {
                                $('#unit-close').hide();
                                $('#unit-refresh').hide();
                            }
                            if ($this.hasClass('x-fixed')) {
                                $('#unit-unfix').show();
                                $('#unit-fix').hide();
                            } else {
                                $('#unit-unfix').hide();
                                $('#unit-fix').show();

                            }
                            $unitContextMenu.show();
                            $unitContextMenu.data(room.taskBar.cache[options.id]);
                            if ($unitContextMenu.zMargin('bottom') < 0) $unitContextMenu.css({
                                top: $unitContextMenu.offset().top + $unitContextMenu.zMargin('bottom')
                            });
                            // console.info($unitContextMenu.zMargin('bottom'));
                            return false;
                        }
                    });
                    room.taskBar.cache[options.id] = options;
                    room.taskBar.cache[options.id]['$unit'] = $this;
                });

            },
            close: function (_id) {
                var $unit = room.taskBar.cache[_id]['$unit'];
                if ($unit.is('.x-fixed')) $unit.removeClass('x-unit-open x-unit-sleep');
                else room.taskBar.remove(_id);
            },
            remove: function (_id) {
                var $unit = room.taskBar.cache[_id]['$unit'];
                delete room.taskBar.cache[_id];
                $unit.remove();
            },
        },
        init: function (_options) {
            room.options = _options;
            room.taskBar.init();
        },
        options: {}
    }
    window.room = room;
    module.exports = room;

});