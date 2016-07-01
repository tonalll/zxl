define('zxl/room', function (require, exports, module) {
    var $ = require('jquery');
    var room = {
        window: {
            //            窗口缓存
            cache: {},
            //            增加窗口
            add: function (_option, _isOpen) {
                var isOpen = _isOpen || false;
                if (room.window.cache[_option.id]) {
                    if (isOpen) room.window.open(_option.id);
                    return;
                }
                var option = {
                    id: '',
                    url: '',
                    title: '',
                    ico: '',
                    autoRefresh: false, //激活时自动刷新
                };
                option = $.extend(option, _option);
                $.ajax({
                    url: option.url
                }).done(function (_html) {
                    var $room = $('#room');
                    $room.append('<div class="window c-bgColor-f"><div class="layer" layer-index=1></div></div>');
                    var $window = $('.window:last', $room);
                    $window.attr('layer-total', 1);
                    var $layer = $window.find('.layer');
                    $layer.html(_html);
                    room.window.cache[option.id] = option;
                    room.window.cache[option.id].$window = $window;
                    $window.data(room.window.cache[option.id]);
                    if (isOpen) room.window.open(option.id);
                });

            },
            refresh: function () {},
            close: function () {},
            remove: function () {},
            getWindow: function () {},
            //            打开激活窗口
            open: function (_id) {
                var $window = room.window.cache[_id].$window;
                $window.show().siblings('.window').hide();
                room.desk.hide();
                room.taskBar.add(room.window.cache[_id]);
                $('#taskBar .x-unit-open').removeClass('x-unit-open').addClass('x-unit-sleep');
                room.taskBar.cache[_id].$unit.addClass('x-unit-open').removeClass('x-unit-sleep');
                //                console.info(room.taskBar.cache);
                seajs.use(['ui', 'layout'], function (ui, layout) {
                    ui($window);
                    layout.init($window);
                });
            },
            addAndopen: function (_option) {
                room.window.add(_option, true);
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
                    url: room.option.taskBar,
                    type: 'get'
                }).done(function (_json) {
                    //                    console.info(_json);
                    for (var i = 0; i < _json.length; i++) {
                        room.taskBar.add(_json[i]);
                    }
                    if (room.option.defaultPage) room.taskBar.cache[room.option.defaultPage].$unit.click();
                });
            },
            //            增加任务栏按钮
            add: function (_option) {
                if (room.taskBar.cache[_option.id]) return;
                seajs.use('index', function (index) {
                    var html = index.frag['taskBarUnit'].replace('{id}', _option.id).replace('{url}', _option.url).replace(/{title}/g, _option.title).replace(/{ico}/g, _option.ico).replace('{autoRefresh}', _option.autoRefresh || false);
                    $('#taskBar .x-layout').append(html);
                    var $this = $('#taskBar .x-layout .x-unit:last');
                    $this.on({
                        click: function () {
                            room.window.addAndopen($.zJSON($this.attr('window')));
                        }
                    });
                    room.taskBar.cache[_option.id] = _option;
                    room.taskBar.cache[_option.id]['$unit'] = $this;
                });

            },
            remove: function () {},
        },
        init: function (_option) {
            room.option = _option;
            room.taskBar.init();
        },
        option: {}
    }
    module.exports = room;

});