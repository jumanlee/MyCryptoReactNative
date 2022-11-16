import {WALLET_DEDUCTED, WALLET_ADDED, RESET, TRANSAC_ADDED} from './actionTypes'

export const deductWallet = (_deductedAmount) => {

    return {
        type: WALLET_DEDUCTED,
        value: _deductedAmount,
    }
}

export const addWallet = (_addedAmount) => {
    return {
        type: WALLET_ADDED,
        value: _addedAmount,
    }
}

export const reset = () => {
    return {
        type: RESET,
    }
}

export const addTransac = (date, item) => {
    return {
        type: TRANSAC_ADDED,
        date: date,
        item: item,
    }
}