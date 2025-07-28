FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production && \
    npm cache clean --force

COPY . .

# Verify input directory exists
RUN mkdir -p /app/input/PDFs && \
    mkdir -p /app/output

USER node

CMD ["node", "runner.js"]