FROM node:18.16-alpine

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

# Expose port 3001
EXPOSE 3001

# Run our backend server
CMD ["npm", "start"]