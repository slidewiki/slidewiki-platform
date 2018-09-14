import PropTypes from 'prop-types';
import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import updateUserlti from '../../../actions/user/userprofile/updateUserlti';
import deleteUserlti from '../../../actions/user/userprofile/deleteUserlti';
import leaveUserlti from '../../../actions/user/userprofile/leaveUserlti';
import { LTI_ID } from '../../../configs/general';

class UserLTIs extends React.Component {
    constructor(props){
        super(props);

        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error.action !== undefined && this.props.error === '') {
            let message = 'Error while deleting the lti: ';
            if (nextProps.error.action === 'leave')
                message = 'Error while leaving the lti: ';
            swal({
                title: 'Error',
                text: message + nextProps.error.message,
                type: 'error',
                confirmButtonText: 'Close',
                confirmButtonClass: 'negative ui button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            })
            .then(() => {
                this.context.executeAction(updateUserlti, {lti: {}, offline: true});

                return true;
            })
            .catch();
            return;
        }
    }

    handleClickOnEditLTI(e) {
        e.preventDefault();
        // console.log('handleClickOnEditLTI:', e.target.attributes.name.value);

        const action = e.target.attributes.name.value;  //eg. changeLTI_2
        const ltiid = action.split('_')[1];

        let lti = this.props.ltis.find((lti) => {
            return lti._id.toString() === ltiid;
        });

        this.context.executeAction(updateUserlti, {lti: lti, offline: false});
        this.context.executeAction(navigateAction, {
            url: '/user/' + this.props.username + '/ltis/edit'
        });
    }

    handleClickOnRemoveLTI(e) {
        e.preventDefault();
        console.log('handleClickOnRemoveLTI:', e.target.attributes.name.value);

        const action = e.target.attributes.name.value;  //eg. changeLTI_2
        const ltiid = action.split('_')[1];

        swal({
            titleText: 'Are you sure you want to delete this user LTI?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((accepted) => {
            this.context.executeAction(deleteUserlti, {ltiid: ltiid});
            swal('User LTI successfully deleted');
        }, (cancelled) => {/*do nothing*/})
            .catch(swal.noop);
    }

    handleClickOnLeaveLTI(e) {
        e.preventDefault();
        console.log('handleClickOnLeaveLTI:', e.target.attributes.name.value);

        const action = e.target.attributes.name.value;  //eg. changeLTI_2
        const ltiid = action.split('_')[1];

        this.context.executeAction(leaveUserlti, {ltiid: ltiid});
    }

    handleCLickNewLTI(e) {
        e.preventDefault();
        this.context.executeAction(updateUserlti, {lti: {}, offline: true});
        this.context.executeAction(navigateAction, {
            url: '/user/' + this.props.username + '/ltis/edit'
        });
    }

    render() {
        let items = [];
        console.log('render userLTIs:', this.props.userid, this.props.ltis);
        if(! (this.props.username.endsWith(LTI_ID))){
          this.props.ltis.forEach((lti) => {
              items.push( (
                  <div key={lti._id} className="ui vertical segment" >
                      <div className="ui two column grid container">

                          <div className="column">
                              <div className="ui header"><h3>{lti.key}</h3></div>
                              <div
                                   className="meta">{lti.members.length+1} member{((lti.members.length+1) !== 1) ? 's': ''}</div>
                          </div>

                          <div className="right aligned column">
                              {((this.props.userid === lti.creator) || (this.props.userid === lti.creator.userid)) ? (
                                <div>
                                    <button className="ui large basic icon button" data-tooltip="LTI deletion" aria-label="LTI deletion" name={'deleteLTI_' + lti._id} onClick={this.handleClickOnRemoveLTI.bind(this)} >
                                        <i className="remove icon" name={'deleteLTI_' + lti._id} ></i>
                                    </button>
                                    <button className="ui large basic icon button" data-tooltip="LTI settings" aria-label="LTI settings" name={'changeLTI_' + lti._id} onClick={this.handleClickOnEditLTI.bind(this)} >
                                        <i className="setting icon" name={'changeLTI_' + lti._id} ></i>
                                    </button>
                                </div>
                              ) : (
                                <button className="ui large basic icon button" data-tooltip="Leave LTI" aria-label="Leave LTI" name={'leaveLTI_' + lti._id} onClick={this.handleClickOnLeaveLTI.bind(this)} >
                                    <i className="remove icon" name={'leaveLTI_' + lti._id} ></i>
                                </button>
                              )}

                          </div>
                      </div>
                  </div>
              ));
          });
        }//end if(! (this.props.username.endsWith(LTI_ID))
        else{
          this.props.ltis.forEach((lti) => {
              items.push( (
                  <div key={lti._id} className="ui vertical segment" >
                      <div className="ui two column grid container">

                          <div className="column">
                              <div className="ui header"><h3>{lti.key}</h3></div>
                              <div
                                   className="meta">{lti.members.length+1} member{((lti.members.length+1) !== 1) ? 's': ''}</div>
                          </div>
                      </div>
                  </div>
              ));
          });
        }


        if (this.props.ltis === undefined || this.props.ltis === null || this.props.ltis.length < 1) {
            items = [(
                <div key="dummy" className="ui vertical segment" >
                  <div className="ui two column stackable grid container">
                    <h4>Not a member of a LTI group.</h4>
                  </div>
                </div>
            )];
        }

        if(! (this.props.username.endsWith(LTI_ID))){
          return (
              <div className="ui segments">
                  <div className="ui secondary clearing segment" >
                    <h3 className="ui left floated header" >LTIs</h3>
                    <button className="ui right floated labeled icon button" role="button" tabIndex="0" onClick={this.handleCLickNewLTI.bind(this)}>
                        <i className="icon users"/>
                        <p>Create new LTI</p>
                    </button>
                </div>

                {(this.props.status === 'pending') ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}

                {items}
              </div>
          );
        }//end if
        else{
          return (
              <div className="ui segments">
                  <div className="ui secondary clearing segment" >
                    <h3 className="ui left floated header" >LTIs</h3>
                </div>

                {(this.props.status === 'pending') ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}

                {items}
              </div>
          );
        }//end else

    }
}

UserLTIs.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

export default UserLTIs;
