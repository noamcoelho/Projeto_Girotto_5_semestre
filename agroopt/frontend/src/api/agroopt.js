import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Chama o endpoint POST /optimize com os parâmetros fornecidos.
 * @param {Object} params - { a, b, c, d, e }
 * @returns {Promise<Object>} resultado da otimização
 */
export async function optimize(params) {
  const response = await axios.post(`${BASE_URL}/optimize`, params, {
    headers: { 'Content-Type': 'application/json' }
  })
  return response.data
}
