FROM node:14.10.1-alpine3.10
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
RUN npm install @vue/cli@4.5.4 -g
RUN npm audit fix
COPY . .
CMD ["npm", "run", "serve"]