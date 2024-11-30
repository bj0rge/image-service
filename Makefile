run:
	docker-compose up --build

dev:
	(cd image-cache && npm run dev) & (cd image-processor && npm run dev) && wait

stop:
	docker-compose down

clean:
	docker-compose down --volumes --remove-orphans
