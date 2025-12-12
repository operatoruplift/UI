import { API_INTERFACE, API_ENDPOINT } from '@/config/static'
import { getSupabase } from '@/lib/supabase'
import { withAuth } from '@/store/authStore'

// Response interfaces
export interface ChatSuccessResponse {
  success: true
  response: string
  device_id: string
}

export interface ChatErrorResponse {
  error: string
}

export type ChatResponse = ChatSuccessResponse | ChatErrorResponse

// Streaming callback type
export type StreamChunkCallback = (chunk: string) => void
export type StreamErrorCallback = (error: Error) => void

// Clear history response interfaces
export interface ClearHistorySuccessResponse {
  success: true
  message?: string
}

export interface ClearHistoryErrorResponse {
  error: string
}

export type ClearHistoryResponse = ClearHistorySuccessResponse | ClearHistoryErrorResponse

/**
 * Send a chat message to the API with streaming response (Server-Sent Events)
 * @param message - The message to send
 * @param deviceId - The device ID to include in the request
 * @param onChunk - Callback function called for each chunk of the streamed response
 * @param onError - Optional callback function called on error
 * @returns Promise that resolves when streaming is complete, or throws an error
 */
export const sendChatMessage = async (
  message: string,
  deviceId: string,
  onChunk: StreamChunkCallback,
  onError?: StreamErrorCallback
): Promise<void> => {

  try {
    // NOTE: We use fetch instead of axios for Server-Sent Events (SSE) streaming
    // because:
    // 1. Axios doesn't natively support SSE streaming - it would require accessing
    //    the underlying response stream anyway
    // 2. Fetch's ReadableStream API is the standard way to handle SSE in browsers
    // 3. We still use the same auth token logic as axios interceptors for consistency

    // Get auth token from Supabase session


    // Make streaming request using fetch (required for SSE) with longer timeout
    const controller = new AbortController();
    // const timeoutId = setTimeout(() => controller.abort(), 300000); // 30 seconds

    try {

      const fetchResponse = await withAuth(async (_, token) =>
        fetch(`${API_ENDPOINT}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            message,
            device_id: deviceId,
          }),
          signal: controller.signal,
        })
      );

      // clearTimeout(timeoutId);

      if (!fetchResponse.ok) {
        // Try to parse error response
        let errorMessage = fetchResponse.statusText || `HTTP error! status: ${fetchResponse.status}`;
        try {
          const errorData = await fetchResponse.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // If JSON parsing fails, use status text or default message
          if (fetchResponse.status === 504 || errorMessage.includes('Gateway Time-out')) {
            errorMessage = "Looks like I'm unable to connect with your system. The server is taking too long to respond. Please try again in a moment.";
          } else if (fetchResponse.status === 503) {
            errorMessage = "The service is temporarily unavailable. Please try again in a moment.";
          } else if (fetchResponse.status === 500) {
            errorMessage = "Something went wrong on our end. Please try again in a moment.";
          } else if (fetchResponse.status === 401) {
            errorMessage = "Your session has expired. Please log in again.";
          } else if (fetchResponse.status === 403) {
            errorMessage = "You don't have permission to perform this action. Please contact support if this persists.";
          } else if (fetchResponse.status >= 500) {
            errorMessage = "Something went wrong on our end. Please try again in a moment.";
          } else if (fetchResponse.status >= 400) {
            errorMessage = "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";
          }
        }
        throw new Error(errorMessage);
      }

      // Check if response is streaming (text/event-stream or text/plain)
      const contentType = fetchResponse.headers.get('content-type') || '';

      if (!contentType.includes('text/event-stream') && !contentType.includes('text/plain')) {
        // Fallback to non-streaming response
        const data = await fetchResponse.json();
        if ('error' in data) {
          throw new Error(data.error);
        }
        if ('success' in data && data.success === true && data.response) {
          onChunk(data.response);
          return;
        }
        throw new Error('Unexpected response format from chat API');
      }

      // Read the stream with timeout protection
      const reader = fetchResponse.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let lastChunkTime = Date.now();
      const STREAM_TIMEOUT = 60000; // 60 seconds without data = timeout

      while (true) {
        // Check for stream timeout
        const now = Date.now();
        if (now - lastChunkTime > STREAM_TIMEOUT) {
          reader.cancel();
          throw new Error("Looks like I'm unable to connect with your system. The connection was interrupted. Please try again.");
        }

        // Read chunk
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        lastChunkTime = Date.now();

        // Decode chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE events in buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmedLine = line.trim();

          // Skip empty lines and comments
          if (!trimmedLine || trimmedLine.startsWith(':')) {
            continue;
          }

          // Parse SSE format: "data: <content>"
          if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6); // Remove "data: " prefix

            // Handle JSON data
            if (data.startsWith('{') || data.startsWith('[')) {
              try {
                const parsed = JSON.parse(data);
                if (parsed.error) {
                  // Convert technical errors to friendly messages
                  let friendlyError = parsed.error;
                  if (typeof friendlyError === 'string') {
                    if (friendlyError.includes('timeout') || friendlyError.includes('Timeout') || friendlyError.includes('Gateway Time-out') || friendlyError.includes('504')) {
                      friendlyError = "Looks like I'm unable to connect with your system. The server is taking too long to respond. Please try again in a moment.";
                    } else if (friendlyError.includes('503') || friendlyError.includes('Service Unavailable')) {
                      friendlyError = "The service is temporarily unavailable. Please try again in a moment.";
                    } else if (friendlyError.includes('500') || friendlyError.includes('Internal Server Error')) {
                      friendlyError = "Something went wrong on our end. Please try again in a moment.";
                    } else if (friendlyError.includes('401') || friendlyError.includes('Unauthorized')) {
                      friendlyError = "Your session has expired. Please log in again.";
                    } else if (friendlyError.includes('NetworkError') || friendlyError.includes('Failed to fetch')) {
                      friendlyError = "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";
                    }
                  }
                  throw new Error(friendlyError);
                }
                if (parsed.content || parsed.text || parsed.chunk) {
                  onChunk(parsed.content || parsed.text || parsed.chunk);
                } else if (typeof parsed === 'string') {
                  onChunk(parsed);
                }
              } catch {
                // If JSON parsing fails, treat as plain text
                onChunk(data);
              }
            } else {
              // Plain text data
              onChunk(data);
            }
          } else if (trimmedLine.startsWith('error: ')) {
            // Handle error events
            const errorMsg = trimmedLine.slice(7);
            // Convert technical errors to friendly messages
            let friendlyError = errorMsg;
            if (errorMsg.includes('timeout') || errorMsg.includes('Timeout') || errorMsg.includes('Gateway Time-out') || errorMsg.includes('504')) {
              friendlyError = "Looks like I'm unable to connect with your system. The server is taking too long to respond. Please try again in a moment.";
            } else if (errorMsg.includes('503') || errorMsg.includes('Service Unavailable')) {
              friendlyError = "The service is temporarily unavailable. Please try again in a moment.";
            } else if (errorMsg.includes('500') || errorMsg.includes('Internal Server Error')) {
              friendlyError = "Something went wrong on our end. Please try again in a moment.";
            } else if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
              friendlyError = "Your session has expired. Please log in again.";
            } else if (errorMsg.includes('NetworkError') || errorMsg.includes('Failed to fetch')) {
              friendlyError = "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";
            }
            throw new Error(friendlyError);
          }
        }
      }

      // Process any remaining data in buffer
      if (buffer.trim()) {
        const trimmed = buffer.trim();
        if (trimmed.startsWith('data: ')) {
          onChunk(trimmed.slice(6));
        } else if (!trimmed.startsWith(':')) {
          onChunk(trimmed);
        }
      }
    } catch (fetchError: any) {
      // clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        // Friendly timeout message
        const friendlyError = new Error("Looks like I'm unable to connect with your system. Please check your internet connection and try again.");
        if (onError) {
          onError(friendlyError);
        } else {
          throw friendlyError;
        }
        return;
      }
      throw fetchError;
    }
  } catch (error: any) {
    // Convert technical error messages to friendly ones
    let friendlyMessage = error?.message || 'Failed to send chat message';

    // Map common technical errors to friendly messages
    if (friendlyMessage.includes('timeout') || friendlyMessage.includes('Timeout')) {
      friendlyMessage = "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";
    } else if (friendlyMessage.includes('Gateway Time-out') || friendlyMessage.includes('504')) {
      friendlyMessage = "Looks like I'm unable to connect with your system. The server is taking too long to respond. Please try again in a moment.";
    } else if (friendlyMessage.includes('NetworkError') || friendlyMessage.includes('Failed to fetch')) {
      friendlyMessage = "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";
    } else if (friendlyMessage.includes('401') || friendlyMessage.includes('Unauthorized')) {
      friendlyMessage = "Your session has expired. Please log in again.";
    } else if (friendlyMessage.includes('403') || friendlyMessage.includes('Forbidden')) {
      friendlyMessage = "You don't have permission to perform this action. Please contact support if this persists.";
    } else if (friendlyMessage.includes('500') || friendlyMessage.includes('Internal Server Error')) {
      friendlyMessage = "Something went wrong on our end. Please try again in a moment.";
    } else if (friendlyMessage.includes('503') || friendlyMessage.includes('Service Unavailable')) {
      friendlyMessage = "The service is temporarily unavailable. Please try again in a moment.";
    }

    if (onError) {
      onError(new Error(friendlyMessage));
    } else {
      throw new Error(friendlyMessage);
    }
  }
}

/**
 * Clear all chat history and memory data for the authenticated user
 * @returns Promise that resolves when history is cleared, or throws an error
 */
export const clearChatHistory = async (): Promise<void> => {
  try {
    const response = await API_INTERFACE.delete<ClearHistoryResponse>('/clear-history')

    // Check if response is a success response
    if ('success' in response.data && response.data.success === true) {
      return
    }

    // Check if response is an error response
    if ('error' in response.data) {
      throw new Error(response.data.error)
    }

    // Fallback: if response structure is unexpected
    throw new Error('Unexpected response format from clear-history API')
  } catch (error: any) {
    // Handle axios errors
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }

    // Handle network errors or other issues
    if (error.message) {
      throw new Error(error.message)
    }

    throw new Error('Failed to clear chat history')
  }
}

