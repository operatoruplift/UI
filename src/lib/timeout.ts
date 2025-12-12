/**
 * Utility functions for handling timeouts in async operations
 */

/**
 * Create a promise that rejects after a specified timeout
 */
export const createTimeout = (ms: number, message = 'Operation timed out'): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
};

/**
 * Wrap a promise with a timeout
 * @param promise - The promise to wrap
 * @param ms - Timeout in milliseconds
 * @param message - Optional timeout error message
 */
export const withTimeout = <T>(
  promise: Promise<T>,
  ms: number,
  message = 'Operation timed out'
): Promise<T> => {
  return Promise.race([
    promise,
    createTimeout(ms, message)
  ]);
};

/**
 * Retry a function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
  maxDelay = 10000
): Promise<T> => {
  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries - 1) {
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, maxDelay);
      }
    }
  }

  throw lastError!;
};

