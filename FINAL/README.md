# Traefik-Flask-PostgreSQL

## Apache & Nginx (test)

* Apache

    [Simple Apache Dockerfile & html](https://github.com/XuanLin123/Traefik-Flask-PostgreSQL/tree/main/apache)

* Nginx

    [Simple Nginx Dockerfile & html](https://github.com/XuanLin123/Traefik-Flask-PostgreSQL/tree/main/nginx)

* YAML

    [Apache & Nginx](https://github.com/XuanLin123/Traefik-Flask-PostgreSQL/tree/main/YAML/Apache%20%26%20Nginx)

## Route & LoadBalancer


* PostgreSQL

    
    [DB directory](https://github.com/XuanLin123/Traefik-Flask-PostgreSQL/tree/main/db)
    1. initialize database
    2. testdata
    3. Dockerfile

* Flask

    [Flask-app directory](https://github.com/XuanLin123/Traefik-Flask-PostgreSQL/tree/main/flask-app)
    1. templates directory
    2. requirements.txt
    3. Flask app.py
    4. Dockerfile

* Run

    will start 1 db, apache, nginx and 5 flask-app
    ```
    docker-compose up -d
    ```
    connect http://localhost:8080/ check dashboard

## Step by step

https://hackmd.io/@LSX-0123/B1Wq_-o4A