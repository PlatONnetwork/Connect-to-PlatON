import { notification } from 'antd'

const EXCEPTION_MAP = {
  '4001': 'User denied the action',
  '4100': 'Unauthorized: The requested method and/or account has not been authorized by the user.',
  '4200': 'Unsupported Method: The Provider does not support the requested method.',
  '4900': 'Disconnected: The Provider is disconnected from all chains.',
  '4901': 'Chain Disconnected: The Provider is not connected to the requested chain.',
  '-32700': 'Parse error: Invalid JSON',
  '-32600': 'Invalid request:	JSON is not a valid request object',
  '-32601': 'Method not found: Method does not exist',
  '-32602': 'Invalid params: Invalid method parameters',
  '-32603': 'Internal error: Internal JSON-RPC error',
  '-32002': 'Metamask has pending request, please wait for processing',
  '-1': 'User account unavailable',
}

const errorHandler = error => {
  let errMessage
  if (error.code) {
    errMessage = EXCEPTION_MAP[error.code]
  } else {
    errMessage = error?.message || JSON.stringify(error)
  }

  return notification.error({ message: 'Failed', description: errMessage })
}

export default errorHandler
