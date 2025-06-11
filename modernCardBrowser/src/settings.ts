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

import FormattingSettingsCard = formattingSettings.Card;
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
export class CardSettingsCard extends FormattingSettingsCard {
    cardWidth = new formattingSettings.NumUpDown({
        name: "cardWidth",
        displayName: "Card Width",
        value: 300
    });

    cardHeight: FormattingSettingsSlice = new formattingSettings.NumUpDown({
        name: "cardHeight",
        displayName: "Altura de Tarjeta",
        value: 300
    });

    showMetadata: FormattingSettingsSlice = new formattingSettings.ToggleSwitch({
        name: "showMetadata",
        displayName: "Mostrar Metadatos",
        value: true
    });

    showProgress: FormattingSettingsSlice = new formattingSettings.ToggleSwitch({
        name: "showProgress",
        displayName: "Mostrar Barra de Progreso",
        value: true
    });

    progressColor: FormattingSettingsSlice = new formattingSettings.ColorPicker({
        name: "progressColor",
        displayName: "Color de la Barra de Progreso",
        value: { value: "#0078d4" }
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

    viewMode: FormattingSettingsSlice = new formattingSettings.ItemDropdown({
        name: "viewMode",
        displayName: "Modo de Vista",
        value: { value: "grid", displayName: "Cuadrícula" },
        items: [
            { value: "grid", displayName: "Cuadrícula" },
            { value: "list", displayName: "Lista" },
            { value: "gallery", displayName: "Galería" }
        ]
    });

    enableSearch: FormattingSettingsSlice = new formattingSettings.ToggleSwitch({
        name: "enableSearch",
        displayName: "Habilitar Búsqueda",
        value: true
    });

    enableFilters: FormattingSettingsSlice = new formattingSettings.ToggleSwitch({
        name: "enableFilters",
        displayName: "Habilitar Filtros",
        value: true
    });

    enableExport: FormattingSettingsSlice = new formattingSettings.ToggleSwitch({
        name: "enableExport",
        displayName: "Habilitar Exportación",
        value: true
    });

    enableTooltips: FormattingSettingsSlice = new formattingSettings.ToggleSwitch({
        name: "enableTooltips",
        displayName: "Habilitar Tooltips",
        value: true
    });

    profileImageSize: FormattingSettingsSlice = new formattingSettings.NumUpDown({
        name: "profileImageSize",
        displayName: "Tamaño de Imágenes de Perfil",
        value: 25
    });

    maxProfileImages: FormattingSettingsSlice = new formattingSettings.NumUpDown({
        name: "maxProfileImages",
        displayName: "Máximo de Imágenes de Perfil",
        value: 5
    });

    name: string = "cardSettings";
    displayName: string = "Configuración de Tarjetas";
    slices: Array<FormattingSettingsSlice> = [
        this.cardWidth,
        this.cardHeight,
        this.showMetadata,
        this.showProgress,
        this.progressColor,
        this.sortDirection,
        this.viewMode,
        this.enableSearch,
        this.enableFilters,
        this.enableExport,
        this.enableTooltips,
        this.profileImageSize,
        this.maxProfileImages
    ];
}

/**
 * Reader Settings Card
 */
export class ReaderSettingsCard extends FormattingSettingsCard {
    backgroundColor: FormattingSettingsSlice = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Color de Fondo",
        value: { value: "#ffffff" }
    });

    textColor: FormattingSettingsSlice = new formattingSettings.ColorPicker({
        name: "textColor",
        displayName: "Color de Texto",
        value: { value: "#000000" }
    });

    fontSize: FormattingSettingsSlice = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Tamaño de Fuente",
        value: 16
    });

    showBackButton = new formattingSettings.ToggleSwitch({
        name: "showBackButton",
        displayName: "Show Back Button",
        value: true
    });

    enableImageZoom: FormattingSettingsSlice = new formattingSettings.ToggleSwitch({
        name: "enableImageZoom",
        displayName: "Habilitar Zoom de Imágenes",
        value: true
    });

    name: string = "readerSettings";
    displayName: string = "Configuración del Lector";
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
export class AnimationSettingsCard extends FormattingSettingsCard {
    enableAnimations: FormattingSettingsSlice = new formattingSettings.ToggleSwitch({
        name: "enableAnimations",
        displayName: "Habilitar Animaciones",
        value: true
    });

    animationDuration: FormattingSettingsSlice = new formattingSettings.NumUpDown({
        name: "animationDuration",
        displayName: "Duración de Animación",
        value: 300
    });

    name: string = "animationSettings";
    displayName: string = "Configuración de Animaciones";
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
    cardSettingsCard: CardSettingsCard = new CardSettingsCard();
    readerSettingsCard: ReaderSettingsCard = new ReaderSettingsCard();
    animationSettingsCard: AnimationSettingsCard = new AnimationSettingsCard();

    cards: Array<FormattingSettingsCard> = [
        this.dataPointCard,
        this.cardSettingsCard,
        this.readerSettingsCard,
        this.animationSettingsCard
    ];
}
