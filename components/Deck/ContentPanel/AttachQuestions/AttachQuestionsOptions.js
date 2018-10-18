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
        
        this.state = {
            title: '',
            showNumbers: false,
            showAnsExp: false,
            //showExplanation: false,
        };
    }
    toggleShowNumbers() {
        let optionChange = {
            option: 'showNumbers',
            value: !this.state.showNumbers,
        };
        this.setState({showNumbers: !this.state.showNumbers});
        this.context.executeAction(updateOptions, optionChange);
        //console.log(optionChange);
    }
    toggleShowAnsExp() {
        let optionChange = {
            option: 'showAnsExp',
            value: !this.state.showAnsExp,
        };
        this.setState({showAnsExp: !this.state.showAnsExp});
        this.context.executeAction(updateOptions, optionChange);
        //console.log(optionChange);
    }
    /*Combined with the showAnswers to become showAnsExp
    toggleShowExplanation() {
        let optionChange = {
            option: 'showExplanation',
            value: !this.state.showExplanation,
        };
        this.setState({showExplanation: !this.state.showExplanation});
        //console.log(optionChange);
        this.context.executeAction(updateOptions, optionChange);
        
        console.log(this.state.showExplanation);
    }*/
    onChange(event) {/*nikki does this need any error handling? */
        this.setState({title: event.target.value});
    }
    onBlur() {
        //console.log('blurred');
        let optionChange = {
            option: 'title',
            value: this.state.title,
        };
        this.context.executeAction(updateOptions, optionChange);
    }

    handleKeyPress = (event, param) => {
        if(event.key === 'Enter'){
           // console.log('enter key');
            switch(param) {
                case 'toggleNumbersClick':
                    this.toggleShowNumbers();
                    break;
                case 'toggleAnsExpClick':
                    this.toggleShowAnsExp();
                    break;
                default: 
                    break;
            }
        }
    }
    
    render() {
        let showAnsExp = this.state.showAnsExp;
        //let showExplanation = this.state.showExplanation;
        let showNumbers = this.state.showNumbers;
    
        //TODO
        //requires aria tags etc and keyboard accessibility 
        //need to space the toggle boxes out more (is getting the fitted class...)
        //CSS styling for toggle box
        //vertical-align: middle;
        //margin-bottom: 2px;
        //need tool-tip/ aria for the title - if no title is entered the default title is Questions, or should it have Questions entered in the box by default?
        return (
            <Segment className='ui vertical stackable' style={{padding: '20px'}} id='EmbedOptions'>
                <div className='ui field input'>
                    <label className='ui questions padded text'>Title</label>
                    <input type='text' placeholder='Title for Questions...' tabIndex="1" onChange={this.onChange.bind(this)} onBlur={this.onBlur.bind(this)}/>
                    <div className='ui grey text' className='ui questions padded text grey'>Default title: Questions</div>
                </div>
                <div className='ui questions padded vertical'>
                    <label className='ui questions padded text'>Number questions</label>
                    <Checkbox toggle style={{verticalAlign: 'middle'}} ref='showNumbers' name='showNumbers' checked={showNumbers} onKeyPress={(evt) => this.handleKeyPress(evt, 'toggleNumbersClick')} onChange={this.toggleShowNumbers.bind(this)}/>
                </div>
                <div className='ui questions padded vertical'>
                    <label className='ui questions padded text'>Display correct answers and Explanation</label>
                    <Checkbox toggle style={{verticalAlign: 'middle'}} ref='showAnsExp' name='showAnsExp' checked={showAnsExp} onKeyPress={(evt) => this.handleKeyPress(evt, 'toggleAnsExpClick')} onChange={this.toggleShowAnsExp.bind(this)}/>
                </div>
            </Segment>
        );
    }
}
/*nikki removed <div style={{marginBottom: '5px'}}>
                    <label style={{marginRight: '20px'}}>Display explanation</label>
                    <Checkbox toggle style={{verticalAlign: 'middle'}} ref='showExplanation' name='showExplanation' checked={showExplanation} onChange={this.toggleShowExplanation.bind(this)}/>
                </div> */

AttachQuestionsOptions.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

AttachQuestionsOptions = connectToStores(AttachQuestionsOptions,[AttachQuestionsModalStore],(context,props) => {
    return {
        AttachQuestionsModalStore: context.getStore(AttachQuestionsModalStore).getState(),
    };
});


export default AttachQuestionsOptions;


