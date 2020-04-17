import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import TranslationStore from '../../../../stores/TranslationStore';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Accordion, Icon, Label, Message, List } from 'semantic-ui-react';

class CheckMultipleLanguages extends React.Component {
    constructor() {
        super();

        this.state = {
            error: false,
        };
    }

    componentDidMount() {
        this.runValidation();
    }

    componentDidUpdate(prevProps) {
        if (this.props.TranslationStore !== prevProps.TranslationStore) {
            this.runValidation();
        }
    }

    runValidation = () => {
        const translations = this.props.TranslationStore.treeTranslations;
        let foundTranslations = false;

        if (translations && translations.length > 0) {
            foundTranslations = true;
        }

        this.setState({
            error: !foundTranslations,
        });
    };

    render() {
        return (
            <>
                <Accordion.Title active={this.props.activeIndex === this.props.index} index={this.props.index} onClick={this.props.handleClick}>
                    <Icon name='dropdown' />
                    Slides available in multiple languages{' '}
                    <Label color={this.state.error ? 'red' : 'green'} horizontal>
                        {this.state.error ? '1 issue' : 'All good'}
                    </Label>
                </Accordion.Title>
                <Accordion.Content active={this.props.activeIndex === this.props.index}>
                    <Message color='blue'>Having slides in multiple languages increases the target audience of a deck</Message>
                    <List divided relaxed>
                        {this.state.error && (
                            <Message color='red'>Only one language found, add another language and translate the slide content</Message>
                        )}
                    </List>
                </Accordion.Content>
            </>
        );
    }
}

CheckMultipleLanguages.contextTypes = {
    intl: PropTypes.object.isRequired,
};

CheckMultipleLanguages = connectToStores(CheckMultipleLanguages, [TranslationStore], (context, props) => {
    return {
        TranslationStore: context.getStore(TranslationStore).getState(),
    };
});

export default CheckMultipleLanguages;
