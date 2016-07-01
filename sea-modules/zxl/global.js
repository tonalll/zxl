define('zxl/global', function (require, exports, module) {
    var $ = require('jquery');
    //    global模块
    module.exports = {
        name: 'global',
        sayName: function () {
            console.info(this.name);
        },
        init: function () {
            //            this.sayName();
            //            require('zxl/eat');
            //            $.eat();
            //            console.info('global初始化');
            this.$window = $(window);
            this.$document = $(document);
            this.$body = $('body');
            this.$html = $('html');
            
        }
    }
});