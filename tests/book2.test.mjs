import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as story from '../book2.js';
const {book2,book2Choices,advanceBook2,book2Scene,book2Ending,rankLove,loveKeys,loveNames} = story;
const fresh = () => ({stats:{},kitchenPair:[],partyVisited:[],history:[],finalMan:null});
function choose(id,index,state) {
 const n=book2.nodes[id];
 assert(book2Choices(n,state).some(([,i])=>i===index),`${id}: hidden choice ${index}`);
 const c=n.choices[index];
 for(const [k,v] of Object.entries(c[2])) state.stats[k]=(state.stats[k]||0)+v;
 return advanceBook2(n,c,state);
}
const permutations = xs => xs.length ? xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>i!==j)).map(rest=>[x,...rest])) : [[]];

test('every authored choice resolves to a scene or the final ending',()=>{
 for(const [id,n] of Object.entries(book2.nodes)) {
  assert(n.choices.length,`${id} must not strand the reader`);
  for(const c of n.choices) assert(c[1]==='bend'||book2.nodes[c[1]],`${id} -> ${c[1]}`);
 }
});
test('each kitchen pair limits only the kitchen; no romantic route closes',()=>{
 for(let i=0;i<3;i++) {
  const s=fresh();choose('f1',i,s);
  for(const id of ['f2','flour_fight']) assert.deepEqual(book2Choices(book2.nodes[id],s).map(([c])=>c[4]),s.kitchenPair);
  assert.equal(book2Choices(book2.nodes.f4,s).length,3);
  const excluded=loveKeys.find(k=>!s.kitchenPair.includes(k));
  s.stats[excluded]=100;
  assert.equal(choose('bonfire',0,s),`confess_${excluded}`);
  assert(!book2Scene(book2.nodes.kitchen_tasks,s).context.includes('undefined'));
 }
});
test('all six party orders play every friend once, then leave for the walk',()=>{
 for(const order of permutations(loveKeys)) {
  let s=fresh();
  for(let turn=0;turn<3;turn++) {
   const visible=book2Choices(book2.nodes.f4,s);
   assert.equal(visible.length,3-turn);
   const key=order[turn];
   const [,index]=visible.find(([c])=>c[4]===key);
   assert.equal(choose('f4',index,s),`party_${key}`);
   assert.equal(choose(`party_${key}`,0,s),turn===2?'walk':'f4');
   s=JSON.parse(JSON.stringify(s)); // A reload must retain completed visits.
  }
  assert.equal(new Set(s.partyVisited).size,3);
  assert.equal(book2Choices(book2.nodes.f4,s).length,0);
 }
});
test('party responses award the requested hearts without automatic entry bonuses',()=>{
 const expected={jihyo:[{jihyo:3},{jihyo:1},{jihyo:2}],chan:[{chan:2},{chan:1},{chan:2}],josh:[{josh:2},{josh:3,bold:1},{jihyo:1},{chan:1}]};
 for(const [key,responses] of Object.entries(expected)) responses.forEach((stats,i)=>{
  const s=fresh();choose('f4',loveKeys.indexOf(key),s);assert.deepEqual(s.stats,{});
  choose(`party_${key}`,i,s);assert.deepEqual(s.stats,stats);
 });
});
test('only the top two call; ties resolve consistently, and rescue totals remain +9 or +3',()=>{
 assert.deepEqual(rankLove({}),loveKeys);
 for(const order of permutations(loveKeys)) {
  const s=fresh();order.forEach((k,i)=>s.stats[k]=30-i*10);
  const choices=book2Choices(book2.nodes.calls,s);
  assert.deepEqual(choices.map(([c])=>c[4]).sort(),[...order.slice(0,2),'none'].sort());
  for(const key of order.slice(0,2)) for(const rescue of [true,false]) {
   const run=structuredClone(s),before=run.stats[key];
   choose('calls',loveKeys.indexOf(key),run);
   let next=choose(`call_${key}`,rescue?0:1,run);
   if(rescue)next=choose(next,0,run);
   assert.equal(next,'bonfire');assert.equal(run.stats[key]-before,rescue?9:3);
  }
 }
});
test('declining calls preserves romance eligibility; rescue can change the winner',()=>{
 const s=fresh();s.stats={jihyo:10,chan:8,josh:1};
 choose('calls',3,s);choose('no_call',0,s);
 assert.equal(choose('bonfire',0,s),'confess_jihyo');
 const rescued=fresh();rescued.stats={jihyo:10,chan:8,josh:1};
 choose('calls',1,rescued);choose('call_chan',0,rescued);choose('rescue_chan',0,rescued);
 assert.equal(choose('bonfire',0,rescued),'confess_chan');
});
test('all nine final outcomes have personal prose and correct partner presentation',()=>{
 const prose=new Set();
 for(const key of loveKeys) for(let i=0;i<3;i++) {
  const s=fresh();s.stats[key]=20;
  const next=choose('bonfire',0,s);assert.equal(next,`confess_${key}`);
  assert.equal(choose(next,i,s),'bend');
  const ending=book2Ending(s);
  assert.equal(ending.title,['More Than Old Friends','The Slow-Burn Beginning','The Friendship You Chose'][i]);
  assert.equal(ending.endingMan,i===2?null:loveNames[key]);prose.add(ending.sub);
 }
 assert.equal(prose.size,9);
});

// Execute the real reader with lightweight UI/timer stubs. This checks integration
// and persistence without claiming to be a browser/layout test.
function reader() {
 const storage=new Map(), app={innerHTML:''};
 const context=vm.createContext({...story,characterImages:{},console,
  document:{querySelector:s=>s==='#app'?app:['[data-exit]','[data-begin]'].includes(s)?{}:null,querySelectorAll:()=>[],body:{insertAdjacentHTML(){}},addEventListener(){},removeEventListener(){}},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
  sessionStorage:{getItem:()=>null,setItem(){}},setTimeout:fn=>fn(),
  votingEnabled:()=>false,setVotingEnabled(){},stopRound(){},votePanel:()=>'',runRound(){}
 });
 vm.runInContext(readFileSync(new URL('../src.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,''),context);
 return {context,storage,app,run:code=>vm.runInContext(code,context)};
}
test('real reader saves/restores kitchen and party state and ignores pre-rewrite saves',()=>{
 const r=reader();
 r.run("play('velvet',null,true);choose(0);choose(0);choose(1);choose(0)");
 assert.equal(r.run('state.node'),'f2');
 assert.deepEqual(JSON.parse(r.run('JSON.stringify(state.kitchenPair)')),['jihyo','josh']);
 r.run("resume('velvet')");assert.equal(r.run('visibleChoices(getNode(state.story,state.node)).length'),2);
 r.run("choose(0);choose(0);choose(2);choose(0);choose(0);choose(0);choose(1);choose(0)");
 assert.equal(r.run('state.node'),'f4');
 assert.deepEqual(JSON.parse(r.run('JSON.stringify(state.partyVisited)')),['chan']);
 r.run("resume('velvet')");assert.equal(r.run('visibleChoices(getNode(state.story,state.node)).length'),2);
 assert(!r.app.innerHTML.includes('route closed'));
 const before=r.run('JSON.stringify(state.stats)');r.run('choose(1)');
 assert.equal(r.run('JSON.stringify(state.stats)'),before,'already visited friend cannot be selected again');
 r.storage.set('starlit-progress',JSON.stringify({velvet:{node:'f2',stats:{jihyo:99}},second:{node:'w1',stats:{v:2}}}));
 assert.equal(r.run("loadProgress('velvet')"),null);
 assert.equal(r.run("loadProgress('second').node"),'w1');
});
test('real reader completes all nine outcomes and displays cast roles',()=>{
 for(const key of loveKeys)for(let ending=0;ending<3;ending++){
  const r=reader();r.run("play('velvet')");
  assert(r.app.innerHTML.includes('intro-roles'));assert(r.app.innerHTML.includes('The main character'));
  r.run("play('velvet',null,true)");
  for(let steps=0;steps<50 && !r.run("state.node.endsWith('end')");steps++){
   const id=r.run('state.node');
   const visible=JSON.parse(r.run('JSON.stringify(visibleChoices(getNode(state.story,state.node)))'));
   let selected=visible[0][1];
   if(id.startsWith('confess_'))selected=ending;
   else {
    const preferred=visible.find(([c])=>Array.isArray(c[4])?c[4].includes(key):c[4]===key);
    if(preferred)selected=preferred[1];
    else {const best=[...visible].sort((a,b)=>(b[0][2][key]||0)-(a[0][2][key]||0));selected=best[0][1];}
   }
   r.run(`choose(${selected})`);
  }
  assert.equal(r.run('state.node'),'bend');assert.equal(r.run('state.finalMan'),key);
  assert(r.app.innerHTML.includes(['More Than Old Friends','The Slow-Burn Beginning','The Friendship You Chose'][ending]));
  assert.equal(r.run("loadProgress('velvet')"),null);
 }
});

test('party voting round IDs change even if phones miss the intervening scene',()=>{
 const r=reader();r.run("play('velvet',null,true);state.node='f4'");
 const first=r.run('readerRoundId()');
 r.run("state.partyVisited=['josh']");const second=r.run('readerRoundId()');
 r.run("state.partyVisited=['josh','jihyo']");const third=r.run('readerRoundId()');
 assert.equal(new Set([first,second,third]).size,3);
});
