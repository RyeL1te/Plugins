import { Plugin } from '@ryelite/core';
import { SettingsTypes } from '@ryelite/core';
import { NotificationManager } from '@ryelite/core';
import { SoundManager } from '@ryelite/core';
import PMAlert from "../resources/sounds/pm_alert.mp3";

export default class PMAlerts extends Plugin {
    pluginName = 'PM Alerts';
    author = 'Highlite';
    private notificationManager: NotificationManager =
        new NotificationManager();
    private soundManager: SoundManager = new SoundManager();

    constructor() {
        super();
        this.settings.volume = {
            text: 'Volume',
            type: SettingsTypes.range,
            value: 50,
            min: 0,
            max: 100,
            callback: () => {}, //TODO
        };
        this.settings.notification = {
            text: 'Notification',
            type: SettingsTypes.checkbox,
            value: false,
            callback: () => {}, //TODO
        };
        this.settings.sound = {
            text: 'Sound',
            type: SettingsTypes.checkbox,
            value: true,
            callback: () => {}, //TODO
        };
    }

    start(): void {
        this.log('Started');
    }

    stop(): void {
        this.log('Stopped');
    }

    init(): void {
        this.log('Initialized');
    }

    // a is the username of the sender
    // e is the type of message, "From" or "To"
    // h is the message content (Filtered)
    // i is the message content as well? (No Filter)
    // l is 4?
    // n is 0
    // o is 0 (2 logged in/logged out)
    // r is true
    // s is false
    // t is true
    PrivateChatMessageList_addChatMessage(
        a, e, h, i, l, n, o, r, s, t
    ) {
        if (e && e === "From") {
            if (this.settings.notification!.value as boolean) {
                this.notificationManager.createNotification(`You have recieved a private message from ${a}`);
            }
            if (this.settings.sound!.value as boolean) {
                this.soundManager.playSound(PMAlert,
                    (this.settings.volume!.value as number) / 100
                );
            }
        }
        }
}
