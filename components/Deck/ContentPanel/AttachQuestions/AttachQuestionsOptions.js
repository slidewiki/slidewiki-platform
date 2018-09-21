import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import AttachQuestionsModalStore from '../../../../stores/AttachQuestionsModalStore';
import {FormattedMessage, defineMessages} from 'react-intl'; //used to translate messages

class AttachQuestionsOptions extends React.Component {
    /*nikki what does this component receive? */
    /*
    Will need:
    selectedQuestions
    destinationDeckID? (which would be the deck that the modal was clicked in)
    actionButton & actionButton2 : functions that should go on the buttons (previousQuestionsBtn and attachBtn?) //no? 

    */
    render() {
        let questions = JSON.stringify(this.props.selectedQuestions);

        return (


            <div>
                {questions}
            </div>

        );
    }
}

export default AttachQuestionsOptions;


