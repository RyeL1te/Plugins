import {ActionState, ContextMenuManager, ContextMenuTypes, EntityType, Plugin} from '@ryelite/core';

export default class LookupPlugin extends Plugin {
    pluginName = "Wiki Lookup";
    author: string = "Highlite";

    private contextMenuManager: ContextMenuManager = new ContextMenuManager();

    constructor() {
        super()
    };

    init(): void {
        this.log("Wiki Lookup Plugin initializing");
    }

    start(): void {
        this.log("Wiki Lookup Plugin started");
        this.contextMenuManager.AddInventoryItemMenuAction('Lookup', this.handleInventoryLookup, ActionState.Any, ContextMenuTypes.Any);
        this.contextMenuManager.AddGameWorldMenuAction('Lookup', this.handlePlayerLookup, EntityType.Player);
        this.contextMenuManager.AddGameWorldMenuAction('Lookup', this.handleWorldObjectLookup, EntityType.WorldObject);
        this.contextMenuManager.AddGameWorldMenuAction('Lookup', this.handleNPCLookup, EntityType.NPC);
        this.contextMenuManager.AddGameWorldMenuAction('Lookup', this.handleWorldObjectLookup, EntityType.GroundItem);
    }

    stop(): void {
        this.log("Wiki Lookup Plugin stopped");
        this.contextMenuManager.RemoveInventoryItemMenuAction('Lookup', this.handleInventoryLookup, ActionState.Any, ContextMenuTypes.Any);
        this.contextMenuManager.RemoveGameWorldMenuAction('Lookup', this.handlePlayerLookup, EntityType.Player);
        this.contextMenuManager.RemoveGameWorldMenuAction('Lookup', this.handleWorldObjectLookup, EntityType.WorldObject);
        this.contextMenuManager.RemoveGameWorldMenuAction('Lookup', this.handleNPCLookup, EntityType.NPC);
        this.contextMenuManager.RemoveGameWorldMenuAction('Lookup', this.handleWorldObjectLookup, EntityType.GroundItem);
    }

    handleInventoryLookup(actionInfo: any, clickInfo: any): void {
        const item = actionInfo.getItem();
        const itemId = item._id;
        window.open(
            `https://highspell.wiki/w/Special:ItemLookup?id=${itemId}}`
        );
    }

    handlePlayerLookup(actionInfo: any, clickInfo: any): void {
        const player = actionInfo.getEntity();
        const playerName = player._name;
        window.open(`https://highspell.com/hiscores/player/${playerName}`);
    }

    //It is possible to look up objects by id, object._def._id, however, the wiki does not store the ID's currently.
    //They also struggle with figuring out how to get pictures of everything without manually doing so.
    //They ALSO don't want to clutter the database with useless entries, bush, flower, rock.
    // handleWorldObjectLookup(actionInfo: any, clickInfo: any): void {
    //     const object = actionInfo.getEntity();
    //     const objectId = object.def._id;
    //     window.open(`https://highspell.wiki/w/Special:ObjectLookup?id=${objectId}`);
    // }
    //This is just an example, but changing the URL may be all that's needed once/if the wiki is ready.
    //If this is ever switched on, make sure to update "groundItem" as well since that is most likely not World
    //Entities but items on the ground. So it will most likely go through handleInventoryLookup.


    handleWorldObjectLookup(actionInfo: any, clickInfo: any): void {
        const object = actionInfo.getEntity();
        const objectName = object._name;
        window.open(`https://highspell.wiki/w/${objectName.replace(' ', '_')}`);
    }

    private handleNPCLookup(actionInfo: any, clickInfo: any): void {
        const object = actionInfo.getEntity();
        const objectId = object._def._id;
        window.open(`https://highspell.wiki/w/Special:NPCLookup?id=${objectId}`);
    }
}
