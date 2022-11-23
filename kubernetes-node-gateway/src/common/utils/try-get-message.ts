export function tryGetMessage(body: unknown) {
  if (typeof body === 'object' && body !== null && 'message' in body) {
    // is safe to access 'message' of body
    return (body as any).message
  }

  return ''
}
