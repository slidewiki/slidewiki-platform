import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { Button, Icon,   Segment, Menu,Label,Input, Header,Form,Dropdown} from 'semantic-ui-react';
import loadSearchedDecks from '../../../../actions/attachSubdeck/loadSearchedDecks';
import KeywordsInput from '../../../Search/AutocompleteComponents/KeywordsInput';
import UsersInput from '../../../Search/AutocompleteComponents/UsersInput';

class AttachSearchForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            language : encodeURIComponent(''),
            keywords: encodeURIComponent(''),
            field:encodeURIComponent(''),
            license:encodeURIComponent(''),
            user:encodeURIComponent(''),
          //  sort:encodeURIComponent('')

        };


    }


    onSelect(searchstring){
        this.setState({
            keywords: encodeURIComponent(searchstring.trim())
        });
        //this.handleRedirect(); //I remove this line because the user perhaps wants to select also other things...

    }
/*
    getEncodedParams(params){
        let queryparams = {
            keywords: (params && params.keywords)
                            ? params.keywords       // if keywords are set from redirection
                            : (this.refs.keywords.getSelected().trim() || '*:*'),   //else get keywords from input, and if empty set wildcard to fetch all
            field: this.refs.field.value.trim(),
            kind: 'deck',
            //language: this.refs.language.value.trim(),
            language: this.state.language.trim(),
            license: this.refs.license.value.trim(),
            user: this.refs.user.getSelected().split(','),
                // tag: this.refs.tag.value.trim(),
            sort: (params && params.sort) ? params.sort : ''
        };

            // encode params
        let encodedParams = '';
        for(let key in queryparams){
            if(queryparams[key] instanceof Array){
                for(let el in queryparams[key]){
                    encodedParams += this.encodeParam(encodedParams, key, queryparams[key][el]);
                }
            }else{
                encodedParams += this.encodeParam(encodedParams, key, queryparams[key]);
            }
        }

        return encodedParams;
    }
    encodeParam(encodedParams, key, value){
        console.log('encodeParams');
        console.log(value);

        if(value.trim() === '')
            return '';

        return ((encodedParams) ? '&' : '')
                + encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
*/
    handleRedirect(event){

        if(event){
            event.preventDefault();
        }
        let queryparams = '';

        this.context.executeAction(loadSearchedDecks, {
            params: {
                queryparams: queryparams
            }
        });

        this.keywords.blur();

        return false;

    }

    handleKeyPress(event){

        if(event.key === 'Enter'){
            this.handleRedirect(event);
        }

    }
    handleKeyowrdsChange(){

        this.setState({
            keywords:encodeURIComponent(this.keywordsInput.getSelected().trim())
        });

    }
    handleUserChange(){
        this.setState({
            user:encodeURIComponent(this.user.getSelected().trim())
        });
    }
    handleLanguageChange(value){
        this.setState({
            language:encodeURIComponent(value.trim())
        });

    }
    handleLicenceChange(value){
        this.setState({
            license:encodeURIComponent(value.trim())
        });

    }
    handleFieldChange(){
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

        let languageOptions =[
          //{ value:'', text:'Select Language'},
          { value:'en_GB', text:'English' },
          {value:'de_DE', text: 'German' },
          { value:'el_GR', text:'Greek'},
          {value:'it_IT', text:'Italian'},
          {value:'pt_PT',text:'Portuguese'},
          {value:'sr_RS', text:'Serbian'},
          {value:'es_ES', text:'Spanish'}
        ];

        let licenseOptions = [
        //  { value:'', text:'Select Licence' },
          { value:'CC0', text:'CC0' },
          { value:'CC BY', text:'CC BY' },
          { value:'CC BY-SA', text:'CC BY-SA' }
        ];

        return (
          <Segment className='advancedSearch'>
                          <Header as="h3">Search for decks</Header>
                          <Form success>
                            <Form.Group>

                              <Form.Field width="11" >
                                <Label htmlFor="SearchTerm"  className="sr-only">Search Term</Label>
                                <KeywordsInput ref={(keywords) => {this.keywordsInput = keywords; }} onSelect={this.onSelect.bind(this)} placeholder='Type your keywords here' onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleKeyowrdsChange.bind(this)} />
                              </Form.Field>
                              <Form.Field>
                               <Label htmlFor="field" className="sr-only">Search field</Label>
                               <Dropdown selection name='field' id='field' ref={(field) => {this.field = field;}}  placeholder='Select Search field' options={fieldOptions} role="listbox"  onChange={(e, {value }) => {this.handeFieldChange(value);}}/>
                              </Form.Field>
                            </Form.Group>
                            <Form.Group widths="equal" >
                              <Form.Field>
                                <Label htmlFor="users_input_field"  className="sr-only">User</Label>
                                <UsersInput ref={(user) => {this.user=user;}} placeholder='Select Users' onChange={this.handleUserChange.bind(this)}/>
                              </Form.Field>
                              <Form.Field>
                               <Label htmlFor="language" className="sr-only">Language</Label>
                               <Dropdown selection  placeholder='Select Language' name='language'  id='language'  options={languageOptions} defaultValue='' role="listbox"  onChange={(e, { value }) => {this.handleLanguageChange(value);}}/>
                              </Form.Field>
                              <Form.Field>
                                <Label htmlFor="license" className="sr-only">License</Label>
                                <Dropdown selection placeholder='Select Licence' name='license' id='license' ref={(license) => {this.license = license;}} options={licenseOptions} defaultValue='' role="listbox"  onChange={(e, { value }) => {this.handleLicenceChange(value);}}/>
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
