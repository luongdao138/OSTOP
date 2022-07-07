$(document).ready(function() {
    var $relatedlinks, templates;

    //静的なRelatedLinksがあれば新たに取得しない
    if($('.relatedLinks.js-relatedLinksContainer').length > 1) return;

    // 関連リンクの埋め込みタグを取得
    $relatedlinks = $('[data-relatedlink-type]');
    if ($relatedlinks.size()) {
        // 関連リンクのJSONデータを取得
        $.ajax({
            url: DOMAIN_WWW_API + '/api/getRelatedLink.php',
            data: {
                url: location.href,
                types: $relatedlinks.map(function() {
                    return $(this).data('relatedlink-type');
                }).get().join(',')
            },
            dataType: 'jsonp'
        }).done(function(json) {
            // 取得したJSONデータで埋め込みタグを置換 or 削除
            $.each(json, function(i, value) {
                var $relatedlink, $container, template, html;
                $relatedlink = $($relatedlinks.get(i));
                if (value) {
                    // テンプレートを取得
                    template = templates[value.type];
                    if (template) {
                        // htmlを生成
                        html = template
                            .replace('{url}', value.url)
                            .replace('{title}', value.title)
                            .replace('{lead}', value.lead)
                            .replace('{image}', value.image);
                        // 埋め込みタグを置換＆関連リンクセットのコンテナを表示
                        $container = $relatedlink.parents('.js-relatedLinksContainer');
                        $relatedlink.replaceWith(html);
                        $container.show();
                        return;
                    }
                }
                // 埋め込みタグを削除
                $relatedlink.remove();
            });
            $(document).trigger('resize');
        });

        // 表示タイプ別テンプレート
        templates = {};

        // 表示タイプ1
        templates['1'] =
            '<div class="col1">' +
            '  <div class="container">' +
            '    <ul class="linkBoxContainer">' +
            '      <li class="linkBox">' +
            '        <a href="{url}">' +
            '          <div class="boxContainer">' +
            '            <p class="thumb"><img src="{image}" alt="" width="88" height="88"></p>' +
            '            <div><p>{lead}</p></div>' +
            '          </div>' +
            '        </a>' +
            '      </li>' +
            '    </ul>' +
            '  </div>' +
            '</div>';

        // 表示タイプ2
        templates['2'] =
            '<a href="{url}">' +
            '  <p class="itemImage"><img src="{image}" alt=""><span></span></p>' +
            '</a>';

        // 表示タイプ3
        templates['3'] = '';

        // 表示タイプ4
        templates['4'] = '';

        // 表示タイプ5
        templates['5'] = '';
    }
});
