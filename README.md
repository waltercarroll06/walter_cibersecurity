# Walter's Digital Lab

Un cuaderno personal para **aprender, investigar y documentar** redes, Windows, Linux y DFIR. Nombre provisional; se puede cambiar sin rehacer el proyecto.

Primera versión funcional, preparada para Windows, VS Code, Codex y GitHub. El repositorio local contiene el código; todavía no está conectado a un repositorio remoto ni publicado.

## Empezar en Windows

Necesitas Node.js compatible (`>=22.23.4`; recomendado Node 24 LTS) y Git. Abre **esta carpeta**, la que contiene `package.json`, en VS Code.

En su terminal de PowerShell:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abre la dirección local que aparezca en la terminal, normalmente `http://127.0.0.1:4321`. Mantén la terminal abierta mientras trabajas. Para detenerla, `Ctrl+C`. `npm.cmd` evita el bloqueo de `npm.ps1` en algunas configuraciones de PowerShell.

## Qué funciona

- Inicio, diario, laboratorios y páginas individuales.
- Markdown con encabezados, tablas, listas, código resaltado e imágenes locales.
- Editor en el navegador con vista previa, un borrador local y descarga/copia de Markdown.
- Búsqueda por título, contenido, etiquetas y tema, tolerante a tildes y mayúsculas.
- Roadmap con 17 habilidades, persistencia local, exportación e importación JSON.
- Temas claro y oscuro, diseño adaptable, navegación por teclado y etiquetas accesibles.
- Borradores excluidos del sitio generado y del buscador.
- Configuración para GitHub Pages, incluso bajo `/nombre-del-repositorio/`.

Se incluyen dos apuntes y un laboratorio **de ejemplo**, más un borrador para comprobar su exclusión. No representan actividades completadas por Walter. La checklist empieza vacía.

## Tu rutina diaria

1. Estudia y escribe un resumen con tus palabras.
2. Pulsa **Nuevo apunte**. Redacta, revisa y descarga el Markdown. También puedes copiar `templates/apunte.md` directamente.
3. Guarda el archivo en `src/content/notes/`. Para prácticas usa `src/content/labs/` y `templates/laboratorio.md`.
4. Añade capturas a `src/assets/`. Desde un apunte situado directamente en `notes/` o `labs/`, usa `![Descripción](../../assets/mi-captura.png)`.
5. Actualiza título, fecha, tema y etiquetas. Cambia `draft: true` a `draft: false` cuando quieras que aparezca en el sitio. Tus entradas reales usan `example: false`.
6. Guarda el archivo: el servidor local actualiza la web. Marca en el roadmap solo aquello que ya puedas explicar y practicar.
7. Revisa los cambios en Git y súbelos cuando el repositorio remoto esté conectado.

El editor no modifica el repositorio ni publica automáticamente. Su vista previa muestra imágenes HTTPS; las imágenes del proyecto se ven cuando colocas el Markdown y la imagen en sus carpetas. Cambiar el tipo de entrada no reemplaza el texto actual, para evitar perder trabajo.

### Formato de una entrada

```yaml
---
title: "Mi primera sesión de redes"
description: "Qué aprendí y qué voy a practicar."
date: 2026-11-23
category: Redes
tags: [cisco, DNS]
draft: false
example: false
source: "Nombre del curso, módulo y referencia"
---
```

Temas admitidos: `Redes`, `Windows`, `Linux`, `DFIR`. `source` es opcional. Si falta `draft`, la entrada se considera borrador. Los nombres de archivo crean las rutas: usa minúsculas, números y guiones.

## Dónde se guarda cada cosa

| Información | Lugar | Respaldo |
| --- | --- | --- |
| Apuntes y laboratorios publicados | Archivos Markdown del proyecto | Git y GitHub cuando lo conectes |
| Imágenes | `src/assets/` | Git y GitHub |
| Checklist | localStorage del navegador | Botón Exportar respaldo |
| Borrador del editor | localStorage del navegador, una entrada a la vez | Descargar Markdown |
| Preferencia de tema | localStorage | No requiere respaldo |

El progreso no viaja a GitHub ni se sincroniza entre equipos. Borrar datos del navegador, usar otro perfil o cambiar de dirección (por ejemplo, de localhost a GitHub Pages) crea un almacenamiento distinto. Exporta antes y luego importa el respaldo. Importar **reemplaza** las marcas actuales. Si cambia la ruta base de la web, también cambia su espacio de almacenamiento.

`draft: true` no vuelve privado un archivo que subas a un repositorio público. Guarda notas privadas fuera del repositorio; puedes usar la carpeta ignorada `private/`. La web no incluye un área privada autenticada. No publiques evidencias reales, datos personales ni material de cursos copiado; usa apuntes originales y referencias.

## Arquitectura

```text
Markdown + imágenes + datos del roadmap
                 |
           Astro + TypeScript
                 |
       HTML / CSS / JavaScript estáticos
                 |
     Navegador o GitHub Pages
          |              |
  búsqueda local     progreso local
```

Astro genera las páginas al construir el proyecto. El buscador descarga un índice estático y filtra en tu navegador. No hay servidor de aplicación, cuentas ni base de datos en esta versión. CSS propio evita añadir otra herramienta que mantener.

```text
src/
  content/notes/       Apuntes diarios en Markdown
  content/labs/        Laboratorios en Markdown
  assets/             Imágenes que Astro procesa
  data/roadmap.ts      Etapas e IDs estables de habilidades
  pages/              Páginas y rutas
  layouts/            Estructura y lectura de artículos
  components/         Elementos compartidos
  scripts/            Editor, búsqueda y checklist del navegador
  lib/                Lógica reutilizable
  styles/             Diseño
templates/            Plantillas para escribir desde VS Code
docs/PLAN.md          Decisiones, fases e integración futura de IA
tests/                Pruebas de datos y búsqueda
```

Para trabajar con Codex: abre esta carpeta como proyecto y pide un cambio pequeño y concreto, por ejemplo: «Añade un campo opcional de duración a los laboratorios y muéstralo en la página». `AGENTS.md` describe las convenciones.

## Verificar antes de publicar

```powershell
npm.cmd run verify
```

Esto comprueba tipos, pruebas, compilación y enlaces del resultado. También revisa que no se publique el borrador de ejemplo.

Para probar la ruta de un repositorio de GitHub Pages:

```powershell
$env:SITE_BASE = '/walters-digital-lab/'
npm.cmd run build
node scripts/check-build.mjs
Remove-Item Env:SITE_BASE
npm.cmd run build
```

`npm.cmd run preview` muestra el último resultado de producción. Los workflows se incluyen preparados; su ejecución remota solo se podrá verificar después de subir el repositorio.

## Conectar GitHub y publicar cuando estés listo

1. En GitHub crea un repositorio vacío, sin inicializar README ni `.gitignore`. Puedes mantenerlo privado mientras preparas tus notas.
2. En VS Code abre Control de código fuente y confirma los archivos. También puedes usar estos comandos si aún no existe un commit:

```powershell
git add .
git commit -m "Crear primera versión de Walter's Digital Lab"
```

3. Copia la URL real del repositorio. Sustituye el valor del ejemplo antes de ejecutar:

```powershell
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

Si Git pide nombre y correo, configura tus propios datos o tu dirección privada de GitHub; el proyecto no inventa una identidad por ti.

4. Para usar GitHub Pages con GitHub Free, el repositorio debe ser **público**. Revisa antes tanto los archivos como el historial. En GitHub, entra en **Settings → Pages → Source → GitHub Actions**.
5. En **Actions**, ejecuta **Publicar en GitHub Pages → Run workflow** sobre `main`. Solo este paso inicia la publicación. Los pushes normales ejecutan las comprobaciones, sin publicar.
6. El workflow muestra la dirección final. La configuración obtiene el usuario y el nombre del repositorio automáticamente. Para un dominio propio se necesitan ajustes adicionales; no hace falta comprar uno para empezar.

El coste previsto de este MVP es **0 en servicios recurrentes** usando tu equipo y GitHub Pages dentro de sus límites. No incluye dominio propio ni IA remota. Las condiciones pueden cambiar; revisa [disponibilidad y límites de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

## Qué viene después

1. **Uso real:** reemplazar ejemplos, añadir tus primeras entradas, probar el flujo diario y publicar si lo deseas.
2. **Aprendizaje:** diagramas Mermaid, tarjetas de repaso y mejoras del editor basadas en tu uso.
3. **IA contextual:** contrato de proveedor, selección explícita de contexto y respuestas con referencias. Proveedor local o servicio remoto con límites, según presupuesto y equipo.
4. **Sincronización opcional:** cuentas y base de datos solo cuando necesitar varios dispositivos lo justifique.

La web actual no llama a ninguna IA ni solicita claves. El plan técnico y los criterios de cada fase están en `docs/PLAN.md`.

## Referencias técnicas

- [Colecciones de contenido de Astro](https://docs.astro.build/en/guides/content-collections/)
- [Markdown e imágenes en Astro](https://docs.astro.build/en/guides/markdown-content/)
- [Astro en GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Planes de GitHub](https://docs.github.com/en/get-started/learning-about-github/githubs-plans)

Documentación consultada el 23 de noviembre de 2026.
