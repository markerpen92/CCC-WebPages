FROM postgres:13

COPY *.sql /docker-entrypoint-initdb.d/
COPY ./testdata/*.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=addrbook

EXPOSE 5432
