define('zxl/myui', function (require, exports, module) {
    var $ = require('jquery');
    var zxl = require('index');
    //    自定义ui模块 绑定相关事件
    //    console.info('myui init');

    zxl.on({
        init: function (_$g) {
            var $g = _$g || document;
            //            console.info('myui init');
            //            console.info($('[date]', $g));
            $('[date]', $g).each(function () {
                var $this = $(this);
                $this.on({
                    focusin: function () {
                        console.info('focusin');
                        var _opts = {};
                        var opts = $.zJSON($this.attr('date'));
                        opts = $.extend({}, _opts, opts);
                        //                        if ($this.attr("dateFmt")) opts.pattern = $this.attr("dateFmt");
                        //                        if ($this.attr("minDate")) opts.minDate = $this.attr("minDate");
                        //                        if ($this.attr("maxDate")) opts.maxDate = $this.attr("maxDate");
                        //                        if ($this.attr("mmStep")) opts.mmStep = $this.attr("mmStep");
                        //                        if ($this.attr("ssStep")) opts.ssStep = $this.attr("ssStep");
                        $this.datepicker(opts);
                    }
                });
            });
        }
    });

});