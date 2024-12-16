FROM Docker_Image

EXPOSE 8000

COPY . /app

WORKDIR /app

CMD ["deno" , "run", "--allow-net", "--allow-read", "--allow-write", "oakme.ts"]