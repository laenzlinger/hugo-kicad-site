.PHONY: help serve build clean kibot assembly vendor

KICAD_DIR := ../example
KIBOT_CONFIG := Arduino_Uno.kibot.yaml
SCHEMATIC := Arduino_Uno.kicad_sch
PCB := Arduino_Uno.kicad_pcb

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z0-9_-]+:.*##/ {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

serve: ## Serve site locally with live reload
	hugo server -D --navigateToChanged

build: ## Build the site
	hugo --minify

clean: ## Clean generated files
	rm -rf public resources static/3D static/BoM static/Schematic static/kicad static/assembly

vendor: ## Update vendored theme module
	hugo mod get -u github.com/laenzlinger/hugo-kicad-site && hugo mod vendor

kibot: ## Run KiBot and copy outputs into static
	cd $(KICAD_DIR) && kibot -e $(SCHEMATIC) -b $(PCB) -c $(KIBOT_CONFIG) -d generated
	rsync -a $(KICAD_DIR)/generated/ static/
	mkdir -p static/kicad
	cp $(KICAD_DIR)/$(SCHEMATIC) $(KICAD_DIR)/$(PCB) static/kicad/

assembly: ## Copy assembly STEP model into static
	mkdir -p static/assembly
	cp $(KICAD_DIR)/generated/Assembly/assembly-pcb.step static/assembly/

all: kibot assembly serve ## Run KiBot, copy assembly, and serve
