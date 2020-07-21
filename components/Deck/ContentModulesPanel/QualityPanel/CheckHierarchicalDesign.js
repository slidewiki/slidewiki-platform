import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import DeckViewStore from '../../../../stores/DeckViewStore';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Accordion, Icon, Label, Message, List } from 'semantic-ui-react';

class CheckHierarchicalDesign extends React.Component {
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
        if (this.props.DeckViewStore !== prevProps.DeckViewStore) {
            this.runValidation();
        }
    }

    runValidation = () => {
        const contentItems = this.props.DeckViewStore.deckData.contentItems;
        let foundDeck = false;

        if (contentItems && contentItems.length > 0) {
            for (const item of contentItems) {
                if (item.kind === 'deck') {
                    foundDeck = true;
                    break;
                }
            }
        }

        this.setState({
            error: !foundDeck,
        });
    };

    render() {
        return (
            <>
                <Accordion.Title active={this.props.activeIndex === this.props.index} index={this.props.index} onClick={this.props.handleClick}>
                    <Icon name='dropdown' />
                    Hierarchical design{' '}
                    <Label color={this.state.error ? 'red' : 'green'} horizontal>
                        {this.state.error ? '1 issue' : 'All good'}
                    </Label>
                </Accordion.Title>
                <Accordion.Content active={this.props.activeIndex === this.props.index}>
                    <Message color='blue'>It is good practice to use subdecks to create a hierarchy in the slide structure</Message>
                    <List divided relaxed>
                        {this.state.error && <Message color='red'>No subdecks found, add a subdeck to improve the slide structure</Message>}
                    </List>
                </Accordion.Content>
            </>
        );
    }
}

CheckHierarchicalDesign.contextTypes = {
    intl: PropTypes.object.isRequired,
};

CheckHierarchicalDesign = connectToStores(CheckHierarchicalDesign, [DeckViewStore], (context, props) => {
    return {
        DeckViewStore: context.getStore(DeckViewStore).getState(),
    };
});

export default CheckHierarchicalDesign;
