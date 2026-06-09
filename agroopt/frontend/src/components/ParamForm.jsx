/**
 * ParamForm — Formulário de parâmetros da função de lucro.
 * Permite modo padrão (somente leitura) ou modo simulação (editável).
 */
import React from 'react'

const DEFAULTS = { a: 3, b: 4, c: 0.0005, d: 0.0005, e: 0.0004 }

const PARAM_INFO = {
  a: { label: 'Ganho marginal da irrigação (a)', desc: 'Retorno por R$ investido em irrigação' },
  b: { label: 'Ganho marginal dos fertilizantes (b)', desc: 'Retorno por R$ investido em fertilizantes' },
  c: { label: 'Retorno decrescente da irrigação (c)', desc: 'Intensidade da queda de rendimento (irrigação)' },
  d: { label: 'Retorno decrescente dos fertilizantes (d)', desc: 'Intensidade da queda de rendimento (fertilizantes)' },
  e: { label: 'Complementaridade (e)', desc: 'Ganho extra quando ambos os insumos crescem juntos' },
}

export default function ParamForm({ mode, setMode, params, setParams, onSubmit, loading }) {
  const isDefault = mode === 'default'

  function handleChange(key, value) {
    setParams(prev => ({ ...prev, [key]: parseFloat(value) || 0 }))
  }

  function resetToDefault() {
    setParams(DEFAULTS)
  }

  return (
    <div className="card">
      <div className="card-title">⚙️ Configuração do Cenário</div>

      {/* Seleção de modo */}
      <div className="mode-selector">
        <button
          className={`mode-btn ${isDefault ? 'active' : ''}`}
          onClick={() => { setMode('default'); setParams(DEFAULTS) }}
        >
          🌿 Cenário Padrão
        </button>
        <button
          className={`mode-btn ${!isDefault ? 'active' : ''}`}
          onClick={() => setMode('simulation')}
        >
          🔬 Simulação Personalizada
        </button>
      </div>

      {isDefault && (
        <div className="info-box">
          ℹ️ Parâmetros acadêmicos padrão: <strong>a=3, b=4, c=0,0005, d=0,0005, e=0,0004</strong>.
          Ative a simulação para personalizar.
        </div>
      )}

      {/* Campos */}
      <div className="param-grid" style={{ marginTop: '1rem' }}>
        {Object.entries(PARAM_INFO).map(([key, info]) => (
          <div className="param-group" key={key}>
            <label>{info.label}</label>
            <input
              type="number"
              step="0.0001"
              value={params[key]}
              disabled={isDefault}
              onChange={e => handleChange(key, e.target.value)}
            />
            <div className="param-desc">{info.desc}</div>
          </div>
        ))}
      </div>

      {!isDefault && (
        <button
          style={{ marginTop: '.75rem', background: 'none', border: 'none', color: 'var(--green-700)', cursor: 'pointer', fontSize: '.85rem', fontWeight: 600 }}
          onClick={resetToDefault}
        >
          ↩ Restaurar valores padrão
        </button>
      )}

      <button className="btn-primary" onClick={onSubmit} disabled={loading}>
        {loading ? '⏳ Calculando...' : '🚀 Calcular Solução Ótima'}
      </button>
    </div>
  )
}
