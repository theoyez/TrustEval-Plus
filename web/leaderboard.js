
function auditCell(r){
  const status = (r.audit && r.audit.status) || 'ok';
  return `<span class="chev" data-run="${r.run_id}">▸ <span class="badge">${status}</span></span>`;
}
function rowDrawer(r){
  const a = r.audit || {};
  const trail = (a.trail||[]).map(t=>`<li><code>${t.doc}</code> · chunk <b>${t.chunk}</b> · score ${t.score}</li>`).join('');
  const cites = (a.citations||[]).map(c=>`<li><code>${c}</code></li>`).join('');
  return `<div class="drawer" id="drawer_${r.run_id}">
    <div class="grid">
      <div class="card"><b>Retrieval candidates</b><ul class="small">${trail||'<li class="small">—</li>'}</ul></div>
      <div class="card"><b>Citations used</b><ul class="small">${cites||'<li class="small">—</li>'}</ul></div>
      <div class="card"><b>Proof path</b><p class="small">${a.proof_path||'—'}</p></div>
    </div>
  </div>`;
}
function ROW_HTML(r){
  return `
    <tr class="row">
      <td>${r.run_id}</td>
      <td>${r.model||'—'}</td>
      <td class="right">${(r.accuracy*100).toFixed(1)}%</td>
      <td class="right">${(r.grounding*100).toFixed(1)}%</td>
      <td class="right">${(r.safety*100).toFixed(1)}%</td>
      <td class="right">${(r.robustness*100).toFixed(1)}%</td>
      <td class="right">${(r.bias*100).toFixed(1)}%</td>
      <td class="right">${(r.calibration*100).toFixed(1)}%</td>
      <td class="right"><b>${(r.trust_score*100).toFixed(1)}%</b></td>
      <td>${auditCell(r)}</td>
      <td><a href="${r.report}">Report</a></td>
    </tr>
    <tr><td colspan="11">${rowDrawer(r)}</td></tr>`;
}
window.addEventListener('DOMContentLoaded', ()=>load(MAP, ROW_HTML));
