/**
 * Created by Yali on 3/2/17.
 */

export const SEARCH_TERMS = 'SEARCH_TERMS';
export const HIGHLIGHT_TEXT = 'HIGHLIGHT_TEXT';
export const MOVE_DOCUMENT = 'MOVE_DOCUMENT';
export const CLUSTER_DOCUMENTS = 'CLUSTER_DOCUMENTS';
export const OPEN_DOCUMENT = 'OPEN_DOCUMENT';
export const OVERLAP_DOCUMENTS = 'OVERLAP_DOCUMENTS';
export const ANNOTATE_DOCUMENT = 'ANNOTATE_DOCUMENT';
export const PIN_DOCUMENT = 'PIN_DOCUMENT';
export const MOVEMENT_MODE = 'MOVEMENT_MODE';

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

export function openDocument(docId) {
    
    return (dispatch) => {
        dispatch({type: OPEN_DOCUMENT, docId});
    };
}

export function overlapDocuments(docList) {
    
    return (dispatch) => {
        dispatch({type: OVERLAP_DOCUMENTS, docList});
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

export function changeMovementMode(mode) {
    return (dispatch) => {
        dispatch({type: MOVEMENT_MODE, mode});
    };
}

