import {Plugin, SettingsTypes, UIManager } from "@highlite/core";
import { PanelManager } from "@highlite/core";
import lookupTable from './lookupTable.json';

export default class ImprovedSkillGuides extends Plugin {
    panelManager: PanelManager = new PanelManager();
    pluginName = "ImprovedSkillGuides";
    author: string = "0rangeYouGlad";
    private uiManager = new UIManager();
    private currentTooltip: { hide: () => void } | null = null;
    private currentTooltipAnchor: HTMLElement | null = null;

    constructor() {
        super();

        this.pluginName = "Improved Skill Guides";
        this.author = "0rangeYouGlad";

        this.settings.showRecipe = {
            text: "Show Recipes",
            type: SettingsTypes.checkbox,
            value: true,
            callback: () => {},
        };

        this.settings.showXp = {
            text: "Show XP",
            type: SettingsTypes.checkbox,
            value: true,
            callback: () => {},
        };

        this.settings.showTool = {
            text: "Show Tool",
            type: SettingsTypes.checkbox,
            value: false,
            callback: () => {},
        };

        this.settings.showFacility = {
            text: "Show Facility",
            type: SettingsTypes.checkbox,
            value: false,
            callback: () => {},
        };

        this.settings.showMaxHit = {
            text: "Show Max Hit",
            type: SettingsTypes.checkbox,
            value: true,
            callback: () => {},
        };

        this.settings.showSpellCosts = {
            text: "Show Spell Costs",
            type: SettingsTypes.checkbox,
            value: true,
            callback: () => {},
        };

        this.settings.showItemEffects = {
            text: "Show Misc Notes",
            type: SettingsTypes.checkbox,
            value: true,
            callback: () => {},
        };

        this.settings.showItemTooltips = {
            text: "Show Output Item Tooltips",
            type: SettingsTypes.checkbox,
            value: true,
            callback: () => {},
        };
    };

    init(): void {
    }

    start(): void {
        this.log("ImprovedSkillGuides started");
    }

    stop(): void {
        this.log("ImprovedSkillGuides stopped");

        this.hideTooltip();
    } 

    private hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.hide();
            this.currentTooltip = null;
        }
    }

    private showTooltip(anchor: HTMLElement, id: number) {
        if (this.currentTooltip) {
            this.currentTooltip.hide();
        }

        if (isNaN(id)) return;

        this.currentTooltipAnchor = anchor;

        // Use coordinates from the mouse event if available, otherwise use element position
        let x = 0;
        let y = 0;

        const rect = anchor?.getBoundingClientRect();
        x = rect.right;
        y = rect.top;

        // Use UIManager to draw the tooltip
        try {
           this.currentTooltip = this.uiManager.drawItemTooltip(id, x, y);
        } catch (error) {
            this.log(`Error showing tooltip: ${error}`);
        }
    }

    // TODO - move this into a manager like https://github.com/Highl1te/Core/commit/a9011e05b0a4a410e4f8a9a3dbd9873e92a0d4c1
    GameLoop_update() {
        let skillMenu = document.getElementById("hs-skill-guide-menu");
    

        if(!skillMenu) {
            this.hideTooltip();
            return
        };
        
        let childSkillEntries = Array.from(skillMenu.getElementsByClassName("hs-unlockable-skill-panel"));

        if(!childSkillEntries.length || !this.currentTooltipAnchor || !this.currentTooltipAnchor.checkVisibility()) {
            this.hideTooltip();
        }

        childSkillEntries.forEach((child) => {
            let subject = child.childNodes[1].childNodes[0].textContent || ""; 
            // this.log("Processing subject: " + subject);
            // this.log("Lookuptable: " + JSON.stringify(lookupTable[subject]));
          if (lookupTable[subject] && !child.getAttribute('data-skill-guide-processed')) {

            child.setAttribute('data-skill-guide-processed', "true");

            Object.entries(lookupTable[subject]).forEach((line) => {

                let textContent = '';

                if(line[0] === "itemID") {
                    if(!this.settings.showItemTooltips.value) {
                        // this.log("Skipping Item Tooltip");
                    }
                    else {
                        child.addEventListener('mouseenter', e =>
                         this.showTooltip(child, line[1])
                     );
                        child.addEventListener('mouseleave', () => this.hideTooltip());
                    }
                    
                }
                else if(line[0] === "recipe") {
                    if(!this.settings.showRecipe.value) {
                        // this.log("Skipping Recipe");
                    }
                    else {

                        // this.log("Showing recipe for " + lookupTable[subject]["itemID"]);

                        const itemDef =
                        this.gameHooks.ItemDefinitionManager._itemDefMap.get(
                            lookupTable[subject]["itemID"]
                        );

                        if(!itemDef) {
                            this.error(`Unable to find item def for subject ${subject} at ID ${lookupTable[subject]["itemID"]}`);
                        }

                        // Recipe (if item has crafting recipe)
                        if (itemDef && itemDef._recipe && itemDef._recipe._ingredients && itemDef._recipe._ingredients.length > 0) {
                            itemDef._recipe._ingredients.forEach((ingredient: any) => {
                                const ingredientDiv = document.createElement('div');
                                ingredientDiv.className = 'hs-ui-item-tooltip-effect';
                                if(textContent) {
                                    textContent += " ";
                                }
                                try {
                                    const ingredientDef = this.gameHooks.ItemDefinitionManager._itemDefMap.get(ingredient._itemId);
                                    const ingredientName = ingredientDef?._nameCapitalized || ingredientDef?._name || `Item ${ingredient._itemId}`;
                                    textContent += `${ingredient._amount}x ${ingredientName}`;
                                } catch {
                                    textContent += `${ingredient._amount}x Item ${ingredient._itemId}`;
                                }
                            });
                        }

                        if(!textContent) {
                            textContent = `${line[1]}`; // Recipe fallback
                        }



                    }
                } else if(line[0] === "maxHit" && !this.settings.showMaxHit.value) {
                    // this.log("Skipping Max Hit");
                } else if(line[0] === "spellRecipe" && !this.settings.showSpellCosts.value) {
                    // this.log("Skipping Spell Cost");
                } else if(line[0] === "xp" && !this.settings.showXp.value) {
                    // this.log("Skipping XP");
                } else if(line[0] === "facility" && !this.settings.showFacility.value) {
                    // this.log("Skipping Facility");
                } else if(line[0] === "tool" && !this.settings.showTool.value) {
                    // this.log("Skipping Tool");
                } else if(line[0] === "itemEffects" && !this.settings.showItemEffects.value) {
                    // this.log("Skipping Item Effects");
                } else {

                    textContent = `${line[1]}`;
                }

                
                    // this.log("Creating for " + subject);
                    let newText = document.createElement("span");
                    newText.className = "hs-text--yellow";
                    newText.style = "color: rgb(240, 230, 140) !important;";
                    newText.innerText = `${textContent}`;
                    child.childNodes[1].appendChild(newText);
            })


            }
        })
    }
}
