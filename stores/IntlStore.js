import { BaseStore } from 'fluxible/addons';
import co from '../common';

class IntlStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);
        this.messages = {};
        this.locales = [];
        this.currentLocale = 'en';
    }

    handleLoad({ messages, locales }) {
        this.messages = messages;
        this.locales = locales;
        this.currentLocale = locales[0];
        this.emitChange();
    }

    getMessages() {
        return this.messages;
    }

    getMessage(path) {
        return co.getIntlMessage(this.messages, path);
    }

    getLocales() {
        return this.locales;
    }

    getCurrentLocale() {
        return this.currentLocale;
    }

    dehydrate() {
        return {
            currentLocale: this.currentLocale,
            locales: this.locales,
            messages: this.messages
        };
    }

    rehydrate({ messages, locales, currentLocale }) {
        this.messages = messages;
        this.locales = locales;
        this.currentLocale = currentLocale;
    }
}

// This action is dispatched only on the server

IntlStore.storeName = 'IntlStore';
if (!process.env.BROWSER) {
    IntlStore.handlers = {'LOAD_INTL_SERVER' : 'handleLoad'};
}else{
    IntlStore.handlers = {};
}

export default IntlStore;
