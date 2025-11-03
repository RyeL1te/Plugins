import {Plugin, SettingsTypes} from "@highlite/core";

import Bronze_scimitar from '../resources/images/customCursor/Bronze_scimitar.png';
import Celadon_scimitar from '../resources/images/customCursor/Celadon_scimitar.png';
import Chicken_39 from '../resources/images/customCursor/Chicken_39.png';
import Chisel from '../resources/images/customCursor/Chisel.png';
import Coronium_scimitar from '../resources/images/customCursor/Coronium_scimitar.png';
import Damoguis_staff from '../resources/images/customCursor/Damoguis_staff.png';
import Ember_staff from '../resources/images/customCursor/Ember_staff.png';
import Fires_Fury from '../resources/images/customCursor/Fires_Fury.png';
import Forest_staff from '../resources/images/customCursor/Forest_staff.png';
import Gnomes_hat from '../resources/images/customCursor/Gnomes_hat.png';
import Golden_leaf from '../resources/images/customCursor/Golden_leaf.png';
import Hydro_staff from '../resources/images/customCursor/Hydro_staff.png';
import Iron_scimitar from '../resources/images/customCursor/Iron_scimitar.png';
import Knife from '../resources/images/customCursor/Knife.png';
import Leaf from '../resources/images/customCursor/Leaf.png';
import Legendary_scimitar from '../resources/images/customCursor/Legendary_scimitar.png';
import Marlin from '../resources/images/customCursor/Marlin.png';
import Natures_Fury from '../resources/images/customCursor/Natures_Fury.png';
import Palladium_scimitar from '../resources/images/customCursor/Palladium_scimitar.png';
import Raw_marlin from '../resources/images/customCursor/Raw_marlin.png';
import Rooster_117 from '../resources/images/customCursor/Rooster_117.png';
import Shovel from '../resources/images/customCursor/Shovel.png';
import Steel_scimitar from '../resources/images/customCursor/Steel_scimitar.png';
import Waters_Fury from '../resources/images/customCursor/Waters_Fury.png';

import Bronze_longsword from '../resources/images/customCursor/Bronze_longsword.png';
import Celadon_longsword from '../resources/images/customCursor/Celadon_longsword.png';
import Coronium_longsword from '../resources/images/customCursor/Coronium_longsword.png';
import Iron_longsword from '../resources/images/customCursor/Iron_longsword.png';
import Legendary_longsword from '../resources/images/customCursor/Legendary_longsword.png';
import Nisse from '../resources/images/customCursor/Nisse.png';
import Palladium_longsword from '../resources/images/customCursor/Palladium_longsword.png';
import Steel_longsword from '../resources/images/customCursor/Steel_longsword.png';
import Nisse_small from '../resources/images/customCursor/nisse_small.png';

export default class CustomCursor extends Plugin {
    pluginName: string = 'Custom Cursor';
    author = '0rangeYouGlad';

    
    // Don't think it's feasible to use the copy alredy in the game files unfortunately, need a separate png
    private images = [
        Legendary_scimitar,
        Celadon_scimitar,
        Coronium_scimitar,
        Palladium_scimitar,
        Steel_scimitar,
        Iron_scimitar,
        Bronze_scimitar,
        Damoguis_staff,
        Hydro_staff,
        Forest_staff,
        Ember_staff,
        Waters_Fury,
        Natures_Fury,
        Fires_Fury,
        Leaf,
        Golden_leaf,
        Chicken_39,
        Rooster_117,
        Raw_marlin,
        Marlin,
        Shovel,
        Chisel,
        Knife,
        Gnomes_hat,
        Bronze_longsword,
        Iron_longsword,
        Steel_longsword,
        Palladium_longsword,
        Coronium_longsword,
        Celadon_longsword,
        Legendary_longsword,
        Nisse_small,
        Nisse,
      ]

    constructor() {
        super();

        this.settings.cursorOffset = {
            text: 'Cursor Offset',
            type: SettingsTypes.text,
            value: "auto",
            callback: this.reset_cursor,
        } as any;

        this.settings.cursorImportant = {
            text: 'Cursor Important (Hover and Click)',
            type: SettingsTypes.checkbox,
            value: true,
            callback: this.reset_cursor,
        } as any;

        this.settings.cursorImagePresets = {
            text: 'Cursor Presets',
            type: SettingsTypes.range,
            value: 0,
            min: 0,
            max: this.images.length - 1,
            callback: this.reset_cursor,
        } as any;

        this.settings.cursorCustomImage = {
            text: 'Cursor Custom Image',
            type: SettingsTypes.text,
            value: "",
            callback: this.reset_cursor,
        } as any;
    }

    get_png_from_preset() {
        if(this.images[this.settings.cursorImagePresets.value]) {
            return `${this.images[this.settings.cursorImagePresets.value]}`;
        }
        return this.images[0];
    }

    get_cursor_url() {
        return `url(${this.settings.cursorCustomImage.value || this.get_png_from_preset()})`
    }

    init(): void {
        this.log('Initialized CustomCursor');
    }

    start(): void {
        this.log('Started CustomCursor');
        if(this.settings.enable.value) {
            this.set_cursor()
        }
    }

    stop(): void {
        this.log('Stopped CustomCursor');
        this.clear_cursor();
    }

    private addCSSStyles(cursorName?: string): void {
        const preexistingStyle = document.head.querySelector('#cursorStyle');
        if(preexistingStyle) {
            document.head.removeChild(preexistingStyle);
        }
        if(cursorName) {
            const style = document.createElement('style');
            style.id = "cursorStyle";
            style.textContent = `
                .hs-screen-mask {
                    cursor: ${cursorName};
                }
                :hover {
                    cursor: ${cursorName};
                }
                html {
                    cursor: ${cursorName};
                }
            `;
            document.head.appendChild(style);
        }
    }

    set_cursor() {
        if(this.settings.enable.value) {
            this.addCSSStyles(`${this.get_cursor_url()}, ${this.settings.cursorOffset.value || 'auto'} ${this.settings.cursorImportant.value ? '!important' : ''}`);
        }
    }

    reset_cursor() {
        this.clear_cursor();
        this.set_cursor();
    }

    clear_cursor() {
        this.addCSSStyles();
    }
}
