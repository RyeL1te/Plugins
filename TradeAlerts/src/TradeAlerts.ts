import { Plugin } from '@ryelite/core'
import { SettingsTypes } from '@ryelite/core'
import { NotificationManager } from '@ryelite/core'
import { SoundManager } from '@ryelite/core'

// @ts-ignore
import TradeAlert from '../resources/sounds/trade_alert.mp3';

export default class TradeAlerts extends Plugin {
    pluginName = 'Trade Alerts';
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
            callback: () => Function('NOOP'),
        };
        this.settings.notification = {
            text: 'Notification',
            type: SettingsTypes.checkbox,
            value: false,
            callback: () => Function('NOOP'),
        };
        this.settings.sound = {
            text: 'Sound',
            type: SettingsTypes.checkbox,
            value: true,
            callback: () => Function('NOOP'),
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

    SocketManager_handleTradeRequestedPacket(players: any) {
        if (
            players[0] !==
            this.gameHooks.EntityManager.Instance.MainPlayer.EntityID &&
            players.includes(
                this.gameHooks.EntityManager.Instance.MainPlayer.EntityID
            )
        ) {
            if (this.settings.notification?.value as boolean) {
                this.gameHooks.EntityManager.Instance.Players.forEach(
                    (player: any) => {
                        if (player.EntityID === players[0]) {
                            this.notificationManager.createNotification(
                                'You have received a trade request from ' +
                                player.Name
                            );
                            return;
                        }
                    }
                );
            }

            if (this.settings.sound?.value as boolean) {
                this.soundManager.playSound(
                    TradeAlert,
                    (this.settings.volume?.value as number) / 100
                );
            }
        }
    }
}
