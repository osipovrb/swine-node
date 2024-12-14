FROM node:22.10

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

CMD ["node", "dist/main.js"]