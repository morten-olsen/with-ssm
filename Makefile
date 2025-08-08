node_modules:
	pnpm install

build: node_modules
	pnpm run build

build-dev: node_modules
	pnpm run build:dev

test: node_modules
	pnpm run test

install: node_modules
	npm link