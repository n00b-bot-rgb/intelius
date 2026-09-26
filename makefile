setup:
	node src/workflow/setup.js
preflight:
	node src/workflow/preflight.js
workflow:
	yarn workflow
cleanlogs:
	rm logs/*
cleanscreenshots:
	rm screenshots/*
cleanall:
	make cleanlogs
	make cleanscreenshots
newstorage:
	cp storage/out.csv.bak storage/out.csv