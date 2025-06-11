/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Data Point Formatting Card
 */
class DataPointCardSettings extends FormattingSettingsCard {
    defaultColor = new formattingSettings.ColorPicker({
        name: "defaultColor",
        displayName: "Default color",
        value: { value: "" }
    });

    showAllDataPoints = new formattingSettings.ToggleSwitch({
        name: "showAllDataPoints",
        displayName: "Show all",
        value: true
    });

    fill = new formattingSettings.ColorPicker({
        name: "fill",
        displayName: "Fill",
        value: { value: "" }
    });

    fillRule = new formattingSettings.ColorPicker({
        name: "fillRule",
        displayName: "Color saturation",
        value: { value: "" }
    });

    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Text Size",
        value: 12
    });

    name: string = "dataPoint";
    displayName: string = "Data colors";
    slices: Array<FormattingSettingsSlice> = [this.defaultColor, this.showAllDataPoints, this.fill, this.fillRule, this.fontSize];
}

/**
 * Card Settings Card
 */
class CardSettingsCard extends FormattingSettingsCard {
    cardWidth = new formattingSettings.NumUpDown({
        name: "cardWidth",
        displayName: "Card Width",
        value: 300
    });

    cardHeight = new formattingSettings.NumUpDown({
        name: "cardHeight",
        displayName: "Card Height",
        value: 400
    });

    showMetadata = new formattingSettings.ToggleSwitch({
        name: "showMetadata",
        displayName: "Show Metadata",
        value: true
    });

    showProgress = new formattingSettings.ToggleSwitch({
        name: "showProgress",
        displayName: "Show Progress",
        value: true
    });

    sortDirection = new formattingSettings.ItemDropdown({
        name: "sortDirection",
        displayName: "Sort Direction",
        value: { value: "asc", displayName: "Ascending" },
        items: [
            { value: "asc", displayName: "Ascending" },
            { value: "desc", displayName: "Descending" }
        ]
    });

    viewMode = new formattingSettings.ItemDropdown({
        name: "viewMode",
        displayName: "View Mode",
        value: { value: "grid", displayName: "Grid" },
        items: [
            { value: "grid", displayName: "Grid" },
            { value: "list", displayName: "List" },
            { value: "gallery", displayName: "Gallery" }
        ]
    });

    enableSearch = new formattingSettings.ToggleSwitch({
        name: "enableSearch",
        displayName: "Enable Search",
        value: true
    });

    enableFilters = new formattingSettings.ToggleSwitch({
        name: "enableFilters",
        displayName: "Enable Filters",
        value: true
    });

    enableExport = new formattingSettings.ToggleSwitch({
        name: "enableExport",
        displayName: "Enable Export",
        value: true
    });

    enableTooltips = new formattingSettings.ToggleSwitch({
        name: "enableTooltips",
        displayName: "Enable Tooltips",
        value: true
    });

    name: string = "cardSettings";
    displayName: string = "Card Settings";
    slices: Array<FormattingSettingsSlice> = [
        this.cardWidth,
        this.cardHeight,
        this.showMetadata,
        this.showProgress,
        this.sortDirection,
        this.viewMode,
        this.enableSearch,
        this.enableFilters,
        this.enableExport,
        this.enableTooltips
    ];
}

/**
 * Reader Settings Card
 */
class ReaderSettingsCard extends FormattingSettingsCard {
    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#FFFFFF" }
    });

    textColor = new formattingSettings.ColorPicker({
        name: "textColor",
        displayName: "Text Color",
        value: { value: "#000000" }
    });

    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Font Size",
        value: 16
    });

    showBackButton = new formattingSettings.ToggleSwitch({
        name: "showBackButton",
        displayName: "Show Back Button",
        value: true
    });

    enableImageZoom = new formattingSettings.ToggleSwitch({
        name: "enableImageZoom",
        displayName: "Enable Image Zoom",
        value: true
    });

    name: string = "readerSettings";
    displayName: string = "Reader Settings";
    slices: Array<FormattingSettingsSlice> = [
        this.backgroundColor,
        this.textColor,
        this.fontSize,
        this.showBackButton,
        this.enableImageZoom
    ];
}

/**
 * Animation Settings Card
 */
class AnimationSettingsCard extends FormattingSettingsCard {
    enableAnimations = new formattingSettings.ToggleSwitch({
        name: "enableAnimations",
        displayName: "Enable Animations",
        value: true
    });

    animationDuration = new formattingSettings.NumUpDown({
        name: "animationDuration",
        displayName: "Animation Duration (ms)",
        value: 300
    });

    name: string = "animationSettings";
    displayName: string = "Animation Settings";
    slices: Array<FormattingSettingsSlice> = [
        this.enableAnimations,
        this.animationDuration
    ];
}

/**
* visual settings model class
*/
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    dataPointCard = new DataPointCardSettings();
    cardSettingsCard = new CardSettingsCard();
    readerSettingsCard = new ReaderSettingsCard();
    animationSettingsCard = new AnimationSettingsCard();

    cards = [
        this.dataPointCard,
        this.cardSettingsCard,
        this.readerSettingsCard,
        this.animationSettingsCard
    ];
}
