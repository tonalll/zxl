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


    /**
     * reference dwz.util.date.js
     * @author ZhangHuihua@msn.com
     * 
     */
    /**
     * @author ZhangHuihua@msn.com
     * ----------------------------------------------------------
     * These functions use the same 'format' strings as the 
     * java.text.SimpleDateFormat class, with minor exceptions.
     * The format string consists of the following abbreviations:
     * 
     * Field        | Full Form          | Short Form
     * -------------+--------------------+-----------------------
     * Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
     * Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
     *              | NNN (abbr.)        |
     * Day of Month | dd (2 digits)      | d (1 or 2 digits)
     * Day of Week  | EE (name)          | E (abbr)
     * Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
     * Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
     * Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
     * Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
     * Minute       | mm (2 digits)      | m (1 or 2 digits)
     * Second       | ss (2 digits)      | s (1 or 2 digits)
     * AM/PM        | a                  |
     *
     * NOTE THE DIFFERENCE BETWEEN MM and mm! Month=MM, not mm!
     * Examples:
     *  "MMM d, y" matches: January 01, 2000
     *                      Dec 1, 1900
     *                      Nov 20, 00
     *  "M/d/yy"   matches: 01/20/00
     *                      9/2/00
     *  "MMM dd, yyyy hh:mm:ssa" matches: "January 01, 2000 12:30:45AM"
     * ----------------------------------------------------------
     */
    (function () {
        var MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
        var DAY_NAMES = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');

        function LZ(x) {
            return (x < 0 || x > 9 ? "" : "0") + x
        }

        /**
         * formatDate (date_object, format)
         * Returns a date in the output format specified.
         * The format string uses the same abbreviations as in parseDate()
         * @param {Object} date
         * @param {Object} format
         */
        function formatDate(date, format) {
            format = format + "";
            var result = "";
            var i_format = 0;
            var c = "";
            var token = "";
            var y = date.getYear() + "";
            var M = date.getMonth() + 1;
            var d = date.getDate();
            var E = date.getDay();
            var H = date.getHours();
            var m = date.getMinutes();
            var s = date.getSeconds();
            var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
            // Convert real date parts into formatted versions
            var value = {};
            if (y.length < 4) {
                y = "" + (y - 0 + 1900);
            }
            value["y"] = "" + y;
            value["yyyy"] = y;
            value["yy"] = y.substring(2, 4);
            value["M"] = M;
            value["MM"] = LZ(M);
            value["MMM"] = MONTH_NAMES[M - 1];
            value["NNN"] = MONTH_NAMES[M + 11];
            value["d"] = d;
            value["dd"] = LZ(d);
            value["E"] = DAY_NAMES[E + 7];
            value["EE"] = DAY_NAMES[E];
            value["H"] = H;
            value["HH"] = LZ(H);
            if (H == 0) {
                value["h"] = 12;
            } else if (H > 12) {
                value["h"] = H - 12;
            } else {
                value["h"] = H;
            }
            value["hh"] = LZ(value["h"]);
            if (H > 11) {
                value["K"] = H - 12;
            } else {
                value["K"] = H;
            }
            value["k"] = H + 1;
            value["KK"] = LZ(value["K"]);
            value["kk"] = LZ(value["k"]);
            if (H > 11) {
                value["a"] = "PM";
            } else {
                value["a"] = "AM";
            }
            value["m"] = m;
            value["mm"] = LZ(m);
            value["s"] = s;
            value["ss"] = LZ(s);
            while (i_format < format.length) {
                c = format.charAt(i_format);
                token = "";
                while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                    token += format.charAt(i_format++);
                }
                if (value[token] != null) {
                    result += value[token];
                } else {
                    result += token;
                }
            }
            return result;
        }

        function _isInteger(val) {
            return (new RegExp(/^\d+$/).test(val));
        }

        function _getInt(str, i, minlength, maxlength) {
            for (var x = maxlength; x >= minlength; x--) {
                var token = str.substring(i, i + x);
                if (token.length < minlength) {
                    return null;
                }
                if (_isInteger(token)) {
                    return token;
                }
            }
            return null;
        }

        /**
         * parseDate( date_string , format_string )
         * 
         * This function takes a date string and a format string. It matches
         * If the date string matches the format string, it returns the date. 
         * If it does not match, it returns 0.
         * @param {Object} val
         * @param {Object} format
         */
        function parseDate(val, format) {
            val = val + "";
            format = format + "";
            var i_val = 0;
            var i_format = 0;
            var c = "";
            var token = "";
            var token2 = "";
            var x, y;
            var now = new Date(1900, 0, 1);
            var year = now.getYear();
            var month = now.getMonth() + 1;
            var date = 1;
            var hh = now.getHours();
            var mm = now.getMinutes();
            var ss = now.getSeconds();
            var ampm = "";

            while (i_format < format.length) {
                // Get next token from format string
                c = format.charAt(i_format);
                token = "";
                while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                    token += format.charAt(i_format++);
                }
                // Extract contents of value based on format token
                if (token == "yyyy" || token == "yy" || token == "y") {
                    if (token == "yyyy") {
                        x = 4;
                        y = 4;
                    }
                    if (token == "yy") {
                        x = 2;
                        y = 2;
                    }
                    if (token == "y") {
                        x = 2;
                        y = 4;
                    }
                    year = _getInt(val, i_val, x, y);
                    if (year == null) {
                        return 0;
                    }
                    i_val += year.length;
                    if (year.length == 2) {
                        if (year > 70) {
                            year = 1900 + (year - 0);
                        } else {
                            year = 2000 + (year - 0);
                        }
                    }
                } else if (token == "MMM" || token == "NNN") {
                    month = 0;
                    for (var i = 0; i < MONTH_NAMES.length; i++) {
                        var month_name = MONTH_NAMES[i];
                        if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                            if (token == "MMM" || (token == "NNN" && i > 11)) {
                                month = i + 1;
                                if (month > 12) {
                                    month -= 12;
                                }
                                i_val += month_name.length;
                                break;
                            }
                        }
                    }
                    if ((month < 1) || (month > 12)) {
                        return 0;
                    }
                } else if (token == "EE" || token == "E") {
                    for (var i = 0; i < DAY_NAMES.length; i++) {
                        var day_name = DAY_NAMES[i];
                        if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                            i_val += day_name.length;
                            break;
                        }
                    }
                } else if (token == "MM" || token == "M") {
                    month = _getInt(val, i_val, token.length, 2);
                    if (month == null || (month < 1) || (month > 12)) {
                        return 0;
                    }
                    i_val += month.length;
                } else if (token == "dd" || token == "d") {
                    date = _getInt(val, i_val, token.length, 2);
                    if (date == null || (date < 1) || (date > 31)) {
                        return 0;
                    }
                    i_val += date.length;
                } else if (token == "hh" || token == "h") {
                    hh = _getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 1) || (hh > 12)) {
                        return 0;
                    }
                    i_val += hh.length;
                } else if (token == "HH" || token == "H") {
                    hh = _getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 0) || (hh > 23)) {
                        return 0;
                    }
                    i_val += hh.length;
                } else if (token == "KK" || token == "K") {
                    hh = _getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 0) || (hh > 11)) {
                        return 0;
                    }
                    i_val += hh.length;
                } else if (token == "kk" || token == "k") {
                    hh = _getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 1) || (hh > 24)) {
                        return 0;
                    }
                    i_val += hh.length;
                    hh--;
                } else if (token == "mm" || token == "m") {
                    mm = _getInt(val, i_val, token.length, 2);
                    if (mm == null || (mm < 0) || (mm > 59)) {
                        return 0;
                    }
                    i_val += mm.length;
                } else if (token == "ss" || token == "s") {
                    ss = _getInt(val, i_val, token.length, 2);
                    if (ss == null || (ss < 0) || (ss > 59)) {
                        return 0;
                    }
                    i_val += ss.length;
                } else if (token == "a") {
                    if (val.substring(i_val, i_val + 2).toLowerCase() == "am") {
                        ampm = "AM";
                    } else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
                        ampm = "PM";
                    } else {
                        return 0;
                    }
                    i_val += 2;
                } else {
                    if (val.substring(i_val, i_val + token.length) != token) {
                        return 0;
                    } else {
                        i_val += token.length;
                    }
                }
            }
            // If there are any trailing characters left in the value, it doesn't match
            if (i_val != val.length) {
                return 0;
            }
            // Is date valid for month?
            if (month == 2) {
                // Check for leap year
                if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { // leap year
                    if (date > 29) {
                        return 0;
                    }
                } else {
                    if (date > 28) {
                        return 0;
                    }
                }
            }
            if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
                if (date > 30) {
                    return 0;
                }
            }
            // Correct hours value
            if (hh < 12 && ampm == "PM") {
                hh = hh - 0 + 12;
            } else if (hh > 11 && ampm == "AM") {
                hh -= 12;
            }
            return new Date(year, month - 1, date, hh, mm, ss);
        }

        Date.prototype.formatDate = function (dateFmt) {
            return formatDate(this, dateFmt);
        };
        String.prototype.parseDate = function (dateFmt) {
            if (this.length < dateFmt.length) {
                dateFmt = dateFmt.slice(0, this.length);
            }
            return parseDate(this, dateFmt);
        };

        /**
         * replaceTmEval("{1+2}-{2-1}")
         */
        function replaceTmEval(data) {
            return data.replace(RegExp("({[A-Za-z0-9_+-]*})", "g"), function ($1) {
                return eval('(' + $1.replace(/[{}]+/g, "") + ')');
            });
        }
        /**
         * dateFmt:%y-%M-%d
         * %y-%M-{%d+1}
         * ex: new Date().formatDateTm('%y-%M-{%d-1}')
         * 	new Date().formatDateTm('2012-1')
         */
        Date.prototype.formatDateTm = function (dateFmt) {
            var y = this.getFullYear();
            var m = this.getMonth() + 1;
            var d = this.getDate();

            var sDate = dateFmt.replaceAll("%y", y).replaceAll("%M", m).replaceAll("%d", d);
            sDate = replaceTmEval(sDate);

            var _y = 1900,
                _m = 0,
                _d = 1;
            var aDate = sDate.split('-');

            if (aDate.length > 0) _y = aDate[0];
            if (aDate.length > 1) _m = aDate[1] - 1;
            if (aDate.length > 2) _d = aDate[2];

            return new Date(_y, _m, _d).formatDate('yyyy-MM-dd');
        };

    })();


    (function ($) {
        $.setRegional = function (key, value) {
            if (!$.regional) $.regional = {};
            $.regional[key] = value;
        };
    })(jQuery);

    (function ($) {
        $.setRegional("datepicker", {
            dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        });
        $.setRegional("datepicker", {
            dayNames: ['日', '一', '二', '三', '四', '五', '六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        });

        $.fn.datepicker = function (opts) {
            var setting = {
                box$: "#calendar",
                year$: "#calendar [name=year]",
                month$: "#calendar [name=month]",
                tmInputs$: "#calendar .time :text",
                hour$: "#calendar .time .hh",
                minute$: "#calendar .time .mm",
                second$: "#calendar .time .ss",
                tmBox$: "#calendar .tm",
                tmUp$: "#calendar .time .up",
                tmDown$: "#calendar .time .down",
                close$: "#calendar .close",
                calIcon$: "a.inputDateButton",
                main$: "#calendar .main",
                days$: "#calendar .days",
                dayNames$: "#calendar .dayNames",
                clearBut$: "#calendar .clearBut",
                okBut$: "#calendar .okBut"
            };

            function changeTmMenu(sltClass) {
                var $tm = $(setting.tmBox$);
                $tm.removeClass("hh").removeClass("mm").removeClass("ss");
                if (sltClass) {
                    $tm.addClass(sltClass);
                    $(setting.tmInputs$).removeClass("slt").filter("." + sltClass).addClass("slt");
                }
            }

            function clickTmMenu($input, type) {
                $(setting.tmBox$).find("." + type + " li").each(function () {
                    var $li = $(this);
                    $li.click(function () {
                        $input.val($li.text());
                    });
                });
            }

            function keydownInt(e) {
                // if (!((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode == DWZ.keyCode.DELETE || e.keyCode == DWZ.keyCode.BACKSPACE))) { return false; }
                if (!(e.keyCode >= 48 && e.keyCode <= 57)) {
                    return false;
                }
            }

            function changeTm($input, type) {
                var ivalue = parseInt($input.val()),
                    istart = parseInt($input.attr("start")) || 0,
                    iend = parseInt($input.attr("end"));
                var istep = parseInt($input.attr('step') || 1);
                if (type == 1) {
                    if (ivalue <= iend - istep) {
                        $input.val(ivalue + istep);
                    }
                } else if (type == -1) {
                    if (ivalue >= istart + istep) {
                        $input.val(ivalue - istep);
                    }
                } else if (ivalue > iend) {
                    $input.val(iend);
                } else if (ivalue < istart) {
                    $input.val(istart);
                }
            }

            return this.each(function () {
                var $this = $(this);
                var dp = new Datepicker($this.val(), opts);

                function generateCalendar(dp) {
                    var dw = dp.getDateWrap();
                    var minDate = dp.getMinDate();
                    var maxDate = dp.getMaxDate();

                    var monthStart = new Date(dw.year, dw.month - 1, 1);
                    var startDay = monthStart.getDay();
                    var dayStr = "";
                    if (startDay > 0) {
                        monthStart.setMonth(monthStart.getMonth() - 1);
                        var prevDateWrap = dp.getDateWrap(monthStart);
                        for (var t = prevDateWrap.days - startDay + 1; t <= prevDateWrap.days; t++) {
                            var _date = new Date(dw.year, dw.month - 2, t);
                            var _ctrClass = (_date >= minDate && _date <= maxDate) ? '' : 'disabled';
                            dayStr += '<dd class="other ' + _ctrClass + '" chMonth="-1" day="' + t + '">' + t + '</dd>';
                        }
                    }
                    for (var t = 1; t <= dw.days; t++) {
                        var _date = new Date(dw.year, dw.month - 1, t);
                        var _ctrClass = (_date >= minDate && _date <= maxDate) ? '' : 'disabled';
                        if (t == dw.day) {
                            dayStr += '<dd class="slt ' + _ctrClass + '" day="' + t + '">' + t + '</dd>';
                        } else {
                            dayStr += '<dd class="' + _ctrClass + '" day="' + t + '">' + t + '</dd>';
                        }
                    }
                    for (var t = 1; t <= 42 - startDay - dw.days; t++) {
                        var _date = new Date(dw.year, dw.month, t);
                        var _ctrClass = (_date >= minDate && _date <= maxDate) ? '' : 'disabled';
                        dayStr += '<dd class="other ' + _ctrClass + '" chMonth="1" day="' + t + '">' + t + '</dd>';
                    }

                    var $days = $(setting.days$).html(dayStr).find("dd");
                    $days.not('.disabled').click(function () {
                        var $day = $(this);

                        if (!dp.hasTime()) {
                            $this.val(dp.formatDate(dp.changeDay($day.attr("day"), $day.attr("chMonth"))));
                            $this.trigger('blur').trigger('change').trigger('focusout');
                            closeCalendar();
                        } else {
                            $days.removeClass("slt");
                            $day.addClass("slt");
                        }
                    });

                    if (!dp.hasDate()) $(setting.main$).addClass('nodate'); // 仅时间，无日期

                    if (dp.hasTime()) {
                        $("#calendar .time").show();

                        var $hour = $(setting.hour$).val(dw.hour).focus(function () {
                            changeTmMenu("hh");
                        });
                        var iMinute = parseInt(dw.minute / dp.opts.mmStep) * dp.opts.mmStep;
                        var $minute = $(setting.minute$).val(iMinute).attr('step', dp.opts.mmStep).focus(function () {
                            changeTmMenu("mm");
                        });
                        var $second = $(setting.second$).val(dp.hasSecond() ? dw.second : 0).attr('step', dp.opts.ssStep).focus(function () {
                            changeTmMenu("ss");
                        });

                        $hour.add($minute).add($second).click(function () {
                            return false
                        });

                        clickTmMenu($hour, "hh");
                        clickTmMenu($minute, "mm");
                        clickTmMenu($second, "ss");
                        $(setting.box$).click(function () {
                            changeTmMenu();
                        });

                        var $inputs = $(setting.tmInputs$);
                        $inputs.keydown(keydownInt).each(function () {
                            var $input = $(this);
                            $input.keyup(function () {
                                changeTm($input, 0);
                            });
                        });
                        $(setting.tmUp$).click(function () {
                            $inputs.filter(".slt").each(function () {
                                changeTm($(this), 1);
                            });
                        });
                        $(setting.tmDown$).click(function () {
                            $inputs.filter(".slt").each(function () {
                                changeTm($(this), -1);
                            });
                        });

                        if (!dp.hasHour()) $hour.attr("disabled", true);
                        if (!dp.hasMinute()) $minute.attr("disabled", true);
                        if (!dp.hasSecond()) $second.attr("disabled", true);
                    }

                }

                function closeCalendar() {
                    $(setting.box$).remove();
                    $(document).unbind("click", closeCalendar);
                }

                $this.click(function (event) {
                    closeCalendar();
                    var dp = new Datepicker($this.val(), opts);
                    var offset = $this.offset();
                    var iTop = offset.top + this.offsetHeight;
                    $(index.frag['calendarFrag']).appendTo("body").css({
                        left: offset.left + 'px',
                        top: iTop + 'px'
                    }).show().click(function (event) {
                        event.stopPropagation();
                    });

                    ($.fn.bgiframe && $(setting.box$).bgiframe());

                    var dayNames = "";
                    $.each($.regional.datepicker.dayNames, function (i, v) {
                        dayNames += "<dt>" + v + "</dt>"
                    });
                    $(setting.dayNames$).html(dayNames);

                    var dw = dp.getDateWrap();
                    var $year = $(setting.year$);
                    var yearstart = dp.getMinDate().getFullYear();
                    var yearend = dp.getMaxDate().getFullYear();
                    for (y = yearstart; y <= yearend; y++) {
                        $year.append('<option value="' + y + '"' + (dw.year == y ? 'selected="selected"' : '') + '>' + y + '</option>');
                    }
                    var $month = $(setting.month$);
                    $.each($.regional.datepicker.monthNames, function (i, v) {
                        var m = i + 1;
                        $month.append('<option value="' + m + '"' + (dw.month == m ? 'selected="selected"' : '') + '>' + v + '</option>');
                    });

                    // generate calendar
                    generateCalendar(dp);
                    $year.add($month).change(function () {
                        dp.changeDate($year.val(), $month.val());
                        generateCalendar(dp);
                    });

                    // fix top
                    var iBoxH = $(setting.box$).outerHeight(true);
                    if (iTop > iBoxH && iTop > $(window).height() - iBoxH) {
                        $(setting.box$).css("top", offset.top - iBoxH);
                    }

                    $(setting.close$).click(function () {
                        closeCalendar();
                    });
                    $(setting.clearBut$).click(function () {
                        $this.val("");
                        closeCalendar();
                    });
                    $(setting.okBut$).click(function () {
                        var $dd = $(setting.days$).find("dd.slt");

                        if ($dd.hasClass("disabled")) return false;

                        var date = dp.changeDay($dd.attr("day"), $dd.attr("chMonth"));

                        if (dp.hasTime()) {
                            date.setHours(parseInt($(setting.hour$).val()));
                            date.setMinutes(parseInt($(setting.minute$).val()));
                            date.setSeconds(parseInt($(setting.second$).val()));
                        }

                        $this.val(dp.formatDate(date));
                        $this.trigger('blur').trigger('change').trigger('focusout');
                        closeCalendar();
                    });
                    $(document).bind("click", closeCalendar);
                    return false;
                });

                $this.parent().find(setting.calIcon$).click(function () {
                    $this.trigger("click");
                    return false;
                });
            });

        }

        var Datepicker = function (sDate, opts) {
            this.opts = $.extend({
                pattern: 'yyyy-MM-dd',
                minDate: "1900-01-01",
                maxDate: "2099-12-31",
                mmStep: 1,
                ssStep: 1
            }, opts);
            //动态minDate、maxDate
            var now = new Date();
            this.opts.minDate = now.formatDateTm(this.opts.minDate);
            this.opts.maxDate = now.formatDateTm(this.opts.maxDate);
            this.sDate = sDate.trim();
        }

        $.extend(Datepicker.prototype, {
            get: function (name) {
                return this.opts[name];
            },
            _getDays: function (y, m) { //获取某年某月的天数

                return m == 2 ? (y % 4 || !(y % 100) && y % 400 ? 28 : 29) : (/4|6|9|11/.test(m) ? 30 : 31);
            },

            _minMaxDate: function (sDate) {
                var _count = sDate.split('-').length - 1;
                var _format = 'y-M-d';
                if (_count == 1) _format = 'y-M';
                else if (_count == 0) _format = 'y';

                return sDate.parseDate(_format);
            },
            getMinDate: function () {
                return this._minMaxDate(this.opts.minDate);
            },
            getMaxDate: function () {
                var _sDate = this.opts.maxDate;
                var _count = _sDate.split('-').length - 1;
                var _date = this._minMaxDate(_sDate);

                if (_count < 2) { //format:y-M、y

                    var _day = this._getDays(_date.getFullYear(), _date.getMonth() + 1);
                    _date.setDate(_day);
                    if (_count == 0) { //format:y

                        _date.setMonth(11);
                    }
                }

                return _date;
            },
            getDateWrap: function (date) { //得到年,月,日

                if (!date) date = this.parseDate(this.sDate) || new Date();
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var days = this._getDays(y, m);
                return {
                    year: y,
                    month: m,
                    day: date.getDate(),
                    hour: date.getHours(),
                    minute: date.getMinutes(),
                    second: date.getSeconds(),
                    days: days,
                    date: date
                }
            },
            /**
             * @param {year:2010, month:05, day:24}
             */
            changeDate: function (y, m, d) {
                var date = new Date(y, m - 1, d || 1);
                this.sDate = this.formatDate(date);
                return date;
            },
            changeDay: function (day, chMonth) {
                if (!chMonth) chMonth = 0;
                var dw = this.getDateWrap();
                return this.changeDate(dw.year, dw.month + parseInt(chMonth), day);
            },
            parseDate: function (sDate) {
                if (!sDate) return null;
                return sDate.parseDate(this.opts.pattern);
            },
            formatDate: function (date) {
                return date.formatDate(this.opts.pattern);
            },
            hasHour: function () {
                return this.opts.pattern.indexOf("H") != -1;
            },
            hasMinute: function () {
                return this.opts.pattern.indexOf("m") != -1;
            },
            hasSecond: function () {
                return this.opts.pattern.indexOf("s") != -1;
            },
            hasTime: function () {
                return this.hasHour() || this.hasMinute() || this.hasSecond();
            },
            hasDate: function () {
                var _dateKeys = ['y', 'M', 'd', 'E'];
                for (var i = 0; i < _dateKeys.length; i++) {
                    if (this.opts.pattern.indexOf(_dateKeys[i]) != -1) return true;
                }

                return false;
            }
        });
    })(jQuery);






}));