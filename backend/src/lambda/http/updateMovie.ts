import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { UpdateMovieRequest } from '../../requests/UpdateMovieRequest'
import { updateMovie } from '../../businessLogic/movies'
import { parseAuthorizationHeader } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateMovie')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const movieId = event.pathParameters.movieId
  const updatedMovie: UpdateMovieRequest = JSON.parse(event.body)
  const jwtToken = parseAuthorizationHeader(event.headers.Authorization)
  const movieUpdate = await updateMovie(movieId, updatedMovie, jwtToken)

  logger.info('updated movie', movieUpdate)
  return {
    statusCode: 200,
    body: JSON.stringify({
      item: movieUpdate
    }, null, 2)
  }
})

handler.use(cors())
