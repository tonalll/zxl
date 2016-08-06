define('zxl/zxlDone', function (require, exports, module) {
    var ajax = require('ajax');
    //    自定义ui模块 绑定相关事件
    //    console.info('zxlDone init');

    ajax.on({
        done: function (_json) {
            //
            console.info(123333, _json);

        }
    });

});