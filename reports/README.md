# Guia de Deploy: Dashboard Cantina Charis

## 1. Pré-requisitos
- Python 3.8+ instalado no servidor.
- Módulo `venv` disponível.
- Acesso de terminal ao diretório `/home/thaise/cantina-charis`.

## 2. Ambiente (Preparação)
Execute os comandos abaixo na pasta do projeto para preparar o ambiente virtual:
```bash
cd /home/thaise/cantina-charis
python3 -m venv venv
source venv/bin/activate
pip install streamlit pandas plotly
```

## 3. Serviço (Systemd)

Crie ou edite o arquivo de serviço (ex: /etc/systemd/system/cantina-dashboard.service ou na pasta de usuário):

```ini
[Unit]
Description=Dashboard Cantina (Streamlit)
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/thaise/cantina-charis
ExecStart=/home/thaise/cantina-charis/venv/bin/streamlit run app.py --server.port 8501 -- --db cantina-dev.db
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

## 4. Ativação

```bash
# Recarregar as configurações
systemctl --user daemon-reload

# Habilitar para iniciar no boot
systemctl --user enable cantina-dashboard

# Iniciar o serviço agora
systemctl --user start cantina-dashboard

# Verificar status
systemctl --user status cantina-dashboard

```
