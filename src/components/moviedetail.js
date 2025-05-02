import React, { Component } from 'react';
import { fetchMovie } from "../actions/movieActions";
import {connect} from 'react-redux';
import {Card, Alert} from 'react-bootstrap';
import { BsStarFill, BsStar } from 'react-icons/bs'
import { Image } from 'react-bootstrap';

class MovieDetail extends Component {

    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null) {
            dispatch(fetchMovie(this.props.movieId));
        }
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
        const DetailInfo = () => {
            if (this.props.error) {
                return (
                    <Alert variant="danger">
                        <Alert.Heading>Error Loading Movie</Alert.Heading>
                        <p>
                            There was a problem loading the movie details. You may need to log in again.
                        </p>
                    </Alert>
                );
            }
            
            if (!this.props.selectedMovie) {
                return <div>Loading....</div>
            }

            return (
                <Card className="text-center shadow-sm">
                    <Card.Header as="h4" className="bg-light">{this.props.selectedMovie.title}</Card.Header>
                    <Card.Body>
                        <Image 
                            className="mb-3" 
                            src={this.props.selectedMovie.imageUrl || "https://via.placeholder.com/150x225?text=No+Image"} 
                            thumbnail 
                        />
                        <Card.Title>{this.renderStars(this.props.selectedMovie.avgRating)}</Card.Title>
                        
                        {this.props.selectedMovie.actors && this.props.selectedMovie.actors.length > 0 ? (
                            <div className="mb-3">
                                <h5>Cast</h5>
                                {this.props.selectedMovie.actors.map((actor, i) => (
                                    <p key={i}><b>{actor.actorName}</b> as <i>{actor.characterName}</i></p>
                                ))}
                            </div>
                        ) : (
                            <div className="mb-3">
                                <h5>Cast</h5>
                                <p className="text-danger fw-bold">No actor information available</p>
                            </div>
                        )}
                        
                        {this.props.selectedMovie.reviews && this.props.selectedMovie.reviews.length > 0 ? (
                            <div>
                                <h5>Reviews</h5>
                                {this.props.selectedMovie.reviews.map((review, i) => (
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

const mapStateToProps = state => {
    return {
        selectedMovie: state.movie.selectedMovie,
        error: state.movie.error
    }
}

export default connect(mapStateToProps)(MovieDetail);

