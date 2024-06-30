FROM node:18.19.1-alpine AS builder

# Install angular cli
RUN npm install -g @angular/cli

# Create a directory called /app
WORKDIR /app

# Ensure that package.json has been put first
COPY package.json .

# After that, move package-lock.json to ensure `npm ci` can run smoothly
COPY package-lock.json .

# Then run npm ci to install all dependencies
# Read [https://stackoverflow.com/questions/52499617/what-is-the-difference-between-npm-install-and-npm-ci] to learn more
RUN npm ci

# Next, copy all remaining files to /app
COPY . .

# Build the app
# RUN ng build

# Expose port 4200
# EXPOSE 4200

# Run the app
RUN ng build --configuration production

# # Get the nginx image
FROM nginx:alpine

# Copy the dist folder from the builder stage to the nginx folder
COPY --from=builder /app/dist/tgvcinema /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
