import {Plugin, SettingsTypes} from "@highlite/core";
import { PanelManager, UIManager, UIManagerScope } from "@highlite/core";


import Click1 from "../resources/sounds/click_001.mp3";
import Click2 from "../resources/sounds/click_002.mp3";
import Click3 from "../resources/sounds/click_003.mp3";
import Click4 from "../resources/sounds/click_004.mp3";
import Click5 from "../resources/sounds/click_005.mp3";
import Select1 from "../resources/sounds/select_001.mp3";
import Select2 from "../resources/sounds/select_002.mp3";
import Select3 from "../resources/sounds/select_005.mp3";
import Select4 from "../resources/sounds/select_006.mp3";
import Tick2 from "../resources/sounds/tick_002.mp3";


export default class TickCounter extends Plugin {
    panelManager: PanelManager = new PanelManager();
    pluginName = "Tick Counter";
    author: string = "0rangeYouGlad";

    private tickCount = 0;

    
    private uiManager = new UIManager();
    private tickDisplayUi: HTMLElement | null = null;
    private tickCounterValueUI: HTMLElement | null = null;

    private allSounds = [
        Click1, Click2, Click3, Click4, Click5, Select1, Select2, Select3, Select4, Tick2
    ];


    constructor() {
        super()
        this.settings.displayTickCounter = {
            text: "Display Session Tick Count",
            type: SettingsTypes.checkbox,
            value: true,
            callback: () => this.exampleSettingCallback()
        },

        this.settings.enableMetronome = {
            text: "Enable Metronome",
            type: SettingsTypes.checkbox,
            value: true,
            callback: () => {}
        },

        this.settings.metronomeCount = {
            text: "Metronome Every X Ticks",
            type: SettingsTypes.range,
            value: 1,
            min: 1,
            max: 99999,
            callback: () => {}
        },

        this.settings.metronomeVolume = {
            text: "Metronome Volume",
            type: SettingsTypes.range,
            value: 100,
            min: 0,
            max: 100,
            callback: () => {}
        },

        this.settings.metronomeSoundPreset = {
            text: "Metronome Sound Preset",
            type: SettingsTypes.range,
            value: 0,
            min: 0,
            max: this.allSounds.length,
            callback: () => {}
        }

        this.settings.customSound = {
            text: "Custom Metronome Sound",
            type: SettingsTypes.text,
            value: "",
            callback: () => {}
        }
    };

    private exampleSettingCallback() {
        if(!this.settings.displayTickCounter.value) {
            this.tickDisplayUi.style.display = "none"
        } else {
            this.tickDisplayUi.style.display = ""
        }
    }

    private get_sound_from_preset() {

        if(this.settings.customSound.value) {
            return this.settings.customSound.value
        }

        if(this.allSounds[this.settings.metronomeSoundPreset.value]) {
            return `${this.allSounds[this.settings.metronomeSoundPreset.value]}`;
        }
        return this.allSounds[0];
    }

    init(): void {
    }

    GameLoop_update() {

        this.tickCount += 1;

        if(this.settings.enableMetronome.value && (this.tickCount % (Number(this.settings.metronomeCount.value)) === 0)) {
            let audioTag : HTMLAudioElement = document.createElement("audio");
            this.tickDisplayUi.appendChild(audioTag);
            audioTag.src = this.get_sound_from_preset();
            audioTag.volume = Math.min(1.0, Math.max(0.0, (this.settings.metronomeVolume.value * 0.01)));
            audioTag.play().then(() => {
                audioTag.addEventListener("ended", () => {
                    audioTag.remove();
                })
            })
        }

        if (this.tickCounterValueUI) {
            this.tickCounterValueUI.innerText = `Tick ${this.tickCount}`;
        } else {
            this.log("tick Counter UI Element not found.");
        }

    }

    start(): void {
        if (this.tickDisplayUi) {
            this.tickDisplayUi.remove();
            this.tickDisplayUi = null;
        }
        this.createtickDisplayUi();
    }

    stop(): void {
        if (this.tickDisplayUi) {
            this.tickDisplayUi.remove();
            this.tickDisplayUi = null;
        }
    }

        // Create UI Element
    createtickDisplayUi(): void {
        this.log("Creating Tick Counter UI");
        if (this.tickDisplayUi) {
            this.tickDisplayUi.remove();
        }

        this.tickDisplayUi = this.uiManager.createElement(
            UIManagerScope.ClientInternal
        );

        if (!this.tickDisplayUi) {
            this.settings.enable!.value = false;
            return;
        }

        // Assign CSS Styling
        this.tickDisplayUi.style.position = "absolute";
        this.tickDisplayUi.style.height = "auto";
        this.tickDisplayUi.style.zIndex = "1000";
        this.tickDisplayUi.style.right = "368px";
        this.tickDisplayUi.style.bottom = "6px";
        this.tickDisplayUi.style.display = "flex";
        this.tickDisplayUi.style.flexDirection = "column";
        this.tickDisplayUi.style.justifyContent = "space-evenly";
        this.tickDisplayUi.style.width = "auto";
        this.tickDisplayUi.style.padding = "10px";
        this.tickDisplayUi.classList.add("hs-menu", "hs-game-menu");

        if(!this.settings.displayTickCounter.value) {
            this.tickDisplayUi.style.display = "none"
        } else {
            this.tickDisplayUi.style.display = ""
        }

        // Create Sub-Span Element
        const tickCounterSpan = document.createElement("span");
        tickCounterSpan.style.display = "flex";
        tickCounterSpan.style.justifyContent = "center";

        // Create Sub-Span-Value Element
        this.tickCounterValueUI = document.createElement("span");
        this.tickCounterValueUI.innerText = `Tick ${this.tickCount}`;
        tickCounterSpan.appendChild(this.tickCounterValueUI);

        // Append to UI Element
        this.tickDisplayUi.appendChild(tickCounterSpan);
    }
}
