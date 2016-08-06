define('zxl/module', function (require, exports, module) {
    var index = require('index');
    var $ = require('jquery');
    var module = {
        name: 'module',
        sayName: function () {
            console.info(this.name);
        },

    }
    module.exports = module;

});