import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {Readable} from 'node:stream';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import type {ViteDevServer} from 'vite';
import {beginnerSource,dailyReader} from '../src/server/daily-reading.ts';

test('la recarga usa los apuntes vigentes y conserva el cupo ante errores, cambios de pestaña y reinicios',async t=>{
  const root=await mkdtemp(join(tmpdir(),'walter-reading-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  let searches=0;
  let newsAvailable=false;
  t.mock.method(globalThis,'fetch',async(input:URL|string,init?:RequestInit)=>{
    const url=new URL(input);
    if(url.hostname==='127.0.0.1'){
      const {messages}=JSON.parse(String(init?.body));
      const data=JSON.parse(messages[1].content);
      const answer=Array.isArray(data)
        ? {topic:'Routers',evidence:'El modelo parafraseó el texto en vez de citarlo'}
        : {index:0,title:'Routers actualizados',summary:'Se actualizó el router.',practice:'Relaciona la noticia con tu esquema.'};
      return Response.json({message:{content:JSON.stringify(answer)}});
    }
    if(url.hostname==='hn.algolia.com'){
      assert(['router','networking'].includes(url.searchParams.get('query') ?? ''));
      searches++;
      const hits=newsAvailable?[{title:'Router updates',story_text:'Nuevas funciones de routers',objectID:'12345',created_at:new Date(Date.now()-3600000).toISOString()}]:[];
      return Response.json({hits});
    }
    return new Response(null,{status:403});
  });
  function open(){
    const close=new EventEmitter();
    t.after(()=>{close.emit('close');});
    type Handler=(req:unknown,res:unknown,next:()=>void)=>Promise<void>;
    let handle:Handler;
    const plugin=dailyReader();
    assert.equal(typeof plugin.configureServer,'function');
    if(typeof plugin.configureServer==='function') Reflect.apply(plugin.configureServer,plugin,[{
      config:{root,logger:{warn(){}}},httpServer:close,middlewares:{use(fn:Handler){handle=fn;}}
    } as unknown as ViteDevServer]);
    return async(path:string,method='GET',body?:unknown,background=false)=>{
      const req=Object.assign(Readable.from(body?[Buffer.from(JSON.stringify(body))]:[]),{method,url:path,headers:{prefer:background?'respond-async':'',host:'localhost',origin:'http://localhost','x-walter-lab':'local','content-type':'application/json'},socket:{remoteAddress:'127.0.0.1'}});
      let status=0,result;
      await handle(req,{writeHead(code:number){status=code;},end(json:string){result=JSON.parse(json);}},()=>assert.fail('ruta inesperada'));
      return {status,data:result as unknown as {profileId:string;remaining:number;pending:boolean;used:boolean;item:{url:string};empty:boolean}};
    };
  }
  const request=open();
  const put=(text:string)=>request('/__study-notes','POST',text?[{label:'Cisco',text}]:[]);
  const url=(profileId:string)=>'/__daily-reading?profile='+profileId;
  assert((await request(url((await put('')).data.profileId),'POST')).data.empty);
  const first=url((await put('Un router conecta redes privadas.')).data.profileId);
  assert.equal((await request(first)).data.used,false);
  assert.equal(searches,0);
  assert.equal((await request(first,'POST')).status,503);
  assert.equal((await request(first)).data.used,false);
  newsAvailable=true;
  const start=await request(first,'POST',undefined,true);
  assert.equal(start.status,202);
  assert.equal(start.data.pending,true);
  let state=await request(first);
  for(let i=0;state.data.pending && i<100;i++){
    await new Promise(resolve=>setTimeout(resolve,5));state=await request(first);
  }
  assert.equal(state.data.remaining,1);
  const other=await request('/__study-notes','POST',[{label:'Linux · día 1',text:'Hoy utilicé echo para mostrar un saludo.'}]);
  const revised=url(other.data.profileId);
  const result=await open()(revised,'POST');
  assert.equal(result.data.remaining,0);
  assert.equal(result.data.used,true);
  assert.match(result.data.item.url,/gnu\.org/);
  const total=searches;
  const again=await open()(revised,'POST');
  assert.equal(again.data.item.url,result.data.item.url);
  assert.equal(searches,total);
});

test('una noticia de routers no exige protocolos ni utilidades ajenos al apunte',()=>{
  const note='Un router conecta dos redes.';
  assert(!beginnerSource('Cloud Router BGP flaps','Diagnóstico con gcloud y jq',note));
  assert(beginnerSource('Cómo funciona un router de casa','Dos equipos conectados a internet',note));
});
