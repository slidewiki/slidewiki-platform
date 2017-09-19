import { parse } from 'intl-messageformat-parser';
import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';

const MESSAGES_PATTERN = './build/messages/**/*.json';
const LANG_DIR         = './intl/';

const ESCAPED_CHARS = {
    '\\' : '\\\\',
    '\\#': '\\#',
    '{'  : '\\{',
    '}'  : '\\}',
};

const ESAPE_CHARS_REGEXP = /\\#|[{}\\]/g;

export default function printICUMessage(ast) {
    return ast.elements.reduce((message, el) => {
        let {format, id, type, value} = el;

        if (type === 'messageTextElement') {
            return message + value.replace(ESAPE_CHARS_REGEXP, (char) => {
                return ESCAPED_CHARS[char];
            });
        }

        if (!format) {
            return message + `{${id}}`;
        }

        let formatType = format.type.replace(/Format$/, '');

        let style, offset, options;

        switch (formatType) {
            case 'number':
            case 'date':
            case 'time':
                style = format.style ? `, ${format.style}` : '';
                return message + `{${id}, ${formatType}${style}}`;

            case 'plural':
            case 'selectOrdinal':
            case 'select':
                offset = format.offset ? `, offset:${format.offset}` : '';
                options = format.options.reduce((str, option) => {
                    let optionValue = printICUMessage(option.value);
                    return str + ` ${option.selector} {${optionValue}}`;
                }, '');
                return message + `{${id}, ${formatType}${offset},${options}}`;
        }
    }, '');
}

class Translator {
    constructor(translateText) {
        this.translateText = translateText;
    }

    translate(message) {
        let ast        = parse(message);
        let translated = this.transform(ast);
        return print(translated);
    }

    transform(ast) {
        ast.elements.forEach((el) => {
            if (el.type === 'messageTextElement') {
                el.value = this.translateText(el.value);
            } else {
                let options = el.format && el.format.options;
                if (options) {
                    options.forEach((option) => this.transform(option.value));
                }
            }
        });

        return ast;
    }
}

const defaultMessages = globSync(MESSAGES_PATTERN)
.map((filename) => fs.readFileSync(filename, 'utf8'))
.map((file) => JSON.parse(file))
.reduce((collection, descriptors) => {
    descriptors.forEach(({id, defaultMessage}) => {
        if (collection.hasOwnProperty(id)) {
            throw new Error(`Duplicate message id: ${id}`);
        }
        collection[id] = defaultMessage;
    });

    return collection;
}, {});



mkdirpSync(LANG_DIR);
fs.writeFileSync(LANG_DIR + 'default.json', JSON.stringify(defaultMessages, null, 2));
