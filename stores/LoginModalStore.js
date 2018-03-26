import {BaseStore} from 'fluxible/addons';
import { isEmpty } from '../common.js';

class LoginModalStore extends BaseStore{
    constructor(dispatcher) {
        super(dispatcher);
        this.activeTrap = false;
    }

    getState(){
        return {
            activeTrap : this.activeTrap
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.activeTrap = state.activeTrap;

    }

    updateTrap(payload){
        this.activeTrap = payload.activeTrap;
        console.log('store payload'+payload.activeTrap);
        this.emitChange();
    }


}
LoginModalStore.storeName = 'LoginModalStore';
LoginModalStore.handlers = {

    'LOGIN_UPDATE_TRAP' :'updateTrap'

};

export default LoginModalStore;
