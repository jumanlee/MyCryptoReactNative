import { createStore } from 'redux'
import rootReducer from './index'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';


const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
  }

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer)
export const persistor = persistStore(store)

// the below is only used for development purposes. Only activate/uncomment when you want to purge all of the existing state in redux persist storage during development when your state is in a very bad place. 
// persistor.purge();