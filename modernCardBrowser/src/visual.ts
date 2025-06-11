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
import html2canvas from 'html2canvas';

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import DataViewCategorical = powerbi.DataViewCategorical;

import { VisualFormattingSettingsModel } from "./settings";
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

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
    tooltip?: string;
}

export class Visual implements IVisual {
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private cards: CardData[] = [];
    private filteredCards: CardData[] = [];
    private container: d3.Selection<HTMLElement, any, any, any>;
    private selectedCard: CardData | null = null;
    private searchTerm: string = '';
    private activeFilters: Map<string, string[]> = new Map();
    private zoomedImage: HTMLElement | null = null;

    constructor(options: VisualConstructorOptions) {
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        
        // Crear el contenedor principal
        this.container = d3.select(this.target)
            .append('div')
            .attr('class', 'card-browser-container');

        // Crear el contenedor para el zoom de imágenes
        d3.select(this.target)
            .append('div')
            .attr('class', 'image-zoom-container')
            .style('display', 'none')
            .on('click', () => this.closeZoomedImage());
    }

    public update(options: VisualUpdateOptions) {
        if (!options.dataViews || !options.dataViews[0]) {
            return;
        }

        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);
        const dataView = options.dataViews[0];
        this.cards = this.convertDataViewToCards(dataView);
        this.applyFiltersAndSearch();
        this.renderCards();
    }

    private getSliceValue<T>(slice: formattingSettings.Slice): T {
        return (slice as any).value as T;
    }

    private applyFiltersAndSearch() {
        this.filteredCards = [...this.cards];

        // Aplicar búsqueda si está habilitada
        if (this.getSliceValue<boolean>(this.formattingSettings.cardSettingsCard.enableSearch)) {
            const searchLower = this.searchTerm.toLowerCase();
            this.filteredCards = this.filteredCards.filter(card => 
                card.title.toLowerCase().includes(searchLower) ||
                card.summary.toLowerCase().includes(searchLower) ||
                card.content.toLowerCase().includes(searchLower) ||
                card.subtitle.some(sub => sub.toLowerCase().includes(searchLower))
            );
        }

        // Aplicar filtros si están habilitados
        if (this.getSliceValue<boolean>(this.formattingSettings.cardSettingsCard.enableFilters)) {
            this.activeFilters.forEach((values, key) => {
                if (values.length > 0) {
                    this.filteredCards = this.filteredCards.filter(card => {
                        const metadata = card.metadata[key];
                        return metadata && values.includes(metadata.toString());
                    });
                }
            });
        }
    }

    private convertDataViewToCards(dataView: DataView): CardData[] {
        const cards: CardData[] = [];
        
        if (!dataView.categorical || !dataView.categorical.categories) {
            return cards;
        }

        const categories = dataView.categorical.categories;
        const values = dataView.categorical.values;

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
        const sortingFieldIndex = categories.findIndex(c => c.source.displayName === "Sorting Field");

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

        // Ordenar las tarjetas si hay un campo de ordenamiento
        if (sortingFieldIndex !== -1) {
            const sortDirection = this.getSliceValue<string>(this.formattingSettings.cardSettingsCard.sortDirection);
            cards.sort((a, b) => {
                const aValue = categories[sortingFieldIndex].values[cards.indexOf(a)]?.toString() || '';
                const bValue = categories[sortingFieldIndex].values[cards.indexOf(b)]?.toString() || '';
                return sortDirection === 'asc' ? 
                    aValue.localeCompare(bValue) : 
                    bValue.localeCompare(aValue);
            });
        }

        return cards;
    }

    private showZoomedImage(imageUrl: string) {
        if (!this.getSliceValue<boolean>(this.formattingSettings.readerSettingsCard.enableImageZoom)) return;

        const zoomContainer = d3.select('.image-zoom-container');
        zoomContainer.style('display', 'flex');

        const img = zoomContainer.append('img')
            .attr('src', imageUrl)
            .attr('class', 'zoomed-image');

        this.zoomedImage = img.node();
    }

    private closeZoomedImage() {
        if (this.zoomedImage) {
            d3.select('.image-zoom-container')
                .style('display', 'none')
                .selectAll('*')
                .remove();
            this.zoomedImage = null;
        }
    }

    private exportCard(card: CardData) {
        if (!this.getSliceValue<boolean>(this.formattingSettings.cardSettingsCard.enableExport)) return;

        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <div class="card-top-bar" style="background-color: ${card.topBarColor}"></div>
            <img class="card-image" src="${card.imageUrl}" alt="${card.title}">
            <div class="card-content">
                <h3 class="card-title">${card.title}</h3>
                <p class="card-summary">${card.summary}</p>
                <div class="card-subtitle">${card.subtitle.join(' • ')}</div>
                ${this.getSliceValue<boolean>(this.formattingSettings.cardSettingsCard.showMetadata) ? 
                    `<div class="card-metadata">${Object.entries(card.metadata)
                        .map(([key, value]) => `<div><strong>${key}:</strong> ${value}</div>`)
                        .join('')}</div>` : ''}
                ${this.getSliceValue<boolean>(this.formattingSettings.cardSettingsCard.showProgress) ? 
                    `<div class="card-progress"><div class="progress-bar" style="width: ${card.progress}%"></div></div>` : ''}
            </div>
            <img class="card-badge" src="${card.sourceImage}" alt="Badge">
            <div class="profile-images">
                ${card.profileImages.map(img => `<img src="${img}" alt="Profile">`).join('')}
            </div>
        `;

        // Convertir a imagen
        html2canvas(cardElement).then(canvas => {
            const link = document.createElement('a');
            link.download = `${card.title}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    }

    private showTooltip(event: MouseEvent, card: CardData) {
        if (!this.getSliceValue<boolean>(this.formattingSettings.cardSettingsCard.enableTooltips) || !card.tooltip) return;

        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'card-tooltip')
            .style('position', 'absolute')
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY + 10}px`)
            .html(card.tooltip);

        d3.select(event.target as Element)
            .on('mouseout', () => tooltip.remove());
    }

    private renderCards() {
        // Limpiar el contenedor
        this.container.selectAll('*').remove();

        // Crear la barra de búsqueda si está habilitada
        if (this.getSliceValue<boolean>(this.formattingSettings.cardSettingsCard.enableSearch)) {
            const searchContainer = this.container
                .append('div')
                .attr('class', 'search-container');

            searchContainer.append('input')
                .attr('type', 'text')
                .attr('placeholder', 'Buscar...')
                .attr('class', 'search-input')
                .on('input', (event) => {
                    this.searchTerm = (event.target as HTMLInputElement).value;
                    this.applyFiltersAndSearch();
                    this.renderCards();
                });
        }

        // Crear los filtros si están habilitados
        if (this.getSliceValue<boolean>(this.formattingSettings.cardSettingsCard.enableFilters)) {
            const filtersContainer = this.container
                .append('div')
                .attr('class', 'filters-container');

            // Obtener todos los metadatos únicos
            const metadataKeys = new Set<string>();
            this.cards.forEach(card => {
                Object.keys(card.metadata).forEach(key => metadataKeys.add(key));
            });

            // Crear filtros para cada tipo de metadata
            metadataKeys.forEach(key => {
                const values = new Set<string>();
                this.cards.forEach(card => {
                    const value = card.metadata[key];
                    if (value) values.add(value.toString());
                });

                const filterGroup = filtersContainer
                    .append('div')
                    .attr('class', 'filter-group');

                filterGroup.append('label')
                    .text(key);

                const select = filterGroup.append('select')
                    .attr('multiple', true)
                    .on('change', (event) => {
                        const selectedOptions = Array.from((event.target as HTMLSelectElement).selectedOptions)
                            .map(option => option.value);
                        this.activeFilters.set(key, selectedOptions);
                        this.applyFiltersAndSearch();
                        this.renderCards();
                    });

                Array.from(values).forEach(value => {
                    select.append('option')
                        .attr('value', value)
                        .text(value);
                });
            });
        }

        // Crear el contenedor de tarjetas
        const viewMode = this.getSliceValue<string>(this.formattingSettings.cardSettingsCard.viewMode);
        const cardContainer = this.container
            .append('div')
            .attr('class', viewMode === 'grid' ? 'card-grid' : 
                          viewMode === 'list' ? 'card-list' : 'card-gallery');

        // Crear las tarjetas
        const cards = cardContainer
            .selectAll('.card')
            .data(this.filteredCards)
            .enter()
            .append('div')
            .attr('class', 'card')
            .style('height', `${this.getSliceValue<number>(this.formattingSettings.cardSettingsCard.cardHeight)}px`)
            .on('click', (event, d) => {
                if (this.selectedCard === d) {
                    this.selectedCard = null;
                    this.renderCards();
                } else {
                    this.showReader(d);
                }
            })
            .on('mouseover', (event, d) => this.showTooltip(event, d));

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

        // Añadir la barra de progreso si está habilitada
        if (this.getSliceValue<boolean>(this.formattingSettings.cardSettingsCard.showProgress)) {
            cardContent.append('div')
                .attr('class', 'card-progress')
                .append('div')
                .attr('class', 'progress-bar')
                .style('width', d => `${d.progress}%`)
                .style('background-color', this.getSliceValue<{ value: string }>(this.formattingSettings.cardSettingsCard.progressColor).value);
        }

        // Añadir el resumen
        cardContent.append('p')
            .attr('class', 'card-summary')
            .text(d => d.summary);

        // Añadir el subtítulo
        cardContent.append('div')
            .attr('class', 'card-subtitle')
            .text(d => d.subtitle.join(' • '));

        // Añadir los metadatos si están habilitados
        if (this.getSliceValue<boolean>(this.formattingSettings.cardSettingsCard.showMetadata)) {
            const metadataContainer = cardContent.append('div')
                .attr('class', 'card-metadata');

            Object.entries(d => d.metadata).forEach(([key, value]) => {
                metadataContainer.append('div')
                    .html(`<strong>${key}:</strong> ${value}`);
            });
        }

        // Añadir la insignia
        cards.append('img')
            .attr('class', 'card-badge')
            .attr('src', d => d.sourceImage)
            .attr('alt', 'Badge');

        // Añadir las imágenes de perfil
        const profileImagesContainer = cards.append('div')
            .attr('class', 'profile-images');

        // Limitar el número de imágenes según la configuración
        const maxImages = this.getSliceValue<number>(this.formattingSettings.cardSettingsCard.maxProfileImages);
        const imageSize = this.getSliceValue<number>(this.formattingSettings.cardSettingsCard.profileImageSize);

        profileImagesContainer.selectAll('img')
            .data(d => d.profileImages.slice(0, maxImages))
            .enter()
            .append('img')
            .attr('src', d => d)
            .attr('alt', 'Profile')
            .style('width', `${imageSize}px`)
            .style('height', `${imageSize}px`);

        // Añadir botón de exportación si está habilitado
        if (this.getSliceValue<boolean>(this.formattingSettings.cardSettingsCard.enableExport)) {
            cards.append('button')
                .attr('class', 'export-button')
                .text('Exportar')
                .on('click', (event, d) => {
                    event.stopPropagation();
                    this.exportCard(d);
                });
        }

        // Aplicar animaciones si están habilitadas
        if (this.getSliceValue<boolean>(this.formattingSettings.animationSettingsCard.enableAnimations)) {
            cards.style('opacity', 0)
                .transition()
                .duration(this.getSliceValue<number>(this.formattingSettings.animationSettingsCard.animationDuration))
                .style('opacity', 1);
        }
    }

    private showReader(card: CardData) {
        this.selectedCard = card;
        
        // Limpiar el contenedor
        this.container.selectAll('*').remove();

        // Crear el contenedor del lector
        const readerContainer = this.container
            .append('div')
            .attr('class', 'reader-container')
            .style('background-color', this.getSliceValue<{ value: string }>(this.formattingSettings.readerSettingsCard.backgroundColor).value)
            .style('color', this.getSliceValue<{ value: string }>(this.formattingSettings.readerSettingsCard.textColor).value)
            .style('font-size', `${this.getSliceValue<number>(this.formattingSettings.readerSettingsCard.fontSize)}px`);

        // Añadir botón de cierre
        readerContainer.append('button')
            .attr('class', 'close-button')
            .html('×')
            .on('click', () => {
                this.selectedCard = null;
                this.renderCards();
            });

        // Añadir el contenido del lector
        readerContainer.append('h1')
            .attr('class', 'reader-title')
            .text(card.title);

        if (card.imageUrl) {
            readerContainer.append('img')
                .attr('class', 'reader-image')
                .attr('src', card.imageUrl)
                .attr('alt', card.title)
                .on('click', () => this.showZoomedImage(card.imageUrl));
        }

        readerContainer.append('div')
            .attr('class', 'reader-content')
            .html(card.content);

        // Añadir metadatos
        if (Object.keys(card.metadata).length > 0) {
            const metadataContainer = readerContainer.append('div')
                .attr('class', 'reader-metadata');

            Object.entries(card.metadata).forEach(([key, value]) => {
                metadataContainer.append('div')
                    .attr('class', 'metadata-item')
                    .html(`<strong>${key}:</strong> ${value}`);
            });
        }

        // Aplicar animaciones si están habilitadas
        if (this.getSliceValue<boolean>(this.formattingSettings.animationSettingsCard.enableAnimations)) {
            readerContainer.style('opacity', 0)
                .transition()
                .duration(this.getSliceValue<number>(this.formattingSettings.animationSettingsCard.animationDuration))
                .style('opacity', 1);
        }
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}