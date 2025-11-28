import { useState, useCallback } from 'react';

const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const request = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError('');
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return {
    data,
    error,
    loading,
    request,
  };
};

export const useFetch = (url, options = {}) => {
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: true,
  });

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      setState({ data, error: null, loading: false });
    } catch (error) {
      setState({ data: null, error: error.message, loading: false });
    }
  }, [url, options]);

  return { ...state, refetch: fetchData };
};

export const usePost = (url, options = {}) => {
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: false,
  });

  const postData = useCallback(
    async (body) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: JSON.stringify(body),
          ...options,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || response.statusText);
        }

        const data = await response.json();
        setState({ data, error: null, loading: false });
        return data;
      } catch (error) {
        setState({ data: null, error: error.message, loading: false });
        throw error;
      }
    },
    [url, options]
  );

  return { ...state, postData };
};

export const useMutation = (mutationFn, options = {}) => {
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: false,
  });

  const mutate = useCallback(
    async (...args) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const data = await mutationFn(...args);
        setState({ data, error: null, loading: false });

        if (options.onSuccess) {
          options.onSuccess(data);
        }

        return data;
      } catch (error) {
        setState({ data: null, error: error.message, loading: false });

        if (options.onError) {
          options.onError(error);
        }

        throw error;
      }
    },
    [mutationFn, options]
  );

  return { ...state, mutate };
};

export default useApi; 