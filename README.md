# Walter’s Digital Lab · Mi curso de redes

Cuaderno personal de Walter para **Conceptos básicos de redes v2.0 de Cisco Networking Academy**. El alcance actual es solo redes, en localhost, con tutor IA local opcional. La web no está publicada.

## Abrir en Windows

Abre esta carpeta en VS Code. Necesitas Node.js compatible (>=22.23.4).

```powershell
npm.cmd ci
npm.cmd run dev
```

Abre la dirección que muestra la terminal, normalmente http://127.0.0.1:4321/. La terminal mantiene activo el servidor local. Al cerrarla se detiene la vista previa, pero tus archivos permanecen. Reinicia el comando para volver a verla.

## Plan de estudio

El plan contiene **17 módulos y 44 temas**, organizados a partir de las capturas proporcionadas por Walter. Se conservan el orden, los nombres y los objetivos con pequeños ajustes de redacción. La captura repetida del módulo 6 se incluyó una sola vez. No se incluyen exámenes, encuestas, introducciones ni resúmenes del curso como tareas adicionales.

- Abre **Plan de estudio** y despliega un módulo.
- Consulta el objetivo general y el objetivo de cada tema.
- Marca temas individuales o usa **Marcar todo el módulo**.
- Los contadores muestran temas completados y módulos con todos sus temas marcados.
- Las marcas empiezan vacías. El avance es personal y no se sincroniza con Cisco.
- Usa **Exportar respaldo** para guardar tu checklist. Importar reemplaza las marcas actuales.

El progreso de este curso utiliza una clave distinta del antiguo roadmap general. El almacenamiento anterior no se elimina ni se interpreta como avance de Cisco.

## Apuntes por módulo

1. En el plan, pulsa **Mis apuntes del módulo**.
2. El editor prepara título, objetivo general, lista de objetivos y apartados numerados por tema.
3. Escribe debajo de **Mis apuntes** y añade ejemplos con tus palabras, dudas y tu resumen personal.
4. Cambia de módulo con el selector: cada módulo tiene un borrador independiente. También existe **Apunte libre de redes**, que conserva el borrador general anterior.
5. Usa **Descargar Markdown** para conservar una copia fuera del navegador.

Los borradores se guardan al escribir. No sobrescribimos un borrador existente con la plantilla. Los apuntes no aparecen automáticamente en el diario: para añadirlos, guarda el Markdown en `src/content/notes/` y cambia `draft: true` a `draft: false` cuando quieras mostrarlo. El contenido publicado se limita actualmente a Redes.

### Imágenes

Coloca capturas en `src/assets/` e inclúyelas en un apunte con:

```markdown
![Descripción de la captura](../../assets/mi-captura.png)
```

Las imágenes del proyecto se muestran cuando el archivo está incorporado al proyecto. El editor muestra una indicación para imágenes locales; admite imágenes HTTPS en su vista previa. Revisa que las capturas no contengan datos personales antes de publicarlas.

## Tutor IA local

Usa [Ollama para Windows](https://docs.ollama.com/windows) y el modelo multimodal [gemma3:12b](https://ollama.com/library/gemma3:12b). No requiere una clave de API ni pagos por consulta. La instalación y la descarga del modelo requieren Internet; las consultas se procesan localmente, consumiendo memoria y energía de tu equipo.

Preparación una sola vez: instala Ollama desde su sitio oficial y descarga el modelo en una terminal nueva:

```powershell
ollama pull gemma3:12b
```

Para usarlo cada día:

1. Abre Ollama y ejecuta `npm.cmd run dev` en el proyecto. Si la web estaba abierta antes de añadir la integración, reinicia ese comando.
2. Abre los apuntes de un módulo. Debajo del editor aparece **Tutor IA local** y el estado de conexión.
3. Selecciona una captura (PNG, JPEG o WebP, hasta 5 MB) y pulsa **Leer objetivos de la foto**, o escribe tus notas y pulsa **Resumir mis apuntes**.
4. Revisa y edita la respuesta. **Añadir al final de mis apuntes** la incorpora sin sustituir tus notas; **Descargar respuesta** la guarda por separado.

La IA puede leer mal una captura o equivocarse: comprueba los objetivos antes de guardarlos. Solo recibe la captura seleccionada o los apuntes del editor actual (máximo 18.000 caracteres), no los demás borradores. Una captura solo se envía al pulsar el botón. Las respuestas pendientes de añadir no se conservan al cambiar de página. No genera imágenes: los diagramas quedan para más adelante.

La primera consulta tarda más mientras se carga el modelo. Puedes cancelarla. Si falta conexión, abre Ollama y pulsa **Comprobar conexión**; si falta el modelo, repite el comando de descarga. La web sigue funcionando para escribir sin IA.

Esta integración existe únicamente en el servidor de desarrollo local. `npm.cmd run preview` y GitHub Pages muestran el tutor como no disponible. No se expone Ollama ni la web a la red. El servidor consulta una dirección local fija y rechaza solicitudes de otros sitios.

## Persistencia y respaldo

La checklist y los borradores viven en localStorage, separados por dirección de la web, ruta y módulo. No se sincronizan entre equipos, perfiles, navegadores o puertos. Borrar los datos del navegador puede eliminarlos: exporta la checklist y descarga tus apuntes periódicamente. Los archivos Markdown e imágenes del proyecto pueden respaldarse con Git.

`draft: true` excluye un apunte de la web generada y del buscador; no lo oculta en un repositorio público. Guarda datos privados fuera del repositorio o en la carpeta ignorada `private/`.

## Arquitectura y archivos

Astro estático + TypeScript + Markdown + CSS propio. No requiere cuentas ni una base de datos. El servidor local de Astro permite trabajar, ver cambios y consultar Ollama mediante dos rutas locales; la compilación publicada sigue siendo estática.

| Archivo o carpeta | Función |
| --- | --- |
| `src/data/course.ts` | Fuente de los 17 módulos y 44 temas con objetivos e IDs estables |
| `src/pages/roadmap.astro` | Plan de estudio y controles de la checklist |
| `src/scripts/roadmap.ts` | Persistencia y respaldos de progreso |
| `src/lib/course-template.ts` | Plantilla de apuntes por módulo |
| `src/scripts/editor.ts` | Editor y borradores independientes |
| `src/server/local-ai.ts` | Conexión local con Ollama, límites y validación |
| `src/components/LocalTutor.astro` | Interfaz del tutor dentro del editor |
| `src/scripts/local-tutor.ts` | Captura, resumen, revisión y adición a los apuntes |
| `src/content/notes/` | Apuntes del diario |
| `src/assets/` | Imágenes |
| `AGENTS.md` | Convenciones para trabajar con Codex |

Los archivos antiguos de otras áreas permanecen en el proyecto para no perder trabajo, pero sus entradas no se publican ni aparecen en la navegación. El plan de estudio usa únicamente los módulos de Cisco.

## Comprobar cambios

```powershell
npm.cmd run verify
```

Incluye comprobación de tipos, pruebas de datos, búsqueda y plantillas, compilación y revisión de enlaces e imágenes. Para comprobar un prefijo de publicación:

```powershell
$env:SITE_BASE = '/walters-digital-lab/'
npm.cmd run build
node scripts/check-build.mjs
Remove-Item Env:SITE_BASE
npm.cmd run build
```

## Próximos pasos

- Utilizar el módulo 1 y ajustar el flujo según la experiencia real.
- Probar el tutor local durante el estudio y, más adelante, añadir diagramas editables de redes.
- Publicar en GitHub Pages cuando Walter lo pida. Se conserva el workflow manual de publicación; no se ha ejecutado. No se necesita comprar un dominio para usar localhost.

La IA remota necesitaría un servicio protegido para guardar claves y controlar el gasto. No poner claves en Markdown, localStorage ni código que se entregue al navegador.
