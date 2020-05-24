import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateMovieRequest } from '../../requests/CreateMovieRequest'
import { createMovie } from '../../businessLogic/movies';
import { parseAuthorizationHeader } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createMovie')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newMovie: CreateMovieRequest = JSON.parse(event.body)

  const jwtToken = parseAuthorizationHeader(event.headers.Authorization)
  const item = await createMovie(newMovie, jwtToken)

  logger.info("Created new movie", item)

  return {
    statusCode: 200,
    body: JSON.stringify({
      item
    }, null, 2)
  }
})

handler.use(cors())
