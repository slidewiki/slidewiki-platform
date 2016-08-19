import React from 'react';
import Picture from './Picture';
import ChangePassword from './ChangePassword';
import AccountDeletion from './AccountDeletion';
import ChangePersonalData from './ChangePersonalData';

class UserSettings extends React.Component {
    componentDidMount() {
        this.enableAccordion();
    }

    componentDidUpdate() {
        this.refreshAccordion();
        if (this.props.dimmer.success === true)
            $('#userDataDimmer').dimmer('show');
        if (this.props.dimmer.userdeleted === true)
            $('#userDeleteDimmer').dimmer('show');
        if (this.props.dimmer.failure === true)
            $('#failureDimmer').dimmer('show');
    }

    enableAccordion(status) {
        $(this.refs.accordion).accordion();
        $(this.refs.language).dropdown();
    }

    refreshAccordion(status) {
        $(this.refs.accordion).accordion('refresh');
        $(this.refs.language).dropdown('refresh');
    }

    render() {
        return (
            <div>
                <div className="ui styled fluid accordion" ref="accordion">

                    <div className="active title">
                        <i className="dropdown icon"/> <i className="user icon"/>
                        Personal Data
                    </div>
                    <div className="active content ui">
                        <div className="ui stackable vertically divided grid">

                            <div className="row">
                                <div className="sixteen wide column">
                                    <Picture user={ this.props.user }/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="sixteen wide column">
                                    <ChangePersonalData user={ this.props.user} failures={ this.props.failures }/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="sixteen wide column">
                                    <ChangePassword failures={ this.props.failures }/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="title">
                        <i className="dropdown icon"/> <i className="settings icon"/>
                        Integrations with other platforms
                    </div>
                    <div className="content">
                        <p>This feature is currently missing. Please wait for future releases of SlideWiki.</p>
                        {/*Include a nested accordion covering Google, Github, ....*/}
                    </div>

                    <div className="title">
                        <i className="dropdown icon"/> <i className="ban icon"/>
                        Delete my account
                    </div>
                    <div className="content">
                        <AccountDeletion />
                    </div>
                </div>
                <div className="ui blurring page dimmer" id="userDataDimmer">
                    <div className="content">
                        <div className="center"><h1 className="ui inverted icon header"><i className="huge inverted checkmark icon"/>Changes have been applied</h1></div>
                    </div>
                </div>
                <div className="ui blurring page dimmer" id="userDeleteDimmer">
                    <div className="content">
                        <div className="center"><h1 className="ui inverted icon header"><i className="huge inverted checkmark icon"/>Your Account has been deleted</h1></div>
                    </div>
                </div>
                <div className="ui blurring page dimmer" id="failureDimmer">
                    <div className="content">
                        <div className="center"><h1 className="ui inverted icon header"><i className="huge inverted ban icon"/>Something went wrong</h1></div>
                    </div>
                </div>
            </div>
        );
    }
}

UserSettings.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserSettings;
