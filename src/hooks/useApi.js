import { useState, useCallback } from 'react';

const API_BASE    = 'https://www.urusverify.com/v1/client/6769ef3e-ee88-4623-9868-cde883366c4a/api';
const FACTORY_KEY = 'factory2026';

/**
 * Realiza una petición a la API base del proyecto.
 * @param {string} endpoint  - Ruta relativa, ej: '/users'
 * @param {RequestInit} options - Opciones nativas de fetch (method, body, etc.)
 * @returns {Promise<any>} - JSON de respuesta
 */
export async function fetchApi(endpoint = '', options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type':  'application/json',
      'x-factory-key': FACTORY_KEY,
      ...(options.headers ?? {})
    }
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error     = new Error(errorData.message ?? `HTTP error ${response.status}`);
    error.status    = response.status;
    error.data      = errorData;
    throw error;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Hook de React para consumir fetchApi con estados de carga y error.
 * @returns {{ data, loading, error, request }}
 */
export function useApi() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const request = useCallback(async (endpoint = '', options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchApi(endpoint, options);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, request };
}