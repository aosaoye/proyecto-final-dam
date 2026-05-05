# Tienda Online Premium - BEM & Pure CSS

Este proyecto es una reconstrucción de una interfaz de tienda online, migrando de Tailwind CSS a **CSS Puro** utilizando la metodología **BEM (Block Element Modifier)** para una organización de estilos escalable y mantenible.

## Características

- **Bespoke Design**: New section for furniture personalization with an inspiring tone.
- **CSS Puro & BEM**: Estilos organizados por bloques, elementos y modificadores.
- **Diseño Premium**: Estética minimalista con tipografía *Plus Jakarta Sans* y paleta de colores *Stone*.
- **Responsive Design**: Adaptable a móviles, tablets y escritorio.
- **Componentes Interactivos**:
  - Menú lateral (Drawer) para móviles.
  - Carrusel de productos funcional.
  - Animaciones fluidas con **GSAP**.
- **SEO Ready**: Estructura semántica de HTML5.

## Estructura del Proyecto

```text
.
├── index.html          # Estructura principal de la aplicación
├── style.css           # Estilos globales y componentes (BEM)
├── script.js           # Lógica de interactividad y animaciones
└── README.md           # Documentación del proyecto
```

## Metodología BEM Empleada

Se han definido bloques claros para cada sección de la interfaz:

- `.header`: Contenedor principal de navegación.
- `.hero`: Sección de impacto visual.
- `.bespoke`: Nueva sección de personalización (Diseño a medida).
- `.catalog`: Sección de productos con carrusel.
- `.product-card`: Tarjeta individual de producto.
- `.footer`: Pie de página con newsletter.
- `.drawer`: Menú lateral móvil.

### Ejemplo de nomenclatura:
```css
/* Bloque */
.product-card {}

/* Elemento */
.product-card__title {}

/* Modificador */
.btn--primary {}
```

## Paleta de Colores

Se utiliza la escala de grises cálidos (Stone):
- **Primario**: `#1c1917` (Stone-900)
- **Fondo**: `#fafaf9` (Stone-50)
- **Bordes**: `#e7e5e4` (Stone-200)

## Dependencias Externas

- **Google Fonts**: Plus Jakarta Sans.
- **Ionicons**: Iconografía vectorial.
- **GSAP**: Animaciones de entrada y efectos de scroll.

