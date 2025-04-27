# bodega-esports-platform/backend/Dockerfile

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.10

WORKDIR /app

COPY ./app /app/app
COPY requirements.txt /app/
COPY .env /app/

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt
