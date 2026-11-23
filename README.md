# Walter’s Digital Lab · Mi curso de redes

Cuaderno personal de Walter para **Conceptos básicos de redes v2.0 de Cisco Networking Academy**. El alcance actual es solo redes, en localhost. La IA aún no está conectada y la web no está publicada.

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

## Persistencia y respaldo

La checklist y los borradores viven en localStorage, separados por dirección de la web, ruta y módulo. No se sincronizan entre equipos, perfiles, navegadores o puertos. Borrar los datos del navegador puede eliminarlos: exporta la checklist y descarga tus apuntes periódicamente. Los archivos Markdown e imágenes del proyecto pueden respaldarse con Git.

`draft: true` excluye un apunte de la web generada y del buscador; no lo oculta en un repositorio público. Guarda datos privados fuera del repositorio o en la carpeta ignorada `private/`.

## Arquitectura y archivos

Astro estático + TypeScript + Markdown + CSS propio. No requiere servidor de aplicación, cuentas ni una base de datos. El servidor local de Astro permite trabajar y ver cambios.

| Archivo o carpeta | Función |
| --- | --- |
| `src/data/course.ts` | Fuente de los 17 módulos y 44 temas con objetivos e IDs estables |
| `src/pages/roadmap.astro` | Plan de estudio y controles de la checklist |
| `src/scripts/roadmap.ts` | Persistencia y respaldos de progreso |
| `src/lib/course-template.ts` | Plantilla de apuntes por módulo |
| `src/scripts/editor.ts` | Editor y borradores independientes |
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
- Elegir proveedor local o remoto antes de conectar la IA: extraer objetivos desde una foto, resumir apuntes y proponer diagramas editables. Estas funciones todavía no están activas.
- Publicar en GitHub Pages cuando Walter lo pida. Se conserva el workflow manual de publicación; no se ha ejecutado. No se necesita comprar un dominio para usar localhost.

La IA remota necesitaría un servicio protegido para guardar claves y controlar el gasto. No poner claves en Markdown, localStorage ni código que se entregue al navegador.
