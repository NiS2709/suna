FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim

ENV ENV_MODE production
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    # Dependencies for WeasyPrint (PDF generation)
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libcairo2 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    fontconfig \
    fonts-dejavu-core \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY pyproject.toml uv.lock ./
ENV UV_LINK_MODE=copy
RUN uv sync --locked

# Copy application code
COPY . .

ENV PYTHONPATH=/app
EXPOSE 8000

# WORKERS and TIMEOUT are set via env variables at runtime
# Supports both WORKERS and WEB_CONCURRENCY env vars (Railway uses WEB_CONCURRENCY)
# Defaults: WORKERS=1 for Railway compatibility, TIMEOUT=75
CMD ["sh", "-c", "uv run gunicorn api:app -w ${WORKERS:-${WEB_CONCURRENCY:-1}} -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --timeout ${TIMEOUT:-75} --graceful-timeout 30 --keep-alive 65"]
