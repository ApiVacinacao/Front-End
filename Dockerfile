FROM node:18

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia só os arquivos necessários pra instalar as dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código (vai ser sobrescrito pelo volume no docker-compose)
COPY . .

# Expõe a porta padrão do Next.js
EXPOSE 3000
