import actionTypes from '../constants/actionTypes';
//import runtimeEnv from '@mars/heroku-js-runtime-env'
const env = process.env;

function moviesFetched(movies) {
    // Check if the response has a 'movies' property (API returns {success: true, movies: [...]}
    const movieArray = movies.movies || movies;
    
    return {
        type: actionTypes.FETCH_MOVIES,
        movies: movieArray
    }
}

function movieFetched(movie) {
    return {
        type: actionTypes.FETCH_MOVIE,
        selectedMovie: movie
    }
}

function movieSet(movie) {
    return {
        type: actionTypes.SET_MOVIE,
        selectedMovie: movie
    }
}

export function setMovie(movie) {
    return dispatch => {
        dispatch(movieSet(movie));
    }
}

export function fetchMovie(movieId) {
    return dispatch => {
        console.log('Fetching movie details for ID:', movieId);
        return fetch(`${env.REACT_APP_API_URL}/movies/${movieId}?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                if (response.status === 401) {
                    // Authentication error - token expired or invalid
                    console.error("Authentication error: Please login again");
                    // Could dispatch an auth error action here if needed
                } else {
                    console.error(`Error fetching movie: ${response.statusText}`);
                }
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            console.log('Movie details response:', res);
            // Check if the API returns the movie directly or nested in a property
            const movieData = res.movie || res;
            console.log('Processed movie data for redux:', movieData);
            dispatch(movieFetched(movieData));
        }).catch((e) => {
            console.error(`Failed to fetch movie: ${e.message}`);
            // Dispatch a failure action to prevent infinite loading state
            dispatch({
                type: actionTypes.FETCH_MOVIE_FAILURE,
                error: e.message
            });
        });
    }
}

export function fetchMovies() {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/movies?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            console.log('API response for fetchMovies:', res);
            dispatch(moviesFetched(res));
        }).catch((e) => console.log('Error fetching movies:', e));
    }
}