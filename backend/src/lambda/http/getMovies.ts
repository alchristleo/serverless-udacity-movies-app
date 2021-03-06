import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllMovies } from '../../businessLogic/movies'
import { parseAuthorizationHeader } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getMovies')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const jwtToken = parseAuthorizationHeader(event.headers.Authorization)

    const items = await getAllMovies(jwtToken)
    logger.info("Get movies", items)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      }, null, 2)
    }
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: error.message
      })
    }
  }

})

handler.use(cors())
