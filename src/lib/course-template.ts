import { courseModules } from '../data/course.ts';
export function moduleTemplate(module: typeof courseModules[number]) {
  return `## Módulo ${module.number}: ${module.title}\n\n## Objetivo del módulo\n\n${module.objective}\n\n## Qué voy a aprender\n\n${module.topics.map(topic => `- **${topic.title}:** ${topic.objective}`).join('\n')}\n\n${module.topics.map(topic => `## ${topic.number} ${topic.title}\n\n**Objetivo:** ${topic.objective}\n\n### Mis apuntes\n\n\n### Un ejemplo con mis palabras\n\n`).join('\n')}\n## Dudas pendientes\n\n- \n\n## Mi resumen personal\n\n\n## Próxima sesión\n\n`;
}
