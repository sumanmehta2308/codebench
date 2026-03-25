FROM node:20

# 1. Install the compilers directly so we don't need "Docker-in-Docker"
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    openjdk-17-jdk-headless \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app 

# 2. Create the temp folder for user code
RUN mkdir -p /app/temp && chmod 777 /app/temp

COPY package*.json ./ 
RUN npm install 
COPY . . 

EXPOSE 7001
# 3. Start the Judge
CMD ["node", "index.js"]