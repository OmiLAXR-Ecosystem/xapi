# Common tasks for the xAPI definitions registry. Run `make` to list them.

PYTHON ?= python3
SITE   := site
# Branch that check-definitions compares against (renames, deletions, new files)
BASE   ?= origin/main

.DEFAULT_GOAL := help
.PHONY: help install dev build preview format check-format check-definitions check clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Install the website dependencies (npm ci)
	cd $(SITE) && npm ci

$(SITE)/node_modules: $(SITE)/package-lock.json
	cd $(SITE) && npm ci
	@touch $@

dev: $(SITE)/node_modules ## Run the website locally (http://localhost:4321/xapi)
	cd $(SITE) && npm run dev

build: $(SITE)/node_modules ## Build the website; fails on invalid definitions
	cd $(SITE) && npm run build

preview: build ## Serve the built website locally
	cd $(SITE) && npm run preview

format: ## Normalize the formatting of all definition files
	$(PYTHON) scripts/format-definitions.py

check-format: ## Fail if a definition file is not normalized
	$(PYTHON) scripts/format-definitions.py --check

check-definitions: ## Check the rules of CONTRIBUTING.md, changes against BASE (default origin/main)
	$(PYTHON) scripts/check-definitions.py --base $(BASE)

check: check-format check-definitions build ## Run all checks (formatting, rules, website build)

clean: ## Remove website build output
	rm -rf $(SITE)/dist $(SITE)/.astro
