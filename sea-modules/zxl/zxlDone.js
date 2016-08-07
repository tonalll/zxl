define('zxl/zxlDone', function (require, exports, module) {
    var ajax = require('ajax');
    var layer = require('layer');
    var room = require('room');
    //    自定义ui模块 绑定相关事件
    //    console.info('zxlDone init');

    ajax.on({
        done: function (_json) {
            //
//            console.info(123333, _json);
            if (_json.message) msg.notice(_json.message);

            //            关闭layer currentLayer当前显示的
            if (_json.closeLayer) layer.close(_json.closeLayer);

            //            刷新layer currentLayer当前显示的
            if (_json.refreshLayer) layer.refresh(_json.refreshLayer);

            //            关闭window currentWindow当前显示的
            if (_json.closeWindow) layer.window.remove(_json.closeWindow);

            //            刷新window currentWindow当前显示的
            if (_json.refreshWindow) layer.window.refresh(_json.refreshWindow);


        }
    });

});