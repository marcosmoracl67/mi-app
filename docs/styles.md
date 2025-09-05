# 📄 Documentación: Refactorización de Estilos CSS

## Índice

- [1. Introducción y Estado Inicial](#1-introducción-y-estado-inicial)
- [2. Objetivos de la Refactorización](#2-objetivos-de-la-refactorización)
- [3. La Nueva Estructura CSS (Inspirada en ITCSS)](#3-la-nueva-estructura-css-inspirada-en-itcss)
- [4. Convención de Nomenclatura: BEM](#4-convención-de-nomenclatura-bem)
- [5. Proceso de Refactorización Realizado](#5-proceso-de-refactorización-realizado)
- [6. Cambios y Decisiones Clave](#6-cambios-y-decisiones-clave)
- [7. Beneficios Logrados](#7-beneficios-logrados)
- [8. Estructura Final de Archivos src/styles](#8-estructura-final-de-archivos-srcstyles)
- [9. Mantenimiento Futuro](#9-mantenimiento-futuro)

## 1. Introducción y Estado Inicial

Antes de la refactorización, los estilos CSS de la aplicación se encontraban distribuidos en varios archivos (como components.css, forms.css, tables.css, proyect.css, etc.) sin una estructura clara y consistente. Archivos como components.css y forms.css actuaban como "cajones de sastre", mezclando estilos de diferentes componentes, layout y utilidades. Esta organización dificultaba:

__Mantenibilidad:__ Encontrar y modificar estilos específicos era complicado y propenso a errores.  
__Escalabilidad:__ Añadir nuevos componentes o páginas sin introducir conflictos de estilos o duplicación era difícil.  
__Consistencia:__ No había una metodología clara para nombrar clases, lo que podía llevar a nombres genéricos y colisiones.  
__Reutilización:__ Los estilos no estaban claramente asociados a los componentes reutilizables de React.  

## 2. Objetivos de la Refactorización

El objetivo principal fue reestructurar completamente la base de código CSS para alinearla con las mejores prácticas de desarrollo frontend, enfocándose en:

__Organización Modular:__ Separar los estilos por responsabilidad (base, layout, componentes, páginas, utilidades).  
__Mantenibilidad:__ Facilitar la localización, modificación y eliminación de estilos.  
__Escalabilidad:__ Crear una estructura que soporte el crecimiento futuro de la aplicación.  
__Consistencia:__ Implementar una convención de nomenclatura clara y predecible (BEM).  
__Reutilización:__ Asociar estilos directamente con los componentes React reutilizables.  
__Claridad:__ Mejorar la legibilidad y comprensión del código CSS.  
__Separación de Responsabilidades:__ Distinguir claramente entre estilos intrínsecos de un componente y estilos de layout aplicados contextualmente.  

## 3. La Nueva Estructura CSS (Inspirada en ITCSS)

Se adoptó una estructura de carpetas dentro de src/styles/, organizando los archivos CSS en capas lógicas:

    src/
    └── styles/
        ├── base/         # Resets, estilos HTML base (_base.css, _typography.css)
        ├── config/       # Variables, temas (_themes.css)
        ├── layout/       # Estructura principal, grid, formularios genéricos (_layout.css, _sidebar.css, _forms.css)
        ├── components/   # Estilos por componente React (_Button.css, _Modal.css, _Input.css, ...)
        ├── pages/        # Estilos específicos de páginas (_login.css, _MenuOpciones.css, ...)
        ├── utilities/    # Clases de utilidad (_utilities.css)
        └── index.css     # Punto de entrada único (solo @import)

__config:__ Variables CSS (colores, fuentes, temas).  
__base:__ Estilos para elementos HTML básicos (reset, body, h1, p, etc.).  
__layout:__ Estilos para la maquetación principal (contenedor de la app, sidebar) y estructuras comunes como los grupos de formularios (.form-group).  
__components:__ La capa más importante. Contiene un archivo CSS dedicado para cada componente React reutilizable (FormButton, Modal, FormInput, etc.), definiendo sus estilos internos y variaciones.  
__pages:__ Estilos específicos que solo aplican a una página o vista particular. Se debe minimizar su uso, prefiriendo componer páginas con componentes y layout.  
__utilities:__ Clases de ayuda reutilizables (ej: .u-text-center, .visually-hidden).  
__index.css:__ Actúa como el único punto de entrada, importando todos los demás archivos en el orden correcto de especificidad (Config -> Base -> Layout -> Components -> Pages -> Utilities).  

__Resumen de la Estructura de Archivos CSS__  

La siguiente tabla describe el propósito de cada archivo y directorio principal dentro de la carpeta `src/styles/`, siguiendo la metodología ITCSS y BEM implementada.

| Archivo / Directorio          | Descripción                                                                                                                               |
| :---------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **`index.css`**               | **Punto de Entrada Principal.** NO contiene estilos. Únicamente importa (`@import`) todos los demás archivos CSS en el orden correcto de cascada y especificidad. |
| **`config/`**                 | Capa de Configuración Global.                                                                                                             |
| `config/_themes.css`          | Define las **variables CSS** para los temas claro y oscuro (colores, fuentes, etc.). Es fundamental para la tematización.                   |
| `config/_variables.css`       | *(Opcional)* Define otras variables CSS globales que no estén directamente relacionadas con los temas.                                       |
| **`base/`**                   | Capa Base. Estilos aplicados directamente a elementos HTML.                                                                                 |
| `base/_base.css`              | Contiene el **reset** de estilos (márgenes/paddings por defecto, `box-sizing`), y estilos base para `html`, `body`.                          |
| `base/_typography.css`        | *(Opcional)* Define estilos base para la tipografía global (h1-h6, p, a, listas), si se separa de `_base.css`.                              |
| **`layout/`**                 | Capa de Layout. Estilos para la estructura principal de la aplicación y patrones de maquetación comunes.                                     |
| `layout/_layout.css`          | Define estilos para los contenedores principales de la aplicación (ej: `.app-container`, `.app-main`), grid o flexbox principal.             |
| `layout/_sidebar.css`         | Contiene todos los estilos específicos para el componente `Sidebar` (posición, ancho, transición, estilos de ítems).                         |
| `layout/_forms.css`           | Define estilos **estructurales y comunes** para formularios (ej: `.form-group`, `.form-row`, `.form-label`, `.form-error-message`). **No** contiene estilos de inputs específicos. |
| **`components/`**             | **Capa de Componentes.** Contiene los estilos para cada componente React reutilizable. **Un archivo por componente, usando BEM.**        |
| `components/_Button.css`      | Estilos para `FormButton` (clase base `.button`, modificadores `--variant-*`, `--size-*`, elementos `__icon`, `__loader`).                 |
| `components/_Input.css`       | Estilos para `FormInput` (clase base `.input-field`, modificador `--state-invalid`).                                                      |
| `components/_Textarea.css`    | Estilos para `FormTextarea` (clase base `.textarea-field`, hereda de `.input-field`, modificadores específicos si los hay).              |
| `components/_Select.css`      | Estilos para `FormSelect` (clase base `.select-field`, flecha personalizada, estados).                                                     |
| `components/_Checkbox.css`    | Estilos para `FormCheckBox` (clase base `.checkbox`, elementos `__visual`, `__checkmark`, estados).                                       |
| `components/_RadioGroup.css`  | Estilos para `FormRadioGroup` (clase base `.radio-group`, elementos `__item`, `__input`, `__label`, layout `inline`).                      |
| `components/_ToggleSwitch.css`| Estilos para `ToggleSwitch` (clase base `.toggle-switch`, elementos `__visual`, `__slider`, handle, modificadores `--size-*`, `--state-disabled`). |
| `components/_Modal.css`       | Estilos para `Modal` base (clase base `.modal`, elementos `__overlay`, `__body`, `__footer`, etc.) y estilos derivados (`.confirm-dialog__message`). |
| `components/_Loader.css`      | Estilos para `Loader` (clase base `.loader`, modificadores `--size-*`, animación `spin`).                                                  |
| `components/_DataTable.css`   | Estilos para `DataTable` (estructura `table`, `th`, `td`, scroll, indicadores de ordenamiento, `.table-actions`).                            |
| `components/_SearchBar.css`   | Estilos para `SearchBar` (clase base `.search-bar`, elementos `__input`, `__icon`).                                                        |
| `components/_Container.css`   | Estilos base (mínimos) y modificadores (`--bordered`, `--animated`) para el componente `Container`.                                        |
| `components/_DocumentList.css`| Estilos específicos para `DocumentList` (ej: la tabla de documentos si no usa `DataTable`, o ajustes específicos).                            |
| `components/_DocumentUploader.css` | Estilos específicos para el componente de subida de archivos (ej: `.document-uploader__row`).                                        |
| *... (otros componentes)*     | Archivos CSS para cualquier otro componente reutilizable.                                                                                 |
| **`pages/`**                  | Capa de Páginas. Estilos específicos para vistas o páginas completas. **Usar con moderación.**                                              |
| `pages/_login.css`            | Estilos únicos para la página de Login (ej: contenedor `.login-container` si es específico).                                                |
| `pages/_MenuOpciones.css`     | Estilos específicos para la página `MenuOpciones` (ej: `.menu-opciones__toolbar`, anchos específicos de componentes *dentro* de esta página). |
| `pages/_proyect.css`          | Estilos específicos para las páginas relacionadas con proyectos/dashboard (ej: tarjetas de métricas, barras de progreso específicas).         |
| *... (otras páginas)*         | Archivos CSS para otras páginas que requieran estilos únicos no cubiertos por componentes o layout.                                       |
| **`utilities/`**              | Capa de Utilidades. Clases helper reutilizables y de bajo nivel.                                                                          |
| `utilities/_utilities.css`    | Contiene clases de utilidad genéricas (ej: `.u-text-center`, `.u-margin-top-md`, `.visually-hidden`) y/o importa otras utilidades específicas. |
| `utilities/_spacing.css`      | *(Opcional)* Clases de utilidad solo para márgenes y paddings.                                                                            |
| `utilities/_typography.css`   | *(Opcional)* Clases de utilidad solo para estilos de texto (tamaño, peso, alineación).                                                     |
| `utilities/_display.css`      | *(Opcional)* Clases de utilidad para `display`, `flex`, `grid`.                                                                           |

## 4. Convención de Nomenclatura: BEM

Se adoptó la metodología __BEM (Block__Element--Modifier)__ para nombrar las clases CSS, especialmente dentro de la capa components:

__Block:__ Representa al componente principal (ej: .modal, .button, .input-field).  
__Element:__ Una parte interna del bloque, denotada por doble guion bajo (__) (ej: .modal__body, .button__icon, .toggle-switch__slider).  
__Modifier:__ Una variación de estilo o estado del bloque o elemento, denotada por doble guion (--) (ej: .button--variant-danger, .input-field--state-invalid, .modal--dialog).  

__Beneficios de BEM:__  

* Nombres de clase claros y autoexplicativos.
* Reduce el riesgo de colisiones de nombres.
* Crea un "espacio de nombres" para los estilos del componente.
* Facilita la comprensión de la estructura HTML a partir del CSS y viceversa.

## 5. Proceso de Refactorización Realizado

La migración se realizó de forma iterativa, componente por componente y capa por capa:


1. **Análisis:** Se revisaron los archivos CSS existentes (_Components.css, forms.css, etc.) para identificar estilos relacionados.  
2. __Estructura:__ Se crearon las carpetas y el archivo index.css con los @import.  
3. __Migración por Componente:__  
    * Para cada componente React refactorizado (Button, Input, Modal, ToggleSwitch, SearchBar, Container, etc.):
        * Se creó su archivo CSS correspondiente en src/styles/components/ (ej: _Button.css).
        * Se buscaron y movieron todos sus estilos relevantes desde los archivos antiguos al nuevo archivo dedicado.
        * Se refactorizaron las clases usando la sintaxis BEM.
        * Se actualizó el archivo JSX del componente React para usar las nuevas clases BEM.
        * Se aseguró que el nuevo archivo CSS fuera importado en index.css.
4. __Migración de Layout/Base/Config:__  
    * Estilos generales de formularios (.form-group, .form-label, .form-error-message, etc.) se consolidaron y movieron a layout/_forms.css.
    * Estilos de layout principal (.app-container, etc.) se movieron a layout/_layout.css.
    * Estilos del Sidebar se movieron a layout/_sidebar.css.
    * Estilos base (reset, body, etc.) se movieron a base/_base.css.
    * Variables y temas se movieron a config/_themes.css.
5.  __Migración de Páginas/Utilidades:__  
    * Estilos específicos de páginas (como los del toolbar de MenuOpciones) se movieron a pages/_MenuOpciones.css.
    * Clases de utilidad (.visually-hidden) se movieron a utilities/utilities.css.
    * Animaciones genéricas (@keyframes) se movieron a base/_base.css o utilities/utilities.css.
6. __Limpieza:__ Se eliminaron progresivamente las reglas de los archivos CSS antiguos (_Components.css, etc.) a medida que se migraban a la nueva estructura.

## 6. Cambios y Decisiones Clave

* __Cntrol de Layout:__ Se adoptó el principio de que el layout (ancho, margen, alineación) de un componente reutilizable debe ser controlado por su contexto (CSS de la página o clases de utilidad), no por props directas en el componente (ej: SearchBar ya no tiene props width o align).
* __Componentes de Formulario:__ Se estandarizó la estructura (uso de .form-group, .form-label), el manejo de errores (.form-error-message, modificador --state-invalid), y la aplicación de BEM (.input-field, .select-field, etc.).
* __Modal Base:__ Se refactorizó Modal.jsx para ser más flexible (con footerContent, bodyCentered, etc.) y se adaptaron ConfirmDialog y otros modales para usarlo eficientemente.
* __BEM:__ Se aplicó consistentemente en los nuevos archivos CSS de componentes.

## 7 Beneficios Logrados

* __Código CSS Organizado:__ La estructura de carpetas y archivos es clara y sigue una lógica definida.  
* __Mantenimiento Sencillo:__ Es fácil encontrar los estilos de un componente específico o los estilos base/layout.  
* __Reducción de Conflictos:__ BEM minimiza la posibilidad de colisiones entre clases CSS.  
* __Mayor Reutilización:__ Los estilos están encapsulados por componente.  
* __Consistencia Visual:__ El uso de variables (_themes.css) y una estructura común fomenta la coherencia.  
* __Mejor Experiencia de Desarrollo:__ El código es más predecible y fácil de trabajar.  

## 8. Estructura Final de Archivos src/styles

![Estructura de estilos](./img/str%20Styles.png)

## 9. Mantenimiento Futuro

* __Nuevos Componentes:__ Crear un nuevo archivo .css en src/styles/components/ con el nombre del componente (prefijo _), usar BEM internamente e * importarlo en index.css.  
* __Nuevas Páginas:__ Si una página requiere estilos muy específicos que no pueden lograrse con componentes/layout/utilidades, crear un archivo en src/styles/pages/ e importarlo en index.css.  
* __Modificaciones:__ Localizar el archivo CSS correspondiente (componente, layout, base, etc.) y realizar los cambios siguiendo BEM y utilizando variables CSS existentes siempre que sea posible.  