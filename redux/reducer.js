//actions is an object
import {WALLET_DEDUCTED, WALLET_ADDED} from './actionTypes';

const initialState = {
    funds: 100
}

const walletReducer = (state = initialState, action) => {
    switch(action.type){
        case WALLET_DEDUCTED: return {
            ...state,
            funds: parseFloat(state.funds) - parseFloat(action.value)

        }
        break;

        case WALLET_ADDED: return {
            ...state,
            funds: parseFloat(state.funds) + parseFloat(action.value)
        }
        break;


        default: return state
    }
}

export default walletReducer;