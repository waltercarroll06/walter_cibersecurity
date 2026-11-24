import {courseModules} from '../data/course.ts';
import {moduleTemplate} from './course-template.ts';

export function restoreDrafts(storage:Pick<Storage,'getItem'|'setItem'>,base:string,drafts:Record<string,{title:string;body:string;version?:number}>) {
  const restored:string[]=[];
  const module=courseModules[0];
  for(const [name,draft] of Object.entries(drafts)){
    const linux=name==='linux-1';
    if(!linux && name!==module.id)continue;
    if(typeof draft?.body!=='string' || !draft.body.trim() || typeof draft.title!=='string' || (!linux && draft.version!==1))continue;
    const key=linux?'wdl:linux:day:v1:'+base+':1':'wdl:cisco-nb2:draft:v1:'+base+':'+module.id;
    const marker='wdl:recovered:v1:'+key;
    if(storage.getItem(marker))continue;
    const raw=storage.getItem(key);
    if(raw!==null){
      let old;
      try{old=JSON.parse(raw);}catch{continue;}
      if(typeof old?.body!=='string')continue;
      if(old.body===draft.body){storage.setItem(marker,'1');continue;}
      const template=!linux && old.body===moduleTemplate(module);
      if(!template && !draft.body.startsWith(old.body))continue;
      if(old.title?.trim() && old.title!==draft.title)continue;
      // Retain the prior draft and its metadata when upgrading an older prefix.
      storage.setItem(marker+':previous',raw);
    }
    storage.setItem(key,JSON.stringify(draft));
    storage.setItem(marker,'1');
    restored.push(key);
  }
  return restored;
}
