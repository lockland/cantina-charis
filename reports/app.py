import streamlit as st
import pandas as pd
import sqlite3
import argparse
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
from itertools import combinations

# Configuração da página
st.set_page_config(page_title="Dashboard Cantina", layout="wide")


def get_db_path():
    parser = argparse.ArgumentParser(description="Dashboard Cantina")
    parser.add_argument(
        "--db", help="Caminho para o arquivo sqlite", default="cantina-dev.db"
    )
    args, unknown = parser.parse_known_args()
    return args.db


db_path = get_db_path()


@st.cache_data
def carregar_dados(path):
    conn = sqlite3.connect(path)
    orders = pd.read_sql_query("SELECT * FROM orders", conn)
    outgoings = pd.read_sql_query("SELECT * FROM outgoings", conn)
    order_products = pd.read_sql_query("SELECT * FROM order_products", conn)
    products = pd.read_sql_query("SELECT * FROM products WHERE id <> 1", conn)
    customers = pd.read_sql_query("SELECT * FROM customers WHERE id <> 1", conn)
    conn.close()

    orders["created_at_dt"] = pd.to_datetime(
        orders["created_at"], errors="coerce"
    ).dt.tz_localize(None)
    orders["order_amount"] = pd.to_numeric(orders["order_amount"], errors="coerce")
    outgoings["created_at_dt"] = pd.to_datetime(
        outgoings["created_at"], errors="coerce"
    ).dt.tz_localize(None)
    outgoings["amount"] = pd.to_numeric(outgoings["amount"], errors="coerce")
    return orders, outgoings, order_products, products, customers


orders, outgoings, order_products, products, customers = carregar_dados(db_path)

st.title("📊 Dashboard da Cantina")

# Processamento Financeiro
orders["mes"] = orders["created_at_dt"].dt.to_period("M").astype(str)
outgoings["mes"] = outgoings["created_at_dt"].dt.to_period("M").astype(str)

df_fin = pd.DataFrame(
    {
        "Receita": orders.groupby("mes")["order_amount"].sum(),
        "Despesa": outgoings.groupby("mes")["amount"].sum(),
    }
).fillna(0)

if "NaT" in df_fin.index:
    df_fin = df_fin.drop("NaT")

df_fin["Lucro"] = df_fin["Receita"] - df_fin["Despesa"]

col1, col2 = st.columns(2)

with col1:
    ticket_medio = orders["order_amount"].mean()
    st.metric("Ticket Médio", f"R$ {ticket_medio:.2f}")

with col2:
    # --- NOVO BREAK-EVEN (PLACAR) ---
    ultimo_mes = df_fin.index[-1]

    receita_mes = df_fin.loc[ultimo_mes, "Receita"]
    despesa_mes = df_fin.loc[ultimo_mes, "Despesa"]

    falta_para_meta = max(0, despesa_mes - receita_mes)
    st.metric("Falta para atingir o Break-even (Meta)", f"R$ {falta_para_meta:.2f}")

st.divider()

# Gráfico Stacked Financeiro
fig1 = go.Figure()
fig1.add_trace(go.Bar(x=df_fin.index, y=df_fin["Receita"], name="Receita"))
fig1.add_trace(go.Bar(x=df_fin.index, y=df_fin["Despesa"], name="Despesa"))
fig1.add_trace(go.Bar(x=df_fin.index, y=df_fin["Lucro"], name="Lucro"))
fig1.update_layout(barmode="relative", title="Receita, Despesa e Lucro por Mês")
st.plotly_chart(fig1)

# 3. Margem de Lucro
df_fin["Margem (%)"] = (df_fin["Lucro"] / df_fin["Receita"]) * 100
fig2 = px.line(
    df_fin,
    x=df_fin.index,
    y="Margem (%)",
    title="Margem de Lucro por Mês (%)",
    markers=True,
)
st.plotly_chart(fig2)

# --- ALMOÇOS (SOMA TOTAL) ---
data_limite = datetime.now() - timedelta(days=90)
df_almoco = orders[orders["created_at_dt"] >= data_limite]
df_almoco = df_almoco.merge(order_products, left_on="id", right_on="order_id")
df_almoco = df_almoco.merge(products, left_on="product_id", right_on="id")

# Filtra apenas almoços (ala ou prato)
df_almoco = df_almoco[
    df_almoco["name"].str.contains("ala|prato", case=False, na=False)
].copy()

# Agrega por data sem distinguir o nome do produto
df_almoco_total = (
    df_almoco.groupby(df_almoco["created_at_dt"].dt.date)["product_quantity"]
    .sum()
    .reset_index()
)

if not df_almoco_total.empty:
    fig_almoco = px.line(
        df_almoco_total,
        x="created_at_dt",
        y="product_quantity",
        title="Total de Almoços Vendidos por Dia (Últimos 90 dias)",
        labels={"created_at_dt": "Data", "product_quantity": "Quantidade Total"},
        markers=True,
    )
    st.plotly_chart(fig_almoco)
else:
    st.info("Nenhum almoço encontrado nos últimos 90 dias.")

df_almoco_agregado = (
    df_almoco.groupby([df_almoco["created_at_dt"].dt.date, "name"])["product_quantity"]
    .sum()
    .reset_index()
)

if not df_almoco_agregado.empty:
    fig_almoco = px.bar(
        df_almoco_agregado,
        x="created_at_dt",
        y="product_quantity",
        color="name",
        title="Almoços Vendidos por Tipo (Últimos 90 dias)",
        labels={
            "created_at_dt": "Data",
            "product_quantity": "Quantidade",
            "name": "Produto",
        },
    )
    fig_almoco.update_layout(barmode="stack")
    st.plotly_chart(fig_almoco)
else:
    st.info("Nenhum almoço ('ala' ou 'prato') encontrado nos últimos 90 dias.")

# 5. Top Clientes
top_clientes = (
    orders.groupby("customer_id")["order_amount"].sum().nlargest(10).reset_index()
)
top_clientes = top_clientes.merge(customers, left_on="customer_id", right_on="id")
fig3 = px.line(
    top_clientes,
    x="name",
    y="order_amount",
    title="Top 10 Clientes (Valor Gasto)",
    markers=True,
)
st.plotly_chart(fig3)

# 6. Top Produtos
top_produtos = (
    order_products.groupby("product_id")["product_quantity"]
    .sum()
    .nlargest(10)
    .reset_index()
)
top_produtos = top_produtos.merge(products, left_on="product_id", right_on="id")
fig4 = px.line(
    top_produtos,
    x="name",
    y="product_quantity",
    title="Top 10 Produtos (Quantidade)",
    markers=True,
)
st.plotly_chart(fig4)


# --- ANÁLISE DE COMBINAÇÃO (MARKET BASKET) ---
st.subheader("Combinações Frequentes")
# Agrupa produtos por pedido
order_baskets = order_products.groupby("order_id")["product_id"].apply(list)

# Conta pares de produtos que aparecem juntos
combs = []
for basket in order_baskets:
    if len(basket) > 1:
        combs.extend(list(combinations(sorted(basket), 2)))

if combs:
    df_combs = pd.DataFrame(combs, columns=["prod1", "prod2"])
    top_combs = df_combs.value_counts().head(5).reset_index(name="count")

    # Mapear nomes dos produtos
    prod_map = dict(zip(products["id"], products["name"]))
    top_combs["prod1"] = top_combs["prod1"].map(prod_map)
    top_combs["prod2"] = top_combs["prod2"].map(prod_map)

    st.write("Top 5 pares de produtos comprados juntos:")
    st.table(top_combs)
else:
    st.info("Não há combinações de produtos suficientes para análise.")
