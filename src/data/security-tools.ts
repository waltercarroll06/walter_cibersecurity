export const networkTools = [
  {
    "name": "Nmap",
    "use": "Muestra qué equipos y servicios se ven desde tu red.",
    "title": "Inventario de casa",
    "example": "Esperas encontrar una impresora y dos computadores. El inventario muestra otro equipo. Comparas su dirección con la lista del router antes de decidir de quién es.",
    "url": "https://nmap.org/"
  },
  {
    "name": "Microsoft Defender Antivirus",
    "use": "Revisa archivos y te avisa cuando detecta posibles amenazas en Windows.",
    "title": "Un archivo en cuarentena",
    "example": "Windows avisa después de una descarga. En el historial ves el nombre del archivo, la hora y la acción tomada. «En cuarentena» indica que Defender lo ha aislado.",
    "url": "https://learn.microsoft.com/en-us/defender-endpoint/microsoft-defender-antivirus-windows"
  },
  {
    "name": "Wireshark",
    "use": "Permite ver los pequeños envíos de datos que entran o salen por una conexión.",
    "title": "¿Quién respondió?",
    "example": "En una captura de práctica, tu computador pregunta por la dirección de una página. Busca la pregunta y la respuesta. Sus horas te permiten medir cuánto tardó esa consulta.",
    "url": "https://www.wireshark.org/docs/wsug_html_chunked/ChUseMainWindowSection.html"
  },
  {
    "name": "Zeek",
    "use": "Escribe un registro de quién se comunicó con quién en una red.",
    "title": "Reconstruir una conexión",
    "example": "A las 10:05 un portátil contactó con un servidor. En el registro de conexiones puedes leer las dos direcciones y la duración. Eso te permite situar el contacto en el tiempo.",
    "url": "https://docs.zeek.org/en/current/about/index.html"
  },
  {
    "name": "Suricata",
    "use": "Vigila el tráfico de red y avisa cuando coincide con una regla.",
    "title": "Entender una alerta",
    "example": "Una regla reconoce un patrón en una conexión y genera un aviso. Lees la hora y los equipos implicados para elegir qué conexión revisar primero.",
    "url": "https://suricata.io/features/"
  },
  {
    "name": "Wazuh",
    "use": "Reúne avisos de varios equipos para revisarlos en un solo lugar.",
    "title": "Revisar intentos de acceso",
    "example": "Un equipo registra cinco intentos fallidos. En el panel compruebas si corresponden a la misma cuenta y si después hubo un acceso correcto. Esa secuencia ayuda a decidir qué investigar.",
    "url": "https://documentation.wazuh.com/current/getting-started/index.html"
  },
  {
    "name": "strace",
    "use": "Muestra lo que un programa le pide a Linux mientras funciona.",
    "title": "Encontrar un archivo que falta",
    "example": "Una aplicación se cierra al abrirse. En su registro de llamadas ves qué archivo intentó leer y que la ruta no existía. Ya sabes dónde empezar a revisar.",
    "url": "https://strace.io/"
  }
];
export const forensicTools = [
  {
    "name": "FTK Imager",
    "use": "Hace una copia de un disco o memoria USB para que puedas examinarla.",
    "title": "Conservar una USB",
    "example": "Registras qué memoria recibiste y haces una imagen. Conservas el valor de verificación, una huella digital de los datos. Más tarde puedes comparar esa huella para comprobar si la copia cambió.",
    "url": "https://www.exterro.com/digital-forensics-software/ftk-imager"
  },
  {
    "name": "Autopsy",
    "use": "Te ayuda a buscar archivos y reconstruir actividad dentro de una copia de un disco.",
    "title": "Seguir la pista de un documento",
    "example": "Abres una imagen de práctica y buscas un PDF. Anotas su carpeta y su fecha de modificación. Después comparas esa hora con otros archivos para reconstruir lo que pasó.",
    "url": "https://www.autopsy.com/"
  },
  {
    "name": "Volatility 3",
    "use": "Examina una copia de la memoria RAM para ver qué estaba activo al tomarla.",
    "title": "Ver qué programas estaban abiertos",
    "example": "Un analista recibe una captura de memoria. Consulta los procesos que aparecen y cuál inició a cuál. Esa información describe el instante de la captura.",
    "url": "https://volatility3.readthedocs.io/en/latest/"
  },
  {
    "name": "ExifTool",
    "use": "Lee datos que un archivo guarda sobre sí mismo, como la fecha de una foto.",
    "title": "Leer las propiedades de una foto",
    "example": "Abres una foto de práctica y encuentras una fecha y un modelo de cámara. Son pistas sobre la imagen. Para saber quién tomó la foto necesitarías más evidencia.",
    "url": "https://metacpan.org/pod/Image::ExifTool"
  }
];
export const glossary = [
  {
    "name": "Sandboxing",
    "use": "Ejecutar un programa dentro de un espacio con permisos limitados.",
    "title": "Un editor con una sola carpeta",
    "example": "A un editor de prueba solo le permites leer la carpeta Práctica. Puede abrir el archivo de esa carpeta. Cuando pide un archivo fuera de ella, el sistema le deniega el acceso.",
    "url": "https://csrc.nist.gov/glossary/term/sandbox"
  },
  {
    "name": "Virtualización",
    "use": "Crear una computadora virtual dentro de otra computadora.",
    "title": "Dos sistemas en un mismo PC",
    "example": "VirtualBox asigna parte de la memoria de tu PC a una máquina virtual. Dentro de ella puedes iniciar otro sistema operativo y abrir sus propios programas.",
    "url": "https://www.virtualbox.org/manual/ch01.html"
  },
  {
    "name": "Contenedores",
    "use": "Ejecutar una aplicación con sus archivos y dependencias en un espacio aislado.",
    "title": "Dos aplicaciones con requisitos distintos",
    "example": "Una aplicación usa una versión de Python y otra necesita una diferente. Cada contenedor lleva su versión y ambas aplicaciones comparten el núcleo del sistema anfitrión.",
    "url": "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/"
  },
  {
    "name": "Principio de mínimo privilegio",
    "use": "Dar solo los permisos que hacen falta para una tarea.",
    "title": "Consultar una lista de pedidos",
    "example": "Una persona necesita leer pedidos. Le das permiso de lectura. Puede consultarlos y el sistema impide que los borre por accidente.",
    "url": "https://csrc.nist.gov/glossary/term/least_privilege"
  },
  {
    "name": "Snapshot",
    "use": "Instantánea que permite volver al estado que guardaste de una máquina virtual.",
    "title": "Volver al punto de partida",
    "example": "Antes de cambiar una configuración creas una instantánea. Si restauras ese punto, la configuración y el disco virtual incluido vuelven al estado guardado. Los cambios posteriores en ese disco se pierden.",
    "url": "https://www.virtualbox.org/manual/ch01.html#snapshots"
  },
  {
    "name": "Segmentación de red",
    "use": "Dividir una red en partes y poner reglas para controlar qué puede comunicarse entre ellas.",
    "title": "Wi-Fi para invitados",
    "example": "En una oficina los visitantes tienen acceso a Internet. Una regla impide que su red llegue al servidor de nómina. Puedes ofrecer conexión a los visitantes y mantener ese servidor separado.",
    "url": "https://www.cisa.gov/resources-tools/resources/layering-network-security-through-segmentation"
  },
  {
    "name": "Sandbox escape",
    "use": "Fallo que permite a un programa salir de los límites de su entorno aislado.",
    "title": "Reconocer un límite roto",
    "example": "Imagina que una aplicación aislada solo puede leer una carpeta de prueba. Si un fallo le permite acceder a un archivo que estaba fuera de su alcance, el aislamiento ha fallado. Un aviso de seguridad del fabricante puede indicar qué versión corrige ese fallo.",
    "url": "https://cwe.mitre.org/data/definitions/693.html"
  }
];
