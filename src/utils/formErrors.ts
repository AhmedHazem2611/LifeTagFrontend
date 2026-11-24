/**
 * Extracts a human-readable validation message from ASP.NET ApiResponse or ValidationProblemDetails payloads.
 */
export function extractApiErrorMessage(result: any, fallback: string): string {
  if (!result || typeof result !== 'object') return fallback;

  const errorsObj = result.errors ?? result.Errors;
  if (errorsObj && typeof errorsObj === 'object') {
    const messages = Object.values(errorsObj)
      .flatMap((val) => (Array.isArray(val) ? val : [val]))
      .map((msg) => String(msg).trim())
      .filter(Boolean);
    if (messages.length > 0) {
      return messages.join(' ');
    }
  }

  return result.message || result.Message || result.title || result.Title || fallback;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
