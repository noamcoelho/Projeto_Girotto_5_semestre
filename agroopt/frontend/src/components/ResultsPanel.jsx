/**
 * ResultsPanel — Exibe o resultado da otimização.
 * Seções: métricas principais, como a solução foi obtida, interpretação econômica.
 */
import React, { useState } from 'react'

function currency(v) {
  return `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function BadgeClass({ cls }) {
  const type = cls === 'Máximo Global' ? 'green' : cls === 'Ponto de Sela' ? 'red' : 'amber'
  return <span className={`badge badge-${type}`}>{cls}</span>
}

export default function ResultsPanel({ result }) {
  const [showMath, setShowMath] = useState(false)

  if (!result) return null

  const {
    x_otimo, y_otimo, lucro_maximo, classificacao,
    gradiente, hessiana, det_hessiana, trace_hessiana,
    funcao_latex, grad_x_latex, grad_y_latex,
    sistema_solucao, explicacao, interpretacao_economica,
    sensibilidade
  } = result

  return (
    <>
      {/* ── Métricas principais ── */}
      <div className="card">
        <div className="card-title">📊 Resultados da Otimização</div>

        <div className="result-grid">
          <div className="result-metric">
            <div className="label">Irrigação ótima (x*)</div>
            <div className="value">{currency(x_otimo)}</div>
          </div>
          <div className="result-metric">
            <div className="label">Fertilizantes ótimos (y*)</div>
            <div className="value">{currency(y_otimo)}</div>
          </div>
          <div className="result-metric highlight">
            <div className="label">Lucro máximo (L*)</div>
            <div className="value">{currency(lucro_maximo)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginTop: '.5rem' }}>
          <span style={{ fontSize: '.9rem', color: 'var(--gray-600)', fontWeight: 600 }}>Ponto crítico:</span>
          <BadgeClass cls={classificacao} />
        </div>

        <div className="interpret-box">
          🌾 <strong>Interpretação econômica:</strong><br />{interpretacao_economica}
        </div>
      </div>

      {/* ── Análise de Sensibilidade ── */}
      {sensibilidade && Object.keys(sensibilidade).length > 0 && (
        <div className="card">
          <div className="card-title">📈 Análise de Sensibilidade</div>
          <p style={{ fontSize: '.9rem', color: 'var(--gray-700)', marginBottom: '1rem', lineHeight: 1.7 }}>
            Impacto de uma variação de <strong>+1%</strong> em cada parâmetro sobre o ponto ótimo.
            Parâmetros com maior impacto no lucro indicam onde concentrar esforços de gestão.
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--green-50)' }}>
                {['Parâmetro (+1%)', 'Δ x* (Irrigação)', 'Δ y* (Fertilizantes)', 'Δ L* (Lucro)'].map(h => (
                  <th key={h} style={{ padding: '.6rem 1rem', textAlign: h === 'Parâmetro (+1%)' ? 'left' : 'center', border: '1px solid var(--gray-200)', color: 'var(--green-800)', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(sensibilidade).map(([param, vals]) => (
                <tr key={param} style={{ background: 'white' }}>
                  <td style={{ padding: '.5rem 1rem', border: '1px solid var(--gray-200)', fontWeight: 700, color: 'var(--green-700)', fontFamily: 'monospace' }}>{param} + 1%</td>
                  {[vals.variacao_x, vals.variacao_y, vals.variacao_lucro].map((v, i) => (
                    <td key={i} style={{ padding: '.5rem 1rem', border: '1px solid var(--gray-200)', textAlign: 'center', fontWeight: 600, color: v > 0 ? 'var(--green-700)' : v < 0 ? 'var(--red-500)' : 'var(--gray-400)' }}>
                      {v > 0 ? '+' : ''}{v}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Seção matemática ── */}
      <div className="card">
        <div className="card-title">
          🔢 Como a solução foi obtida
          <button
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--green-700)', fontWeight: 700, fontSize: '.85rem' }}
            onClick={() => setShowMath(v => !v)}
          >
            {showMath ? '▲ Ocultar' : '▼ Mostrar detalhes'}
          </button>
        </div>

        {/* Resumo sempre visível */}
        <p style={{ fontSize: '.9rem', color: 'var(--gray-700)', lineHeight: 1.7 }}>{explicacao}</p>

        {showMath && (
          <div className="math-section">

            {/* 1. Função */}
            <div className="math-label">1. Função de Lucro L(x, y)</div>
            <div className="formula-box">
              L(x,y) = ax + by − cx² − dy² + exy
            </div>
            <div className="math-block">{funcao_latex}</div>

            {/* 2. Derivadas parciais */}
            <div className="math-label">2. Derivadas Parciais (Gradiente ∇L)</div>
            <div className="math-block">
{`∂L/∂x = ${gradiente.dL_dx}
∂L/∂y = ${gradiente.dL_dy}`}
            </div>

            {/* 3. Sistema ∇L = 0 */}
            <div className="math-label">3. Sistema de Equações ∇L = 0</div>
            <div className="math-block">
{`${gradiente.dL_dx} = 0
${gradiente.dL_dy} = 0

Solução:
  x* = ${sistema_solucao.x}
  y* = ${sistema_solucao.y}`}
            </div>

            {/* 4. Hessiana */}
            <div className="math-label">4. Matriz Hessiana H</div>
            <table className="hessiana-table">
              <tbody>
                {hessiana.map((row, i) => (
                  <tr key={i}>
                    {row.map((val, j) => (
                      <td key={j}>{Number(val).toFixed(4)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="math-block">
{`det(H) = ${det_hessiana}
tr(H)  = ${trace_hessiana}

H[0][0] = ∂²L/∂x² = ${hessiana[0][0]}
H[1][1] = ∂²L/∂y² = ${hessiana[1][1]}
H[0][1] = H[1][0] = ∂²L/∂x∂y = ${hessiana[0][1]}`}
            </div>

            {/* 5. Classificação */}
            <div className="math-label">5. Classificação do Ponto Crítico</div>
            <div className="math-block">
{`det(H) = ${det_hessiana} ${det_hessiana > 0 ? '> 0' : '< 0'}
∂²L/∂x² = ${hessiana[0][0]} ${hessiana[0][0] < 0 ? '< 0' : '> 0'}

→ Classificação: ${classificacao}`}
            </div>

            <div className="info-box">
              <strong>Critério de Classificação:</strong><br />
              • Se det(H) &gt; 0 e ∂²L/∂x² &lt; 0 → <strong>Máximo</strong><br />
              • Se det(H) &gt; 0 e ∂²L/∂x² &gt; 0 → <strong>Mínimo</strong><br />
              • Se det(H) &lt; 0 → <strong>Ponto de Sela</strong> (não é ótimo)
            </div>
          </div>
        )}
      </div>
    </>
  )
}
