.PHONY: start podi

start:
	npx react-native start --reset-cache --verbose 

podi:
	npx pod-install

reset:
	rm -rf node_modules
	npm install
	npx pod-install