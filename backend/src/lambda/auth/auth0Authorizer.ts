import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')
const cert = `-----BEGIN CERTIFICATE-----
MIIC/zCCAeegAwIBAgIJbXvgIR5N5FBoMA0GCSqGSIb3DQEBCwUAMB0xGzAZBgNV
BAMTEmFsY2hyaXN0LmF1dGgwLmNvbTAeFw0xNzA0MjYxNzUyMzZaFw0zMTAxMDMx
NzUyMzZaMB0xGzAZBgNVBAMTEmFsY2hyaXN0LmF1dGgwLmNvbTCCASIwDQYJKoZI
hvcNAQEBBQADggEPADCCAQoCggEBAO8rAHmTv7YkA7SgicMkn1NQK8RTTtSqms+R
vBFlu22nrE+MYiZW0lXRJESVWVCsNqscgu/hIZISb7YdlMh5SVXLG0tMwit9NRRI
evS/nJ4YYfaOwW11wW8DW9t5kp/SVbyNtFzQZYbp4qv/hFva299GkiUDQpjOyxe5
snf+p1+08vfZIc4ACoGRzV0T32VzBYieZmlhn2G7PE/YUvRulkCpn+tR6DSWOHZ5
88tpvX/qSvEoGzyxJcm6y+8MpAe/gZt0ijPpOy/zgF3rZbw148YAYOGn8HIRoCu2
NVc8RrC2rOJYR++q/shSGlvMjIAmUAu44iyzZtymlZplUqSRlXMCAwEAAaNCMEAw
DwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUq2jQYIfeNs5nEaAag/ILfgM9JBww
DgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQA3l0kj8Xw+OzpWwEgz
0e+3Fsxqluy0LbmZZRUOLRgE264ek6bT41TDDFxGLZRn1JbBQBk5nKYOjAO/j9J4
CsVp4jNdEqtLzZa+MBeasGew5RFooCdTqdf0Sl2pArsUOUaf+L46Cbzss2LitRQg
0J6SdzFk8LxCNdYIYa8eXAtBR+MGP9PyVYUjqmsaJSp+5eHZHgLiNqwwwqao7MVE
hKSaP17mepzZH+txHs8A/iEmLsyui3O7EhwFVFukVF4lmdtKXJ3fHd3eAlG99US6
ov227PyZ+4HsUBujqGc9zHTOzYR+DbooyQeOb67bbeFa8NsxrXps9NDAQXUgzlK8
mLAk
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}


function verifyToken(authHeader: string): JwtPayload {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(
    token,           // Token from an HTTP header to validate
    cert,            // A certificate copied from Auth0 website
    { algorithms: ['RS256'] } // We need to specify that we use the RS256 algorithm
  ) as JwtPayload;
}