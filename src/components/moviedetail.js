import React, { Component } from 'react';
import {Card, Alert} from 'react-bootstrap';
import { BsStarFill, BsStar } from 'react-icons/bs'
import { Image } from 'react-bootstrap';

class MovieDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movie: null,
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchMovieDetails(this.props.movieId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.movieId !== this.props.movieId) {
            this.fetchMovieDetails(this.props.movieId);
        }
    }

    fetchMovieDetails(movieId) {
        this.setState({ loading: true });
        
        const env = process.env;
        
        fetch(`${env.REACT_APP_API_URL}/movies/${movieId}?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        })
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched movie details:', data);
            // Extract the movie from the response if it exists, otherwise use the whole response
            const movieData = data.movie || data;
            console.log('Movie data keys:', Object.keys(movieData));
            console.log('Image URLs:', {             
                imageurl: movieData.imageurl 
            });
            this.setState({ 
                movie: movieData,
                loading: false,
                error: null
            });
        })
        .catch(err => {
            console.error('Error fetching movie details:', err);
            this.setState({
                loading: false,
                error: err.message
            });
        });
    }

    renderStars(rating) {
        const stars = [];
        const maxStars = 5;
        const ratingNum = parseFloat(rating) || 0;
        
        for (let i = 0; i < maxStars; i++) {
            if (i < ratingNum) {
                stars.push(<BsStarFill key={i} className="text-warning" />);
            } else {
                stars.push(<BsStar key={i} className="text-secondary" />);
            }
        }
        
        return <span>{stars} ({rating})</span>;
    }

    render() {
        const { movie, loading, error } = this.state;

        const DetailInfo = () => {
            if (error) {
                return (
                    <Alert variant="danger">
                        <Alert.Heading>Error Loading Movie</Alert.Heading>
                        <p>
                            There was a problem loading the movie details: {error}
                        </p>
                    </Alert>
                );
            }
            
            if (loading || !movie) {
                return <div className="text-center p-3"><h3>Loading....</h3></div>
            }

            console.log('Rendering movie details:', movie);
            console.log('Image URLs in render:', {
         
                imageurl: movie.imageurl 
            });
            
            // Determine the movie rating from various potential sources
            const movieRating = movie.averageRating || '0';

            return (
                <Card className="text-center shadow-sm">
                    <Card.Header as="h4" className="bg-light">{movie.title}</Card.Header>
                    <Card.Body>
                        <Image 
                            className="mb-3" 
                            src={movie.imageurl || "https://via.placeholder.com/150x225?text=No+Image"} 
                            thumbnail 
                            onError={(e) => {
                                console.log('Image failed to load:', e.target.src);
                                // Fallback to placeholder if image fails to load
                                e.target.src = "https://via.placeholder.com/150x225?text=No+Image";
                            }}
                        />
                        <Card.Title>{this.renderStars(movieRating)}</Card.Title>
                        
                        {movie.actors && movie.actors.length > 0 ? (
                            <div className="mb-3">
                                <h5>Cast</h5>
                                {movie.actors.map((actor, i) => (
                                    <p key={i}><b>{actor.actorName}</b> as <i>{actor.characterName}</i></p>
                                ))}
                            </div>
                        ) : (
                            <div className="mb-3">
                                <h5>Cast</h5>
                                <p className="text-danger fw-bold">No actor information available</p>
                            </div>
                        )}
                        
                        {movie.reviews && movie.reviews.length > 0 ? (
                            <div>
                                <h5>Reviews</h5>
                                {movie.reviews.map((review, i) => (
                                    <p key={i}>
                                        <b>{review.username}</b>&nbsp; {review.review}
                                        &nbsp; {this.renderStars(review.rating)}
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <h5>Reviews</h5>
                                <p className="text-danger fw-bold">No reviews available</p>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )
        }

        return (
            <DetailInfo />
        )
    }
}

export default MovieDetail;

