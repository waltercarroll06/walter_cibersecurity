> Alcance actual: redes y apuntes de Cisco, más una bitácora local de Linux por día de estudio. Checklist de Cisco con 17 módulos y 44 temas. Tutor local con Ollama y gemma3:12b para extraer objetivos y resumir apuntes. Diagramas pendientes.

# Walter's Digital Lab — guía para Codex

## Propósito

Blog y cuaderno personal de Walter para redes, Cisco y Linux. La prioridad es ayudarle a estudiar y documentar; mantener una web pequeña, comprensible y extensible. Interfaz y documentación en español.

## Arquitectura y límites

- Astro estático, TypeScript estricto y CSS propio. Usa Markdown en `src/content/notes` y `src/content/labs`.
- No añadir React, otra capa de estilos, cuentas, base de datos o servicios de pago sin una necesidad concreta aceptada por el usuario.
- La IA funciona solo en desarrollo: middleware de Vite hacia Ollama en 127.0.0.1:11434. Mantener validación de origen, límites y modelo local fijo; no exponer a la LAN. Mermaid y generación de imágenes aún no están implementados. No presentar botones simulados como funciones activas.
- `draft: true` queda fuera del HTML y del índice de búsqueda; NO es una protección de privacidad para archivos de un repositorio público.
- No incorporar apuntes privados, secretos, credenciales o evidencias reales. `private/` está ignorado por Git y fuera de los loaders.
- Progreso y borradores se guardan solo en el navegador. Cualquier sincronización futura requiere una migración explícita del formato versionado.

## Convenciones

- Usa `withBase()` para enlaces, imágenes públicas y peticiones; la web debe funcionar en `/` y en `/nombre-repo/`.
- Consulta contenido público con `published()` para aplicar el filtro de borradores en un solo lugar.
- Conserva los identificadores de habilidades ya existentes; cambiar un ID pierde su asociación con el progreso guardado.
- Etiqueta ejemplos como `example: true`. No inventar cursos completados, resultados de laboratorios o estadísticas de Walter.
- Contenido Markdown local es contenido confiable del autor. La vista previa del editor debe sanitizar HTML antes de insertarlo.
- CSS accesible, responsive, foco visible, formularios con etiquetas y mensajes de error comprensibles. Evita dependencias visuales externas.
- No poner claves de API en variables `PUBLIC_*`, código cliente, Markdown ni localStorage. Un futuro proveedor remoto se invoca desde un servidor protegido.

## Comandos

En PowerShell, `npm.cmd` evita problemas con la política de scripts de `npm.ps1`.

```text
npm.cmd ci
npm.cmd run dev
npm.cmd run verify
```

Después de modificar rutas o recursos, comprueba también una compilación con `SITE_BASE=/walters-digital-lab/`. En PowerShell establece `$env:SITE_BASE`, compila y ejecuta `node scripts/check-build.mjs`; después elimina esa variable y recompila normalmente.

Las pruebas cubren importación de respaldos y búsqueda; el verificador del build revisa enlaces, imágenes y borradores. Para cambios visuales o de interacción, inspecciona el navegador en escritorio y móvil y verifica las funciones afectadas. No crees pruebas que solo repitan estilos o texto de componentes.

## Entrega

Explica en español qué cambió, cómo se verificó y qué queda pendiente. Actualiza README cuando cambie el uso. Mantén publicación y costos acordes con el alcance pedido. La publicación en Pages se inicia manualmente desde Actions; no subir ni publicar contenido privado por defecto.

## Curso de Cisco

- `src/data/course.ts` es la fuente de módulos, temas y objetivos extraídos de las capturas de Walter. No añadir exámenes ni encuestas.
- Conservar IDs `cisco-nb2-*` y las claves de almacenamiento por curso y módulo. No sobrescribir borradores previos al aplicar plantillas.
- Los porcentajes de las capturas no se importan como avance personal.
- No añadir otros cursos o áreas a la interfaz sin petición del usuario.
- El tutor solo recibe el texto o imagen elegidos. La respuesta se revisa antes de añadirla; nunca reemplazar automáticamente los apuntes. No enviar otros borradores ni introducir servicios remotos sin solicitud del usuario.
