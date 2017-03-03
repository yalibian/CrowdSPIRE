/**
 * Created by Yali on 3/2/17.
 */


import {Record} from 'immutable';

import {
    GET_DATA,
    SEARCH_TERMS,
    HIGHLIGHT_TEXT,
    CLUSTER_DOCUMENTS,
    ANNOTATE_DOCUMENT,
    PIN_DOCUMENT,
} from '../actions/actions';


const InitialState = Record({
    isFetching: false,
    data: null,
    crowd: null,
    isDragging: false
});

const initialState = new InitialState;

export default function model(state = initialState, action) {
    switch (action.type) {
        case GET_DATA:
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('data', action.data)
                    .set('crowd', action.crowd);
            });
        
        case SEARCH_TERMS:
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('data', action.data)
                    .set('crowd', action.crowd);
            });
        case HIGHLIGHT_TEXT:
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('data', action.data)
                    .set('crowd', action.crowd);
            });
        case CLUSTER_DOCUMENTS:
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('data', action.data)
                    .set('crowd', action.crowd);
            });
        case ANNOTATE_DOCUMENT:
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('data', action.data)
                    .set('crowd', action.crowd);
            });
        case PIN_DOCUMENT:
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('data', action.data)
                    .set('crowd', action.crowd);
            });
        default:
            return state;
    }
}

