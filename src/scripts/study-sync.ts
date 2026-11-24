import {studyNotes} from '../lib/study-notes';
const source=document.querySelector<HTMLElement>('#study-sources');
if (source) {
  let previous: string | undefined;
  let running=false;
  let repeat=false;
  let timer: ReturnType<typeof setTimeout>;
  async function sync() {
    if(running){ repeat=true; return; }
    running=true;
    try {
      const notes=studyNotes(localStorage,import.meta.env.BASE_URL,JSON.parse(source!.dataset.notes ?? '[]'));
      const payload=JSON.stringify(notes);
      if(payload===previous) return;
      const response=await fetch('/__study-notes',{method:'POST',headers:{'Content-Type':'application/json','X-Walter-Lab':'local'},body:payload});
      if(!response.ok) throw new Error();
      const {profileId}=await response.json();
      previous=payload;
      document.documentElement.dataset.studyProfile=profileId;
      document.dispatchEvent(new Event('study-profile-ready'));
    } catch { document.documentElement.dataset.studyProfile='error'; document.dispatchEvent(new Event('study-profile-ready')); }
    finally {running=false;if(repeat){repeat=false;void sync();}}
  }
  function schedule(){clearTimeout(timer);timer=setTimeout(sync,700);}
  document.addEventListener('study-note-saved',schedule);
  window.addEventListener('storage',schedule);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(timer);void sync();}});
  window.addEventListener('focus',sync);
  setInterval(sync,60_000);
  void sync();
}
