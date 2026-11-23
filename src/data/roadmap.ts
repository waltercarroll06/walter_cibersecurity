export const roadmap = [
  { id: 'redes', title: 'Entender las redes', category: 'Redes', description: 'La base para entender cómo se comunican los equipos.', tasks: [
    { id: 'net-types', title: 'Distinguir LAN, WAN y los dispositivos de red', evidence: 'Dibuja tu red local y explica cada dispositivo.' },
    { id: 'net-ip', title: 'Comprender IPv4, máscara y puerta de enlace', evidence: 'Identifica estos datos en tu equipo y descríbelos.' },
    { id: 'net-dns', title: 'Explicar DNS, DHCP y puertos', evidence: 'Documenta qué ocurre al abrir una página web.' },
    { id: 'net-tcp', title: 'Comparar TCP y UDP', evidence: 'Escribe un caso de uso de cada protocolo.' },
    { id: 'net-capture', title: 'Observar tráfico propio con Wireshark', evidence: 'Describe una consulta DNS en un laboratorio autorizado.' },
  ] },
  { id: 'windows', title: 'Conocer Windows por dentro', category: 'Windows', description: 'Aprender con el sistema que usas todos los días.', tasks: [
    { id: 'win-process', title: 'Explorar procesos y servicios', evidence: 'Documenta tres procesos y su función.' },
    { id: 'win-permissions', title: 'Entender usuarios, permisos y NTFS', evidence: 'Practica con archivos de prueba y una cuenta de laboratorio.' },
    { id: 'win-shell', title: 'Usar PowerShell para consultar el sistema', evidence: 'Guarda comandos de consulta y explica su salida.' },
    { id: 'win-events', title: 'Leer eventos en Event Viewer', evidence: 'Relaciona una acción propia con un evento y su hora.' },
  ] },
  { id: 'linux', title: 'Sentirse cómodo en Linux', category: 'Linux', description: 'Terminal, archivos y registros en una máquina de práctica.', tasks: [
    { id: 'linux-files', title: 'Navegar por archivos y directorios', evidence: 'Practica pwd, ls, cd y cat en tu laboratorio.' },
    { id: 'linux-users', title: 'Comprender usuarios y permisos', evidence: 'Explica los permisos de un archivo de prueba.' },
    { id: 'linux-process', title: 'Consultar procesos y servicios', evidence: 'Identifica un proceso y su servicio correspondiente.' },
    { id: 'linux-logs', title: 'Buscar información en registros', evidence: 'Encuentra un evento propio y documenta su contexto.' },
  ] },
  { id: 'dfir', title: 'Empezar a investigar', category: 'DFIR', description: 'Convertir observaciones en evidencia documentada.', tasks: [
    { id: 'dfir-custody', title: 'Comprender la cadena de custodia', evidence: 'Crea un registro con un archivo de práctica.' },
    { id: 'dfir-hash', title: 'Calcular y comparar hashes SHA-256', evidence: 'Compara un archivo original con una copia.' },
    { id: 'dfir-disk', title: 'Explorar una imagen forense de entrenamiento', evidence: 'Documenta origen, integridad, herramienta y hallazgos.' },
    { id: 'dfir-report', title: 'Redactar un primer informe reproducible', evidence: 'Incluye procedimiento, evidencias, límites y conclusión.' },
  ] },
];
