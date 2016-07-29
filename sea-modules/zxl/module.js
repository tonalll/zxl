define('zxl/edit', function (require, exports, module) {
    var index = require('index');
    var $ = require('jquery');
    var edit = {
        name: 'edit',
        sayName: function () {
            console.info(this.name);
        },

    }
    module.exports = edit;

});