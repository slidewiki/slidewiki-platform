import {BaseStore} from 'fluxible/addons';

class UserRegistrationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.registrationStatus = 'guest';
        this.errorMessage = '';
        this.failures = {
        };
        this.suggestedUsernames = [];
        this.socialError = false;
        this.socialCredentialsTaken = false;
        this.socialCredentialsTakenByDeactivatedAccount = false;
        this.socialuserdata = {};

        this.ltiError = false;
        this.ltiCredentialsTaken = false;
        this.ltiCredentialsTakenByDeactivatedAccount = false;
        this.ltiuserdata = {};
    }

    handleCreateUserSuccess(res) {
        // if(res.error) {
        //     this.errorMessage = JSON.parse(res.error.error).message;
        //     if (this.errorMessage === undefined) {
        //         this.errorMessage = JSON.parse(res.error.error).error;
        //     }
        //     this.registrationStatus = 'error';
        // } else {
        this.registrationStatus = 'pending';
        this.errorMessage = '';
        // }
        this.emitChange();
    }

    handleSocialCreateUserSuccess(res) {
        // console.log('UserRegistrationStore handleSocialCreateUserSuccess:', res);
        this.socialError = false;
        this.socialCredentialsTaken = false;
        this.socialCredentialsTakenByDeactivatedAccount = false;
        this.emitChange();
    }

    handleLTICreateUserSuccess(res) {
        // console.log('UserRegistrationStore handleLTICreateUserSuccess:', res);
        this.ltiError = false;
        this.ltiCredentialsTaken = false;
        this.ltiCredentialsTakenByDeactivatedAccount = false;
        this.emitChange();
    }



    handleResetUserRegistrationStatus() {
        this.registrationStatus = 'guest';
        this.errorMessage = '';
        this.emitChange();
    }

    handleUserRegistrationError(err) {
        let rawMessage = err.message.message ;
        if (rawMessage === undefined) {
            rawMessage = err.message;
        }
        this.errorMessage = this.extractMessage(rawMessage);
        this.registrationStatus = 'error';
        this.emitChange();
    }

    handleSocialUserRegistrationError(err) {
        // console.log('UserRegistrationStore handleSocialUserRegistrationError()', err, '___', err.message, '___', err.statusCode, '___', err.toString());
        if (err.statusCode.toString() === '409') {
            this.socialCredentialsTaken = true;
        }
        else if (err.statusCode.toString() === '423') {
            this.socialCredentialsTakenByDeactivatedAccount = true;
        }
        else
            this.socialError = true;
        this.emitChange();
    }

    handleLTIUserRegistrationError(err) {
        // console.log('UserRegistrationStore handleLTIUserRegistrationError()', err, '___', err.message, '___', err.statusCode, '___', err.toString());
        if (err.statusCode.toString() === '409') {
            this.ltiCredentialsTaken = true;
        }
        else if (err.statusCode.toString() === '423') {
            this.ltiCredentialsTakenByDeactivatedAccount = true;
        }
        else
            this.ltiError = true;
        this.emitChange();
    }

    extractMessage(raw) {
        const message = raw.substring(7, raw.length - 1);// There is an error code at the beginning (e.g. 422 - "{\"statusCode\":422,\"error\":\"Unprocessable Entity\",\"message\":\"The username is already taken\"}")
        const message1 = message.replace(/\\\"/g, '"');// replace \" with "
        console.log('extractMessage', raw, message1);
        let message2 = raw;
        try {
            message2 = JSON.parse(message1).message;
            if (message2 === undefined) {// Some errors do not have the message parameter
                message2 = JSON.parse(message1).error;
            }
        } catch (e) {

        }
        return message2;
    }

    handleEmailChecked(payload) {
        this.failures.emailNotAllowed = payload.taken;
        this.emitChange();
    }

    handleUsernameChecked(payload) {
        this.failures.usernameNotAllowed = payload.res.taken;
        if (this.failures.usernameNotAllowed) {
            this.suggestedUsernames = this.suggestUsernames(payload.username, payload.res.alsoTaken);
        } else {
            this.suggestedUsernames = [];
        }
        this.emitChange();
    }

    suggestUsernames(username, takenUsernames) {
        let newUsernames = [];
        for(let i=0; i <100; i++) {
            let newUsername = username + Math.floor((Math.random() * 99) + 1);
            if (!takenUsernames.includes(newUsername)) {
                newUsernames.push(newUsername);
                if (newUsernames.length > 2) {
                    break;
                }
            }
        }
        return newUsernames;
    }

    newSocialData(data) {
        console.log('UserRegistrationStore newSocialData', data);

        this.socialuserdata = data || {};
        this.socialError = false;
        this.socialCredentialsTaken = false;
        this.socialCredentialsTakenByDeactivatedAccount = false;
        this.emitChange();
    }

    newLTIData(data) {
          console.log('UserRegistrationStore newLTIData', data);

          this.ltiuserdata = data || {};
          this.ltiError = false;
          this.ltiCredentialsTaken = false;
          this.ltiCredentialsTakenByDeactivatedAccount = false;
          this.emitChange();
      }

    getState() {
        return {
            registrationStatus: this.registrationStatus,
            failures: this.failures,
            suggestedUsernames: this.suggestedUsernames,
            errorMessage: this.errorMessage,
            socialError: this.socialError,
            socialCredentialsTaken: this.socialCredentialsTaken,
            socialuserdata: this.socialuserdata,
            socialCredentialsTakenByDeactivatedAccount: this.socialCredentialsTakenByDeactivatedAccount,
            ltiError: this.ltiError,
            ltiCredentialsTaken: this.ltiCredentialsTaken,
            ltiuserdata: this.ltiuserdata,
            ltiCredentialsTakenByDeactivatedAccount: this.ltiCredentialsTakenByDeactivatedAccount
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.registrationStatus = state.registrationStatus;
        this.failures = state.failures;
        this.suggestedUsernames = state.suggestedUsernames;
        this.errorMessage = state.errorMessage;
        this.socialError = state.socialError;
        this.socialCredentialsTaken = state.socialCredentialsTaken;
        this.socialuserdata = state.socialuserdata;
        this.socialCredentialsTakenByDeactivatedAccount = state.socialCredentialsTakenByDeactivatedAccount;

        this.ltiError = state.ltiError;
        this.ltiCredentialsTaken = state.ltiCredentialsTaken;
        this.ltiuserdata = state.ltiuserdata;
        this.ltiCredentialsTakenByDeactivatedAccount = state.ltiCredentialsTakenByDeactivatedAccount;
    }
}

UserRegistrationStore.storeName = 'UserRegistrationStore';
UserRegistrationStore.handlers = {
    'CREATE_USER_SUCCESS': 'handleCreateUserSuccess',
    'RESET_USER_REGISTRATION_STATUS': 'handleResetUserRegistrationStatus',
    'CHECK_EMAIL_SUCCESS': 'handleEmailChecked',
    'CHECK_USERNAME_SUCCESS': 'handleUsernameChecked',
    'SOCIAL_CREATE_USER_SUCCESS': 'handleSocialCreateUserSuccess',
    'LTI_CREATE_USER_SUCCESS': 'handleLTICreateUserSuccess',
    //error handling
    'CREATE_USER_FAILURE': 'handleUserRegistrationError',
    'SOCIAL_CREATE_USER_FAILURE': 'handleSocialUserRegistrationError',
    'LTI_CREATE_USER_FAILURE': 'handleLTIUserRegistrationError',

    'NEW_LTI_DATA': 'newLTIData',
    'NEW_SOCIAL_DATA': 'newSocialData'
};

export default UserRegistrationStore;
