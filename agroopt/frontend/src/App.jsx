/**
 * AgroOpt — App principal
 * Orquestra o formulário de parâmetros e o painel de resultados.
 */
import React, { useState } from 'react'
import ParamForm from './components/ParamForm.jsx'
import ResultsPanel from './components/ResultsPanel.jsx'
import { optimize } from './api/agroopt.js'

const DEFAULTS = { a: 3, b: 4, c: 0.0005, d: 0.0005, e: 0.0004 }

export default function App() {
  const [mode, setMode]       = useState('default')
  const [params, setParams]   = useState(DEFAULTS)
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await optimize(params)
      setResult(data)
      // Scroll suave até os resultados
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Erro desconhecido'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ── Header ── */}
      <header className="header">
        <span className="header-icon">🌱</span>
        <h1>AgroOpt</h1>
        <p>Otimização de Investimentos Agrícolas via Cálculo Multivariável</p>
      </header>

      <main className="container">

        {/* ── Explicação do problema ── */}
        <div className="card">
          <div className="card-title">📖 Sobre o Problema</div>
          <p style={{ fontSize: '.93rem', color: 'var(--gray-700)', lineHeight: 1.8 }}>
            Este sistema determina automaticamente quanto investir em <strong>irrigação (x)</strong> e
            em <strong>fertilizantes (y)</strong> para <strong>maximizar o lucro agrícola</strong>, usando a função:
          </p>
          <div className="formula-box" style={{ margin: '.9rem 0' }}>
            L(x, y) = ax + by − cx² − dy² + exy
          </div>
          <p style={{ fontSize: '.87rem', color: 'var(--gray-600)', lineHeight: 1.75 }}>
            O ponto ótimo <strong>(x*, y*)</strong> é encontrado igualando o gradiente a zero (∇L = 0)
            e verificando a natureza do ponto crítico pela <strong>matriz Hessiana</strong>.
            Os termos <em>-cx²</em> e <em>-dy²</em> modelam retornos decrescentes;
            o termo <em>+exy</em> captura a complementaridade entre irrigação e adubação.
          </p>
        </div>

        {/* ── Formulário ── */}
        <ParamForm
          mode={mode}
          setMode={setMode}
          params={params}
          setParams={setParams}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {/* ── Erro ── */}
        {error && (
          <div className="error-box">
            ❌ <strong>Erro:</strong> {error}
          </div>
        )}

        {/* ── Resultados ── */}
        <div id="results">
          <ResultsPanel result={result} />
        </div>

      </main>

      <footer style={{ textAlign: 'center', padding: '1.5rem', fontSize: '.8rem', color: 'var(--gray-400)' }}>
        AgroOpt v1.0 — Cálculo multivariável aplicado à otimização agrícola
      </footer>
    </>
  )
}
