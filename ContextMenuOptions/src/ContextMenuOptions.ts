import { Plugin } from '@ryelite/core';
import { ContextMenuManager } from '@ryelite/core';

export default class ContextMenuOptions extends Plugin {
    pluginName = 'Context Menu Options';
    author = 'Highlite';
    contextMenuManager: ContextMenuManager = new ContextMenuManager();

    constructor() {
        super();
        this.settings.enable = {
            text: 'Enable',
            type: 0,
            value: false, // Default to false
            callback: () => {}, //NOOP
        };

        this.settings.prioritizePickpocket = {
            text: 'Prioritize Pickpocket',
            type: 0,
            value: false,
            callback: this.enablePrioritizePickpocketChanged,
        };

        this.settings.prioritizeAttack = {
            text: 'Prioritize Attack',
            type: 0,
            value: false,
            callback: this.enablePrioritizeAttackChanged,
        };


        this.settings.deprioritizeTalkTo = {
            text: 'Deprioritize Talk To',
            type: 0,
            value: false,
            callback: this.enableDeprioritizeTalkToChanged,
        };
    }

    init(): void {
        this.log('Initialized');
    }

    start(): void {
        this.log('Started');
        this.enablePrioritizeAttackChanged();
        this.enablePrioritizePickpocketChanged();
        this.enableDeprioritizeTalkToChanged();
    }

    stop(): void {
        this.log('Stopped');
        this.enablePrioritizeAttackChanged();
        this.enablePrioritizePickpocketChanged();
        this.enableDeprioritizeTalkToChanged();
    }

    enableDeprioritizeTalkToChanged() {
        if (
            this.settings.deprioritizeTalkTo?.value &&
            this.settings.enable?.value
        ) {
            this.contextMenuManager.SetGameWorldActionMenuPosition(
                'Talk To',
                100000
            );
        } else {
            this.contextMenuManager.RemoveGameWorldActionMenuPosition(
                'Talk To'
            );
        }
    }

    enablePrioritizePickpocketChanged() {
        if (
            this.settings.prioritizePickpocket?.value &&
            this.settings.enable?.value
        ) {
            this.contextMenuManager.SetGameWorldActionMenuPosition(
                'Pickpocket',
                -1
            );
        } else {
            this.contextMenuManager.RemoveGameWorldActionMenuPosition(
                'Pickpocket'
            );
        }
    }

    enablePrioritizeAttackChanged() {
        if (
            this.settings.prioritizeAttack?.value &&
            this.settings.enable?.value
        ) {
            this.contextMenuManager.SetGameWorldActionMenuPosition(
                'Attack',
                -1
            );
        } else {
            this.contextMenuManager.RemoveGameWorldActionMenuPosition('Attack');
        }
    }
}
