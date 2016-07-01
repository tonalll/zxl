(function (factory) {
    if (typeof define === 'function') {
        // 如果define已被定义，模块化代码
        //        console.info('--define--');
        //        $.sayHello=12;
        define(function (require, exports, moudles) {
            var $ = require('jquery');
            factory($); // 初始化插件
            //        console.info($);
            //        console.info($.sayHello);
            return jQuery; // 返回jQuery
        });
    } else {
        // 如果define没有被定义，正常执行jQuery
        factory(jQuery);
    }
}(function ($) {
//    console.log('eat');
//    console.info($.tmp);
    $.eat = function () {
//        console.log("------eat");
//        console.log($.tmp);
    };
}));