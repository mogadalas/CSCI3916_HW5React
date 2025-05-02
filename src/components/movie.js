import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovie } from "../actions/movieActions";
import MovieDetail from "../components/moviedetail"

// support routing

function Movie(props) {
    const params = useParams();
    const movieId = params.movieId;
    const dispatch = useDispatch();
    const selectedMovie = useSelector(state => state.movie.selectedMovie);
    
    useEffect(() => {
        // Using useEffect to ensure proper lifecycle management
        if (!movieId) {
            console.error("No movie ID provided");
            return;
        }
        
        if (selectedMovie == null) {
            dispatch(fetchMovie(movieId));
        }
    }, [selectedMovie, movieId, dispatch]);

    return (<MovieDetail movieId={movieId} />)
}

export default Movie;