import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import AttachQuestionsModalStore from '../../../../stores/AttachQuestionsModalStore';
import {FormattedMessage, defineMessages} from 'react-intl'; //used to translate messages
import {Segment, Checkbox, Label, Input, Icon} from 'semantic-ui-react'; //also Label and Input? 
import updateOptions from '../../../../actions/attachQuestions/updateOptions';

class AttachQuestionsOptions extends React.Component {
    constructor(props) {
        super(props);
        
    }

    
    render() {
        //TODO: internationalise the messages */
        let header = 'Warning';
        let text1 = 'Adding questions will overwrite the existing content in this slide.';
        let text2 = 'You can still revert to an earlier version of this slide or decide to not save after embedding the questions.';
            

        return (
            <Segment>
                <h2 className='ui header' id='embedWarningHeader'>
                    <Icon name="yellow exclamation triangle"/>
                    {header}
                </h2>
                <div className= 'ui text' id='embedWarningText'>
                    {text1} <br />
                    {text2}
                </div>
            </Segment>

        );
    }
}


AttachQuestionsOptions.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

AttachQuestionsOptions = connectToStores(AttachQuestionsOptions,[AttachQuestionsModalStore],(context,props) => {
    return {
        AttachQuestionsModalStore: context.getStore(AttachQuestionsModalStore).getState(),
    };
});


export default AttachQuestionsOptions;
