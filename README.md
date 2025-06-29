# ModernCardBrowser

Un objeto visual moderno y personalizable para Power BI que permite mostrar información en un formato de tarjetas expandibles con múltiples funcionalidades avanzadas.

## Características Principales

### 1. Diseño Moderno y Responsivo
- Interfaz limpia y moderna con diseño adaptable
- Soporte para temas claros y oscuros
- Diseño responsive que se adapta a diferentes tamaños de visualización

### 2. Tarjetas Expandibles
- Capacidad para expandir y contraer tarjetas individualmente
- Animaciones suaves en las transiciones
- Indicador visual del estado de expansión

### 3. Personalización Avanzada
- **Imagen de Perfil**
  - Soporte para imágenes circulares
  - Tamaño personalizable
  - Posibilidad de mostrar/ocultar
  - Bordes y sombras configurables

- **Barra de Progreso**
  - Múltiples estilos (lineal, circular, semicircular)
  - Colores personalizables
  - Etiquetas configurables
  - Valores numéricos opcionales

- **Estilos de Tarjeta**
  - Colores de fondo personalizables
  - Bordes y sombras configurables
  - Espaciado interno ajustable
  - Radio de borde personalizable

### 4. Formato de Datos
- Soporte para múltiples formatos de datos
- Valores numéricos con formato personalizable
- Fechas con múltiples formatos
- Texto con estilos personalizables

## Requisitos

- Power BI Desktop (versión 2.0 o superior)
- Node.js 14.x o superior
- npm 6.x o superior

## Instalación

1. Clona este repositorio:
```bash
git clone https://github.com/tu-usuario/modern-card-browser.git
cd modern-card-browser
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

4. Abre Power BI Desktop y carga el objeto visual desde la carpeta `dist`.

## Uso

### Configuración de Datos

1. Arrastra los campos necesarios a los roles de datos:
   - **Categoría**: Campo principal para agrupar las tarjetas
   - **Valor**: Campo numérico para la barra de progreso
   - **Imagen**: URL de la imagen de perfil
   - **Detalles**: Campos adicionales para mostrar en la tarjeta expandida

### Configuración de Formato

1. **Imagen de Perfil**
   - Activa/desactiva la visualización
   - Ajusta el tamaño (pequeño, mediano, grande)
   - Personaliza el borde y la sombra

2. **Barra de Progreso**
   - Selecciona el estilo (lineal, circular, semicircular)
   - Configura los colores
   - Ajusta las etiquetas y valores

3. **Estilos de Tarjeta**
   - Personaliza colores y bordes
   - Ajusta el espaciado
   - Configura las sombras

## Estructura del Proyecto

```
modern-card-browser/
├── src/
│   ├── visual.ts           # Lógica principal del objeto visual
│   ├── settings.ts         # Configuración y opciones
│   ├── capabilities.json   # Definición de capacidades
│   └── assets/            # Recursos estáticos
├── dist/                  # Archivos compilados
├── node_modules/         # Dependencias
└── package.json         # Configuración del proyecto
```

## Desarrollo

### Comandos Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run build`: Compila el proyecto
- `npm run test`: Ejecuta las pruebas
- `npm run lint`: Ejecuta el linter

### Flujo de Trabajo Recomendado

1. Realiza cambios en los archivos fuente
2. Ejecuta `npm run build` para compilar
3. Prueba los cambios en Power BI Desktop
4. Ejecuta `npm run test` para verificar la calidad del código
5. Haz commit de los cambios

## Contribución

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Añade nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Soporte

Si encuentras algún problema o tienes alguna sugerencia, por favor:
1. Revisa la [documentación](docs/)
2. Abre un issue en el repositorio
3. Contacta al equipo de soporte

## Changelog

### v1.0.0
- Lanzamiento inicial
- Implementación de tarjetas expandibles
- Soporte para imágenes de perfil
- Múltiples estilos de barra de progreso

## Roadmap

- [ ] Soporte para temas personalizados
- [ ] Más estilos de tarjetas
- [ ] Animaciones adicionales
- [ ] Integración con más fuentes de datos
- [ ] Mejoras en el rendimiento