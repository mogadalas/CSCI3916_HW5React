import constants from '../constants/actionTypes'

let initialState = {
      movies: [],
      selectedMovie: null,
      error: null
}

const movieReducer = (state = initialState, action) => {
      let updated = Object.assign({}, state);

      switch(action.type) {
            case constants.FETCH_MOVIES:
                  updated['movies'] = action.movies;
                  updated['selectedMovie'] = action.movies[0];
                  updated['error'] = null;
                  return updated;
            case constants.SET_MOVIE:
                  updated['selectedMovie'] = action.selectedMovie;
                  updated['error'] = null;
                  return updated;
            case constants.FETCH_MOVIE:
                  updated['selectedMovie'] = action.selectedMovie;
                  updated['error'] = null;
                  return updated;
            case constants.FETCH_MOVIE_FAILURE:
                  updated['error'] = action.error;
                  return updated;
            default:
                  return state;
      }
}

export default movieReducer;