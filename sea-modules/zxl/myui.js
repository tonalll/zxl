define('zxl/myui', function (require, exports, module) {
    var $ = require('jquery');
    var zxl = require('index');
    //    自定义ui模块 绑定相关事件
    console.info('myui init');

    zxl.on({
        init: function (_$g) {
            var $g = _$g || document;
            console.info('myui init');
        }
    });

});