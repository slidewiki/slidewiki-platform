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
    componentDidMount() {
        $('#title').focus();
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
    onChange(event) {
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
        //need tool-tip/ aria for the title - if no title is entered the default title is Questions
        return (
            <Segment className='ui vertical stackable' style={{padding: '20px'}} id='EmbedOptions'>
                <div className='ui field input'>
                    <label htmlFor='title' className='ui questions padded text'>Title</label>
                    <input id='title' type='text' placeholder='Title for Questions...' tabIndex="0" onChange={this.onChange.bind(this)} onBlur={this.onBlur.bind(this)}/>
                    <div className='ui questions padded text grey'>Default title: Questions</div>
                </div>
                <div className='ui questions padded vertical'>
                    <label htmlFor='qu_no' className='ui questions padded text'>Number questions</label>
                    <Checkbox id='qu_no' toggle style={{verticalAlign: 'middle'}} ref='showNumbers' name='showNumbers' checked={showNumbers} onKeyPress={(evt) => this.handleKeyPress(evt, 'toggleNumbersClick')} onChange={this.toggleShowNumbers.bind(this)}/>
                </div>
                <div className='ui questions padded vertical'>
                    <label htmlFor='showAns' className='ui questions padded text'>Display correct answers and Explanation</label>
                    <Checkbox toggle style={{verticalAlign: 'middle'}} ref='showAnsExp' id='showAns' name='showAnsExp' checked={showAnsExp} onKeyPress={(evt) => this.handleKeyPress(evt, 'toggleAnsExpClick')} onChange={this.toggleShowAnsExp.bind(this)}/>
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
