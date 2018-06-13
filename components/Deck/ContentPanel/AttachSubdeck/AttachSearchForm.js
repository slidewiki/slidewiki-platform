import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { Button, Icon,   Segment, Menu,Label,Input, Header,Form,Dropdown} from 'semantic-ui-react';
import loadSearchedDecks from '../../../../actions/attachSubdeck/loadSearchedDecks';
import KeywordsInput from '../../../Search/AutocompleteComponents/KeywordsInput';
import UsersInput from '../../../Search/AutocompleteComponents/UsersInput';
import {translationLanguages} from '../../../../configs/general';
import {getLanguageNativeName} from '../../../../common';

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
            keywords: encodeURIComponent(searchstring.trim())
        });
        this.handleRedirect();
    }

    handleRedirect(event){

        if(event){
            event.preventDefault();
        }

        // form the query parameters to send to service
        let queryparams = 'keywords=' + ((this.state.keywords) ? this.state.keywords : '*:*');
        if(this.state.field)
            queryparams += `&field=${this.state.field}`;

        if(this.state.language)
            queryparams += `&language=${this.state.language}`;


        queryparams += '&kind=deck';        // always request decks here

        let users = this.refs.user.getSelected();
        if(users){
            users = users.split(',');
            for(let i in users){
                queryparams += `&user=${users[i]}`;
            }
        }

        // console.log(queryparams);
        this.context.executeAction(loadSearchedDecks, {
            params: {
                queryparams: queryparams
            }
        });

        this.keywordsInput.blur();

        return false;
    }
    handleKeyPress(event){

        if(event.key === 'Enter'){
            this.handleRedirect(event);
        }

    }
    handleKeywordsChange(){
        this.setState({
            keywords:encodeURIComponent(this.keywordsInput.getSelected().trim())
        });
    }
    handleLanguageChange(value){
        this.setState({
            language:encodeURIComponent(value.trim())
        });

    }

    handleFieldChange(value){
        this.setState({
            field:encodeURIComponent(value.trim())
        });
    }
    render(){
        let fieldOptions =[
        //  { value:'', text:'Select Search field'},
          {value:'title' , text:'Title'},
          {value:'description' , text:'Description'},
          {value:'content' , text:'Content'},
          {value:'speakernotes' , text:'Speakernotes'}

        ];

        let languageOptions = translationLanguages.reduce((arr, curr) => {
            arr.push({ value: curr, text: getLanguageNativeName(curr) });
            return arr;
        }, []);

        return (
          <Segment className='advancedSearch'>
                          <Header as="h3">Search for decks</Header>
                          <Form success>
                            <Form.Group>

                              <Form.Field width="11" >
                                <Label htmlFor="SearchTerm"  className="sr-only">Search Term</Label>
                                <KeywordsInput ref={(keywords) => {this.keywordsInput = keywords; }} onSelect={this.onSelect.bind(this)} placeholder='Type your keywords here' onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleKeywordsChange.bind(this)} />
                              </Form.Field>
                              <Form.Field>
                               <Label htmlFor="field" className="sr-only">Search field</Label>
                               <Dropdown selection name='field' id='field' ref={(field) => {this.field = field;}}  placeholder='Select Search field' options={fieldOptions} role="listbox"  onChange={(e, {value }) => {this.handleFieldChange(value);}}/>
                              </Form.Field>
                            </Form.Group>
                            <Form.Group>
                              <Form.Field  width="11">
                                <Label htmlFor="users_input_field"  className="sr-only">User</Label>
                                <UsersInput ref='user' placeholder='Select Users'/>
                              </Form.Field>
                              <Form.Field>
                               <Label htmlFor="language" className="sr-only">Language</Label>
                               <Dropdown selection  placeholder='Select Language' name='language'  id='language'  options={languageOptions} defaultValue='' role="listbox"  onChange={(e, { value }) => {this.handleLanguageChange(value);}}/>
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
    executeAction: React.PropTypes.func.isRequired
};


export default AttachSearchForm;
