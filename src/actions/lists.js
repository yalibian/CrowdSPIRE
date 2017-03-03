export const GET_LISTS_START = 'GET_LISTS_START';
export const GET_LISTS = 'GET_LISTS';
export const GET_DATA = 'GET_DATA';
export const SEARCH_TERMS = 'SEARCH_TERMS';
export const HIGHLIGHT_TEXT = 'HIGHLIGHT_TEXT';
export const CLUSTER_DOCUMENTS = 'CLUSTER_DOCUMENTS';
export const ANNOTATE_DOCUMENT = 'ANNOTATE_DOCUMENT';
export const PIN_DOCUMENT = 'PIN_DOCUMENT';

import * as data from './crescent.json';
import * as crowd from './crescent_crowd.json';

export function getLists(quantity) {
  return (dispatch) =>{
    dispatch({type: GET_LISTS, data: data, crowd: crowd, isFetching: true});
  };
}

export function getData(quantity) {
  return (dispatch) =>{
    dispatch({type: GET_DATA, data: data, crowd: crowd, isFetching: true});
  };
}

export function searchTerms () {
    return (dispatch) => {
        dispatch({type: SEARCH_TERMS, data: data, crowd: crowd});
    };
}

export function highlightText () {
    return (dispatch) => {
        dispatch({type: HIGHLIGHT_TEXT, data: data, crowd: crowd});
    };
}

export function clusterDocuments () {
    return (dispatch) => {
        dispatch({type: CLUSTER_DOCUMENTS, data: data, crowd: crowd});
    };
}

export function annotateDocument () {
    return (dispatch) => {
        dispatch({type: ANNOTATE_DOCUMENT, data: data, crowd: crowd});
    };
}

export function pinDocument () {
   return (dispatch) => {
       dispatch({type: PIN_DOCUMENT, data: data, crowd: crowd});
   };
}
