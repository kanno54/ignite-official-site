// Local-only fault injection. All successful responses use the actual approved audio bytes.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist'),seen=new Set();
http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
  if(pathname.includes('WB25-AUD03')&&!seen.has(pathname)) {
    seen.add(pathname);console.log('Injected one HTTP 503',pathname);res.writeHead(503,{'Content-Type':'text/plain'});res.end('Temporary network failure test');return;
  }
  if(pathname.includes('WB25-AUD02')&&!seen.has(pathname)) {
    seen.add(pathname);console.log('Injected one stalled request',pathname);setTimeout(()=>{res.writeHead(503);res.end();},25000);return;
  }
  const ext=path.extname(file),mime={'.mp3':'audio/mpeg','.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.json':'application/json'}[ext]||'application/octet-stream';
  const size=fs.statSync(file).size,range=/bytes=(\d+)-(\d*)/.exec(req.headers.range||'');
  if(range){const start=+range[1],end=range[2]?Math.min(+range[2],size-1):size-1;res.writeHead(206,{'Content-Type':mime,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1,'Accept-Ranges':'bytes'});fs.createReadStream(file,{start,end}).pipe(res);}
  else{res.writeHead(200,{'Content-Type':mime,'Content-Length':size});fs.createReadStream(file).pipe(res);}
}).listen(4174,'127.0.0.1',()=>console.log('Recovery test server http://127.0.0.1:4174 (local only)'));
