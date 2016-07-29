define('zxl/edit', function (require, exports, module) {
    var index = require('index');
    var $ = require('jquery');

    function edit(_$this) {
        //        adsaf
        console.info(_$this);
        var options = $.extend({}, edit.options, $.zJSON(_$this.attr('edit')));
        var input = '<input type="text">';
        if (!options.before(_$this)) return;

        var initValue = _$this.text();
        initValue = options.valueToInput(initValue);
        var value = initValue;
        _$this.hide().after(input);
        var $input = _$this.next();
        $input.addClass(options.class).attr('style', options.style);
        $input.val(initValue).focus().select();
        $input.on({
            focusout: function () {
                console.info($input.val());
                value = $input.val() || options.default;
                //                value = $input.val() || options.default;
                //                if (!value) $input.val(value);
                $input.val(value);
                if (options.require) {
                    //                    必填
                    if (!value) {
                        $input.addClass(options.errorClass);
                        seajs.use('msg', function (msg) {
                            msg.notice(options.msg);
                        });
                        return
                    }
                } else {
                    //                    非必填
                    if (value && options.reg && !options.reg.test(value)) {
                        console.info(1111);
                        $input.addClass(options.errorClass);
                        return
                    }
                }
                if (initValue == value) {
                    $input.remove();
                    _$this.show();
                } else {
                    $.ajax({
                        url: options.url,
                        data: {
                                [options.name]: value
                        }
                    }).done(function (_data) {
                        $input.remove();
                        _$this.show().text(options.valueToLabel(value));
                        seajs.use('msg', function (msg) {
                            msg.notice(_data.msg);
                        });
                        options.after(_$this, value, _data);
                    }).fail(function () {
                        options.error(_$this);
                    });
                }

            },
            focusin: function () {
                $input.removeClass(options.errorClass);
            }
        });
        //        window.options = options;

    }
    edit.options = {
        name: "name" + Math.random().toString().replace('0.', ''),
        style: '',
        before: function (_$this) {
            //            初始化时插入input之前
            return true;
        },
        after: function (_$this, value, _data) {
            //            节点对象，修改后的值，返回数据
            //修改提交成功后回调
        },
        error: function (_$this) {
            //            错误回调
        },
        errorClass: '',
        //        正则
        reg: '',
        class: '',
        default: '', //当值为空时候显示的值
        msg: '输入有误，请重新输入！',
        valueToInput: function (_value) {
            //            标签数据转换为input数据
            return _value;
        },
        valueToLabel: function (_value) {
            //            input数据转换为标签数据
            return _value;
        },
        //        是否必填
        require: false
    }
    module.exports = edit;

});