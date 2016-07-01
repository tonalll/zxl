define('zxl/layer', function (require, exports, module) {
    var index = require('index');
    var $ = require('jquery');
    var layer = {
        name: 'layer',
        sayName: function () {
            console.info(this.name);
        },
        options: {
            {
                title: '未命名', //
                url: '', //
                target: 'window',
                data: '',
                //打开组件之前，返回false则不打开，返回true打开，传入对象，通常是点击打开的按钮
                beforeOpen: function (_$open) {
                    // console.info('打开前');
                    return true;
                },
                //打开组件之后，传入对象，通常是点击打开的按钮
                afterOpen: function (_$open, _$back) {
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
                id: 'default' + new Date().getTime()
            };
        },

    }
    module.exports = layer;

});


// stage组件用于window、dialog之上的容器
var stage = {
    tmp: '',
    open: function (_op, _$dom) {
        var op = {
            title: '未命名', //
            url: '', //
            height: '100%', //
            width: '100%', //
            target: 'window',
            data: '',
            //打开组件之前，返回false则不打开，返回true打开，传入对象，通常是点击打开的按钮
            beforeOpen: function (_$open) {
                // console.info('打开前');
                return true;
            },
            //打开组件之后，传入对象，通常是点击打开的按钮
            afterOpen: function (_$open, _$back) {
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
            id: 'default' + new Date().getTime()
        };
        var $dom = _$dom;
        var $block, $stage, $stageTitle, $stageBack, $stageBody;
        op = $.extend(op, _op);
        // console.info(op);
        // console.info(_op);

        // 若打开前回调返回false，则不打开,默认返回true;
        // var resoult = op.beforeOpen($dom);
        // console.info(torf);
        if (!op.beforeOpen($dom)) return;

        $.ajax({
            url: op.url,
            type: 'post',
            data: op.data
        }).done(function (_html) {
            if (op.target == 'window') {
                $block = $('.window:visible');
                op.height = op.height;
                op.width = op.width;
                op.top = 0;
            } else {
                $block = $('.m-dialog:visible');
                op.height = $block.height() - 43;
                op.top = 33;
            }
            $block.append(index.frag['stage']);
            $stage = $('.stage:last', $block);
            $stageTitle = $('.stage-title', $stage);
            $stageBack = $('.stage-back', $stage);
            $stageBody = $('.stage-body', $stage);
            $stageHead = $('.stage-head', $stage);

            $stage.css({
                height: op.height,
                top: op.top
            });
            $stage.attr('id', op.id);
            $stage.data(op);
            $stageTitle.html(op.title);
            $stageBody.height($stage.height() - $stageHead.outerHeight(true));
            $stageBack.on({
                click: function () {
                    if (op.beforeBack($dom, $stageBack)) {
                        $stage.remove();
                        op.afterBack($dom);
                    }
                    // console.info(op.beforeBack);
                    // console.info(stage.beforeBack(op.beforeBack,$stageBack));
                    // if (!op.beforeBack) $stage.remove();
                    // // else if (stage.beforeBack(op.beforeBack, $stageBack)) {
                    // else if (op.beforeBack($stageBack)) {
                    //     $stage.remove();
                    //     if (op.afterBack) stage.afterBack(op.afterBack, $stageBack);
                    // }
                }
            });
            $stageBody.html(_html);
            ui($stageBody);
            // 执行打开后回调
            op.afterOpen($dom, $stageBack);


        })
    },
    // 获取当前活动stageid
    getCurrentId: function () {
        var $stage;
        if ($('.m-dialog .stage').last().length) $stage = $('.m-dialog .stage').last();
        else {
            $stage = $('.window .stage').last()
        }
        return $stage.attr('id');
    },
    // 刷新
    refresh: function (_id) {
        var id = _id || stage.getCurrentId();
        var $stage = $('#' + id);
        if (!$stage.length) {
            index.alert('id为“' + id + '”的stage组件不存在,无法刷新！', true);
            return;
        }
        var op = $stage.data();
        var $stageBody = $('.stage-body', $stage);
        $.ajax({
            url: op.url,
            type: 'post',
            data: op.data
        }).done(function (_html) {
            $stageBody.html(_html);
            ui($stageBody);
        })
    },
    close: function (_id) {
        var id = _id || stage.getCurrentId();
        var $stage = $('#' + id);
        $('.stage-back', $stage).click();
    }
}