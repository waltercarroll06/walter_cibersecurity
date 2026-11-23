> Estado actual: solo redes y Cisco en localhost. Los 17 módulos y sus 44 temas ya están integrados; el editor guarda un borrador por módulo. El plan de fases de abajo es histórico y no autoriza reintroducir laboratorios, Windows, Linux o DFIR en la interfaz. IA aún pendiente de proveedor.

# Plan de producto y arquitectura

## Objetivo

Construir un espacio de aprendizaje que Walter pueda mantener sin dejar de estudiar. La primera entrega debe permitir escribir, encontrar y relacionar apuntes, registrar prácticas y llevar una checklist. No exige pagos recurrentes ni conocimientos avanzados de desarrollo.

## Decisiones de esta entrega

| Decisión | Motivo | Cuándo revisarla |
| --- | --- | --- |
| Astro estático + TypeScript | El contenido principal es Markdown; páginas rápidas y pocas piezas | Si aparecen funciones importantes de servidor |
| Markdown normal | Fácil de escribir, versionar y migrar | MDX solo si una entrada necesita componentes interactivos |
| CSS propio | Diseño coherente sin otra dependencia | Si el tamaño del proyecto lo requiere |
| Git local preparado para GitHub | Historial y respaldo bajo control del usuario | Mantener como fuente del proyecto |
| GitHub Pages como destino opcional | Sitio estático sin servidor propio | Si se añade autenticación o API |
| localStorage versionado + exportación | Persistencia sin cuentas ni backend | Cuando se necesite sincronización real |
| Índice JSON estático | Suficiente para un blog pequeño; busca también el contenido | Medir tamaño y tiempo antes de adoptar Pagefind u otro índice |

Next.js sigue siendo una opción válida para una aplicación con más lógica de servidor. Esta entrega usa Astro porque el trabajo inmediato es publicar contenido. No se necesita migrar el blog para agregar más adelante un servicio de IA separado.

## MVP implementado y criterios de aceptación

- Un Markdown publicado crea una página; sus imágenes locales se procesan.
- `draft: true` no produce página ni entrada de búsqueda.
- El diario y los laboratorios se distinguen y comparten esquema de contenido.
- La búsqueda encuentra texto del cuerpo y acepta consultas sin tildes.
- Marcar una habilidad actualiza el progreso; recargar conserva las marcas.
- Se puede exportar un respaldo y restaurarlo en otro navegador. Un JSON inválido no reemplaza el estado.
- El editor guarda un borrador en el navegador y exporta Markdown con metadatos válidos. No afirma publicar ni guardar archivos del repositorio.
- Las páginas funcionan bajo la raíz y bajo un prefijo de GitHub Pages.
- README y AGENTS explican cómo usar, verificar y ampliar el proyecto.

## Siguiente entrega: diagramas y repaso

Integrar Mermaid bajo demanda en bloques de código `mermaid`, sin llamadas externas y con configuración estricta. Conservar el texto fuente editable y una alternativa legible si el diagrama falla. Añadir una topología de red real de laboratorio como primera prueba. Para tarjetas de repaso, comenzar con preguntas escritas por el usuario y guardar el avance con un esquema versionado.

## Tutor IA contextual: diseño futuro

La integración no está activa. Separar cuatro responsabilidades:

1. **Contexto:** seleccionar explícitamente el apunte o fragmento, incluir título, ID, URL y texto. Excluir borradores y cualquier dato privado por defecto.
2. **Interfaz:** acciones concretas: explicar, preguntar, resumir y proponer un diagrama. Mostrar el contexto que se enviará y la referencia de origen.
3. **Proveedor:** un contrato independiente de la marca, por ejemplo `answer({ question, context, mode })`. Respuesta con texto, referencias y uso reportado. No hace falta añadir un SDK antes de elegir el proveedor.
4. **Acceso y presupuesto:** si es remoto, invocación desde un servidor autenticado con claves fuera del cliente, límites de entrada/salida, cuotas y un límite de gasto. GitHub Pages no ejecuta ese servidor; el endpoint sería separado o se migraría el hosting.

Para pocos apuntes, pasar solo el documento elegido. Considerar recuperación por búsqueda y fragmentos antes de una base vectorial. Los documentos se tratan como datos: sus instrucciones no deben controlar herramientas ni acceder a secretos. Las respuestas deben distinguir el contenido de los apuntes de conocimientos adicionales y decir cuando el contexto no basta.

Un modelo local podría evitar cobros de API, pero necesita recursos del equipo y un servicio local. No conectar la página pública a localhost ni asumir que cualquier computador puede ejecutarlo. La decisión requiere conocer hardware y preferencia de Walter. Mientras tanto, puede usar sus apuntes manualmente con las herramientas que ya tiene.

Los diagramas Mermaid cubren topologías y procesos sin generar imágenes de pago. La generación de ilustraciones sería otra integración futura, con proveedor, licencia de salida y presupuesto decididos antes de activarla.

## Área privada y sincronización

No se simula una zona privada escondiendo rutas. Añadirla exige autenticación y autorización reales. Una web pública puede seguir mostrando el blog mientras un servicio separado guarda borradores y progreso por usuario. Mantener exportación/importación como ruta de migración y recuperación.

## Datos que faltan solo para próximos pasos

- **Para subir el proyecto:** URL del repositorio elegido o usuario/organización, nombre y visibilidad deseada.
- **Para publicar gratis en Pages:** aceptar que el repositorio sea público y revisar contenido e historial.
- **Para IA:** preferencia local/remota, hardware si es local y presupuesto si es remota.

No hace falta ninguno de esos datos para usar el MVP local que ya está preparado. No se necesitan dominio, tarjeta bancaria ni claves de API para empezar.
