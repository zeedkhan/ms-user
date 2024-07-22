FROM node:18-alpine

# Define build arguments
ARG RESEND_API_KEY
ARG DATABASE_URL

# Use the build arguments to set environment variables
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV DATABASE_URL=$DATABASE_URL

# Echo the environment variables during build
RUN echo "RESEND_API_KEY is $RESEND_API_KEY"
RUN echo "DATABASE_URL is $DATABASE_URL"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g prisma


EXPOSE 8002

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && node ./src/index.js"]