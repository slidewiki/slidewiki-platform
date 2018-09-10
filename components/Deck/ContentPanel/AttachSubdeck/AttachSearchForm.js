import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { Button, Icon,   Segment, Menu,Label,Input, Header,Form,Dropdown} from 'semantic-ui-react';
import loadSearchedDecks from '../../../../actions/attachSubdeck/loadSearchedDecks';
import KeywordsInput from '../../../Search/AutocompleteComponents/KeywordsInput';
import UsersInput from '../../../Search/AutocompleteComponents/UsersInput';
import {translationLanguages, getLanguageNativeName} from '../../../../common';

class AttachSearchForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            language : encodeURIComponent(''),
            keywords: encodeURIComponent(''),
            field:encodeURIComponent(''),
            user:encodeURIComponent(''),
        };


    }

    // this is used when an autocomplete suggestion is pressed
    onSelect(searchstring){
        this.setState({
            keywords: searchstring
        });
        this.handleRedirect();
    }

    handleRedirect(event){

        if(event){
            event.preventDefault();
        }

        let users = this.refs.user.getSelected();
        this.context.executeAction(loadSearchedDecks, {
            query: {
                keywords: this.state.keywords || undefined, 
                field: this.state.field || undefined,
                language: this.state.language || undefined, 
                kind: 'deck',
                user: (users !== '') ? users.split(',') : undefined,
            }
        });

        this.keywordsInput.blur();

        return false;
    }
    onChange(event) {
        let curstate = {};
        curstate[event.target.name] = event.target.value;
        this.setState(curstate);
    }
    onDropdownChange(event, data){
        let curstate = {};
        curstate[data.name] = data.value;
        this.setState(curstate);
    }
    render(){
        let fieldOptions =[
          {value:'', text:'Select Search field'},
          {value:'title' , text:'Title'},
          {value:'description' , text:'Description'},
          {value:'content' , text:'Content'},
          {value:'speakernotes' , text:'Speakernotes'}
        ];

        let languageOptions = translationLanguages.reduce((arr, curr) => {
            arr.push({ value: curr, text: getLanguageNativeName(curr) });
            return arr;
        }, []);

        // used to reset language filter
        languageOptions.unshift({
            value: '', 
            text: 'Select Language'
        });

        return (
          <Segment className='advancedSearch'>
                          <Header as="h3">Search for decks</Header>
                          <Form success>
                            <Form.Group>
                              <Form.Field width="11" >
                                <Label htmlFor="SearchTerm"  className="sr-only">Search Term</Label>
                                <KeywordsInput ref={(keywords) => {this.keywordsInput = keywords; }} onSelect={this.onSelect.bind(this)} placeholder='Type your keywords here' handleRedirect={this.handleRedirect.bind(this)} onChange={this.onChange.bind(this)} value={decodeURIComponent(this.state.keywords)} />
                              </Form.Field>
                              <Form.Field>
                               <Label htmlFor="field" className="sr-only">Search field</Label>
                               <Dropdown selection name='field' id='field' ref={(field) => {this.field = field;}}  placeholder='Select Search field' options={fieldOptions} role="listbox"  onChange={this.onDropdownChange.bind(this)}/>
                              </Form.Field>
                            </Form.Group>
                            <Form.Group>
                              <Form.Field  width="11">
                                <Label htmlFor="users_input_field"  className="sr-only">User</Label>
                                <UsersInput ref='user' placeholder='Select Users'/>
                              </Form.Field>
                              <Form.Field>
                               <Label htmlFor="language" className="sr-only">Language</Label>
                               <Dropdown selection  placeholder='Select Language' name='language'  id='language'  options={languageOptions} defaultValue='' role="listbox"  onChange={this.onDropdownChange.bind(this)}/>
                              </Form.Field>
                            </Form.Group>
                            <Button  color="blue" icon tabIndex="0" role="button" type="submit" aria-label="Search for Decks"
                                data-tooltip="Search for Decks" onClick={this.handleRedirect.bind(this)}>
                              <Icon name="search"/>
                                Search
                            </Button>
                          </Form>

          </Segment>
        );





    }

}

AttachSearchForm.contextTypes = {
    executeAction: PropTypes.func.isRequired
};


export default AttachSearchForm;
