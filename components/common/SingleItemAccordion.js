import React from 'react';
import {Accordion, AccordionItem, AccordionItemBody, AccordionItemTitle} from 'react-accessible-accordion';
import {Button, Icon} from 'semantic-ui-react';
import PropTypes from 'prop-types';

/**
 * Renders an accessible 'click to reveal' content block, using an Accordion.
 */
class SingleItemAccordion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {accordion_is_open: false};
    }

    static propTypes = {
        /** The text that will appear on the expander for this accordion. */
        buttonContent: PropTypes.node,

        /** The content that will be revealed by this accordion. */
        revealContent: PropTypes.node,

        /** Whether the button should be rendered as a text element or a <Button>. */
        buttonAs: PropTypes.oneOf(['text', 'button'])
    };

    static defaultProps = {
        buttonContent: 'Show More',
        revealContent: 'Reveal Content',
        buttonAs: 'text'
    };

    /**
     * Toggles the state of accordion_is_open.
     * Triggered by clicks on the <AccordionItemTitle> element.
     *
     * @returns {void}
     */
    handleAccordionChange = () => {
        const { accordion_is_open } = this.state;
        this.setState({ accordion_is_open: !accordion_is_open });
    };

    /**
     * Renders a toggle button as regular text with an indicator icon.
     *
     * @returns {element}
     */
    buttonAsText = () => {
        const { accordion_is_open } = this.state;
        return (<div><Icon name={accordion_is_open ? 'down caret' : 'right caret'}/>
            {this.props.buttonContent}</div>);
    };

    /**
     * Renders a toggle button as a <Button> with an embedded indicator icon.
     *
     * @returns {element}
     */
    buttonAsButton = () => {
        const { accordion_is_open } = this.state;
        return (<Button
            tabIndex="0"
            basic
            active={accordion_is_open}
            labelPosition='right'
            icon={accordion_is_open ? 'down caret' : 'right caret'}
            content={this.props.buttonContent}
            onClick={(e) => { e.preventDefault(); }}
        />);
    };

    render() {
        let tabIndex = this.props.buttonAs === 'text' ? 0 : -1;

        return (
            <Accordion onChange={this.handleAccordionChange} accordion={false}>
                <AccordionItem>
                    <AccordionItemTitle tabIndex={tabIndex} style={{ display: 'inline-block' }}>
                        { this.props.buttonAs === 'text' ? this.buttonAsText() : this.buttonAsButton()}
                    </AccordionItemTitle>
                    <AccordionItemBody hideBodyClassName='display-none'>
                        {this.props.revealContent}
                    </AccordionItemBody>
                </AccordionItem>
            </Accordion>
        );
    }
}

export default SingleItemAccordion;
