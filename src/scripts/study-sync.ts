import { studyNotes } from '../lib/study-notes';

const source=document.querySelector<HTMLElement>('#study-sources');
let previous:string|undefined;
let queue:Promise<void>=Promise.resolve();
export function syncStudyNotes(force=false) {
  if(!source) return Promise.resolve();
  queue=queue.then(async()=>{
    try {
      const notes=studyNotes(localStorage,import.meta.env.BASE_URL,JSON.parse(source.dataset.notes ?? '[]'));
      const payload=JSON.stringify(notes);
      if(payload===previous && !force)return;
      const response=await fetch('/__study-notes',{method:'POST',headers:{'Content-Type':'application/json','X-Walter-Lab':'local'},body:payload});
      if(!response.ok)throw new Error();
      const {profileId}=await response.json();
      previous=payload;
      if(document.documentElement.dataset.studyProfile!==profileId){
        document.documentElement.dataset.studyProfile=profileId;
        document.dispatchEvent(new Event('study-profile-ready'));
      }
    }catch{
      previous=undefined;
      document.documentElement.dataset.studyProfile='error';
      document.dispatchEvent(new Event('study-profile-ready'));
    }
  });
  return queue;
}
if(source){
  let timer:ReturnType<typeof setTimeout>;
  function schedule(){clearTimeout(timer);timer=setTimeout(()=>void syncStudyNotes(),700);}
  document.addEventListener('study-note-saved',schedule);
  window.addEventListener('storage',schedule);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(timer);void syncStudyNotes();}});
  window.addEventListener('focus',()=>void syncStudyNotes());
  setInterval(()=>void syncStudyNotes(),60000);
  void syncStudyNotes();
}
