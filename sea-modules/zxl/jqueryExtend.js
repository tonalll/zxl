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
    var $window = $(window);
    var $document = $(document);
    /******** 静态方法拓展 ********/
    //    字符串不加引号转换成json
    $.zJSON = function (_optons) {
        var options = {};
        var s = $.trim(_optons);
        if (s) {
            if (s.substring(0, 1) != '{') {
                s = '{' + s + '}';
            }
            options = (new Function('return ' + s))();
            return options;
        }
    }

    //    模拟css3的calc计算宽度
    $.fn.calcWidth = function () {
            var $this = $(this),
                width = 0,
                str = $this.attr('calcWidth'),
                arr = str.split(' ');
            //        console.info(arr);
            for (var i = 0; i < arr.length; i++) {
                //            console.info(typeof arr[i]);
                //            %
                if (arr[i].indexOf('%') !== -1) {
                    arr[i] = $this.parent().outerWidth() / 100 * Number(arr[i].replace('%', ''));
                } else if (arr[i].indexOf('px') !== -1) {
                    //            px
                    arr[i] = Number(arr[i].replace('px', ''));
                }
            }
            width = new Function('return ' + arr.join(' '))()
            $this.width(width);
            //        var tmp=new Function('return ' + arr.join(' '));
            //        console.info(arr.join(' '));
            //        console.info(tmp());
            return $this;
        }
        //    模拟css3的calc计算高度
    $.fn.calcHeight = function () {
        var $this = $(this),
            height = 0,
            str = $this.attr('calcHeight'),
            arr = str.split(' ');
//        console.info(arr);
        for (var i = 0; i < arr.length; i++) {
            //            console.info(typeof arr[i]);
            //            %
            if (arr[i].indexOf('%') !== -1) {
                arr[i] = $this.parent().outerHeight() / 100 * Number(arr[i].replace('%', ''));
            } else if (arr[i].indexOf('px') !== -1) {
                //            px
                arr[i] = Number(arr[i].replace('px', ''));
            }
        }
        height = new Function('return ' + arr.join(' '))()
//        console.info(height);
        $this.height(height);
        //        var tmp=new Function('return ' + arr.join(' '));
        //        console.info(arr.join(' '));
        //        console.info(tmp());
        return $this;
    }




    /******** 实例方法拓展 ********/

    //    距离页面边距 
    $.fn.zMargin = function (_arr) {
            var $this = $(this);
            var offset = $this.offset();
            switch (_arr) {
            case 'top':
                return offset.top;
                break;
            case 'right':
                return $window.width() - $this.width() - offset.left;
                break;
            case 'bottom':
                return $window.height() - $this.height() - offset.top;
                break;
            case 'left':
                return offset.left;
                break;
            default:
                break;
            }
        }
        // 计算所有兄弟节点的高度（含margin）
    $.fn.siblingsHeight = function () {
            var height = 0;

            var $this = $(this);
            var $parent = $this.parent();
            $this.siblings(':visible').each(function () {
                var $sibling = $(this);
                // 不计算绝对定位元素
                if ($sibling.css('position') == "absolute") return true;
                //            当前元素的第一个和最后一个元素的margin值对而已的影响
                height += $sibling.outerHeight(true);
                // 父子margin合并情况纠正
                var firstChildren = $sibling.children().first();
                var lastChildren = $sibling.children().last();
                if (firstChildren.length) {
                    var marginTop = parseInt($sibling.css('marginTop'));
                    var marginBottom = parseInt($sibling.css('marginBottom'));
                    var firstChildrenMarginTop = parseInt(firstChildren.css('marginTop'));
                    var lastChildrenMarginBottom = parseInt(firstChildren.css('marginBottom'));
                    if (firstChildrenMarginTop > marginTop) height += (firstChildrenMarginTop - marginTop);
                    // if(lastChildrenMarginBottom>marginBottom) height+=(lastChildrenMarginBottom-marginBottom);
                }
            });

            return height ? height : 0;
        }
        // 从当前节点开始向上设置所有父对象高度，直到父对象是有高度的
    $.fn.setParentsHeight = function () {
            // 向上递归，向下递归。
            var $this = $(this);
            var arr = [];
            arr.unshift($this);

            function setHeight(_$this) {
                var $parent = _$this.parent();
                if ($parent.is('body')) $parent.height('100%');
                // 判断父对象是否有设置高度
                var oldHeight = $parent.height();
                _$this.hide();
                var newHeight = $parent.height();
                if (oldHeight > newHeight) {
                    arr.unshift($parent);
                    setHeight($parent);
                } else {
                    _$this.show();
                    // console.info(arr);
                    if (arr.length > 1) {
                        var height = arr[0].parent().height();
                        height -= arr[0].siblingsHeight();
                        height -= parseInt(arr[0].css('marginTop'));
                        height -= parseInt(arr[0].css('marginBottom'));
                        height -= parseInt(arr[0].css('paddingTop'));
                        height -= parseInt(arr[0].css('paddingBottom'));
                        arr[0].height(height);
                        // arr[0].height(arr[0].parent().height()-arr[0].siblingsHeight()-parseInt(arr[0].css('marginTop'))-parseInt(arr[0].css('marginBottom'))-parseInt(arr[0].css('paddingTop'))-parseInt(arr[0].css('paddingBottom')));
                        arr.shift();
                        if (arr.length > 1) setHeight(arr[1]);
                    }
                }
                _$this.show();
            }
            setHeight($this);

            return $this;
        }
        // 模拟wondows文件选择
    $.fn.anySelect = function (_op) {
        var op = {
                className: 'select',
                ctrl: true,
                shift: true
            }
            // console.info(op);
        op = $.extend({}, op, _op);
        // console.info(op);
        var $this = $(this);

        $this.on({
            click: function (e) {
                // console.info(op);
                // 按下ctrl加选或者减选
                if (e.ctrlKey && !e.shiftKey) {
                    //
                    if ($this.is('.' + op.className)) $this.removeClass(op.className);
                    else $this.addClass(op.className);


                }
                // 按下shift选择一排，前面最后一个开始，后面第一个开始
                if (!e.ctrlKey && e.shiftKey) {
                    //
                    if ($this.siblings('.' + op.className).length) {
                        var $startSelect;
                        if ($this.prevAll('.' + op.className).length) {
                            $startSelect = $this.prevAll('.' + op.className).first();
                            $this.add($this.siblings()).removeClass(op.className).slice($startSelect.index(), $this.index() + 1).addClass(op.className);
                        } else {
                            $startSelect = $this.nextAll('.' + op.className).first();
                            $this.add($this.siblings()).removeClass(op.className).slice($this.index(), $startSelect.index() + 1).addClass(op.className);
                        }
                    }
                }
                // 无按键选择当前，取消其它
                if (!e.ctrlKey && !e.shiftKey) {
                    //
                    if ($this.hasClass(op.className)) {
                        $this.removeClass(op.className);
                        $this.find('.grid-select-on').removeClass('grid-select-on').addClass('grid-select');
                        var $table = $this.closest('table');
                        if ($table.find('.grid-select-on').length) $table.parent().prev().find('th span').attr('class', 'grid-select-onoff');
                        else $table.parent().prev().find('th span').attr('class', 'grid-select');
                    } else {
                        $this.addClass(op.className);
                        $this.find('.grid-select').removeClass('grid-select').addClass('grid-select-on');
                        var $table = $this.closest('table');
                        if (!$table.find('.grid-select').length) $table.parent().prev().find('th span').attr('class', 'grid-select-on');
                        else $table.parent().prev().find('th span').attr('class', 'grid-select-onoff');
                    }
                    // else $this.addClass(op.className).siblings('.' + op.className).removeClass(op.className);
                }
                // console.info(e.ctrlKey);
                // console.info(e.shiftKey);
            }
        });

        return $this;

    }
    $.fn.drag = function (_op) {
            //            拖动
            var op = {
                $target: $(this), //鼠标按下拖动的区域对象
                draBack: '', //拖动进行时回调，
                callBack: '', //拖动释放后回调，
                top: '', //top最小值，
                right: '', //rigth最小值，
                bottom: '', //bottom最小值，
                left: '', //left最小值。
                lockX: false, //锁定X轴
                lockY: false //锁定Y轴
            };
            op = $.extend(op, _op);

            var $this = $(this),
                dragging = false,
                oX = 0,
                oY = 0,
                top = 'auto',
                right = 'auto',
                bottom = 'auto',
                left = 'auto';
            $(document).on({
                mouseup: function () {
                    dragging = false;
                },
                mousemove: function (e) {
                    if (dragging) {
                        // 限制x
                        // left
                        if (op.lockX) left = $this.css('left');
                        if (!op.lockX) left = e.clientX - oX;
                        if (!op.lockX && left < op.left && op.left !== '') left = op.left;

                        /* // 不限制x 限制最左
                         if (!op.lockX && op.left !== '') {
                             left = e.clientX - oX;
                             if (left < op.left) left = op.left;
                         }
                         // 不限制x，不限制最左
                         if (!op.lockX && op.left === '') {
                             left = e.clientX - oX;
                         }*/


                        // top
                        if (op.lockY) top = $this.css('top');
                        if (!op.lockY) top = e.clientY - oY;
                        if (!op.lockY && top < op.top && op.top !== '') top = op.top;
                        /*// 不限制Y，限制最上
                        if (!op.lockY && op.top !== '') {
                            top = e.clientY - oY;
                            if (top < op.top) top = op.top;
                        }
                        // 不限制Y，不限制最上
                        if (!op.lockY && op.top === '') {
                            top = e.clientY - oY;
                        }
*/


                        $this.css({
                            top: top,
                            left: left,
                        });
                        // 不限制x，限制最右
                        if (!op.lockX && op.right !== '') {
                            if (parseInt($this.css('right')) < op.right) $this.css({
                                right: op.right,
                                left: 'auto'
                            });
                        }
                        // 不限制Y，限制最下
                        if (!op.lockY && op.bottom !== '') {
                            if (parseInt($this.css('bottom')) < op.bottom) {
                                $this.css({
                                    top: 'auto',
                                    bottom: op.bottom,
                                });
                                // console.info(op.bottom);
                            }
                        }
                        // console.info(op.draBack);
                        if ($.isFunction(op.draBack)) op.draBack();
                    }
                }
            });
            op.$target.on({
                mousedown: function (e) {
                    dragging = true;
                    oX = e.clientX - $this.position().left;
                    oY = e.clientY - $this.position().top;
                },
                mouseup: function () {
                    setTimeout(function () {
                        if ($.isFunction(op.callBack)) op.callBack(op.$target);
                    }, 200);
                }
            });
            return $this;
        }
        // 在当前光标处插入内容

    $.fn.insertAtCaret = function (myValue) {
        var $t = $(this)[0];
        if (document.selection) { //ie 
            this.focus();
            var sel = document.selection.createRange();
            sel.text = myValue;
            this.focus();
            sel.moveStart('character', -l);
            var wee = sel.text.length;
            if (arguments.length == 2) {
                var l = $t.value.length;
                sel.moveEnd("character", wee + t);
                t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel.moveStart("character", wee - t - myValue.length);
                sel.select();
            }
        } else if ($t.selectionStart || $t.selectionStart == '0') {
            var startPos = $t.selectionStart;
            var endPos = $t.selectionEnd;
            var scrollTop = $t.scrollTop;
            $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
            this.focus();
            $t.selectionStart = startPos + myValue.length;
            $t.selectionEnd = startPos + myValue.length;
            $t.scrollTop = scrollTop;
            if (arguments.length == 2) {
                $t.setSelectionRange(startPos - t, $t.selectionEnd + t);
                this.focus();
            }
        } else {
            this.value += myValue;
            this.focus();
        }
    }

}));