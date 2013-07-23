REPORTER=spec
TESTS=$(shell find ./tests -type f -name "*.coffee")

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--compilers coffee:coffee-script \
		--reporter $(REPORTER) \
		--timeout 10000 \
		$(TESTS)

.PHONY: test