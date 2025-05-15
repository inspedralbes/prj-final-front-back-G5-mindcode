# Usa la imagen oficial de Node.js
FROM node:16

# Crea un directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de configuración del proyecto al contenedor
COPY package*.json ./

# Instala las dependencias de tu proyecto
RUN npm install

# Copia todos los archivos del proyecto al contenedor
COPY . .

# Expón el puerto en el que tu aplicación se ejecutará
EXPOSE 3000

# Comando para arrancar tu servidor
CMD [ "node", "server.js" ]
