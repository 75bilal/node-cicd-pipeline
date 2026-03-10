FROM node:lts-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production


COPY package*.json ./



RUN npm ci --only=production



COPY . .

EXPOSE 5000

# Create a non-root user to run the app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

USER nodejs

CMD ["npm", "start"]
