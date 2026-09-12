const STORAGE_KEY = 'rehab-ip-studio-v1';
const defaultState = { weekTasks: [], roadmap: {}, records: [], script: {}, phase: 1 };
let state;
try { state = { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
catch { state = { ...defaultState }; }

const seriesCue = {
  '30 秒自测': '正面全身或半身机位，演示一次正确、一次代偿；字幕明确“观察，不等于诊断”。',
  '医生拆误区': '先复述常见说法，停顿一拍，再用一个更准确的新框架替换它。',
  '门诊高频问': '模拟患者原话开场，医生正面回答；先给选择，再解释判断条件。',
  '今天练一个': '固定机位完整拍动作，叠加目标、次数、呼吸和停止条件。',
  '病例怎么想': '用时间线或白板展示判断路径；移除全部可识别信息并说明个案局限。',
  '针灸讲真话': '用诊室口述或安全的环境镜头，重点讲预期和边界，不用刺激性针刺特写。',
  '身体说明书': '从一天中的真实场景切入，用“今天就能做的小调整”收尾。'
};

const topicRows = [
  ['腰','门诊高频问','腰痛到底该躺着，还是该动？','把“休息或运动”改成分阶段选择：先看症状强度、功能变化和异常信号。'],
  ['腰','医生拆误区','腰椎间盘突出，就不能运动了吗？','影像诊断不等于运动禁令，重点是症状反应、动作选择与逐步负荷。'],
  ['腰','医生拆误区','片子不严重，为什么腰还是很痛？','解释影像、疼痛体验和功能并不总是一一对应。'],
  ['腰','医生拆误区','片子看起来很严重，为什么有人不痛？','拆掉“片子越重就一定越痛”的线性想象。'],
  ['腰','30 秒自测','坐久腰酸，先观察站起来的前两步','观察起身、伸直和走动后的变化，不把结果当成诊断。'],
  ['腰','今天练一个','久坐后腰紧，先试“换姿势”而不是硬拉','给一个低门槛活动方案，目标是增加动作选择。'],
  ['腰','门诊高频问','腰痛能不能按摩？先回答三个问题','把是否按摩放进风险、刺激反应与后续训练的判断里。'],
  ['腰','病例怎么想','腰痛半年，我为什么先问了睡眠和负荷','展示看似局部的问题如何受到恢复和日常负荷影响。'],
  ['腰','身体说明书','白天没事，一躺下腰就痛，要观察什么？','从睡姿、床垫、持续时间和伴随症状展开，而不是直接推荐产品。'],
  ['腰','门诊高频问','腰不痛了，为什么还不能算康复结束？','用生活任务与负荷耐受解释“无痛”和“恢复能力”的区别。'],

  ['颈','门诊高频问','手麻就是颈椎病吗？','给出“来源不止一个”的判断框架，并提醒进行性异常需要评估。'],
  ['颈','医生拆误区','颈椎反弓，是不是一定有病？','影像描述要和症状、功能及临床评估一起看。'],
  ['颈','身体说明书','枕头越贵，对颈椎越好吗？','产品价格不是核心，舒适、睡姿和晨起反应更可观察。'],
  ['颈','门诊高频问','脖子咔咔响，要不要处理？','先区分单纯声响与伴随疼痛、卡住、神经症状的情况。'],
  ['颈','30 秒自测','低头后脖子酸，先看转头是否对称','只做温和活动观察，强调不追求硬掰和极限角度。'],
  ['颈','今天练一个','工作一小时，给颈椎的不是拉伸而是变化','用短时走动、视线变化与上肢活动打破固定姿势。'],
  ['颈','医生拆误区','“低头等于脖子挂几十斤”为什么容易误导？','把夸张数字改成可执行的暴露时间与恢复策略。'],
  ['颈','病例怎么想','脖子痛反复，我为什么先看工作台和睡眠？','展示环境、负荷、恢复和身体能力的组合判断。'],

  ['肩','门诊高频问','肩膀痛，为什么不一定是肩周炎？','从年龄、活动范围、疼痛弧和受伤史说明需要鉴别。'],
  ['肩','30 秒自测','手举不上去：自己抬和别人帮抬，信息不同','演示主动与被动活动的区别，但不据此下诊断。'],
  ['肩','医生拆误区','五十肩要不要忍痛硬掰？','强调刺激后的反应与循序渐进，反对用疼痛证明有效。'],
  ['肩','门诊高频问','晚上睡觉肩痛，先调整哪几件事？','先讲支撑、侧卧压力、白天负荷和异常变化。'],
  ['肩','今天练一个','肩痛恢复期，先练可控范围里的抬手','把动作目标定为平稳、可重复，而不是一次抬到最高。'],
  ['肩','医生拆误区','肩膀响但不痛，需要“掰开”吗？','说明声音本身与功能问题需要分开判断。'],
  ['肩','病例怎么想','肩痛半年，我为什么没有第一时间练肩？','展示颈部、胸廓、日常负荷和局部能力的系统评估。'],
  ['肩','身体说明书','抱孩子后肩痛，问题可能不只在姿势','把单次姿势改成总负荷、换边和恢复能力的讨论。'],

  ['膝','医生拆误区','深蹲到底伤不伤膝盖？','关键不是动作名字，而是当前能力、范围、负荷与症状反应。'],
  ['膝','门诊高频问','膝盖不好，到底该休息还是练腿？','建立“降低刺激—保留活动—逐步增强”的阶段策略。'],
  ['膝','医生拆误区','跑步伤膝盖？真正要看的是这些变量','把讨论转向训练量、恢复、既往能力和疼痛变化。'],
  ['膝','门诊高频问','膝盖响但是不痛，需要治疗吗？','区分常见声响与伴随肿胀、锁住、功能下降的情况。'],
  ['膝','30 秒自测','上下楼膝痛，先拍下自己的下台阶动作','用侧前方视频观察速度、控制和左右差异，不自我诊断。'],
  ['膝','今天练一个','膝痛恢复期，先从椅子起立练起','用椅子高度调节难度，给出可观察的第二天反应。'],
  ['膝','病例怎么想','膝痛患者，我为什么会看髋和踝？','展示上下游关节、负荷分配与任务需求的关系。'],
  ['膝','身体说明书','爬楼梯时膝盖痛，怎么安排一天的负荷？','不只教动作，还教分配次数、扶手与恢复窗口。'],

  ['针灸','针灸讲真话','针灸到底为什么可能减轻疼痛？','用可理解的疼痛调节框架，避免神化单一机制。'],
  ['针灸','针灸讲真话','扎得越痛，效果越好吗？','把针感、耐受和疗效分开，不以强刺激作为好坏标准。'],
  ['针灸','针灸讲真话','针越多，效果越好吗？','说明治疗剂量不是简单叠加，选择取决于评估和方案。'],
  ['针灸','针灸讲真话','为什么同样腰痛，扎的位置可能不一样？','强调症状分布、功能表现和个体情况会影响决策。'],
  ['针灸','针灸讲真话','电针和普通针灸有什么不同？','介绍体验与临床选择，不做孰优孰劣的绝对结论。'],
  ['针灸','针灸讲真话','针灸后第二天酸，是正常的吗？','解释常见短暂反应，同时说清持续加重或异常时要联系医生。'],
  ['针灸','针灸讲真话','针灸多久算一个疗程？','拒绝固定次数承诺，改用阶段目标与复评节点。'],
  ['针灸','针灸讲真话','针灸能不能天天做？','讲频率需要结合问题、刺激量、反应与专业判断。'],
  ['针灸','针灸讲真话','哪些人做针灸前要主动告诉医生？','提示用药、妊娠、出血风险、皮肤情况等信息沟通。'],
  ['针灸','针灸讲真话','针灸有效以后，为什么还要训练？','把短期症状窗口连接到活动、力量和负荷耐受。'],

  ['运动康复','医生拆误区','每天拉伸，是不是一定对身体好？','拉伸是工具，先看目标、剂量和身体反应。'],
  ['运动康复','门诊高频问','疼痛时还能不能运动？用红黄绿三档判断','给可理解的调整逻辑，不发放统一运动处方。'],
  ['运动康复','今天练一个','久坐人群最先练的，不一定是“核心”','从真实任务选训练，而不是追逐一个流行部位。'],
  ['运动康复','身体说明书','热身到底在热什么？','把热身定义为为接下来任务做准备，而不是固定动作清单。'],
  ['运动康复','医生拆误区','动作做得不标准，就一定会受伤吗？','把“完美姿势”改成个体差异、负荷与适应。'],
  ['运动康复','30 秒自测','鞋底磨损能不能看出身体问题？','告诉观众它只能提供线索，不能单独决定诊断或矫正。'],
  ['运动康复','今天练一个','重新开始运动，第一周该有多轻？','用可重复、第二天可恢复和逐周增加建立起点。'],
  ['运动康复','病例怎么想','同一个动作，为什么这个人适合、那个人不适合？','用目标、阶段、症状反应和可调整性解释个体化。'],
  ['运动康复','门诊高频问','运动后酸痛，怎么判断是正常适应还是过量？','从时间、程度、功能与趋势四个维度观察。'],
  ['运动康复','身体说明书','真正可持续的训练，要先允许“最低配”','教观众设计忙碌日也能完成的最小版本。'],

  ['中老年功能','身体说明书','40 岁以后，最值得保住的身体能力是什么？','用起立、行走、负重和恢复说明力量与心肺的重要性。'],
  ['中老年功能','30 秒自测','不用器械，观察一次坐站透露了什么？','让家人从扶手、速度与平稳性观察变化，不贴疾病标签。'],
  ['中老年功能','今天练一个','预防跌倒，先把“稳稳坐下”练好','把离心控制做成安全、可回归的家庭练习。'],
  ['中老年功能','医生拆误区','年纪大了，少动才安全？','解释长期回避如何降低能力，强调安全条件下逐步活动。'],
  ['中老年功能','门诊高频问','父母膝痛，散步越多越好吗？','把步数目标改成症状反应、速度、环境和第二天恢复。'],
  ['中老年功能','身体说明书','肌肉量下降，为什么会影响生活独立？','把概念连接到提物、起立、上楼与跌倒风险。'],
  ['中老年功能','今天练一个','家里最实用的平衡训练，先从有支撑开始','明确扶靠、陪同与环境清理，安全优先。'],
  ['中老年功能','病例怎么想','走得慢不是“老了就这样”，还要看什么？','展示疼痛、力量、心肺、药物与环境的多因素思路。'],

  ['健康管理','身体说明书','睡不好，为什么疼痛更容易被放大？','讲双向影响，避免把所有疼痛都归因于睡眠。'],
  ['健康管理','身体说明书','工作很忙，如何安排身体的“微恢复”？','用 2—5 分钟的走动、呼吸和视线切换降低执行门槛。'],
  ['健康管理','医生拆误区','坐姿越标准，就越不容易痛吗？','最好的姿势往往是下一个姿势，重点是变化与耐受。'],
  ['健康管理','身体说明书','体重不是唯一指标，功能还要看什么？','补充力量、耐力、活动范围、睡眠与日常任务表现。'],
  ['健康管理','门诊高频问','疼痛反复，是不是说明治疗失败？','把复发看成需要复盘负荷、恢复和应对策略的信号。'],
  ['健康管理','身体说明书','开长途车后腰酸，出发前怎么准备？','从座椅、停靠、换姿势和到达后的恢复安排入手。'],

  ['医生本人','病例怎么想','一天门诊后，我会复盘哪三个问题？','展示专业反思：判断是否清楚、患者是否理解、下一步是否可执行。'],
  ['医生本人','身体说明书','康复医生自己如何安排一周运动？','分享原则与调整过程，不塑造完美自律人设。'],
  ['医生本人','门诊高频问','患者最常问、也最难一句话回答的问题','用诚实的不确定性展示专业，而不是给出万能答案。'],
  ['医生本人','身体说明书','我对“身体变老”的理解，和十年前不一样','从对抗衰老转向保存参与生活的能力。']
];

const topics = topicRows.map((row, index) => ({ id: index + 1, pillar: row[0], series: row[1], title: row[2], angle: row[3], cue: seriesCue[row[1]], level: index < 34 ? '大众入口' : index < 54 ? '专业特色' : '长期信任' }));

const phases = {
  1: { title: '定位验证期', goal: '确认“颈肩腰膝 + 疼痛功能”是否能让目标人群立即认出自己。', metric: '看有效评论与收藏理由，不急着追求粉丝量。', weeks: [
    ['第 1 周','腰痛与久坐','测试“先判断、再行动”的表达','5 条腰痛；至少 2 条场景开场；收集 20 个原话问题'],
    ['第 2 周','颈痛与办公','验证姿势误区能否带来高质量讨论','2 条误区；1 条自测；1 条动作；1 条问答'],
    ['第 3 周','肩痛与睡眠','建立“不是都叫肩周炎”的鉴别意识','主动/被动活动演示；夜间场景；一条病例思维'],
    ['第 4 周','膝痛与上下楼','测试“休息还是运动”的阶段框架','深蹲误区；台阶观察；起立训练；月度复盘']
  ]},
  2: { title: '栏目成型期', goal: '让观众开始识别你的固定栏目和六步方法，而不只是记住某条爆款。', metric: '看同栏目连续三条的完播、收藏与关注转化。', weeks: [
    ['第 5 周','30 秒自测周','统一视觉、口令和安全声明','连续 3 个自测；每条说明观察目标；收集执行反馈'],
    ['第 6 周','针灸讲真话周','建立不过度吹捧也不贬低的专业特色','针感、频率、疗程、训练衔接；每条讲一个问题'],
    ['第 7 周','病例思维周','让观众看见判断过程，而非展示“神奇疗效”','2 条匿名病例；1 条错误路径；1 条复评节点'],
    ['第 8 周','身体说明书周','从局部疼痛延伸到可持续健康管理','睡眠、久坐、热身、最低配训练；阶段复盘']
  ]},
  3: { title: '复盘放大期', goal: '复用已验证的主题，形成一稿多用与系列化，而不是盲目扩张“大健康”。', metric: '看系列回访、跨平台保存与高意向问题的质量。', weeks: [
    ['第 9 周','重做高收藏题','用新场景重讲前三名主题','每条保留核心结论；更换人群或任务；比较数据'],
    ['第 10 周','一个长题拆五条','完成首次一稿多用','1 个 8—12 分钟母题；5 条短切；1 篇图文清单'],
    ['第 11 周','评论区问题周','把真实追问变成内容产品','整理 50 条评论；归类 10 个问题；拍 5 个回答'],
    ['第 12 周','季度复盘与下季','决定保留、淘汰和新增什么','栏目评分；主题评分；受众变化；下一季 12 个核心题']
  ]}
};

const navItems = [...document.querySelectorAll('.nav-item')];
const panels = [...document.querySelectorAll('[data-view-panel]')];
const sidebar = document.querySelector('.sidebar');
const toast = document.getElementById('toast');

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function escapeHtml(value=''){ return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
function showToast(message){ toast.textContent=message; toast.classList.add('is-visible'); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove('is-visible'),1900); }
function showView(id){
  panels.forEach(panel=>panel.classList.toggle('is-visible',panel.id===id));
  navItems.forEach(item=>item.classList.toggle('is-active',item.dataset.view===id));
  sidebar.classList.remove('is-open');
  document.getElementById('menuButton').setAttribute('aria-expanded','false');
  window.scrollTo({top:0,behavior:'smooth'});
}
function download(name, content, type='application/json'){
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href=url; anchor.download=name; anchor.click(); URL.revokeObjectURL(url);
}

navItems.forEach(item=>item.addEventListener('click',()=>showView(item.dataset.view)));
document.querySelectorAll('[data-jump]').forEach(item=>item.addEventListener('click',()=>showView(item.dataset.jump)));
document.getElementById('menuButton').addEventListener('click',()=>{
  const open=sidebar.classList.toggle('is-open');
  document.getElementById('menuButton').setAttribute('aria-expanded',String(open));
});
document.querySelector('[data-action="export"]').addEventListener('click',()=>{
  download(`复健针言-全部记录-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(state,null,2));
  showToast('全部记录已导出');
});

const weekTasks=[...document.querySelectorAll('[data-week-task]')];
function renderProgress(){
  const done=state.weekTasks.filter(Boolean).length;
  const percent=Math.round(done/weekTasks.length*100)||0;
  document.getElementById('weekCount').textContent=`${done} / ${weekTasks.length}`;
  document.getElementById('dashboardProgress').textContent=`${percent}%`;
  document.querySelector('.score-ring').setAttribute('aria-label',`本周完成度 ${percent}%`);
  document.querySelector('.score-ring').style.background=`radial-gradient(circle closest-side,white 82%,transparent 83%),conic-gradient(var(--coral) ${percent}%,var(--line) 0)`;
}
weekTasks.forEach((task,index)=>{task.checked=Boolean(state.weekTasks[index]);task.addEventListener('change',()=>{state.weekTasks[index]=task.checked;save();renderProgress();});});

const pillarFilter=document.getElementById('pillarFilter');
const seriesFilter=document.getElementById('seriesFilter');
const topicSearch=document.getElementById('topicSearch');
const pillars=[...new Set(topics.map(topic=>topic.pillar))];
const series=[...new Set(topics.map(topic=>topic.series))];
pillars.forEach(value=>pillarFilter.add(new Option(value,value)));
series.forEach(value=>seriesFilter.add(new Option(value,value)));
pillars.forEach(value=>document.getElementById('recordPillar').add(new Option(value,value)));

function filteredTopics(){
  const query=topicSearch.value.trim().toLowerCase();
  return topics.filter(topic => (pillarFilter.value==='all'||topic.pillar===pillarFilter.value) && (seriesFilter.value==='all'||topic.series===seriesFilter.value) && (!query||`${topic.title}${topic.angle}${topic.pillar}${topic.series}`.toLowerCase().includes(query)));
}
function renderTopics(list=filteredTopics()){
  document.getElementById('topicCount').textContent=list.length;
  document.getElementById('topicGrid').innerHTML=list.length ? list.map(topic=>`
    <article class="topic-card">
      <div class="topic-meta"><span>${escapeHtml(topic.pillar)} · ${escapeHtml(topic.series)}</span><i>${escapeHtml(topic.level)}</i></div>
      <h2>${escapeHtml(topic.title)}</h2><p>${escapeHtml(topic.angle)}</p>
      <footer><button class="primary-button" data-use-topic="${topic.id}">带入脚本</button><button class="secondary-button" data-open-topic="${topic.id}">拍摄提示</button></footer>
    </article>`).join('') : '<div class="empty-state"><b>没有匹配选题</b><p>换一个关键词，或清除筛选后再试。</p></div>';
}
function useTopic(id){
  const topic=topics.find(item=>item.id===Number(id)); if(!topic)return;
  document.getElementById('scriptTitle').value=topic.title;
  document.getElementById('scriptHook').value=`如果你也在想“${topic.title.replace(/[？?]/g,'')}”，先别急着只找一个标准答案。`;
  document.getElementById('scriptThesis').value=topic.angle;
  document.getElementById('scriptExplain').value='判断这类问题，不能只看一个部位或一个动作。要把症状变化、功能表现、日常负荷和恢复情况放在一起看。';
  document.getElementById('scriptAction').value=topic.cue;
  document.getElementById('scriptBoundary').value='这只是一般信息，不等于诊断。如果症状持续加重，伴随进行性无力、明显感觉异常或其他异常表现，请及时线下评估。';
  syncScript(); showView('script'); showToast('选题已带入脚本');
}
function openTopic(id){
  const topic=topics.find(item=>item.id===Number(id)); if(!topic)return;
  document.getElementById('topicDialogContent').innerHTML=`<div class="dialog-content"><span>${escapeHtml(topic.pillar)} · ${escapeHtml(topic.series)} · ${escapeHtml(topic.level)}</span><h2>${escapeHtml(topic.title)}</h2><p>${escapeHtml(topic.angle)}</p><div class="dialog-grid"><div><b>推荐画面</b><small>${escapeHtml(topic.cue)}</small></div><div><b>医学边界</b><small>提示判断框架，不隔空诊断；动作与建议需结合本人专业审核。</small></div></div><div class="dialog-action"><b>结尾连接：</b>“症状缓解只是开始，接下来还要把身体需要的能力练回来。”</div><button class="primary-button" data-dialog-use="${topic.id}">带入脚本工坊</button></div>`;
  document.getElementById('topicDialog').showModal();
}
document.getElementById('topicGrid').addEventListener('click',event=>{
  const use=event.target.closest('[data-use-topic]'); const open=event.target.closest('[data-open-topic]');
  if(use)useTopic(use.dataset.useTopic); if(open)openTopic(open.dataset.openTopic);
});
document.getElementById('topicDialog').addEventListener('click',event=>{const use=event.target.closest('[data-dialog-use]');if(use){document.getElementById('topicDialog').close();useTopic(use.dataset.dialogUse);}});
[pillarFilter,seriesFilter,topicSearch].forEach(control=>control.addEventListener('input',()=>renderTopics()));
document.getElementById('clearFilters').addEventListener('click',()=>{pillarFilter.value='all';seriesFilter.value='all';topicSearch.value='';renderTopics();});
document.getElementById('randomTopic').addEventListener('click',()=>{const list=filteredTopics();if(list.length)openTopic(list[Math.floor(Math.random()*list.length)].id);});

const scriptFields=[...document.querySelectorAll('#scriptForm input:not([type="checkbox"]), #scriptForm textarea')];
const scriptLabels=[['hook','开场'],['thesis','结论'],['explain','解释'],['action','观察 / 动作'],['boundary','边界'],['close','结尾']];
function syncScript(){
  scriptFields.forEach(field=>state.script[field.name]=field.value); save();
  const text=scriptFields.map(field=>field.value).join('');
  const seconds=Math.round(text.replace(/\s/g,'').length/4.1);
  document.getElementById('durationEstimate').textContent=`约 ${seconds} 秒 · ${text.replace(/\s/g,'').length} 字`;
  const parts=scriptLabels.map(([name,label])=>[label,state.script[name]||'']).filter(item=>item[1]);
  document.getElementById('scriptPreview').innerHTML=parts.length ? parts.map(([label,value])=>`<div class="preview-section"><span>${label}</span><p>${escapeHtml(value).replace(/\n/g,'<br>')}</p></div>`).join('') : '<p class="preview-empty">在左侧开始写，完整口播稿会实时出现在这里。</p>';
}
scriptFields.forEach(field=>{if(state.script[field.name])field.value=state.script[field.name];field.addEventListener('input',syncScript);});
document.getElementById('scriptForm').addEventListener('reset',()=>setTimeout(()=>{state.script={};syncScript();},0));
const scriptChecks=[...document.querySelectorAll('[data-script-check]')];
scriptChecks.forEach(check=>check.addEventListener('change',()=>{document.getElementById('checkStatus').textContent=`${scriptChecks.filter(item=>item.checked).length} / 4 自检`;}));
function compiledScript(){return `${state.script.title||'未命名脚本'}\n\n${scriptLabels.map(([name,label])=>state.script[name]?`【${label}】\n${state.script[name]}`:'').filter(Boolean).join('\n\n')}`;}
document.getElementById('copyScript').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(compiledScript());showToast('脚本已复制');}catch{showToast('复制失败，请手动选择预览文字');}});
document.getElementById('saveToRecords').addEventListener('click',()=>{
  if(!state.script.title){showToast('先填写选题标题');return;}
  state.records.unshift({id:crypto.randomUUID(),title:state.script.title,platform:'抖音',pillar:'未分类',status:'写稿中',date:'',views:0,saves:0,comments:0,leads:0,note:'由脚本工坊加入',createdAt:new Date().toISOString()});
  save();renderRecords();showToast('已加入发布记录');
});

function renderPhase(phaseNumber=state.phase){
  const phase=phases[phaseNumber]; state.phase=Number(phaseNumber); save();
  document.querySelectorAll('[data-phase]').forEach(button=>button.classList.toggle('is-active',Number(button.dataset.phase)===state.phase));
  document.getElementById('phaseOverview').innerHTML=`<span class="phase-number">0${state.phase}</span><div><p class="eyebrow">PHASE ${state.phase}</p><h2>${phase.title}</h2><p>${phase.goal}<br><b>复盘重点：</b>${phase.metric}</p></div>`;
  document.getElementById('weekGrid').innerHTML=phase.weeks.map((week,index)=>{
    const absolute=(state.phase-1)*4+index+1; const done=Boolean(state.roadmap[absolute]);
    return `<article class="week-card ${done?'is-done':''}"><header><span>WEEK ${String(absolute).padStart(2,'0')}</span><label><input type="checkbox" data-roadmap-week="${absolute}" ${done?'checked':''}>完成</label></header><h2>${week[1]}</h2><p>${week[2]}</p><ul>${week[3].split('；').map(item=>`<li>${item}</li>`).join('')}</ul></article>`;
  }).join('');
}
document.querySelectorAll('[data-phase]').forEach(button=>button.addEventListener('click',()=>renderPhase(button.dataset.phase)));
document.getElementById('weekGrid').addEventListener('change',event=>{if(event.target.matches('[data-roadmap-week]')){state.roadmap[event.target.dataset.roadmapWeek]=event.target.checked;save();renderPhase(state.phase);}});

const recordForm=document.getElementById('recordForm');
recordForm.addEventListener('submit',event=>{
  event.preventDefault(); const data=Object.fromEntries(new FormData(recordForm));
  ['views','saves','comments','leads'].forEach(key=>data[key]=Number(data[key]||0));
  state.records.unshift({...data,id:crypto.randomUUID(),createdAt:new Date().toISOString()}); save(); recordForm.reset(); renderRecords(); showToast('记录已保存');
});
function renderRecordStats(){
  const published=state.records.filter(record=>record.status==='已发布');
  const totals=published.reduce((acc,item)=>{acc.views+=Number(item.views||0);acc.saves+=Number(item.saves||0);acc.comments+=Number(item.comments||0);acc.leads+=Number(item.leads||0);return acc;},{views:0,saves:0,comments:0,leads:0});
  const saveRate=totals.views?`${(totals.saves/totals.views*100).toFixed(1)}%`:'—';
  document.getElementById('recordStats').innerHTML=`<div class="record-stat"><span>全部内容</span><b>${state.records.length}</b><small>${published.length} 条已发布</small></div><div class="record-stat"><span>总收藏</span><b>${totals.saves.toLocaleString()}</b><small>收藏率 ${saveRate}</small></div><div class="record-stat"><span>有效评论</span><b>${totals.comments.toLocaleString()}</b><small>可沉淀为下周选题</small></div><div class="record-stat"><span>有效咨询</span><b>${totals.leads.toLocaleString()}</b><small>重质量，不追数量</small></div>`;
}
function renderRecords(){
  renderRecordStats(); const query=document.getElementById('recordSearch').value.trim().toLowerCase();
  const records=state.records.filter(item=>!query||`${item.title}${item.platform}${item.pillar}${item.note}${item.status}`.toLowerCase().includes(query));
  document.getElementById('recordsList').innerHTML=records.length?`<table class="records-table"><thead><tr><th>内容</th><th>平台 / 日期</th><th>状态</th><th>播放</th><th>收藏</th><th>评论</th><th>咨询</th><th></th></tr></thead><tbody>${records.map(record=>`<tr><td class="record-title" data-label="内容"><b>${escapeHtml(record.title)}</b><small>${escapeHtml(record.note||record.pillar||'')}</small></td><td data-label="平台">${escapeHtml(record.platform||'—')}<br>${escapeHtml(record.date||'未排期')}</td><td data-label="状态"><span class="status-pill ${record.status==='已发布'?'published':''}">${escapeHtml(record.status||'想法')}</span></td><td data-label="播放">${Number(record.views||0).toLocaleString()}</td><td data-label="收藏">${Number(record.saves||0).toLocaleString()}</td><td data-label="评论">${Number(record.comments||0).toLocaleString()}</td><td data-label="咨询">${Number(record.leads||0).toLocaleString()}</td><td data-label="操作"><button class="delete-record" data-delete-record="${escapeHtml(record.id)}">删除</button></td></tr>`).join('')}</tbody></table>`:'<div class="records-empty"><b>还没有内容记录</b><span>从选题库带入脚本，或在上方手动添加第一条。</span></div>';
}
document.getElementById('recordSearch').addEventListener('input',renderRecords);
document.getElementById('recordsList').addEventListener('click',event=>{const button=event.target.closest('[data-delete-record]');if(button&&confirm('删除这条记录？')){state.records=state.records.filter(item=>item.id!==button.dataset.deleteRecord);save();renderRecords();showToast('记录已删除');}});
document.getElementById('exportJson').addEventListener('click',()=>{download(`内容记录-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify({records:state.records},null,2));showToast('JSON 已导出');});
document.getElementById('exportMarkdown').addEventListener('click',()=>{
  const body=['# 复健针言 · 内容发布记录','',...state.records.flatMap((record,index)=>[`## ${index+1}. ${record.title}`,`- 平台：${record.platform||'—'}` ,`- 状态：${record.status||'—'}`,`- 日期：${record.date||'—'}`,`- 数据：播放 ${record.views||0}｜收藏 ${record.saves||0}｜有效评论 ${record.comments||0}｜有效咨询 ${record.leads||0}`,`- 复盘：${record.note||'—'}`,''])].join('\n');
  download(`内容记录-${new Date().toISOString().slice(0,10)}.md`,body,'text/markdown;charset=utf-8');showToast('Markdown 已导出');
});
document.getElementById('importJson').addEventListener('change',event=>{
  const file=event.target.files[0]; if(!file)return; const reader=new FileReader();
  reader.onload=()=>{try{const data=JSON.parse(reader.result);if(!Array.isArray(data.records))throw new Error();if(confirm(`导入 ${data.records.length} 条记录并替换当前记录？`)){state.records=data.records;save();renderRecords();showToast('记录已导入');}}catch{showToast('文件格式不正确');}event.target.value='';};reader.readAsText(file);
});

renderProgress(); renderTopics(); syncScript(); renderPhase(state.phase); renderRecords();
