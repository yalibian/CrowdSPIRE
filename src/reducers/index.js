import {combineReducers} from 'redux';
import {
    routerReducer
} from 'react-router-redux';

// import lists from './lists';
import model from './model';


const rootReducer = combineReducers({
    routing: routerReducer,
    model,
});

export default rootReducer;
