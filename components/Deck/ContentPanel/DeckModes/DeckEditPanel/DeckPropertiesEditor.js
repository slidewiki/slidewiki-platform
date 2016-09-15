import React from 'react';
import classNames from 'classnames';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import ContentUtil from '../../util/ContentUtil';
import DeckEditStore from '../../../../../stores/DeckEditStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import saveDeckEdit from '../../../../../actions/saveDeckEdit';
import saveDeckRevision from '../../../../../actions/saveDeckRevision';


class DeckPropertiesEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getStateFromProps(props);
    }

    getStateFromProps(props) {
        return {
            validationErrors: {},
            title: props.deckProps.title || '',
            language: props.deckProps.language || '',
            description: props.deckProps.description || '',
            theme: props.deckProps.theme || '',
            licence: props.deckProps.licence || '',
            tags: props.deckProps.tags != null ? props.deckProps.tags.join() : ''
        };
    }

    componentWillReceiveProps(newProps) {
        //check if props have changed to reinitialize state (for handling route changes)
        if (newProps.deckProps !== this.props.deckProps) {
            this.setState(this.getStateFromProps(newProps));
        }
    }

    handleCancel() {
        this.context.executeAction(navigateAction, {
            url: ContentUtil.makeNodeURL(this.props.selector, 'view')
        });
    }

    handleSave(withNewRevision) {
        const saveAction = withNewRevision ? saveDeckRevision : saveDeckEdit;
        let validationErrors = {}, isValid = true;

        if (this.state.title == null || this.state.title.length === 0) {
            validationErrors.title = 'The title is a must have.';
            isValid = false;
        }

        if (this.state.language == null || this.state.language.length !== 5) {
            validationErrors.language = 'The language is a must have.';
            isValid = false;
        }

        if (this.state.licence == null || this.state.licence.length < 2) {
            validationErrors.licence = 'The licence is a must have.';
            isValid = false;
        }

        this.setState({validationErrors: validationErrors});
        if (isValid) {
            this.context.executeAction(saveAction, {
                deckId: this.props.selector.sid != null ? this.props.selector.sid : this.props.selector.id,
                title: this.state.title,
                language: this.state.language,
                description: this.state.description,
                theme: this.state.theme,
                licence: this.state.licence,
                tags: this.state.tags.split(','),
                selector: this.props.selector
            });
        }
    }

    handleChange(fieldName, event) {
        var stateChange = {};
        stateChange[fieldName] = event.target.value;
        this.setState(stateChange);
    }

    render() {
        let userΙd = this.props.UserProfileStore.userid;
        let isUserEditor = false;
        if (userΙd != null && userΙd !== '' && this.props.DeckEditStore.editors.includes(String(userΙd))) {
            isUserEditor = true;
        }

        let titleFieldClass = classNames({
            'required': true,
            'field': true,
            'error': this.state.validationErrors.title != null
        });
        let langFieldClass = classNames({
            'required': true,
            'field': true,
            'error': this.state.validationErrors.language != null
        });
        let licenceFieldClass = classNames({
            'required': true,
            'field': true,
            'error': this.state.validationErrors.licence != null
        });
        let languageOptions = <select className="ui search dropdown" aria-labelledby="language" aria-required="true"
                                      value={this.state.language}
                                      onChange={this.handleChange.bind(this, 'language')}>
            <option>
                Select Language
            </option>
            <option value="en_EN">
                English
            </option>
        </select>;
        let themeOptions = <select className="ui search dropdown" aria-labelledby="theme" selected={this.state.theme}
                                   onChange={this.handleChange.bind(this, 'theme')}>
            <option value="DefaultTheme">Default</option>
        </select>;
        let licenceOptions = <select className="ui search dropdown" aria-labelledby="licence"
                                     value={this.state.licence}
                                     onChange={this.handleChange.bind(this, 'licence')}>
            <option value="CC0">CC0</option>
            <option value="CC BY">CC BY</option>
            <option value="CC BY-SA">CC BY-SA</option>
        </select>;

        let saveDeckButton = isUserEditor ? <div className='ui primary button' aria-label="save" tabIndex="0"
                                                 onClick={this.handleSave.bind(this, false)}>Save</div> : '';

        return (
        <div className="ui container">
            <div className="ui grid">
                <div className="sixteen wide column">
                    <form className="ui form">
                        <div className="two fields">
                            <div className={titleFieldClass} data-tooltip={this.state.validationErrors.title}>
                                <label>
                                    Title
                                </label>
                                <input type="text" name="deck-title" value={this.state.title}
                                       onChange={this.handleChange.bind(this, 'title')} placeholder="Title"
                                       aria-required="true"/>

                            </div>
                            <div className={langFieldClass} data-tooltip={this.state.validationErrors.language}>
                                <label id="language">
                                    Language
                                </label>
                                {languageOptions}
                            </div>
                        </div>
                        <div className="field">
                            <label id="deck-description">Description</label>
                            <textarea rows="4" aria-labelledby="deck-description"
                                      value={this.state.description}
                                      onChange={this.handleChange.bind(this, 'description')}/>
                        </div>
                        <div className="two fields">
                            <div className="field disabled">
                                <label id="themes">Choose deck theme</label>
                                {themeOptions}
                            </div>
                            <div className={licenceFieldClass} data-tooltip={this.state.validationErrors.licence}>
                                <label id="licence">licence</label>
                                {licenceOptions}
                            </div>
                        </div>
                        <div className="fluid inline field" data-tooltip={this.state.validationErrors.tags}>
                            <i className="ui tags large icon" aria-label="Add tags"></i>
                            <input type="text" name="tags" placeholder="Add Tags" value={this.state.tags}
                                   onChange={this.handleChange.bind(this, 'tags')}
                                   data-tooltip={this.state.validationErrors.tags}/>
                        </div>
                        {saveDeckButton}
                        <div className='ui primary button' aria-label="save" tabIndex="0"
                             onClick={this.handleSave.bind(this, true)}>
                            Save new revision
                        </div>
                        <div className="ui secondary button" aria-label="cancel" tabIndex="0"
                             onClick={this.handleCancel.bind(this)}>
                            Cancel
                        </div>
                    </form>
                </div>

            </div>
        </div>
        );

    }
}

DeckPropertiesEditor.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

DeckPropertiesEditor = connectToStores(DeckPropertiesEditor, [DeckEditStore, UserProfileStore], (context, props) => {
    return {
        DeckEditStore: context.getStore(DeckEditStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default DeckPropertiesEditor;
