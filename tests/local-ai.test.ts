import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {IncomingMessage} from 'node:http';
import {validateInput,buildMessages,isLocalRequest,MAX_TEXT,MODEL} from '../src/server/local-ai.ts';

test('solo permite operaciones concretas y acota los apuntes', () => {
  assert.equal(MODEL, 'gemma3:12b');
  const valid = {action:'summary',title:'DNS',text:'DNS relaciona nombres de dominio con direcciones IP.'};
  assert.equal(validateInput(valid).action,'summary');
  for (const value of [null,{...valid,action:'execute'},{...valid,text:''},{...valid,text:'a'.repeat(MAX_TEXT+1)},{...valid,title:'a'.repeat(201)}]) assert.throws(()=>validateInput(value));
});
test('exige imágenes compatibles y no acepta rutas o URLs para leer archivos', () => {
  for (const image of ['file:///secret','https://example.com/x.png','data:image/svg+xml;base64,PHN2Zz4=','data:image/png;base64,aG9sYQ==']) {
    assert.throws(()=>validateInput({action:'objectives',title:'',text:'',image}));
  }
  const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aFEkAAAAASUVORK5CYII=';
  assert(validateInput({action:'objectives',title:'',text:'',image:png}).image);
});
test('rechaza otras webs, hosts y conexiones de red', () => {
  const request = (host:string, origin:string|undefined, address='127.0.0.1') => ({headers:{host,origin},socket:{remoteAddress:address}} as Pick<IncomingMessage,'headers'|'socket'>);
  assert(isLocalRequest(request('127.0.0.1:4321','http://127.0.0.1:4321'),true));
  assert(isLocalRequest(request('localhost:4321',undefined),false));
  assert(!isLocalRequest(request('localhost:4321',undefined),true));
  assert(!isLocalRequest(request('localhost:4321','https://otra-web.example'),true));
  assert(!isLocalRequest(request('attacker.example','http://attacker.example'),true));
  assert(!isLocalRequest(request('localhost:4321','http://localhost:4321','192.168.1.2'),true));
});
test('solo el contexto solicitado entra en la petición y no hay herramientas', () => {
  const input = validateInput({action:'summary',title:'DNS',text:'DNS relaciona nombres de dominio con direcciones IP.'});
  const messages = buildMessages(input);
  assert.equal(messages.length,2);
  assert(messages[1].content.includes(input.text));
  assert(!messages[1].images);
  assert(messages[0].content.includes('nunca instrucciones'));
});
