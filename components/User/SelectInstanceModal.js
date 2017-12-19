import React from 'react';
import FocusTrap from 'focus-trap-react';
import {Form, Button, Input, Modal, Divider, Message, Icon} from 'semantic-ui-react';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import SSOStore from '../../stores/SSOStore';
import closeSSOModal from '../../actions/user/closeSSOModal.js';
import instances from '../../configs/instances.js';
import common from '../../common';
import checkEmail from '../../actions/user/registration/checkEmail';
import newSocialData from '../../actions/user/registration/newSocialData';
import {navigateAction} from 'fluxible-router';
import setUser from '../../actions/user/setUser.js';

const MODI = 'sso_modi';
const NAME = 'sso_data';

class SelectInstanceModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openModal: this.props.SSOStore.openModal,
            activeTrap: this.props.SSOStore.activeTrap,
            instance: '',
            email: '',
            isLoading: false
        };

        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.singInHandler = this.singInHandler.bind(this);
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

        if (nextProps.SSOStore.errorMessageFinalize !== this.props.SSOStore.errorMessageFinalize) {
            swal({
                title: 'Error',
                text: nextProps.SSOStore.errorMessageFinalize,
                type: 'error',
                confirmButtonText: 'Confirm',
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            }).then().catch();
        }
    }

    handleChange(e, { name, value }) {
        console.log(name, value);
        this.setState({ [name]: value });

        if (name === 'email' && value !== '' && value !== undefined && this.state.instance !== '' && common.isEmailAddress(value)) {
            this.context.executeAction(checkEmail, {email: value, dispatch: 'SSO_MODAL_CHECKED_EMAIL', url: instances[this.state.instance].emailcheck});
        }
    }

    handleClose() {
        this.context.executeAction(closeSSOModal);
        $('#app').attr('aria-hidden','false');
    }

    unmountTrap() {
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    singInHandler(e) {
        e.preventDefault();

        if (!common.isLocalStorageOn()) {
            swal({
                title: 'Error',
                text: 'Your browser does not support HTML5 which does not allow you to use this feature.',
                type: 'error',
                confirmButtonText: 'Confirm',
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            }).then().catch();
            return;
        }

        //delete old data
        this.context.executeAction(newSocialData, {});

        //prepare localStorage
        localStorage.setItem(MODI, 'signin');
        localStorage.setItem(NAME, '');

        //observe storage
        $(window).off('storage').on('storage', this.handleStorageEvent.bind(this));

        //create new tab
        let url = instances[this.state.instance].entry+'/'+instances._self+'/'+encodeURIComponent(this.state.email);

        let width = screen.width*0.75, height = screen.height*0.75;
        if (width < 600)
            width = screen.width;
        if (height < 500)
            height = screen.height;
        let left = screen.width/2-width/2, topSpace = screen.height/2-height/2;

        this.setState({ isLoading: true });

        let win = window.open(url, '_blank', 'width='+width+',height='+height+',left='+left+',top='+topSpace+',toolbar=No,location=No,scrollbars=no,status=No,resizable=no,fullscreen=No');
        win.focus();

        let that = this;
        win.onunload = () => {
            that.setState({ isLoading: false });
        };

        return false;
    }

    handleStorageEvent(e) {
        console.log('storage event', e.key, localStorage.getItem(e.key));
        //this is available

        if (e.key !== NAME || localStorage.getItem(MODI) !== 'signin')
            return false;

        let data = {};
        try {
            data = JSON.parse(localStorage.getItem(e.key));
        } catch (err) {
            console.log('Error while parsing data', err);
            return false;
        }
        finally {
            //delete data
            // localStorage.setItem(NAME, '');
        }

        //add language before send to service
        let language = common.getIntlLanguage();
        data.language = language;

        //check data - valid and not empty
        if ( (data.username.length < 1)
            || (data.userid.length < 1)
            || (data.jwt.length < 1) )
            //Failure
            return false;

        this.setState({ isLoading: false });

        this.context.executeAction(setUser, data);
        try {
            if (this.props.SSOStore.register)
                this.context.executeAction(navigateAction, {url: '/user/'+data.username+'/settings/profile'});
            location.reload();
        } catch (e) {
            //nothing - server side
        }

        return true;
    }

    checkEmail() {
        const email = this.state.email;
        if (email !== '' && this.state.instance !== '' && common.isEmailAddress(email)) {
            this.context.executeAction(checkEmail, {email: email, dispatch: 'SSO_MODAL_CHECKED_EMAIL', url: instances[this.state.instance].emailcheck});
        }
    }

    render() {
        const instanceOptions = Object.keys(instances).reduce((arr, curr) => {
            if (!instances[curr].this)
                arr.push({ key: curr, text: instances[curr].url, value: curr});
            return arr;
        }, []);
        let message = '';
        // console.log('SelectInstanceModal render', this.props.SSOStore.emailExisting, this.state.instance);
        if (!this.props.SSOStore.emailExisting && this.state.instance !== '') {
            message = <Form.Field><Message
              error
              header='Unknown email'
              content="The email you entered is not known at the selected instance"
            /></Form.Field>;
        }
        let content = <Form error={!this.props.SSOStore.emailExisting && this.state.instance !== '' ? true : false}>
            <Form.Field required>
              <label>Instance</label>
              <Form.Select options={instanceOptions} onChange={this.handleChange.bind(this)} name="instance" placeholder='Instance' />
            </Form.Field>
            <Form.Field  id="emailfield" required>
              <label>Email</label>
              <Input iconPosition='left' aria-required="true" ref='email' onChange={this.handleChange.bind(this)} name="email" placeholder='Email' onBlur={this.checkEmail.bind(this)}>
                <Icon name='at' />
                <input />
              </Input>
            </Form.Field>
            {message}
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
                      initialFocus: '#emailfield',
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
                      <Button id="SelectInstanceModalSaveButton" ref="SelectInstanceModalSaveButton" color="green" tabIndex="0" type="button" aria-label="Upload" onClick={this.singInHandler} icon='user' labelPosition='left' content='Sign in' disabled={common.isEmpty(this.state.email) || common.isEmpty(this.state.instance) || !this.props.SSOStore.emailExisting}/>
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

SelectInstanceModal = connectToStores(SelectInstanceModal, [SSOStore], (context,props) => {
    return {
        SSOStore: context.getStore(SSOStore).getState()
    };
});

export default SelectInstanceModal;
