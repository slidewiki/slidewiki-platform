import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import AttachQuestionsModalStore from '../../../../stores/AttachQuestionsModalStore';
import {FormattedMessage, defineMessages} from 'react-intl'; //used to translate messages
import {Segment, Checkbox, Label, Input} from 'semantic-ui-react'; //also Label and Input? 
import updateOptions from '../../../../actions/attachQuestions/updateOptions';

class AttachQuestionsOptions extends React.Component {
    constructor(props) {
        super(props);
        
    }

    
    render() {
        //TODO: internationalise the messages */
        let header = 'Confirm Embed Questions';
        let text = 'Adding questions will overwrite the existing content in this slide. You can always revert to an earlier version of the slide or decide to not save after embedding the questions.';
            

        return (
            <Segment>
                <div className='ui header' style={{padding: '20px'}} id='embedWarningHeader'>
                    {header}
                </div> 
                <div className= 'ui text' id='embedWarningText'>
                    {text}
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