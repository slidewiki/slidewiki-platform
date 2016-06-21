import React from 'react';
import userSignIn from '../../../actions/user/userSignIn';
import userSignUp from '../../../actions/user/userSignUp';

class UserRegistration extends React.Component {
    componentDidMount() {
        //Form validations
        const signupValidation = {
            fields: {
                firstname : {
                    identifier: 'firstname',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your first name'
                        }
                    ]
                },
                lastname : {
                    identifier: 'lastname',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your last name'
                        }
                    ]
                },
                email2 : {
                    identifier: 'email2',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your email address'
                        },
                        {
                            type   : 'email',
                            prompt : 'Please enter a valid email address'
                        }
                    ]
                },
                reenteremail : {
                    identifier: 'reenteremail',
                    rules: [
                        {
                            type   : 'match[email2]',
                            prompt : 'Your emails do not match'
                        }
                    ]
                },
                password2: {
                    identifier: 'password2',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter a password'
                        },
                        {
                            type   : 'minLength[6]',
                            prompt : 'Your password must be at least {ruleValue} characters'
                        }
                    ]
                }
            },
            onSuccess: this.handleSignUp.bind(this)
        };
        const signinValidation = {
            fields: {
                email1 : {
                    identifier: 'email1',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your email address'
                        },
                        {
                            type   : 'email',
                            prompt : 'Please enter a valid email address'
                        }
                    ]
                },
                password1: {
                    identifier: 'password1',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter a password'
                        },
                        {
                            type   : 'minLength[6]',
                            prompt : 'Your password must be at least {ruleValue} characters'
                        }
                    ]
                }
            },
            onSuccess: this.handleSignIn.bind(this)
        };

        $('.ui.form.signup').form(signupValidation);
        $('.ui.form.signin').form(signinValidation);
        // stop the forms from submitting normally
        $('.ui.form.signin').submit((e) => {
            e.preventDefault(); //usually use this, but below works best here.
            return false;
        });
        $('.ui.form.signup').submit((e) => {
            e.preventDefault(); //usually use this, but below works best here.
            return false;
        });

    }




    componentDidUpdate(){

    }




    handleSignIn() {
        console.log($('.ui.form.signin').form('is valid'));
        console.log($('.ui.form.signin').form('get values'));


        this.context.executeAction(userSignIn, {
            email: this.refs.email1.value,
            password: this.refs.password1.value
        });

        //
        // $('.ui.page.signup')
        //   .transition('drop')
        // ;


        // this.refs.email1.value = '';
        // this.refs.password1.value = '';
    }

    handleSignUp() {
        console.log($('.ui.form.signup').form('is valid'));
        console.log($('.ui.form.signup').form('get values'));


        $('#firstname').val('');
        $('#lastname').val('');
        $('#email2').val('');
        $('#reenteremail').val('');
        $('#password2').val('');
        // this.refs.lastname.value = '';
        // this.refs.email2.value = '';
        // this.refs.reenteremail.value = '';
        // this.refs.password2.value = '';

        this.context.executeAction(userSignUp, {
            firstname: this.refs.firstname.value,
            lastname: this.refs.lastname.value,
            email: this.refs.email1.value,
            password: this.refs.password1.value
        });


        $('.dimmer')
            .dimmer('toggle')
        ;

    }

    render() {
        return (
            <div className="ui page grid" >
                <div className="ui row">
                    <div className="column">
                        <div className="ui centered page grid">
                            <div className="ui blue segment compact page grid">
                                <h2 className="ui dividing header">Sign In</h2>
                                <form className="ui form signin">
                                    <div className="ui icon input field">
                                        <input type="text" name="email1" ref="email1" placeholder="Email"/><i className="mail icon"></i>
                                    </div>
                                    <div className="ui icon input field">
                                        <input type="password" name="password1" ref="password1" placeholder="Password"/><i className="lock icon"></i>
                                    </div>
                                    <button type="submit" className="ui blue labeled submit icon button">
                                        <i className="icon sign in"></i> Sign In
                                    </button>
                                    <div className="ui floated right ">
                                        <a href="">Can't access my account</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="ui horizontal section divider"> Or </div>
                        <div className="ui centered page grid">
                            <div className="ui dimmer">
                                <div className="content">
                                    <div className="center">
                                        <h2 className="ui inverted icon header">
                                            <i className="icon circular inverted green mail outline"></i>
                                            Thanks for signing up!
                                        </h2>
                                        <br/>
                                        To complete the registration process you must first confirm your account. An email has been sent to your address.
                                        To confirm and activate your account please check your inbox and click on the link found in the email we just sent you.
                                    </div>
                                </div>
                            </div>
                            <div className="ui green segment compact centered page grid">
                                <h2 className="ui dividing header">Sign Up</h2>
                                <form className="ui form signup" >
                                    <div className="ui input field">
                                        <input type="text" id="firstname" name="firstname" ref="firstname" placeholder="First name"/>
                                    </div><br/>
                                    <div className="ui input field">
                                        <input type="text" id="lastname" name="lastname" ref="lastname" placeholder="Last name"/>
                                    </div><br/>
                                    <div className="ui input field">
                                        <input type="text" id="email2" name="email2" ref="email2" placeholder="Email"/>
                                    </div><br/>
                                    <div className="ui input field">
                                        <input type="text" id="reenteremail" name="reenteremail" ref="reenteremail" placeholder="Re-enter email"/>
                                    </div><br/>
                                    <div className="ui input field">
                                        <input type="password" id="password2" name="password2" ref="password2" placeholder="Password"/>
                                    </div><br/>
                                    <div className="ui error message"></div>
                                    <button type="submit" className="ui green labeled submit icon button" >
                                        <i className="icon add user"></i> Sign Up
                                    </button>
                                    <div >
                                        By clicking Sign Up, you agree to our <a href="">Terms</a>.
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="ui hidden divider"></div>
                    </div>
                </div>
            </div>
        );
    }
}

UserRegistration.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserRegistration;
