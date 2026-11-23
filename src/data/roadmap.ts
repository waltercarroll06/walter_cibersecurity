import { courseModules } from './course.ts';
export const roadmap = courseModules.map(module => ({ id: module.id, title: module.title, category: 'Redes', description: module.objective, tasks: module.topics.map(topic => ({id: topic.id, title: topic.title, evidence: topic.objective})) }));
