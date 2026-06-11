# 🌱 AgroOpt — Otimização de Investimentos Agrícolas

Sistema full stack para determinação do ponto ótimo de investimento agrícola
usando **cálculo multivariável** (derivadas parciais, gradiente e Hessiana).

## 📐 Função de Lucro

```
L(x, y) = ax + by − cx² − dy² + exy
```

| Variável | Significado |
|----------|-------------|
| x | Investimento em irrigação (R$) |
| y | Investimento em fertilizantes (R$) |
| a | Ganho marginal inicial da irrigação |
| b | Ganho marginal inicial dos fertilizantes |
| c | Retornos decrescentes da irrigação |
| d | Retornos decrescentes dos fertilizantes |
| e | Complementaridade irrigação × fertilizante |

**Cenário padrão (conforme lauda acadêmica):** a=3, b=4, c=0.0005, d=0.0005, e=0.0004

### 🎯 Resultados Esperados (Cenário Padrão)

- **Irrigação ótima (x*)**: R$ 5.476,19
- **Fertilizantes ótimos (y*)**: R$ 6.190,48
- **Lucro máximo (L*)**: R$ 20.595,24
- **Classificação**: Máximo Global

---

## 🏗️ Estrutura do Projeto

```
agroopt/
├── backend/
│   ├── main.py            # FastAPI + SymPy + NumPy
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/
│       │   └── agroopt.js
│       └── components/
│           ├── ParamForm.jsx
│           └── ResultsPanel.jsx
└── README.md
```

---

## 🚀 Instalação e Execução

### Pré-requisitos
- Python 3.10+
- Node.js 18+

---

### Backend

```bash
cd backend

# Criar e ativar ambiente virtual (recomendado)
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor (porta 8000)
uvicorn main:app --reload
```

Acesse a documentação automática em: http://localhost:8000/docs

---

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (porta 5173)
npm run dev
```

Abra: http://localhost:5173

---

## 📡 API — Endpoint POST /optimize

### Requisição

```bash
curl -X POST http://localhost:8000/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "a": 3,
    "b": 4,
    "c": 0.0005,
    "d": 0.0005,
    "e": 0.0004
  }'
```

### Resposta

```json
{
  "x_otimo": 5476.1905,
  "y_otimo": 6190.4762,
  "lucro_maximo": 20595.2381,
  "classificacao": "Máximo Global",
  "gradiente": {
    "dL_dx": "-0.001*x + 0.0004*y + 3.0",
    "dL_dy": "0.0004*x - 0.001*y + 4.0"
  },
  "hessiana": [[-0.001, 0.0004], [0.0004, -0.001]],
  "det_hessiana": 0.000001,
  "trace_hessiana": -0.002,
  "funcao_latex": "- 0.0005 x^{2} + 0.0004 x y + 3.0 x - 0.0005 y^{2} + 4.0 y",
  "sistema_solucao": { "x": 5476.1905, "y": 6190.4762 },
  "explicacao": "A função de lucro L(x,y) = 3.0x + 4.0y - 0.0005x² - 0.0005y² + 0.0004xy foi analisada via cálculo multivariável...",
  "interpretacao_economica": "Para maximizar o lucro agrícola com os parâmetros fornecidos, recomenda-se investir R$ 5,476.19 em irrigação e R$ 6,190.48 em fertilizantes..."
}
```

### Exemplo com Simulação Personalizada

```bash
curl -X POST http://localhost:8000/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "a": 6,
    "b": 4,
    "c": 0.001,
    "d": 0.0008,
    "e": 0.0003
  }'
```

---

## 🧮 Processamento Matemático

O backend executa os seguintes passos:

1. **Construção simbólica** da função via SymPy
2. **Derivadas parciais** ∂L/∂x e ∂L/∂y
3. **Gradiente** ∇L = (∂L/∂x, ∂L/∂y)
4. **Sistema ∇L = 0** resolvido algebricamente
5. **Hessiana** H = [[∂²L/∂x², ∂²L/∂x∂y], [∂²L/∂y∂x, ∂²L/∂y²]]
6. **Classificação**: det(H) > 0 e H[0][0] < 0 → Máximo Global
7. **Lucro máximo** L* = L(x*, y*)

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Backend | Python 3.10+, FastAPI, SymPy, NumPy |
| Frontend | React 18, Vite 5, Axios |
| API | REST JSON, CORS habilitado |

---

## 🌐 Variável de Ambiente (Frontend)

Crie `.env` em `frontend/` para apontar para a API:

```env
VITE_API_URL=http://localhost:8000
```

Em produção, altere para a URL do servidor backend deployado.

---

## 📚 Referências

- NAYAK, B. G.; ANANTHI, R. **Profit Optimization in Agricultural Crop Production in Belthangady Taluk Using Linear Programming Models**. Louis Savein Dupuis Journal of Multidisciplinary Research, v. 3, p. 292–298, 2024.
- Stewart, J. **Cálculo de Várias Variáveis**
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [SymPy Docs](https://docs.sympy.org)

---

## 👥 Equipe

| Nome | Curso |
|------|-------|
| Noam Coelho | Ciência da Computação |
| João Pedro Silva | Ciência da Computação |
| Rodrigo Marques | Ciência da Computação |

**Instituição:** Centro Universitário do Pará  
**Disciplina:** Resolução de Problemas Multivariáveis  
**Professor:** Pedro Girotto

---

## 🤖 Declaração de Uso de Inteligência Artificial

Este projeto utilizou ferramentas de IA generativa como apoio ao desenvolvimento, declarado de forma consciente e transparente conforme exigido pelas normas acadêmicas:

- **Claude (Anthropic):** Utilizado para geração e revisão de trechos de código Python (backend FastAPI + SymPy) e JavaScript/React (componentes do frontend), sugestões de estrutura do relatório e depuração de erros lógicos.
- **Toda a modelagem matemática** (derivadas parciais, gradiente, Hessiana, classificação do ponto crítico) foi desenvolvida e verificada pelos membros da equipe com base nos conteúdos da disciplina.
- O código gerado com auxílio de IA foi **revisado, compreendido e testado** pelos autores antes de sua incorporação ao projeto.

---

## 📄 Licença

Este projeto é distribuído sob a licença **MIT**.

```
MIT License

Copyright (c) 2026 Noam Coelho, João Pedro Silva, Rodrigo Marques

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

**AgroOpt v1.0** — Desenvolvido como trabalho acadêmico de Cálculo Multivariável
