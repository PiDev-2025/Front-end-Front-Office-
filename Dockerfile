# Utiliser Node.js 22 comme base
FROM node:22

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Copier le reste des fichiers
COPY . .


EXPOSE 3000

CMD ["npm", "start"]
