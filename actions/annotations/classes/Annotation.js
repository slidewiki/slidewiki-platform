import shortid from 'shortid';

const ENTITY_CLASS = 'r_entity';
const ENTITY_CLASS_PREFIX = 'r_';
const SCHEMA_TYPEOF_PREFIX = 'schema:';
const PROPERTY_CLASS = 'r_prop';
const BASE_PROPERTY_CLASS = 'r_name';
const BASE_PROPERTY_TYPE = 'schema:name';

/**
 * Created by korovin on 3/12/2017.
 */
export default class Annotation {
    constructor(uri, type, name) {
        this.className = ENTITY_CLASS_PREFIX + type.toLowerCase();
        this.id = ENTITY_CLASS_PREFIX + shortid.generate();
        this.typeof = SCHEMA_TYPEOF_PREFIX + type;
        this.class = ENTITY_CLASS;
        this.type = type;
        this.uri = uri;
        this.name = name;
    }

    /**
     * @return {string}
     */
    static get BASE_ENTITY_CLASS() {
        return ENTITY_CLASS;
    }

    toHtml(text) {
        return `<span class="${PROPERTY_CLASS} ${BASE_PROPERTY_CLASS}" property="schema:name">${text}</span>`;
    }
}
