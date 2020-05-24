import * as uuid from 'uuid'

import { MovieItem } from '../models/MovieItem'
import { MovieUpdate } from '../models/MovieUpdate'
import { MovieAccess } from '../dataLayer/movieAccess'
import { CreateMovieRequest } from '../requests/CreateMovieRequest'
import { UpdateMovieRequest } from '../requests/UpdateMovieRequest'
import { parseUserId } from '../auth/utils'

const movieAccess = new MovieAccess()

export async function getAllMovies(jwtToken: string): Promise<MovieItem[]> {
    const userid = parseUserId(jwtToken)
    return movieAccess.getAllMovies(userid)
}

export async function createMovie(
    createMovieRequest: CreateMovieRequest,
    jwtToken: string
): Promise<MovieItem> {
    const movieId = uuid.v4()
    const userId = parseUserId(jwtToken)

    return await movieAccess.createMovie({
        movieId: movieId,
        userId: userId,
        name: createMovieRequest.name,
        description: createMovieRequest.description,
        duration: createMovieRequest.duration,
        rating: createMovieRequest.rating,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: '',
    })
}

export async function updateMovie(
    movieId: string,
    updateMovieRequest: UpdateMovieRequest,
    jwtToken: string
): Promise<MovieUpdate> {
    const userId = parseUserId(jwtToken)

    return await movieAccess.updateMovie(movieId, {
        name: updateMovieRequest.name,
        done: updateMovieRequest.done,
    }, userId)
}

export async function updateMovieImageUrl(imageUrl: string, userId: string, movieId: string): Promise<any> {
    return movieAccess.updateMovieImageUrl(imageUrl, userId, movieId)
}

export async function deleteMovie(
    movieId: string,
    jwtToken: string
): Promise<any> {
    const userId = parseUserId(jwtToken)
    return await movieAccess.deleteMovie(movieId, userId)
}