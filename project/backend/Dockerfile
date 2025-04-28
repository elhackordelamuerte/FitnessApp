# Use Node official image
FROM node:20

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app source
COPY . .

# Expose server port
EXPOSE 3000

# Start server

CMD ["npm", "run", "start"]
