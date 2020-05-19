import { useState, useCallback, useRef, useEffect } from 'react';

const defaultContentTypeHeader = {
  'Content-Type': 'application/json',
};

//alternatively, use rxjs observableAjax to automatically support cancellation
export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  //useCallback to avoid infinite loops
  const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}, token) => {
    setIsLoading(true);

    //support canceling inflight requests
    const httpAbortCtrl = new AbortController(); //AbortController is built into your browser
    activeHttpRequests.current.push(httpAbortCtrl);

    //add auth header if needed
    let authHeader = {};
    if (token)
      authHeader = {
        Authorization: `BEARER ${token}`,
      };

    const hasFormData = body instanceof FormData;

    //if body is formData, do not include content-type header
    //https://muffinman.io/uploading-files-using-fetch-multipart-form-data/
    const mergedHeaders = hasFormData
      ? {
          ...headers,
          ...authHeader,
        }
      : {
          ...defaultContentTypeHeader,
          ...headers,
          ...authHeader,
        };

    try {
      const response = await fetch(url, {
        method,
        headers: mergedHeaders,
        body,
        signal: httpAbortCtrl.signal,
      });

      const responseData = await response.json();
      //if request successful, remove from activeHttpRequests
      activeHttpRequests.current = activeHttpRequests.current.filter(
        (reqCtrl) => reqCtrl !== httpAbortCtrl
      );

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      return responseData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    //return cleanup function
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
    clearError,
  };
};
