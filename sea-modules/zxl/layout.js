define('zxl/layout', function (require, exports, module) {
    var global = require('zxl/global');
    var $ = require('jquery');
    require('jqueryExtend');
    //    layout模块
    module.exports = {
        name: 'layout',
        sayName: function () {
            console.info(this.name);
        },
        init: function (_$g) {
            var $g = _$g || document;
            $('[calcWidth]').each(function (_index, _element) {
                $(this).calcWidth();
            });
            $('[calcHeight]').each(function (_index, _element) {
                $(this).calcHeight();
            });
            //            console.info($g + '初始化');

        },
        resizeTime: 500,
        reiszeTimer: {},
        resize: function (_$g) {
            var $g = _$g || document;
            //                console.info(typeof this.resizeTime);
            if (this.reiszeTimer) clearTimeout(this.reiszeTimer);
            var _this = this;
            this.reiszeTimer = setTimeout(function () {
                // console.info('重新渲染布局');
                _this.init($g);
            }, this.resizeTime);


        }
    }
});