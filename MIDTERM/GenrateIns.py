import os
import yaml

def GeneratePortingTable(projects): 
    PortingTable = {}
    allowingports = [8000, 8001, 8002, 8003, 8004]

    for idx, proj in enumerate(projects): 
        if idx < len(allowingports):
            PortingTable[proj] = allowingports[idx]
        else:
            raise ValueError("Not enough ports available for all projects")

    return PortingTable



def GenerateDockerfiles(upload_folder , docker_compose_content , docker_imgs , docker_template): 
    projects = [f.name for f in os.scandir(upload_folder) if f.is_dir()]
    hostnames = [f"{project}.localhost" for project in projects]
    PortingTable = GeneratePortingTable(projects)

    for idx, folder in enumerate(projects):
        service_name = f"service_{idx+1}"
        hostname = hostnames[idx]
        host_port = PortingTable[folder]
        img_idx = -1 if idx >= len(docker_imgs) else idx

        with open(docker_template , "r") as template_file:
            template_content = template_file.read()

        for file_name in reversed(os.listdir(f"{upload_folder}/{folder}")) : 
            if file_name.endswith(".js") or file_name.endswith(".ts") : 
                print(img_idx)
                dockerfile_content = template_content.replace("{MAIN_FILE}", file_name).replace("{Docker_Image}" , docker_imgs[img_idx])
                break

        with open(os.path.join(f"{upload_folder}/{folder}", "Dockerfile"), "w") as dockerfile:
            dockerfile.write(dockerfile_content)

        docker_compose_content["services"][service_name] = {
            "build": f"{os.getcwd()}/{upload_folder}/{folder}",
            "ports": [f"{host_port}:8000"],
            "labels": [
                "traefik.enable=true",
                f"traefik.http.routers.{service_name}.rule=Host(`{hostname}`)",
                f"traefik.http.services.{service_name}.loadbalancer.server.port=8000"
            ]
        }

    return docker_compose_content



def BuildTraefikService(docker_compose_content=None) : 
    docker_compose_content = {
        "version": "3.8",
        "services": {},
        "volumes": {
            "db_data": {}
        }
    }
    traefik_service = {
        "image": "traefik:v2.5",
        "command": [
            "--api.insecure=true",
            "--providers.docker=true",
            "--entrypoints.web.address=:80"
        ],
        "ports": [
            "80:80",
            "8080:8080"
        ],
        "volumes": [
            "/var/run/docker.sock:/var/run/docker.sock",
            "./traefik/traefik.yml:/traefik.yml"
        ]
    }

    docker_compose_content["services"]["traefik"] = traefik_service
    return docker_compose_content



def GenerateDockers(upload_folder="upload-projects" , docker_imgs=["denoland/deno:alpine-1.46.3"] , docker_template="Dockerfile-template" , enable_traefik=True) : 
    for img in docker_imgs : 
        if not bool(os.popen(f"docker images -q {img}").read().strip()) : 
            print(f"Image {img} not found. Pulling it...")
            os.system(f"docker pull {img}") == 0 or print(f"Failed to pull image: {img}")

    DockerComposeContent = BuildTraefikService() if enable_traefik else None
    DockerComposeContent = GenerateDockerfiles(upload_folder , DockerComposeContent , docker_imgs , docker_template)

    with open("docker-compose.yml", "w") as DockerComposeFile :
        yaml.dump(DockerComposeContent , DockerComposeFile , default_flow_style=False)
    print("docker-compose.yml and Dockerfiles have been generated.")

    os.system(f"docker compose up -d") and print("docker compose successfully.")


if __name__ == "__main__" : 
    GenerateDockers()