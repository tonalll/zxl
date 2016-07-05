define('zxl/layer', function (require, exports, module) {
    var index = require('index');
    var $ = require('jquery');
    var layer = {
        name: 'layer',
        sayName: function () {
            console.info(this.name);
        },
        options: {
            title: '&nbsp', //
            url: '', //
            target: $('body'),
            data: '',
            //打开组件之前，返回false则不打开，返回true打开，传入对象，通常是点击打开的按钮
            beforeAdd: function (_$Add) {
                // console.info('打开前');
                return true;
            },
            //打开组件之后，传入对象，通常是点击打开的按钮
            afterAdd: function (_$Add, _$back) {
                // console.info('打开后');
                return true;
            },
            //点击返回按钮之前，返回false则不返回，返回true返回，传入返回按钮的jquery对象
            beforeBack: function (_$open, _$back) {
                // console.info('返回前');
                return true;
            },
            //点击返回按钮之后，传入返回按钮的jquery对象
            afterBack: function (_$back) {
                // console.info('返回后');
                return true;
            },
            id: ''
        },
        add: function (_options) {
            var options = $.extend({}, layer.options, _options);
            if (!options.id) options.id = 'default' + Math.random().toString().replace('0.', '');
            if (!options.beforeAdd()) return;
            options.target.append(index.frag['layer'].replace('{title}', options.title));
            var $layer = options.target.find('>.layer:last');
            var layerTotal = options.target.find('>.layer').length;
            $layer.data(options);
            options.target.attr('layer-total', layerTotal);
            $layer.attr('layer-index', layerTotal - 1).attr('lyaer-id', options.id);
            $layer.trigger('layerAdd.' + options.id, options.id);

        },
        open: function (_id) {
            var $layer = layer.getLayer(_id);
            if ($layer.is('[open]')) {
                $layer.show().siblings().hide();
                return;
            }
            var options = $layer.data();
            $.ajax({
                url: options.url,
                type: 'post',
                dataType: 'html',
                data: options.data
            }).done(function (_html) {
                var $layerBody = $layer.find('>.layer-body');
                $layerBody.html(_html);
                $layer.attr('open', '');
                seajs.use('ui', function (ui) {
                    //                    console.info($layer);
                    ui($layer);
                    $layer.show().siblings().hide();
                });
            });
        },
        getLayer: function (_id) {
            return _id ? $('.layer[lyaer-id=' + _id + ']') : $('.layer:visible:first');
        },
        refresh: function () {},
        close: function () {},
        remove: function () {},
        addAndOpen: function (_options) {
            var options = $.extend({}, layer.options, _options);
            if (!options.id) options.id = 'default' + Math.random().toString().replace('0.', '');
            if (!options.beforeAdd()) return;
            options.target.on({
                ['layerAdd.' + options.id]: function (e, _id) {
                    //                    console.info('--layerAdd--');
                    $(this).show();
                    layer.open(_id);
                }
            });
            layer.add(options);
        },

    }
    module.exports = layer;

});