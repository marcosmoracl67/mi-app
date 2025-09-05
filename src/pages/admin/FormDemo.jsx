// --- START OF FILE pages/admin/FormDemo.jsx --- (CON BREADCRUMBS)

import { useState } from 'react';
// ... (resto de imports existentes) ...
import Alert from '../../components/Alert';
import FormButton from '../../components/FormButton';
import FormCheckBox from '../../components/FormCheckbox';
import Tabs from '../../components/Tabs';
import Parrafo from '../../components/Parrafo';
import FormInput from '../../components/FormInput';
import Titulo from '../../components/Titulo';
import Container from '../../components/Container';
import FormRadioGroup from '../../components/FormRadioGroup';
import Breadcrumbs from '../../components/Breadcrumbs'; 
import Tooltip from '../../components/Tooltip'; 
import Badge from '../../components/Badge'; 
import AutoComplete from '../../components/AutoComplete'; 
import Card from '../../components/Card';
import Accordion from '../../components/Accordion'; 
import Avatar from '../../components/Avatar'; // <<< AÑADIR IMPORT DE AVATAR
import {
    FaUser, FaCog, FaEnvelope, FaInfoCircle, FaExclamationTriangle, FaLock,
    FaHome, FaTachometerAlt, FaWrench, FaAngleRight, FaSave, FaQuestionCircle,
    FaCheck, FaExclamation, FaThumbsUp, FaCommentDots, FaUserAstronaut, 
    FaShieldAlt, FaBook, FaUserSecret, FaUserCircle // <<< ASEGÚRATE QUE ESTOS ESTÉN AQUÍ
} from 'react-icons/fa';


const FormDemo = () => {
  // ... (todos los estados existentes) ...
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  // --- Definir items para Breadcrumbs, datos para AutoComplete, items para Accordion (sin cambios) ---
   const breadcrumbItemsExample1 = [ /* ... */ ];
   const breadcrumbItemsExample2 = [ /* ... */ ];
   const todosLosUsuarios = [ /* ... */ ];
   const faqItems = [ /* ... */ ];
   const settingsAccordionItems = [ /* ... */ ];

  // ... (resto de configs y handlers existentes) ...
  const handleUsuarioSelect = (usuario) => { setSelectedUsuario(usuario); };
  const [activeBoxedTab, setActiveBoxedTab] = useState('contenido1');
  const [visibleBadges, setVisibleBadges] = useState(['tag1', 'tag2', 'tag3']);
  const [usuarioInputValue, setUsuarioInputValue] = useState('');
  const handleBadgeClose = (badgeId) => { setVisibleBadges(prev => prev.filter(id => id !== badgeId)); };
  const infoTabsConfig = [ { id: 'perfil', label: 'Perfil', icon: <FaUser />, content: ( <div> <Titulo as="h4" size="1.1rem" margin="0 0 0.5rem">Contenido del Perfil</Titulo> <Parrafo>Esta es la información del perfil del usuario. Aquí podrías poner un formulario para editar datos personales.</Parrafo> <FormInput label="Nombre de Usuario" name="demoUsername" value="UsuarioDemo" onChange={() => {}} /> </div> ), }, { id: 'cuenta', label: 'Cuenta', icon: <FaCog />, content: ( <div> <Titulo as="h4" size="1.1rem" margin="0 0 0.5rem">Ajustes de la Cuenta</Titulo> <Parrafo>Configura las opciones de tu cuenta, como el email o la contraseña.</Parrafo> <FormCheckBox label="Habilitar Autenticación de Dos Factores" name="2fa" checked={false} onChange={()=>{}} /> </div> ), }, { id: 'notificaciones', label: 'Notificaciones', icon: <FaEnvelope />, content: ( <div> <Titulo as="h4" size="1.1rem" margin="0 0 0.5rem">Preferencias de Notificación</Titulo> <Parrafo>Elige cómo quieres recibir las notificaciones.</Parrafo> </div> ), }, { id: 'ayuda', label: 'Ayuda (Deshabilitada)', icon: <FaInfoCircle />, disabled: true, content: <Parrafo>Sección de ayuda.</Parrafo> } ];
  const settingsTabsConfig = [ { id: 'general', label: 'General', content: <Parrafo>Configuración general de la aplicación.</Parrafo> }, { id: 'apariencia', label: 'Apariencia', content: <Parrafo>Personaliza los colores y el tema.</Parrafo> }, { id: 'seguridad', label: 'Seguridad', icon: <FaLock />, content: <Parrafo>Opciones de seguridad avanzadas.</Parrafo> } ];
  const boxedTabsConfig = [ { id: 'contenido1', label: 'Contenido Uno', content: <Parrafo>Este es el primer bloque de contenido en pestañas "boxed".</Parrafo>}, { id: 'contenido2', label: 'Contenido Dos', icon: <FaExclamationTriangle />, content: <Parrafo>Segundo bloque, ¡con un icono!</Parrafo>}, { id: 'contenido3', label: 'Contenido Tres Largo Nombre Pestaña', content: <Parrafo>Tercer bloque para ver cómo se maneja el texto largo.</Parrafo>}, ];
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [recibeNoticias, setRecibeNoticias] = useState(true);
  const [opcionAdmin, setOpcionAdmin] = useState(false);
  const [terminosError, setTerminosError] = useState(null);
  const [planSeleccionado, setPlanSeleccionado] = useState('free');
  const [planError, setPlanError] = useState(null);
  const [contactoPreferido, setContactoPreferido] = useState(null);
  const [opcionFijaValor, setOpcionFijaValor] = useState('fixed');
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: '', type: 'info', title: '', autoCloseDelay: null, });
  const [activeInfoTab, setActiveInfoTab] = useState('perfil');
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');
  const showAlert = (message, type = 'info', title = '', autoCloseDelay = 5000) => { setAlertConfig({ isOpen: true, message, type, title, autoCloseDelay }); };
  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));
  const handleTerminosChange = (e) => { setAceptaTerminos(e.target.checked); if (e.target.checked) setTerminosError(null); if (e.target.checked) showAlert('Has aceptado los términos.', 'success', '¡Gracias!', 3000); };
  const handleNoticiasChange = (e) => setRecibeNoticias(e.target.checked);
  const handleAdminChange = (e) => setOpcionAdmin(e.target.checked);
  const opcionesPlan = [ { value: 'free', label: 'Plan Gratuito' }, { value: 'basic', label: 'Plan Básico ($10/mes)' }, { value: 'premium', label: 'Plan Premium ($25/mes)' }, { value: 'enterprise', label: 'Empresarial (Contacto)' } ];
  const opcionesContacto = [ {value: 'email', label: 'Email'}, {value: 'phone', label: 'Teléfono'}, {value: 'none', label: 'Ninguno'} ];
  const opcionesFijas = [ {value: 'fixed', label: 'Valor Fijo'} ];
  const handlePlanChange = (e) => { setPlanSeleccionado(e.target.value); if (e.target.value) setPlanError(null); showAlert(`Has seleccionado el plan: ${opcionesPlan.find(op => op.value === e.target.value)?.label || e.target.value}`, 'info', 'Plan Seleccionado'); };
  const handleContactoChange = (e) => { setContactoPreferido(e.target.value); };
  const handleOpcionFijaChange = (e) => { setOpcionFijaValor(e.target.value); };
  const handleSubmit = (e) => { e.preventDefault(); let isValid = true; if (!aceptaTerminos) { setTerminosError("Debes aceptar los términos y condiciones."); showAlert("Debes aceptar los términos y condiciones.", 'error', "Error de Validación"); isValid = false; } if (!contactoPreferido) { showAlert("Por favor, selecciona una preferencia de contacto.", 'warning', "Campo Requerido"); isValid = false; } if (!selectedUsuario) { showAlert("Debes seleccionar un usuario.", 'error', "Validación AutoComplete"); isValid = false; } if (!isValid) return; console.log("Formulario enviado:", { aceptaTerminos, recibeNoticias, opcionAdmin, planSeleccionado, contactoPreferido, opcionFijaValor, selectedUsuario, }); showAlert("Formulario enviado con éxito (ver consola).", 'success', '¡Enviado!'); };


  return (
    <Container centered maxWidth="700px" bordered padding="2rem">

      {/* ... (Breadcrumbs, Título Principal, Alert, Cards, Accordion) ... */}
       <Titulo as="h3" size="1.3rem" margin="0 0 1rem 0">Demo Breadcrumbs</Titulo>
      <Container background="var(--background1)" padding="1rem" bordered margin="0 0 1.5rem 0"> <Parrafo size="0.8em" margin="0 0 0.5rem 0">Separador por defecto ('/'):</Parrafo> <Breadcrumbs items={breadcrumbItemsExample1} /> <hr style={{ margin: '1rem 0', borderColor: 'var(--input-stroke-idle)' }}/> <Parrafo size="0.8em" margin="0 0 0.5rem 0">Separador con Icono:</Parrafo> <Breadcrumbs items={breadcrumbItemsExample2} separator={<FaAngleRight size="0.8em" />} /> </Container>
       <Titulo as="h2" align="center" margin="1.5rem 0 1.5rem 0"> Demo Componentes de Formulario y UI </Titulo>
       <Alert isOpen={alertConfig.isOpen} message={alertConfig.message} type={alertConfig.type} title={alertConfig.title} onClose={closeAlert} autoCloseDelay={alertConfig.autoCloseDelay} />
      <hr style={{ margin: '2rem 0' }} />
      <Titulo as="h3" size="1.3rem" margin="1.5rem 0 1rem 0">Demo Card</Titulo>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}> <Card header={<Titulo as="h4" size="1.2rem" margin="0">Card con Header y Footer</Titulo>} footer={ <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> <Parrafo size="0.8em" margin="0">Información de pie.</Parrafo> <FormButton label="Acción" size="small" variant="outline" /> </div> } variant="elevated" > <Parrafo>Este es el cuerpo principal de la tarjeta. Puede contener cualquier tipo de contenido.</Parrafo> <Badge variant="info" style={{marginTop: '0.5rem'}}>Info Tag</Badge> </Card> <Card imageSrc="https://fakeimg.pl/400x200/8c4040/909090" imageAlt="Placeholder de imagen para card" imagePosition="top" variant="bordered" onClick={() => showAlert('Card con imagen clickeada!', 'info')} > <Titulo as="h4" size="1.1rem" margin="0 0 0.5rem">Card con Imagen Arriba</Titulo> <Parrafo size="0.9em">El contenido se muestra debajo de la imagen. Esta tarjeta es clickeable.</Parrafo> </Card> <Card imageSrc="https://fakeimg.pl/150x200/3c49c2/909090" imageAlt="Placeholder de imagen lateral" imagePosition="left" header={<Titulo as="h5" size="1rem" margin="0">Imagen a la Izquierda</Titulo>} > <Parrafo size="0.9em">El contenido se adapta al lado de la imagen. Ideal para perfiles o listados.</Parrafo> </Card> <Card variant="flat" background="var(--background1)" padding="1rem"> <Titulo as="h4" size="1.1rem" margin="0 0 0.5rem">Card Plana (Flat)</Titulo> <Parrafo>Esta tarjeta no tiene bordes ni sombra, se integra más con el fondo si tiene uno similar.</Parrafo> <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}> <Badge isPill icon={<FaThumbsUp />}>25</Badge> <Badge isPill icon={<FaCommentDots />} variant="gray">7</Badge> </div> </Card> </div>
       <hr style={{ margin: '2rem 0' }} />
      <Titulo as="h3" size="1.3rem" margin="1.5rem 0 1rem 0">Demo Accordion</Titulo>
      <Container background="var(--background1)" padding="1.5rem" bordered margin="0 0 1.5rem 0"> <Titulo as="h4" size="1.1rem" margin="0 0 1rem 0">Acordeón Simple (Solo uno abierto):</Titulo> <Accordion items={faqItems} defaultOpenId="faq1" /> <hr style={{ margin: '2rem 0', borderColor: 'var(--input-stroke-idle)' }}/> <Titulo as="h4" size="1.1rem" margin="1.5rem 0 1rem 0">Acordeón Múltiple (Varios abiertos):</Titulo> <Accordion items={settingsAccordionItems} allowMultipleOpen={true} defaultOpenIds={['generalSet']} itemClassName="mi-accordion-item-custom" /> </Container>


      {/* --- 3. AÑADIR DEMO AVATAR --- */}
      <hr style={{ margin: '2rem 0' }} />
      <Titulo as="h3" size="1.3rem" margin="1.5rem 0 1rem 0">Demo Avatar</Titulo>
      <Container background="var(--background1)" padding="1.5rem" bordered margin="0 0 1.5rem 0">
        <Titulo as="h4" size="1.1rem" margin="0 0 0.8rem 0">Básicos (Imagen, Iniciales, Icono):</Titulo>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Tooltip content="Avatar con Imagen (Luke)"><Avatar src="https://swapi.dev/api/people/1/image" alt="Luke Skywalker" name="Luke Skywalker" size="lg" onClick={() => showAlert('Luke clickeado!', 'info')} /></Tooltip>
          <Tooltip content="Imagen Inválida (muestra iniciales)"><Avatar src="https://url-invalida.com/img.png" alt="Error" name="Error Imagen" size="lg" /></Tooltip>
          <Tooltip content="Iniciales (Marcos Morales)"><Avatar name="Marcos Morales" size="lg" /></Tooltip>
          <Tooltip content="Iniciales (Ana G.)"><Avatar name="Ana G." initials="AG" size="lg" /></Tooltip>
          <Tooltip content="Una sola palabra (React)"><Avatar name="React" size="lg" /></Tooltip>
          <Tooltip content="Sin src ni name (Icono Fallback)"><Avatar size="lg" fallbackIcon={<FaUserSecret size="60%" />} /></Tooltip>
        </div>

        <Titulo as="h4" size="1.1rem" margin="1rem 0 0.8rem 0">Formas y Tamaños:</Titulo>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Avatar name="XS" size="xs" shape="circle" />
          <Avatar name="SM" size="sm" shape="rounded" />
          <Avatar name="MD" size="md" shape="square" fallbackIcon={<FaUserAstronaut />} />
          <Avatar name="LG" size="lg" shape="rounded" src="https://swapi.dev/api/people/4/image" alt="Vader" />
          <Avatar name="XL" size="xl" shape="circle" />
          <Tooltip content="Tamaño numérico (60px)"><Avatar name="PX" size={60} shape="rounded" /></Tooltip>
        </div>

        <Titulo as="h4" size="1.1rem" margin="1rem 0 0.8rem 0">Con Badges Superpuestos:</Titulo>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Avatar name="Online" size="lg" badgeContent={true} badgeVariant="success" />
          <Avatar src="https://swapi.dev/api/people/3/image" alt="R2-D2" size="lg" badgeContent="3" badgeVariant="primary" badgePosition="bottom-left" />
          <Avatar name="Busy" size="xl" fallbackIcon={<FaUserCircle />} badgeContent={<FaExclamation />} badgeVariant="danger" badgePosition="top-left"/>
          <Avatar name="Away" size="md" badgeContent="AFK" badgeVariant="warning" badgePosition="bottom-right" />
        </div>
      </Container>
      {/* --- FIN AVATAR --- */}


      {/* ... (AutoComplete, Tooltips, Badges originales, Tabs, Formulario principal, Alertas Manuales) ... */}
       <hr style={{ margin: '2rem 0' }} />
      <Titulo as="h3" size="1.3rem" margin="1.5rem 0 1rem 0">Demo AutoComplete</Titulo>
      <Container background="var(--background1)" padding="1.5rem" bordered margin="0 0 1.5rem 0"> <AutoComplete label="Seleccionar Usuario (Local)" name="usuarioLocal" value={usuarioInputValue} onValueChange={setUsuarioInputValue} onSelect={handleUsuarioSelect} selectedOption={selectedUsuario} options={todosLosUsuarios} optionToString={(option) => option?.label || ''} placeholder="Escribe para buscar un usuario..." noSuggestionsMessage="No se encontraron usuarios" minCharsToSearch={1} required /> {selectedUsuario && ( <Parrafo size="0.9em" margin="0.5rem 0 0 0"> Usuario seleccionado: <strong>{selectedUsuario.label}</strong> (ID: {selectedUsuario.id}, Rol: {selectedUsuario.role}) </Parrafo> )} <div style={{height: '10px'}}></div> <AutoComplete label="Buscar País (Simulación Remota - necesita fetchSuggestions)" name="paisRemoto" value={""} onValueChange={() => {}} onSelect={() => {}} placeholder="Escribe para buscar un país (simulado)" disabled /> </Container>
      <hr style={{ margin: '2rem 0' }} />
      <Titulo as="h3" size="1.3rem" margin="1.5rem 0 1rem 0">Demo Tooltip</Titulo>
      <Container background="var(--background1)" padding="1rem" bordered margin="0 0 1.5rem 0"> <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}> <Tooltip content="Guardar cambios (posición top por defecto)"> <FormButton icon={<FaSave />} aria-label="Guardar" /> </Tooltip> <Tooltip content="Necesitas ayuda? Haz clic aquí!" position="bottom"> <FormButton icon={<FaQuestionCircle />} variant="outline" aria-label="Ayuda" /> </Tooltip> <Tooltip content="Este input tiene un tooltip a la derecha." position="right"> <FormInput name="tooltipInput" placeholder="Input con tooltip" value="" onChange={()=>{}} /> </Tooltip> <Tooltip content="Este es un texto más largo para probar el ancho máximo y ajuste de línea del tooltip." position="left"> <span style={{ borderBottom: '1px dashed gray', cursor: 'help' }}>Pasa el cursor aquí</span> </Tooltip> <Tooltip content="Tooltip desactivado" disabled> <FormButton label="Tooltip Desactivado" disabled /> </Tooltip> </div> </Container>
      <hr style={{ margin: '2rem 0' }} />
      <Titulo as="h3" size="1.3rem" margin="1.5rem 0 1rem 0">Demo Badge/Tag</Titulo>
      <Container background="var(--background1)" padding="1.5rem" bordered margin="0 0 1.5rem 0"> <Titulo as="h4" size="1.1rem" margin="0 0 0.8rem 0">Variantes de Color:</Titulo> <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}> <Badge variant="primary">Primary</Badge> <Badge variant="success">Éxito</Badge> <Badge variant="danger">Peligro</Badge> <Badge variant="warning">Advertencia</Badge> <Badge variant="info">Información</Badge> <Badge variant="gray">Gris (Default)</Badge> <Badge>Sin Variante</Badge> </div> <Titulo as="h4" size="1.1rem" margin="1rem 0 0.8rem 0">Con Iconos:</Titulo> <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}> <Badge variant="success" icon={<FaCheck />}>Validado</Badge> <Badge variant="warning" icon={<FaExclamationTriangle />}>Pendiente</Badge> <Badge icon={<FaInfoCircle />}>Dato</Badge> </div> <Titulo as="h4" size="1.1rem" margin="1rem 0 0.8rem 0">Estilo Píldora:</Titulo> <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}> <Badge variant="primary" isPill>Primary Pill</Badge> <Badge variant="info" isPill icon={<FaCog/>}>Ajuste</Badge> <Badge isPill>Default Pill</Badge> </div> <Titulo as="h4" size="1.1rem" margin="1rem 0 0.8rem 0">Cerrable:</Titulo> <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}> {visibleBadges.includes('tag1') && ( <Badge variant="info" closable onClose={() => handleBadgeClose('tag1')} closeLabel="Quitar Tag 1" > Tag 1 </Badge> )} {visibleBadges.includes('tag2') && ( <Badge variant="success" isPill closable onClose={() => handleBadgeClose('tag2')} closeLabel="Quitar Tag 2" > Tag 2 (Pill) </Badge> )} {visibleBadges.includes('tag3') && ( <Badge variant="danger" icon={<FaExclamation/>} closable onClose={() => handleBadgeClose('tag3')} > Error Tag </Badge> )} {visibleBadges.length === 0 && <Parrafo size="0.9em">Todos los badges cerrables fueron quitados.</Parrafo>} </div> {!visibleBadges.includes('tag1') && !visibleBadges.includes('tag2') && !visibleBadges.includes('tag3') && ( <FormButton size="small" onClick={() => setVisibleBadges(['tag1', 'tag2', 'tag3'])} label="Restaurar Badges" /> )} </Container>
       <hr style={{ margin: '2rem 0' }} />
      <Titulo as="h3" size="1.3rem" margin="1.5rem 0 1rem 0">Demo de Pestañas (Tabs)</Titulo>
      <Container background="var(--background1)" padding="1rem" bordered margin="0 0 1.5rem 0"> <Titulo as="h4" size="1.1rem" margin="0 0 1rem 0" align="center">Pestañas estilo "Línea"</Titulo> <Tabs tabsConfig={infoTabsConfig} activeTabId={activeInfoTab} onTabChange={setActiveInfoTab} ariaLabel="Información de usuario" /> </Container>
      <Container background="var(--background1)" padding="1rem" bordered margin="0 0 1.5rem 0"> <Titulo as="h4" size="1.1rem" margin="0 0 1rem 0" align="center">Pestañas estilo "Píldoras"</Titulo> <Tabs tabsConfig={settingsTabsConfig} activeTabId={activeSettingsTab} onTabChange={setActiveSettingsTab} variant="pills" ariaLabel="Configuración de la aplicación" /> </Container>
      <Container background="var(--background1)" padding="1rem" bordered> <Titulo as="h4" size="1.1rem" margin="0 0 1rem 0" align="center">Pestañas estilo "Caja"</Titulo> <Tabs tabsConfig={boxedTabsConfig} activeTabId={activeBoxedTab} onTabChange={setActiveBoxedTab} variant="boxed" ariaLabel="Contenido adicional" /> </Container>
      <hr style={{ margin: '2rem 0' }} />
      <Titulo as="h3" size="1.3rem" margin="1.5rem 0 1rem 0">Demo Controles de Formulario</Titulo>
       <form onSubmit={handleSubmit}>
        <Titulo as="h3" size="1.2rem" margin="1rem 0 0.5rem 0">Checkboxes</Titulo>
         <FormCheckBox label="Acepto los términos y condiciones" name="terminos" checked={aceptaTerminos} onChange={handleTerminosChange} error={terminosError} required />
        <Tooltip content="Esta opción está deshabilitada porque requiere permisos especiales." position="right">
           <FormCheckBox label="Opción de Administrador (deshabilitado)" name="admin" checked={opcionAdmin} onChange={handleAdminChange} disabled={true} />
        </Tooltip>
        <FormCheckBox label="Deseo recibir noticias y promociones" name="noticias" checked={recibeNoticias} onChange={handleNoticiasChange} />
         <hr style={{ margin: '2rem 0' }} />
        <Titulo as="h3" size="1.2rem" margin="1rem 0 0.5rem 0">Radio Buttons</Titulo>
        <FormRadioGroup legend="Elige tu plan de suscripción" name="planSuscripcion" options={opcionesPlan} selectedValue={planSeleccionado} onChange={handlePlanChange} error={planError} required />
         <FormRadioGroup legend="Preferencia de Contacto (Inline)" name="contactoPref" options={opcionesContacto} selectedValue={contactoPreferido} onChange={handleContactoChange} inline={true} containerClassName="margin-top-large" required />
          <FormRadioGroup legend="Opción Fija (Deshabilitado)" name="opcionFija" options={opcionesFijas} selectedValue={opcionFijaValor} onChange={handleOpcionFijaChange} disabled={true} containerClassName="margin-top-large" />
        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <FormButton type="submit" label="Enviar Demo" variant="success" />
        </div>
      </form>
       <Titulo as="h3" size="1.2rem" margin="2rem 0 0.5rem 0">Probar Alertas Manualmente</Titulo>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <FormButton label="Info Alert" onClick={() => showAlert('Esta es una información útil.', 'info', 'Información')} />
        <FormButton label="Success Alert" variant="success" onClick={() => showAlert('¡Operación completada exitosamente!', 'success', 'Éxito')} />
        <FormButton label="Warning Alert" variant="outline" onClick={() => showAlert('Cuidado, algo podría no estar bien.', 'warning', 'Advertencia', null)} />
        <FormButton label="Error Alert" variant="danger" onClick={() => showAlert('Ha ocurrido un error inesperado.', 'error', 'Error Grave')} />
      </div>

    </Container>
  );
};

export default FormDemo;
// --- END OF FILE pages/admin/FormDemo.jsx --- (CON AVATAR)