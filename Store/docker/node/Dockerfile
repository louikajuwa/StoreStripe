FROM node:20-alpine

WORKDIR /usr/src/app

COPY realtime/package.json realtime/package-lock.json* ./

RUN npm install

COPY realtime/ .

EXPOSE 3000

CMD ["node", "server.js"]
