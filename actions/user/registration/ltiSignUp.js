export default function ltiSignUp(context, payload, done) {
    if (payload.error) {
        context.dispatch('LTI_CREATE_USER_FAILURE', payload.error);
        console.log('failure');
    } else {
      console.log('success');

        console.log('payload.username='+payload.username);
        console.log('payload.username='+payload.userid);
        //if (payload.username && payload.userid && payload.jwt) {
        //if (payload.username && payload.userid)
        {
            console.log('payload.username='+payload.username);
          //  payload.picture = payload.picture ? payload.picture : '';
            //context.setUser(payload); //save user as cookie via userStoragePlugin
            //context.dispatch('LTI_SIGNIN_SUCCESS', payload);
        }
        //else
        {
          //console.log('payload.username not='+payload.username);
        }
        try {
            //location.reload();
        } catch (e) {
            //nothing - server side
        }

    }
    /*
    if (typeof done === "function") {
      done();
    }
    */
};
