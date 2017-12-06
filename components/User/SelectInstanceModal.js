import React from 'react';
import FocusTrap from 'focus-trap-react';
import {Form, Button, Icon, Image, Input, Modal, Divider, TextArea, Dropdown, Popup} from 'semantic-ui-react';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import SSOStore from '../../stores/SSOStore';
import closeSSOModal from '../../actions/user/closeSSOModal.js';
import instances from '../../configs/instances.js';
import {isEmpty} from '../../common';

class SelectInstanceModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openModal: this.props.SSOStore.openModal,
            activeTrap: this.props.SSOStore.activeTrap,
            instance: '',
            username: ''
        };

        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.SSOStore.activeTrap !== this.props.SSOStore.activeTrap){
           this.setState({
               activeTrap: nextProps.SSOStore.activeTrap
           });
        }
        if (nextProps.SSOStore.openModal !== this.props.SSOStore.openModal){
           this.setState({
               openModal: nextProps.SSOStore.openModal
           });
        }
    }

    handleChange(e, { name, value }) {
        console.log(name, value);
        this.setState({ [name]: value });
    }

    handleClose(){
        this.context.executeAction(closeSSOModal);
        $('#app').attr('aria-hidden','false');
    }

    unmountTrap(){
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    saveHandler(e) {
        e.preventDefault();


        return false;
    }

    render() {
        const instanceOptions = Object.keys(instances).reduce((arr, curr) => {
          if (!instances[curr]['this'])
              arr.push({ key: curr, text: instances[curr]['url'], value: instances[curr]['url'] });
          return arr;
        }, []);
        let content = <Form>
            <Form.Field required>
              <label>Instance</label>
              <Form.Select options={instanceOptions} onChange={this.handleChange.bind(this)} name="instance" placeholder='Instance' />
            </Form.Field>
            <Form.Field  id="usernamefield" required>
              <label>Username</label>
              <Input aria-required="true" onChange={this.handleChange.bind(this)} name="username" placeholder='Username' />
            </Form.Field>
          </Form>
          ;

        return (
          <Modal open={this.state.openModal}
              onClose={this.handleClose}
              size="small"
              role="dialog"
              id="SelectInstanceModal"
              aria-labelledby="UploadMediaModalHeader"
              aria-describedby="UploadMediaModalDescription"
              tabIndex="0">
              <FocusTrap
                  id='focus-trap-SelectInstanceModal'
                  className = "header"
                  active={this.state.activeTrap}
                  focusTrapOptions={{
                      onDeactivate: this.unmountTrap,
                      clickOutsideDeactivates: false,
                      initialFocus: '#usernamefield',
                  }}>
                  <Modal.Header className="ui left aligned" as="h1" id="SelectInstanceModalHeader">
                      Select your SlideWiki instance and user
                  </Modal.Header>
                  <Modal.Content>
                    <Divider/>
                    {content}
                    {(this.state.isLoading === true) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
                    <Divider />
                    <Modal.Actions className="ui center aligned" as="div" style={{'textAlign': 'right'}}>
                      <Button color='red' tabIndex="0" type="button" aria-label="Cancel" onClick={this.handleClose} icon="minus circle" labelPosition='left' content="Cancel"/>
                      <Button id="SelectInstanceModalSaveButton" ref="SelectInstanceModalSaveButton" color="green" tabIndex="0" type="button" aria-label="Upload" onClick={this.saveHandler} icon='user' labelPosition='left' content='Sign in' disabled={isEmpty(this.state.username) || isEmpty(this.state.instance)}/>
                    </Modal.Actions>
                  </Modal.Content>
              </FocusTrap>
          </Modal>
        );
    }
}

SelectInstanceModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    getUser: React.PropTypes.func
};

SelectInstanceModal = connectToStores(SelectInstanceModal ,[SSOStore],(context,props) => {
    return {
        SSOStore: context.getStore(SSOStore).getState()
    };
});

export default SelectInstanceModal;
