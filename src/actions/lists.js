import faker from 'faker';

export const GET_LISTS_START = 'GET_LISTS_START';
export const GET_LISTS = 'GET_LISTS';
export const MOVE_CARD = 'MOVE_CARD';
export const MOVE_LIST = 'MOVE_LIST';
export const TOGGLE_DRAGGING = 'TOGGLE_DRAGGING';

// import * as data from '!json!./crescent.json';
import * as data from './crescent.json';
// import * as crowd from '!json!./crescent_crowd.json';
import * as crowd from './crescent_crowd.json';

export function getLists(quantity) {

  return (dispatch) =>{

    dispatch({type: GET_LISTS, data: data, crowd: crowd, isFetching: true});
  };
}

export function moveList(lastX, nextX) {
  return (dispatch) => {
    dispatch({ type: MOVE_LIST, lastX, nextX });
  };
}

export function moveCard(lastX, lastY, nextX, nextY) {
  return (dispatch) => {
    dispatch({ type: MOVE_CARD, lastX, lastY, nextX, nextY });
  };
}

export function toggleDragging(isDragging) {
  return (dispatch) => {
    dispatch({ type: TOGGLE_DRAGGING, isDragging });
  };
}
