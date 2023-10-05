all:	build

build:
	sudo docker-compose --env-file=./.env up --build

silent:
	sudo docker-compose --env-file=./.env up -d --build

stop:
	sudo docker-compose stop

down:
	sudo docker-compose down

clean: down
	sudo docker system prune

fclean: stop clean
	sudo docker system prune -a -f
	sudo docker volume prune -f