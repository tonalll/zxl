define('zxl/grid', function (require, exports, module) {
    var index = require('index');
    var $ = require('jquery');
    var grid = {
        name: 'grid',
        sayName: function () {
            console.info(this.name);
        },
        pageBar: function (_$pageBar) {
            var pageNow = Number(_$pageBar.attr('page-now'));
            var pageButton = '<span class="m-button m-pageButton"></span>';
            var pageTotal = Number(_$pageBar.attr('page-total'));
//            pageTotal = 12;
            pageNow = 8;
            var pageMin = pageNow - 5 < 1 ? 1 : pageNow - 5;
            var pageMax = pageTotal - 5 <= pageNow ? pageTotal : pageNow + 5;
            var html = index.frag['pageBar'].replace('{pageNow}', _$pageBar.attr('page-now')).replace('{pageTotal}', _$pageBar.attr('page-total')).replace('{dataTotal}', _$pageBar.attr('data-total'));
            _$pageBar.html(html);
            //            console.info(pageMax - pageMin);
            if (pageTotal <= 11) {
                pageMin = 1;
                pageMax = pageTotal;
            } else if (pageMax - pageMin < 10) {
                var tmp = 10 - (pageMax - pageMin);
                //                不足11个补足11个
                //                不可补
                if (pageMin == 1 && pageMax == pageTotal) return;

                //                向前补
                if (pageMax == pageTotal) {
                    pageMin = pageMin - tmp < 1 ? 1 : pageMin - tmp;
                }
                //                向后补

                if (pageMin == 1) {
                    pageMax = pageTotal - tmp < pageMax ? pageTotal : pageMax + tmp;
                }
            }
            //            console.info(pageMin, '--', pageMax);
            for (var i = pageMin; i <= pageMax; i++) {
                var $newButton = $('.m-pageNext', _$pageBar).before(pageButton).prev().text(i);
                if (i == pageNow) $newButton.addClass('x-select');

            }
            $('.m-pageButton', _$pageBar).each(function (i, e) {
                //---------
                $(this).on({
                    click: function () {
                        $('form[pageForm-id=' + _$pageBar.attr('pageBar-id') + ']').submit();
                    }
                });
            });
        }

    }
    module.exports = grid;

});