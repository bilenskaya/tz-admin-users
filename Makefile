REPORTER=spec
TESTS=$(shell find ./tests -type f -name "*.coffee")

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require chai \
		--compilers coffee:coffee-script \
		--reporter $(REPORTER) \
		--timeout 2000 \
		--watch \
		$(TESTS)

.PHONY: test