import streamlit as st
import pandas as pd
import sqlite3
import argparse
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
from itertools import combinations

# --- CONFIGURAÇÃO ---
st.set_page_config(page_title="Dashboard Cantina", layout="wide")

ID_CLIENTE_GENERICO = 1
ID_PRODUTO_GENERICO = 1


def get_db_path():
    parser = argparse.ArgumentParser(description="Dashboard Cantina")
    parser.add_argument(
        "--db", help="Caminho para o arquivo sqlite", default="cantina-dev.db"
    )
    args, unknown = parser.parse_known_args()
    return args.db


def carregar_dados(path):
    conn = sqlite3.connect(path)

    # 1. Carrega as tabelas base
    orders = pd.read_sql_query("SELECT * FROM orders", conn)
    outgoings = pd.read_sql_query("SELECT * FROM outgoings", conn)
    order_products = pd.read_sql_query("SELECT * FROM order_products", conn)
    products = pd.read_sql_query("SELECT * FROM products", conn)
    customers = pd.read_sql_query("SELECT * FROM customers", conn)

    conn.close()

    for df in [orders, outgoings]:
        df["created_at_dt"] = pd.to_datetime(
            df["created_at"].str[:19],
            errors="coerce",
            format="%Y-%m-%d %H:%M:%S",
        ).dt.tz_localize(None)

    orders["order_amount"] = pd.to_numeric(orders["order_amount"], errors="coerce")
    orders["paid_value"] = pd.to_numeric(orders["paid_value"], errors="coerce")
    outgoings["amount"] = pd.to_numeric(outgoings["amount"], errors="coerce")
    return orders, outgoings, order_products, products, customers


orders, outgoings, order_products, products, customers = carregar_dados(get_db_path())

# --- FILTROS E PROCESSAMENTO GLOBAL ---
dias_filtro = st.sidebar.slider("Janela de Análise (Dias)", 1, 365, 90)
top_x = st.sidebar.slider("Itens no Top", 1, 50, 10)

data_limite = datetime.now() - timedelta(days=dias_filtro)

# Filtra DataFrames baseados na data limite
orders_f = orders[orders["created_at_dt"] >= data_limite].copy()
outgoings_f = outgoings[outgoings["created_at_dt"] >= data_limite].copy()
order_products_f = order_products[
    order_products["order_id"].isin(orders_f["id"])
].copy()

# Processamento Financeiro Filtrado
orders_f["mes"] = orders_f["created_at_dt"].dt.to_period("M").astype(str)
outgoings_f["mes"] = outgoings_f["created_at_dt"].dt.to_period("M").astype(str)

# Calcula o valor em aberto por pedido
orders_f["valor_em_aberto"] = orders_f.apply(
    lambda row: max(0, row["order_amount"] - row["paid_value"])
    if pd.notna(row["paid_value"])
    else row["order_amount"],
    axis=1,
)
total_em_aberto = orders_f["valor_em_aberto"].sum()

df_fin = pd.DataFrame(
    {
        "Receita": orders_f.groupby("mes")["order_amount"].sum(),
        "Despesa": outgoings_f.groupby("mes")["amount"].sum(),
    }
).fillna(0)
df_fin["Lucro"] = df_fin["Receita"] - df_fin["Despesa"]
df_fin["Margem (%)"] = (df_fin["Lucro"] / df_fin["Receita"]) * 100

# Valores absolutos da janela para os KPIs cards
total_receita_periodo = df_fin["Receita"].sum()
total_despesa_periodo = df_fin["Despesa"].sum()
lucro_periodo = total_receita_periodo - total_despesa_periodo

margem_lucro = 0
if total_receita_periodo > 0:
    margem_lucro = lucro_periodo / total_receita_periodo * 100

# Processamento Almoços Filtrado
df_alm = orders_f.merge(order_products_f, left_on="id", right_on="order_id").merge(
    products, left_on="product_id", right_on="id"
)
df_alm = df_alm[df_alm["name"].str.contains("ala|prato", case=False, na=False)]

# --- DASHBOARD ---
st.title("📊 Dashboard Operacional Cantina")

# Métricas
c1, c2, c3, c4 = st.columns(4)
c1.metric("Ticket Médio", f"R$ {orders_f['order_amount'].mean():.2f}")
c2.metric(
    "Lucro Total",
    f"R$ {lucro_periodo:.2f}",
    delta=f"{margem_lucro:.1f}%",
    help=f"A margem de lucro atual é de {margem_lucro:.1f}%",
)
c3.metric(
    "Meta Break-even",
    f"R$ {max(0, total_despesa_periodo - total_receita_periodo):.2f}",
)
c4.metric(
    "Valor em Aberto",
    f"R$ {total_em_aberto:.2f}",
    delta=f"{orders_f[orders_f['valor_em_aberto'] > 0].shape[0]} pedidos",
    delta_color="inverse",
)

# Linha 1: Financeiro e Tendência
r1 = st.columns(2)
with r1[0]:
    fig_margem = px.line(
        df_fin,
        x=df_fin.index,
        y="Margem (%)",
        title="Evolução da Margem de Lucro (%)",
        markers=True,
    )
    st.plotly_chart(fig_margem, use_container_width=True)

with r1[1]:
    df_tend = (
        df_alm.groupby(df_alm["created_at_dt"].dt.date)["product_quantity"]
        .sum()
        .reset_index()
    )
    df_tend["media_movel"] = df_tend["product_quantity"].rolling(window=7).mean()
    fig_t = px.line(
        df_tend,
        x="created_at_dt",
        y=["product_quantity", "media_movel"],
        title="Tendência de Almoços (Venda vs Média 7d)",
        labels={"created_at_dt": "Data", "value": "Quantidade", "variable": "Métrica"},
    )
    st.plotly_chart(fig_t, use_container_width=True)

# Nova Linha: Margem de Lucro
st.markdown("---")
fig_fin = go.Figure(
    [
        go.Bar(
            x=df_fin.index,
            y=df_fin["Receita"],
            name="Receita",
            text=df_fin["Receita"],
            texttemplate="R$ %{text:,.2f}",
            textposition="outside",
        ),
        go.Scatter(
            x=df_fin.index, y=df_fin["Despesa"], name="Despesa", mode="lines+markers"
        ),
        go.Scatter(
            x=df_fin.index, y=df_fin["Lucro"], name="Lucro", mode="lines+markers"
        ),
    ]
)

fig_fin.update_layout(
    title="Fluxo Financeiro Mensal", xaxis_title="Período", yaxis_title="Valor (R$)"
)
st.plotly_chart(fig_fin, use_container_width=True)


# Linha 2: Composição e Sazonalidade
r2 = st.columns(2)
with r2[0]:
    df_comp = (
        df_alm.groupby([df_alm["created_at_dt"].dt.date, "name"])["product_quantity"]
        .sum()
        .reset_index()
    )
    fig_comp = px.bar(
        df_comp,
        x="created_at_dt",
        y="product_quantity",
        color="name",
        title="Composição de Almoços por Tipo",
        labels={
            "created_at_dt": "Data",
            "product_quantity": "Quantidade",
            "name": "Produto",
        },
    )
    st.plotly_chart(fig_comp, use_container_width=True)

with r2[1]:
    mapa_dias = {
        "Monday": "Segunda",
        "Tuesday": "Terça",
        "Wednesday": "Quarta",
        "Thursday": "Quinta",
        "Friday": "Sexta",
        "Saturday": "Sábado",
        "Sunday": "Domingo",
    }

    df_diario = (
        df_alm.groupby(df_alm["created_at_dt"].dt.date)["product_quantity"]
        .sum()
        .reset_index()
    )
    df_diario["dia_semana"] = (
        pd.to_datetime(df_diario["created_at_dt"]).dt.day_name().map(mapa_dias)
    )
    df_diario["dia_semana"] = pd.Categorical(
        df_diario["dia_semana"], categories=mapa_dias.values(), ordered=True
    )
    df_sazonalidade = (
        df_diario.groupby("dia_semana")["product_quantity"].mean().reset_index()
    )
    df_sazonalidade["product_quantity"] = (
        df_sazonalidade["product_quantity"].fillna(0).astype(int)
    )

    fig_sazonal = px.bar(
        df_sazonalidade,
        x="dia_semana",
        y="product_quantity",
        title="Média de Almoços Vendidos por Dia da Semana",
        labels={"dia_semana": "Dia da Semana", "product_quantity": "Média de Vendas"},
        color="product_quantity",
        color_continuous_scale="Blues",
        text_auto="d",
    )
    fig_sazonal.update_layout(
        xaxis_title="Dia da Semana", yaxis_title="Quantidade Média"
    )
    st.plotly_chart(fig_sazonal, use_container_width=True)

# Linha 3: Tops, Combinações e Despesas
r3 = st.columns([1, 1, 1])
with r3[0]:
    orders_f_filtrado = orders_f[orders_f["customer_id"] != ID_CLIENTE_GENERICO]
    top_c = (
        orders_f_filtrado.groupby("customer_id")["order_amount"]
        .sum()
        .nlargest(top_x)
        .reset_index()
        .merge(customers, left_on="customer_id", right_on="id")
    )
    fig_c = px.bar(
        top_c.sort_values("order_amount", ascending=False),
        x="name",
        y="order_amount",
        title=f"Top {top_x} Clientes (R$)",
        labels={"name": "Cliente", "order_amount": "Valor Total (R$)"},
    )
    st.plotly_chart(fig_c, use_container_width=True)

with r3[1]:
    order_products_f_filtrado = order_products_f[
        order_products_f["product_id"] != ID_PRODUTO_GENERICO
    ]
    top_p = (
        order_products_f_filtrado.groupby("product_id")["product_quantity"]
        .sum()
        .nlargest(top_x)
        .reset_index()
        .merge(products, left_on="product_id", right_on="id")
    )
    fig_p = px.bar(
        top_p.sort_values("product_quantity", ascending=False),
        x="name",
        y="product_quantity",
        title=f"Top {top_x} Produtos (Qtd)",
        labels={"name": "Produto", "product_quantity": "Quantidade Vendida"},
    )
    st.plotly_chart(fig_p, use_container_width=True)

with r3[2]:
    st.markdown("**Combinações Mais Frequentes**")
    order_baskets = order_products_f.groupby("order_id")["product_id"].apply(list)
    combs = [
        pair
        for basket in order_baskets
        if len(basket) > 1
        for pair in combinations(sorted(basket), 2)
    ]

    if combs:
        df_combs = (
            pd.DataFrame(combs, columns=["prod1", "prod2"])
            .value_counts()
            .head(5)
            .reset_index(name="count")
        )
        prod_map = dict(zip(products["id"], products["name"]))
        df_combs["prod1"], df_combs["prod2"] = df_combs["prod1"].map(
            prod_map
        ), df_combs["prod2"].map(prod_map)
        df_combs.columns = ["Produto 1", "Produto 2", "Frequência"]
        st.table(df_combs)
    else:
        st.write("Dados insuficientes.")

    st.markdown("---")
    st.markdown("**Top 5 Despesas por Descrição**")
    df_despesas = outgoings_f.groupby("description")["amount"].sum().reset_index()
    df_despesas = df_despesas[
        ~df_despesas["description"].str.contains("retirada", case=False, na=False)
    ]
    df_despesas = df_despesas.sort_values("amount", ascending=False).head(5)
    df_despesas.columns = ["Descrição", "Valor Gasto (R$)"]
    df_despesas["Valor Gasto (R$)"] = df_despesas["Valor Gasto (R$)"].apply(
        lambda x: f"R$ {x:,.2f}"
    )
    st.table(df_despesas)
