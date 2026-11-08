import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const read = file => fs.readFileSync(new URL(file, root), 'utf8');
const stimulusText = read('data/stimuli.csv');
const questionText = read('data/questions.csv');
const script = read('experiment.js');
const practice = read('practice.js');
const config = read('config.js');
const cellHistory = new Map();

for (let list = 0; list < 12; list++) {
  let resolveRun;
  const timelineReceived = new Promise(resolve => { resolveRun=resolve; });
  const win = {location:{href:`http://localhost:8000/?list=${list}`,search:`?list=${list}`}};
  const jsPsych = {
    randomization:{shuffle:array=>[...array].reverse()},
    data:{addProperties:()=>{},get:()=>({localSave:()=>{}})},
    run:timeline=>resolveRun(timeline),
    finishTrial:()=>{}
  };
  const sandbox = {
    window:win,
    URL,URLSearchParams,crypto:{randomUUID:()=>`pid-${list}`},
    performance:{now:()=>1234},
    requestAnimationFrame:()=>{},
    document:{getElementById:()=>({remove:()=>{}})},
    console,
    jsPsychHtmlKeyboardResponse:'keyboard',
    jsPsychHtmlButtonResponse:'button',
    jsPsychSurveyMultiChoice:'multi-choice',
    jsPsychSurveyLikert:'likert',
    jsPsychExtensionPipe:'pipe',
    initJsPsych:()=>jsPsych,
    fetch:async path=>({ok:true,text:async()=>path==='data/stimuli.csv'?stimulusText:questionText})
  };
  vm.createContext(sandbox);
  vm.runInContext(config,sandbox);
  win.EXPERIMENT_CONFIG.mode='pilot';
  vm.runInContext(practice,sandbox);
  vm.runInContext(script,sandbox);
  const timeline=await Promise.race([
    timelineReceived,
    new Promise((_,reject)=>setTimeout(()=>reject(new Error(`List ${list} did not start`)),2500))
  ]);
  assert.ok(Array.isArray(timeline));
  const mainContext=timeline.filter(x=>x.data?.task==='narrative'&&x.data?.phase==='sentence');
  const mainWords=timeline.filter(x=>x.data?.task==='narrative'&&x.data?.phase==='word');
  const mainQuestions=timeline.filter(x=>x.data?.task==='narrative'&&x.data?.phase==='questions');
  const practiceContext=timeline.filter(x=>x.data?.task==='practice'&&x.data?.phase==='sentence');
  const practiceWords=timeline.filter(x=>x.data?.task==='practice'&&x.data?.phase==='word');
  const practiceQuestions=timeline.filter(x=>x.data?.task==='practice'&&x.data?.phase==='questions');
  assert.equal(mainContext.length,24*4);
  assert.ok(mainWords.length>=24*3);
  assert.equal(mainQuestions.length,24);
  assert.equal(practiceContext.length,4);
  assert.equal(practiceWords.length,6);
  assert.equal(practiceQuestions.length,1);
  assert.ok(mainContext.every(x=>x.data.min_sentence_display_ms===1000));
  assert.ok(practiceContext.every(x=>x.data.min_sentence_display_ms===0));
  assert.ok(mainContext.every(x=>!x.stimulus.includes('Press <kbd>Space</kbd>')));
  assert.ok(practiceContext.every(x=>x.stimulus.includes('Press <kbd>Space</kbd>')));
  assert.ok(mainQuestions.every(x=>x.data.question_set==='all_five_sequential'));
  assert.ok(practiceQuestions[0].data.question_set==='independent_practice_questions');
  const posCell=new Map();
  const ids=new Set();
  for (const t of mainContext) {
    let arr=posCell.get(t.data.item_position);
    if (!arr) {arr=[];posCell.set(t.data.item_position,arr);}
    arr.push(t);
  }
  assert.equal(posCell.size,24);
  const counts=new Map();
  for (let i=1;i<=24;i++) {
    const arr=posCell.get(i);
    assert.ok(arr && arr.length===4);
    const {item_num,item_id,condition_num,predicate,access}=arr[0].data;
    assert.ok(item_num>=1&&item_num<=24);
    assert.ok(!ids.has(item_id)); ids.add(item_id);
    assert.ok(arr.every(x=>x.data.item_id===item_id));
    counts.set(condition_num,(counts.get(condition_num)||0)+1);
    const existing=cellHistory.get(item_num)||new Set();
    existing.add(condition_num); cellHistory.set(item_num,existing);
  }
  assert.equal(counts.size,12);
  assert.ok([...counts.values()].every(v=>v===2));
  const breaks=timeline.filter(x=>x.stimulus?.includes('Break ')&&x.stimulus?.includes(' of 3.'));
  assert.equal(breaks.length,3);
  assert.ok(breaks[0].stimulus.includes('completed 6 of 24'));
  assert.ok(breaks[1].stimulus.includes('completed 12 of 24'));
  assert.ok(breaks[2].stimulus.includes('completed 18 of 24'));
  assert.ok(timeline[0].stimulus.includes('24 short narratives'));
  assert.ok(timeline.some(x=>x.stimulus?.includes('24 new narratives')));
  console.log(`List ${list}: 24 items, 2/cell, 3 breaks, practice and timing OK`);
}
assert.equal(cellHistory.size,24);
assert.ok([...cellHistory.values()].every(s=>s.size===12));
console.log('PASS: all 12 lists validated; every retained item occurs once in each condition across lists.');
