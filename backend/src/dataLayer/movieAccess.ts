import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS) as any

import { MovieItem } from '../models/MovieItem'
import { MovieUpdate } from '../models/MovieUpdate'

const logger = createLogger('movieAccess')

export class MovieAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly moviesTable = process.env.MOVIES_TABLE) { }


    async getAllMovies(userId: string): Promise<MovieItem[]> {
        logger.info('Getting Movies for userId', userId)

        const result = await this.docClient.query({
            TableName: this.moviesTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items;
        return items as MovieItem[]
    }


    async createMovie(movie: MovieItem): Promise<MovieItem> {
        logger.info('Creating Movies for userId', movie.userId)

        await this.docClient.put({
            TableName: this.moviesTable,
            Item: movie
        }).promise()

        return movie
    }

    async updateMovie(movieId: string, movie: MovieUpdate, userId: string): Promise<MovieUpdate> {
        logger.info('Updating Movies for userId and movieId', userId, movieId)
        await this.docClient.update({
            TableName: this.moviesTable,
            Key: {
                movieId,
                userId
            },
            UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ExpressionAttributeValues: {
                ":name": movie.name,
                ":done": movie.done
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()

        return movie

    }

    async updateMovieImageUrl(imageUrl: string, userId: string, movieId: string): Promise<any> {
        logger.info('Updating Movies attachmentUrl for userId and movieId', userId, movieId, imageUrl)
        await this.docClient.update({
            TableName: this.moviesTable,
            Key: {
                movieId,
                userId
            },
            UpdateExpression: "set attachmentUrl = :imageUrl",
            ExpressionAttributeValues: {
                ":imageUrl": imageUrl
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()

        return null

    }

    async deleteMovie(movieId: string, userId: string): Promise<any> {
        logger.info('deleting Movies for userId and movieId', userId, movieId)

        await this.docClient.delete({
            TableName: this.moviesTable,
            Key: {
                movieId,
                userId
            }
        }).promise()
        return null
    }

}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        logger.info('Creating local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}