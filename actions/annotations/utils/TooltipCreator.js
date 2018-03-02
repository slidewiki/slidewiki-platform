/**
 * Created by korovin on 3/17/2017.
 */
export default class TooltipCreator {
    static addOnHover(anno, wiki) {
        let annotations = $('#inlineContent').find('span[data-id="' + anno.id + '"]');
        if (wiki) {
            const page = TooltipCreator.getWikiPageName(wiki);
            const baseUri = TooltipCreator.getWikiBaseUri(wiki);
            TooltipCreator.initTooltip(anno, annotations, wiki, baseUri, page);
        }
    }
    //'Type: ' + anno.type + ' wiki:' + wiki
    static initTooltip(anno, annotations, wiki, baseUri, page) {
        let finalUri = baseUri +
            '/api.php?callback=?&action=parse&page=' +
            page +
            '&prop=text&format=json&section=0';

        annotations.mouseover(e => {
            e.stopPropagation();
            annotations.addClass('r_highlight');
        }).mouseout(_ => {
            annotations.removeClass('r_highlight');
        }).qtip({
            content: {
                title: 'Annotation: ' + anno.name + ' , of type: ' + anno.type,
                text: (event, api) => {
                    $.ajax({
                        type: 'GET',
                        url: finalUri,
                        data: {},
                        async: true,
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'jsonp'
                    }).then((content) => {
                        let $elem = TooltipCreator.parseWikiRes(content, wiki);
                        api.set('content.text', $elem[0]);
                    }, (xhr, status, error) => {
                        api.set('content.text', status + ': ' + error);
                    });

                    return 'Loading...';
                }
            },
            position: {
                target: 'mouse', // Use the mouse position as the position origin
                adjust: { x: 5, y: 5 } // Offset it slightly from under the mouse
            }});
    }

    static getWikiPageName(wikiLink) {
        return wikiLink.substring(29);
    }

    static getWikiBaseUri(wikiLink) {
        return wikiLink.substring(0, 25);
    }

    /**
     * Parse wiki page and get abstract with absolute links
     * @param response
     * @param wiki
     * @returns {*|jQuery|HTMLElement}
     */
    static parseWikiRes(response, wiki) {
        let $allText = $(response.parse.text['*']);
        let abstract = TooltipCreator.getWikiAbstract($allText);

        return TooltipCreator.transformLinks(abstract, wiki.substring(0, 29));
    }

    /**
     * getting from wikipedia page only abstract paragraph
     * discarding all meta and pictures
     * @param allText
     * @returns {*}
     */
    static getWikiAbstract(allText) {
        let found = false;
        let paragraphCount = 0;
        let intro;

        while (found === false) {
            found = true;
            intro = allText.filter('p:eq(' + paragraphCount + ')').html();

            if (intro.indexOf('<span') === 0) {
                paragraphCount++;
                found = false;
            }
        }

        return intro;
    }

    /**
     * transform href links from relative to absolute
     * /wiki/Page -> http://wikipedia ... /Page
     * @param intro
     * @param baseUrl
     * @returns {*|jQuery|HTMLElement}
     */
    static transformLinks(intro, baseUrl) {
        let $elem = $('<div></div>');
        $elem.html(intro)
            .find('a')
            .attr('target', '_blank')
            .not('.references a')
            .attr('href', function(i, href) {
                if (href.indexOf('http') !== 0) {
                    href = baseUrl + href;
                }
                return href;
            })
            .end()
            .end()
            .find('sup.reference')
            .remove();

        return $elem;
    }
}
