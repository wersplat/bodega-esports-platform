# 1) Start from slim Python
FROM python:3.11-slim

# 2) Install Tesseract + OpenCV system deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      tesseract-ocr \
      libgl1 libglib2.0-0 libsm6 libxrender1 libxext6 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3) Copy requirements
COPY requirements.txt ./

# 4) Install everything except torch/torchvision
RUN grep -vE '^(torch|torchvision)' requirements.txt > req_no_torch.txt && \
    pip install --no-cache-dir -r req_no_torch.txt

# 5) Install PyTorch with CUDA support (e.g. CUDA 11.8 wheels)
#    Pin versions so we pull +cu118 builds directly :contentReference[oaicite:0]{index=0}
RUN pip install --no-cache-dir \
      torch==2.0.1+cu118 \
      torchvision==0.15.2+cu118 \
      --extra-index-url https://download.pytorch.org/whl/cu118

# 6) Copy the rest of your code
COPY . .

# 7) Ensure folders and placeholder files exist
RUN mkdir -p toProcess/images toProcess/json processed/images processed/json && \
    touch toProcess/images/.placeholder toProcess/json/.placeholder processed/images/.placeholder processed/json/.placeholder

# 8) Run our loop
ENTRYPOINT ["python","entrypoint.py"]
