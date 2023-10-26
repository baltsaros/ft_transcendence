all:	build

build:
	docker-compose --env-file=./.env up --build

silent:
	docker-compose --env-file=./.env up -d --build

prod:
	docker-compose -f docker-compose.prod.yml --env-file=.env up -d --build

start:
	docker-compose start

stop:
	docker-compose stop

down:
	docker-compose down

clean: down
	docker system prune

fclean: stop clean
	docker system prune -a -f
	docker volume prune -f