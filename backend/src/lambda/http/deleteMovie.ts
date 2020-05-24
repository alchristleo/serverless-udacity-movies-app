import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { deleteMovie } from '../../businessLogic/movies'
import { parseAuthorizationHeader } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteMovie')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const movieId = event.pathParameters.movieId
  if (!movieId) {
    logger.info("movieId is not provided")
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Please provide movie id in the url path"
      })
    }
  }

  const jwtToken = parseAuthorizationHeader(event.headers.Authorization)
  await deleteMovie(movieId, jwtToken)

  logger.info("deleted movie", movieId)

  return {
    statusCode: 200,
    body: null
  }
})

handler.use(cors())