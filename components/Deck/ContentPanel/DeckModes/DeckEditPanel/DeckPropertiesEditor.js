import React from 'react';
import classNames from 'classnames';
import {connectToStores} from 'fluxible-addons-react';
import DeckEditStore from '../../../../../stores/DeckEditStore';
import {navigateAction} from 'fluxible-router';
import ContentUtil from '../../util/ContentUtil';
import saveDeckEdit from '../../../../../actions/saveDeckEdit';

class DeckPropertiesEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {validationErrors: {}};
    }

    handleSaveDeck() {
        const title = this.refs.titleInput.value;
        const language = this.refs.langSelect.value;
        const description = this.refs.descriptionTextArea.value;
        const theme = this.refs.themeSelect.value;
        const licence = this.refs.licenceSelect.value;
        const tags = this.refs.tagsInput.value.split(', ');
        let validationErrors = {}, isValid = true;

        if (title == null || title.length === 0) {
            validationErrors.title = 'The title is a must have.';
            isValid = false;
        }
        this.setState({validationErrors: validationErrors});
        if (isValid) {
            this.context.executeAction(saveDeckEdit, {
                deckId: this.props.selector.sid != null ? this.props.selector.sid : this.props.selector.id,
                title: title,
                language: language,
                description: description,
                theme: theme,
                licence: licence,
                tags: tags
            });
        }
    }

    handleCancel() {
        this.context.executeAction(navigateAction, {
            url: ContentUtil.makeNodeURL(this.props.selector, 'view')
        });
    }

    render() {
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
        let saveButtonClass = classNames({
            'ui': true,
            'primary': true,
            'button': true
        });

        let languageOptions = <select className="ui search dropdown" aria-labelledby="language" aria-required="true"
                                      ref="langSelect">
            <option value="en_EN">
                English
            </option>
        </select>;
        let themeOptions = <select className="ui search dropdown" aria-labelledby="theme" ref="themeSelect">
            <option value="DefaultTheme">Default</option>
        </select>;
        let licenceOptions = <select className="ui search dropdown" aria-labelledby="license" ref="licenceSelect">
            <option value="CC0">CC0</option>
            <option value="CC BY">CC BY</option>
            <option value="CC BY-SA">CC BY-SA</option>
        </select>;

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
                                <input type="text" name="deck-title" placeholder="Title" aria-required="true"
                                       defaultValue={this.props.deckProps.title} ref="titleInput"/>
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
                                      defaultValue={this.props.deckProps.description} ref="descriptionTextArea"/>
                        </div>
                        <div className="two fields">
                            <div className="field disabled">
                                <label id="themes">Choose deck theme</label>
                                {themeOptions}
                            </div>
                            <div className={licenceFieldClass} data-tooltip={this.state.validationErrors.licence}>
                                <label id="license">License</label>
                                {licenceOptions}
                            </div>
                        </div>
                        <div className="fluid inline field" data-tooltip={this.state.validationErrors.tags}>
                            <i className="ui tags large icon" aria-label="Add tags"></i>
                            <input type="text" name="tags" placeholder="Add Tags" ref="tagsInput"
                                   data-tooltip={this.state.validationErrors.tags}/>
                        </div>
                        <div className={saveButtonClass} aria-label="save" tabIndex="0"
                             onClick={this.handleSaveDeck.bind(this)}>
                            Save
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
DeckPropertiesEditor = connectToStores(DeckPropertiesEditor, [DeckEditStore], (context, props) => {
    return {
        DeckEditStore: context.getStore(DeckEditStore).getState()
    };
});

export default DeckPropertiesEditor;
