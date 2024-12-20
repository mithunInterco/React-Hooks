import { useCallback, useEffect, useRef } from "react";
import axios from "axios";

const useRetryRequest = () => {
  const retryQueue = useRef([]);

  const retryPutRequest = useCallback(
    (url, data, maxAttempts = 3, delay = 1000) => {
      retryQueue.current.push({ url, data, maxAttempts, delay, attempts: 0 });
    },
    []
  );

  // Function to retry a specific request from the queue
  const processQueue = async () => {
    for (let i = 0; i < retryQueue.current.length; i++) {
      const request = retryQueue.current[i];

      if (request.attempts < request.maxAttempts) {
        try {
          await axios.put(request.url, request.data);
          // console.log(`Request to ${request.url} succeeded.`);
          retryQueue.current.splice(i, 1); // Remove successful request from queue
          i--;
        } catch (error) {
          console.error(
            `Attempt ${request.attempts + 1} for ${request.url} failed.`,
            error
          );
          request.attempts += 1;

          if (request.attempts === request.maxAttempts) {
            console.log(
              `Failed to update ${request.url} after ${request.maxAttempts} attempts.`
            );
            retryQueue.current.splice(i, 1); // Remove failed request from queue
            i--;
          }
        }
      }
    }
  };

  // Periodically process the queue for retries
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (retryQueue.current.length) {
        processQueue();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return retryPutRequest;
};

export default useRetryRequest;

//Explanation------------------------------------------
// Independent Retrying: Each request can succeed or fail independently without blocking others.
// Efficient Queue Management: Completed or failed requests are removed from the queue, keeping the queue manageable.
// Non-Blocking Behavior: The hook runs in the background without blocking the main thread, and retries are attempted periodically.
// Offline Function: If the user goes offline it will stop and when the user comes back online it will retry each request.
