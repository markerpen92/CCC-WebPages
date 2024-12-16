FROM denoland/deno:alpine-1.46.3

EXPOSE 8000

COPY . /app

WORKDIR /app

CMD ["deno" , "run", "--allow-net", "--allow-read", "--allow-write", "app.js"]