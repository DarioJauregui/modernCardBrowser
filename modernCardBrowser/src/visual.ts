/*
*  Power BI Visual CLI
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

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";
import * as d3 from 'd3';

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import DataViewCategorical = powerbi.DataViewCategorical;

import { VisualFormattingSettingsModel } from "./settings";

interface CardData {
    id: string;
    title: string;
    summary: string;
    content: string;
    imageUrl: string;
    subtitle: string[];
    sourceImage: string;
    metadata: any;
    topBarColor: string;
    profileImages: string[];
    progress: number;
}

export class Visual implements IVisual {
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private cards: CardData[] = [];
    private container: d3.Selection<HTMLElement, any, any, any>;

    constructor(options: VisualConstructorOptions) {
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        
        // Crear el contenedor principal
        this.container = d3.select(this.target)
            .append('div')
            .attr('class', 'card-browser-container');
    }

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);
        
        if (!options.dataViews || !options.dataViews[0]) {
            return;
        }

        const dataView: DataView = options.dataViews[0];
        this.cards = this.convertDataViewToCards(dataView);
        this.renderCards();
    }

    private convertDataViewToCards(dataView: DataView): CardData[] {
        const categorical: DataViewCategorical = dataView.categorical;
        if (!categorical) return [];

        const cards: CardData[] = [];
        const categories = categorical.categories;
        const values = categorical.values;

        // Obtener los índices de las columnas necesarias
        const idIndex = categories.findIndex(c => c.source.displayName === "Document Id");
        const titleIndex = categories.findIndex(c => c.source.displayName === "Title");
        const summaryIndex = values.findIndex(v => v.source.displayName === "Preview");
        const contentIndex = values.findIndex(v => v.source.displayName === "Content");
        const imageUrlIndex = categories.findIndex(c => c.source.displayName === "Title Image (URL)");
        const subtitleIndices = categories
            .map((c, i) => c.source.displayName === "Subtitle Fields" ? i : -1)
            .filter(i => i !== -1);
        const sourceImageIndex = categories.findIndex(c => c.source.displayName === "Badge (Image URL)");
        const metadataIndex = values.findIndex(v => v.source.displayName === "MetaData Fields");
        const topBarColorIndex = categories.findIndex(c => c.source.displayName === "Top Bar Color");
        const profileImagesIndex = categories.findIndex(c => c.source.displayName === "Fotos de perfil");
        const progressIndex = values.findIndex(v => v.source.displayName === "Progreso");

        // Crear las tarjetas
        for (let i = 0; i < categories[0].values.length; i++) {
            const card: CardData = {
                id: idIndex !== -1 ? categories[idIndex].values[i]?.toString() || '' : '',
                title: titleIndex !== -1 ? categories[titleIndex].values[i]?.toString() || '' : '',
                summary: summaryIndex !== -1 ? values[summaryIndex].values[i]?.toString() || '' : '',
                content: contentIndex !== -1 ? values[contentIndex].values[i]?.toString() || '' : '',
                imageUrl: imageUrlIndex !== -1 ? categories[imageUrlIndex].values[i]?.toString() || '' : '',
                subtitle: subtitleIndices.map(idx => categories[idx].values[i]?.toString() || ''),
                sourceImage: sourceImageIndex !== -1 ? categories[sourceImageIndex].values[i]?.toString() || '' : '',
                metadata: metadataIndex !== -1 ? values[metadataIndex].values[i] || {} : {},
                topBarColor: topBarColorIndex !== -1 ? categories[topBarColorIndex].values[i]?.toString() || '#0078D4' : '#0078D4',
                profileImages: profileImagesIndex !== -1 ? [categories[profileImagesIndex].values[i]?.toString() || ''] : [],
                progress: progressIndex !== -1 ? values[progressIndex].values[i] as number || 0 : 0
            };
            cards.push(card);
        }

        return cards;
    }

    private renderCards() {
        // Limpiar el contenedor
        this.container.selectAll('*').remove();

        // Crear el grid de tarjetas
        const cardGrid = this.container
            .append('div')
            .attr('class', 'card-grid');

        // Crear las tarjetas
        const cards = cardGrid
            .selectAll('.card')
            .data(this.cards)
            .enter()
            .append('div')
            .attr('class', 'card');

        // Añadir la barra superior
        cards.append('div')
            .attr('class', 'card-top-bar')
            .style('background-color', d => d.topBarColor);

        // Añadir la imagen principal
        cards.append('img')
            .attr('class', 'card-image')
            .attr('src', d => d.imageUrl)
            .attr('alt', d => d.title);

        // Añadir el contenido
        const cardContent = cards.append('div')
            .attr('class', 'card-content');

        // Añadir el título
        cardContent.append('h3')
            .attr('class', 'card-title')
            .text(d => d.title);

        // Añadir el resumen
        cardContent.append('p')
            .attr('class', 'card-summary')
            .text(d => d.summary);

        // Añadir los subtítulos
        cardContent.append('div')
            .attr('class', 'card-subtitle')
            .html(d => d.subtitle.join(' • '));

        // Añadir los metadatos
        cardContent.append('div')
            .attr('class', 'card-metadata')
            .html(d => {
                const metadata = d.metadata;
                if (typeof metadata === 'object') {
                    return Object.entries(metadata)
                        .map(([key, value]) => `<div><strong>${key}:</strong> ${value}</div>`)
                        .join('');
                }
                return '';
            });

        // Añadir la insignia
        cards.append('img')
            .attr('class', 'card-badge')
            .attr('src', d => d.sourceImage)
            .attr('alt', 'Badge');

        // Añadir las imágenes de perfil
        const profileImages = cards.append('div')
            .attr('class', 'profile-images');

        profileImages.selectAll('img')
            .data(d => d.profileImages)
            .enter()
            .append('img')
            .attr('src', d => d)
            .attr('alt', 'Profile')
            .style('width', '30px')
            .style('height', '30px')
            .style('border-radius', '50%')
            .style('margin-right', '5px');
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}