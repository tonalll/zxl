define('zxl/ui', function (require, exports, module) {
    var $ = require('jquery');
    //    require('validator');
    //    ui模块
    function ui(_$g) {
        var $g = _$g || document;
        console.info('ui init',$g);
        //        自定义ui事件
        userUi($g);

    }
    ui.uid = 0;
    ui.cache = {};
    ui.on = function (_obj) {
            //            console.info(_obj.init);
            var obj = _obj || {};
            if ($.isFunction(obj.parse)) {
                ui.uid += 1;
                ui.cache[ui.uid.toString()] = {
                    handle: obj.parse
                }

            }
        }
        //    加载用户自定义ui事件
    function userUi(_$g) {
        var $g = _$g || document;
        for (var i = 1; i <= ui.uid; i++) {
            if (ui.cache[i.toString()]) {
                ui.cache[i.toString()].handle($g);
            }
        }
    }
    window.ui = ui;
    module.exports = ui;
});