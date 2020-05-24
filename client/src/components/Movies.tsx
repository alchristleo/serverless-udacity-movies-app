import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createMovie, deleteMovie, getMovies, patchMovie } from '../api/movies-api'
import Auth from '../auth/Auth'
import { Movie } from '../types/Movie'

interface MoviesProps {
  auth: Auth
  history: History
}

interface MoviesState {
  movies: Movie[]
  newMovieName: string
  loadingMovies: boolean
  showAddForm: boolean
  newAddedMovie: {
    name: string
    description: string
    duration: string
    rating: string
  }
}

const MOCK = [{
  attachmentUrl: "https://serverless-movieapp-images-dev.s3.amazonaws.com/google-oauth2%7C106984203500731568145%3A34de8fd0-4145-42b0-a668-a0618c9a3092",
  createdAt: "2020-05-23T19:14:23.424Z",
  description: "",
  done: false,
  duration: "100",
  movieId: "e466e91c-47e6-46d5-8d12-974d4599b25e",
  name: "testing",
  rating: "7.6",
  userId: "google-oauth2|106984203500731568145",
}, {
  attachmentUrl: "https://serverless-movieapp-images-dev.s3.amazonaws.com/google-oauth2%7C106984203500731568145%3A34de8fd0-4145-42b0-a668-a0618c9a3092",
  createdAt: "2020-05-23T19:14:23.424Z",
  description: "",
  done: false,
  duration: "100",
  movieId: "e466e91c-47e6-46d5-8d12-974d4599b25e",
  name: "testing",
  rating: "7.6",
  userId: "google-oauth2|106984203500731568145",
}, {
  attachmentUrl: "https://serverless-movieapp-images-dev.s3.amazonaws.com/google-oauth2%7C106984203500731568145%3A34de8fd0-4145-42b0-a668-a0618c9a3092",
  createdAt: "2020-05-23T19:14:23.424Z",
  description: "",
  done: false,
  duration: "100",
  movieId: "e466e91c-47e6-46d5-8d12-974d4599b25e",
  name: "testing",
  rating: "7.6",
  userId: "google-oauth2|106984203500731568145",
}, {
  attachmentUrl: "https://serverless-movieapp-images-dev.s3.amazonaws.com/google-oauth2%7C106984203500731568145%3A34de8fd0-4145-42b0-a668-a0618c9a3092",
  createdAt: "2020-05-23T19:14:23.424Z",
  description: "",
  done: false,
  duration: "100",
  movieId: "e466e91c-47e6-46d5-8d12-974d4599b25e",
  name: "testing",
  rating: "7.6",
  userId: "google-oauth2|106984203500731568145",
}, {
  attachmentUrl: "https://serverless-movieapp-images-dev.s3.amazonaws.com/google-oauth2%7C106984203500731568145%3A34de8fd0-4145-42b0-a668-a0618c9a3092",
  createdAt: "2020-05-23T19:14:23.424Z",
  description: "",
  done: false,
  duration: "100",
  movieId: "e466e91c-47e6-46d5-8d12-974d4599b25e",
  name: "testing",
  rating: "7.6",
  userId: "google-oauth2|106984203500731568145",
}, {
  attachmentUrl: "https://serverless-movieapp-images-dev.s3.amazonaws.com/google-oauth2%7C106984203500731568145%3A34de8fd0-4145-42b0-a668-a0618c9a3092",
  createdAt: "2020-05-23T19:14:23.424Z",
  description: "",
  done: false,
  duration: "100",
  movieId: "e466e91c-47e6-46d5-8d12-974d4599b25e",
  name: "testing",
  rating: "7.6",
  userId: "google-oauth2|106984203500731568145",
}, {
  attachmentUrl: "https://serverless-movieapp-images-dev.s3.amazonaws.com/google-oauth2%7C106984203500731568145%3A34de8fd0-4145-42b0-a668-a0618c9a3092",
  createdAt: "2020-05-23T19:14:23.424Z",
  description: "",
  done: false,
  duration: "100",
  movieId: "e466e91c-47e6-46d5-8d12-974d4599b25e",
  name: "testing",
  rating: "7.6",
  userId: "google-oauth2|106984203500731568145",
}, {
  attachmentUrl: "https://serverless-movieapp-images-dev.s3.amazonaws.com/google-oauth2%7C106984203500731568145%3A34de8fd0-4145-42b0-a668-a0618c9a3092",
  createdAt: "2020-05-23T19:14:23.424Z",
  description: "",
  done: false,
  duration: "100",
  movieId: "e466e91c-47e6-46d5-8d12-974d4599b25e",
  name: "testing",
  rating: "7.6",
  userId: "google-oauth2|106984203500731568145",
}, {
  attachmentUrl: "https://serverless-movieapp-images-dev.s3.amazonaws.com/google-oauth2%7C106984203500731568145%3A34de8fd0-4145-42b0-a668-a0618c9a3092",
  createdAt: "2020-05-23T19:14:23.424Z",
  description: "",
  done: false,
  duration: "100",
  movieId: "e466e91c-47e6-46d5-8d12-974d4599b25e",
  name: "testing",
  rating: "7.6",
  userId: "google-oauth2|106984203500731568145",
}, {
  attachmentUrl: "https://serverless-movieapp-images-dev.s3.amazonaws.com/google-oauth2%7C106984203500731568145%3A34de8fd0-4145-42b0-a668-a0618c9a3092",
  createdAt: "2020-05-23T19:14:23.424Z",
  description: "",
  done: false,
  duration: "100",
  movieId: "e466e91c-47e6-46d5-8d12-974d4599b25e",
  name: "testing",
  rating: "7.6",
  userId: "google-oauth2|106984203500731568145",
}];

export class Movies extends React.PureComponent<MoviesProps, MoviesState> {
  state: MoviesState = {
    movies: [],
    newMovieName: '',
    loadingMovies: true,
    showAddForm: false,
    newAddedMovie: {
      name: '',
      description: '',
      duration: '',
      rating: '',
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newMovieName: event.target.value })
  }

  handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newAddedMovie: { ...this.state.newAddedMovie, [event.target.name]: event.target.value } })
  }

  onEditButtonClick = (movieId: string) => {
    this.props.history.push(`/movies/${movieId}/edit`)
  }

  onMovieCreate = async (event: any) => {
    const { newAddedMovie } = this.state;
    const { name, description, duration, rating } = newAddedMovie;

    if (name || description || duration || rating) {
      try {
        const newMovie = await createMovie(this.props.auth.getIdToken(), {
          name: name,
          description: description,
          duration: duration,
          rating: rating,
        })
        this.setState({
          movies: [...this.state.movies, newMovie],
          newMovieName: '',
          showAddForm: false,
          newAddedMovie: {
            name: '',
            description: '',
            duration: '',
            rating: '',
          }
        })
        alert('Movie created!')
      } catch {
        alert('Movie creation failed')
      }
    } else {
      alert('Fill all the input bro!');
    }
  }

  onMovieDelete = async (movieId: string) => {
    try {
      await deleteMovie(this.props.auth.getIdToken(), movieId)
      this.setState({
        movies: this.state.movies.filter(movie => movie.movieId != movieId)
      })
    } catch {
      alert('Movies deletion failed')
    }
  }

  onMovieCheck = async (pos: number) => {
    try {
      const movie = this.state.movies[pos]
      await patchMovie(this.props.auth.getIdToken(), movie.movieId, {
        name: movie.name,
        done: !movie.done
      })
      this.setState({
        movies: update(this.state.movies, {
          [pos]: { done: { $set: !movie.done } }
        })
      })
    } catch {
      alert('Movies deletion failed')
    }
  }

  onToggleShowNewForm = (): any => {
    this.setState({ showAddForm: true });
  }

  async componentDidMount() {
    try {
      const movies = await getMovies(this.props.auth.getIdToken())
      this.setState({
        movies,
        loadingMovies: false
      })
    } catch (e) {
      alert(`Failed to fetch movies: ${e.message}`)
    }
  }

  componentDidUpdate() {
    if (this.state.showAddForm) {
      const el: HTMLInputElement = document.getElementById('inputForm') as HTMLInputElement;
      window.scrollTo({ top: el.offsetTop });
    }
  }

  render() {
    const { loadingMovies } = this.state;
    return (
      <div>
        <Header as="h1">MovieQ</Header>

        {this.renderMovies()}
        {!loadingMovies && this.renderCreateMovieInput()}
        {this.renderNewForm()}
      </div>
    )
  }

  renderCreateMovieInput() {
    return (
      <div style={{ textAlign: 'center', margin: '1.5rem' }}>
        <Button onClick={this.onToggleShowNewForm} size="massive" color="linkedin">
          Add Movie to Queue
        </Button>
      </div>
    );
  }

  renderMovies() {
    if (this.state.loadingMovies) {
      return this.renderLoading()
    }

    return this.renderMoviesList()
  }

  renderNewForm() {
    if (!this.state.showAddForm) return null;

    return (
      <div id="inputForm" style={{ paddingTop: '10rem' }}>
        <Input
          fluid
          name="name"
          placeholder="Movie Name..."
          onChange={this.handleOnChange}
        />
        <Input
          fluid
          name="description"
          placeholder="Movie Description"
          onChange={this.handleOnChange}
        />
        <Input
          fluid
          name="duration"
          placeholder="Movie Duration"
          onChange={this.handleOnChange}
        />
        <Input
          fluid
          name="rating"
          placeholder="Movie Rating"
          onChange={this.handleOnChange}
        />
        <div style={{ textAlign: 'center', margin: '1.5rem' }}>
          <Button onClick={this.onMovieCreate} size="huge" color="linkedin">
            Submit
          </Button>
        </div>
      </div>
    );
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Movies
        </Loader>
      </Grid.Row>
    )
  }

  renderMoviesList() {
    return (
      <div>
        <hgroup style={{ fontSize: '1.5rem', lineHeight: '1.2em', marginBottom: '1rem', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ background: 'whitesmoke', left: '0 1rem', alignSelf: 'flex-start', position: 'absolute', height: '1.2em', top: '-0.2em', width: '4px' }}></span>
            <h3 style={{ paddingLeft: '0.75rem', fontSize: '1.5rem' }}>My Movies Watching Queue Lists</h3>
          </div>
          <div>Click edit icon or delete button to customize the list</div>
        </hgroup>
        <div style={{ position: 'relative', overflowX: 'hidden', overscrollBehaviorX: 'contain' }}>
          <div style={{ gridGap: '1.5rem', gridTemplateColumns: 'repeat(1000, calc(8.33333% - .91667 * 1.5rem - 0rem))', transition: 'left .5s ease-out', position: 'relative', minHeight: '4rem', overflow: 'auto', scrollBehavior: 'smooth', flexWrap: 'nowrap', display: 'grid', justifyItems: 'stretch' }}>
            {this.state.movies.map((movie, pos) => {
              return (
                <div style={{ backgroundColor: 'whitesmoke', gridColumn: 'span 2', minWidth: 'auto', marginRight: '0', width: '100%' , boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)', display: 'inline-flex', flexDirection: 'column', position: 'relative', paddingBottom: '1rem', marginBottom: '.25rem' }}>
                  <div style={{ gridColumn: 'span 2', minWidth: 'auto', display: 'inline-flex', position: 'relative', textDecoration: 'none', marginRight: '0', marginBottom: '0.75rem', width: '100%' }}>
                    <div style={{ width: '100%', minWidth: 'auto', display: 'inline-flex', overflow: 'hidden', position: 'relative' }}>
                      <img src={movie.attachmentUrl} style={{ width: '100%', bottom: '0', left: '0', margin: 'auto', right: '0', top: '0', verticalAlign: 'middle' }} />
                    </div>
                  </div>
                  <div style={{ padding: '0 0.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', minHeight: '1.5rem' }}>
                      <span style={{ marginRight: '0.75rem', display: 'inline-flex', alignItems: 'baseline' }}>
                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" style={{ height: '0.8em', width: '1em', marginRight: '0.15em' }} viewBox="0 0 24 24" fill="#000" role="presentation">
                          <path d="M12 20.1l5.82 3.682c1.066.675 2.37-.322 2.09-1.584l-1.543-6.926 5.146-4.667c.94-.85.435-2.465-.799-2.567l-6.773-.602L13.29.89a1.38 1.38 0 0 0-2.581 0l-2.65 6.53-6.774.602C.052 8.126-.453 9.74.486 10.59l5.147 4.666-1.542 6.926c-.28 1.262 1.023 2.26 2.09 1.585L12 20.099z"></path>
                        </svg>{movie.rating}
                      </span>
                      <span style={{ position: 'absolute', right: '5%' }}>{movie.duration} mins</span>
                    </div>
                  </div>
                  <a style={{ height: '2.5rem', padding: '0 0.5rem', position: 'relative', color: 'inherit', textDecoration: 'none', fontSize: '1.5rem' }}>{movie.name}</a>
                  <a style={{ height: '1rem', padding: '0 0.5rem', position: 'relative', color: 'inherit', textDecoration: 'none', fontSize: '0.75rem', marginBottom: '10px', marginTop: '10px' }}>{movie.description.length > 30 ? movie.description.slice(0,30) + '...' : movie.description}</a>
                  <div style={{ paddingTop: '0.75rem', padding: '0 0.5rem', position: 'relative' }}>
                    <Button onClick={() => this.onMovieDelete(movie.movieId)} icon color="red">
                      <Icon name="delete" /> Remove from List 
                    </Button>
                  </div>
                  <div style={{ textAlign: 'center', position: 'absolute', top: '0', left: '0', zIndex: 3, backgroundColor: 'whitesmoke', width: '40px', height: '40px', cursor: 'pointer' }}>
                    <Icon name="pencil" size="big" onClick={() => this.onEditButtonClick(movie.movieId)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
}
