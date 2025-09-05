# Índice de Componentes

- [1. Modal.jsx](#1-modaljsx)
- [2. FormInput.jsx](#2-forminputjsx)
- [3. FormTextarea.jsx](#3-formtextareajsx)
- [4. FormSelect.jsx](#4-formselectjsx)
- [5. FormButton.jsx](#5-formbuttonjsx)
- [6. ToggleSwitch.jsx](#6-toggleswitchjsx)
- [7. Titulo.jsx](#7-titulojsx)
- [8. Parrafo.jsx](#8-parrafojsx)
- [9. Container.jsx](#9-containerjsx)
- [10. FormCheckBox.jsx](#10-formcheckboxjsx)
- [11. DocumentManager.jsx](#11-documentmanagerjsx)
- [12. DocumentList.jsx](#12-documentlistjsx)
- [13. FormattedDate.jsx](#13-formatteddatejsx)
- [14. DevBanner.jsx](#14-devbannerjsx)
- [15. Loader.jsx](#15-loaderjsx)
- [16. DataTable.jsx](#16-datatablejsx)
- [17. SearchBar.jsx](#17-searchbarjsx)
- [18. FormRadioGroup.jsx](#18formradiogroupjsx)
- [19. Alert.jsx](#19alertjsx)
- [20. Tabs.jsx](#20tabsjsx)
- [21. Pagination.jsx](#21paginationjsx)
- [22. FormDatePicker.jsx](#22formdatepickerjsx)
- [23. Breadcrumbs.jsx](#23breadcrumbsjsx)
- [24. Tooltip.jsx](#24tooltipjsx)
- [25. DropdownMenu.jsx](#25dropdownmenujsx)
- [26. Autocomplete.jsx](#26autocompletejsx)
- [27. Card.jsx](#27cardjsx)
- [28. Card.jsx](#28cardjsx)
- [29. Avatar.jsx](#29avatarjsx)
- [30. ConfirmDialog.jsx](#30confirmdialogsx)
- [31. ResizablePanel.jsx](#31resizablepaneljsx)
- [32. NodoArbol.jsx](#32nodoarboljsx)

## 

# 1. Modal.jsx

Objetivo: El componente Modal tiene como objetivo proporcionar una base reutilizable, consistente y accesible para todos los diálogos modales dentro de la aplicación. Su propósito es centralizar la lógica común de los modales (como el renderizado mediante portal, el manejo del overlay, el botón de cierre básico y la estructura HTML/CSS fundamental), reduciendo la duplicación de código y asegurando una experiencia de usuario uniforme.

## Características Clave:

__Renderizado con Portal:__ Utiliza ReactDOM.createPortal para renderizar el modal directamente en el document.body, evitando problemas de z-index y contexto de apilamiento con elementos padres.

__Overlay:__ Incluye un overlay semi-transparente que cubre el resto de la página. Hacer clic en el overlay cierra el modal (a menos que se haga clic dentro del contenido del modal).

__Estructura Estándar:__ Provee una estructura HTML básica con clases CSS (custom-modal-overlay, custom-modal, custom-modal-title, custom-modal-body, custom-modal-close) para aplicar estilos consistentes.

__Título Opcional:__ Permite mostrar un título en la cabecera del modal.

__Botón de Cierre Opcional:__ Incluye un botón estándar ('X') en la esquina superior derecha, cuya visibilidad se puede controlar.

__Contenido Flexible:__ El contenido específico de cada modal se inserta como children.

__Accesibilidad:__ Incorpora atributos ARIA básicos (role="dialog", aria-modal="true", aria-labelledby) para mejorar la accesibilidad.

## Props API:
| Prop            | Tipo    | Requerido | Default | Descripción                                                                                                    |
| :-------------- | :------ | :-------- | :------ | :------------------------------------------------------------------------------------------------------------- |
| `isOpen`        | boolean | Sí        | -       | Controla si el modal está visible o no. Debe ser manejado por el estado del componente padre.                   |
| `onClose`       | func    | Sí        | -       | Función que se llama cuando se intenta cerrar el modal (clic en overlay, clic en botón 'X'). Debe actualizar el estado `isOpen` en el padre. |
| `title`         | string  | No        | `null`  | Texto a mostrar como título del modal.                                                                          |
| `width`         | number  | No        | `40`    | Ancho del modal en unidades `rem`.                                                                               |
| `showCloseButton`| boolean | No        | `true`  | Determina si se muestra el botón de cierre ('X') en la esquina superior derecha.                               |
| `children`      | node    | Sí        | -       | El contenido React (JSX, texto, otros componentes) que se mostrará dentro del cuerpo del modal.                 |

## Uso Básico:

El componente Modal es un componente controlado. Su visibilidad (isOpen) debe ser manejada por el estado del componente que lo utiliza (el componente padre).

        import React, { useState } from 'react';
        import Modal from './Modal';
        import FormButton from './FormButton'; // O cualquier botón

        function MyComponent() {
        // 1. Estado para controlar la visibilidad del modal
        const [isModalOpen, setIsModalOpen] = useState(false);

        // 2. Funciones para abrir y cerrar el modal
        const handleOpenModal = () => setIsModalOpen(true);
        const handleCloseModal = () => setIsModalOpen(false);

        return (
            <div>
            {/* Botón para abrir el modal */}
            <FormButton label="Abrir Modal" onClick={handleOpenModal} />

            {/* El componente Modal */}
            <Modal
                isOpen={isModalOpen}      // Pasa el estado
                onClose={handleCloseModal}  // Pasa la función de cierre
                title="Título del Modal"    // Título opcional
                width={50}                // Ancho opcional
                // showCloseButton={true} // Es true por defecto
            >
                {/* 3. Contenido específico del modal va aquí como 'children' */}
                <p>Este es el contenido dentro de mi modal.</p>
                <p>Puedes poner cualquier elemento JSX aquí.</p>
                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <FormButton label="Cerrar desde dentro" onClick={handleCloseModal} variant="outline" />
                </div>
            </Modal>
            </div>
        );
        }

        export default MyComponent;

## Contenido y Estructura Interna (children):
Todo lo que coloques entre las etiquetas <Modal> y </Modal> se pasará como children. Estos children se renderizarán dentro de un div con la clase custom-modal-body. Eres responsable de estructurar y estilizar este contenido interno como necesites.

## Estilado:
Los estilos base del modal (overlay, contenedor, título, botón de cierre, cuerpo) se encuentran en styles/Modal.css.
Estos estilos utilizan variables CSS definidas en themes.css (ej: --modal-bg, --modal-overlay-bg, --txt-color) para adaptarse al tema claro/oscuro.
Para añadir estilos específicos al contenido de un modal particular, aplica clases CSS a los elementos que pases como children y define esas clases en tus archivos CSS habituales (components.css, MyComponent.css, etc.).

## Relación con Modales Específicos:
Componentes como ConfirmDialog utilizan Modal como base. Lo hacen:
Renderizando <Modal>.
Pasando las props necesarias (isOpen, onClose, title).
Configurando props específicas (ej: showCloseButton={false} para ConfirmDialog).
Pasando el contenido específico (mensaje, botones de acción) como children del <Modal>.
Se espera que otros modales (como el futuro ChangePasswordModal refactorizado) sigan este mismo patrón.

## Nota sobre el Estado:
Recuerda que el componente Modal en sí no maneja su propio estado de visibilidad. Es responsabilidad del componente padre gestionar si el modal está abierto o cerrado (usualmente con useState) y pasar los valores correctos a las props isOpen y onClose.
[🔝 Volver al índice](#índice-de-componentes)
# 2. FormInput.jsx

## Objetivo: 
Proporcionar un componente estándar, accesible y estilizado para campos de entrada de una sola línea en formularios input. Centraliza la estructura de etiqueta, campo de entrada y manejo de errores para asegurar consistencia visual y funcional en toda la aplicación.

## Características Clave:
Soporte de Tipos Nativos: Permite especificar diferentes tipos de input HTML (text, password, email, number, date, etc.) a través de la prop type.
Etiqueta Integrada (label): Renderiza automáticamente una etiqueta label visible asociada correctamente con el campo de entrada mediante htmlFor y un id único generado (useId), mejorando la accesibilidad y la UX (clic en la etiqueta enfoca el input).
Manejo de Errores: Incluye soporte visual y de accesibilidad para errores de validación. Muestra un mensaje de error debajo del campo y aplica estilos distintivos (borde rojo) cuando se proporciona la prop error. Utiliza aria-invalid y aria-describedby.
Estructura Consistente (form-group): Envuelve la etiqueta y el input en un div con la clase form-group, facilitando el layout y espaciado uniforme en los formularios.
Indicador de Campo Requerido: Muestra un indicador visual (ej: *) junto a la etiqueta si la prop required es verdadera.
Ref Forwarding: Utiliza React.forwardRef para permitir el acceso directo al elemento input subyacente desde componentes padres si es necesario.
Props Nativas: Pasa cualquier prop adicional (...rest) directamente al elemento input, permitiendo el uso de atributos HTML estándar (maxLength, pattern, autoComplete, etc.).
Tematización: Utiliza variables CSS definidas en themes.css a través de las clases CSS compartidas (form-input, is-invalid, etc.) para adaptarse al tema claro/oscuro.

## Props API:
| Prop               | Tipo                    | Requerido | Default   | Descripción                                                                                                     |
| :----------------- | :---------------------- | :-------- | :-------- | :-------------------------------------------------------------------------------------------------------------- |
| `name`             | string                  | Sí        | -         | Atributo `name` del input, crucial para la identificación en los datos del formulario. Usado también para el `id`. |
| `value`            | string \| number        | Sí        | -         | El valor actual del campo de entrada (componente controlado).                                                    |
| `onChange`         | func                    | Sí        | -         | Función callback que se ejecuta cuando el valor del input cambia. Recibe el evento de cambio.                   |
| `label`            | string                  | No        | `null`    | El texto a mostrar en la etiqueta `<label>` asociada al input.                                                  |
| `type`             | string                  | No        | `'text'`  | El tipo de input HTML (ej: `'text'`, `'password'`, `'email'`, `'number'`, `'date'`).                               |
| `placeholder`      | string                  | No        | `""`      | Texto de marcador de posición estándar para el input.                                                             |
| `required`         | boolean                 | No        | `false`   | Si es `true`, añade el atributo `required` al input y muestra el indicador visual en la etiqueta.             |
| `disabled`         | boolean                 | No        | `false`   | Si es `true`, deshabilita el campo de entrada.                                                                  |
| `error`            | string \| null          | No        | `null`    | Si se proporciona un string, activa el estado de error: aplica estilos `.is-invalid` y muestra el mensaje.     |
| `className`        | string                  | No        | `""`      | Clases CSS adicionales para aplicar directamente al elemento `<input>`.                                         |
| `containerClassName` | string                  | No        | `""`      | Clases CSS adicionales para aplicar al `div.form-group` contenedor.                                             |
| `style`            | object                  | No        | `{}`      | Estilos en línea para aplicar directamente al elemento `<input>`.                                               |
| `...rest`          | -                       | No        | -         | Cualquier otra prop válida para un elemento `<input>` HTML (`maxLength`, `pattern`, `autoComplete`, `aria-*`...) |

## Uso Básico:
            import React, { useState } from 'react';
            import FormInput from './FormInput';

            function MyForm() {
            const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');
            const [usernameError, setUsernameError] = useState(null);

            const handleUsernameChange = (e) => {
                setUsername(e.target.value);
                // Ejemplo simple de validación
                if (e.target.value && e.target.value.length < 3) {
                setUsernameError('El usuario debe tener al menos 3 caracteres.');
                } else {
                setUsernameError(null);
                }
            };

            const handlePasswordChange = (e) => {
                setPassword(e.target.value);
            };

            return (
                <form>
                <FormInput
                    label="Nombre de Usuario"
                    name="username"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Ingrese su usuario"
                    required={true}
                    error={usernameError} // Pasa el mensaje de error
                    maxLength={50}       // Ejemplo de prop nativa pasada con ...rest
                />

                <FormInput
                    label="Contraseña"
                    name="password"
                    type="password" // Cambia el tipo de input
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Ingrese su contraseña"
                    required={true}
                    // Sin error en este ejemplo
                />
                {/* ... otros campos y botón de submit ... */}
                </form>
            );
            }

            export default MyForm;

## Estilado:
La estructura base (div.form-group), la etiqueta (.form-label), el input (.form-input) y los estados de error (.is-invalid, .form-error-message) se definen en archivos CSS compartidos (ej: forms.css).
Estos estilos utilizan variables CSS de themes.css para la tematización.
Usa className para estilos específicos del input y containerClassName para estilos del div contenedor.

## Accesibilidad:
La asociación automática label[htmlFor] -> input[id] es clave.
El manejo de errores incluye aria-invalid y aria-describedby para comunicar el estado a tecnologías asistivas.
[🔝 Volver al índice](#índice-de-componentes)
# 3. FormTextarea.jsx

## Objetivo: 
Proporcionar un componente estándar, accesible y estilizado para campos de entrada de texto de múltiples líneas en formularios textarea. Al igual que FormInput, centraliza la estructura y manejo de errores para consistencia.

## Características Clave:

__Entrada Multilínea__: Utiliza el elemento textarea nativo.

__Altura Controlable (rows)__: Permite definir la altura inicial del campo mediante la prop rows.

__Etiqueta Integrada (label):__ Funciona igual que en FormInput, renderizando una label asociada correctamente.
 
 __Manejo de Errores:__ Idéntico a FormInput, mostrando mensajes y aplicando estilos .is-invalid cuando se proporciona la prop error. Incluye aria-invalid y aria-describedby.

**Estructura Consistente (form-group):** Utiliza el mismo div.form-group que FormInput.

**Indicador de Campo Requerido:** Muestra * junto a la etiqueta si required={true}.

**Ref Forwarding:** Permite el acceso al elemento textarea subyacente.

**Props Nativas:** Pasa props adicionales (...rest) al elemento textarea (maxLength, etc.).

**Tematización:** Usa variables CSS a través de las clases compartidas (form-input, is-invalid, etc.).

### Props API:

| Prop               | Tipo           | Requerido | Default   | Descripción                                                                                                     |
| :----------------- | :------------- | :-------- | :-------- | :-------------------------------------------------------------------------------------------------------------- |
| `name`             | string         | Sí        | -         | Atributo `name` del textarea, crucial para la identificación en los datos del formulario. Usado también para el `id`. |
| `value`            | string         | Sí        | -         | El valor actual del campo de texto (componente controlado).                                                      |
| `onChange`         | func           | Sí        | -         | Función callback que se ejecuta cuando el valor del textarea cambia. Recibe el evento de cambio.                 |
| `label`            | string         | No        | `null`    | El texto a mostrar en la etiqueta `<label>` asociada al textarea.                                               |
| `placeholder`      | string         | No        | `""`      | Texto de marcador de posición estándar para el textarea.                                                          |
| `rows`             | number         | No        | `3`       | Número de filas visibles inicialmente, controla la altura.                                                      |
| `required`         | boolean        | No        | `false`   | Si es `true`, añade el atributo `required` al textarea y muestra el indicador visual en la etiqueta.            |
| `disabled`         | boolean        | No        | `false`   | Si es `true`, deshabilita el campo de texto.                                                                   |
| `error`            | string \| null | No        | `null`    | Si se proporciona un string, activa el estado de error: aplica estilos `.is-invalid` y muestra el mensaje.    |
| `className`        | string         | No        | `""`      | Clases CSS adicionales para aplicar directamente al elemento `<textarea>`.                                      |
| `containerClassName` | string         | No        | `""`      | Clases CSS adicionales para aplicar al `div.form-group` contenedor.                                            |
| `style`            | object         | No        | `{}`      | Estilos en línea para aplicar directamente al elemento `<textarea>`.                                             |
| `...rest`          | -              | No        | -         | Cualquier otra prop válida para un elemento `<textarea>` HTML (`maxLength`, `aria-*`...)                            |

### Uso Básico:
            import React, { useState } from 'react';
            import FormTextarea from './FormTextarea';

            function CommentForm() {
            const [comment, setComment] = useState('');
            const [commentError, setCommentError] = useState(null);

            const handleCommentChange = (e) => {
                setComment(e.target.value);
                if (e.target.value.length > 200) {
                setCommentError('El comentario no puede exceder los 200 caracteres.');
                } else {
                setCommentError(null);
                }
            };

            return (
                <form>
                <FormTextarea
                    label="Tu Comentario"
                    name="comment"
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Escribe tu comentario aquí..."
                    rows={5} // Hacerlo un poco más alto
                    required={true}
                    error={commentError}
                    maxLength={200} // Pasado con ...rest
                />
                {/* ... botón de submit ... */}
                </form>
            );
            }

            export default CommentForm;

### Estilado:
Utiliza la misma estructura y clases CSS que FormInput (.form-group, .form-label, .form-input, .is-invalid, .form-error-message).
Se aplica la clase form-input al textarea para heredar estilos base. Se puede usar la clase adicional .form-textarea para estilos específicos si fuera necesario (raramente).
Se adapta a los temas claro/oscuro mediante variables CSS.

### Accesibilidad:
La asociación label[htmlFor] -> textarea[id] es fundamental.
El manejo de errores incluye aria-invalid y aria-describedby.
Esta documentación debería servir como una buena referencia para ti y para cualquier otra persona que use estos componentes en el futuro. ¡Listo para continuar con FormSelect o el componente que prefieras!
[🔝 Volver al índice](#índice-de-componentes)
# 4. FormSelect.jsx

## Objetivo: 
Proporcionar un componente estándar, accesible y estilizado para campos de selección desplegables (select) en formularios. Asegura una apariencia y comportamiento consistentes con otros campos de formulario como FormInput y FormTextarea.


## Características Clave:
__Selección Nativa:__ Utiliza el elemento (select) nativo de HTML, garantizando compatibilidad y accesibilidad básica.
__Opciones Estandarizadas:__ Espera un array de objetos con claves value y label para las opciones, simplificando su uso.
__Etiqueta Integrada (label):__ Renderiza automáticamente una etiqueta (label) visible asociada correctamente con el campo de selección mediante htmlFor y un id único generado (useId).
__Placeholder:__ Permite mostrar una opción inicial no seleccionable (ej: "Seleccione...").
__Manejo de Errores:__ Incluye soporte visual (.is-invalid) y de accesibilidad (aria-invalid, aria-describedby) para errores de validación, mostrando un mensaje cuando se proporciona la prop error.
__Estructura Consistente (form-group):__ Envuelve la etiqueta y el select en un div.form-group.
Indicador de Campo Requerido: Muestra * junto a la etiqueta si required={true}.
__Ref Forwarding__ Permite el acceso al elemento (select) subyacente mediante React.forwardRef.
__Props Nativas:__ Pasa props adicionales (...rest) directamente al elemento (select) (multiple, size, etc., aunque multiple podría requerir ajustes de estilo).
__Estilo Personalizado y Tematización:__ Utiliza las clases .form-input (para estilos base compartidos) y .form-select (para estilos específicos como la flecha desplegable), adaptándose a los temas claro/oscuro mediante variables CSS.

## Props API:
| Prop                 | Tipo                                                                     | Requerido | Default            | Descripción                                                                                                                  |
| :------------------- | :----------------------------------------------------------------------- | :-------- | :----------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| `name`               | string                                                                   | Sí        | -                  | Atributo `name` del select, crucial para la identificación en los datos del formulario. Usado también para el `id`.              |
| `value`              | string \| number                                                         | Sí        | -                  | El valor (`option.value`) actualmente seleccionado (componente controlado).                                                    |
| `onChange`           | func                                                                     | Sí        | -                  | Función callback que se ejecuta cuando la selección cambia. Recibe el evento de cambio.                                     |
| `options`            | `Array<{value: string\|number, label: string}>`                          | Sí        | `[]`               | Array de objetos, cada uno con `value` (valor único de la opción) y `label` (texto visible de la opción).                     |
| `label`              | string                                                                   | No        | `null`             | El texto a mostrar en la etiqueta `<label>` asociada al select.                                                              |
| `placeholder`        | string                                                                   | No        | `"Seleccione..."`  | Texto para la primera opción deshabilitada/oculta que actúa como marcador de posición.                                        |
| `disabled`           | boolean                                                                  | No        | `false`            | Si es `true`, deshabilita el campo de selección.                                                                            |
| `required`           | boolean                                                                  | No        | `false`            | Si es `true`, añade el atributo `required` al select y muestra el indicador visual en la etiqueta.                           |
| `error`              | string \| null                                                         | No        | `null`             | Si se proporciona un string, activa el estado de error: aplica estilos `.is-invalid` y muestra el mensaje.                    |
| `className`          | string                                                                   | No        | `""`               | Clases CSS adicionales para aplicar directamente al elemento `<select>`.                                                      |
| `containerClassName`   | string                                                                   | No        | `""`               | Clases CSS adicionales para aplicar al `div.form-group` contenedor.                                                         |
| `style`              | object                                                                   | No        | `{}`               | Estilos en línea para aplicar directamente al elemento `<select>`.                                                          |
| `...rest`            | -                                                                        | No        | -                  | Cualquier otra prop válida para un elemento `<select>` HTML (`aria-*`, `data-*`, `multiple`...).                                |

## Uso Básico:

        import React, { useState } from 'react';
        import FormSelect from './FormSelect';

        function SettingsForm() {
        const [selectedRole, setSelectedRole] = useState(''); // Usar string vacío para el placeholder
        const [roleError, setRoleError] = useState(null);

        const rolesDisponibles = [
            { value: 'admin', label: 'Administrador' },
            { value: 'editor', label: 'Editor' },
            { value: 'viewer', label: 'Visualizador' }
        ];

        const handleRoleChange = (e) => {
            setSelectedRole(e.target.value);
            if (!e.target.value) { // Validación simple: requerido
            setRoleError('Debes seleccionar un rol.');
            } else {
            setRoleError(null);
            }
        };

        return (
            <form>
            <FormSelect
                label="Rol de Usuario"
                name="role"
                value={selectedRole}
                onChange={handleRoleChange}
                options={rolesDisponibles}
                placeholder="-- Elige un Rol --" // Placeholder personalizado
                required={true}
                error={roleError}
                // Ejemplo de prop nativa pasada con ...rest
                aria-describedby="role-description"
            />
            <p id="role-description" style={{fontSize: '0.8rem', color: 'grey'}}>
                El rol determina los permisos del usuario.
            </p>

            {/* ... otros campos y botón de submit ... */}
            </form>
        );
        }


## Estilado:
Utiliza la estructura base div.form-group y la etiqueta .form-label.
El elemento (select) tiene las clases .form-input (para heredar estilos base como borde, padding base, colores, estado de foco/deshabilitado) y .form-select (para estilos específicos como la flecha personalizada y el padding-right adicional).
Los estados de error (.is-invalid, .form-error-message) usan las mismas clases que otros campos de formulario.
Se adapta a los temas claro/oscuro mediante variables CSS.

## Accesibilidad:
Asociación label[htmlFor] -> select[id].
Uso de aria-invalid y aria-describedby para errores.
Uso de aria-label como fallback si no se proporciona label.
[🔝 Volver al índice](#índice-de-componentes)
# 5. FormButton.jsx

__Objetivo__: Proporcionar un componente de botón (button) altamente reutilizable y estilizado para acciones en la interfaz. Ofrece variantes visuales, tamaños, soporte para iconos y un indicador de estado de carga integrado.

## Características Clave:

__Botón Nativo:__ Utiliza el elemento (button) nativo de HTML.

__Variantes Visuales:__ Soporta múltiples estilos predefinidos (default, danger, outline, success, subtle) a través de la prop variant, fácilmente extensibles con CSS.

__Tamaños:__ Permite definir tamaños (small, medium, large) mediante la prop size.

__Soporte de Iconos:__ Puede mostrar un icono (componente React, ej: <FaIcon />) junto a la etiqueta de texto.

__Estado de Carga (isLoading):__ Muestra un componente Loader interno y se deshabilita automáticamente cuando la prop isLoading es true, proporcionando feedback visual claro durante operaciones asíncronas.

__Alineación Interna:__ Controla la alineación horizontal del contenido (icono + etiqueta) dentro del botón.

__Ancho Completo:__ Opción para que el botón ocupe todo el ancho disponible de su contenedor.

__Ref Forwarding:__ Permite obtener una referencia al elemento (button) subyacente.

__Props Nativas:__ Pasa props adicionales (...rest) directamente al elemento (button) (title, aria-label, data-*, etc.).

__Accesibilidad:__ Incluye atributos aria-live y aria-busy para comunicar el estado de carga a tecnologías asistivas.

__Tematización:__ Utiliza variables CSS para adaptarse a los temas claro/oscuro.

## Props API:
| Prop         | Tipo                                                  | Requerido | Default         | Descripción                                                                                                                             |
| :----------- | :---------------------------------------------------- | :-------- | :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| `label`      | string                                                | No        | `null`          | Texto principal del botón. Opcional si se usa solo un icono.                                                                              |
| `icon`       | node                                                  | No        | `null`          | Componente React (ej: icono de `react-icons`) a mostrar antes del label.                                                                    |
| `onClick`    | func                                                  | No        | `undefined`     | Función a ejecutar cuando se hace clic en el botón.                                                                                       |
| `type`       | `'button' \| 'submit' \| 'reset'`                   | No        | `'button'`      | Atributo `type` del botón HTML.                                                                                                           |
| `variant`    | `'default' \| 'danger' \| 'outline' \| 'success' \| 'subtle'` | No        | `'default'`     | Variante visual/estilo del botón. Requiere clases CSS correspondientes (ej: `.form-button--danger`).                                       |
| `size`       | `'small' \| 'medium' \| 'large'`                      | No        | `'medium'`      | Tamaño del botón (padding, font-size). Requiere clases CSS correspondientes (ej: `.form-button--small`).                                    |
| `align`      | `'left' \| 'center' \| 'right'`                       | No        | `'center'`      | Alineación horizontal del contenido interno (icono y label) usando `justify-content`.                                                        |
| `fullWidth`  | boolean                                               | No        | `false`         | Si es `true`, el botón intentará ocupar el ancho completo de su contenedor (requiere clase CSS `.form-button--fullwidth`).              |
| `disabled`   | boolean                                               | No        | `false`         | Si es `true`, deshabilita explícitamente el botón (independientemente de `isLoading`).                                                    |
| `isLoading`  | boolean                                               | No        | `false`         | Si es `true`, deshabilita el botón y muestra un `Loader` interno en lugar del contenido normal.                                             |
| `loaderSize` | `'small' \| 'medium' \| 'large'`                      | No        | `'small'`       | Tamaño del `Loader` que se muestra cuando `isLoading` es `true`.                                                                        |
| `loaderText` | string                                                | No        | `"Cargando..."` | Texto alternativo para accesibilidad que se asocia al `Loader` cuando está visible.                                                       |
| `className`  | string                                                | No        | `""`            | Clases CSS adicionales para aplicar directamente al elemento `<button>`.                                                                 |
| `...rest`    | -                                                     | No        | -               | Cualquier otra prop válida para un elemento `<button>` HTML (`title`, `aria-label`, `data-*`...).                                        |

## Uso Básico:

        import React, { useState } from 'react';
        import FormButton from './FormButton';
        import { FaSave, FaTrashAlt } from 'react-icons/fa';

        function ButtonExamples() {
        const [isSaving, setIsSaving] = useState(false);
        const [isDeleting, setIsDeleting] = useState(false);

        const handleSave = async () => {
            setIsSaving(true);
            // Simula llamada API
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSaving(false);
            console.log('Guardado!');
        };

        const handleDelete = async () => {
            setIsDeleting(true);
            // Simula llamada API
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsDeleting(false);
            console.log('Eliminado!');
        };

        return (
            <div>
            {/* Botón estándar */}
            <FormButton label="Default" onClick={() => alert('Click!')} />

            {/* Botón con icono y variante */}
            <FormButton
                label="Guardar"
                icon={<FaSave />}
                variant="success"
                onClick={handleSave}
                isLoading={isSaving} // <<< Pasa el estado de carga
                loaderText="Guardando..." // Texto accesible opcional
            />

            {/* Botón pequeño, variante danger, deshabilitado o cargando */}
            <FormButton
                label="Eliminar"
                icon={<FaTrashAlt />}
                variant="danger"
                size="small"
                onClick={handleDelete}
                isLoading={isDeleting}
                // disabled={true} // También se puede deshabilitar explícitamente
            />

            {/* Botón solo con icono (requiere aria-label) */}
            <FormButton
                icon={<FaTrashAlt />}
                variant="subtle"
                size="small"
                onClick={handleDelete}
                isLoading={isDeleting}
                aria-label="Eliminar Item" // <<< IMPORTANTE para accesibilidad
                title="Eliminar" // Tooltip opcional
            />
            </div>
        );
        }

        export default ButtonExamples;

## Estilado:
La clase base es .form-button.
Las variantes y tamaños se aplican con modificadores BEM (.form-button--variant, .form-button--size).
El contenido interno (icono/label) está en .form-button__content.
El loader se muestra en .form-button__loader.
Se añade la clase .form-button--loading al botón cuando isLoading es true para estilos específicos opcionales (ej: cursor: wait).
Usa variables CSS para tematización.

## Accesibilidad:
Utiliza el elemento (button) semántico.
Permite pasar aria-label (especialmente importante para botones solo con icono).
Comunica el estado de carga con aria-live y aria-busy.
El Loader interno tiene un aria-label configurable (loaderText).
[🔝 Volver al índice](#índice-de-componentes)
# 6. ToggleSwitch.jsx

## __Objetivo:__ 
Proporcionar un interruptor de palanca (toggle switch) accesible y estilizado, comúnmente utilizado para activar/desactivar opciones booleanas en formularios o configuraciones. Se integra con la estructura y estilos de los demás componentes de formulario.

## Características Clave:

__Input Checkbox Oculto:__ Utiliza un <input type="checkbox"> nativo oculto para manejar el estado y la accesibilidad, estilizando un span (.slider) para la apariencia visual del interruptor.

__Etiqueta Asociada (label):__ Permite mostrar una etiqueta de texto visible asociada al interruptor, mejorando la claridad y permitiendo activar/desactivar el switch al hacer clic en ella.

__Manejo de Errores:__ Soporta la visualización de mensajes de error debajo del componente y aplica estilos indicativos si se proporciona la prop error. Utiliza aria-invalid y aria-describedby.

__Estado Deshabilitado:__ Se puede deshabilitar visualmente y funcionalmente mediante la prop disabled.

__Tamaños:__ Ofrece diferentes tamaños visuales (small, medium, large) a través de la prop size.

__Estructura Consistente (form-group):__ Envuelve el componente en un div.form-group para un layout y espaciado uniformes. Un div.form-toggle-inner agrupa la etiqueta y el switch para facilitar la alineación (generalmente horizontal).

__Ref Forwarding:__ Permite acceder al elemento <input type="checkbox"> subyacente.

__Props Nativas:__ Pasa props adicionales (...rest) al elemento (input).

__Tematización:__ Los colores del interruptor (fondo activado/desactivado, círculo) y del texto utilizan variables CSS para adaptarse a los temas.


## Props API:

| Prop                 | Tipo                               | Requerido | Default    | Descripción                                                                                                                       |
| :------------------- | :--------------------------------- | :-------- | :--------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| `checked`            | boolean                            | Sí        | -          | Estado actual del interruptor (encendido/apagado). Debe ser controlado por el componente padre.                                    |
| `onChange`           | func                               | Sí        | -          | Función callback que se ejecuta cuando el estado del interruptor cambia. Recibe el evento de cambio del input checkbox.              |
| `label`              | string                             | No        | `null`     | El texto a mostrar en la etiqueta `<label>` visible junto al interruptor.                                                          |
| `name`               | string                             | No        | `undefined`| Atributo `name` para el input checkbox, útil si se usa en un formulario nativo.                                                    |
| `size`               | `'small' \| 'medium' \| 'large'`   | No        | `'medium'` | Tamaño visual del interruptor. Requiere clases CSS correspondientes (`.switch--small`, etc.).                                       |
| `disabled`           | boolean                            | No        | `false`    | Si es `true`, deshabilita el interruptor (visualmente y funcionalmente).                                                          |
| `error`              | string \| null                     | No        | `null`     | Si se proporciona un string, muestra el mensaje de error debajo y puede aplicar estilos de error opcionales al grupo/switch.       |
| `className`          | string                             | No        | `""`       | Clases CSS adicionales para aplicar al elemento `<label class="switch...">` (el contenedor visual del interruptor).              |
| `containerClassName` | string                             | No        | `""`       | Clases CSS adicionales para aplicar al `div.form-group` contenedor principal.                                                    |
| `required`           | boolean                            | No        | `false`    | Añade el atributo `required` al input checkbox nativo (uso menos común para toggles, pero disponible para consistencia).             |
| `...rest`            | -                                  | No        | -          | Cualquier otra prop válida para un elemento `<input type="checkbox">` HTML (`aria-label` si no hay label visible, `data-*`...). |

## Uso Básico:
        import React, { useState } from 'react';
        import ToggleSwitch from './ToggleSwitch';

        function UserPreferences() {
        const [notificationsEnabled, setNotificationsEnabled] = useState(true);
        const [darkMode, setDarkMode] = useState(false);

        const handleNotificationsChange = (e) => {
            setNotificationsEnabled(e.target.checked);
        };

        const handleDarkModeChange = (e) => {
            setDarkMode(e.target.checked);
            // Lógica para cambiar el tema...
        };

        return (
            <div>
            <h3>Preferencias</h3>
            <ToggleSwitch
                label="Recibir Notificaciones por Correo"
                name="emailNotifications" // Opcional
                checked={notificationsEnabled}
                onChange={handleNotificationsChange}
            />

            <ToggleSwitch
                label="Modo Oscuro"
                name="darkMode"
                checked={darkMode}
                onChange={handleDarkModeChange}
                size="small" // Ejemplo de tamaño diferente
            />

            <ToggleSwitch
                label="Opción Deshabilitada"
                name="disabledOption"
                checked={false}
                onChange={() => {}} // onChange sigue siendo requerido
                disabled={true} // Ejemplo deshabilitado
            />

            <ToggleSwitch
                label="Opción con Error"
                name="errorOption"
                checked={true}
                onChange={() => {}}
                error="Esta opción requiere configuración adicional." // Ejemplo de error
            />
            </div>
        );
        }

        export default UserPreferences;

## Estilado:
La estructura base es div.form-group > div.form-toggle-inner > (label.form-label + label.switch).
Los estilos visuales del interruptor se definen en las clases .switch, .switch--[size], .slider, .slider::before. Estas clases suelen estar en components.css.
El espaciado y layout general lo maneja .form-group (de forms.css).
El estado deshabilitado aplica estilos a través de .form-group--disabled.
El estado de error puede aplicar estilos mediante .form-group--error y muestra el mensaje con .form-error-message.
Usa variables CSS para tematización.

## Accesibilidad:
La etiqueta de texto (label.form-label) está asociada al input mediante htmlFor/id.
El input checkbox nativo (aunque oculto) maneja el estado y los atributos checked, disabled, required.
Se usan aria-invalid y aria-describedby para comunicar errores.
Si no se proporciona label, se debe pasar un aria-label mediante {...rest} para describir la función del interruptor a tecnologías asistivas.
[🔝 Volver al índice](#índice-de-componentes)
# 7. Titulo.jsx

## Objetivo: 
Proporcionar un componente flexible para renderizar títulos y encabezados (h1 a h6, u otras etiquetas) con control granular sobre su apariencia y semántica HTML.

## Características Clave:
__Etiqueta Semántica (as):__ Permite especificar qué etiqueta HTML se debe renderizar (por defecto h1, pero puede ser h2, h3, ..., h6, p, span, etc.), asegurando la correcta estructura semántica del documento.

__Control de Estilos Individual:__ Ofrece props dedicadas para controlar la mayoría de los aspectos visuales comunes: size, color, margin, padding, align (alineación de texto), weight (grosor de fuente), uppercase, italic, underline, lineHeight, y fontFamily.

__Estilos Inline y Clases:__ Acepta una prop style para aplicar estilos inline adicionales y una prop className para añadir clases CSS personalizadas.

__Props Nativas:__ Pasa cualquier prop adicional (...rest) directamente a la etiqueta HTML renderizada, permitiendo el uso de id, data-*, aria-*, etc.

__Defaults Sensibles:__ Utiliza valores por defecto razonables y variables CSS del tema (var(--txt-color), var(--font-family)) para una integración básica.

## Props API:
| Prop         | Tipo                                                        | Requerido | Default             | Descripción                                                                                              |
| :----------- | :---------------------------------------------------------- | :-------- | :------------------ | :------------------------------------------------------------------------------------------------------- |
| `children`   | node                                                        | Sí        | -                   | El contenido del título (normalmente texto).                                                               |
| `as`         | `'h1' \| 'h2' \| ... \| 'h6' \| 'p' \| 'span' \| 'div'`     | No        | `'h1'`              | La etiqueta HTML que se usará para renderizar el título.                                                   |
| `className`  | string                                                      | No        | `""`                | Clases CSS adicionales para aplicar al elemento título.                                                     |
| `size`       | string                                                      | No        | `"1.5rem"`          | Tamaño de la fuente (ej: `'2rem'`, `'16px'`).                                                              |
| `color`      | string                                                      | No        | `'var(--txt-color)'`| Color del texto (ej: `'red'`, `'#FFF'`, `var(--primary)`).                                               |
| `margin`     | string                                                      | No        | `"0"`               | Margen CSS alrededor del título (ej: `'1rem 0'`, `'0 0 1em 0'`).                                          |
| `padding`    | string                                                      | No        | `"0"`               | Padding CSS dentro del título.                                                                            |
| `align`      | `'left' \| 'center' \| 'right' \| 'justify'`                | No        | `'left'`            | Alineación del texto (`text-align`).                                                                       |
| `weight`     | string \| number                                            | No        | `'bold'`            | Grosor de la fuente (`font-weight`, ej: `'normal'`, `600`, `'bold'`).                                        |
| `uppercase`  | boolean                                                     | No        | `false`             | Si es `true`, convierte el texto a mayúsculas (`text-transform: uppercase`).                               |
| `italic`     | boolean                                                     | No        | `false`             | Si es `true`, aplica estilo de fuente itálico (`font-style: italic`).                                       |
| `underline`  | boolean                                                     | No        | `false`             | Si es `true`, subraya el texto (`text-decoration: underline`).                                             |
| `lineHeight` | string \| number                                            | No        | `"1.2"`             | Altura de línea (`line-height`, ej: `1.5`, `'30px'`).                                                     |
| `fontFamily` | string                                                      | No        | `'var(--font-family)'`| Familia de fuentes CSS (`font-family`).                                                                   |
| `style`      | object                                                      | No        | `{}`                | Objeto de estilos inline para aplicar o sobrescribir otros estilos.                                         |
| `...rest`    | -                                                           | No        | -                   | Cualquier otra prop válida para el elemento HTML especificado en `as` (`id`, `title`, `data-*`, `aria-*`...). |

## Uso Básico:
        import React from 'react';
        import Titulo from './Titulo';

        function Article() {
        return (
            <article>
            <Titulo as="h1" size="2.5rem" align="center" margin="0 0 1rem 0">
                Título Principal del Artículo
            </Titulo>

            <Titulo as="h2" size="1.8rem" weight="600" color="var(--primary)" margin="2rem 0 0.5rem 0">
                Sección Importante
            </Titulo>

            <p>Contenido de la sección...</p>

            <Titulo as="h3" size="1.4rem" italic={true} weight="normal">
                Subsección con estilo itálico
            </Titulo>

            <p>Más contenido...</p>

            {/* Título con clase y data-attribute */}
            <Titulo
                as="h2"
                variant="h2" // Si hubieras mantenido variantes, podrías usarla
                className="special-section-title"
                data-section-id="intro"
                id="main-intro-heading"
            >
                Título con Atributos Extra
            </Titulo>

            </article>
        );
        }

        export default Article;

## Estilado:
El componente aplica estilos inline basados en las props (size, color, weight, etc.).
Se añade la clase titulo-component al elemento renderizado, permitiendo estilos CSS globales si es necesario.
Se pueden añadir clases específicas mediante la prop className.
Se pueden sobrescribir o añadir estilos específicos mediante la prop style.
Los colores y fuentes por defecto utilizan variables CSS para adaptarse a los temas.

## Accesibilidad:
La prop as es fundamental para generar la estructura semántica correcta de encabezados (h1-h6).
Permite pasar cualquier atributo aria-* necesario mediante {...rest}.
[🔝 Volver al índice](#índice-de-componentes)
# 8. Parrafo.jsx

## Objetivo: 
Proporcionar un componente estándar para renderizar bloques de texto (párrafos p) con estilos consistentes y opciones de personalización. Facilita la aplicación de estilos tipográficos predefinidos mediante variantes.

## Características Clave:
__Elemento Párrafo:__ Renderiza semánticamente un elemento p de HTML.

__Variantes de Estilo:__ Soporta variantes predefinidas (body, lead, caption, error, success, etc.) a través de la prop variant, que aplican un conjunto coherente de estilos (tamaño, peso, color, altura de línea, márgenes).

__Control de Estilos Individual:__ Permite sobrescribir los estilos de la variante o definir estilos personalizados mediante props individuales (size, color, margin, weight, align, etc.).

__Estilos Inline y Clases:__ Acepta props style y className para personalizaciones avanzadas.

__Props Nativas:__ Pasa cualquier prop adicional (...rest) directamente al elemento p (id, data-*, aria-*, etc.).

__Tematización:__ Utiliza variables CSS (var(--txt-color), var(--font-family), var(--danger), etc.) para adaptarse a los temas claro/oscuro.

## Props API:
| Prop          | Tipo                                               | Requerido | Default             | Descripción                                                                                                                               |
| :------------ | :------------------------------------------------- | :-------- | :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `children`    | node                                               | Sí        | -                   | El contenido del párrafo (texto, elementos inline, etc.).                                                                                     |
| `variant`     | string                                             | No        | `'body'`            | Variante de estilo predefinida a aplicar (ej: `'body'`, `'lead'`, `'caption'`, `'error'`). Define estilos base como `fontSize`, `fontWeight`, `color`, `lineHeight`, `marginBottom`. |
| `className`   | string                                             | No        | `""`                | Clases CSS adicionales para aplicar al elemento `<p>`.                                                                                     |
| `size`        | string                                             | No        | -                   | Sobrescribe el `fontSize` de la variante.                                                                                                   |
| `color`       | string                                             | No        | `var(--txt-color)`  | Sobrescribe el `color` de la variante.                                                                                                    |
| `margin`      | string                                             | No        | `null`              | Sobrescribe los márgenes (`marginTop`, `marginBottom`) definidos por la variante. Si no se define ni en variante ni aquí, no tendrá margen explícito. |
| `padding`     | string                                             | No        | -                   | Añade padding CSS al párrafo.                                                                                                            |
| `align`       | `'left' \| 'center' \| 'right' \| 'justify'`     | No        | -                   | Sobrescribe el `textAlign` de la variante (si lo define) o lo establece.                                                                    |
| `weight`      | string \| number                                   | No        | -                   | Sobrescribe el `fontWeight` de la variante.                                                                                              |
| `lineHeight`  | string \| number                                   | No        | -                   | Sobrescribe el `lineHeight` de la variante.                                                                                              |
| `fontFamily`  | string                                             | No        | `var(--font-family)`| Sobrescribe la `fontFamily` por defecto.                                                                                                |
| `maxWidth`    | string                                             | No        | `null`              | Establece un ancho máximo para el párrafo (ej: `'600px'`, `'80ch'`).                                                                     |
| `textIndent`  | string                                             | No        | -                   | Aplica sangría a la primera línea (`text-indent`).                                                                                        |
| `letterSpacing`| string                                             | No        | -                   | Ajusta el espaciado entre letras (`letter-spacing`).                                                                                       |
| `wordSpacing` | string                                             | No        | -                   | Ajusta el espaciado entre palabras (`word-spacing`).                                                                                        |
| `whiteSpace`  | string                                             | No        | -                   | Controla cómo se maneja el espacio en blanco (`white-space`, ej: `'pre-wrap'`).                                                           |
| `italic`      | boolean                                            | No        | -                   | Aplica estilo de fuente itálico (`font-style: italic`).                                                                                   |
| `style`       | object                                             | No        | `{}`                | Objeto de estilos inline para aplicar o sobrescribir otros estilos.                                                                          |
| `...rest`     | -                                                  | No        | -                   | Cualquier otra prop válida para un elemento `<p>` HTML (`id`, `title`, `data-*`, `aria-*`...).                                              |

## Uso Básico:
    import React from 'react';
    import Parrafo from './Parrafo';

        function TextBlock() {
        const errorMessage = "Hubo un problema al procesar tu solicitud.";
        const successMessage = "Operación completada con éxito.";

        return (
            <div>
            <Titulo as="h2">Texto de Ejemplo</Titulo> {/* Asumiendo componente Titulo */}

            {/* Párrafo estándar usando la variante 'body' por defecto */}
            <Parrafo>
                Este es un párrafo de texto normal. Utiliza los estilos definidos
                en la variante 'body', incluyendo tamaño, peso, altura de línea y
                margen inferior predeterminados para una buena legibilidad.
            </Parrafo>

            {/* Párrafo introductorio (lead) */}
            <Parrafo variant="lead">
                Este párrafo utiliza la variante 'lead', haciéndolo ligeramente más
                grande y destacado, ideal para introducciones.
            </Parrafo>

            {/* Párrafo con estilo sobrescrito */}
            <Parrafo align="center" weight="bold" color="var(--highlight)">
                Este párrafo tiene estilos individuales que sobrescriben la variante 'body'.
                Está centrado, en negrita y usa el color de resaltado.
            </Parrafo>

            {/* Texto de leyenda */}
            <Parrafo variant="caption">
                Figura 1: Leyenda o nota al pie usando la variante 'caption'.
            </Parrafo>

            {/* Mensaje de error */}
            {errorMessage && (
                <Parrafo variant="error" role="alert"> {/* role="alert" para accesibilidad */}
                {errorMessage}
                </Parrafo>
            )}

            {/* Mensaje de éxito */}
            {successMessage && (
                <Parrafo variant="success">
                {successMessage}
                </Parrafo>
            )}
            </div>
        );
        }

        export default TextBlock;

## Estilado:
Los estilos principales se definen dentro del componente basados en la variant seleccionada y las props individuales.
Se añade la clase parrafo-component y parrafo--[variant] al elemento <p> para permitir estilos globales o específicos de variante vía CSS si se desea.
Las props className y style permiten personalización adicional.
Utiliza variables CSS para colores, fuentes y potencialmente otros aspectos para tematización.

## Accesibilidad:
Renderiza un elemento <p> semántico.
Permite pasar atributos aria-* mediante {...rest}. Para mensajes de error/estado, se recomienda añadir role="alert" o role="status" según corresponda.
[🔝 Volver al índice](#índice-de-componentes)
# 9. Container.jsx

## Objetivo: 
Proporcionar un componente de layout versátil para envolver contenido, ofreciendo control sobre su etiqueta semántica, fondo, dimensiones, espaciado y apariencia visual básica.

## Características Clave:

__Contenedor Semántico (as):__ Permite especificar la etiqueta HTML a renderizar (div, section, article, aside, etc.) mediante la prop as, mejorando la estructura semántica del documento. Por defecto es div.
Estilos Configurables: Ofrece props para controlar background (usando variables CSS por defecto), width, padding, maxWidth, margin y textAlign.

__Centrado Fácil:__ Incluye una prop booleana centered para aplicar fácilmente margin: 0 auto y centrar el contenedor horizontalmente.

__Modificadores Visuales:__ Soporta props booleanas (bordered, animated) que añaden clases CSS (container--bordered, container--animated) para aplicar estilos adicionales como bordes o animaciones (definidos en CSS).

__Extensibilidad:__ Acepta className para añadir clases CSS personalizadas y {...rest} para pasar cualquier atributo HTML estándar (id, data-*, aria-*) al elemento contenedor.

__Tematización:__ El color de fondo por defecto (var(--background2)) y los estilos de los modificadores (ej: borde) deben usar variables CSS para adaptarse a los temas.

## Props API:

| Prop         | Tipo               | Requerido | Default             | Descripción                                                                                                                                        |
| :----------- | :----------------- | :-------- | :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`   | node               | No        | `null`              | El contenido React (JSX, texto, otros componentes) que se mostrará dentro del contenedor.                                                             |
| `as`         | elementType        | No        | `'div'`             | El tipo de elemento HTML o componente React a renderizar como contenedor (ej: `'div'`, `'section'`, `'article'`).                                       |
| `background` | string             | No        | `'var(--background2)'`| Color de fondo CSS para el contenedor. Por defecto usa una variable CSS del tema.                                                                      |
| `width`      | string             | No        | `'100%'`            | Ancho CSS del contenedor.                                                                                                                           |
| `padding`    | string             | No        | `'1rem'`            | Padding CSS interno del contenedor.                                                                                                                  |
| `maxWidth`   | string             | No        | `null`              | Ancho máximo CSS del contenedor. No se aplica si es `null`.                                                                                        |
| `margin`     | string             | No        | `null`              | Margen CSS explícito para el contenedor. Tiene prioridad sobre `centered`.                                                                            |
| `centered`   | boolean            | No        | `false`             | Si es `true` y no se proporciona `margin`, aplica `margin: 0 auto` para centrar horizontalmente.                                                      |
| `bordered`   | boolean            | No        | `false`             | Si es `true`, añade la clase `container--bordered` (o `.bordered`) para aplicar un estilo de borde definido en CSS.                                    |
| `animated`   | boolean            | No        | `false`             | Si es `true`, añade la clase `container--animated` (o `.animated`) para aplicar una animación definida en CSS (ej: `fadeIn`).                             |
| `textAlign`  | `'left' \| 'center' \| 'right' \| 'justify'` | No    | `null`              | Alineación del texto (`text-align`) dentro del contenedor. No se aplica si es `null`.                                                |
| `className`  | string             | No        | `""`                | Clases CSS adicionales para aplicar al elemento contenedor.                                                                                          |
| `style`      | object             | No        | `{}`                | Objeto de estilos inline para aplicar o sobrescribir otros estilos.                                                                                 |
| `...rest`    | -                  | No        | -                   | Cualquier otra prop válida para el elemento HTML especificado en `as` (`id`, `title`, `data-*`, `aria-*`...).                                        |

## Uso Básico:
        import Container from './Container';
        import Titulo from './Titulo'; // Asumiendo componente Titulo
        import Parrafo from './Parrafo'; // Asumiendo componente Parrafo

        function PageLayout() {
        return (
            <div>
            {/* Contenedor principal de página, centrado y con ancho máximo */}
            <Container as="main" centered maxWidth="960px" padding="2rem 1rem">
                <Titulo as="h1">Contenido Principal</Titulo>
                <Parrafo>Este contenido está dentro de un contenedor principal centrado.</Parrafo>
            </Container>

            {/* Un contenedor tipo tarjeta con borde */}
            <Container bordered padding="1.5rem" margin="2rem 0" background="var(--background1)">
                <Titulo as="h2" size="1.5rem">Tarjeta de Información</Titulo>
                <Parrafo>Información dentro de una tarjeta con borde.</Parrafo>
            </Container>

            {/* Contenedor simple para agrupar, sin estilos especiales */}
            <Container>
                <Parrafo>Otro párrafo agrupado.</Parrafo>
            </Container>

            {/* Contenedor como sección semántica */}
            <Container as="section" aria-labelledby="contact-heading">
                <Titulo as="h2" id="contact-heading">Contacto</Titulo>
                {/* ... formulario de contacto ... */}
            </Container>
            </div>
        );
        }

        export default PageLayout;

## Estilado:
Aplica estilos inline basados en props como background, width, padding, maxWidth, margin, textAlign.
Añade la clase base container.
Añade clases modificadoras si bordered={true} (container--bordered) o animated={true} (container--animated). Estas clases deben estar definidas en tus archivos CSS y preferiblemente usar variables CSS para bordes, etc.
Permite añadir clases personalizadas con className y estilos inline con style.

## Accesibilidad:
La prop as permite usar etiquetas HTML semánticamente correctas (main, section, article, aside, nav).
Permite pasar cualquier atributo aria-* o role necesario mediante {...rest}.
[🔝 Volver al índice](#índice-de-componentes)
# 10. FormCheckBox.jsx

## Objetivo: 
Proporcionar un componente estándar, accesible y estilizado para campos de selección tipo casilla de verificación (input type="checkbox"). Se integra con la estructura y estilos de los demás componentes de formulario, ofreciendo una apariencia personalizada.

## Características Clave:

__Checkbox Personalizado:__ Utiliza un input type="checkbox" nativo oculto para la lógica y accesibilidad, pero muestra una representación visual personalizada (una caja que se marca/desmarca) para una apariencia consistente con el tema.

__Etiqueta Clickable:__ Permite mostrar una etiqueta de texto visible (label) asociada al checkbox. Hacer clic tanto en la etiqueta como en la caja visual cambia el estado del checkbox.

__Manejo de Errores:__ Soporta la visualización de mensajes de error (error) debajo del componente y puede aplicar estilos indicativos si es necesario. Utiliza aria-invalid y aria-describedby.

__Estado Deshabilitado:__ Se puede deshabilitar visual y funcionalmente (disabled).

__Estructura Consistente (form-group):__ Envuelve el componente en un div.form-group. Un div.form-checkbox-inner agrupa la caja visual y la etiqueta para facilitar la alineación.

__Indicador de Campo Requerido:__ Muestra * junto a la etiqueta si required={true} (uso menos común para checkboxes individuales, pero disponible).

__Ref Forwarding:__ Permite acceder al elemento input type="checkbox" subyacente.

__Props Nativas:__ Pasa props adicionales (...rest) al elemento input.

__Tematización:__ Usa variables CSS para los colores de borde, fondo (marcado/desmarcado) y el icono de checkmark.

## Props API:

| Prop                 | Tipo           | Requerido | Default    | Descripción                                                                                                                            |
| :------------------- | :------------- | :-------- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| `checked`            | boolean        | Sí        | -          | Estado actual del checkbox (marcado/desmarcado). Debe ser controlado por el componente padre.                                          |
| `onChange`           | func           | Sí        | -          | Función callback que se ejecuta cuando el estado del checkbox cambia. Recibe el evento de cambio del input.                            |
| `label`              | string         | No        | `null`     | El texto a mostrar en la etiqueta `<label>` visible junto a la caja visual. Altamente recomendado para accesibilidad.                  |
| `name`               | string         | No        | `undefined`| Atributo `name` para el input checkbox, útil si se usa en un formulario nativo o para agrupar checkboxes.                               |
| `disabled`           | boolean        | No        | `false`    | Si es `true`, deshabilita el checkbox (visualmente y funcionalmente).                                                                 |
| `error`              | string \| null | No        | `null`     | Si se proporciona un string, muestra el mensaje de error debajo y puede aplicar estilos de error opcionales al grupo/checkbox visual. |
| `className`          | string         | No        | `""`       | Clases CSS adicionales para aplicar al elemento `<label class="form-checkbox__visual...">` (la caja visual).                             |
| `containerClassName` | string         | No        | `""`       | Clases CSS adicionales para aplicar al `div.form-group` contenedor principal.                                                         |
| `required`           | boolean        | No        | `false`    | Añade el atributo `required` al input checkbox nativo.                                                                                 |
| `...rest`            | -              | No        | -          | Cualquier otra prop válida para un elemento `<input type="checkbox">` HTML (`aria-label` si no hay label visible, `data-*`...).        |

## Uso Básico:
        import React, { useState } from 'react';
        import FormCheckBox from './FormCheckBox';

        function PreferencesForm() {
        const [agreed, setAgreed] = useState(false);
        const [updates, setUpdates] = useState(true);
        const [agreeError, setAgreeError] = useState(null);

        const handleAgreeChange = (e) => {
            setAgreed(e.target.checked);
            if (e.target.checked) setAgreeError(null);
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!agreed) {
            setAgreeError("Debe aceptar los términos.");
            return;
            }
            // ... enviar datos ...
            console.log("Formulario enviado", { agreed, updates });
        }

        return (
            <form onSubmit={handleSubmit}>
            <FormCheckBox
                label="He leído y acepto los términos."
                name="agreement"
                checked={agreed}
                onChange={handleAgreeChange}
                required={true}
                error={agreeError}
            />

            <FormCheckBox
                label="Recibir actualizaciones por email."
                name="receiveUpdates"
                checked={updates}
                onChange={(e) => setUpdates(e.target.checked)}
            />

            <FormButton type="submit" label="Guardar Preferencias" />
            </form>
        );
        }

        export default PreferencesForm;

## Estilado:
La estructura base es div.form-group > div.form-checkbox-inner > (input + label.form-checkbox__visual + label.form-label).
El input real (.form-checkbox__input--hidden) está oculto.
La caja visual (.form-checkbox__visual) y el checkmark interno (.form-checkbox__checkmark) definen la apariencia. Sus estilos se controlan en CSS (ej: components.css).
Los estados :checked, :focus, disabled, error se manejan con selectores CSS que reaccionan al estado del input oculto o a clases añadidas dinámicamente.
Usa variables CSS para tematización.

## Accesibilidad:
La etiqueta de texto (label.form-label) y la caja visual (label.form-checkbox__visual) están asociadas al input oculto mediante htmlFor/id.
El input nativo maneja los estados checked, disabled, required.
Se usan aria-invalid y aria-describedby para errores.
Si no se proporciona label, se debe pasar un aria-label mediante {...rest} al input para describir su propósito.
[🔝 Volver al índice](#índice-de-componentes)
# 11. DocumentManager.jsx

## Objetivo: 
Actuar como un coordinador para gestionar y mostrar documentos asociados a una entidad específica (como un Proyecto o una Tarea). Se encarga de obtener la lista de documentos, manejar los estados de carga y error, y renderizar los componentes necesarios para la carga (DocumentUploader) y visualización/gestión (DocumentList) de dichos documentos.

## Características Clave:

__Obtención Dinámica de Datos:__ Realiza una llamada a la API para obtener los documentos relevantes basándose en las props tipo (ej: 'proyecto', 'tarea') e id (el ID de la entidad).

__Integración de Componentes:__ Orquesta y renderiza los componentes DocumentUploader (para añadir nuevos documentos) y DocumentList (para mostrar y gestionar los existentes).

__Manejo de Estado de Carga:__ Muestra un componente Loader mientras se obtienen los datos de la lista de documentos, proporcionando feedback visual al usuario.

__Manejo de Errores:__ Captura errores durante la obtención de datos y muestra un mensaje descriptivo al usuario utilizando el componente Parrafo.

__Coordinación de Actualizaciones:__ Pasa callbacks (onUpload, onDelete) a los componentes hijos para poder refrescar la lista de documentos automáticamente después de que se suba o elimine un archivo.

## Props API:
| Prop   | Tipo                   | Requerido | Default | Descripción                                                                 |
| :----- | :--------------------- | :-------- | :------ | :-------------------------------------------------------------------------- |
| `id`   | string \| number       | Sí        | -       | El identificador único del proyecto o tarea al que pertenecen los documentos. |
| `tipo` | `'proyecto' \| 'tarea'` | Sí        | -       | Indica si los documentos pertenecen a un 'proyecto' o una 'tarea'. Determina la URL de la API a consultar. |

## Uso Básico:
DocumentManager se utiliza típicamente dentro de una página o componente que muestra los detalles de un proyecto o tarea específicos.

        import React from 'react';
        import DocumentManager from './DocumentManager'; // Ajusta la ruta de importación
        import Titulo from './Titulo';

        // Ejemplo dentro de una página de detalles de Proyecto
        function PaginaDetalleProyecto({ projectId }) { // Asume que projectId se obtiene de la ruta o props

        return (
            <div>
            <Titulo as="h2">Detalles del Proyecto</Titulo>
            {/* ... otros detalles del proyecto ... */}

            <div style={{marginTop: '2rem'}}>
                <Titulo as="h3">Documentos Adjuntos</Titulo>
                <DocumentManager
                tipo="proyecto" // Especifica que es para un proyecto
                id={projectId}    // Pasa el ID del proyecto actual
                />
            </div>
            </div>
        );
        }

        // Ejemplo dentro de un componente/modal de detalles de Tarea
        function DetallesTarea({ tareaId }) {

            return (
                <div>
                    <h4>Documentos de la Tarea</h4>
                    <DocumentManager
                        tipo="tarea" // Especifica que es para una tarea
                        id={tareaId}   // Pasa el ID de la tarea actual
                    />
                    {/* ... otros detalles de la tarea ... */}
                </div>
            );
        }

## Estilado:

El componente DocumentManager en sí mismo aplica mínimos estilos directos (un div contenedor opcional con clase .document-manager).
La apariencia visual principal proviene de los componentes que renderiza:
DocumentUploader: Estilos relacionados con la carga de archivos.
Loader: Estilos del indicador de carga.
Parrafo: Estilos para el mensaje de error (usando variant="error").
DocumentList: Estilos de la tabla (DataTable) y los botones (FormButton) dentro de ella.
Puede ser necesario añadir márgenes o padding al contenedor .document-manager o al contenedor padre donde se use DocumentManager para integrarlo correctamente en el layout general de la página.

## Componentes Relacionados:

DocumentUploader.jsx: Componente responsable de la interfaz de carga de nuevos archivos. Recibe proyectoId o tareaId y el callback onUpload.
DocumentList.jsx: Componente que muestra la lista de documentos existentes en un DataTable, permitiendo acciones como descargar o eliminar. Recibe documentos y el callback onDelete.
Loader.jsx: Muestra una animación de carga.
Parrafo.jsx: Se utiliza para mostrar mensajes de error.

## Manejo de Estado Interno:

documentos (Array): Almacena la lista de documentos obtenida de la API.
isLoading (boolean): Indica si se está realizando la carga inicial de documentos.
error (string | null): Almacena el mensaje de error si la carga falla.
[🔝 Volver al índice](#índice-de-componentes)
# 12. DocumentList.jsx

## Objetivo: 

Mostrar una lista tabulada de documentos asociados a una entidad (proyecto o tarea), permitiendo al usuario visualizar información clave (nombre, fecha de subida), ordenar la lista, y realizar acciones como descargar o eliminar cada documento.

## Características Clave:

__Visualización en Tabla:__ Utiliza el componente DataTable para presentar la lista de documentos de forma organizada y clara.

__Columnas Configurables:__ Define columnas para mostrar el nombre del documento y la fecha de subida formateada (usando FormattedDate).

__Acciones por Documento:__ Incluye una columna de "Acciones" con botones (FormButton) para:
__Descargar:__ Inicia la descarga del archivo correspondiente. Muestra un estado de carga (isLoading) en el botón durante la descarga.

__Eliminar:__ Inicia el proceso de eliminación, mostrando primero un diálogo de confirmación (ConfirmDialog). Muestra un estado de carga (isLoading) en el botón durante la eliminación.

__Ordenamiento:__ Permite ordenar la tabla haciendo clic en las cabeceras de las columnas "Nombre" y "Fecha Subida". Mantiene el estado de la columna y dirección de ordenamiento.

__Feedback Visual:__ Utiliza notificaciones (toast) para informar al usuario sobre el éxito o fracaso de las acciones de descarga y eliminación. Muestra indicadores de carga en los botones de acción.

__Confirmación de Eliminación:__ Utiliza ConfirmDialog para prevenir eliminaciones accidentales.
Manejo de Lista Vacía: Muestra un mensaje indicativo si no hay documentos para listar.

## Props API:

| Prop         | Tipo            | Requerido | Default | Descripción                                                                                                |
| :----------- | :-------------- | :-------- | :------ | :--------------------------------------------------------------------------------------------------------- |
| `documentos` | Array<`object`> | No        | `[]`    | Array de objetos, donde cada objeto representa un documento y debe tener al menos `documento_id`, `nombre`, y `fecha_subida`. |
| `onDelete`   | func            | No        | -       | Función callback que se ejecuta después de que un documento ha sido eliminado exitosamente. Recibe el `id` del documento eliminado como argumento. Se usa típicamente para que el componente padre (`DocumentManager`) refresque la lista. |

## Uso Básico:

DocumentList es generalmente utilizado dentro de DocumentManager o cualquier componente que ya haya obtenido la lista de documentos.

        import React, { useState, useEffect } from 'react';
        import DocumentList from './DocumentList';
        import axios from 'axios'; // O fetch

        function MiSeccionDeDocumentos({ entidadId }) {
        const [docs, setDocs] = useState([]);
        const [isLoading, setIsLoading] = useState(true);

        // Simulación de carga de documentos
        useEffect(() => {
            const cargarDocs = async () => {
            setIsLoading(true);
            try {
                // Reemplazar con tu lógica real de fetch
                // const response = await axios.get(`/api/documentos/entidad/${entidadId}`, { withCredentials: true });
                // setDocs(response.data);
                // Ejemplo con datos mock:
                await new Promise(res => setTimeout(res, 500)); // Simula delay
                setDocs([
                { documento_id: 1, nombre: 'Informe_Final.pdf', fecha_subida: '2023-10-26T10:00:00Z' },
                { documento_id: 2, nombre: 'Especificaciones_V2.docx', fecha_subida: '2023-10-25T15:30:00Z' },
                ]);
            } catch (error) {
                console.error("Error cargando documentos:", error);
            } finally {
                setIsLoading(false);
            }
            };
            cargarDocs();
        }, [entidadId]);

        // Callback para manejar la eliminación (ej: refrescar lista)
        const handleDocBorrado = (idBorrado) => {
            console.log(`Documento ${idBorrado} borrado, actualizando UI...`);
            setDocs(prevDocs => prevDocs.filter(doc => doc.documento_id !== idBorrado));
            // O podrías llamar a una función para volver a hacer fetch de la lista completa
        };

        if (isLoading) {
            return <p>Cargando lista de documentos...</p>;
        }

        return (
            <div>
            <h3>Lista de Documentos</h3>
            <DocumentList
                documentos={docs}
                onDelete={handleDocBorrado} // Pasa el callback
            />
            </div>
        );
        }

        export default MiSeccionDeDocumentos;

## Estilado:

Utiliza el componente DataTable, que debe tener sus propios estilos definidos (tables.css).
Utiliza FormButton para las acciones, aplicando sus variantes y tamaños (components.css, forms.css).
Puede requerir estilos específicos para la clase .table-actions o .actions-column para alinear correctamente los botones dentro de la celda de la tabla.
Las notificaciones usan la clase .notification-toast (definida probablemente en components.css).

## Componentes Relacionados:

__DataTable.jsx:__ Componente genérico para renderizar tablas de datos.

__FormattedDate.jsx:__ Formatea las fechas de subida.

__FormButton.jsx:__ Utilizado para los botones de acción (Descargar, Eliminar).

__ConfirmDialog.jsx:__ Muestra el diálogo de confirmación antes de eliminar.

__Loader.jsx:__ Se muestra dentro de los FormButton durante las acciones asíncronas.

## Manejo de Estado Interno:

__notificacion (string | null):__ Mensaje de notificación temporal.

__sortColumn (string | null):__ Columna actualmente seleccionada para ordenar.

__sortDirection ('asc' | 'desc'):__ Dirección del ordenamiento actual.

__itemAEliminar (object | null):__ Almacena la información del documento cuya eliminación se está confirmando.

__loadingStates (object):__ Almacena el estado de carga para cada acción y cada documento (ej: {'download-1': true}).

[🔝 Volver al índice](#índice-de-componentes)
# 13. FormattedDate.jsx

## Objetivo: 
Mostrar un valor de fecha/hora en un formato legible por humanos predefinido, manejando valores nulos o inválidos.

## Características Clave:

__Formateo Simple:__ Convierte objetos Date o strings de fecha válidos a formatos comunes como dd-mm-yyyy, dd-mmm-yyyy, etc.

__Manejo de Nulos/Inválidos:__ Si la prop date es nula, indefinida o no representa una fecha válida, retorna un guion (-) por defecto.

__Formatos Predefinidos:__ Soporta varios formatos comunes a través de la prop format.

__Localización Básica:__ Utiliza toLocaleString para formatos que dependen del idioma (como meses abreviados), configurable mediante la prop locale.

__Ligero:__ No depende de librerías externas de manejo de fechas.

## Props API:
| Prop     | Tipo   | Requerido | Default      | Descripción                                                                                                |
| :------- | :----- | :-------- | :----------- | :--------------------------------------------------------------------------------------------------------- |
| `date`   | any    | No        | `null`       | El valor de fecha a formatear. Puede ser un objeto `Date`, un string parseable por `new Date()`, o `null`/`undefined`. |
| `format` | string | No        | `"dd-mm-yyyy"` | El formato de salida deseado. Opciones: `"dd-mm-yy"`, `"dd-mm-yyyy"`, `"dd-mmm-yyyy"`, `"larga"`. Si se proporciona un formato no válido, usa `"dd-mm-yyyy"`. |
| `locale` | string | No        | `"es-ES"`    | El código de locale (ej: `'en-US'`, `'fr-FR'`) a usar para formatos que dependen del idioma (`dd-mmm-yyyy`, `larga`). |


## Uso Básico:
        import React from 'react';
        import FormattedDate from './FormattedDate';

        function UserProfile({ user }) { // Asume que user tiene una propiedad lastLogin
        return (
            <div>
            <p>Último acceso:</p>
            <ul>
                <li>Formato Default: <FormattedDate date={user.lastLogin} /></li>
                <li>Formato Corto: <FormattedDate date={user.lastLogin} format="dd-mm-yy" /></li>
                <li>Mes Abreviado: <FormattedDate date={user.lastLogin} format="dd-mmm-yyyy" /></li>
                <li>Largo con Hora: <FormattedDate date={user.lastLogin} format="larga" /></li>
                <li>En Inglés: <FormattedDate date={user.lastLogin} format="dd-mmm-yyyy" locale="en-US" /></li>
                <li>Fecha Inválida: <FormattedDate date="esto no es una fecha" /></li>
                <li>Fecha Nula: <FormattedDate date={null} /></li>
            </ul>
            </div>
        );
        }

## Estilado:

El componente renderiza un simple span. No aplica estilos propios más allá de los heredados del texto circundante.
[🔝 Volver al índice](#índice-de-componentes)
# 14. DevBanner.jsx
## Objetivo: 

Mostrar un banner visual persistente en la esquina de la pantalla únicamente cuando la aplicación se ejecuta en entorno de desarrollo (process.env.NODE_ENV === 'development'). Sirve como un recordatorio visual claro de que no se está en producción.

## Características Clave:

Condicional al Entorno: Se renderiza automáticamente solo si process.env.NODE_ENV es igual a 'development'. En cualquier otro entorno (producción, test, etc.), retorna null.
Visualización Fija: Se posiciona de forma fija en la esquina superior derecha de la pantalla.
Estilo Distintivo: Utiliza un fondo y texto llamativos para ser fácilmente visible.
Sin Dependencias: Componente autónomo con estilos inline.

## Props API:
Este componente no acepta ninguna prop.

## Uso Básico:

Simplemente incluye el componente en el layout principal de tu aplicación (ej: dentro de App.jsx o en el componente raíz), usualmente fuera del Routes para que sea persistente.

        // Dentro de App.jsx (o similar)
        import React from 'react';
        import { Routes, Route } from 'react-router-dom';
        import DevBanner from './components/DevBanner'; // Ajusta la ruta
        // ... otras importaciones

        function App() {
        return (
            <div className="app-container">
            <Routes>
                {/* ... tus rutas ... */}
            </Routes>
            <DevBanner /> {/* Añadir el banner aquí */}
            </div>
        );
        }

        export default App;

## Estilado:

Utiliza estilos inline definidos dentro del propio componente para posicionamiento, colores, tamaño de fuente, etc. No requiere archivos CSS externos.
[🔝 Volver al índice](#índice-de-componentes)
# 15. Loader.jsx

## Objetivo: 

Mostrar un indicador visual animado (spinner) para comunicar al usuario que una operación está en curso o que el contenido se está cargando. Utiliza CSS puro para la animación.

## Características Clave:

__Spinner CSS:__ Renderiza un spinner animado sin depender de JavaScript pesado o GIFs.
Tamaños Configurables: Permite ajustar el tamaño visual del spinner (small, medium, large) mediante la prop size.

__Texto Opcional:__ Puede mostrar un texto descriptivo (Cargando..., Procesando...) debajo o junto al spinner mediante la prop text.

__Accesibilidad:__ Incluye atributos role="status", aria-live="polite" y texto alternativo oculto para informar a tecnologías asistivas sobre el estado de carga.

__Estilo Flexible:__ Acepta className y style para personalizaciones adicionales.

__Tematización:__ Debe usar variables CSS en sus estilos asociados (.loader, .loader-text) para adaptarse a los temas claro/oscuro.

## Props API:

(La tabla se generará en la siguiente respuesta si la pides)

## Uso Básico:

        import React, { useState, useEffect } from 'react';
        import Loader from './Loader';
        import FormButton from './FormButton'; // Para ejemplo con botón

        function DataFetcher() {
        const [data, setData] = useState(null);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            setData(null);
            try {
            // Simula fetch
            await new Promise(res => setTimeout(res, 1500));
            setData("¡Datos cargados!");
            } catch (err) {
            setError("Error al cargar datos");
            } finally {
            setIsLoading(false);
            }
        };

        return (
            <div>
            <FormButton label="Cargar Datos" onClick={fetchData} isLoading={isLoading} />

            {/* Mostrar Loader mientras carga */}
            {isLoading && (
                <div style={{ margin: '1rem 0' }}>
                <Loader size="medium" text="Obteniendo información..." />
                </div>
            )}

            {/* Mostrar error si existe */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Mostrar datos si existen */}
            {data && <p>{data}</p>}
            </div>
        );
        }

## Estilado:

Requiere clases CSS definidas externamente: .loader-container, .loader, .loader--[size], .loader-text, .visually-hidden.
Es fundamental que los colores (borde activo del spinner, color del texto) se definan usando variables CSS del tema.
[🔝 Volver al índice](#índice-de-componentes)
# 16. DataTable.jsx

## Objetivo: 

Renderizar datos estructurados en una tabla HTML (table), proporcionando funcionalidades básicas como definición dinámica de columnas, ordenamiento simple y la capacidad de renderizar contenido personalizado (incluyendo componentes interactivos) en las celdas.

## Características Clave:

__Basado en Datos y Columnas:__ Recibe un array de data y una configuración de columns para construir la tabla dinámicamente.

__Ordenamiento:__ Permite habilitar el ordenamiento en columnas específicas (sortable: true). Muestra indicadores visuales (flechas arriba/abajo) y notifica al componente padre mediante onSort cuando se hace clic en una cabecera ordenable. El estado del ordenamiento (sortColumn, sortDirection) es controlado por el padre.

__Renderizado Personalizado:__ La prop render en la definición de una columna permite devolver JSX personalizado para esa celda, ideal para formatear datos, mostrar imágenes, o incrustar componentes de formulario editables (FormInput, FormSelect, ToggleSwitch, etc.).

__Identificación de Filas:__ Utiliza rowIdKey para obtener un identificador único para el atributo key de cada fila (tr), importante para el rendimiento de React.

__Estilo mediante Clases:__ Permite asignar clases CSS a las columnas (th, td) a través de col.className para controlar anchos y estilos.

## Props API:

(La tabla se generará en la siguiente respuesta si la pides)

## Uso Básico:

        import React, { useState } from 'react';
        import DataTable from './DataTable';
        import FormattedDate from './FormattedDate';
        import FormButton from './FormButton';
        import FormInput from './FormInput'; // Para ejemplo de edición inline

        function UserTable({ users, onUserUpdate, onUserDelete }) { // Recibe datos y callbacks
        const [sortColumn, setSortColumn] = useState('name');
        const [sortDirection, setSortDirection] = useState('asc');

        const handleSort = (columnKey) => {
            const direction = (sortColumn === columnKey && sortDirection === 'asc') ? 'desc' : 'asc';
            setSortColumn(columnKey);
            setSortDirection(direction);
            // Aquí iría la lógica para reordenar el array 'users' o
            // llamar a una API para obtener los datos ordenados.
            console.log(`Ordenar por: ${columnKey}, Dirección: ${direction}`);
        };

        // Ejemplo de manejo de edición inline (simplificado)
        const handleLocalEdit = (userId, field, value) => {
            console.log(`Editar usuario ${userId}, campo ${field}, nuevo valor: ${value}`);
            // Aquí actualizarías el estado local o llamarías a onUserUpdate(userId, field, value)
        };

        const columns = [
            { key: 'name', label: 'Nombre', sortable: true, className: 'col-30' },
            { key: 'email', label: 'Correo Electrónico', sortable: true, className: 'col-40' },
            {
            key: 'registrationDate',
            label: 'Fecha Registro',
            sortable: true,
            className: 'col-15',
            render: (row) => <FormattedDate date={row.registrationDate} format="dd-mm-yyyy" /> // Usa render para formatear
            },
            {
                key: 'role',
                label: 'Rol (Editable)',
                className: 'col-15',
                // Usa render para hacer una celda editable
                render: (row) => (
                    <FormInput
                        name={`role-${row.id}`}
                        value={row.role}
                        onChange={(e) => handleLocalEdit(row.id, 'role', e.target.value)}
                        // Podrías añadir un botón de guardar aquí o manejarlo externamente
                    />
                )
            },
            {
            key: 'actions',
            label: 'Acciones',
            className: 'col-10 actions-column',
            render: (row) => ( // Usa render para botones
                <div className="table-actions">
                <FormButton icon={<FaEdit />} size="small" onClick={() => alert(`Editar ${row.name}`)} />
                <FormButton icon={<FaTrashAlt />} size="small" variant="danger" onClick={() => onUserDelete(row.id)} />
                </div>
            )
            }
        ];

        // Lógica de ordenamiento real iría aquí antes de pasar a DataTable
        const sortedUsers = [...users].sort((a, b) => {
            if (!sortColumn) return 0;
            const aVal = a[sortColumn]?.toLowerCase() ?? '';
            const bVal = b[sortColumn]?.toLowerCase() ?? '';
            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });


        return (
            <DataTable
            columns={columns}
            data={sortedUsers} // Pasa los datos ordenados
            rowIdKey="id" // Especifica la clave primaria de tus datos
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            // No se usan editable ni onEdit globales
            />
        );
        }

## Nota Importante sobre Edición:

La edición de datos dentro de la tabla debe implementarse usando la propiedad render dentro de la definición de la columna correspondiente. La función render debe devolver el componente de formulario adecuado (FormInput, FormSelect, etc.) y manejar la lógica de actualización del estado o llamada a la API a través del onChange de dicho componente o botones adicionales dentro de la celda. Las props globales editable y onEdit del componente DataTable se consideran obsoletas y no deben usarse.

## Estilado:

Requiere estilos CSS externos para .table-container, .styled-table, th, td, .sortable, y las clases de columna (col-X, actions-column, etc.).
Accesibilidad (Mejoras Recomendadas):
Añadir scope="col" a los elementos th.
Añadir el atributo aria-sort (ascending, descending, none) a las cabeceras th que son ordenables, actualizándolo según el estado de ordenamiento.
Considerar añadir una prop caption o labelledBy para proporcionar un título accesible a la tabla.

[🔝 Volver al índice](#índice-de-componentes)
# 17. SearchBar.jsx

## Objetivo: 

Proporcionar un campo de entrada de texto (input type="search") estilizado y reconocible, diseñado específicamente para la funcionalidad de búsqueda o filtrado, incluyendo un icono visual.

## Características Clave:

__Input de Búsqueda:__ Utiliza input type="search" para mejorar la semántica y potencialmente habilitar funcionalidades específicas del navegador (como un botón 'x' para limpiar).

__Controlado:__ Su valor es controlado por el componente padre a través de las props value y onChange.

__Icono Integrado:__ Muestra un icono de lupa (FaSearch) dentro de la barra para una indicación visual clara de su propósito.

__Personalización:__ Permite configurar el placeholder, el width de la barra y su align horizontal dentro de su contenedor.

__Estilo Flexible:__ Acepta className y style para personalización.

__Extensibilidad:__ (Refactorizado) Ahora incluye forwardRef y pasa {...rest} al elemento input, permitiendo referenciarlo y añadir atributos HTML/ARIA adicionales.

## Props API:
(La tabla se generará en la siguiente respuesta si la pides)

## Uso Básico:
        import React, { useState } from 'react';
        import SearchBar from './SearchBar';

        function UserList() {
        const [searchTerm, setSearchTerm] = useState('');
        const allUsers = [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 3, name: 'Charlie'}]; // Datos de ejemplo

        const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
        };

        const filteredUsers = allUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div>
            <SearchBar
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar usuarios por nombre..."
                // Pasar aria-label para accesibilidad
                aria-label="Buscar usuarios por nombre"
                // Opcional: alinear a la derecha
                // align="right"
                // Opcional: ancho específico
                // width="50%"
            />

            {/* Lista de resultados filtrados */}
            <ul>
                {filteredUsers.map(user => <li key={user.id}>{user.name}</li>)}
                {filteredUsers.length === 0 && <li>No se encontraron usuarios.</li>}
            </ul>
            </div>
        );
        }

## Estilado:

Requiere clases CSS externas: .search-container (contenedor principal), .search-bar (la barra visual con input e icono), .search-icon.
Los estilos deben usar variables CSS para colores de fondo, texto, borde e icono para adaptarse a los temas.

## Accesibilidad:

Utiliza input type="search".
Recomendación Importante: Es crucial proporcionar una etiqueta accesible. Esto se puede hacer pasando un aria-label directamente como prop (gracias a {...rest}) o, alternativamente, modificando el componente para aceptar una prop label que se asocie (posiblemente oculta visualmente) al input.
[🔝 Volver al índice](#índice-de-componentes)

# 19. Alert.jsx 

## Objetivo:
Proporcionar un componente flexible y accesible para mostrar mensajes importantes (éxito, error, advertencia, información) al usuario, con opciones de cierre y apariencia distintiva según el tipo. Reemplaza y mejora el sistema de notificaciones tipo toast implementado previamente en los formularios.

## Características Clave:

*   **Tipos Visuales:** Soporta 4 tipos (`success`, `error`, `warning`, `info`) con estilos (colores, iconos) predeterminados y personalizables vía CSS variables.
*   **Contenido Flexible:** Permite mostrar un mensaje simple (string) o contenido más estructurado (ej: título + descripción).
*   **Icono:** Muestra un icono representativo (`react-icons/fa`) según el tipo de alerta.
*   **Cierre Controlado:**
    *   Opción de cierre manual por el usuario (botón 'X').
    *   Opción de auto-cierre después de un tiempo determinado (para comportamiento tipo toast).
*   **Control de Visibilidad:** La visibilidad es controlada por el componente padre a través de la prop `isOpen`.
*   **Accesibilidad:** Implementa roles ARIA apropiados (`role="alert"` o `role="status"`) y `aria-live` para comunicar la información a tecnologías asistivas.
*   **Tematización:** Los colores se basan en variables CSS definidas en `_themes.css` para adaptarse a los temas claro/oscuro.
*   **Reutilizable:** Diseñado para ser usado en diferentes contextos, como notificaciones de formulario o mensajes globales.

## Props API:

| Prop              | Tipo                                       | Requerido | Default         | Descripción                                                                                                                               |
| :---------------- | :----------------------------------------- | :-------- | :-------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `isOpen`          | boolean                                    | Sí        | -               | Controla si la alerta está visible o no.                                                                                                   |
| `onClose`         | func                                       | No        | `undefined`     | Función callback que se ejecuta cuando se intenta cerrar la alerta (clic en botón 'X' o auto-cierre). Debe actualizar `isOpen` en el padre. |
| `type`            | `'success' \| 'error' \| 'warning' \| 'info'` | No        | `'info'`        | El tipo de alerta, determina el estilo visual (color, icono) y el `role` ARIA por defecto.                                                |
| `title`           | string                                     | No        | `null`          | Título opcional para la alerta, renderizado como `<h3>` dentro de la alerta.                                                               |
| `message`         | string \| node                             | Sí        | -               | El mensaje principal o contenido de la alerta. Puede ser un string o JSX más complejo.                                                      |
| `showIcon`        | boolean                                    | No        | `true`          | Determina si se muestra el icono (`FaCheckCircle`, `FaTimesCircle`, etc.) asociado al tipo de alerta.                                      |
| `showCloseButton` | boolean                                    | No        | `true`          | Determina si se muestra el botón de cierre ('X'). `onClose` debe estar definido para que el botón sea funcional.                           |
| `autoCloseDelay`  | number                                     | No        | `null`          | Tiempo en milisegundos tras el cual la alerta se cerrará automáticamente llamando a `onClose`. Si es `null` o `0`, no se auto-cierra.    |
| `className`       | string                                     | No        | `""`            | Clases CSS adicionales para aplicar al elemento `div` raíz de la alerta.                                                                   |
| `style`           | object                                     | No        | `{}`            | Estilos en línea para aplicar al elemento `div` raíz de la alerta.                                                                         |
| `role`            | string                                     | No        | (ver nota)      | Atributo ARIA `role`. Por defecto: `'status'` para `info`/`success` y `'alert'` para `error`/`warning`. Puede ser sobrescrito.           |
| `...rest`         | -                                          | No        | -               | Cualquier otra prop válida para el elemento `div` raíz (`id`, `data-*`, etc.).                                                            |

**Nota sobre `role` por defecto:**
*   Si `type` es `'error'` o `'warning'`, `role` por defecto será `'alert'` (para anuncios importantes e inmediatos).
*   Si `type` es `'success'` o `'info'`, `role` por defecto será `'status'` (para anuncios menos urgentes).

## Uso Básico:

        import React, { useState } from 'react';
        import Alert from './Alert'; // Ajusta la ruta de importación
        import FormButton from './FormButton';

        function AlertDemo() {
        const [alertState, setAlertState] = useState({
            isOpen: false,
            message: '',
            type: 'info',
            title: '',
            autoCloseDelay: 5000,
        });

        const showAlert = (message, type = 'info', title = '', autoCloseDelay = 5000) => {
            setAlertState({ isOpen: true, message, type, title, autoCloseDelay });
        };

        const handleCloseAlert = () => {
            setAlertState(prev => ({ ...prev, isOpen: false }));
        };

        return (
            <div>
            <Alert
                isOpen={alertState.isOpen}
                onClose={handleCloseAlert}
                type={alertState.type}
                title={alertState.title}
                message={alertState.message}
                autoCloseDelay={alertState.autoCloseDelay}
                // showIcon={true} // Por defecto es true
                // showCloseButton={true} // Por defecto es true
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <FormButton
                label="Mostrar Éxito"
                onClick={() => showAlert('¡Operación completada!', 'success', 'Éxito')}
                variant="success"
                />
                <FormButton
                label="Mostrar Error"
                onClick={() => showAlert('Algo salió mal.', 'error', 'Error Fatal', null)} // null para no auto-cerrar
                variant="danger"
                />
                <FormButton
                label="Mostrar Info"
                onClick={() => showAlert('Actualización disponible.', 'info', 'Noticia')}
                />
                <FormButton
                label="Mostrar Advertencia"
                onClick={() => showAlert('Tu sesión está a punto de expirar.', 'warning', 'Atención', 10000)}
                variant="outline" // Asumiendo una variante 'outline' o similar
                />
            </div>
            </div>
        );
        }

        export default AlertDemo;


## Estilado:
* Los estilos del componente Alert se definen en src/styles/components/_Alert.css. 
* Utiliza una estructura BEM:
    * Bloque: alert
    * Modificadores: alert--type-[success|error|warning|info]
    * Elementos: alert__icon, alert__content, alert__title, alert__message, alert__close-button.
* Los colores de fondo, texto, borde e iconos se gestionan mediante variables CSS definidas en src/styles/config/_themes.css para permitir la tematización claro/oscuro.
    * Variables de ejemplo: --alert-success-bg, --alert-error-text, --alert-warning-icon, etc.
* El layout interno se maneja con Flexbox para alinear el icono, contenido y botón de cierre.

## Accesibilidad:
* Utiliza role="alert" (para errores/advertencias) o role="status" (para éxitos/información) para comunicar semánticamente la naturaleza del mensaje a tecnologías asistivas.
* aria-live se establece en "assertive" para role="alert" y "polite" para role="status", controlando cómo se anuncian los cambios.
* aria-atomic="true" asegura que toda la alerta se anuncie como una unidad.
* El botón de cierre tiene un aria-label="Cerrar alerta" para una descripción clara.
🔝 Volver al índice

# 20. Tabs.jsx // Asegúrate de que el número sea consecutivo en tu Components.md

## Objetivo:
Permitir la organización y navegación de contenido en secciones mediante un sistema de pestañas clickeables. Ofrece diferentes estilos visuales y está diseñado con la accesibilidad en mente, incluyendo navegación por teclado.

## Características Clave:

*   **Conjunto de Pestañas y Paneles:** Renderiza una lista de cabeceras de pestaña y un área de contenido donde solo el panel asociado a la pestaña activa es visible.
*   **Control de Estado (Modo Controlado):** La pestaña activa es manejada por el componente padre a través de las props `activeTabId` y `onTabChange`.
*   **Configuración Flexible:** Las pestañas se definen mediante un array de objetos (`tabsConfig`), permitiendo especificar ID, etiqueta, icono opcional, contenido del panel y estado deshabilitado.
*   **Variantes Visuales:** Soporta múltiples estilos para las pestañas (`line`, `pills`, `boxed`) a través de la prop `variant`.
*   **Iconos en Pestañas:** Permite incluir un icono (nodo React) junto a la etiqueta de texto de cada pestaña.
*   **Accesibilidad:**
    *   Implementa roles ARIA (`tablist`, `tab`, `tabpanel`).
    *   Maneja atributos `aria-selected`, `aria-controls`, `aria-labelledby`.
    *   Soporta navegación por teclado entre pestañas (flechas izquierda/derecha, Home, End) y activación (Enter/Espacio).
    *   Los paneles de contenido son enfocables (`tabIndex="0"`).
*   **Tematización:** Los estilos son adaptables a los temas claro/oscuro mediante variables CSS definidas en `_themes.css`.

## Props API:

| Prop                | Tipo                                                                      | Requerido | Default         | Descripción                                                                                                                                                           |
| :------------------ | :------------------------------------------------------------------------ | :-------- | :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tabsConfig`        | `Array<TabConfig>`                                                        | Sí        | -               | Array de objetos que definen cada pestaña. Ver estructura de `TabConfig` abajo.                                                                                         |
| `activeTabId`       | string                                                                    | Sí        | -               | El `id` de la pestaña actualmente activa. Debe ser manejado por el estado del componente padre.                                                                        |
| `onTabChange`       | `(tabId: string) => void`                                                 | Sí        | -               | Función callback que se ejecuta cuando el usuario selecciona una nueva pestaña (por clic o teclado). El padre debe usar esto para actualizar `activeTabId`.                   |
| `variant`           | `'line' \| 'pills' \| 'boxed'`                                            | No        | `'line'`        | Estilo visual de las pestañas.                                                                                                                                        |
| `ariaLabel`         | string                                                                    | No        | `'Navegación por pestañas'` | Etiqueta ARIA para el `div` con `role="tablist"`. Proporciona un nombre accesible al conjunto de pestañas.                                                              |
| `className`         | string                                                                    | No        | `""`            | Clases CSS adicionales para aplicar al elemento `div` raíz del contenedor de pestañas.                                                                                  |
| `tabListClassName`  | string                                                                    | No        | `""`            | Clases CSS adicionales para aplicar al `div` que envuelve los botones de las pestañas (`.tabs__list`).                                                                  |
| `tabPanelClassName` | string                                                                    | No        | `""`            | Clases CSS adicionales para aplicar a cada `div` de panel de contenido (`.tabs__panel`).                                                                                |
| `...rest`           | -                                                                         | No        | -               | Cualquier otra prop válida para el elemento `div` raíz.                                                                                                                 |

**Estructura del objeto `TabConfig` (dentro de `tabsConfig`):**

| Clave        | Tipo           | Requerido | Descripción                                                                 |
| :----------- | :------------- | :-------- | :-------------------------------------------------------------------------- |
| `id`         | string         | Sí        | Identificador único para la pestaña y su panel.                            |
| `label`      | string         | Sí        | Texto visible en la cabecera de la pestaña.                                |
| `icon`       | `React.ReactNode` | No        | Icono opcional (ej: `<FaUser />`) a mostrar antes de la etiqueta.           |
| `content`    | `React.ReactNode` | Sí        | Contenido JSX del panel asociado a esta pestaña.                           |
| `disabled`   | boolean        | No        | Si es `true`, la pestaña se muestra como deshabilitada y no es interactiva. |

## Uso Básico (Modo Controlado):

        import React, { useState } from 'react';
        import Tabs from './Tabs'; // Ajusta la ruta
        import Parrafo from './Parrafo';
        import { FaUser, FaCog } from 'react-icons/fa';

        function MySettingsPage() {
        const [currentTab, setCurrentTab] = useState('profile'); // ID de la pestaña activa inicial

        const TABS_CONFIGURATION = [
            {
            id: 'profile',
            label: 'Perfil',
            icon: <FaUser />,
            content: <Parrafo>Aquí va el contenido de la sección de Perfil.</Parrafo>,
            },
            {
            id: 'account',
            label: 'Cuenta',
            icon: <FaCog />,
            content: <Parrafo>Ajustes y configuración de la cuenta del usuario.</Parrafo>,
            },
            {
            id: 'privacy',
            label: 'Privacidad',
            disabled: true, // Ejemplo de pestaña deshabilitada
            content: <Parrafo>Configuración de privacidad (actualmente no disponible).</Parrafo>,
            }
        ];

        return (
            <div>
            <h2>Configuración</h2>
            <Tabs
                tabsConfig={TABS_CONFIGURATION}
                activeTabId={currentTab}
                onTabChange={setCurrentTab} // Función para actualizar la pestaña activa
                variant="pills" // Ejemplo de variante
                ariaLabel="Secciones de configuración"
            />
            </div>
        );
        }


## Estilado:

* Los estilos del componente Tabs se definen en src/styles/components/_Tabs.css.
* Utiliza una estructura BEM:
    * Bloque: tabs
    * Modificadores: tabs--variant-[line|pills|boxed]
    * Elementos: tabs__list, tabs__tab (con modificadores --active, --disabled), tabs__tab-icon, tabs__tab-label, tabs__panel.
* Los colores, bordes y otros aspectos visuales se gestionan mediante variables CSS definidas en src/styles/config/_themes.css para permitir la tematización claro/oscuro.
    * Variables de ejemplo: --tabs-tab-active-text-color, --tabs-pills-active-bg, --tabs-sutil-border-radius.

## Accesibilidad y Navegación por Teclado:

El componente Tabs sigue las prácticas de autoría de WAI-ARIA para el patrón de diseño Tabs.

* Roles ARIA:
    * El contenedor de las cabeceras de pestaña (.tabs__list) tiene role="tablist".
    * Cada cabecera de pestaña (.tabs__tab) tiene role="tab".
    * Cada panel de contenido (.tabs__panel) tiene role="tabpanel".
* Atributos ARIA:
    * aria-selected="true" en la pestaña activa.
    * aria-controls en cada pestaña, apuntando al id de su panel correspondiente.
    * aria-labelledby en cada panel, apuntando al id de su pestaña correspondiente.
    * aria-label (configurable mediante la prop ariaLabel) en el tablist para darle un nombre descriptivo.
* Manejo de Foco y tabIndex:
    * La pestaña activa tiene tabIndex="0".
    * Las pestañas inactivas tienen tabIndex="-1".
    * El panel de contenido activo tiene tabIndex="0" para que su contenido sea parte de la secuencia de tabulación.
    * Los paneles inactivos se ocultan usando el atributo hidden.
* Navegación por Teclado (cuando el foco está en una pestaña dentro del tablist):
    * Flecha Derecha: Mueve el foco a la siguiente pestaña (circular).
    * Flecha Izquierda: Mueve el foco a la pestaña anterior (circular).
    * Home: Mueve el foco a la primera pestaña habilitada.
    * End: Mueve el foco a la última pestaña habilitada.
    * Enter o Espacio: Activa la pestaña actualmente enfocada (llama a onTabChange).
    * Tab: Mueve el foco fuera del tablist al siguiente elemento enfocable de la página (que suele ser el panel activo si no hay nada entremedio).
    * Shift + Tab: Mueve el foco al elemento enfocable anterior.
🔝 Volver al índice

# 21. Pagination.jsx

## Objetivo:

Proporcionar controles de navegación estándar y accesibles para dividir grandes conjuntos de datos (mostrados en tablas o listas) en páginas discretas, mejorando el rendimiento y la usabilidad.

## Características Clave:

*   **Navegación Completa:** Incluye botones para "Página Anterior", "Página Siguiente", y opcionalmente "Primera Página" y "Última Página".
*   **Números de Página:** Muestra una lista de números de página clickeables, indicando la página actual.
*   **Rango Inteligente de Páginas:** Muestra un número limitado de botones de página (`maxPageNumbersDisplayed`) alrededor de la página actual, con elipsis (...) para indicar páginas omitidas cuando hay muchas páginas totales.
*   **Control de Estado (Modo Controlado):** La página activa (`currentPage`) y el total de páginas (`totalPages`) son manejados por el componente padre, que recibe notificaciones de cambio a través de `onPageChange`.
*   **Información Opcional:** Puede mostrar texto informativo como "Página X de Y" o "Mostrando ítems A-B de C" (si se proporcionan `totalItems` e `itemsPerPage`).
*   **Deshabilitación Automática:** Los botones de navegación (anterior, siguiente, primera, última) se deshabilitan automáticamente cuando no son aplicables (ej. en la primera o última página).
*   **Accesibilidad:** Utiliza una etiqueta `nav` con `aria-label`, botones con `aria-label` descriptivos, y `aria-current="page"` en el botón de la página activa.
*   **Tematización:** Estilos adaptables a los temas claro/oscuro mediante variables CSS. Iconos personalizables.

## Props API:

| Prop                     | Tipo                         | Requerido | Default         | Descripción                                                                                                                                   |
| :----------------------- | :--------------------------- | :-------- | :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `currentPage`            | number                       | Sí        | -               | El número de la página actual (basado en 1).                                                                                                    |
| `totalPages`             | number                       | Sí        | -               | El número total de páginas disponibles. Si es <= 1, el componente no se renderiza.                                                              |
| `onPageChange`           | `(pageNumber: number) => void` | Sí        | -               | Función callback que se ejecuta cuando el usuario selecciona una nueva página. Recibe el nuevo número de página como argumento.                 |
| `maxPageNumbersDisplayed`  | number                       | No        | `5`             | Número máximo de botones de página numéricos a mostrar a la vez (sin contar controles ni elipsis). Se recomiendan números impares (3, 5, 7). |
| `showFirstLastButtons`   | boolean                      | No        | `true`          | Si `true`, muestra los botones para ir a la primera (`«`) y última (`»`) página.                                                                 |
| `showPageInfo`           | boolean                      | No        | `true`          | Si `true`, muestra información textual sobre la paginación.                                                                                   |
| `totalItems`             | number                       | No        | `null`          | El número total de ítems en todo el conjunto de datos. Usado por `showPageInfo` para mostrar "Mostrando X-Y de Z".                             |
| `itemsPerPage`           | number                       | No        | `null`          | El número de ítems mostrados por página. Usado por `showPageInfo` para mostrar "Mostrando X-Y de Z".                                           |
| `firstPageText`          | node                         | No        | `<FaAngleDoubleLeft />` | Contenido (texto o icono) para el botón "Primera Página".                                                                                  |
| `lastPageText`           | node                         | No        | `<FaAngleDoubleRight />`| Contenido (texto o icono) para el botón "Última Página".                                                                                 |
| `previousPageText`       | node                         | No        | `<FaAngleLeft />` | Contenido (texto o icono) para el botón "Página Anterior".                                                                               |
| `nextPageText`           | node                         | No        | `<FaAngleRight />` | Contenido (texto o icono) para el botón "Página Siguiente".                                                                              |
| `className`              | string                       | No        | `""`            | Clases CSS adicionales para el contenedor `nav` principal.                                                                                    |
| `...rest`                | -                            | No        | -               | Otras props para el elemento `nav` raíz.                                                                                                      |

## Uso Básico (Integrado con Estado del Padre):

        import React, { useState, useMemo } from 'react';
        import Pagination from './Pagination'; // Ajusta ruta
        // import DataTable from './DataTable'; // Asumiendo una tabla

        function PaginatedList() {
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 10; // O definido en otro estado

        // Asume que 'allItems' es tu array completo de datos (ej: de una API)
        const allItems = useMemo(() => Array.from({ length: 105 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` })), []); // 105 items de ejemplo

        const totalItems = allItems.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Calcular los items para la página actual
        const currentItems = useMemo(() => {
            const firstItemIndex = (currentPage - 1) * itemsPerPage;
            const lastItemIndex = firstItemIndex + itemsPerPage;
            return allItems.slice(firstItemIndex, lastItemIndex);
        }, [allItems, currentPage, itemsPerPage]);

        const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
            // Opcional: Hacer scroll al inicio de la tabla/lista
            // window.scrollTo(0, 0);
        };

        return (
            <div>
            {/* Aquí renderizarías tu tabla o lista con 'currentItems' */}
            {/* <DataTable data={currentItems} columns={...} /> */}
            <ul>
                {currentItems.map(item => <li key={item.id}>{item.name}</li>)}
            </ul>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems} // Opcional para info
                itemsPerPage={itemsPerPage} // Opcional para info
                // maxPageNumbersDisplayed={7} // Ejemplo
                // showFirstLastButtons={false} // Ejemplo
            />
            </div>
        );
        }

## Estilado:

* Los estilos se definen en src/styles/components/_Pagination.css.

* Utiliza una estructura BEM:
    * Bloque: pagination
    * Elementos: pagination__info, pagination__list, pagination__item (con modificadores --control, --number, --ellipsis, --active, --disabled), pagination__link.
* Los estilos se inspiran en FormButton para consistencia, pero son específicos para ser compactos y funcionales para paginación.
* Los colores y radios de borde usan variables CSS de _themes.css para tematización.

## Accesibilidad:

* El componente raíz es un nav con un aria-label descriptivo.
* Lo botones de control tienen aria-label específicos ("Ir a página anterior", etc.).
* Los botones numéricos tienen aria-label="Ir a página X".
* El botón de la página actual tiene aria-current="page".
* Los botones se deshabilitan (disabled) cuando la acción no es posible.
* Los puntos suspensivos (...) son span no interactivos con aria-hidden="true".
🔝 Volver al índice

# 22. FormDatePicker.jsx

## Objetivo:
Proporcionar un componente wrapper para la selección de fechas, utilizando `react-day-picker` internamente para una experiencia de calendario robusta y accesible. Se integra con `FormInput` para mostrar la fecha y disparar el calendario emergente, y aplica estilos consistentes con el tema de la aplicación.

## Características Clave:

*   **Basado en `react-day-picker`:** Aprovecha la funcionalidad completa y accesibilidad de `react-day-picker` (v8).
*   **Input Integrado:** Utiliza el componente `FormInput` existente para mostrar la fecha formateada y permitir al usuario abrir el calendario.
*   **Calendario Emergente (Popover):** Muestra el `DayPicker` en un popover posicionado debajo del input al hacer clic o enfocar.
*   **Selección de Fecha:** Permite la selección de un solo día (`mode="single"`).
*   **Navegación Rápida:** Incluye navegación por botones de mes anterior/siguiente y desplegables para seleccionar mes y año directamente (`captionLayout="dropdown-buttons"` o `"dropdown"`).
*   **Formato y Parseo:** Utiliza `date-fns` para formatear la fecha mostrada en el input y para parsear la entrada manual (si no es `readOnly`).
*   **Estado Controlado:** La fecha seleccionada (`selectedDate`) es controlada por el componente padre a través de `onDateChange`.
*   **Internacionalización (i18n):** Soporta diferentes locales a través de la prop `locale` (usando objetos de `date-fns/locale`).
*   **Validación:** Soporta `minDate`, `maxDate`, `disabled`, y `required` (visualmente). Valida la entrada manual (si está habilitada).
*   **Cierre Inteligente:** El popover se cierra al seleccionar una fecha o al hacer clic fuera del componente.
*   **Estilo Personalizado:** Los estilos del calendario se personalizan mediante CSS (`_DatePicker.css`) para coincidir con los temas claro/oscuro, utilizando variables CSS. La lista desplegable de mes/año mantiene la apariencia nativa del navegador.

## Dependencias:

*   `react-day-picker`: "^8.x.x" (o la versión instalada)
*   `date-fns`: "^2.x.x" o "^3.x.x" (o la versión instalada)

## Props API:

| Prop                 | Tipo                        | Requerido | Default               | Descripción                                                                                                                               |
| :------------------- | :-------------------------- | :-------- | :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `label`              | string                      | No        | `null`                | Etiqueta visible para el campo (pasada a `FormInput`).                                                                                      |
| `name`               | string                      | Sí        | -                     | Atributo `name` para el input (pasado a `FormInput`).                                                                                       |
| `selectedDate`       | Date \| null                | Sí        | -                     | El objeto `Date` actualmente seleccionado. Controlado por el padre.                                                                         |
| `onDateChange`       | `(date: Date \| null) => void` | Sí       | -                     | Callback llamado cuando se selecciona/cambia una fecha válida. Recibe `Date` o `null`.                                                       |
| `placeholder`        | string                      | No        | `'dd-MM-yyyy'`        | Placeholder para el `FormInput`.                                                                                                            |
| `dateFormat`         | string                      | No        | `'dd-MM-yyyy'`        | Formato de `date-fns` para mostrar/parsear la fecha en el input.                                                                            |
| `error`              | string \| null              | No        | `null`                | Mensaje de error a mostrar (pasado a `FormInput`).                                                                                          |
| `disabled`           | boolean                     | No        | `false`               | Deshabilita el input y el calendario.                                                                                                       |
| `required`           | boolean                     | No        | `false`               | Marca el campo como requerido visualmente (pasado a `FormInput`).                                                                           |
| `readOnly`           | boolean                     | No        | `false`               | Si `true`, el usuario no puede escribir en el input, solo seleccionar del calendario (el calendario aún se abre al hacer clic).              |
| `containerClassName` | string                      | No        | `""`                  | Clases CSS para el `div.form-group` contenedor (pasado a `FormInput`).                                                                      |
| `inputClassName`     | string                      | No        | `""`                  | Clases CSS para el elemento `input` (pasado a `FormInput`).                                                                                 |
| `inputId`            | string                      | No        | (auto-generado)       | ID explícito para el input.                                                                                                                 |
| `locale`             | Locale (`date-fns`)         | No        | `es`                  | Objeto de locale de `date-fns` (ej: `import { es } from 'date-fns/locale'`).                                                                 |
| `minDate`            | Date                        | No        | `null`                | Fecha mínima seleccionable en el calendario.                                                                                                |
| `maxDate`            | Date                        | No        | `null`                | Fecha máxima seleccionable en el calendario.                                                                                                |
| `...inputProps`      | -                           | No        | -                     | Props adicionales pasadas al componente `FormInput` interno (`aria-*`, etc.).                                                               |

## Uso Básico:

        import React, { useState } from 'react';
        import FormDatePicker from './FormDatePicker';
        import { es } from 'date-fns/locale'; // Importar locale si no es inglés

        function MyFormComponent() {
        const [startDate, setStartDate] = useState(null);
        const [endDate, setEndDate] = useState(new Date()); // Fecha inicial

        return (
            <form>
            <FormDatePicker
                label="Fecha de Inicio"
                name="startDate"
                selectedDate={startDate}
                onDateChange={setStartDate} // Simplemente pasar el setter del estado
                placeholder="Selecciona inicio..."
                dateFormat="dd/MM/yyyy" // Formato diferente
                locale={es}
                maxDate={endDate || undefined} // No se puede iniciar después de finalizar
                required
            />
            <FormDatePicker
                label="Fecha de Fin"
                name="endDate"
                selectedDate={endDate}
                onDateChange={setEndDate}
                dateFormat="dd/MM/yyyy"
                locale={es}
                minDate={startDate || undefined} // No se puede finalizar antes de iniciar
            />
            </form>
        );
        }

## Estilado:

Importa los estilos base de react-day-picker: import 'react-day-picker/dist/style.css'; dentro del componente.
Los estilos personalizados que sobrescriben a la librería y estilizan el popover se definen en src/styles/components/_DatePicker.css.
Este archivo utiliza las variables CSS definidas en src/styles/config/_themes.css (con el prefijo --dp-) para aplicar los colores y estilos del tema al calendario.
Se usan las clases CSS proporcionadas por DayPicker (ej: .rdp-day_selected, .rdp-nav_button, .rdp-dropdown_month select) como selectores para aplicar los estilos personalizados.
La lista desplegable de opciones para mes/año conserva la apariencia nativa del navegador.

## Accesibilidad:

Hereda las características de accesibilidad de react-day-picker, que sigue las guías WAI-ARIA para grids de fechas y navegación por teclado dentro del calendario.
Se integra con FormInput, que ya incluye asociación de label e id.
Se debe asegurar que cualquier mensaje de error prop pasado sea asociado correctamente al input mediante aria-describedby (esto debería manejarlo FormInput si se le pasa error y un id).
🔝 Volver al índice


# 23. Breadcrumbs.jsx

## Objetivo:
Mostrar una ruta de navegación jerárquica ("migas de pan") en una sola línea horizontal, indicando la ubicación actual del usuario y permitiendo navegar a niveles superiores. Maneja el desbordamiento de texto y permite scroll horizontal si la ruta completa excede el ancho disponible.

## Características Clave:

*   **Navegación Jerárquica:** Renderiza una lista ordenada (`ol`) de enlaces y texto que representan los niveles de la ruta seguida por el usuario.
*   **Presentación en Línea:** Los ítems se muestran en una sola línea horizontal.
*   **Scroll Horizontal:** Si la ruta completa es más ancha que el contenedor, se habilita una barra de scroll horizontal discreta.
*   **Manejo de Desbordamiento:** Las etiquetas de los ítems individuales que excedan un ancho máximo se cortarán con puntos suspensivos (`...`).
*   **Separadores Configurables:** Muestra separadores visuales (por defecto `/`, pero puede ser `>` o un icono JSX) entre los elementos de la ruta.
*   **Elemento Actual:** El último elemento de la lista (o el marcado con `isCurrent: true`) representa la página actual y no es un enlace clickeable.
*   **Configuración Flexible:** Recibe la estructura de la ruta como un array de objetos (`items`), permitiendo definir etiqueta, enlace (href) e icono opcional para cada nivel.
*   **Accesibilidad:** Utiliza un elemento `nav` con `aria-label="breadcrumb"`, una lista ordenada (`ol`), y `aria-current="page"` en el último elemento para una correcta semántica y navegación asistida.
*   **Tematización:** Los colores de enlaces, texto actual y separadores usan variables CSS (`_themes.css`) para adaptarse a los temas claro/oscuro.
*   **Iconos Opcionales:** Permite incluir iconos junto a las etiquetas de cada nivel.

## Props API:

| Prop               | Tipo                             | Requerido | Default         | Descripción                                                                                                                                 |
| :----------------- | :------------------------------- | :-------- | :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `items`            | `Array<BreadcrumbItem>`          | Sí        | `[]`            | Array de objetos que definen cada nivel de la ruta. Ver estructura abajo.                                                                     |
| `separator`        | node                             | No        | `/`             | El separador visual a mostrar entre los ítems. Puede ser un string o un icono JSX (ej: `<FaAngleRight size="0.8em" />`).                     |
| `className`        | string                           | No        | `""`            | Clases CSS adicionales para el elemento `nav` contenedor.                                                                                     |
| `listClassName`    | string                           | No        | `""`            | Clases CSS adicionales para el elemento `ol` (lista ordenada) que contiene los ítems.                                                          |
| `itemClassName`    | string                           | No        | `""`            | Clases CSS adicionales para cada elemento `li` de la lista (puede tener uso limitado con la estructura actual).                             |
| `linkClassName`    | string                           | No        | `""`            | Clases CSS adicionales para los elementos `a` (enlaces) dentro de los ítems (excepto el actual).                                              |
| `currentClassName` | string                           | No        | `""`            | Clases CSS adicionales para el `span` del último ítem (la página actual).                                                                      |
| `...rest`          | -                                | No        | -               | Otras props para el elemento `nav` raíz (`id`, etc.).                                                                                           |

**Estructura del objeto `BreadcrumbItem` (dentro de `items`):**

| Clave     | Tipo              | Requerido | Descripción                                                                                        |
| :-------- | :---------------- | :-------- | :------------------------------------------------------------------------------------------------- |
| `label`   | string            | Sí        | Texto visible para este nivel de la ruta.                                                        |
| `href`    | string            | No        | La URL a la que enlaza este nivel. Si se omite, se renderiza como texto simple o como el ítem actual. |
| `icon`    | `React.ReactNode` | No        | Icono opcional (ej: `<FaHome />`) a mostrar antes de la etiqueta.                                    |
| `isCurrent`| boolean          | No        | Si `true`, fuerza a este ítem a ser tratado como el actual (no clickeable), incluso si no es el último. |

## Uso Básico:


        import React from 'react';
        import Breadcrumbs from './Breadcrumbs'; // Ajusta ruta
        import { FaHome, FaUsers, FaUserEdit, FaAngleRight } from 'react-icons/fa';
        // Opcional: si usas React Router
        // import { Link as RouterLink } from 'react-router-dom';

        function UserEditPageBreadcrumbs() {
        const breadcrumbItems = [
            { label: 'Inicio', href: '/', icon: <FaHome /> },
            { label: 'Administración de Usuarios', href: '/admin/usuarios', icon: <FaUsers /> },
            { label: 'Editar Perfil de Usuario Ejemplo Nombre Largo', icon: <FaUserEdit /> }, // Último item sin href es el actual
        ];

        return (
            <Breadcrumbs
            items={breadcrumbItems}
            separator={<FaAngleRight size="0.8em" />} // Usar icono como separador
            />
        );
        }

Nota: Si usas React Router, reemplaza <a> por <RouterLink> dentro del componente Breadcrumbs.jsx para navegación SPA.

## Estilado:

* Los estilos se definen en src/styles/components/_Breadcrumbs.css.
* Utiliza una estructura BEM:
    * Bloque: breadcrumbs
    * Elementos: breadcrumbs__list, breadcrumbs__item, breadcrumbs__link, breadcrumbs__current, breadcrumbs__icon, breadcrumbs__label, breadcrumbs__separator.
* El layout principal es display: flex en breadcrumbs__list con flex-wrap: nowrap para mantener una sola línea.
* El contenedor nav.breadcrumbs tiene overflow-x: auto para manejar el desbordamiento horizontal.
* Los enlaces (breadcrumbs__link) y el ítem actual (breadcrumbs__current) tienen white-space: nowrap, overflow: hidden, text-overflow: ellipsis y max-width para truncar texto largo.
* Los colores y fuentes usan variables CSS de _themes.css (ej: --breadcrumbs-link-color, --breadcrumbs-current-color, --breadcrumbs-separator-color).

## Accesibilidad:

* Utiliza un elemento <nav> con aria-label="breadcrumb" para identificar la región de navegación.
* La lista se implementa con <ol> (lista ordenada) y <li>, que es semánticamente correcto para una secuencia.
* El último elemento (o el marcado con isCurrent) usa aria-current="page" para indicar la página actual a tecnologías asistivas.
* Los separadores visuales se envuelven en <li> con aria-hidden="true" para que no sean leídos como parte del contenido por lectores de pantalla.
🔝 Volver al índice

# 24. Tooltip.jsx

## Objetivo:
Mostrar un pequeño cuadro de texto informativo (tooltip) de forma no intrusiva cuando el usuario interactúa (hover o focus) con un elemento específico, proporcionando ayuda contextual o información adicional.

## Características Clave:

*   **Activación por Interacción:** Aparece al pasar el cursor (`onMouseEnter`) o enfocar (`onFocus`) el elemento hijo. Desaparece al quitar el cursor (`onMouseLeave`) o perder el foco (`onBlur`).
*   **Componente Wrapper:** Se utiliza envolviendo el elemento que debe disparar el tooltip (pasado como `children`). `Tooltip` clona este hijo para añadirle los listeners y atributos ARIA necesarios.
*   **Contenido Flexible:** Acepta texto simple o nodos React más complejos como contenido del tooltip a través de la prop `content`.
*   **Posicionamiento Configurable:** Permite definir la posición preferida del tooltip (`top`, `bottom`, `left`, `right`) relativa al elemento hijo.
*   **Retraso Opcional:** Configurable `showDelay` y `hideDelay` para controlar cuándo aparece y desaparece el tooltip, evitando parpadeos.
*   **Flecha Indicadora:** Muestra una pequeña flecha CSS apuntando desde el tooltip hacia el elemento hijo.
*   **Accesibilidad:** Asocia el tooltip con su elemento disparador usando `aria-describedby` cuando está visible. El tooltip en sí tiene `role="tooltip"`.
*   **Deshabilitación:** Se puede deshabilitar completamente mediante la prop `disabled`.
*   **Tematización:** Apariencia (fondo, color de texto) controlada por variables CSS en `_themes.css`.

## Props API:

| Prop               | Tipo                                       | Requerido | Default     | Descripción                                                                                                                                 |
| :----------------- | :----------------------------------------- | :-------- | :---------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `children`         | node                                       | Sí        | -           | **Un único elemento React** (botón, icono, input, span, etc.) que activará el tooltip al interactuar con él.                                    |
| `content`          | node                                       | Sí        | -           | El contenido a mostrar dentro del tooltip (texto, JSX). Si es `null` o `undefined`, el tooltip no se mostrará.                                  |
| `position`         | `'top' \| 'bottom' \| 'left' \| 'right'`   | No        | `'top'`     | La posición preferida del tooltip relativa al `children`.                                                                                     |
| `showDelay`        | number                                     | No        | `150`       | Retraso en milisegundos antes de mostrar el tooltip después de hover/focus. `0` para mostrar inmediatamente.                                   |
| `hideDelay`        | number                                     | No        | `100`       | Retraso en milisegundos antes de ocultar el tooltip después de mouseleave/blur. `0` para ocultar inmediatamente.                              |
| `className`        | string                                     | No        | `""`        | Clases CSS adicionales para el `div.tooltip-wrapper` que contiene al `children` y al tooltip.                                                  |
| `tooltipClassName` | string                                     | No        | `""`        | Clases CSS adicionales específicamente para el `div.tooltip` emergente.                                                                       |
| `disabled`         | boolean                                    | No        | `false`     | Si `true`, deshabilita completamente la funcionalidad del tooltip (no se mostrará).                                                            |
| `...rest`          | -                                          | No        | -           | Props adicionales que se pasarán al `div.tooltip-wrapper` (ej: `style`, `id`).                                                              |

## Uso Básico:

        import React from 'react';
        import Tooltip from './Tooltip'; // Ajusta ruta
        import FormButton from './FormButton';
        import { FaInfoCircle, FaTrashAlt } from 'react-icons/fa';

        function TooltipExamples() {
        return (
            <div style={{ padding: '50px', display: 'flex', gap: '20px' }}>
            {/* Tooltip en un botón con icono */}
            <Tooltip content="Eliminar permanentemente">
                <FormButton icon={<FaTrashAlt />} variant="danger" aria-label="Eliminar" />
            </Tooltip>

            {/* Tooltip en un texto simple, posición 'bottom' */}
            <Tooltip content="Esta es información adicional importante." position="bottom">
                <span style={{ borderBottom: '1px dashed blue', cursor: 'help' }}>
                Leer más
                </span>
            </Tooltip>

            {/* Tooltip con más delay */}
            <Tooltip content="Aparezco después de 500ms" showDelay={500} position="right">
                <FormButton icon={<FaInfoCircle />} aria-label="Información" />
            </Tooltip>

            {/* Tooltip desactivado */}
            <Tooltip content="No deberías ver esto" disabled>
                <FormButton label="Desactivado" disabled />
            </Tooltip>
            </div>
        );
        }

## Estilado:

Los estilos se definen en src/styles/components/_Tooltip.css.
Utiliza una estructura BEM:
Wrapper: tooltip-wrapper (creado por el componente).
Bloque: tooltip (el popover).
Modificadores: tooltip--position-[top|bottom|left|right].
Elementos: tooltip__content, tooltip__arrow.
La apariencia (fondo, color, padding, borde, sombra, tamaño de flecha) se controla mediante variables CSS (--tooltip-*) definidas en src/styles/config/_themes.css.
El posicionamiento se maneja con position: absolute y ajustes de top/left/bottom/right/transform.
Incluye una transición suave de opacity y transform para la aparición/desaparición.

## Accesibilidad:

Cuando el tooltip está visible, el elemento disparador (children) recibe el atributo aria-describedby que apunta al id único del tooltip. Esto asocia semánticamente la descripción del tooltip con el elemento.
El tooltip en sí tiene role="tooltip".
La flecha visual (tooltip__arrow) tiene aria-hidden="true".
El tooltip se activa tanto con el ratón (hover) como con el teclado (focus), asegurando que los usuarios de teclado también puedan acceder a la información.
🔝 Volver al índice

# 25. DropdownMenu.jsx 

## Objetivo:

Proporcionar un menú contextual emergente (popover) que aparece al interactuar con un elemento disparador (trigger). Se utiliza comúnmente para agrupar acciones relacionadas (ej: "Editar", "Eliminar") o opciones de navegación secundarias, ahorrando espacio en la interfaz. Utiliza `@floating-ui/react` para un posicionamiento robusto y manejo de interacciones.

## Características Clave:

*   **Basado en `@floating-ui/react`:** Aprovecha esta librería para un posicionamiento inteligente y adaptable del menú (considerando bordes de pantalla, scroll, etc.) y para manejar las interacciones de apertura/cierre y accesibilidad.
*   **Disparador Personalizable:** Acepta cualquier nodo React como `trigger` (ej: un `FormButton` con icono de tres puntos, un enlace, etc.). El componente clona este trigger para añadirle las props de control necesarias.
*   **Contenido del Menú Configurable:** Los ítems del menú se definen mediante un array de objetos (`items`), permitiendo especificar etiqueta, icono, acción `onClick`, estado deshabilitado, separadores y clases personalizadas.
*   **Posicionamiento Flexible:** La posición del menú relativa al trigger se puede configurar mediante la prop `placement` (ej: `'bottom-start'`, `'top-end'`).
*   **Cierre Inteligente:**
    *   Se cierra al hacer clic en un ítem del menú (configurable con `closeOnSelect`).
    *   Se cierra al hacer clic fuera del menú o del trigger.
    *   Se cierra al presionar la tecla `Escape`.
*   **Manejo de Foco:** Utiliza `FloatingFocusManager` para atrapar el foco dentro del menú cuando está abierto, permitiendo una navegación por teclado completa.
*   **Portal Rendering:** Usa `FloatingPortal` para renderizar el menú en el `document.body`, evitando problemas de `z-index` y `overflow` de contenedores padres.
*   **Accesibilidad:** Implementa roles ARIA (`menu`, `menuitem`, `separator`) y maneja la navegación por teclado (flechas arriba/abajo, Enter/Espacio para seleccionar, Esc para cerrar) según las pautas de WAI-ARIA.
*   **Tematización:** Los estilos del menú y sus ítems se controlan mediante variables CSS (`_themes.css`) y un archivo CSS dedicado (`_DropdownMenu.css`).

## Dependencias:
*   `@floating-ui/react`: "^0.26.x" (o la versión instalada)

## Props API:

| Prop               | Tipo                               | Requerido | Default        | Descripción                                                                                                                                                              |
| :----------------- | :--------------------------------- | :-------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger`          | node                               | Sí        | -              | El elemento React (ej: `<button>`, `<FormButton>`) que abrirá el menú al hacer clic. Debe ser un único elemento React válido.                                                |
| `items`            | `Array<MenuItem \| 'separator'>`   | Sí        | `[]`           | Array de objetos `MenuItem` o la string `'separator'` para definir el contenido del menú. Ver estructura de `MenuItem` abajo.                                                |
| `placement`        | Placement (string de Floating UI)  | No        | `'bottom-start'` | Posición preferida del menú relativa al trigger (ej: `'bottom-end'`, `'top-start'`). Consulta [Floating UI Placements](https://floating-ui.com/docs/computePosition#placement). |
| `menuClassName`    | string                             | No        | `""`           | Clases CSS adicionales para el `div` contenedor del menú emergente (`.dropdown-menu`).                                                                                   |
| `itemClassName`    | string                             | No        | `""`           | Clases CSS de base para aplicar a cada ítem (`button`) dentro del menú.                                                                                                   |
| `wrapperClassName` | string                             | No        | `""`           | Clases CSS adicionales para el `div` que envuelve al `trigger` (útil si se necesita un contenedor para el trigger).                                                       |
| `closeOnSelect`    | boolean                            | No        | `true`         | Si `true`, el menú se cierra automáticamente después de hacer clic en un ítem con una acción `onClick`.                                                                 |

**Estructura del objeto `MenuItem` (dentro de `items`):**

| Clave     | Tipo              | Requerido | Descripción                                                                               |
| :-------- | :---------------- | :-------- | :---------------------------------------------------------------------------------------- |
| `label`   | string            | Sí        | Texto visible del ítem del menú.                                                          |
| `icon`    | `React.ReactNode` | No        | Icono opcional (ej: `<FaSave />`) a mostrar antes de la etiqueta.                           |
| `onClick` | `() => void`      | No        | Función a ejecutar al hacer clic. Si no se provee, el ítem se renderiza pero no es interactivo (puede usarse para texto informativo si se quisiera). |
| `disabled`| boolean           | No        | Si `true`, el ítem se muestra como deshabilitado y no es interactivo.                     |
| `className`| string           | No        | Clases CSS adicionales específicas para este ítem individual (ej: `dropdown-item--danger`). |

## Uso Básico:

        import React from 'react';
        import DropdownMenu from './DropdownMenu'; // Ajusta ruta
        import FormButton from './FormButton';
        import { FaEllipsisV, FaEdit, FaTrashAlt, FaChartBar } from 'react-icons/fa';

        function ActionsMenuExample({ onEdit, onDelete, onShowStats }) {
        const menuItems = [
            { label: 'Editar', icon: <FaEdit />, onClick: onEdit },
            { label: 'Ver Estadísticas', icon: <FaChartBar />, onClick: onShowStats },
            'separator', // Añade un separador visual
            { label: 'Eliminar', icon: <FaTrashAlt />, onClick: onDelete, className: 'dropdown-item--danger' }
        ];

        const triggerButton = (
            <FormButton
            icon={<FaEllipsisV />}
            size="small"
            variant="subtle"
            aria-label="Más acciones"
            />
        );

        return (
            <DropdownMenu
            trigger={triggerButton}
            items={menuItems}
            placement="bottom-end" // Ejemplo de posicionamiento
            />
        );
        }

## Estilado:

* Los estilos se definen en src/styles/components/_DropdownMenu.css.
* Utiliza una estructura BEM:
    * Contenedor del trigger: dropdown-wrapper (opcional, si se usa wrapperClassName).
    * Bloque del menú: dropdown-menu.
    * Elementos: dropdown-menu__item (con modificadores para estados como [disabled]), dropdown-menu__item-icon, dropdown-menu__item-label, dropdown-menu__separator.
* La apariencia (fondo, color, padding, borde, sombra) se controla mediante variables CSS (--dropdown-*) definidas en src/styles/config/_themes.css para adaptarse a los temas.

## Accesibilidad:

* __Roles ARIA:__ 
    * El menú (div.dropdown-menu) tiene role="menu".
    * Cada ítem clickeable (button.dropdown-menu__item) tiene role="menuitem".
    * Los separadores (hr.dropdown-menu__separator) tienen role="separator".
* __Manejo de Foco:__ FloatingFocusManager gestiona el foco: 
    * Al abrir, el foco se mueve al primer ítem del menú.
    * Se puede navegar por los ítems con las teclas de flecha arriba/abajo.
    * Se puede seleccionar un ítem con Enter o Espacio.
    * Escape cierra el menú y devuelve el foco al trigger.
    * Al cerrar (clic fuera, Esc, o selección de ítem), el foco vuelve al elemento trigger.
* El elemento trigger puede (y debe) tener su propio aria-label si es un botón solo con icono.
🔝 Volver al índice

# 26. AutoComplete.jsx

## Objetivo:

Proporcionar un campo de entrada de texto enriquecido que ofrece al usuario sugerencias dinámicas a medida que escribe. Permite una selección rápida y precisa de una lista de opciones, que pueden ser locales o cargadas de forma asíncrona desde un servidor. Utiliza `@floating-ui/react` para un posicionamiento robusto de la lista de sugerencias y `use-debounce` para optimizar las búsquedas.

## Características Clave:

*   **Basado en `FormInput`:** Utiliza el componente `FormInput` como base para la entrada de texto.
*   **Lista de Sugerencias Emergente:** Muestra una lista de opciones relevantes en un popover posicionado inteligentemente debajo del input (manejado por `@floating-ui/react`).
*   **Modos de Datos:**
    *   **Local:** Filtra un array de `options` proporcionado localmente.
    *   **Remoto:** Llama a una función asíncrona `fetchSuggestions` para obtener sugerencias de un backend.
*   **Debouncing:** Retrasa la ejecución del filtro/fetch (`debounceDelay`) para evitar operaciones excesivas mientras el usuario escribe.
*   **Selección:** Permite seleccionar sugerencias con el ratón o el teclado (Enter/Espacio en la opción activa).
*   **Navegación por Teclado:** Soporte completo para navegar por la lista de sugerencias (flechas arriba/abajo, Home, End), cerrar con Escape.
*   **Control de Valor:** El texto del input (`value`) y la opción seleccionada (`selectedOption`) son controlados por el componente padre a través de callbacks (`onValueChange`, `onSelect`).
*   **Personalización:**
    *   `optionToString`: Define cómo un objeto de opción se convierte en string para el input.
    *   `filterOption`: Permite personalizar la lógica de filtrado local.
    *   `renderOption`: Permite personalizar el renderizado de cada ítem en la lista de sugerencias.
*   **Mensajes de Estado:** Muestra mensajes configurables para "No hay sugerencias" y "Cargando...".
*   **Accesibilidad:** Implementa roles ARIA (`combobox`, `listbox`, `option`) y atributos (`aria-autocomplete`, `aria-expanded`, `aria-controls`, `aria-activedescendant`) para una experiencia accesible.
*   **Portal Rendering:** La lista de sugerencias se renderiza en el `<body>` usando `FloatingPortal` para evitar problemas de z-index y overflow.
*   **Tematización:** Estilos adaptables a temas claro/oscuro mediante variables CSS.

## Dependencias:
*   `@floating-ui/react`: "^0.26.x" (o la versión instalada)
*   `use-debounce`: "^9.x.x" o "^10.x.x" (o la versión instalada)
*   `date-fns` (si se usa `FormDatePicker` en conjunto, no es una dependencia directa de `AutoComplete` en sí mismo, pero `FormInput` podría serlo si tuviera `locale` para formato numérico, etc.).

## Props API:

| Prop                      | Tipo                                       | Requerido | Default          | Descripción                                                                                                                                                                                                                                            |
| :------------------------ | :----------------------------------------- | :-------- | :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`                   | `string`                                   | Sí        | -                | El texto actual en el campo de entrada. Controlado por el padre.                                                                                                                                                                                         |
| `onValueChange`           | `(newValue: string) => void`               | Sí        | -                | Callback cuando el texto del input cambia (por escritura del usuario).                                                                                                                                                                               |
| `onSelect`                | `(selectedValue: OptionType \| null) => void` | Sí       | -                | Callback cuando una sugerencia es seleccionada o cuando el campo se limpia (ej. si el texto ya no coincide con `selectedOption`). Recibe el objeto completo de la opción seleccionada o `null`.                                                               |
| `selectedOption`          | `OptionType \| null`                       | No        | `null`           | El objeto de la opción actualmente seleccionada (si la hay). No controla directamente el texto del input, pero puede usarse para deseleccionar si `value` cambia.                                                                                          |
| `options`                 | `Array<OptionType>`                        | No        | `[]`             | **(Para datos locales)** Array completo de objetos de opción. Si se proporciona y `fetchSuggestions` no, el filtrado se hace localmente.                                                                                                                |
| `fetchSuggestions`        | `(query: string) => Promise<Array<OptionType>>` | No   | `null`           | **(Para datos remotos)** Función asíncrona que recibe el texto de búsqueda (debounced) y retorna una Promesa que resuelve a un array de objetos de opción.                                                                                              |
| `optionToString`          | `(option: OptionType \| null) => string`   | No        | `opt => opt?.label`| Función para obtener el string a mostrar en el input *después* de seleccionar una opción y para el filtrado/búsqueda por defecto.                                                                                                                       |
| `filterOption`            | `(option: OptionType, inputValue: string) => boolean` | No | (ver código)    | **(Para datos locales)** Función para filtrar las `options`. Por defecto, un filtro insensible a mayúsculas que busca en el resultado de `optionToString(option)`.                                                                                       |
| `renderOption`            | `(option: OptionType, inputValue: string) => React.ReactNode` | No | (label simple) | Función para personalizar el renderizado de cada sugerencia en la lista. Por defecto, muestra `optionToString(option)`.                                                                                                                                |
| `label`                   | string                                     | No        | `null`           | Etiqueta para el campo de entrada.                                                                                                                                                                                                                     |
| `name`                    | string                                     | No        | (auto-generado)  | Atributo `name` para el input.                                                                                                                                                                                                                       |
| `placeholder`             | string                                     | No        | `"Buscar..."`    | Placeholder para el input.                                                                                                                                                                                                                           |
| `debounceDelay`           | number                                     | No        | `300`            | Milisegundos para el debounce antes de llamar a `fetchSuggestions` o filtrar localmente.                                                                                                                                                                 |
| `noSuggestionsMessage`    | node                                       | No        | `"No hay sugerencias"` | Mensaje o JSX a mostrar cuando no hay sugerencias después de una búsqueda.                                                                                                                                                                             |
| `loadingMessage`          | node                                       | No        | `"Cargando..."`  | Mensaje o JSX a mostrar mientras `fetchSuggestions` está en curso.                                                                                                                                                                                   |
| `minCharsToSearch`        | number                                     | No        | `1`              | Número mínimo de caracteres en el input antes de empezar a buscar/filtrar sugerencias y abrir la lista.                                                                                                                                                 |
| `disabled`                | boolean                                    | No        | `false`          | Deshabilita el componente.                                                                                                                                                                                                                           |
| `error`                   | string \| null                             | No        | `null`           | Mensaje de error a mostrar debajo del input.                                                                                                                                                                                                           |
| `required`                | boolean                                    | No        | `false`          | Marca el campo como requerido visualmente.                                                                                                                                                                                                               |
| `listboxClassName`        | string                                     | No        | `""`             | Clases CSS adicionales para el `div.autocomplete__listbox` (el popover de sugerencias).                                                                                                                                                                |
| `optionClassName`         | string                                     | No        | `""`             | Clases CSS de base para aplicar a cada `div.autocomplete__option`.                                                                                                                                                                                   |
| `activeOptionClassName`   | string                                     | No        | `'autocomplete__option--active'` | Clases CSS para la sugerencia actualmente resaltada/activa por navegación de teclado.                                                                                                                                                               |
| `inputContainerClassName` | string                                     | No        | `""`             | Clases para el `div.form-group` que envuelve el `FormInput` (pasado a `FormInput`).                                                                                                                                                                     |
| `inputClassName`          | string                                     | No        | `""`             | Clases para el `input` mismo (pasado a `FormInput`).                                                                                                                                                                                                   |
| `wrapperClassName`        | string                                     | No        | `""`             | Clases para el `div.autocomplete-wrapper` principal que envuelve input y lista.                                                                                                                                                                      |
| `...inputProps`           | -                                          | No        | -                | Props adicionales para pasar al componente `FormInput` subyacente (ej. `id`, `aria-label` si no hay `label` visible).                                                                                                                                 |

**Estructura Esperada para `OptionType` (Ejemplo):**

        interface OptionType {
        id: string | number; // Un identificador único para la key en el map y para onSelect
        label: string;       // El texto principal a mostrar y buscar por defecto
        // ...puedes añadir cualquier otra propiedad que necesites para renderizar o usar después de la selección
        // email?: string;
        // role?: string;
        }

# Uso Básico (Filtrado Local):

        import React, { useState } from 'react';
        import AutoComplete from './AutoComplete';

        const usuarios = [
        { id: '1', label: 'Alice Wonderland' },
        { id: '2', label: 'Bob The Builder' },
        { id: '3', label: 'Charlie Chaplin' },
        ];

        function UserSelector() {
        const [inputValue, setInputValue] = useState('');
        const [selectedUser, setSelectedUser] = useState(null);

        const handleUserSelect = (user) => {
            setSelectedUser(user);
            // Opcional: Limpiar el input después de seleccionar
            // if (user) setInputValue('');
        };

        return (
            <div>
            <AutoComplete
                label="Seleccionar Usuario"
                value={inputValue}
                onValueChange={setInputValue}
                onSelect={handleUserSelect}
                selectedOption={selectedUser}
                options={usuarios} // Pasa el array de datos locales
                placeholder="Buscar por nombre..."
            />
            {selectedUser && <p>Seleccionado: {selectedUser.label} (ID: {selectedUser.id})</p>}
            </div>
        );
        }

## Estilado:

* Los estilos se definen en src/styles/components/_AutoComplete.css.
* Utiliza una estructura BEM:
    * Wrapper: autocomplete-wrapper
    * Lista: autocomplete__listbox
    * Opción: autocomplete__option (con modificador --active)
    * Highlight (para texto coincidente): autocomplete__option-highlight (requiere lógica en renderOption)
    * Mensaje: autocomplete__message
* Los colores, bordes, sombras, etc., usan variables CSS (--autocomplete-*) de _themes.css.

## Accesibilidad:

* El FormInput interno tiene role="combobox".
* Atributos ARIA: aria-autocomplete="list", aria-expanded, aria-controls, aria-activedescendant.
* La lista de sugerencias (div.autocomplete__listbox) tiene role="listbox".
* Cada sugerencia (div.autocomplete__option) tiene role="option", id único y aria-selected.
* Navegación por teclado completa (flechas, Enter, Esc) gestionada por @floating-ui/react (hooks useListNavigation y useDismiss).
* Foco gestionado por FloatingFocusManager.
🔝 Volver al índice

# 27. Card.jsx

## Objetivo:

Proporcionar un contenedor de contenido flexible y estilizado que agrupa información relacionada como una unidad visualmente delimitada y cohesiva. Ideal para mostrar resúmenes de entidades, perfiles, productos, o cualquier bloque de información que necesite destacarse.

## Características Clave:

*   **Contenedor Delimitado:** Ofrece una clara separación visual mediante bordes y/o sombras, dependiendo de la variante.
*   **Secciones Estructuradas (Opcionales):** Permite definir secciones de `header`, `body` (para `children`), y `footer` para organizar el contenido de manera semántica y visual.
*   **Soporte de Imágenes:** Puede incluir una imagen destacada con posiciones configurables (`top`, `left`, `right`).
*   **Variantes Visuales:** Proporciona diferentes estilos base (`bordered`, `elevated`, `flat`) para adaptarse a diversas necesidades de diseño.
*   **Flexibilidad Semántica:** Permite renderizar el elemento raíz como `div` (por defecto) u otro tipo de elemento HTML (ej: `article`, `section`) mediante la prop `as`.
*   **Clickeable (Opcional):** Puede hacerse completamente clickeable asignando una función a la prop `onClick`, añadiendo `role="button"` y `tabIndex="0"` si se renderiza como `div`.
*   **Tematización:** Los colores de fondo, texto, borde y sombra se controlan mediante variables CSS definidas en `_themes.css` para adaptarse a los temas claro/oscuro.
*   **Reutilización de Props de Layout:** Gracias a `...rest`, puede aceptar props de estilo y layout similares a las del componente `Container` si se desea una personalización más profunda (ej: pasar `background`, `padding` directamente para sobrescribir los defaults de Card).

## Props API:

| Prop            | Tipo                               | Requerido | Default     | Descripción                                                                                                                                         |
| :-------------- | :--------------------------------- | :-------- | :---------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`      | node                               | No        | `null`      | Contenido principal de la tarjeta, se renderiza dentro de la sección `card__body`.                                                                    |
| `header`        | node                               | No        | `null`      | Contenido para la sección de cabecera (`.card__header`) de la tarjeta.                                                                              |
| `footer`        | node                               | No        | `null`      | Contenido para la sección de pie de página (`.card__footer`) de la tarjeta.                                                                           |
| `imageSrc`      | string                             | No        | `null`      | URL de una imagen a mostrar en la tarjeta.                                                                                                            |
| `imageAlt`      | string                             | No        | `""`        | Texto alternativo para la imagen. **Requerido** para accesibilidad si `imageSrc` se proporciona.                                                      |
| `imagePosition` | `'top' \| 'left' \| 'right'`       | No        | `'top'`     | Posición de la imagen relativa al contenido de texto (header, body, footer).                                                                        |
| `variant`       | `'bordered' \| 'elevated' \| 'flat'`| No        | `'bordered'`| Estilo visual de la tarjeta: `'bordered'` (con borde), `'elevated'` (con sombra), `'flat'` (sin borde ni sombra, se integra con el fondo).       |
| `className`     | string                             | No        | `""`        | Clases CSS adicionales para el elemento raíz de la tarjeta.                                                                                           |
| `as`            | elementType                        | No        | `'div'`     | Permite renderizar la tarjeta como otro elemento HTML (ej: `'article'`, `'section'`).                                                                 |
| `onClick`       | `() => void`                       | No        | `undefined` | Si se proporciona, toda la tarjeta se vuelve clickeable. Si `as` es `'div'`, se le añaden `role="button"` y `tabIndex="0"` para accesibilidad. |
| `...rest`       | -                                  | No        | -           | Otras props HTML válidas (ej: `id`, `style`, o props de layout como `background`, `padding` para personalización avanzada) pasadas al elemento raíz. |

## Uso Básico:

        import React from 'react';
        import Card from './Card'; // Ajusta ruta
        import Titulo from './Titulo';
        import Parrafo from './Parrafo';
        import FormButton from './FormButton';

        function CardExamples() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Card simple con borde */}
            <Card variant="bordered">
                <Parrafo>Contenido simple de la tarjeta.</Parrafo>
            </Card>

            {/* Card con header, footer y sombra */}
            <Card
                variant="elevated"
                header={<Titulo as="h3" size="1.2rem">Título de la Tarjeta</Titulo>}
                footer={<FormButton label="Ver Más" size="small" />}
            >
                <Parrafo>Este es el cuerpo principal de una tarjeta elevada con más estructura.</Parrafo>
            </Card>

            {/* Card con imagen arriba y clickeable */}
            <Card
                imageSrc="https://via.placeholder.com/300x150"
                imageAlt="Imagen de ejemplo"
                imagePosition="top"
                onClick={() => alert('Card clickeada!')}
            >
                <Titulo as="h4" size="1.1rem">Tarjeta con Imagen</Titulo>
                <Parrafo>Esta tarjeta tiene una imagen y es clickeable.</Parrafo>
            </Card>
            </div>
        );
        }

## Estilado:

* Los estilos se definen en src/styles/components/_Card.css.
* Utiliza una estructura BEM:
    * Bloque: card
    * Modificadores: card--variant-[bordered|elevated|flat], card--image-position-[top|left|right], card--clickable.
    * Elementos: card__image-wrapper, card__image, card__content-wrapper (para layout con imagen lateral), card__header, card__body, card__footer.
* La apariencia (fondo, color de texto, bordes, sombras, padding, radios) se controla mediante variables CSS (--card-*) definidas en src/styles/config/_themes.css, permitiendo tematización.
* El layout interno usa Flexbox para manejar la disposición de la imagen y las secciones de contenido.
* overflow: hidden en el .card es importante para que border-radius afecte a imágenes internas.

## Accesibilidad:

* Si se proporciona una prop onClick y el componente se renderiza como div (por defecto), se le añaden automáticamente role="button" y tabIndex="0" para hacerlo operable por teclado y reconocible por tecnologías asistivas.
* Es crucial proporcionar un imageAlt descriptivo si se usa imageSrc.
* El contenido del header debería usar una etiqueta de encabezado semánticamente apropiada (ej. <Titulo as="h3">).
🔝 Volver al índice

# 28. Accordion.jsx 

## Objetivo:

Presentar una lista de secciones de contenido apiladas verticalmente, donde cada sección puede ser expandida para revelar su contenido o colapsada para ocultarlo. Permite controlar si solo una o múltiples secciones pueden estar abiertas simultáneamente y ofrece una animación suave para la transición.

## Características Clave:

*   **Múltiples Secciones:** Maneja un conjunto de ítems, cada uno compuesto por un encabezado clickeable y un panel de contenido colapsable.
*   **Modos de Apertura:**
    *   **Simple (Acordeón Clásico):** Solo un ítem puede estar abierto a la vez (por defecto). Al abrir un ítem, cualquier otro abierto se cierra.
    *   **Múltiple:** Permite que varios ítems estén abiertos simultáneamente (configurable con `allowMultipleOpen={true}`).
*   **Estado No Controlado:** El componente maneja internamente qué ítems están abiertos. Se pueden especificar ítems abiertos por defecto (`defaultOpenId` o `defaultOpenIds`).
*   **Animación de Transición:** Los paneles se expanden y colapsan con una animación suave de altura y opacidad. La altura se ajusta dinámicamente al contenido del panel mediante JavaScript.
*   **Icono Indicador:** Muestra un icono (`<FaPlus />` / `<FaMinus />` por defecto) en el encabezado que indica visualmente si la sección está abierta o cerrada.
*   **Iconos Personalizados por Ítem:** Cada ítem puede tener su propio icono (`item.icon`) junto a su título.
*   **Accesibilidad:**
    *   Los encabezados son botones (`<button>`) para una correcta interacción con teclado.
    *   Uso de atributos ARIA: `aria-expanded`, `aria-controls`, `aria-labelledby`.
    *   Los paneles tienen `role="region"`.
    *   Los ítems deshabilitados tienen el atributo `disabled`.
*   **Tematización:** La apariencia (colores, bordes, padding) se controla mediante variables CSS (`_themes.css`) y un archivo de estilos dedicado (`_Accordion.css`).

## Props API:

| Prop               | Tipo                              | Requerido | Default  | Descripción                                                                                                                                                           |
| :----------------- | :-------------------------------- | :-------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`            | `Array<AccordionItem>`            | Sí        | `[]`     | Array de objetos que definen cada sección del acordeón. Ver estructura de `AccordionItem` abajo.                                                                         |
| `allowMultipleOpen`| boolean                           | No        | `false`  | Si `true`, permite que múltiples secciones estén abiertas a la vez. Si `false`, solo una puede estar abierta (comportamiento de acordeón).                               |
| `defaultOpenId`    | `string \| number \| null`        | No        | `null`   | **(Usar si `allowMultipleOpen` es `false`)** El `id` del ítem que debería estar abierto por defecto.                                                                    |
| `defaultOpenIds`   | `Array<string \| number>`         | No        | `[]`     | **(Usar si `allowMultipleOpen` es `true`)** Array de `id`s de los ítems que deberían estar abiertos por defecto.                                                           |
| `className`        | string                            | No        | `""`     | Clases CSS adicionales para el `div.accordion` contenedor raíz.                                                                                                          |
| `itemClassName`    | string                            | No        | `""`     | Clases CSS adicionales para aplicar a cada `div.accordion__item`.                                                                                                        |
| `headerClassName`  | string                            | No        | `""`     | Clases CSS adicionales para aplicar a cada `button.accordion__header`.                                                                                                   |
| `panelClassName`   | string                            | No        | `""`     | Clases CSS adicionales para aplicar a cada `div.accordion__panel`.                                                                                                       |
| `...rest`          | -                                 | No        | -        | Otras props para el `div.accordion` contenedor raíz.                                                                                                                     |

**Estructura del objeto `AccordionItem` (dentro de `items`):**

| Clave      | Tipo                   | Requerido | Descripción                                                                                              |
| :--------- | :--------------------- | :-------- | :------------------------------------------------------------------------------------------------------- |
| `id`       | `string \| number`     | Sí        | Identificador único para esta sección del acordeón, usado para controlar su estado abierto/cerrado.      |
| `title`    | node                   | Sí        | Contenido del encabezado clickeable (generalmente texto, puede ser JSX).                                   |
| `content`  | node                   | Sí        | Contenido del panel que se expande/colapsa.                                                              |
| `icon`     | `React.ReactNode`      | No        | Icono opcional a mostrar al inicio del `title` en el encabezado (ej: `<FaQuestionCircle />`).             |
| `disabled` | boolean                | No        | Si `true`, esta sección del acordeón no se puede abrir/cerrar mediante interacción del usuario.           |

## Uso Básico:

        import React from 'react';
        import Accordion from './Accordion'; // Ajusta ruta
        import Parrafo from './Parrafo';
        import FormInput from './FormInput';
        import { FaQuestionCircle, FaCog } from 'react-icons/fa';

        function AccordionDemo() {
        const faqItems = [
            {
            id: 'q1',
            icon: <FaQuestionCircle />,
            title: '¿Cuál es el primer paso?',
            content: <Parrafo>El primer paso es leer la documentación.</Parrafo>,
            },
            {
            id: 'q2',
            title: '¿Cómo funciona el modo múltiple?',
            content: <Parrafo>En modo múltiple, puedes abrir varios paneles a la vez.</Parrafo>,
            },
        ];

        const configItems = [
            {
            id: 's1',
            icon: <FaCog />,
            title: 'Configuración General',
            content: <FormInput label="Nombre del Sitio" name="siteName" value="" onChange={() => {}}/>
            }
        ];

        return (
            <div>
            <h3>Acordeón Simple (defaultOpenId="q1")</h3>
            <Accordion items={faqItems} defaultOpenId="q1" />

            <h3 style={{ marginTop: '2rem' }}>Acordeón Múltiple (defaultOpenIds=["s1"])</h3>
            <Accordion
                items={configItems}
                allowMultipleOpen={true}
                defaultOpenIds={['s1']}
            />
            </div>
        );
        }

## Estilado:

* Los estilos se definen en src/styles/components/_Accordion.css.
* Utiliza una estructura BEM:
    * Bloque: accordion
    * Elementos: accordion__item (con modificador --open), accordion__header-container (wrapper semántico para hN), accordion__header (el botón), accordion__header-title-icon, accordion__header-title, accordion__header-expand-icon, accordion__panel, accordion__panel-content.
* La animación de expansión/colapso se logra principalmente mediante la transición de max-height (calculada con JavaScript para precisión), opacity y visibility.
* Los colores, bordes, padding, y fuentes usan variables CSS (--accordion-*) de _themes.css para tematización.

## Accesibilidad:

* Cada cabecera es un <button> para una correcta interacción con el teclado (Enter/Espacio para expandir/colapsar).
* Se usan atributos ARIA:
    * aria-expanded en el botón de cabecera indica si el panel está abierto o cerrado.
    * aria-controls en el botón de cabecera apunta al id del panel que controla.
    * id único en cada cabecera y panel.
    * aria-labelledby en el panel (role="region") apunta al id de su cabecera.
    * hidden se aplica al panel cuando está colapsado (o se controla su visibilidad mediante CSS max-height:0 y opacity:0).
    * Los ítems deshabilitados tienen el atributo disabled en su botón de cabecera.
* Los encabezados de sección se envuelven en un <h3> (o el nivel semántico apropiado) para una correcta estructura del documento.
🔝 Volver al índice

# 28. Accordion.jsx 

## Objetivo:

Presentar una lista de secciones de contenido apiladas verticalmente, donde cada sección puede ser expandida para revelar su contenido o colapsada para ocultarlo. Permite controlar si solo una o múltiples secciones pueden estar abiertas simultáneamente y ofrece una animación suave para la transición.

## Características Clave:

*   **Múltiples Secciones:** Maneja un conjunto de ítems, cada uno compuesto por un encabezado clickeable y un panel de contenido colapsable.
*   **Modos de Apertura:**
    *   **Simple (Acordeón Clásico):** Solo un ítem puede estar abierto a la vez (por defecto). Al abrir un ítem, cualquier otro abierto se cierra.
    *   **Múltiple:** Permite que varios ítems estén abiertos simultáneamente (configurable con `allowMultipleOpen={true}`).
*   **Estado No Controlado:** El componente maneja internamente qué ítems están abiertos. Se pueden especificar ítems abiertos por defecto (`defaultOpenId` o `defaultOpenIds`).
*   **Animación de Transición:** Los paneles se expanden y colapsan con una animación suave de altura y opacidad. La altura se ajusta dinámicamente al contenido del panel mediante JavaScript.
*   **Icono Indicador:** Muestra un icono (`<FaPlus />` / `<FaMinus />` por defecto) en el encabezado que indica visualmente si la sección está abierta o cerrada.
*   **Iconos Personalizados por Ítem:** Cada ítem puede tener su propio icono (`item.icon`) junto a su título.
*   **Accesibilidad:**
    *   Los encabezados son botones (`<button>`) para una correcta interacción con teclado.
    *   Uso de atributos ARIA: `aria-expanded`, `aria-controls`, `aria-labelledby`.
    *   Los paneles tienen `role="region"`.
    *   Los ítems deshabilitados tienen el atributo `disabled`.
*   **Tematización:** La apariencia (colores, bordes, padding) se controla mediante variables CSS (`_themes.css`) y un archivo de estilos dedicado (`_Accordion.css`).

## Props API:

| Prop               | Tipo                              | Requerido | Default  | Descripción                                                                                                                                                           |
| :----------------- | :-------------------------------- | :-------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`            | `Array<AccordionItem>`            | Sí        | `[]`     | Array de objetos que definen cada sección del acordeón. Ver estructura de `AccordionItem` abajo.                                                                         |
| `allowMultipleOpen`| boolean                           | No        | `false`  | Si `true`, permite que múltiples secciones estén abiertas a la vez. Si `false`, solo una puede estar abierta (comportamiento de acordeón).                               |
| `defaultOpenId`    | `string \| number \| null`        | No        | `null`   | **(Usar si `allowMultipleOpen` es `false`)** El `id` del ítem que debería estar abierto por defecto.                                                                    |
| `defaultOpenIds`   | `Array<string \| number>`         | No        | `[]`     | **(Usar si `allowMultipleOpen` es `true`)** Array de `id`s de los ítems que deberían estar abiertos por defecto.                                                           |
| `className`        | string                            | No        | `""`     | Clases CSS adicionales para el `div.accordion` contenedor raíz.                                                                                                          |
| `itemClassName`    | string                            | No        | `""`     | Clases CSS adicionales para aplicar a cada `div.accordion__item`.                                                                                                        |
| `headerClassName`  | string                            | No        | `""`     | Clases CSS adicionales para aplicar a cada `button.accordion__header`.                                                                                                   |
| `panelClassName`   | string                            | No        | `""`     | Clases CSS adicionales para aplicar a cada `div.accordion__panel`.                                                                                                       |
| `...rest`          | -                                 | No        | -        | Otras props para el `div.accordion` contenedor raíz.                                                                                                                     |

**Estructura del objeto `AccordionItem` (dentro de `items`):**

| Clave      | Tipo                   | Requerido | Descripción                                                                                              |
| :--------- | :--------------------- | :-------- | :------------------------------------------------------------------------------------------------------- |
| `id`       | `string \| number`     | Sí        | Identificador único para esta sección del acordeón, usado para controlar su estado abierto/cerrado.      |
| `title`    | node                   | Sí        | Contenido del encabezado clickeable (generalmente texto, puede ser JSX).                                   |
| `content`  | node                   | Sí        | Contenido del panel que se expande/colapsa.                                                              |
| `icon`     | `React.ReactNode`      | No        | Icono opcional a mostrar al inicio del `title` en el encabezado (ej: `<FaQuestionCircle />`).             |
| `disabled` | boolean                | No        | Si `true`, esta sección del acordeón no se puede abrir/cerrar mediante interacción del usuario.           |

## Uso Básico:


        import React from 'react';
        import Accordion from './Accordion'; // Ajusta ruta
        import Parrafo from './Parrafo';
        import FormInput from './FormInput';
        import { FaQuestionCircle, FaCog } from 'react-icons/fa';

        function AccordionDemo() {
        const faqItems = [
            {
            id: 'q1',
            icon: <FaQuestionCircle />,
            title: '¿Cuál es el primer paso?',
            content: <Parrafo>El primer paso es leer la documentación.</Parrafo>,
            },
            {
            id: 'q2',
            title: '¿Cómo funciona el modo múltiple?',
            content: <Parrafo>En modo múltiple, puedes abrir varios paneles a la vez.</Parrafo>,
            },
        ];

        const configItems = [
            {
            id: 's1',
            icon: <FaCog />,
            title: 'Configuración General',
            content: <FormInput label="Nombre del Sitio" name="siteName" value="" onChange={() => {}}/>
            }
        ];

        return (
            <div>
            <h3>Acordeón Simple (defaultOpenId="q1")</h3>
            <Accordion items={faqItems} defaultOpenId="q1" />

            <h3 style={{ marginTop: '2rem' }}>Acordeón Múltiple (defaultOpenIds=["s1"])</h3>
            <Accordion
                items={configItems}
                allowMultipleOpen={true}
                defaultOpenIds={['s1']}
            />
            </div>
        );
        }

## Estilado:

* Los estilos se definen en src/styles/components/_Accordion.css.
* Utiliza una estructura BEM:
    * Bloque: accordion
    * Elementos: accordion__item (con modificador --open), accordion__header-container (wrapper semántico para hN), accordion__header (el botón), accordion__header-title-icon, accordion__header-title, accordion__header-expand-icon, accordion__panel, accordion__panel-content.
* La animación de expansión/colapso se logra principalmente mediante la transición de max-height (calculada con JavaScript para precisión), opacity y visibility.
* Los colores, bordes, padding, y fuentes usan variables CSS (--accordion-*) de _themes.css para tematización.

## Accesibilidad:

* Cada cabecera es un <button> para una correcta interacción con el teclado (Enter/Espacio para expandir/colapsar).
* Se usan atributos ARIA:
    * aria-expanded en el botón de cabecera indica si el panel está abierto o cerrado.
    * aria-controls en el botón de cabecera apunta al id del panel que controla.
    * id único en cada cabecera y panel.
    * aria-labelledby en el panel (role="region") apunta al id de su cabecera.
    * hidden se aplica al panel cuando está colapsado (o se controla su visibilidad mediante CSS max-height:0 y opacity:0).
    * Los ítems deshabilitados tienen el atributo disabled en su botón de cabecera.
* Los encabezados de sección se envuelven en un <h3> (o el nivel semántico apropiado) para una correcta estructura del documento.
🔝 Volver al índice

# 29. Avatar.jsx

## Objetivo:

Mostrar una representación visual de un usuario o entidad, típicamente una imagen circular o cuadrada, con soporte para iniciales o un icono de fallback si la imagen no está disponible. También puede incluir un pequeño badge superpuesto para indicar estados o notificaciones.

## Características Clave:

*   **Fuente de Imagen Flexible:**
    *   Muestra una imagen si se proporciona una `src` válida.
    *   Maneja errores de carga de imagen, mostrando un fallback.
*   **Fallbacks Inteligentes:**
    *   Si la imagen falla o no se proporciona `src`, muestra iniciales generadas a partir de la prop `name`.
    *   Permite pasar `initials` personalizadas.
    *   Si no hay `src` ni `name`/`initials`, muestra un `fallbackIcon` configurable (por defecto `<FaUser />`).
*   **Formas y Tamaños Personalizables:**
    *   Soporta formas: `'circle'` (por defecto), `'square'`, `'rounded'`.
    *   Ofrece tamaños predefinidos: `'xs'`, `'sm'`, `'md'` (por defecto), `'lg'`, `'xl'`.
    *   Permite un `size` numérico (en píxeles) para un tamaño totalmente personalizado. El tamaño de fuente para las iniciales/icono se ajusta en proporción.
*   **Badge Superpuesto Opcional:**
    *   Puede mostrar un `Badge` (reutilizando el componente `Badge` existente) superpuesto en una esquina.
    *   El contenido (`badgeContent`) puede ser un número, texto, un icono, o `true` para un simple punto de estado.
    *   La variante de color y posición del badge son configurables.
*   **Clickeable:** Puede hacerse clickeable mediante la prop `onClick`, añadiendo la semántica y accesibilidad de un botón.
*   **Accesibilidad:** Incluye `alt` text para imágenes. Si se muestran iniciales, el `name` o `alt` se puede usar para `aria-label`.
*   **Tematización:** Los colores de fondo para iniciales/fallback y los colores del badge usan variables CSS de `_themes.css`.

## Props API:

| Prop            | Tipo                                                         | Requerido | Default         | Descripción                                                                                                                                                           |
| :-------------- | :----------------------------------------------------------- | :-------- | :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`           | string                                                       | No        | `null`          | URL de la imagen para el avatar.                                                                                                                                        |
| `alt`           | string                                                       | No        | `"Avatar"`      | Texto alternativo para la imagen. **Requerido** para accesibilidad si `src` se proporciona o si no hay `name` para `aria-label` de iniciales/fallback.                 |
| `name`          | string                                                       | No        | `""`            | Nombre completo o texto a partir del cual generar iniciales (si `src` no está disponible/falla y no se proveen `initials`). Usado también para `aria-label` de iniciales. |
| `initials`      | string                                                       | No        | `null`          | Permite pasar iniciales personalizadas directamente (máximo 2 caracteres). Si se provee, tiene prioridad sobre las generadas a partir de `name`.                             |
| `size`          | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number`             | No        | `'md'`          | Tamaño predefinido del avatar o un número (en píxeles) para un tamaño personalizado.                                                                                      |
| `shape`         | `'circle' \| 'square' \| 'rounded'`                          | No        | `'circle'`      | Forma del avatar. `'rounded'` aplica el radio de borde estándar.                                                                                                        |
| `fallbackIcon`  | node                                                         | No        | `<FaUser />`    | Icono React a mostrar si no hay `src` ni `name`/`initials` para generar contenido.                                                                                      |
| `badgeContent`  | node \| boolean                                              | No        | `null`          | Contenido para el badge superpuesto. Si es `true`, se muestra un pequeño punto de estado. Si es string/number/icono, se usa el componente `Badge`.                 |
| `badgeVariant`  | (Variantes del componente `Badge`, ej: `'danger'`, `'success') | No        | `'danger'`      | Variante de color para el `Badge` superpuesto (si `badgeContent` se usa para renderizar un `Badge`).                                                                     |
| `badgePosition` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | No      | `'top-right'`   | Posición del badge superpuesto.                                                                                                                                         |
| `className`     | string                                                       | No        | `""`            | Clases CSS adicionales para el `div` contenedor raíz del avatar.                                                                                                        |
| `onClick`       | `() => void`                                                 | No        | `undefined`     | Función a ejecutar si se hace clic en el avatar. Añade `role="button"` y `tabIndex="0"`.                                                                                |
| `...rest`       | -                                                            | No        | -               | Otras props HTML válidas (ej: `id`, `title`, `style`) pasadas al `div` contenedor raíz.                                                                               |

## Uso Básico:


        import React from 'react';
        import Avatar from './Avatar'; // Ajusta ruta
        import { FaUserAstronaut, FaBell } from 'react-icons/fa';

        function AvatarExamples() {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Con imagen */}
            <Avatar src="https://example.com/user.jpg" alt="Nombre Usuario" size="lg" />

            {/* Con iniciales */}
            <Avatar name="Marcos Morales" size="md" shape="rounded" />

            {/* Con icono de fallback */}
            <Avatar size="sm" shape="square" fallbackIcon={<FaUserAstronaut />} />

            {/* Con badge numérico */}
            <Avatar src="https://example.com/user2.jpg" alt="Otro Usuario" badgeContent="3" badgeVariant="primary" />

            {/* Con badge de estado (punto) */}
            <Avatar name="Usuario Online" badgeContent={true} badgeVariant="success" badgePosition="bottom-right" />

            {/* Clickeable */}
            <Avatar name="C C" initials="CC" onClick={() => alert('Avatar clickeado!')} title="Ver perfil de CC" />
            </div>
        );
        }

## Estilado:

Los estilos se definen en src/styles/components/_Avatar.css.
Utiliza una estructura BEM:
Bloque: avatar
Modificadores: avatar--shape-[circle|square|rounded], avatar--size-[xs|sm|md|lg|xl], avatar--clickable.
Elementos: avatar__image, avatar__initials, avatar__icon, avatar__badge (con modificadores de posición como avatar__badge--position-top-right).
La apariencia (colores de fondo para fallback, tamaños, radios de borde) se controla mediante variables CSS (--avatar-*) definidas en src/styles/config/_themes.css.
overflow: hidden en el .avatar es crucial para las formas y para que la imagen interna se recorte correctamente.
El font-size interno para iniciales/icono se calcula en proporción al width/height del avatar.
El badge superpuesto reutiliza el componente Badge para consistencia.

## Accesibilidad:

Se debe proporcionar alt text descriptivo para las imágenes.
Si se muestran iniciales o un icono de fallback, el name (si se proporciona) o el alt pueden ser útiles para un aria-label o title en el div contenedor para dar contexto. El componente Avatar actualmente usa alt para el aria-label de las iniciales/fallback si name no está presente.
Si se define onClick, el div raíz del avatar recibe role="button" y tabIndex="0" para hacerlo operable por teclado.
🔝 Volver al índice

# 30. ConfirmDialog.jsx

## Objetivo: 

El componente ConfirmDialog tiene como objetivo proporcionar un diálogo de confirmación estandarizado y reutilizable, construido sobre el componente Modal, para solicitar al usuario que confirme una acción potencialmente destructiva o importante. Se enfoca en la claridad del mensaje y en los botones de acción explícitos.

## Características Clave:

__Basado en Modal__: Utiliza el componente Modal base para su estructura, renderizado mediante portal, overlay, y control de visibilidad.
__Mensaje Flexible__: Acepta un string o JSX (React.ReactNode) como message para el cuerpo del diálogo, permitiendo mensajes simples o complejos con formato (ej., resaltando el nombre del ítem a eliminar). El message es envuelto en un p internamente.
__Título Explícito__: Permite un título claro y conciso en la cabecera del modal.
__Botones de Acción Personalizables__: Provee botones "Confirmar" y "Cancelar" (FormButton) con texto, variantes visuales (danger, outline), y estados de carga (isLoadingConfirm) configurables.
__Sin Botón de Cierre 'X'__: Por diseño, los diálogos de confirmación no suelen tener un botón de cierre en la esquina superior para forzar la elección entre confirmar o cancelar.
__Cierre por Cancelación__: El clic en el overlay o la tecla Esc (manejados por Modal) invocan la función onCancel.
__Accesibilidad__: Hereda la accesibilidad del Modal y los FormButton subyacentes.

## Props API:

Prop	Tipo	Requerido	Default	Descripción
isOpen	boolean	Sí	-	Controla si el diálogo está visible o no.
title	string	Sí	"¿Estás seguro?"	Título que se muestra en la cabecera del diálogo.
message	React.ReactNode	No	""	Contenido principal del cuerpo del diálogo. Puede ser un string o JSX. Se envuelve en un <p> internamente.
onConfirm	func	Sí	-	Función que se ejecuta cuando el usuario hace clic en el botón de confirmación.
onCancel	func	Sí	-	Función que se ejecuta cuando el usuario hace clic en el botón de cancelar, el overlay, o presiona Esc.
confirmText	string	No	"Confirmar"	Texto para el botón de confirmación.
cancelText	string	No	"Cancelar"	Texto para el botón de cancelación.
confirmVariant	string	No	"danger"	Variante de estilo ('danger', 'success', 'default') para el botón de confirmación.
cancelVariant	string	No	"outline"	Variante de estilo ('outline', 'default') para el botón de cancelación.
width	number	No	30	Ancho del modal en unidades rem.
isLoadingConfirm	boolean	No	false	Si es true, muestra un Loader en el botón de confirmación y lo deshabilita.

## Uso Básico:

        import React, { useState } from 'react';
        import ConfirmDialog from './ConfirmDialog';
        import FormButton from './FormButton';
        import Titulo from './Titulo'; // Si necesitas usar Titulo en el mensaje
        import Parrafo from './Parrafo'; // Si necesitas usar Parrafo en el mensaje

        function MyComponent() {
        const [isConfirmOpen, setIsConfirmOpen] = useState(false);
        const [isDeleting, setIsDeleting] = useState(false);
        const itemToDelete = "Mi Categoría Importante"; // Ejemplo de dato dinámico

        const handleOpenConfirm = () => setIsConfirmOpen(true);
        const handleCloseConfirm = () => setIsConfirmOpen(false);

        const handleActualConfirm = async () => {
            setIsDeleting(true);
            // Simular llamada a la API
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`Eliminando: ${itemToDelete}`);
            setIsDeleting(false);
            handleCloseConfirm();
        };

        return (
            <div>
            <FormButton label="Eliminar Algo" onClick={handleOpenConfirm} variant="danger" />

            <ConfirmDialog
                isOpen={isConfirmOpen}
                title="Confirma Eliminación" // Título en la cabecera del modal
                // El mensaje ahora puede ser JSX (React.ReactNode)
                message={(
                <>
                    <Titulo as="h4" className="confirm-dialog__subtitle">
                    ¿Eliminar "{itemToDelete}"?
                    </Titulo>
                    <Parrafo>
                    Se eliminará este ítem y todos sus datos asociados. Esta acción no se puede deshacer.
                    </Parrafo>
                </>
                )}
                onConfirm={handleActualConfirm}
                onCancel={handleCloseConfirm}
                confirmText="Sí, Eliminar"
                cancelText="No, Cancelar"
                confirmVariant="danger"
                cancelVariant="outline"
                isLoadingConfirm={isDeleting}
            />
            </div>
        );
        }

        export default MyComponent;

## Estilado:

* Los estilos de ConfirmDialog se heredan principalmente del Modal base.
* Se pueden aplicar clases adicionales al Modal a través de la prop className (modal--dialog confirm-dialog-modal-custom).
* Las clases específicas para el cuerpo y el pie de página (confirm-dialog-body, confirm-dialog-footer) y para el subtítulo (confirm-dialog__subtitle, * confirm-dialog__node-name-highlight) se deben definir en src/styles/components/_Modal.css para aplicar el diseño deseado.
* Los botones (FormButton) se estilizan según sus variant y size.

## Accesibilidad:

* Hereda la accesibilidad del componente Modal (roles dialog, aria-modal) y FormButton.
* El uso de title y mensajes claros contribuye a la comprensión del usuario.
* La ausencia del botón 'X' en la esquina superior obliga a una interacción explícita con los botones de acción, lo que es una práctica recomendada para diálogos de confirmación.
🔝 Volver al índice

# 31. ResizablePanel.jsx

## Objetivo: 

El componente ResizablePanel tiene como objetivo proporcionar un componente de layout que permite tener un panel lateral (izquierdo o derecho) con ancho ajustable por el usuario mediante arrastre, lo que mejora la flexibilidad de la interfaz en diseños de dos columnas.

## Características Clave:

__Ancho Ajustable__: El usuario puede cambiar el ancho del panel arrastrando un "handle" (manejador) en su borde.
__Posicionamiento Lateral__: Se puede configurar para que el panel sea el lateral izquierdo (side="left") o derecho (side="right").
__Restricciones de Tamaño__: Soporta minWidth y maxWidth para controlar el rango de ajuste del panel.
__Contenido Flexible__:__ Actúa como un contenedor para otros componentes (children).
__Persistencia (Potencial)__: Puede ser extendido para guardar el initialWidth en el almacenamiento local.
__Manejo de Eventos__: Utiliza eventos de ratón (onMouseDown, onMouseMove, onMouseUp) para gestionar el arrastre.

Props API:

Prop	Tipo	Requerido	Default	Descripción
children	node	Sí	-	Contenido React a renderizar dentro del panel redimensionable.
initialWidth	number	No	280	Ancho inicial del panel en píxeles.
minWidth	number	No	200	Ancho mínimo permitido para el panel en píxeles.
maxWidth	number	No	700	Ancho máximo permitido para el panel en píxeles.
side	string	No	'left'	Lado en el que se ubica el panel: 'left' o 'right'. Esto afecta la dirección del arrastre.
className	string	No	""	Clases CSS adicionales para aplicar al contenedor principal del panel (resizable-panel-container).

## Uso Básico:

        import React from 'react';
        import ResizablePanel from './ResizablePanel'; // Asegúrate de ajustar la ruta
        import Titulo from '../Titulo';
        import Parrafo from '../Parrafo';

        function MyTwoColumnLayout() {
        return (
            <div style={{ display: 'flex', height: 'calc(100vh - 50px)' }}> {/* Ejemplo de contenedor principal */}
            <ResizablePanel initialWidth={300} minWidth={200} maxWidth={500} side="left" className="my-custom-panel">
                <Titulo as="h3">Panel Izquierdo</Titulo>
                <Parrafo>Este es el contenido del panel lateral. Puedes ajustar su ancho.</Parrafo>
            </ResizablePanel>
            <div style={{ flexGrow: 1, padding: '1rem', overflowY: 'auto', backgroundColor: 'var(--background2)' }}>
                <Titulo as="h3">Contenido Principal</Titulo>
                <Parrafo>Este es el área principal de la aplicación, que se ajusta cuando el panel lateral cambia de tamaño.</Parrafo>
                {/* Mucho más contenido aquí para probar el scroll y el ajuste */}
                <div style={{ height: '1000px', background: 'repeating-linear-gradient(45deg, var(--background1), var(--background1) 10px, var(--background2) 10px, var(--background2) 20px)' }}>
                Espacio de prueba...
                </div>
            </div>
            </div>
        );
        }

        export default MyTwoColumnLayout;

## Estilado:

* Los estilos deben definirse en src/styles/layout/_ResizablePanel.css (o un archivo similar).
* Utiliza un display: flex; para el contenedor padre (.page-layout-with-hierarchy o similar) para que el panel redimensionable y el contenido principal se ajusten correctamente.
* __Clases Clave__:
    * resizable-panel-container: Contenedor principal que envuelve el panel y el handle (ej. position: relative; overflow: hidden; para contener el handle).
    * resizable-panel: El panel de contenido en sí (ej. flex-shrink: 0;).
    * resizable-panel-handle: La barra o área que el usuario arrastra (ej. position: absolute; y cursor: ew-resize;).
    * resizing: Clase aplicada al body o al contenedor principal durante el arrastre para controlar el cursor global y evitar selecciones de texto.
* Las variables CSS (--primary, --border-color, etc.) se deben usar para los colores del handle y fondos.

## Accesibilidad:

* El handle debe tener aria-orientation="vertical" y role="separator".
* Se recomienda añadir un aria-label descriptivo al handle (ej., "Arrastra para redimensionar el panel").
* El cursor cambia (ew-resize) durante el arrastre para indicar interactividad.
🔝 Volver al índice

# 32. NodoArbol.jsx

## Objetivo: 

El componente NodoArbol tiene como objetivo proporcionar un componente reutilizable para renderizar un nodo individual dentro de una estructura de árbol jerárquica. Gestiona la visualización del nodo (descripción, icono, estado), la interacción de selección y la lógica de expansión/colapso, y se integra con un sistema de líneas guía.

## Características Clave:

__Visualización de Nodo__: Muestra la descripción del nodo, un icono que representa su tipo (dinámico), y un icono para expandir/colapsar (si tiene hijos).
__Indentación Jerárquica__: Utiliza la profundidad del nodo (calculada por el componente padre JerarquiaManager) para aplicar visualmente la indentación adecuada, simulando la estructura del árbol.
__Líneas Guía__: Incorpora elementos visuales (pseudo-elementos CSS) que dibujan líneas verticales, similar a un explorador de archivos (ej. VSCode), para mejorar la legibilidad de la jerarquía.
__Estado de Expansión/Colapso__: Muestra un toggler (botón con flecha) que cambia de dirección y dispara una función onToggleExpand en el componente padre.
__Selección y Foco__: Al hacer clic en el nodo, lo selecciona y notifica al padre (onSeleccionar), aplicando estilos de destaque visual cuando estaSeleccionado es true.
__Estados Visuales__: Soporta estilos para nodos inactivos (Activo: false) y para nodos que coinciden con una búsqueda (matchBusqueda).
__Flexibilidad de Iconos__: Utiliza un mapeo interno para renderizar dinámicamente iconos de react-icons/fa según el IdTipoNodo.

## Props API:

Prop	Tipo	Requerido	Default	Descripción
nodo	object	Sí	-	Objeto que representa el nodo individual. Debe incluir: IdNodo, Descripcion, IdPadre, IdTipoNodo, LFT, RGT, Activo y las propiedades calculadas por el padre (profundidad, tieneHijos, esVisibleCalculada, matchBusqueda).
tiposNodo	Array<object>	Sí	[]	Array de objetos de tipo de nodo, cada uno con idtiponodo, descripcion, icono (nombre del icono de react-icons/fa). Usado para mapear IdTipoNodo a su icono visual.
isExpanded	boolean	Sí	false	Indica si el nodo está actualmente expandido. Controla la dirección del icono del toggler.
onToggleExpand	func	Sí	-	Función callback que se ejecuta cuando el usuario hace clic en el toggler de expansión/colapso. Recibe el IdNodo del nodo afectado.
onSeleccionar	func	Sí	-	Función callback que se ejecuta cuando el usuario hace clic en cualquier parte del nodo para seleccionarlo. Recibe el objeto nodo completo.
estaSeleccionado	boolean	Sí	false	Indica si el nodo está actualmente seleccionado. Aplica estilos visuales de destaque.

## Uso Básico: 

        import React, { useState, useMemo, useCallback } from 'react';
        import NodoArbol from './NodoArbol'; // Ajusta la ruta
        // Asumimos que JerarquiaManager orquesta esto
        // Ejemplo simplificado de cómo se usaría dentro de un componente padre que gestiona el árbol
        function MyTreeComponent({ nodosOriginales, tiposNodo, nodoSeleccionadoExternamente, onNodoSeleccionado }) {
        const [expandedNodes, setExpandedNodes] = useState(new Set());

        const handleToggleExpand = useCallback((idNodo) => {
            setExpandedNodes(prev => {
            const nuevo = new Set(prev);
            if (nuevo.has(idNodo)) nuevo.delete(idNodo);
            else nuevo.add(idNodo);
            return nuevo;
            });
        }, []);

        const procesarNodosParaUI = useMemo(() => {
            // Esta es una versión simplificada, la lógica completa está en JerarquiaManager
            const nodosProcesados = [];
            const ancestryStack = [];
            nodosOriginales.forEach(nodo => {
            while (ancestryStack.length > 0 && ancestryStack[ancestryStack.length - 1].RGT < nodo.RGT) {
                ancestryStack.pop();
            }
            const profundidad = ancestryStack.length;
            const tieneHijos = nodo.RGT - nodo.LFT > 1;
            const visible = profundidad === 0 || expandedNodes.has(nodo.IdPadre);

            const nodoUI = {
                ...nodo,
                profundidad,
                tieneHijos,
                esVisibleCalculada: visible,
                // matchBusqueda: false // Para este ejemplo simplificado
            };
            if (tieneHijos) ancestryStack.push(nodoUI);
            nodosProcesados.push(nodoUI);
            });
            return nodosProcesados.filter(n => n.esVisibleCalculada);
        }, [nodosOriginales, expandedNodes]);

        return (
            <div className="tree-container">
            {procesarNodosParaUI.map(nodo => (
                <NodoArbol
                key={nodo.IdNodo}
                nodo={nodo}
                tiposNodo={tiposNodo}
                isExpanded={expandedNodes.has(nodo.IdNodo)}
                onToggleExpand={handleToggleExpand}
                onSeleccionar={onNodoSeleccionado}
                estaSeleccionado={nodo.IdNodo === nodoSeleccionadoExternamente}
                />
            ))}
            </div>
        );
        }
        export default MyTreeComponent;

## Estilado:

* Los estilos deben definirse en src/styles/components/_JerarquiaManager.css (ya que NodoArbol es una parte intrínseca de ese componente).
* __Clases Clave (BEM)__:
    * nodo-arbol__item: Contenedor de cada fila de nodo. Utiliza display: flex; para alinear las líneas guía y el contenido.
    * nodo-arbol__lineas-guia-container: Contenedor display: flex; para las líneas de indentación.
    * nodo-arbol__guia-vertical: Elemento para cada segmento vertical de la línea guía. Usa position: relative; y un pseudo-elemento ::before para dibujar la línea (width, * height, background-color). Su width define la indentación por nivel.
    * nodo-arbol__contenido-wrapper: Contenedor del toggler, icono y texto del nodo (también display: flex;).
    * nodo-arbol__toggler: Contenedor del botón de expansión/colapso (FormButton con icono).
    * nodo-arbol__toggler-placeholder: Un span invisible para mantener la alineación de nodos sin hijos.
    * nodo-arbol__icono-tipo: El icono que representa el tipo de nodo.
    * nodo-arbol__descripcion: El texto descriptivo del nodo. Utiliza white-space: nowrap; overflow: hidden; text-overflow: ellipsis; para truncar texto largo.
* __Modificadores:__ nodo-arbol__item--seleccionado, nodo-arbol__item--inactivo, nodo-arbol__item--raiz, nodo-arbol__descripcion--match.
* __Variables CSS:__ Es crucial usar variables de _themes.css para colores (--tree-guide-color, --highlight-bg-color, --hover-bg-color, --primary-dark, etc.).

## Accesibilidad:

* El elemento del nodo es clickeable, y la selección del foco es manejada por el padre.
* El toggler de expansión/colapso es un FormButton con aria-label y el icono que cambia para indicar el estado.
* El placeholder del toggler para nodos sin hijos tiene aria-hidden="true".
* El icono de tipo de nodo tiene aria-hidden="true" si su significado ya está claro en la descripción.
🔝 Volver al índice