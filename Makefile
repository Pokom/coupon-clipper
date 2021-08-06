test-debug: install index.js
	DEBUG=pw:api node index.js

install: package.json
	npm install

test: index.js
	node index.js
