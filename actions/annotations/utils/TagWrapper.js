import rangy from 'rangy/lib/rangy-core';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-serializer';
import 'rangy/lib/rangy-textrange';
import Annotation from "../classes/Annotation";

/**
 * Created by korovin on 3/17/2017.
 * Wrapper of text as RDFa markup
 */
export default class TagWrapper {
    /**
     * Gets annotation and wraps selection
     * @param annotation
     * @returns {{selection: *, type: *, class: *, className: *, id: *}}
     */
    static wrapAnnotation(annotation) {
        let applier = TagWrapper.initAppplier(annotation);

        TagWrapper.highlightSelection(annotation, applier);
        TagWrapper.wrapProperty(annotation);

        return {
            selection: TagWrapper.serializeSelection(),
            type: annotation.type,
            class: annotation.class,
            className: annotation.className,
            id: annotation.id,
            uri: annotation.uri,
            name: annotation.name
        };
    }

    /**
     * Wrap as annotation all suggestions from dbpedia spotlight
     * Use undoToRange if want to remove all previous suggestions
     * @param suggestions
     */
    static wrapSuggestions(suggestions) {
        let nodeContentHtml = $('#inlineContent').find('> div')[0];
        let searchScopeRange = rangy.createRange();
        let range = rangy.createRange();
        let annotations = [];

        searchScopeRange.selectNodeContents(nodeContentHtml);
        range.selectNodeContents(nodeContentHtml);

        let searchOptions = {
            caseSensitive: false,
            wholeWordsOnly: false,
            withinRange: searchScopeRange
        };

        for (let suggestion of suggestions) {
            const surface = suggestion.surface;
            if (surface === '') continue;
            annotations.push(TagWrapper.wrapSuggestion(suggestion, range, searchOptions));
        }

        return annotations;
    }

    /**
     * Need separate function, because suggestions are initialized as range
     * Manual annotations - as selection
     * @param suggestion
     * @param range
     * @param searchOptions
     */
    static wrapSuggestion(suggestion, range, searchOptions) {
        let annotation = new Annotation(suggestion.uri, suggestion.type, suggestion.surface);
        let searchResultApplier = TagWrapper.initAppplier(annotation);

        if (range.findText(suggestion.surface, searchOptions)) {
            searchResultApplier.applyToRange(range);
            range.collapse(false);
        }

        return annotation;
    }

    static serializeSelection() {
        let savedSel = rangy.getSelection();
        return rangy.serializeSelection(savedSel, true, document.getElementById('inlineContent'));
    }

    static initAppplier(annotation) {
        return rangy.createClassApplier(annotation.class, {
            elementProperties: {
                className: annotation.className
            },
            elementAttributes: {
                typeof: annotation.typeof,
                'data-id': annotation.id,
                resource: annotation.uri
            }
        });
    }

    static highlightSelection(annotation, applier) {
        let highlighter = rangy.createHighlighter();
        highlighter.addClassApplier(applier);
        highlighter.highlightSelection(annotation.class);
    }

    static wrapProperty(annotation) {
        $('#inlineContent').find(`[data-id="${annotation.id}"]`).each(function(index) {
            let text = $(this).text();
            let htmlWrapper = annotation.toHtml(text);
            $(this).empty();
            $(this).wrapInner(htmlWrapper);
        });
    }
}
