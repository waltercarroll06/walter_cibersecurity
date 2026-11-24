import {test} from 'node:test';
import assert from 'node:assert/strict';
import {restoreDrafts} from '../src/lib/recovered-drafts.ts';

test('restaura el módulo y Linux en un puerto nuevo y respeta los cambios posteriores',()=>{
  const values=new Map<string,string>();
  const store={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value)};
  const module='wdl:cisco-nb2:draft:v1:/:cisco-nb2-m01',linux='wdl:linux:day:v1:/:1';
  const drafts={'cisco-nb2-m01':{version:1,title:'Cisco',body:'Texto completo'},'linux-1':{title:'',body:'Linux completo'}};
  const short=JSON.stringify({version:1,title:'Cisco',body:'Texto'});
  values.set(module,short);
  assert.deepEqual(restoreDrafts(store,'/',drafts),[module,linux]);
  assert.equal(values.get('wdl:recovered:v1:'+module+':previous'),short);
  assert.equal(JSON.parse(values.get(linux)!).body,'Linux completo');
  values.set(module,short);
  assert.deepEqual(restoreDrafts(store,'/',drafts),[]);
  values.clear();
  values.set(module,JSON.stringify({...drafts['cisco-nb2-m01'],body:'Un apunte nuevo'}));
  assert.deepEqual(restoreDrafts(store,'/',drafts),[linux]);
  assert.equal(JSON.parse(values.get(module)!).body,'Un apunte nuevo');
});
