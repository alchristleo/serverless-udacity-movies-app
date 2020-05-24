import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { parseAuthorizationHeader, parseUserId } from '../../auth/utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateSignedURL')

const XAWS = AWSXRay.captureAWS(AWS)
const bucketName = process.env.IMAGES_S3_BUCKET
// const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

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
  const userId = parseUserId(jwtToken)

  logger.info('Generating signed url for userId with movieId', userId, movieId)

  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: `${userId}:${movieId}`,
    Expires: 300
  })

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl
    }, null, 2)
  }
})

handler.use(cors())

