
document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('leaderboard.json'); const data = await res.json();
  const runs = data.runs; const cols = data.metrics; const tb = document.querySelector('#tbody');

  function row(r){
    const mcols = cols.map(k=>`<td>${(r[k]*100).toFixed(1)}%</td>`).join('');
    const prov = data.with_provenance ? `<td data-prov>
      <button class="pill ${r.provenance_status}"><span class="nowrap">${r.provenance_status}</span> <span class="chev">▸</span></button>
      <div class="drawer" hidden>
        <div class="kvs">
          <span class="kv"><b class="mono">root</b> ${r.proof_root}</span>
          <a class="kv" href="${r.proof_url}">download proof</a>
        </div>
      </div>
    </td>` : '';
    const audit = `<td data-audit>
      <button class="pill ${r.audit_status}"><span class="nowrap">${r.audit_status}</span> <span class="chev">▸</span></button>
      <div class="drawer" hidden>
        <div class="grid2">
          <div><b>Retrieval candidates</b><div class="small mono">${r.audit.candidates.join('<br>')}</div></div>
          <div><b>Citations used</b><div class="small mono">${r.audit.citations.join('<br>')}</div></div>
        </div>
      </div>
    </td>`;
    return `<tr>
      <td><span class="mono">${r.run_id}</span></td>
      <td data-model>
        <button class="pill"><span class="nowrap">${r.model}</span> <span class="chev">▸</span></button>
        <div class="drawer" hidden>
          <div class="kvs">
            ${Object.entries(r.meta).map(([k,v])=>`<span class="kv"><b>${k}</b> ${v}</span>`).join('')}
          </div>
        </div>
      </td>
      ${mcols}
      ${prov}
      ${audit}
      <td><a href="${r.report}" class="btn">Report</a></td>
    </tr>`;
  }

  tb.innerHTML = runs.map(row).join('');

  tb.addEventListener('click', e=>{
    const btn = e.target.closest('button.pill');
    if(!btn) return;
    const drawer = btn.parentElement.nextElementSibling;
    const chev = btn.querySelector('.chev');
    drawer.hidden = !drawer.hidden;
    chev.style.transform = drawer.hidden ? 'rotate(0deg)' : 'rotate(90deg)';
  });

  const q = document.querySelector('#search');
  q.addEventListener('input', ()=>{
    const v = q.value.toLowerCase();
    for(const tr of tb.querySelectorAll('tr')){
      tr.style.display = tr.textContent.toLowerCase().includes(v)?'':'none';
    }
  });

  const leftSel = document.getElementById('leftSel');
  const rightSel = document.getElementById('rightSel');
  if(leftSel && rightSel){
    runs.forEach(r=>{ leftSel.add(new Option(r.run_id, r.run_id)); rightSel.add(new Option(r.run_id, r.run_id)); });
    document.getElementById('openReports').onclick = ()=>{
      const l = leftSel.value, rr = rightSel.value;
      window.open(runs.find(x=>x.run_id===l).report,'_blank');
      window.open(runs.find(x=>x.run_id===rr).report,'_blank');
    };
    function fmt(x){ return (x*100).toFixed(1)+'%'; }
    function renderCompare(){
      const L = runs.find(x=>x.run_id===leftSel.value) || runs[0];
      const R = runs.find(x=>x.run_id===rightSel.value) || runs[1] || runs[0];
      const body = document.getElementById('compareBody');
      body.innerHTML = cols.map(k=>{
        const d = (R[k]-L[k])*100; const sign = d>0?'+':'';
        const color = d>=0?'#7ee2a8':'#ffb17a';
        return `<tr><td>${k[0].toUpperCase()+k.slice(1)}</td><td>${fmt(L[k])}</td><td>${fmt(R[k])}</td><td style="color:${color}">${sign}${d.toFixed(1)}%</td></tr>`;
      }).join('');
    }
    leftSel.onchange = rightSel.onchange = renderCompare;
    if(runs.length>=2){ leftSel.value=runs[0].run_id; rightSel.value=runs[1].run_id; renderCompare(); }
  }
});
