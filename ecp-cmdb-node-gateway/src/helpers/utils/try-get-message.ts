export function tryGetMessage(body: unknown, messageKey = 'message') {
  if (typeof body === 'object' && body !== null && messageKey in body) {
    // is safe to access 'message' of body
    return (body as any)[messageKey]
  }

  return ''
}
