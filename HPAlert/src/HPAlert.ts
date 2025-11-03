import { NotificationManager } from '@ryelite/core';
import { Plugin } from '@ryelite/core';
import { SettingsTypes } from '@ryelite/core';
import { SoundManager } from '@ryelite/core';
import LowHPSound from "../resources/sounds/heartbeat.mp3";

export default class HPAlert extends Plugin {
    pluginName = 'HP Alert';
    author = 'Highlite';
    private notificationManager: NotificationManager = new NotificationManager();
    private soundManager: SoundManager = new SoundManager();

    private doNotify = true;


    constructor() {
        super();
        this.settings.volume = {
            text: 'Volume',
            type: SettingsTypes.range,
            value: 50,
            min: 0,
            max: 100,
            callback: () => {}, //NOOP
        };
        this.settings.activationPercent = {
            text: 'Activation Percent',
            type: SettingsTypes.range,
            value: 50,
            min: 1,
            max: 99,
            callback: () => {}, //NOOP
        };
        this.settings.notification = {
            text: 'Notification',
            type: SettingsTypes.checkbox,
            value: false,
            callback: () => {}, //NOOP
        };
        this.settings.sound = {
            text: 'Sound',
            type: SettingsTypes.checkbox,
            value: true,
            callback: () => {}, //NOOP
        };
        this.settings.useCustomSound = {
            text: 'Use Custom Sound',
            type: SettingsTypes.checkbox,
            value: false,
            callback: () => {}, //NOOP
        };
        this.settings.customSoundUrl = {
            text: 'Custom Sound URL',
            type: SettingsTypes.text,
            value: '',
            callback: () => {
                // Optional: Log when URL changes
                const url = this.settings.customSoundUrl.value as string;
                if (url) {
                    this.log(`Custom sound URL updated: ${url}`);
                }
            },
        };
        this.settings.testCustomSound = {
            text: 'Test Custom Sound',
            type: SettingsTypes.button,
            value: 'Play Sound',
            callback: () => this.testPlayCustomSound(),
        };

        this.settings.testSound = {
            text: 'Test Sound',
            type: SettingsTypes.button,
            value: 'Play Sound',
            callback: () => this.testPlaySound(),
        };
    }

    init(): void {
        this.log('Initializing');
    }

    start(): void {
        this.log('Started');
    }

    stop(): void {
        this.log('Stopped');
    }

    private testPlayCustomSound(): void {
        try {
            const customSoundUrl = this.settings.customSoundUrl?.value as string;
            const volume = (this.settings.volume?.value as number) / 100.0;

            this.log(`Testing custom sound: ${customSoundUrl.trim()}`);
            this.soundManager.playSound(customSoundUrl.trim() || LowHPSound, volume);

        } catch (error) {
            this.error(`Error testing custom sound: ${error}`);
            alert('Failed to play custom sound. Please check the URL and try again.');
        }
    }

    private testPlaySound(): void {
        try {
            const customSoundUrl = this.settings.customSoundUrl?.value as string;
            const volume = (this.settings.volume?.value as number) / 100.0;

            this.log(`Testing sound...`);
            this.soundManager.playSound(LowHPSound,volume);

        } catch (error) {
            this.error(`Error testing sound: ${error}`);
            alert('Failed to play sound. Please check the URL and try again.');
        }
    }

    GameLoop_update(): void {
        const player = this.gameHooks.EntityManager.Instance._mainPlayer;
        const localNPCs = this.gameHooks.EntityManager.Instance._npcs;

        if (!player?._hitpoints) {
            return;
        }

        if (
            player._hitpoints._currentLevel / player._hitpoints._level <
            (this.settings.activationPercent?.value as number) / 100
        ) {
            if (this.doNotify && this.settings.notification?.value) {
                this.doNotify = false;
                try {
                    this.notificationManager.createNotification(
                        `${player._name} is low on health!`
                    );
                } catch(e) {
                    this.error("Unable to create HP notification");
                }
            }

            // Check if any entity in localEntities (map object) .CurrentTarget is the player
            const isPlayerTargeted = localNPCs.entries().some(([_, npc]) => {
                if (
                    npc._currentTarget !== undefined &&
                    npc._currentTarget !== null &&
                    npc.Def.Combat != null
                ) {
                    if (npc._currentTarget._entityId == player._entityId) {
                        return true;
                    }
                }
            });

            if (
                this.settings.sound?.value &&
                (isPlayerTargeted || (player.CurrentTarget !== undefined &&
                    player.CurrentTarget !== null &&
                    player.CurrentTarget.Combat != null))
            ) {
                this.soundManager.playSound(
                    // Use custom sound if enabled and url exists, otherwise use default
                    this.settings.useCustomSound?.value && this.settings.customSoundUrl.value != '' ? this.settings.customSoundUrl.value as string :
                        LowHPSound,
                    (this.settings.volume!.value as number) / 100.0
                );
            }
        } else {
            this.doNotify = true;
        }
    }
}
