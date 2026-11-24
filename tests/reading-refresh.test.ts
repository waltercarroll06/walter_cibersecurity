import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {Readable} from 'node:stream';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import type {ViteDevServer} from 'vite';
import {dailyReader} from '../src/server/daily-reading.ts';

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
    assert(['router','networking'].includes(url.searchParams.get('search') ?? ''));
    searches++;
    const posts=newsAvailable?[{title:{rendered:'Routers'},excerpt:{rendered:'El fabricante ha actualizado sus routers.'},date_gmt:new Date(Date.now()-3600000).toISOString().slice(0,19),link:url.origin+'/routers/'}]:[];
    return Response.json(posts);
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
    return async(path:string,method='GET',body?:unknown)=>{
      const req=Object.assign(Readable.from(body?[Buffer.from(JSON.stringify(body))]:[]),{method,url:path,headers:{host:'localhost',origin:'http://localhost','x-walter-lab':'local','content-type':'application/json'},socket:{remoteAddress:'127.0.0.1'}});
      let status=0,result;
      await handle(req,{writeHead(code:number){status=code;},end(json:string){result=JSON.parse(json);}},()=>assert.fail('ruta inesperada'));
      return {status,data:result as unknown as {profileId:string;used:boolean;item:{url:string};empty:boolean}};
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
  const [left,right]=await Promise.all([request(first,'POST'),request(first,'POST')]);
  assert([left,right].some(r=>r.data.used));
  const total=searches;
  const revised=url((await put('Otra duda sobre routers.')).data.profileId);
  const result=await open()(revised,'POST');
  assert.equal(result.data.used,true);
  assert.match(result.data.item.url,/\/routers\/$/);
  assert.equal(searches,total);
});
