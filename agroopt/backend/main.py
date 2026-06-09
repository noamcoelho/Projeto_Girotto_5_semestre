"""
AgroOpt - Backend FastAPI
Otimização de investimentos agrícolas via cálculo multivariável.
Função de lucro: L(x,y) = ax + by - cx² - dy² + exy - x - y
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sympy import (
    symbols, diff, solve, Matrix, hessian,
    simplify, Rational, latex, N
)
import numpy as np

app = FastAPI(
    title="AgroOpt API",
    description="Otimização de investimentos agrícolas usando cálculo multivariável",
    version="1.0.0"
)

# Permitir requisições do frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class OptimizationInput(BaseModel):
    a: float = Field(default=3.0,    description="Ganho marginal inicial da irrigação")
    b: float = Field(default=4.0,    description="Ganho marginal inicial dos fertilizantes")
    c: float = Field(default=0.0005, description="Intensidade dos retornos decrescentes da irrigação")
    d: float = Field(default=0.0005, description="Intensidade dos retornos decrescentes dos fertilizantes")
    e: float = Field(default=0.0004, description="Complementaridade entre irrigação e fertilização")


class OptimizationOutput(BaseModel):
    x_otimo: float
    y_otimo: float
    lucro_maximo: float
    classificacao: str
    gradiente: dict
    hessiana: list
    det_hessiana: float
    trace_hessiana: float
    funcao_latex: str
    grad_x_latex: str
    grad_y_latex: str
    sistema_solucao: dict
    explicacao: str
    interpretacao_economica: str


@app.get("/")
def root():
    return {"message": "AgroOpt API está rodando. Use POST /optimize para calcular."}


@app.post("/optimize", response_model=OptimizationOutput)
def optimize(params: OptimizationInput):
    """
    Recebe os coeficientes da função de lucro e retorna o ponto ótimo
    calculado via derivadas parciais, gradiente e Hessiana.
    """
    a, b, c, d, e = params.a, params.b, params.c, params.d, params.e

    # ─── 1. Variáveis simbólicas ─────────────────────────────────────────────
    x, y = symbols('x y', real=True)

    # ─── 2. Função de lucro simbólica ────────────────────────────────────────
    # L(x,y) = ax + by - cx² - dy² + exy
    # Conforme modelagem da lauda acadêmica
    L = a*x + b*y - c*x**2 - d*y**2 + e*x*y

    # ─── 3. Derivadas parciais (gradiente) ───────────────────────────────────
    dL_dx = diff(L, x)   # ∂L/∂x
    dL_dy = diff(L, y)   # ∂L/∂y

    grad_x_str = str(simplify(dL_dx))
    grad_y_str = str(simplify(dL_dy))
    grad_x_lat = latex(simplify(dL_dx))
    grad_y_lat = latex(simplify(dL_dy))

    # ─── 4. Resolver ∇L = 0 ──────────────────────────────────────────────────
    solucao = solve([dL_dx, dL_dy], [x, y])

    if not solucao:
        raise HTTPException(status_code=422, detail="Sistema não tem solução única. Verifique os parâmetros.")

    x_opt = float(N(solucao[x]))
    y_opt = float(N(solucao[y]))

    # ─── 5. Hessiana ─────────────────────────────────────────────────────────
    H = hessian(L, [x, y])
    H_num = [[float(H[i, j]) for j in range(2)] for i in range(2)]

    # Determinante e traço da Hessiana
    det_H = float(H.det())
    trace_H = float(H.trace())

    # ─── 6. Classificação do ponto crítico ───────────────────────────────────
    if det_H > 0 and H_num[0][0] < 0:
        classificacao = "Máximo Global"
        class_desc = "O ponto é um **máximo** (det(H) > 0 e ∂²L/∂x² < 0)"
    elif det_H > 0 and H_num[0][0] > 0:
        classificacao = "Mínimo Local"
        class_desc = "O ponto é um **mínimo** (det(H) > 0 e ∂²L/∂x² > 0)"
    elif det_H < 0:
        classificacao = "Ponto de Sela"
        class_desc = "O ponto é um **ponto de sela** (det(H) < 0) — não é ótimo"
    else:
        classificacao = "Inconclusivo"
        class_desc = "O critério da Hessiana é inconclusivo (det(H) = 0)"

    # ─── 7. Lucro máximo ─────────────────────────────────────────────────────
    L_func = lambda xv, yv: a*xv + b*yv - c*xv**2 - d*yv**2 + e*xv*yv
    lucro_max = L_func(x_opt, y_opt)

    # ─── 8. Latex da função ──────────────────────────────────────────────────
    funcao_latex = latex(L)

    # ─── 9. Textos explicativos ──────────────────────────────────────────────
    explicacao = (
        f"A função de lucro L(x,y) = {a}x + {b}y - {c}x² - {d}y² + {e}xy "
        f"foi analisada via cálculo multivariável. "
        f"As derivadas parciais ∂L/∂x = {grad_x_str} e ∂L/∂y = {grad_y_str} "
        f"foram igualadas a zero formando o sistema linear 2×2. "
        f"A solução encontrada foi x* = R$ {x_opt:,.2f} e y* = R$ {y_opt:,.2f}. "
        f"A Hessiana H com det(H) = {det_H:.4f} confirma: {class_desc}. "
        f"O lucro máximo alcançável é L* = R$ {lucro_max:,.2f}."
    )

    interpretacao_economica = (
        f"Para maximizar o lucro agrícola com os parâmetros fornecidos, "
        f"recomenda-se investir R$ {x_opt:,.2f} em irrigação e R$ {y_opt:,.2f} em fertilizantes. "
        f"Esses valores consideram os retornos decrescentes de cada insumo (c={c}, d={d}) "
        f"e o efeito de complementaridade entre eles (e={e}). "
        f"Com esses investimentos, o lucro líquido máximo estimado é de R$ {lucro_max:,.2f}. "
        f"Investir além desses valores reduz o retorno marginal e diminui o lucro total."
    )

    return OptimizationOutput(
        x_otimo=round(x_opt, 4),
        y_otimo=round(y_opt, 4),
        lucro_maximo=round(lucro_max, 4),
        classificacao=classificacao,
        gradiente={"dL_dx": grad_x_str, "dL_dy": grad_y_str},
        hessiana=H_num,
        det_hessiana=round(det_H, 6),
        trace_hessiana=round(trace_H, 6),
        funcao_latex=funcao_latex,
        grad_x_latex=grad_x_lat,
        grad_y_latex=grad_y_lat,
        sistema_solucao={"x": round(x_opt, 4), "y": round(y_opt, 4)},
        explicacao=explicacao,
        interpretacao_economica=interpretacao_economica,
    )
