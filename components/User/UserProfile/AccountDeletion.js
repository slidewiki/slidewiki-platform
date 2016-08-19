import React from 'react';
import removeUser from '../../../actions/user/userprofile/removeUser';

class AccountDeletion extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    handleAccountDelete(e) {
        this.context.executeAction(removeUser, {});
        $('.ui.modal').modal('hide');
    }

    showConfirmDialog(e) {
        $('.ui.modal').modal('show');
        //this.refs.modal1.modal('show'); // - not working!
    }

    render() {
        return (
            <div>
                <div className="ui centered grid">
                    <p>In case you delete your account, all of your data will be deleted. This includes your user profile, your authorship of decks and slides, your linked social providers and also your authorship of any comments and discussions. <strong>This is NOT reversible!</strong></p>
                    <button className="ui centered red labeled icon button" onClick={ this.showConfirmDialog.bind(this) }>
                        <i className="icon ban"/>Remove my account
                    </button>
                </div>

                <div className="ui modal" ref="modal1">
                    <div className="ui red header">Refuse the cake</div>
                    <div className="image content">
                        <i className="ui massive warning sign icon"/>
                        <div className="description">
                            <div className="ui header">Are you sure you do not want any cake?</div>
                            <p>I know we do not had the best relationship ever.... in case it seems to be pretty bad. But remember the cake at the end of all these tests! Or do I try to trick you with reverse psychology? I mean, seriously, now.</p>
                        </div>
                    </div>
                    <div className="actions">
                        <div className="ui green right labeled icon deny button">
                            <i className="checkmark icon"></i> Cake? I am still in!
                        </div>
                        <div className="ui red right labeled icon button" onClick={ this.handleAccountDelete.bind(this) }>
                        <i className="sign out icon"></i> I don not like cake, I will leave!
                        </div>
                    </div>
                </div>
          </div>
        );
    }
}

AccountDeletion.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default AccountDeletion;
