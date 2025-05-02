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
        console.log('Props in MovieList:', this.props);
        
        const MovieListTable = ({movieList}) => {
            console.log('MovieListTable received movieList:', movieList);
            
            if (!movieList) {
                return <div className="text-center p-3"><h3>Loading....</h3></div>
            }

            // Function to generate a color based on movie title
            const generateColorFromTitle = (title) => {
                const colors = ['#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF3333', '#33FFEC', '#FCFF33'];
                const index = title ? title.charCodeAt(0) % colors.length : 0;
                return colors[index];
            };
            
            // Sort movies by rating (highest first)
            const sortedMovies = Array.isArray(movieList) ? [...movieList].sort((a, b) => {
                const ratingA = a.averageRating || a.rating || 0;
                const ratingB = b.averageRating || b.rating || 0;
                return ratingB - ratingA;
            }) : [];

            console.log('Sorted movies:', sortedMovies);

            return (
                <Container className="mt-4">
                    <h2 className="mb-3 text-white">Movies List</h2>
                    <Table striped bordered hover responsive variant="dark" className="movie-table" style={{backgroundColor: '#000', color: 'white'}}>
                        <thead style={{backgroundColor: '#121212'}}>
                            <tr>
                                <th style={{width: '120px'}}>Movie</th>
                                <th>Title</th>
                                <th>Rating</th>
                                <th>Reviews</th>
                                <th>Release Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedMovies.map((movie) =>
                                <tr key={movie._id} style={{backgroundColor: '#121212'}}>
                                    <td>
                                        {/* Debug image properties */}
                                        {console.log('Movie image properties:', {
                                            id: movie._id,
                                            title: movie.title,
                                            imageUrl: movie.imageurl,
                                            image: movie.image,
                                            img: movie.img
                                        })}
                                        
                                        {(movie.imageUrl || movie.image || movie.img) ? (
                                            <LinkContainer to={'/movie/'+movie._id} onClick={()=>this.handleClick(movie)}>
                                                <Nav.Link><Image className="image" src={movie.imageurl || movie.image || movie.img} thumbnail style={{width: '100px'}} /></Nav.Link>
                                            </LinkContainer>
                                        ) : (
                                            <LinkContainer to={'/movie/'+movie._id} onClick={()=>this.handleClick(movie)}>
                                                <Nav.Link>
                                                    {/* Use a colored div with the first letter of the movie title as fallback */}
                                                    <div 
                                                        className="d-flex justify-content-center align-items-center"
                                                        style={{
                                                            width: '50px', 
                                                            height: '50px', 
                                                            backgroundColor: generateColorFromTitle(movie.title),
                                                            color: 'white',
                                                            fontSize: '48px',
                                                            fontWeight: 'bold',
                                                            border: '1px solid #6c757d'
                                                        }}
                                                    >
                                                        {movie.title ? movie.title.charAt(0) : '?'}
                                                    </div>
                                                </Nav.Link>
                                            </LinkContainer>
                                        )}
                                    </td>
                                    <td className="align-middle">
                                        <LinkContainer to={'/movie/'+movie._id} onClick={()=>this.handleClick(movie)}>
                                            <Nav.Link className="p-0"><h5 className="text-white">{movie.title}</h5></Nav.Link>
                                        </LinkContainer>
                                    </td>
                                    <td className="align-middle">
                                        {/* Remove the text-only rating display that's causing duplication */}
                                        {console.log('Movie data:', movie)}
                                        {/* Check various possible rating property names */}
                                        {(() => {
                                            // Try different possible property names for rating
                                            const rating = movie.averageRating || movie.rating || 0;
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
                                    <td className="align-middle" style={{fontSize: '1.1rem', color: 'white'}}>
                                        {movie.reviews ? movie.reviews.length : 0}
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

