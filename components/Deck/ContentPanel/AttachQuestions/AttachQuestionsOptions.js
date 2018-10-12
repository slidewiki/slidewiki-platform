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
            showAnswers: false,
            showExplanation: false,
        };
    }
    toggleShowNumbers() {
        let optionChange = {
            option: 'showNumbers',
            value: !this.state.showNumbers,
        };
        this.setState({showNumbers: !this.state.showNumbers});
        this.context.executeAction(updateOptions, optionChange);
    }
    toggleShowAnswers() {
        let optionChange = {
            option: 'showAnswers',
            value: !this.state.showAnswers,
        };
        this.setState({showAnswers: !this.state.showAnswers});
        this.context.executeAction(updateOptions, optionChange);
    }
    toggleShowExplanation() {
        let optionChange = {
            option: 'showExplanation',
            value: !this.state.showExplanation,
        };
        this.setState({showExplanation: !this.state.showExplanation});
        //console.log(optionChange);
        this.context.executeAction(updateOptions, optionChange);
        
        console.log(this.state.showExplanation);
    }
    onChange(event) {/*nikki does this need any error handling? */
        this.setState({title: event.target.value});
    }
    onBlur() {
        //console.log('blurred');
        let optionChange = {
            option: 'title',
            value: this.state.title,
        }
        this.context.executeAction(updateOptions, optionChange);
    }
    
    render() {
        let showAnswers = this.state.showAnswers;
        let showExplanation = this.state.showExplanation;
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
                <div style={{marginBottom: '5px'}} className='ui field input'>
                    <label style={{verticalAlign: 'middle', marginRight: '20px'}}>Title</label>
                    <input type='text' placeholder='Title for Questions...' onChange={this.onChange.bind(this)} onBlur={this.onBlur.bind(this)}/>
                </div>
                <div style={{marginBottom: '5px'}}>
                    <label style={{marginRight: '20px'}} >Number questions</label>
                    <Checkbox toggle style={{verticalAlign: 'middle'}} ref='showAnswers' name='showNumbers' checked={showNumbers} onChange={this.toggleShowNumbers.bind(this)}/>
                </div>
                <div style={{marginBottom: '5px'}}>
                    <label style={{marginRight: '20px'}}>Display correct answers</label>
                    <Checkbox toggle style={{verticalAlign: 'middle'}} ref='showAnswers' name='showAnswers' checked={showAnswers} onChange={this.toggleShowAnswers.bind(this)}/>
                </div>
                <div style={{marginBottom: '5px'}}>
                    <label style={{marginRight: '20px'}}>Display explanation</label>
                    <Checkbox toggle style={{verticalAlign: 'middle'}} ref='showExplanation' name='showExplanation' checked={showExplanation} onChange={this.toggleShowExplanation.bind(this)}/>
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


