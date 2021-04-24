FROM node:12 as api
RUN mkdir /usr/src/api
WORKDIR /usr/src/api
COPY package*.json ./
RUN npm install --production --silent
COPY . .
EXPOSE 3000
CMD ["npm","start"]