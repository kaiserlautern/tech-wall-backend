FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

ENV PORT=4000

# Optional: Initialize sqlite db by starting the app
CMD ["npm", "start"]
