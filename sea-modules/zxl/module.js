define('zxl/module0', function (require, exports, module) {
    var index = require('index');
    var $ = require('jquery');
    var module0 = {
        name: 'module0',
        sayName: function () {
            console.info(this.name);
        },

    }
    module.exports = module0;

});