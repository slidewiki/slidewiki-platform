import BaseStore from 'fluxible/addons/BaseStore';
import rangy from 'rangy/lib/rangy-core';
import 'rangy/lib/rangy-selectionsaverestore';
import TooltipCreator from '../actions/annotations/utils/TooltipCreator';

const DEFAULT_OPTION = 'Person';
const TYPE_REGEX = /Schema:(Place|Organization|Person|CreativeWork|Product)/;

/**
 * Created by korovin on 3/11/2017.
 */
class AnnotationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.savedSel = null;
        this.savedSelActiveElement = null;
        this.selectedText = '';
        this.ranges = [];
        this.annotations = [];
        this.suggestions = [];
        this.types = ['Organization', DEFAULT_OPTION, 'Place', 'CreativeWork', 'Product'];
        this.uriSuggestions = [];
        this.wikiLinks = {};
    }
    loadAnnotations() {
        $('.r_entity').hover()
    }
    saveSelection() {
        if (this.savedSel) {
            rangy.removeMarkers(this.savedSel);
        }
        this.selectedText = rangy.getSelection().toString().replace(/(\r\n|\n|\r)/gm," ");
        this.savedSel = rangy.saveSelection();
        this.savedSelActiveElement = document.activeElement;

        this.emitChange();
    }
    restoreSelection() {
        if (this.savedSel) {
            rangy.restoreSelection(this.savedSel, true);
            window.setTimeout(function() {
                if (this.savedSelActiveElement && typeof this.savedSelActiveElement.focus != 'undefined') {
                    this.savedSelActiveElement.focus();
                }
            }, 1);
        }
        this.emitChange();
    }
    removeSelection() {
        if (this.savedSel) {
            rangy.removeMarkers(this.savedSel);
            this.savedSel = null;
            this.selectedText = '';
        }
        this.emitChange();
    }
    handleRanges(ranges) {
        this.ranges = ranges;
        this.emitChange();
    }
    saveAnnotation(anno) {
        this.annotations.push(anno);
        let wiki = anno.uri? this.wikiLinks[anno.uri] : null;
        TooltipCreator.addOnHover(anno, wiki);
    }
    saveAnnotations(payload) {
        console.log(payload);
        let { annotations, links } = payload;
        if (!annotations || !annotations.length) {
            return;
        }

        this.parseWikipediaLinks(links);

        for (let anno of annotations) {
            this.annotations.push(anno);
            let wiki = anno.uri? this.wikiLinks[anno.uri] : null;
            TooltipCreator.addOnHover(anno, wiki);
        }
    }
    getSuggestions(payload) {
        if (!payload || !payload.results || (Object.keys(payload.results).length === 0)) {
            alert('Could not suggest anything');
            return;
        }

        let resources = JSON.parse(payload.results)['Resources'];
        let suggestions = {};
        for (let resource of resources) {
            let suggestion = {};
            suggestion.uri = resource['@URI'];
            suggestion.id = suggestion.uri.substring(28);
            suggestion.tag = suggestion.id.replace(/_/g, " ");
            suggestion.surface = resource['@surfaceForm'];

            if (resource['@types']) {
                suggestion.types = resource['@types'].split(',');
            }
            suggestions[suggestion.id] = suggestion;
            suggestion.type = resource['@types'].match(TYPE_REGEX)[1];
        }
        this.suggestions = Object.keys(suggestions).map(key => { return suggestions[key]; });
    }
    getUriSuggestions(res) {
        this.uriSuggestions = res.results.map(result => {
            return result.uri;
        });

        this.emitChange();
    }
    removeUriSuggestions() {
        this.uriSuggestions = [];
        this.emitChange();
    }
    getWikipediaLinks(links) {
        this.parseWikipediaLinks(links);

        this.emitChange();
    }
    parseWikipediaLinks(links) {
        let { results: { results: { bindings } } } = links;
        if (!bindings.length) {
            return;
        }
        for (let binding of bindings) {
            this.wikiLinks[binding.subj.value] = binding.link.value;
        }
    }
    getState() {
        return {
            ranges: this.ranges,
            savedSel: this.savedSel,
            savedSelActiveElement: this.savedSelActiveElement,
            annotations: this.annotations,
            suggestions: this.suggestions,
            types: this.types,
            selectedText: this.selectedText,
            uriSuggestions: this.uriSuggestions,
            wikiLinks: this.wikiLinks
        }
    }
    dehydrate() {
        return {
            ranges: this.ranges,
            savedSel: this.savedSel,
            savedSelActiveElement: this.savedSelActiveElement,
            annotations: this.annotations,
            suggestions: this.suggestions,
            types: this.types,
            selectedText: this.selectedText,
            uriSuggestions: this.uriSuggestions,
            wikiLinks: this.wikiLinks
        };
    }
    rehydrate(state) {
        this.ranges = state.ranges;
        this.savedSel = state.savedSel;
        this.savedSelActiveElement = state.savedSelActiveElement;
        this.annotations = state.annotations;
        this.suggestions = state.suggestions;
        this.types = state.types;
        this.selectedText = state.selectedText;
        this.uriSuggestions = state.uriSuggestions;
        this.wikiLinks = state.wikiLinks;
    }
}

AnnotationStore.storeName = 'AnnotationStore';
AnnotationStore.handlers = {
    'SAVE_SELECTION': 'saveSelection',
    'RESTORE_SELECTION': 'restoreSelection',
    'REMOVE_SELECTION': 'removeSelection',
    'UPDATE_RANGE_SELECTION': 'handleRanges',
    'REMOVE_RANGE_SELECTION': 'handleRanges',
    'SAVE_ANNOTATION': 'saveAnnotation',
    'SAVE_ANNOTATIONS': 'saveAnnotations',
    'REMOVE_ANNOTATION': 'removeAnnotation',
    'GET_SUGGESTIONS': 'getSuggestions',
    'GET_WIKIPEDIA_LINKS': 'getWikipediaLinks',
    'GET_URI_SUGGESTIONS': 'getUriSuggestions',
    'REMOVE_URI_SUGGESTIONS': 'removeUriSuggestions'
};

export default AnnotationStore;
