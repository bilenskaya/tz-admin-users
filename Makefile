REPORTER=spec
TESTS=$(shell find ./tests/ -type f -name "*.coffee")

tests:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require chai \
		--compilers coffee:coffee-script \
		--reporter $(REPORTER) \
		--timeout 2000 \
		$(TESTS)

.PHONY: tests