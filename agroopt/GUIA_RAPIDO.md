# 🚀 Guia Rápido de Uso - AgroOpt

## ⚡ Início Rápido (2 minutos)

### 1️⃣ Iniciar o Backend (Terminal 1)

```bash
cd agroopt/backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Aguarde a mensagem**: `Application startup complete.`

### 2️⃣ Iniciar o Frontend (Terminal 2)

```bash
cd agroopt/frontend
npm run dev
```

**Aguarde a mensagem**: `Local: http://localhost:5173/`

### 3️⃣ Acessar a Aplicação

Abra no navegador: **http://localhost:5173**

---

## 🎯 Como Usar

### Modo 1: Cenário Padrão (Recomendado)

1. Clique em **"Cenário Padrão"** (já selecionado por padrão)
2. Clique em **"Calcular Solução Ótima"**
3. Veja os resultados:
   - **Irrigação ótima**: R$ 5.476,19
   - **Fertilizantes ótimos**: R$ 6.190,48
   - **Lucro máximo**: R$ 20.595,24

### Modo 2: Simulação Personalizada

1. Clique em **"Simulação Personalizada"**
2. Ajuste os parâmetros conforme desejado:
   - **a**: Ganho marginal da irrigação (ex: 3)
   - **b**: Ganho marginal dos fertilizantes (ex: 4)
   - **c**: Retorno decrescente da irrigação (ex: 0.0005)
   - **d**: Retorno decrescente dos fertilizantes (ex: 0.0005)
   - **e**: Complementaridade (ex: 0.0004)
3. Clique em **"Calcular Solução Ótima"**
4. Compare os resultados com o cenário padrão

---

## 📊 Interpretando os Resultados

### Métricas Principais

- **Irrigação ótima (x\*)**: Quanto investir em irrigação para maximizar lucro
- **Fertilizantes ótimos (y\*)**: Quanto investir em fertilizantes para maximizar lucro
- **Lucro máximo (L\*)**: Lucro esperado com os investimentos ótimos

### Classificação do Ponto

- **Máximo Global** ✅: Este é o melhor ponto possível (ideal!)
- **Mínimo Local** ⚠️: Este é o pior ponto (evitar!)
- **Ponto de Sela** ⚠️: Não é nem máximo nem mínimo (não usar)

### Detalhes Matemáticos

Clique em **"Mostrar detalhes"** para ver:
1. Função de lucro completa
2. Derivadas parciais (gradiente)
3. Sistema de equações resolvido
4. Matriz Hessiana
5. Critério de classificação

---

## 🧪 Teste Rápido da API (Opcional)

Se quiser testar apenas o backend sem o frontend:

```bash
curl -X POST "http://localhost:8000/optimize" \
  -H "Content-Type: application/json" \
  -d '{"a":3,"b":4,"c":0.0005,"d":0.0005,"e":0.0004}'
```

Você deve receber uma resposta JSON com os resultados da otimização.

---

## 🔍 Verificação de Funcionamento

### Backend
- Acesse: http://localhost:8000
- Deve exibir: `{"message":"AgroOpt API está rodando. Use POST /optimize para calcular."}`

### Documentação da API
- Acesse: http://localhost:8000/docs
- Interface interativa Swagger para testar a API

### Frontend
- Acesse: http://localhost:5173
- Deve exibir a interface do AgroOpt

---

## ❌ Solução de Problemas

### Backend não inicia

**Erro**: `ModuleNotFoundError: No module named 'fastapi'`

**Solução**:
```bash
cd agroopt/backend
pip install -r requirements.txt
```

### Frontend não inicia

**Erro**: `Error: Cannot find module 'vite'`

**Solução**:
```bash
cd agroopt/frontend
npm install
```

### Porta 8000 já em uso

**Solução**: Altere a porta do backend:
```bash
uvicorn main:app --reload --port 8001
```

E atualize no frontend: `frontend/src/api/agroopt.js`
```javascript
const BASE_URL = 'http://localhost:8001'
```

### Porta 5173 já em uso

O Vite automaticamente tentará a próxima porta disponível (5174, 5175...).
Verifique a mensagem no terminal para saber qual porta foi usada.

---

## 📚 Exemplos de Cenários

### Exemplo 1: Maior investimento em irrigação

```json
{
  "a": 5,
  "b": 3,
  "c": 0.0005,
  "d": 0.0005,
  "e": 0.0004
}
```

### Exemplo 2: Retornos decrescentes mais intensos

```json
{
  "a": 3,
  "b": 4,
  "c": 0.001,
  "d": 0.001,
  "e": 0.0004
}
```

### Exemplo 3: Alta complementaridade

```json
{
  "a": 3,
  "b": 4,
  "c": 0.0005,
  "d": 0.0005,
  "e": 0.0008
}
```

---

## 🎓 Contexto do Projeto

Este sistema foi desenvolvido como trabalho acadêmico da disciplina de **Cálculo Multivariável**, aplicando conceitos de:

- ✅ Funções de duas variáveis
- ✅ Derivadas parciais
- ✅ Gradiente (∇L)
- ✅ Matriz Hessiana
- ✅ Otimização sem restrições
- ✅ Análise de pontos críticos

---

## 📞 Precisa de Ajuda?

1. Leia o [README.md](README.md) completo
2. Veja o [ALTERACOES.md](ALTERACOES.md) para detalhes técnicos
3. Consulte a documentação da API: http://localhost:8000/docs

---

**Bom uso! 🌱**
