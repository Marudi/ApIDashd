
# ---- Build Stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Copy only package.json and package-lock.json first for caching npm ci step
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# ---- Production Stage ----
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy built app from previous stage
COPY --from=builder /app/dist .

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
