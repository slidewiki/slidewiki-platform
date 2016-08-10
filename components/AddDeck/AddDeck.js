import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import AddDeckStore from '../../stores/AddDeckStore';
let ReactDOM = require('react-dom');

class AddDeck extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
    }
    componentDidUpdate(){
    }

    handleUpload(x) {
        console.log('handleUpload: ', x);
    }
    handleAddDeck(x) {
        console.log('handleAddDeck: ', x);
    }
    handleCancel(x) {
        console.log('handleCancel: ', x);
        //TODO: check if there already inputs which should be stored?

        this.context.executeAction(navigateAction, {
            url: '/'
        });
    }

    render() {
        let languageOptions = <select className="ui search dropdown" aria-labelledby="language" aria-required="true" ref="select_languages">
            <option>
                Select Language
            </option>
            <option value="TD" >
                Chad
            </option>
            <option value="CL" >
                Chile
            </option>
        </select>;
        let themeOptions = <select className="ui search dropdown" aria-labelledby="theme" ref="select_themes">
          <option value="" >Select Theme</option>
          <option value="DefaultTheme" >Default</option>
          <option value="TH1" >Theme1</option>
          <option value="TH2" >Theme2</option>
          <option value="TH3" >Theme3</option>
        </select>;
        let licenceOptions = <select className="ui search dropdown" aria-labelledby="license" ref="select_licences">
          <option value="" >Select License</option>
          <option value="CCBY" >CC BY</option>
          <option value="CCBHYSA" >CC BY-SA</option>
        </select>;
        return (
          <div className="ui container">
          <h3>Add deck</h3>
          <div className="ui grid">
              <div className="sixteen wide column">
                  <div className="ui grid">
                      <div className="two column row">
                          <div className="column">
                              <div className="ui primary button" aria-label="upload" tabIndex="0" onClick={this.handleUpload.bind(this)} >
                                  Upload file
                              </div>
                          </div>
                          <div className="column" ref="div_filename"></div>
                      </div>
                  </div>
                  <div className="ui progress" data-percent="60" ref="div_progress">
                      <div className="bar">
                          <div className="progress"></div>
                      </div>
                      <div className="label" ref="div_progress_text" ></div>
                  </div>
                  <form className="ui form upload">
                      <div className="two fields">
                          <div className="required field">
                              <label>
                                  Title
                              </label>
                              <input type="text" name="deck-title" placeholder="Title" aria-required="true" />
                          </div>
                          <div className="required field">
                              <label id="language">
                                  Language
                              </label>
                              {languageOptions}
                          </div>
                      </div>
                      <div className="field">
                          <label id="deck-description">Description</label>
                          <textarea rows="4" aria-labelledby="deck-description"></textarea>
                      </div>
                      <div className="two fields">
                          <div className="field">
                              <label id="themes">Choose deck theme</label>
                                  {themeOptions}
                          </div>
                          <div className="required field">
                              <label id="license">License</label>
                                  {licenceOptions}
                          </div>
                      </div>
                      <div className="fluid inline field ">
                          <i className="ui tags large icon" aria-label="Add tags"></i>
                          <input type="text" name="tags" placeholder="Add Tags" />
                      </div>
                      <div className="required inline field">
                          <div className="ui checkbox" >
                              <input type="checkbox" tabIndex="0" aria-labelledby="terms" aria-required="true" ref="checkbox_conditions" />
                              <label id="terms">
                                  I agree to the terms and conditions
                              </label>
                          </div>
                      </div>
                  </form>
              </div>
              <div className="two column row">
                  <div className="column">
                      <div className="ui primary button" aria-label="submit" tabIndex="0" onClick={this.handleAddDeck.bind(this)} >
                          Add deck
                      </div>
                  </div>
                  <div className="column">
                      <div className="ui secondary button" aria-label="cancel" tabIndex="0" onClick={this.handleCancel.bind(this)} >
                          Cancel
                      </div>
                  </div>
              </div>
          </div>
      </div>
        );
    }
}


AddDeck.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
AddDeck = connectToStores(AddDeck, [AddDeckStore], (context, props) => {
    return {
        AddDeckStore: context.getStore(AddDeckStore).getState()
    };
});
export default AddDeck;
