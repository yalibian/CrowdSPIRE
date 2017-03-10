/**
 * Created by Yali on 3/2/17.
 */

export const GET_DATA = 'GET_DATA';

export const SEARCH_TERMS = 'SEARCH_TERMS';
export const HIGHLIGHT_TEXT = 'HIGHLIGHT_TEXT';
export const MOVE_DOCUMENT = 'MOVE_DOCUMENT';
export const CLUSTER_DOCUMENTS = 'CLUSTER_DOCUMENTS';
export const OPEN_DOCUMENT = 'OPEN_DOCUMENT';
export const ANNOTATE_DOCUMENT = 'ANNOTATE_DOCUMENT';
export const PIN_DOCUMENT = 'PIN_DOCUMENT';

import * as data from './crescent.json';
import * as crowd from './crescent_crowd.json';


export function searchTerms(keywords) {
    return (dispatch) => {
        dispatch({type: SEARCH_TERMS, keywords});
    };
}

export function highlightText(text) {
    return (dispatch) => {
        dispatch({type: HIGHLIGHT_TEXT, text});
    };
}


export function moveDocument(docs) {
    return (dispatch) => {
        dispatch({type: MOVE_DOCUMENT, docs});
    };
}

export function openDocument(doc) {
    return (dispatch) => {
        dispatch({type: OPEN_DOCUMENT, doc});
    };
}


export function clusterDocuments(docs) {
    return (dispatch) => {
        dispatch({type: CLUSTER_DOCUMENTS, docs});
    };
}

export function annotateDocument(text) {
    return (dispatch) => {
        dispatch({type: ANNOTATE_DOCUMENT, text});
    };
}

export function pinDocument(pos) {
    return (dispatch) => {
        dispatch({type: PIN_DOCUMENT, pos});
    };
}

