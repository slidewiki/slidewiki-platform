import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import AdvancedSearchStore from '../../../stores/AdvancedSearchStore';
import loadAdvancedSearchResults from '../../../actions/search/loadAdvancedSearchResults';

class AdvancedSearch extends React.Component {

    handleAdvancedSearch() {
        this.context.executeAction(loadAdvancedSearchResults, {
            // form: $('.ui.form.inputform').form(),
            searchstring: this.refs.searchstring.value,
            deckid: this.refs.deckid.value,
            userid: this.refs.userid.value
        });

    }

    render() {
        return (
            <div className="ui page grid" ref="about">
                <div className="ui content">
                    <h2 className="ui header">Advanced Search</h2>



                    <form className="ui form success">
                        <div className="field">
                            <input name='searchstring' placeholder='Text search' type='text' ref='searchstring'></input>
                        </div>

                        <div className="field">
                            <label>Language</label>
                            <select name='lang' multiple='' className='ui dropdown'>
                              <option value=''>Select Language</option>
                              <option value='EN'>English</option>
                              <option value='ES'>Spanish</option>
                              <option value='GR'>Greek</option>
                            </select>
                        </div>



                        <div className='field'>
                            <label>Deck id</label>
                            <input name='deckid' placeholder='Deck id' type='text' ref='deckid'></input>
                        </div>

                        <div className='field'>
                            <label>User id</label>
                            <input name='userid' placeholder='User id' type='text' ref='userid'></input>
                        </div>


                        <div tabIndex="0" className="ui primary submit labeled icon button" onClick={this.handleAdvancedSearch.bind(this)}>
                            <i className="icon edit"></i> Submit
                        </div>

                    </form>


                </div>
            </div>
        );
    }
}

AdvancedSearch.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
AdvancedSearch = connectToStores(AdvancedSearch, [AdvancedSearchStore], (context, props) => {
    return {
        AdvancedSearchStore: context.getStore(AdvancedSearchStore).getState()
    };
});


export default AdvancedSearch;
