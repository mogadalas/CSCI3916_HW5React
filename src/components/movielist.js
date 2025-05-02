import React, { Component } from 'react';
import { fetchMovies } from "../actions/movieActions";
import { setMovie } from "../actions/movieActions";
import {connect} from 'react-redux';
import {Image, Nav, Table, Container} from 'react-bootstrap';
import { BsStarFill} from 'react-icons/bs'
import {LinkContainer} from 'react-router-bootstrap';

class MovieList extends Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchMovies());
    }

    handleSelect(selectedIndex, e) {
        const {dispatch} = this.props;
        dispatch(setMovie(this.props.movies[selectedIndex]));
    }

    handleClick = (movie) => {
        const {dispatch} = this.props;
        dispatch(setMovie(movie));
    }

    render() {
        const MovieListTable = ({movieList}) => {
            if (!movieList) {
                return <div className="text-center p-3"><h3>Loading....</h3></div>
            }
            
            // Sort movies by rating (highest first)
            const sortedMovies = [...movieList].sort((a, b) => {
                const ratingA = a.rating || 0;
                const ratingB = b.rating || 0;
                return ratingB - ratingA;
            });

            return (
                <Container className="mt-4">
                    <h2 className="mb-3 text-white">Movies List</h2>
                    <Table striped bordered hover responsive variant="dark" className="movie-table" style={{backgroundColor: '#000', color: 'white'}}>
                        <thead style={{backgroundColor: '#121212'}}>
                            <tr>
                                <th style={{width: '120px'}}>Movie</th>
                                <th>Title</th>
                                <th>Rating</th>
                                <th>Release Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedMovies.map((movie) =>
                                <tr key={movie._id} style={{backgroundColor: '#121212'}}>
                                    <td>
                                        {movie.imageUrl ? (
                                            <LinkContainer to={'/movie/'+movie._id} onClick={()=>this.handleClick(movie)}>
                                                <Nav.Link><Image className="image" src={movie.imageUrl} thumbnail style={{width: '100px'}} /></Nav.Link>
                                            </LinkContainer>
                                        ) : (
                                            <Image 
                                                className="image" 
                                                src="https://via.placeholder.com/100x150?text=No+Image" 
                                                thumbnail 
                                                style={{width: '100px', backgroundColor: '#343a40', border: '1px solid #6c757d'}} 
                                            />
                                        )}
                                    </td>
                                    <td className="align-middle">
                                        <LinkContainer to={'/movie/'+movie._id} onClick={()=>this.handleClick(movie)}>
                                            <Nav.Link className="p-0"><h5 className="text-white">{movie.title}</h5></Nav.Link>
                                        </LinkContainer>
                                    </td>
                                    <td className="align-middle">
                                        {movie.rating  }
                                        {console.log('Movie data:', movie)}
                                        {/* Check various possible rating property names */}
                                        {(() => {
                                            // Try different possible property names for rating
                                            const rating =   movie.rating  || 0;
                                            const starCount = Math.round(rating);
                                            
                                            return (
                                                <>
                                                    {[...Array(starCount)].map((_, i) => (
                                                        <BsStarFill key={i} style={{color: 'gold', marginRight: '2px'}} />
                                                    ))}
                                                    <span style={{fontSize: '1.1rem', color: 'white', marginLeft: '5px'}}>{rating}</span>
                                                </>
                                            );
                                        })()}
                                    </td>
                                    <td className="align-middle" style={{fontSize: '1.1rem', color: 'white'}}>{movie.releaseDate}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Container>
            )
        }

        return (
            <div style={{backgroundColor: '#000', minHeight: '100vh', padding: '20px'}}>
                <MovieListTable movieList={this.props.movies} />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        movies: state.movie.movies
    }
}

export default connect(mapStateToProps)(MovieList);

