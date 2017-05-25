import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { Button, Icon,   Segment, Menu,Label,Input, Header,Form} from 'semantic-ui-react';
import loadSearchedDecks from '../../../../actions/attachSubdeck/loadSearchedDecks';
import KeywordsInput from '../../../Search/AutocompleteComponents/KeywordsInput';
import UsersInput from '../../../Search/AutocompleteComponents/UsersInput';

class AttachSearchForm extends React.Component{
    constructor(props){
        super(props);


    }


    onSelect(searchstring){
        this.setState({keywords: searchstring});
        this.handleRedirect();
    }

    getEncodedParams(params){
        let queryparams = {
            keywords: (params && params.keywords)
                            ? params.keywords       // if keywords are set from redirection
                            : (this.refs.keywords.getSelected().trim() || '*:*'),   //else get keywords from input, and if empty set wildcard to fetch all
            field: this.refs.field.value.trim(),
            kind: 'deck',
            language: this.refs.language.value.trim(),
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
        if(value.trim() === '')
            return '';

        return ((encodedParams) ? '&' : '')
                + encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }

    handleRedirect(event, params){

        if(event){
            event.preventDefault();
        }


        this.context.executeAction(loadSearchedDecks, {
            params: {
                queryparams: this.getEncodedParams(params)
            }
        });

        this.refs.keywords.blur();

        return false;

    }

    handleKeyPress(event){

        if(event.key === 'Enter'){
            this.handleRedirect(event);
        }

    }
    render(){

        return (
          <Segment className='advancedSearch'>
                          <Header as="h3">Search for decks</Header>
                          <Form success>
                            <Form.Group>

                              <Form.Field width="11" >
                                <label htmlFor="SearchTerm"  className="sr-only">Search Term</label>
                                <KeywordsInput ref='keywords' onSelect={this.onSelect.bind(this)} placeholder='Type your keywords here' onKeyPress={this.handleKeyPress.bind(this)}/>
                              </Form.Field>
                              <Form.Field>
                               <label htmlFor="field" className="sr-only">Search field</label>
                               <select name='field' id='field' multiple='' className='ui fluid search dropdown' ref='field'>
                                 <option value=' '>Select Search field</option>
                                 <option value='title'>Title</option>
                                 <option value='description'>Description</option>
                                 <option value='content'>Content</option>
                                 <option value='speakernotes'>Speakernotes</option>
                               </select>
                              </Form.Field>
                            </Form.Group>
                            <Form.Group widths="equal" >
                              <div className="field">
                                <label htmlFor="users_input_field"  className="sr-only">User</label>
                                <UsersInput ref='user' placeholder='Select Users' />
                              </div>

                              <Form.Field>
                              <label htmlFor="language" className="sr-only">Language</label>
                              <select name='language' multiple='' id='language' className='ui fluid search dropdown' ref='language'>
                                <option value=' '>Select Language</option>
                                <option value='en_GB'>English</option>
                                <option value='de_DE'>German</option>
                                <option value='el_GR'>Greek</option>
                                <option value='it_IT'>Italian</option>
                                <option value='pt_PT'>Portuguese</option>
                                <option value='sr_RS'>Serbian</option>
                                <option value='es_ES'>Spanish</option>
                              </select>
                              </Form.Field>
                              <Form.Field>
                                <label htmlFor="license" className="sr-only">License</label>
                                <select name='license' id='license' multiple='' className='ui fluid search dropdown' ref='license'>
                                <option value=' '>Select Licence</option>
                                <option value='CC0'>CC0</option>
                                <option value='CC BY'>CC BY</option>
                                <option value='CC BY-SA'>CC BY-SA</option>
                              </select>
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
