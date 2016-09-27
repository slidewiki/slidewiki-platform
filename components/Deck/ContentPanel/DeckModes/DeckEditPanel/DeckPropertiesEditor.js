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
            license: props.deckProps.license || '',
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
        //console.log("fdsgfxgfdhfcvb\n\n\n\n\n");
        const saveAction = withNewRevision ? saveDeckRevision : saveDeckEdit;
        let validationErrors = {}, isValid = true;

        if (this.state.title == null || this.state.title.length === 0) {
            validationErrors.title = 'Please enter a title.';
            isValid = false;
        }

        if (this.state.language == null || this.state.language.length !== 5) {
            validationErrors.language = 'Please select a language.';
            isValid = false;
        }

        if (this.state.license == null || this.state.license.length < 2) {
            validationErrors.license = 'Please select a license.';
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
                license: this.state.license,
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
        let userid = this.props.UserProfileStore.userid;
        let isUserEditor = false;
        if (userid != null && userid !== '' && this.props.DeckEditStore.editors.includes(userid)) {
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
        let licenseFieldClass = classNames({
            'required': true,
            'field': true,
            'error': this.state.validationErrors.license != null
        });
        let languageOptions = <select className="ui search dropdown" id="language" aria-labelledby="language" aria-required="true"
                                      value={this.state.language}
                                      onChange={this.handleChange.bind(this, 'language')}>
            <option>
                Select Language
            </option>
            <option value="en_EN">
                English
            </option>
        </select>;
        let themeOptions = <select className="ui search dropdown" id="themes" aria-labelledby="theme" selected={this.state.theme}
                                   onChange={this.handleChange.bind(this, 'theme')}>
            <option value="DefaultTheme">Default</option>
        </select>;
        let licenseOptions = <select className="ui search dropdown" id="license" aria-labelledby="license"
                                     value={this.state.license}
                                     onChange={this.handleChange.bind(this, 'license')}>
            <option value="CC0">CC0</option>
            <option value="CC BY">CC BY</option>
            <option value="CC BY-SA">CC BY-SA</option>
        </select>;

        let saveDeckButton = isUserEditor ? <div className='ui primary button' role="button" aria-describedby="saveDeck" tabIndex="0"
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
                            <div className={licenseFieldClass} data-tooltip={this.state.validationErrors.license}>
                                <label id="license">License</label>
                                {licenseOptions}
                            </div>
                        </div>
                        <div className="fluid inline field" data-tooltip={this.state.validationErrors.tags}>
                            <i className="ui tags large icon" aria-label="Add tags"></i>
                            <input type="text" name="tags" placeholder="Add Tags" value={this.state.tags}
                                   onChange={this.handleChange.bind(this, 'tags')}
                                   data-tooltip={this.state.validationErrors.tags}/>
                        </div>
                        {saveDeckButton}
                        <div className='ui primary button' role="button" aria-describedby="saveNewDeckRevision" tabIndex="0"
                             onClick={this.handleSave.bind(this, true)}>
                            Save new revision
                        </div>
                        <div className="ui secondary button" role="button" aria-describedby="cancel" tabIndex="0"
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
