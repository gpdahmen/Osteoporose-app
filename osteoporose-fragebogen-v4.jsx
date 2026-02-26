import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════ CSS ═══ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --D:#2c1f0e;--M:#5a4a38;--L:#8b6e4e;--P:#c8b89a;
  --CR:#f0ede8;--CL:#faf7f3;--CM:#e8dfd4;--G:#c8a070;
  --sh:0 2px 12px rgba(44,31,14,.08);
  --blu:#1e40af;--grn:#15803d;--red:#b91c1c;--amb:#b45309;--pur:#7e22ce;
}
body{font-family:'Source Sans 3',sans-serif;background:var(--CR);min-height:100vh}
.app{max-width:840px;margin:0 auto;padding:22px 16px 80px}

/* ─── LETTERHEAD ─── */
.lh-wrap{background:white;border:2px solid var(--P);border-radius:8px;margin-bottom:20px;overflow:hidden;box-shadow:var(--sh)}
.lh-display{padding:18px 22px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.lh-logo{width:42px;height:42px;background:var(--D);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;color:#e8ddd0}
.lh-text{flex:1}
.lh-name{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:var(--D);line-height:1.3}
.lh-title{font-size:12.5px;color:var(--L);font-weight:500;margin-top:2px}
.lh-addr{font-size:12px;color:#7a6a58;margin-top:3px;line-height:1.5}
.lh-contact{font-size:11.5px;color:#9a8a78;margin-top:2px}
.lh-edit-btn{background:none;border:1px solid var(--P);color:var(--L);font-size:11px;font-weight:600;padding:5px 10px;border-radius:4px;cursor:pointer;white-space:nowrap;transition:all .15s;font-family:'Source Sans 3',sans-serif}
.lh-edit-btn:hover{border-color:var(--L);background:var(--CL)}
.lh-form{border-top:1px solid var(--CM);padding:16px 22px;background:var(--CL)}
.lh-form-title{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--L);margin-bottom:12px}
.lh-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
@media(max-width:520px){.lh-grid{grid-template-columns:1fr}}
.lh-field label{display:block;font-size:11px;font-weight:600;color:var(--M);margin-bottom:3px;text-transform:uppercase;letter-spacing:.6px}
.lh-field input{width:100%;padding:7px 10px;border:1.5px solid var(--CM);border-radius:4px;font-size:13px;color:var(--D);background:white;outline:none;font-family:'Source Sans 3',sans-serif;transition:border-color .15s}
.lh-field input:focus{border-color:var(--L)}
.lh-btn-row{display:flex;gap:8px}
.lh-save{background:var(--D);color:#e8ddd0;border:none;padding:8px 18px;border-radius:4px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:'Source Sans 3',sans-serif}
.lh-cancel{background:white;color:var(--M);border:1px solid var(--P);padding:8px 14px;border-radius:4px;font-size:12.5px;cursor:pointer;font-family:'Source Sans 3',sans-serif}

/* ─── HEADER ─── */
.hdr{text-align:center;margin-bottom:24px;padding-bottom:18px;border-bottom:2px solid var(--P)}
.hdr-eye{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--L);margin-bottom:7px}
.hdr h1{font-family:'Playfair Display',serif;font-size:clamp(21px,5vw,33px);font-weight:700;color:var(--D);line-height:1.2;margin-bottom:8px}
.hdr-sub{font-size:13px;color:#7a6a58;line-height:1.6;max-width:580px;margin:0 auto 12px}
.badge{display:inline-block;background:var(--D);color:#e8ddd0;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:4px 12px;border-radius:2px}

/* ─── SAVE INDICATOR ─── */
.save-ind{display:flex;align-items:center;gap:7px;font-size:11.5px;padding:6px 12px;border-radius:4px;margin-bottom:14px;transition:all .3s;justify-content:center}
.save-ind.ok{background:#f0fdf4;color:#166534;border:1px solid #86efac}
.save-ind.saving{background:#fffbeb;color:#92400e;border:1px solid #fcd34d}
.save-ind.unsaved{background:#fff1f2;color:#991b1b;border:1px solid #fca5a5}
.save-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.save-ind.ok .save-dot{background:#16a34a}
.save-ind.saving .save-dot{background:#d97706;animation:pulse 1s infinite}
.save-ind.unsaved .save-dot{background:#dc2626}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}

/* ─── PROGRESS ─── */
.prog-wrap{margin-bottom:20px}
.prog-label{font-size:11.5px;color:#8b7a68;text-align:right;margin-bottom:4px;font-weight:500}
.prog-bar{height:5px;background:#ddd6cc;border-radius:3px;overflow:hidden}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--L),var(--G));border-radius:3px;transition:width .5s ease}

/* ─── PATIENT CARD ─── */
.pat-card{background:white;border:1.5px solid var(--P);border-radius:8px;padding:18px 20px;margin-bottom:16px;box-shadow:var(--sh)}
.pat-card-title{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:var(--D);margin-bottom:12px;padding-bottom:9px;border-bottom:1px solid var(--CM);display:flex;align-items:center;gap:8px}
.pat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:520px){.pat-grid{grid-template-columns:1fr}}
.pat-field label{display:block;font-size:11px;font-weight:600;color:var(--L);margin-bottom:4px;text-transform:uppercase;letter-spacing:.6px}
.pat-field input{width:100%;padding:8px 11px;border:1.5px solid var(--CM);border-radius:5px;font-size:13.5px;color:var(--D);background:white;outline:none;transition:border-color .15s;font-family:'Source Sans 3',sans-serif}
.pat-field input:focus{border-color:var(--L)}
.pat-gender-row{display:flex;gap:10px;margin-top:4px}
.gbtn{flex:1;padding:10px 14px;border:2px solid var(--P);border-radius:5px;background:white;cursor:pointer;font-size:14px;font-weight:600;color:var(--M);transition:all .2s;display:flex;align-items:center;gap:8px;justify-content:center;font-family:'Playfair Display',serif}
.gbtn:hover{border-color:var(--L);background:var(--CL)}
.gbtn.active{background:var(--D);border-color:var(--D);color:#e8ddd0;box-shadow:0 3px 12px rgba(44,31,14,.2)}
.fill-date-row{display:flex;align-items:center;gap:6px;margin-top:12px;font-size:12px;color:var(--L);font-style:italic}

/* ─── BMI PILL ─── */
.bmi-pill{background:var(--CL);border:1px solid var(--CM);border-radius:5px;padding:8px 14px;margin-bottom:12px;font-size:12.5px;color:var(--M)}

/* ─── SECTION ─── */
.sec{background:white;border-radius:8px;border:1px solid var(--CM);margin-bottom:13px;overflow:hidden;box-shadow:var(--sh)}
.sec-hdr{padding:14px 20px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;user-select:none;transition:background .15s}
.sec-hdr:hover{background:var(--CL)}
.sec-hdr.open{background:var(--D)}
.sec-icon{width:32px;height:32px;border-radius:50%;background:var(--CR);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.sec-hdr.open .sec-icon{background:rgba(255,255,255,.13)}
.sec-title{font-family:'Playfair Display',serif;font-size:14px;font-weight:600;color:var(--D)}
.sec-hdr.open .sec-title{color:#e8ddd0}
.sec-sub{font-size:11px;color:#a09080;margin-top:1px}
.sec-hdr.open .sec-sub{color:#c8b89a}
.chev{font-size:11px;color:#a09080;transition:transform .3s;flex-shrink:0}
.sec-hdr.open .chev{transform:rotate(180deg);color:#c8b89a}
.sec-body{padding:0 20px;max-height:0;overflow:hidden;transition:max-height .4s ease,padding .2s}
.sec-body.open{max-height:6000px;padding:4px 20px 18px}

/* ─── QUESTION ─── */
.q{padding:12px 0;border-bottom:1px solid #f0ebe4}
.q:last-child{border-bottom:none}
.q-label{font-size:13.5px;font-weight:500;color:var(--D);line-height:1.5;margin-bottom:5px}
.q-hint{font-size:11.5px;color:#8b7a68;line-height:1.5;margin-bottom:8px;font-style:italic}
.meds{background:var(--CL);border:1px solid #ece5d8;border-radius:5px;padding:10px 12px;margin-bottom:9px}
.meds-t{font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--L);margin-bottom:7px}
.meds-tags{display:flex;flex-wrap:wrap;gap:4px}
.med-tag{background:white;border:1px solid var(--CM);border-radius:3px;padding:2px 7px;font-size:11px;color:var(--M)}
.rg{display:flex;flex-direction:column;gap:5px}
.rg.h{flex-direction:row;flex-wrap:wrap}
.rl{display:flex;align-items:flex-start;gap:7px;cursor:pointer;padding:6px 10px;border:1.5px solid var(--CM);border-radius:5px;background:white;transition:all .15s;font-size:13px;color:#3a2c1e;line-height:1.4}
.rl:hover{border-color:var(--G);background:var(--CL)}
.rl.sel{border-color:var(--L);background:#fdf8f2}
.rl input{margin-top:2px;accent-color:var(--L);flex-shrink:0}
.num-in{padding:8px 11px;border:1.5px solid #d4c8b8;border-radius:5px;font-size:13.5px;color:var(--D);background:white;outline:none;transition:border-color .15s;width:120px;font-family:'Source Sans 3',sans-serif}
.num-in:focus{border-color:var(--L)}
.dxa-in{width:130px;padding:8px 11px;border:1.5px solid #d4c8b8;border-radius:5px;font-size:13.5px;color:var(--D);background:white;outline:none;transition:border-color .15s;font-family:'Source Sans 3',sans-serif}
.dxa-in:focus{border-color:var(--L)}

/* ─── BOTTOM ACTION BAR ─── */
.bottom-bar{background:white;border:1.5px solid var(--P);border-radius:10px;padding:20px 22px;margin-top:20px;box-shadow:0 4px 20px rgba(44,31,14,.1)}
.bottom-bar-title{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:var(--D);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.btn-row{display:flex;gap:9px;flex-wrap:wrap}
.btn-calc{background:var(--D);color:#e8ddd0;border:none;padding:11px 22px;border-radius:5px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:'Source Sans 3',sans-serif;transition:all .2s;display:flex;align-items:center;gap:7px}
.btn-calc:hover{background:#4a3420;box-shadow:0 4px 14px rgba(44,31,14,.25)}
.btn-pdf{background:white;color:var(--M);border:1.5px solid var(--P);padding:10px 18px;border-radius:5px;font-size:13px;font-weight:500;cursor:pointer;font-family:'Source Sans 3',sans-serif;transition:all .2s;display:flex;align-items:center;gap:7px}
.btn-pdf:hover{border-color:var(--L);background:var(--CL)}
.btn-txt{background:white;color:var(--M);border:1.5px solid var(--P);padding:10px 18px;border-radius:5px;font-size:13px;font-weight:500;cursor:pointer;font-family:'Source Sans 3',sans-serif;transition:all .2s;display:flex;align-items:center;gap:7px}
.btn-txt:hover{border-color:var(--L);background:var(--CL)}
.btn-reset{background:white;color:#b91c1c;border:1.5px solid #fca5a5;padding:10px 18px;border-radius:5px;font-size:13px;cursor:pointer;font-family:'Source Sans 3',sans-serif;transition:all .2s}
.btn-reset:hover{background:#fff1f2}
.btn-hist{background:#eff6ff;color:#1e40af;border:1.5px solid #93c5fd;padding:10px 18px;border-radius:5px;font-size:13px;font-weight:500;cursor:pointer;font-family:'Source Sans 3',sans-serif;transition:all .2s;display:flex;align-items:center;gap:7px}
.btn-hist:hover{background:#dbeafe}

/* ─── RESULT ─── */
.result{background:white;border:2px solid var(--D);border-radius:10px;padding:26px;margin-top:20px;box-shadow:0 8px 32px rgba(44,31,14,.12)}
.result-title{font-family:'Playfair Display',serif;font-size:19px;font-weight:700;color:var(--D);margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--CM)}
.thresh-row{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:16px}
.tp{flex:1;min-width:100px;padding:11px 12px;border-radius:7px;text-align:center;border:1.5px solid}
.tp-lbl{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:3px}
.tp-val{font-family:'Playfair Display',serif;font-size:20px;font-weight:700}
.tp-sub{font-size:10px;margin-top:2px}
.tp.yes{background:#fef2f2;border-color:#fca5a5}.tp.yes .tp-lbl{color:#b91c1c}.tp.yes .tp-val{color:#991b1b}.tp.yes .tp-sub{color:#b91c1c}
.tp.no{background:#f0fdf4;border-color:#86efac}.tp.no .tp-lbl{color:#15803d}.tp.no .tp-val{color:#166534}.tp.no .tp-sub{color:#15803d}
.tp.uk{background:#f8fafc;border-color:#cbd5e1}.tp.uk .tp-lbl{color:#64748b}.tp.uk .tp-val{color:#475569}.tp.uk .tp-sub{color:#64748b}
.rb{border-radius:8px;padding:15px 17px;margin-bottom:16px}
.rb.low{background:#f0fdf4;border:1.5px solid #86efac}
.rb.mod{background:#fffbeb;border:1.5px solid #fcd34d}
.rb.high{background:#fff1f2;border:1.5px solid #fca5a5}
.rb.top{background:#fdf4ff;border:1.5px solid #d8b4fe}
.rb-eye{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:3px}
.rb.low .rb-eye{color:#15803d}.rb.mod .rb-eye{color:#b45309}.rb.high .rb-eye{color:#b91c1c}.rb.top .rb-eye{color:#7e22ce}
.rb-h{font-family:'Playfair Display',serif;font-size:17px;font-weight:700}
.rb.low .rb-h{color:#15803d}.rb.mod .rb-h{color:#b45309}.rb.high .rb-h{color:#b91c1c}.rb.top .rb-h{color:#7e22ce}
.rb-d{font-size:12.5px;margin-top:6px;line-height:1.6}
.rb.low .rb-d{color:#166534}.rb.mod .rb-d{color:#92400e}.rb.high .rb-d{color:#991b1b}.rb.top .rb-d{color:#581c87}
.gen-ind{background:#fff7ed;border:1.5px solid #fdba74;border-radius:6px;padding:13px 15px;margin-bottom:15px}
.gen-ind-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#c2410c;margin-bottom:7px}
.gen-ind-item{font-size:12.5px;color:#9a3412;margin-bottom:3px}
.calc-box{background:var(--CL);border:1px solid var(--CM);border-radius:5px;padding:12px 14px;margin-bottom:14px}
.calc-lbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--L);margin-bottom:8px}
.calc-row{display:flex;justify-content:space-between;padding:4px 0;font-size:12.5px;color:var(--M);border-bottom:1px dashed #ece5d8}
.calc-row:last-child{border-bottom:none;font-weight:700;color:var(--D);font-size:13px;padding-top:6px}
.fbadge{display:inline-block;background:var(--D);color:#e8ddd0;font-size:10.5px;font-weight:700;padding:2px 7px;border-radius:3px}
.icd{display:inline-block;background:#e8f4fd;border:1px solid #93c5fd;color:#1e40af;font-size:10px;font-weight:600;padding:1px 5px;border-radius:3px;margin-left:4px;font-family:monospace}
.ftable{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px}
.ftable th{background:var(--D);color:#e8ddd0;padding:7px 10px;text-align:left;font-weight:600;font-size:11px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ftable td{padding:6px 10px;border-bottom:1px solid #f0ebe4;color:var(--M)}
.ftable tr:nth-child(even) td{background:#fdfaf7}
.result-note{background:var(--CL);border-left:3px solid var(--G);padding:11px 13px;border-radius:0 5px 5px 0;font-size:12px;color:var(--M);line-height:1.65}

/* ─── DIFF SECTION ─── */
.diff-card{background:#f0f9ff;border:1.5px solid #7dd3fc;border-radius:8px;padding:18px 20px;margin-bottom:16px}
.diff-title{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:#0c4a6e;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.diff-meta{font-size:11px;color:#0369a1;margin-bottom:10px;font-style:italic}
.diff-table{width:100%;font-size:11.5px;border-collapse:collapse}
.diff-table th{background:#0369a1;color:white;padding:6px 10px;text-align:left;font-size:10.5px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.diff-table td{padding:6px 10px;border-bottom:1px solid #bae6fd;vertical-align:top}
.diff-table tr:last-child td{border-bottom:none}
.diff-table tr:nth-child(even) td{background:#e0f2fe}
.diff-new{color:#15803d;font-weight:600}
.diff-old{color:#b91c1c}
.diff-same{color:#64748b}
.diff-none{text-align:center;padding:12px;color:#64748b;font-style:italic;font-size:12px}
.risk-badge{display:inline-block;font-size:10px;font-weight:700;padding:2px 7px;border-radius:3px}
.rb-low{background:#f0fdf4;color:#15803d;border:1px solid #86efac}
.rb-mod{background:#fffbeb;color:#b45309;border:1px solid #fcd34d}
.rb-high{background:#fff1f2;color:#b91c1c;border:1px solid #fca5a5}
.rb-top{background:#fdf4ff;color:#7e22ce;border:1px solid #d8b4fe}
.rb-na{background:#f1f5f9;color:#64748b;border:1px solid #cbd5e1}

/* ─── HISTORY PANEL ─── */
.hist-panel{background:white;border:1px solid var(--CM);border-radius:8px;padding:18px;margin-top:14px;box-shadow:var(--sh)}
.hist-title{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:var(--D);margin-bottom:12px}
.hist-item{padding:10px 12px;border:1px solid var(--CM);border-radius:6px;margin-bottom:7px;font-size:12.5px;cursor:pointer;transition:background .15s;display:flex;align-items:center;gap:10px}
.hist-item:hover{background:var(--CL)}
.hist-date{font-weight:700;color:var(--D);white-space:nowrap;font-size:12px}
.hist-pat{color:var(--M);flex:1;font-size:12px}
.hist-risk{flex-shrink:0}
.hist-del{background:none;border:none;color:#dc2626;cursor:pointer;padding:3px 6px;border-radius:3px;font-size:13px}
.hist-del:hover{background:#fee2e2}
.hist-empty{text-align:center;padding:18px;color:#8b7a68;font-style:italic;font-size:12.5px}
.hist-actions{display:flex;gap:8px;margin-bottom:10px}
.hist-load-btn{background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 11px;border-radius:4px;font-size:11.5px;cursor:pointer;font-family:'Source Sans 3',sans-serif}

/* ─── DISCLAIMER ─── */
.disclaimer{background:var(--CL);border:1px solid var(--CM);border-radius:6px;padding:12px 15px;margin-top:18px;font-size:11px;color:#8b7a68;line-height:1.65;text-align:center}

.action-strip{background:#2c1f0e;border-radius:8px;padding:11px 14px;margin-bottom:14px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.action-strip-title{font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#9a8a78;width:100%;margin-bottom:2px}
.as-btn{background:rgba(255,255,255,.15);color:#e8ddd0;border:1px solid rgba(255,255,255,.25);padding:7px 13px;border-radius:5px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:'Source Sans 3',sans-serif;white-space:nowrap}
.as-btn:hover{background:rgba(255,255,255,.28)}
.as-btn.hi{background:#c8a070;color:#2c1f0e;border-color:#c8a070}

/* ─── DVO THRESHOLD CHART ─── */
.dvo-chart-wrap{margin-top:18px;border:1.5px solid var(--P);border-radius:8px;overflow:hidden;background:white}
.dvo-chart-head{background:var(--D);color:#e8ddd0;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.dvo-chart-title{font-family:'Playfair Display',serif;font-size:13px;font-weight:700}
.dvo-chart-sub{font-size:10.5px;color:#c8b89a}
.dvo-chart-body{padding:12px 14px;overflow-x:auto}
.dvo-grid{border-collapse:collapse;font-size:11px;min-width:520px;width:100%}
.dvo-grid th{background:var(--D);color:#e8ddd0;padding:5px 7px;text-align:center;font-size:10px;letter-spacing:.5px;font-weight:600;border:1px solid #4a3420}
.dvo-grid td{padding:5px 7px;text-align:center;border:1px solid #e8dfd4;font-size:11px;font-weight:600;color:#2c1f0e}
.dvo-grid td.c0{background:#f0ede8;color:#c8b89a;font-weight:400}
.dvo-grid td.c-low{background:#92d050;color:#1a3a00;font-weight:700}
.dvo-grid td.c-mod{background:#ffff00;color:#5a4a00;font-weight:700}
.dvo-grid td.c-high{background:#ff9999;color:#6b0000;font-weight:700}
.dvo-grid td.c-top{background:#ff0000;color:#fff;font-weight:700}
.dvo-grid td.current{box-shadow:inset 0 0 0 3px #c8a070;font-size:12.5px}
.dvo-legend{display:flex;flex-wrap:wrap;gap:8px;padding:10px 14px;background:var(--CL);border-top:1px solid var(--CM)}
.dvo-legend-item{display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--M)}
.dvo-legend-dot{width:12px;height:12px;border-radius:2px;flex-shrink:0}
.dvo-note{padding:8px 14px;font-size:10px;color:#8b7a68;border-top:1px solid var(--CM);line-height:1.5}
.disclaimer-gate{background:white;border:2px solid var(--P);border-radius:8px;padding:20px 22px;margin-bottom:18px;box-shadow:var(--sh)}
.disclaimer-gate.accepted{border-color:#86efac;background:#f0fdf4}
.disclaimer-gate-title{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--D);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.disclaimer-gate-text{font-size:12.5px;color:#5a4a38;line-height:1.7;margin-bottom:16px;padding:12px 14px;background:var(--CL);border-radius:6px;border-left:3px solid var(--G)}
.disclaimer-gate-check{display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:10px 12px;border-radius:6px;transition:background .15s}
.disclaimer-gate-check:hover{background:var(--CL)}
.disclaimer-gate-check input[type=checkbox]{width:18px;height:18px;flex-shrink:0;margin-top:1px;cursor:pointer;accent-color:var(--D)}
.disclaimer-gate-check span{font-size:13px;font-weight:600;color:var(--D);line-height:1.5}
.disclaimer-gate-blocked{margin-top:12px;padding:9px 13px;background:#fff1f2;border:1px solid #fca5a5;border-radius:5px;font-size:12px;color:#b91c1c;font-weight:600;text-align:center}
/* ─── MED INPUT ─── */
.med-input-wrap{margin-top:10px;background:var(--CL);border:1px solid #ece5d8;border-radius:7px;overflow:hidden}
.med-input-header{padding:9px 13px;font-size:12px;font-weight:600;color:var(--M);display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.med-input-header>span{flex:1;min-width:100px}
.med-list-btn{background:none;border:1px solid var(--P);cursor:pointer;font-size:11px;color:var(--L);font-weight:600;padding:4px 10px;border-radius:4px;font-family:'Source Sans 3',sans-serif;white-space:nowrap}
.med-list-btn:hover{background:white}
.med-list-body{max-height:0;overflow:hidden;transition:max-height .35s ease}
.med-list-body.open{max-height:800px}
.med-list-inner{padding:0 13px 11px;border-top:1px solid #ece5d8}
.med-group-title{font-size:10px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:var(--L);margin:9px 0 5px}
.med-chips{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px}
.med-chip{background:white;border:1px solid var(--CM);border-radius:3px;padding:4px 9px;font-size:11px;color:var(--M);cursor:pointer;transition:all .15s;user-select:none}
.med-chip:hover{background:#fff3e0;border-color:var(--G);color:var(--D)}
.med-chip.added{background:#fdf8f2;border-color:var(--L);color:var(--D);font-weight:600}
.rx-area{padding:9px 13px;border-top:1px solid #ece5d8}
.rx-lbl{font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:var(--L);margin-bottom:6px}
.rx-tags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:6px}
.rx-tag{background:var(--D);color:#e8ddd0;border-radius:4px;padding:3px 8px 3px 10px;font-size:11.5px;display:flex;align-items:center;gap:6px}
.rx-tag-del{background:none;border:none;color:#c8b89a;cursor:pointer;font-size:14px;padding:0;line-height:1}
.rx-tag-del:hover{color:white}
.rx-row{display:flex;gap:7px;margin-top:4px}
.rx-text{flex:1;padding:7px 10px;border:1.5px solid var(--CM);border-radius:4px;font-size:12.5px;color:var(--D);background:white;outline:none;font-family:'Source Sans 3',sans-serif}
.rx-text:focus{border-color:var(--L)}
.rx-add{background:var(--D);color:#e8ddd0;border:none;padding:7px 13px;border-radius:4px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Source Sans 3',sans-serif}
.rx-add:hover{background:#4a3420}
.rx-cell{font-size:11px;color:#7a6a58;font-style:italic}
.viewer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:2000;display:flex;flex-direction:column;animation:fadeInBg .15s ease}
.viewer-bar{background:#2c1f0e;color:#e8ddd0;padding:10px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0}
.viewer-bar-title{flex:1;font-size:14px;font-weight:700;font-family:'Playfair Display',serif}
.viewer-btn{background:#4a3420;border:none;color:#e8ddd0;padding:8px 16px;border-radius:5px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:'Source Sans 3',sans-serif;white-space:nowrap}
.viewer-btn:hover{background:#6b4c2e}
.viewer-btn.primary{background:var(--L);color:white}
.viewer-btn.primary:hover{background:#b07540}
.viewer-close{background:none;border:none;color:#c8b89a;font-size:22px;cursor:pointer;line-height:1;padding:0 4px}
.viewer-close:hover{color:white}
.viewer-body{flex:1;overflow:auto;background:#f5f0e8;display:flex;flex-direction:column}
.viewer-txt{flex:1;margin:0;padding:20px 24px;font-family:'Courier New',monospace;font-size:12.5px;line-height:1.7;white-space:pre;color:#1a1208;background:#f5f0e8;border:none;resize:none;outline:none;width:100%;box-sizing:border-box}
.viewer-iframe{flex:1;border:none;background:white}
.admin-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:3000;display:flex;align-items:center;justify-content:center}
.admin-panel{background:white;border-radius:10px;width:min(900px,95vw);max-height:90vh;display:flex;flex-direction:column;box-shadow:0 12px 50px rgba(0,0,0,.3);overflow:hidden}
.admin-head{background:#1a1208;color:#e8ddd0;padding:14px 20px;display:flex;align-items:center;gap:12px;flex-shrink:0}
.admin-head-title{flex:1;font-family:'Playfair Display',serif;font-size:16px;font-weight:700}
.admin-pin-wrap{display:flex;align-items:center;gap:10px;padding:20px;border-bottom:1px solid #ece5d8;background:#fdf9f4}
.admin-pin-input{padding:9px 14px;border:1.5px solid var(--CM);border-radius:5px;font-size:14px;font-family:'Source Sans 3',sans-serif;width:120px;letter-spacing:4px}
.admin-pin-input:focus{outline:none;border-color:var(--L)}
.admin-pin-btn{background:var(--D);color:#e8ddd0;border:none;padding:9px 18px;border-radius:5px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Source Sans 3',sans-serif}
.admin-pin-btn:hover{background:#4a3420}
.admin-pin-err{color:#c0392b;font-size:12px;font-weight:600}
.admin-table-wrap{flex:1;overflow:auto;padding:0}
.admin-table{width:100%;border-collapse:collapse;font-size:12.5px}
.admin-table th{background:#2c1f0e;color:#e8ddd0;padding:10px 12px;text-align:left;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;position:sticky;top:0;z-index:1}
.admin-table tr:nth-child(even){background:#fdf9f4}
.admin-table tr:hover{background:#fef3e6}
.admin-table td{padding:8px 12px;border-bottom:1px solid #ece5d8;vertical-align:middle}
.admin-td-id{font-family:monospace;font-size:11px;color:#8b7a68;white-space:nowrap}
.admin-input{width:100%;padding:5px 8px;border:1px solid #d4c4a8;border-radius:4px;font-size:12px;font-family:'Source Sans 3',sans-serif;background:white;box-sizing:border-box}
.admin-input:focus{outline:none;border-color:var(--L);background:#fffbf5}
.admin-icd-input{width:90px;padding:5px 8px;border:1px solid #d4c4a8;border-radius:4px;font-size:12px;font-family:monospace;background:white;box-sizing:border-box;text-transform:uppercase}
.admin-icd-input:focus{outline:none;border-color:var(--L)}
.admin-icd-input.invalid{border-color:#c0392b;background:#fff0f0}
.admin-footer{padding:14px 20px;background:#fdf9f4;border-top:1px solid #ece5d8;display:flex;gap:10px;justify-content:flex-end;flex-shrink:0}
.admin-save-btn{background:var(--L);color:white;border:none;padding:10px 22px;border-radius:5px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Source Sans 3',sans-serif}
.admin-save-btn:hover{background:#b07540}
.admin-reset-btn{background:white;color:var(--M);border:1.5px solid var(--CM);padding:10px 18px;border-radius:5px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Source Sans 3',sans-serif}
.admin-reset-btn:hover{border-color:var(--L);background:var(--CL)}
/* ══════════ PRINT ══════════ */
@media print{
  @page{size:A4;margin:12mm 13mm}
  body{background:white!important;font-size:10px}
  .no-print{display:none!important}
  .app{padding:0;max-width:100%}
  /* letterhead in print */
  .lh-wrap{border:1px solid #bbb;margin-bottom:14px;box-shadow:none}
  .lh-form{display:none}
  .lh-edit-btn{display:none}
  /* patient card */
  .pat-card{border:1px solid #bbb;box-shadow:none}
  .pat-gender-row{display:none}
  /* sections */
  .sec{box-shadow:none;border:1px solid #ccc;page-break-inside:avoid;margin-bottom:9px}
  .sec-body{max-height:none!important;padding:4px 20px 14px!important;overflow:visible!important}
  .sec-hdr{background:#2c1f0e!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .sec-hdr .sec-title{color:#e8ddd0!important}.sec-hdr .sec-sub{color:#c8b89a!important}
  .sec-hdr .sec-icon{background:rgba(255,255,255,.15)!important}
  .chev,.prog-wrap,.save-ind{display:none!important}
  /* result */
  .result{page-break-before:always;border:1px solid #2c1f0e;box-shadow:none}
  .tp,.rb,.ftable th,.calc-box,.meds,.diff-card,.diff-table th,.gen-ind{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .bottom-bar,.hist-panel{display:none!important}
  /* show only answered questions in print */
  .q.unanswered{display:none}
  /* print header */
  .print-hdr{display:block!important}
}
.print-hdr{display:none}
@media(max-width:520px){
  .sec-hdr{padding:12px 14px}.sec-body.open{padding:4px 14px 14px}
  .result{padding:18px 14px}.btn-row{flex-direction:column}
  .thresh-row{flex-direction:column}.lh-grid{grid-template-columns:1fr}
}
`;

/* ═══════════════════════ THRESHOLD TABLES (DVO 2023, Tabelle 3.2) ═══ */
const THRESH={
  f:{
    3:{50:[13,13,9,7,5,4,3,2.1,1.5,null],55:[8,8,6,5,3.5,2.6,1.9,1.4,null,null],60:[5,6,4,3,2.4,1.8,1.3,null,null,null],65:[3,4,3,2.3,1.7,1.2,null,null,null,null],70:[1.7,3,2.2,1.6,1.2,null,null,null,null,null],75:[1.1,2.3,1.7,1.2,null,null,null,null,null,null],80:[null,1.8,1.3,null,null,null,null,null,null,null],85:[null,1.5,1.1,null,null,null,null,null,null,null],90:[null,1.2,null,null,null,null,null,null,null,null]},
    5:{50:[22,21,16,12,9,6,5,3.5,2.5,2],55:[13,14,10,8,6,4,3,2.3,1.7,null],60:[8,10,7,5,4,3,2.2,1.6,null,null],65:[5,7,5,4,3,2.1,1.5,null,null,null],70:[2.8,5,4,2.7,2.0,1.5,1.1,null,null,null],75:[1.8,4,3,2.1,1.5,1.1,null,null,null,null],80:[1.1,3,2.2,1.6,1.2,null,null,null,null,null],85:[null,2.4,1.8,1.3,null,null,null,null,null,null],90:[null,2,1.4,null,null,null,null,null,null,null]},
    10:{50:[43,42,31,23,17,13,9,7,5,3.7],55:[25,28,21,16,12,9,6,5,3.5,2.5],60:[15,19,14,11,8,6,4.4,3.2,2.4,1.7],65:[9,14,10,7.5,6,4,3.1,2.3,1.7,null],70:[6,10,7,5.5,4.1,3,2.2,1.6,null,null],75:[3.5,8,6,4.2,3.1,2.2,1.6,1.2,null,null],80:[2.2,6,4.4,3.2,2.4,1.7,1.3,null,null,null],85:[1.4,5,3.6,2.6,1.9,1.3,null,null,null,null],90:[null,4,3,2.1,1.5,null,null,null,null,null]}
  },
  m:{
    3:{50:[12,10,7,5,3.4,2.3,1.6,1.1,null,null],55:[9,8,5,3.7,2.5,1.7,1.2,null,null,null],60:[6,6,4,2.8,1.9,1.3,null,null,null,null],65:[5,5,3,2.2,1.5,null,null,null,null,null],70:[3,4,2.5,1.7,1.1,null,null,null,null,null],75:[2.4,3,2,1.4,null,null,null,null,null,null],80:[1.6,2.4,1.6,1.1,null,null,null,null,null,null],85:[null,2,1.3,null,null,null,null,null,null,null],90:[null,1.4,1,null,null,null,null,null,null,null]},
    5:{50:[19,17,12,8,6,4,2.6,1.8,null,null],55:[14,13,9,6,4,2.9,2,null,null,null],60:[11,10,7,5,3.2,2.2,1.5,null,null,null],65:[8,8,5,3.6,2.4,1.6,null,null,null,null],70:[6,6,4,2.8,1.9,1.3,null,null,null,null],75:[4,5,3.4,2.3,1.5,null,null,null,null,null],80:[2.7,4,2.7,1.8,1.2,null,null,null,null,null],85:[1.6,3.3,2.1,1.4,null,null,null,null,null,null],90:[null,2.4,1.5,null,null,null,null,null,null,null]},
    10:{50:[39,33,23,16,11,8,5,3.6,2.5,1.7],55:[29,26,18,12,8,6,4,2.6,1.8,null],60:[21,20,14,9,6,4,3,1.9,null,null],65:[15,16,11,7,5,3,2.2,1.5,null,null],70:[11,12,8,6,4,2.5,1.7,null,null,null],75:[8,10,7,4.5,3,2.0,1.3,null,null,null],80:[5,8,5,3.6,2.4,1.6,null,null,null,null],85:[3.2,7,4,2.8,1.8,1.2,null,null,null,null],90:[1.6,5,3,2,1.3,null,null,null,null,null]}
  }
};
function tCol(t){if(!t&&t!==0)return 0;const v=parseFloat(t);if(isNaN(v))return 0;if(v>=0)return 1;if(v>=-0.5)return 2;if(v>=-1.0)return 3;if(v>=-1.5)return 4;if(v>=-2.0)return 5;if(v>=-2.5)return 6;if(v>=-3.0)return 7;if(v>=-3.5)return 8;return 9;}
function ageRow(age){const a=Math.max(50,Math.min(90,parseInt(age)||65));return[50,55,60,65,70,75,80,85,90].reduce((b,r)=>Math.abs(r-a)<Math.abs(b-a)?r:b,50);}
function getTh(g,p,age,t){const r=ageRow(age);const c=tCol(t);return THRESH[g]?.[p]?.[r]?.[c]??null;}

/* ═══════════════════════════════════════════════ SECTIONS DATA ═══ */
const M=(t,i)=>({title:t,items:i});
const SECTIONS=[
  {id:"frakturen",icon:"🦴",title:"Frühere Knochenbrüche",sub:"Fragilitätsfrakturen (kein schwerer Unfall)",qs:[
    {id:"hueft_akut",t:"yn",label:"Hüftbruch (Schenkelhals) in den letzten 12 Monaten?",faktor:4.1,icd:"S72.0, M80.05",hint:"Niedrig-traumatisch = Bruch durch Alltagsbewegung oder Sturz aus Standhöhe."},
    {id:"hueft_alt",t:"yn",label:"Hüftbruch – vor mehr als 12 Monaten?",faktor:2.5,icd:"S72.0, Z87.39"},
    {id:"wirbelbruch_akut",t:"yn",label:"Wirbelkörperbruch in den letzten 12 Monaten?",faktor:2.9,icd:"S22, M80.08"},
    {id:"wirbelbruch_anz",t:"radio",label:"Wirbelkörperbrüche insgesamt (älter als 12 Monate)?",icd:"M80.08",
      opts:["Keiner","1 Wirbelbruch","2 Wirbelbrüche","3 oder mehr Wirbelbrüche"],
      fmap:{"1 Wirbelbruch":2.0,"2 Wirbelbrüche":2.9,"3 oder mehr Wirbelbrüche":5.0}},
    {id:"humerus",t:"yn",label:"Oberarmbruch (Humerusfraktur)?",faktor:1.7,icd:"S42.2, M80.02"},
    {id:"becken",t:"yn",label:"Beckenbruch (Beckenfraktur)?",faktor:1.7,icd:"S32, M80.0"},
    {id:"unterarm",t:"yn",label:"Unterarmbruch (Radiusfraktur)?",faktor:1.6,icd:"S52, M80.03"},
    {id:"eltern",t:"yn",label:"Hat ein Elternteil einen Hüftbruch erlitten?",faktor:1.3,icd:"Z82.61",hint:"Nur relevant bis zum 75. Lebensjahr."},
  ]},
  {id:"meds",icon:"💊",title:"Medikamente – Knochen & Sturzrisiko",sub:"Regelmäßig eingenommene Medikamente mit Einfluss auf Knochen oder Sturzrisiko",qs:[
    {id:"glukokortikoide",t:"radio",label:"Nehmen Sie Kortison-Tabletten (z. B. Prednisolon, Decortin®) – seit mehr als 3 Monaten?",
      hint:"Kortison-Tabletten und -Säfte hemmen den Knochenaufbau stark. Asthma-Inhalationssprays und Nasensprays zählen nicht.",icd:"Z79.52, M81.4",
      opts:["Nein","Sehr niedrige Dosis (< 2,5 mg Prednisolon/Tag)","Mittlere Dosis (2,5–7,5 mg Prednisolon/Tag)","Hohe Dosis (> 7,5 mg Prednisolon/Tag)","Hohe Dosis – erst kürzlich begonnen oder erhöht"],
      fmap:{"Sehr niedrige Dosis (< 2,5 mg Prednisolon/Tag)":1.4,"Mittlere Dosis (2,5–7,5 mg Prednisolon/Tag)":2.0,"Hohe Dosis (> 7,5 mg Prednisolon/Tag)":2.9,"Hohe Dosis – erst kürzlich begonnen oder erhöht":4.9},
      meds:M("Orale Glukokortikoide",["Prednisolon (Decortin®, Prednigalen®, Prednisolon GALEN®, Prednisolon AL®, Hefasolon®)","Methylprednisolon (Medrol®, Urbason®, Methylprednisolon JENAPHARM®)","Dexamethason (Fortecortin®, Dexa-ratiopharm®, Dexabene®, Dexamethason JENAPHARM®)","Betamethason (Celestamine® N, Celestan®)","Prednison (Prednison acis®)","Cortison (Cortison CIBA®)","Triamcinolon (Volon A®, Triamhexal®)","Budesonid oral (Budenofalk®, Entocort®)","Hydrocortison (Hydrocortison GALEN®, Kortison H Hoechst®)","Deflazacort (Calcort®)"])},
    {id:"ppi",t:"yn",label:"Nehmen Sie täglich Magenschutz-Tabletten gegen Sodbrennen oder Magensäure – seit mehr als 3 Monaten?",faktor:1.4,icd:"Z79.899",
      hint:"Gemeint sind Protonenpumpenhemmer wie Pantoprazol oder Omeprazol. Sie werden oft langfristig verordnet und können die Kalziumaufnahme vermindern.",
      meds:M("Protonenpumpenhemmer (PPI)",["Omeprazol (Antra®, Omep®, Omeprazol-ratiopharm®, Omeprazol AL®)","Pantoprazol (Pantozol®, Pantoloc®, Pantoprazol-ratiopharm®, Pantoprazol AL®, Panto-Byk®)","Esomeprazol (Nexium®, Emanera®, Esomeprazol Sandoz®)","Lansoprazol (Agopton®, Lanzor®, Lansoprazol-ratiopharm®)","Rabeprazol (Pariet®)","Dexlansoprazol (Dexilant®)"])},
    {id:"antidepressiva",t:"yn",label:"Nehmen Sie Medikamente gegen Depression oder Stimmungstiefs (Antidepressiva)?",faktor:1.3,icd:"T43",
      hint:"Antidepressiva – auch die neueren, gut verträglichen Mittel (z. B. Sertralin, Citalopram) – erhöhen das Sturz- und Knochenbruchrisiko.",
      meds:M("Antidepressiva (SSRI / SNRI / TZA und andere)",["Citalopram (Cipramil®, Citalopram-ratiopharm®, Citalopram AL®)","Escitalopram (Cipralex®, Escitalopram-ratiopharm®, Escitalopram AL®)","Sertralin (Zoloft®, Sertralin-ratiopharm®, Sertralin AL®, Sertralin Heumann®)","Fluoxetin (Fluctin®, Fluoxetin-ratiopharm®, Fluoxetin AL®)","Fluvoxamin (Fevarin®)","Paroxetin (Seroxat®, Paroxat®, Paroxetin-ratiopharm®)","Venlafaxin (Trevilor®, Efexor®, Venlafaxin-ratiopharm®, Venlafaxin AL®)","Duloxetin (Cymbalta®, Yentreve®, Duloxetin-ratiopharm®)","Mirtazapin (Remergil®, Mirtazapin-ratiopharm®, Mirtazapin AL®)","Amitriptylin (Saroten®, Amineurin®, Amitriptylin-ratiopharm®)","Nortriptylin (Nortrilen®)","Doxepin (Aponal®, Sinquan®, Doxepin-ratiopharm®)","Imipramin (Tofranil®)","Clomipramin (Anafranil®)","Trimipramin (Stangyl®)","Bupropion (Wellbutrin®, Elontril®)","Vortioxetin (Brintellix®, Trintellix®)","Moclobemid (Aurorix®)","Tranylcypromin (Jatrosom®)","Agomelatin (Valdoxan®)","Trazodon (Trittico®)","Reboxetin (Edronax®, Solvex®)"])},
    {id:"opioide",t:"yn",label:"Nehmen Sie starke Schmerzmittel auf Opioid-Basis (z. B. Morphin, Oxycodon, Tramadol)?",faktor:1.4,icd:"Z79.891",
      hint:"Starke Schmerzmittel wie Morphin, Oxycodon, Tramadol oder Fentanyl-Pflaster erhöhen das Sturzrisiko (Schwindel, Benommenheit) und wirken sich direkt negativ auf den Knochen aus.",
      meds:M("Opioidanalgetika",["Tramadol (Tramal®, Tramadolor®, Tramabeta®, Tramadol-ratiopharm®, Tramadol AL®)","Tilidin + Naloxon (Valoron N®, Tilidin-ratiopharm plus®, Tilidin AL comp®)","Codein (z. B. in Kombipräparaten, Hustensäften)","Dihydrocodein (DHC Mundipharma®)","Morphin (MST Mundipharma®, Sevredol®, Morphin-ratiopharm®, Capros®)","Oxycodon (Oxygesic®, Oxycodon-ratiopharm®, OxyContin®)","Oxycodon + Naloxon (Targin®, Oxycodon/Naloxon-ratiopharm®)","Hydromorphon (Palladon®, Jurnista®)","Buprenorphin TD (Transtec®, Norspan®, BuTrans®)","Buprenorphin SL (Temgesic®, Subutex®)","Fentanyl (Durogesic®, Actiq®, Abstral®, Effentora®, Instanyl®, PecFent®)","Tapentadol (Palexia®, Palexia® retard)","Methadon (L-Polamidon®)","Piritramid (Dipidolor®)","Pethidin (Dolantin®)"])},
    {id:"antipsychotika",t:"yn",label:"Nehmen Sie Medikamente gegen Psychosen, starke Unruhe oder Wahnvorstellungen (Neuroleptika)?",faktor:1.3,icd:"Z79.899",
      hint:"Diese Medikamente (z. B. Haloperidol, Quetiapin, Risperidon) erhöhen das Sturzrisiko und beeinflussen den Knochenstoffwechsel über den Hormonhaushalt.",
      meds:M("Antipsychotika / Neuroleptika",["Haloperidol (Haldol®, Haloperidol-ratiopharm®, Haloperidol NEURAXPHARM®)","Risperidon (Risperdal®, Risperidon-ratiopharm®, Risperidon AL®)","Olanzapin (Zyprexa®, Olanzapin-ratiopharm®, Olanzapin AL®)","Quetiapin (Seroquel®, Quetiapin-ratiopharm®, Quetiapin AL®)","Clozapin (Leponex®, Clozapin-ratiopharm®)","Aripiprazol (Abilify®, Aripiprazol-ratiopharm®)","Amisulprid (Solian®, Amisulprid-ratiopharm®)","Ziprasidon (Zeldox®)","Paliperidon (Invega®, Xeplion®)","Cariprazin (Reagila®)","Brexpiprazol (Rxulti®)","Lurasidon (Latuda®)","Asenapin (Sycrest®)","Flupentixol (Fluanxol®)","Zuclopenthixol (Ciatyl-Z®)","Melperon (Eunerpan®)","Pipamperon (Dipiperon®)","Sulpirid (Dogmatil®)","Tiaprid (Tiapridex®)","Perazin (Taxilan®)","Levomepromazin (Neurocil®)","Promethazin (Atosil®)","Prothipendyl (Dominal®)"])},
    {id:"sedativa",t:"yn",label:"Nehmen Sie regelmäßig Beruhigungs- oder Schlafmittel (Benzodiazepine oder Z-Substanzen)?",faktor:1.3,icd:"Z79.899",
      hint:"Mittel wie Diazepam (Valium®), Lorazepam (Tavor®), Zolpidem (Stilnox®) oder Zopiclon können tagsüber Schläfrigkeit und verlangsamte Reflexe verursachen und dadurch das Sturzrisiko erhöhen.",
      meds:M("Benzodiazepine und Z-Substanzen",["Diazepam (Valium®, Faustan®, Diazepam-ratiopharm®, Diazepam Desitin®)","Lorazepam (Tavor®, Lorazepam-ratiopharm®, Lorazepam neuraxpharm®)","Alprazolam (Xanax®, Tafil®, Alprazolam-ratiopharm®)","Oxazepam (Adumbran®, Praxiten®, Oxazepam-ratiopharm®)","Temazepam (Planum®, Remestan®)","Nitrazepam (Mogadan®, Novanox®)","Flunitrazepam (Rohypnol®)","Clobazam (Frisium®)","Chlordiazepoxid (Librium®)","Bromazepam (Lexotanil®, Normoc®)","Clonazepam (Rivotril®)","Zolpidem (Stilnox®, Zolpidem-ratiopharm®, Zolpidem AL®)","Zopiclon (Ximovan®, Optidorm®, Zopiclon-ratiopharm®)","Zaleplon (Sonata®)","Melatonin retard (Circadin®, Slenyto®)"])},
    {id:"schilddruese",t:"radio",label:"Nehmen Sie Schilddrüsenhormone (z. B. L-Thyroxin) – und ist Ihr TSH-Wert dabei erniedrigt?",icd:"Z79.899",
      hint:"Schilddrüsenhormone sind erst dann ein Risiko für die Knochen, wenn die Dosis zu hoch ist – erkennbar an einem TSH unter 0,5 mU/l im Blutbild.",
      opts:["Nein / kein Schilddrüsenhormon oder TSH normal","TSH leicht erniedrigt (0,1–0,45 mU/l)","TSH stark erniedrigt (< 0,1 mU/l)"],
      fmap:{"TSH leicht erniedrigt (0,1–0,45 mU/l)":1.2,"TSH stark erniedrigt (< 0,1 mU/l)":1.2},
      meds:M("Schilddrüsenhormone",["Levothyroxin (Euthyrox®, L-Thyrox® HEXAL, Berlthyrox®, Eutirox®, Levothyroxin HENNING®, L-Thyrox® AbZ)","Liothyronin (Thybon®)","Kombination: Novothyral® (Levothyroxin + Liothyronin)"])},
    {id:"glitazone",t:"yn",label:"Nehmen Sie Pioglitazon (Actos®) gegen Diabetes?",faktor:1.3,icd:"Z79.899",
      hint:"Pioglitazon (Wirkstoffgruppe: Glitazone/Thiazolidindione) ist ein Blutzuckermittel, das – besonders bei Frauen – das Knochenbruchrisiko erhöht.",
      meds:M("Glitazone",["Pioglitazon (Actos®, Pioglitazon-ratiopharm®, Pioglitazon Sandoz®, Pioglitazon Teva®, Competact® + Metformin, Tandemact® + Glimepirid, Zomarist® + Sitagliptin)"])},
    {id:"antikonvulsiva",t:"yn",label:"Nehmen Sie Medikamente gegen Epilepsie oder Krampfanfälle (Antiepileptika)?",faktor:1.2,icd:"Z79.899",
      hint:"Viele Antiepileptika (z. B. Carbamazepin, Valproat, Phenytoin) beschleunigen den Vitamin-D-Abbau und erhöhen das Sturzrisiko. Auch Pregabalin und Gabapentin, die oft gegen Nervenschmerzen eingesetzt werden, zählen dazu.",
      meds:M("Antikonvulsiva / Antiepileptika",["Valproinsäure/Valproat (Depakine®, Orfiril®, Ergenyl®, Valpro AL®)","Carbamazepin (Tegretal®, Timonil®, Carbamazepin-ratiopharm®)","Phenytoin (Phenhydan®, Epanutin®)","Phenobarbital (Luminal®, Phenobarbital-neuraxpharm®)","Primidon (Liskantin®, Mylepsinum®)","Lamotrigin (Lamictal®, Lamotrigin-ratiopharm®, Lamotrigin AL®)","Levetiracetam (Keppra®, Levetiracetam-ratiopharm®, Levetiracetam AL®)","Topiramat (Topamax®, Topiramat-ratiopharm®)","Gabapentin (Neurontin®, Gabapentin-ratiopharm®, Gabapentin AL®)","Pregabalin (Lyrica®, Pregabalin-ratiopharm®, Pregabalin AL®)","Oxcarbazepin (Trileptal®)","Eslicarbazepinacetat (Zebinix®)","Lacosamid (Vimpat®)","Zonisamid (Zonegran®)","Perampanel (Fycompa®)","Brivaracetam (Briviact®)","Vigabatrin (Sabril®)","Clonazepam (Rivotril®)"])},
    {id:"orthostase",t:"yn",label:"Nehmen Sie Blutdruckmittel, Wassertabletten oder Prostatamittel, die beim Aufstehen Schwindel verursachen können?",faktor:1.2,icd:"Z79.899",
      hint:"Manche Medikamente lassen den Blutdruck beim raschen Aufstehen kurz abfallen (Orthostase). Das kann zu Schwindel und Stürzen führen. Typisch: Betablocker, ACE-Hemmer, Diuretika (Wassertabletten), Alpha-Blocker bei Prostatabeschwerden.",
      meds:M("Orthostase-auslösende Medikamente",["Alpha-1-Blocker: Tamsulosin (Alna®, Tamsulosin-ratiopharm®), Alfuzosin (Urion®), Doxazosin (Diblocin®), Terazosin (Flotrin®)","Antihypertensiva: ACE-Hemmer, Sartane, Kalziumantagonisten, Betablocker","Diuretika: Furosemid (Lasix®), Torasemid (Torem®, Unat®), HCT-Kombinationen","Nitrate: Glyceroltrinitrat (Nitrolingual®), Isosorbidmononitrat (Mono Mack®)","Dopaminagonisten: Levodopa-Kombinationen, Pramipexol (Sifrol®), Ropinirol (Requip®), Rotigotin (Neupro®)","Anticholinergika: Oxybutynin (Ditropan®), Tolterodin (Detrusitol®)"])},
  ]},
  {id:"meds_f",icon:"🌸",title:"Medikamente – nur Frauen",sub:"Hormonbezogene Osteoporose-Risiken",onlyFor:"f",qs:[
    {id:"aromatasehemmer",t:"yn",label:"Nehmen Sie Aromatasehemmer (Medikamente nach Brustkrebs, die Östrogen blockieren)?",faktor:1.7,icd:"Z79.811",hint:"Aromatasehemmer (z. B. Anastrozol, Letrozol, Exemestan) senken den Östrogenspiegel auf nahezu null. Das führt zu raschem Knochenverlust.",
      meds:M("Aromatasehemmer (in Deutschland zugelassen)",["Anastrozol (Arimidex®, Anastrozol-ratiopharm®, Anastrozol Sandoz®, Anastrozol Heumann®, Anastrozol AL®)","Letrozol (Femara®, Letrozol-ratiopharm®, Letrozol Sandoz®, Letrozol AL®, Letrozol Heumann®)","Exemestan (Aromasin®, Exemestan-ratiopharm®, Exemestan Teva®)"])},
    {id:"fruehe_meno",t:"yn",label:"Hatten Sie die Wechseljahre vor dem 45. Lebensjahr oder wurden beide Eierstöcke entfernt?",faktor:1.5,icd:"N95.0, Z90.71",
      hint:"Eine früh einsetzende Menopause oder operative Entfernung der Eierstöcke bedeutet einen langen Zeitraum ohne schützende Östrogenwirkung auf den Knochen."},
    {id:"gnrh_f",t:"yn",label:"Nehmen Sie hormonunterdrückende Spritzen oder Implantate (GnRH-Agonisten) gegen Endometriose oder Brustkrebs?",faktor:1.7,icd:"Z79.818",hint:"Diese Medikamente (z. B. Zoladex®, Enantone®) schalten die Eierstöcke vorübergehend ab und verursachen eine künstliche Menopause mit raschem Knochenverlust.",
      meds:M("GnRH-Agonisten (Frauen)",["Leuprorelin (Enantone® Gyn, Trenantone® Gyn, Leuprolin Hexal®)","Goserelin (Zoladex® 3,6 mg)","Buserelin (Profact® Depot)","Triptorelin (Decapeptyl® Gyn, Pamorelin®)","Nafarelin (Synarel® Nasenspray)"])},
  ]},
  {id:"meds_m",icon:"🔵",title:"Medikamente – nur Männer",sub:"Hormonablative Therapie bei Prostataerkrankungen",onlyFor:"m",qs:[
    {id:"hormonablation",t:"yn",label:"Erhalten Sie eine Hormonblockade gegen Prostatakrebs (Spritzen zur Unterdrückung des Testosterons)?",faktor:2.0,icd:"Z79.818",hint:"Diese Therapie (z. B. Zoladex®, Enantone®, Firmagon®) senkt den Testosteronspiegel auf nahezu null. Das ist das stärkste hormonelle Risiko für Osteoporose beim Mann.",
      meds:M("GnRH-Agonisten und -Antagonisten (Männer)",["GnRH-Agonisten: Leuprorelin (Enantone®, Trenantone®, Eligard®, Leuprolin Hexal®)","Goserelin (Zoladex® 3,6 mg / 10,8 mg)","Buserelin (Profact® Depot)","Triptorelin (Decapeptyl®, Pamorelin®, Salvacyl®)","GnRH-Antagonisten: Degarelix (Firmagon®)","Relugolix (Orgovyx®)"])},
    {id:"antiandrogene",t:"yn",label:"Nehmen Sie Tabletten zur Blockade des männlichen Hormons (Antiandrogene) – z. B. bei Prostatakrebs?",faktor:1.5,icd:"Z79.818",
      hint:"Medikamente wie Bicalutamid (Casodex®), Enzalutamid (Xtandi®) oder Abirateron (Zytiga®) blockieren die Wirkung von Testosteron und schwächen dadurch den Knochen.",
      meds:M("Antiandrogene / Androgenrezeptorblocker",["Bicalutamid (Casodex®, Bicalutamid-ratiopharm®, Bicalutamid AL®)","Flutamid (Fugerel®, Flutamid-ratiopharm®)","Enzalutamid (Xtandi®)","Apalutamid (Erleada®)","Darolutamid (Nubeqa®)","Cyproteronacetat (Androcur®, Cyprosteron-ratiopharm®)","Abirateron + Prednisolon (Zytiga®, Yonsa®)"])},
    {id:"hypogonadismus",t:"yn",label:"Haben Sie einen dauerhaft niedrigen Testosteronwert – aus anderen Gründen (nicht durch Prostata-Therapie)?",faktor:1.8,icd:"E29.1, N50.1",hint:"Z. B. bei Erkrankungen der Hirnanhangdrüse (Hypophyse), Klinefelter-Syndrom oder anderen hormonellen Störungen. Ein niedriger Testosteronwert schwächt den Knochen ähnlich wie der Östrogenmangel bei Frauen."},
  ]},
  {id:"erkrankungen",icon:"🏥",title:"Grunderkrankungen",sub:"Bekannte Erkrankungen mit Einfluss auf die Knochen",qs:[
    {id:"rheuma",t:"yn",label:"Haben Sie rheumatoide Arthritis (entzündliches Gelenkrheuma)?",faktor:2.7,icd:"M05, M06",
      hint:"Gemeint ist das entzündliche Gelenk-Rheuma (nicht Arthrose). Zählt zur GK/RA-Gruppe – nur der stärkste Faktor dieser Gruppe wird gewertet."},
    {id:"diabetes1",t:"yn",label:"Haben Sie Diabetes mellitus Typ 1 (insulinabhängiger Diabetes seit der Jugend)?",faktor:2.5,icd:"E10",
      hint:"Typ-1-Diabetes beginnt meist im Kindes- oder Jugendalter und erfordert immer Insulin."},
    {id:"diabetes2",t:"radio",label:"Haben Sie Typ-2-Diabetes (Altersdiabetes) – und wenn ja, seit wie vielen Jahren?",icd:"E11",
      hint:"Typ-2-Diabetes beginnt meist im Erwachsenenalter, oft behandelt mit Tabletten oder Insulin.",
      opts:["Nein","Seit 5–10 Jahren","Seit über 10 Jahren"],fmap:{"Seit 5–10 Jahren":1.1,"Seit über 10 Jahren":1.6}},
    {id:"hpth",t:"yn",label:"Wurde bei Ihnen ein primärer Hyperparathyreoidismus festgestellt (überaktive Nebenschilddrüse)?",faktor:2.2,icd:"E21.0",
      hint:"Die Nebenschilddrüsen (vier kleine Drüsen am Hals) steuern den Kalziumhaushalt. Bei dieser Erkrankung ist der Kalziumspiegel im Blut dauerhaft erhöht."},
    {id:"cushing",t:"yn",label:"Haben Sie ein Cushing-Syndrom oder wurde ein erhöhter Cortisolspiegel festgestellt?",faktor:2.5,icd:"E24",
      hint:"Cortisol ist ein körpereigenes Stresshormon. Ein dauerhaft erhöhter Spiegel schwächt den Knochen stark."},
    {id:"schlaganfall",t:"yn",label:"Hatten Sie einen Schlaganfall?",faktor:1.6,icd:"I63, I61",
      hint:"Auch ein leichter oder lange zurückliegender Schlaganfall zählt."},
    {id:"ms",t:"yn",label:"Haben Sie Multiple Sklerose (MS)?",faktor:2.1,icd:"G35",
      hint:"MS ist eine chronische Erkrankung des Nervensystems, die Bewegung und Gleichgewicht beeinflussen kann."},
    {id:"parkinson",t:"yn",label:"Haben Sie Morbus Parkinson?",faktor:1.7,icd:"G20",
      hint:"Parkinson ist eine Erkrankung des Gehirns, die Zittern, Steifheit und verlangsamte Bewegung verursacht."},
    {id:"epilepsie",t:"yn",label:"Haben Sie Epilepsie (Krampfleiden)?",faktor:1.2,icd:"G40",
      hint:"Auch wenn die Anfälle medikamentös gut kontrolliert sind."},
    {id:"demenz",t:"yn",label:"Haben Sie eine Demenz oder Alzheimer-Erkrankung?",faktor:1.6,icd:"F03, G30",
      hint:"Demenz ist eine fortschreitende Beeinträchtigung des Gedächtnisses und Denkens."},
    {id:"depression",t:"yn",label:"Haben Sie eine Depression oder waren Sie wegen Depression in Behandlung?",faktor:1.3,icd:"F32, F33",
      hint:"Unabhängig davon, ob Sie aktuell Antidepressiva nehmen."},
    {id:"herzinsuffizienz",t:"yn",label:"Haben Sie eine Herzschwäche (Herzinsuffizienz)?",faktor:1.5,icd:"I50",
      hint:"Das Herz pumpt nicht mehr ausreichend Blut durch den Körper. Typische Zeichen: Luftnot, geschwollene Beine."},
    {id:"nieren",t:"yn",label:"Haben Sie eine chronische Nierenerkrankung (eingeschränkte Nierenfunktion)?",faktor:1.6,icd:"N18.3, N18.4",
      hint:"Gemeint ist eine dauerhaft auf weniger als 60 % reduzierte Nierenleistung (Kreatinin erhöht, GFR 15–59 ml/min)."},
    {id:"copd",t:"yn",label:"Haben Sie COPD (chronische Bronchitis oder Lungenemphysem)?",faktor:1.3,icd:"J44",
      hint:"COPD ist eine chronische Lungenerkrankung, meist durch langjähriges Rauchen verursacht."},
    {id:"lupus",t:"yn",label:"Haben Sie systemischen Lupus erythematodes (Lupus / SLE)?",faktor:1.5,icd:"M32",
      hint:"Lupus ist eine Autoimmunerkrankung, die viele Organe betreffen kann."},
    {id:"spondylitis",t:"yn",label:"Haben Sie Morbus Bechterew oder eine axiale Spondyloarthritis?",faktor:1.6,icd:"M45, M46.8",
      hint:"Eine entzündliche Erkrankung der Wirbelsäule, die zu Versteifung führen kann."},
    {id:"zoeliakie",t:"yn",label:"Haben Sie Zöliakie (Glutenunverträglichkeit)?",faktor:1.4,icd:"K90.0",
      hint:"Bei Zöliakie schädigt Gluten (in Weizen, Roggen, Gerste) den Dünndarm, was die Kalziumaufnahme stört."},
    {id:"crohn",t:"yn",label:"Haben Sie Morbus Crohn oder eine Colitis ulcerosa (chronisch-entzündliche Darmerkrankung)?",faktor:1.4,icd:"K50, K51",
      hint:"Beide Erkrankungen führen zu anhaltenden Darmentzündungen und können die Nährstoffaufnahme beeinträchtigen."},
    {id:"mgus",t:"yn",label:"Wurde bei Ihnen ein MGUS festgestellt (abnormes Eiweiß im Blut, monoklonale Gammopathie)?",faktor:2.0,icd:"D47.2",
      hint:"MGUS ist ein Laborbefund: Im Blut wird ein abnormes Eiweiß gefunden, das aus einer einzelnen Immunzelle stammt. Meist ohne Beschwerden, aber mit erhöhtem Knochenrisiko."},
    {id:"magenop",t:"yn",label:"Hatten Sie eine größere Magenoperation (Magenentfernung oder Magenbypass)?",faktor:1.5,icd:"Z90.3",
      hint:"Z. B. Billroth-II-Operation oder Gastrektomie (vollständige Magenentfernung)."},
    {id:"bariatrie",t:"yn",label:"Hatten Sie eine Magenverkleinerung oder einen Magenbypass zur Gewichtsreduktion?",faktor:1.8,icd:"Z98.84",
      hint:"Eingriffe wie Schlauchmagen, Roux-en-Y-Bypass oder Magenband können die Kalziumaufnahme dauerhaft einschränken."},
    {id:"hiv",t:"yn",label:"Haben Sie eine HIV-Infektion?",faktor:1.5,icd:"B24, Z21",
      hint:"Sowohl das Virus selbst als auch bestimmte antiretrovirale Medikamente können den Knochen schwächen."},
    {id:"hyponatriamie",t:"yn",label:"Haben Sie einen chronisch niedrigen Natriumwert im Blut (Hyponatriämie)?",faktor:1.4,icd:"E87.1",
      hint:"Natrium ist ein Elektrolyt. Ein dauerhaft zu niedriger Wert (< 135 mmol/l) kann den Knochen direkt schwächen."},
    {id:"wachstumsmangel",t:"yn",label:"Haben Sie einen Wachstumshormonmangel oder eine Hypophysenunterfunktion?",faktor:1.5,icd:"E23.0",
      hint:"Die Hypophyse (Hirnanhangdrüse) steuert viele Hormone. Ein Mangel an Wachstumshormon tritt auch bei Erwachsenen auf."},
  ]},
  {id:"lebensstil",icon:"🚶",title:"Lebensstil & Sturzrisiko",sub:"Allgemeine Risikofaktoren und Sturzereignisse",qs:[
    {id:"rauchen",t:"yn",label:"Rauchen aktuell > 10 Zigaretten/Tag?",faktor:1.5,icd:"F17.2, Z72.0"},
    {id:"alkohol",t:"yn",label:"Täglicher Alkohol > 50 g? (≈ 4–5 Bier oder 2–3 Gläser Wein)",faktor:1.9,icd:"F10.1, Z72.1"},
    {id:"immobilitaet",t:"yn",label:"Auf Gehhilfe angewiesen / ausgeprägte Mobilitätseinschränkung?",faktor:1.3,icd:"Z74.0"},
    {id:"sturz",t:"radio",label:"Sturzereignisse in den letzten 12 Monaten?",icd:"W19",
      opts:["Nein","Einmal gestürzt","Mehr als einmal gestürzt"],
      fmap:{"Einmal gestürzt":1.6,"Mehr als einmal gestürzt":2.0}},
    {id:"tug",t:"yn",label:"Timed-Up-and-Go-Test (TUG) > 12 Sekunden?",faktor:1.8,icd:"R26.2",
      hint:"TUG: Zeit zum Aufstehen, 3 m gehen, umkehren, wieder hinsetzen."},
  ]},
  // DXA at the END as requested
  {id:"dxa",icon:"🔬",title:"Knochendichtemessung (DXA)",sub:"Falls eine Messung vorliegt – verbessert die Risikoberechnung erheblich",qs:[
    {id:"dxa_hip",t:"dxa",label:"T-Score Gesamthüfte (Total Hip)",placeholder:"-2.5",hint:"Hauptparameter für Therapieschwellenbestimmung gemäß DVO-Leitlinie 2023."},
    {id:"dxa_lws",t:"dxa",label:"T-Score Lendenwirbelsäule (LWS, L1–L4)",placeholder:"-2.5"},
    {id:"dxa_neck",t:"dxa",label:"T-Score Schenkelhals (Femur Neck)",placeholder:"-2.5"},
    {id:"dxa_tbs",t:"dxa",label:"TBS (Trabecular Bone Score) – falls gemessen",placeholder:"z. B. 1.20",
      hint:"TBS < 1,4 = Risikofaktor. Richtwerte: < 1,0 → ×1,8 | 1,0–1,1 → ×1,6 | 1,1–1,2 → ×1,4 | 1,2–1,4 → ×1,3"},
  ]},
];

/* ═══════════════════════════════════════════════ RISK CALC ═══ */
const STURZ_GRP=new Set(["schlaganfall","ms","parkinson","epilepsie","demenz","depression","immobilitaet","sturz","tug","antidepressiva","opioide","antipsychotika","sedativa","orthostase"]);
const GC_RA_GRP=new Set(["glukokortikoide","rheuma"]);
const calcBMI=(h,w)=>{if(!h||!w||h<100||w<20)return null;return w/((h/100)**2);};
function calcAgeFromBirthdate(dob){
  if(!dob||dob.trim().length<4)return null;
  let day,mon,year;
  const s=dob.trim();
  // TT.MM.JJJJ or T.M.JJJJ or T.M.JJ or TT.MM.JJ
  const de=/^(\d{1,2})\D(\d{1,2})\D(\d{2,4})$/.exec(s);
  // YYYY-MM-DD
  const iso=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if(de){
    day=parseInt(de[1]);mon=parseInt(de[2])-1;
    let y=parseInt(de[3]);
    if(de[3].length===2){
      // 2-digit year: 00-29 → 2000-2029, 30-99 → 1930-1999
      y=y<=29?2000+y:1900+y;
    }
    year=y;
  } else if(iso){
    year=parseInt(iso[1]);mon=parseInt(iso[2])-1;day=parseInt(iso[3]);
  } else return null;
  const d=new Date(year,mon,day);
  if(isNaN(d.getTime())||d.getMonth()!==mon)return null;
  const now=new Date();
  let age=now.getFullYear()-d.getFullYear();
  const m=now.getMonth()-d.getMonth();
  if(m<0||(m===0&&now.getDate()<d.getDate()))age--;
  return age>=0&&age<130?age:null;
}
function autoCapitalizeName(v){
  if(!v)return v;
  return v.split(/([,\s]+)/).map((p,i,a)=>{
    if(/^[,\s]+$/.test(p))return p;
    return p.charAt(0).toUpperCase()+p.slice(1);
  }).join("");
}
function visibleQs(gender){return SECTIONS.filter(s=>!s.onlyFor||s.onlyFor===gender).flatMap(s=>s.qs);}

/* ═══════════════════════════════════════════ DIAGNOSIS DATABASE ═══ */
const DIAG_DB_DEFAULTS = {
  hueft_akut:       {diagnose:"Hüftfraktur (niedrigtraumatisch, akut, < 12 Monate)",             icd5:"S72.00"},
  hueft_alt:        {diagnose:"Zustand nach Hüftfraktur (niedrigtraumatisch, > 12 Monate)",       icd5:"M80.05"},
  wirbelbruch_akut: {diagnose:"Wirbelkörperfraktur (niedrigtraumatisch, akut, < 12 Monate)",      icd5:"M80.08"},
  wirbelbruch_anz:  {diagnose:"Wirbelkörperfrakturen (niedrigtraumatisch, > 12 Monate)",           icd5:"M80.08"},
  humerus:          {diagnose:"Humerusfraktur (niedrigtraumatisch)",                               icd5:"M80.02"},
  becken:           {diagnose:"Beckenfraktur (niedrigtraumatisch)",                                icd5:"M80.0X"},
  unterarm:         {diagnose:"Distale Radiusfraktur (niedrigtraumatisch)",                        icd5:"M80.03"},
  eltern:           {diagnose:"Familienanamnese: proximale Femurfraktur (Elternteil)",             icd5:"Z82.61"},
  bmi:              {diagnose:"Untergewicht / Malnutrition",                                       icd5:"E44.90"},
  tbs:              {diagnose:"Pathologische Trabekelknochen-Texturanalyse (TBS)",                 icd5:"M85.80"},
  glukokortikoide:  {diagnose:"Glukokortikoid-induzierte Osteoporose",                            icd5:"M81.40"},
  ppi:              {diagnose:"Langzeittherapie mit Protonenpumpenhemmern (> 3 Monate)",          icd5:"Z79.89"},
  antidepressiva:   {diagnose:"Antidepressiva-Dauermedikation (SSRI/SNRI/TZA)",                   icd5:"Z79.89"},
  opioide:          {diagnose:"Opioidanalgetika-Dauermedikation",                                  icd5:"Z79.89"},
  antipsychotika:   {diagnose:"Antipsychotika-/Neuroleptika-Dauermedikation",                     icd5:"Z79.89"},
  sedativa:         {diagnose:"Benzodiazepin-/Z-Substanzen-Dauermedikation",                      icd5:"Z79.89"},
  schilddruese:     {diagnose:"Supprimierter TSH unter L-Thyroxin-Therapie",                      icd5:"E05.90"},
  glitazone:        {diagnose:"Pioglitazon-Dauertherapie (Diabetes mellitus Typ 2)",               icd5:"Z79.89"},
  antikonvulsiva:   {diagnose:"Antikonvulsiva-Dauermedikation (inkl. Pregabalin/Gabapentin)",      icd5:"Z79.89"},
  orthostase:       {diagnose:"Orthostatische Hypotension / Sturzrisiko durch Medikation",         icd5:"I95.10"},
  aromatasehemmer:  {diagnose:"Aromatasehemmer-Therapie (Mammakarzinom)",                          icd5:"Z79.81"},
  fruehe_meno:      {diagnose:"Prämature Menopause / bilaterale Ovarektomie",                     icd5:"N95.00"},
  gnrh_f:           {diagnose:"GnRH-Agonisten-Therapie (Endometriose / Mammakarzinom)",           icd5:"Z79.81"},
  hormonablation:   {diagnose:"Androgendeprivationstherapie (Prostatakarzinom)",                   icd5:"Z79.81"},
  antiandrogene:    {diagnose:"Antiandrogen-Therapie (Prostatakarzinom)",                          icd5:"Z79.81"},
  hypogonadismus:   {diagnose:"Männlicher Hypogonadismus",                                        icd5:"E29.10"},
  rheuma:           {diagnose:"Rheumatoide Arthritis",                                             icd5:"M05.90"},
  diabetes1:        {diagnose:"Diabetes mellitus Typ 1",                                           icd5:"E10.90"},
  diabetes2:        {diagnose:"Diabetes mellitus Typ 2",                                           icd5:"E11.90"},
  hpth:             {diagnose:"Primärer Hyperparathyreoidismus",                                   icd5:"E21.00"},
  cushing:          {diagnose:"Cushing-Syndrom",                                                   icd5:"E24.90"},
  schlaganfall:     {diagnose:"Zustand nach Schlaganfall / zerebraler Ischämie",                  icd5:"I63.90"},
  ms:               {diagnose:"Multiple Sklerose",                                                 icd5:"G35.90"},
  parkinson:        {diagnose:"Morbus Parkinson",                                                  icd5:"G20.90"},
  epilepsie:        {diagnose:"Epilepsie",                                                          icd5:"G40.90"},
  demenz:           {diagnose:"Demenz (inkl. Morbus Alzheimer)",                                  icd5:"F03.90"},
  depression:       {diagnose:"Depressive Störung",                                               icd5:"F32.90"},
  herzinsuffizienz: {diagnose:"Herzinsuffizienz",                                                  icd5:"I50.90"},
  nieren:           {diagnose:"Chronische Nierenerkrankung (CKD Stadium 3b–4)",                   icd5:"N18.30"},
  copd:             {diagnose:"COPD (chron. obstruktive Lungenerkrankung)",                        icd5:"J44.10"},
  lupus:            {diagnose:"Systemischer Lupus erythematodes (SLE)",                            icd5:"M32.90"},
  spondylitis:      {diagnose:"Axiale Spondyloarthritis / Morbus Bechterew",                      icd5:"M45.90"},
  zoeliakie:        {diagnose:"Zöliakie (glutensensitive Enteropathie)",                           icd5:"K90.00"},
  crohn:            {diagnose:"Morbus Crohn / Colitis ulcerosa (CED)",                            icd5:"K50.90"},
  mgus:             {diagnose:"MGUS (monoklonale Gammopathie unklarer Signifikanz)",               icd5:"D47.20"},
  magenop:          {diagnose:"Zustand nach Magenresektion / Gastrektomie",                        icd5:"Z90.39"},
  bariatrie:        {diagnose:"Zustand nach bariatrischer Operation (Sleeve/Bypass)",              icd5:"Z98.84"},
  hiv:              {diagnose:"HIV-Infektion",                                                     icd5:"B24.00"},
  hyponatriamie:    {diagnose:"Chronische Hyponatriämie",                                         icd5:"E87.10"},
  wachstumsmangel:  {diagnose:"Hypophyseninsuffizienz / Wachstumshormonmangel",                   icd5:"E23.00"},
  rauchen:          {diagnose:"Nikotinkonsum (aktiv, > 10 Zigaretten/Tag)",                       icd5:"F17.20"},
  alkohol:          {diagnose:"Chronischer Alkoholmissbrauch (> 50 g/Tag)",                        icd5:"F10.10"},
};
const DIAG_DB_KEY = "osteo_diagdb_v4";
function loadDiagDb(){
  // Sync fallback - returns defaults; async load happens in useEffect
  return{...DIAG_DB_DEFAULTS};
}
async function saveDiagDb(db){
  try{await window.storage.set(DIAG_DB_KEY,JSON.stringify(db));}catch(e){}
}
async function loadDiagDbAsync(){
  try{const r=await window.storage.get(DIAG_DB_KEY);if(r)return{...DIAG_DB_DEFAULTS,...JSON.parse(r.value)};}catch(e){}
  return{...DIAG_DB_DEFAULTS};
}

function getFactors(answers,gender){
  const res=[];
  const bmi=calcBMI(parseFloat(answers.groesse),parseFloat(answers.gewicht));
  if(bmi!==null){
    if(bmi<15)res.push({id:"bmi",label:"BMI < 15 kg/m²",faktor:2.2,icd:"E41",grp:"other"});
    else if(bmi<18.5)res.push({id:"bmi",label:`BMI ${bmi.toFixed(1)} kg/m² (15–18,5)`,faktor:1.7,icd:"E44",grp:"other"});
    else if(bmi<20)res.push({id:"bmi",label:`BMI ${bmi.toFixed(1)} kg/m² (18,5–19,9)`,faktor:1.3,icd:"R63.4",grp:"other"});
  }
  const tbs=parseFloat(answers.dxa_tbs);
  if(!isNaN(tbs)&&tbs>0&&tbs<1.4){
    let f=null,l="";
    if(tbs<=1.0){f=1.8;l=`TBS ≤ 1,0 (Z-Score ≤ −2,5 SD)`;}
    else if(tbs<=1.1){f=1.6;l=`TBS ${tbs} (Z-Score ca. −2,0 SD)`;}
    else if(tbs<=1.2){f=1.4;l=`TBS ${tbs} (Z-Score ca. −1,5 SD)`;}
    else{f=1.3;l=`TBS ${tbs} (Z-Score ca. −1,0 SD)`;}
    if(f)res.push({id:"tbs",label:l,faktor:f,icd:"M85.8",grp:"other"});
  }
  for(const q of visibleQs(gender)){
    const val=answers[q.id];if(!val)continue;
    let f=null;
    if(q.t==="yn"&&val==="ja"&&q.faktor)f=q.faktor;
    else if((q.t==="radio")&&q.fmap&&q.fmap[val])f=q.fmap[val];
    if(!f)continue;
    const grp=STURZ_GRP.has(q.id)?"sturz":GC_RA_GRP.has(q.id)?"gc_ra":"other";
    const label=q.t==="yn"?q.label.replace("?",""):val;
    res.push({id:q.id,label,faktor:f,icd:q.icd||"",grp});
  }
  return res.sort((a,b)=>b.faktor-a.faktor);
}
function selectTop2(factors){
  if(!factors.length)return[];
  const s=[...factors].sort((a,b)=>b.faktor-a.faktor);
  const sel=[s[0]];
  for(const f of s.slice(1)){
    if(sel.length>=2)break;
    const first=sel[0];
    if((first.grp==="sturz"&&f.grp==="sturz")||(first.grp==="gc_ra"&&f.grp==="gc_ra"))continue;
    sel.push(f);
  }
  return sel;
}
function checkGenInd(answers){
  const r=[];
  if(answers.wirbelbruch_akut==="ja")r.push("Niedrigtraumatische Wirbelkörperfraktur (akut/letztes Jahr)");
  const wb=answers.wirbelbruch_anz;
  if(wb==="2 Wirbelbrüche"||wb==="3 oder mehr Wirbelbrüche")r.push("Multiple Wirbelkörperfrakturen");
  if(answers.hueft_akut==="ja"||answers.hueft_alt==="ja")r.push("Proximale Femurfraktur / Hüftfraktur");
  const gc=answers.glukokortikoide;
  if(gc&&gc.includes("7,5"))r.push("Glukokortikoide ≥ 7,5 mg/Tag > 3 Monate – Indikation prüfen wenn T-Score ≤ −1,5");
  return r;
}
function computeRisk(answers,gender){
  const factors=getFactors(answers,gender);
  const top2=selectTop2(factors);
  const cF=top2.reduce((a,f)=>a*f.faktor,1);
  const age=parseInt(answers.alter)||null;
  const tHip=answers.dxa_hip||null;
  const t3=age?getTh(gender,3,age,tHip):null;
  const t5=age?getTh(gender,5,age,tHip):null;
  const t10=age?getTh(gender,10,age,tHip):null;
  const r3=t3!==null?cF>=t3:null;
  const r5=t5!==null?cF>=t5:null;
  const r10=t10!==null?cF>=t10:null;
  const genInd=checkGenInd(answers);
  let cat=null;
  if(genInd.length>0||r10)cat="top";
  else if(r5)cat="high";
  else if(r3)cat="mod";
  else if(r3===false)cat="low";
  return{factors,top2,cF,t3,t5,t10,r3,r5,r10,genInd,cat};
}
function catLabel(c){return{top:"Sehr hohes Risiko / Generelle Indikation",high:"Deutlich erhöhtes Risiko",mod:"Mäßig erhöhtes Risiko",low:"Kein erhöhtes Risiko erkennbar"}[c]||"—";}
function catShort(c){return{top:"Sehr hoch",high:"Hoch",mod:"Erhöht",low:"Gering"}[c]||"—";}

/* ═══════════════════════════════════════════════ DIFF ═══ */
function computeDiff(curr,prev,currGender){
  if(!prev)return null;
  const diffs=[];
  // Patient fields
  const patFields=[["alter","Alter"],["groesse","Größe (cm)"],["gewicht","Gewicht (kg)"]];
  for(const[k,label]of patFields){
    const cv=curr[k]||"",pv=prev.answers[k]||"";
    if(cv!==pv)diffs.push({field:label,old:pv||"–",new:cv||"–"});
  }
  // DXA
  const dxaFields=[["dxa_hip","T-Score Gesamthüfte"],["dxa_lws","T-Score LWS"],["dxa_neck","T-Score Schenkelhals"],["dxa_tbs","TBS"]];
  for(const[k,label]of dxaFields){
    const cv=curr[k]||"",pv=prev.answers[k]||"";
    if(cv!==pv)diffs.push({field:label,old:pv||"–",new:cv||"–"});
  }
  // Clinical factors
  for(const q of visibleQs(currGender)){
    const cv=curr[q.id]||"",pv=prev.answers[q.id]||"";
    if(cv!==pv&&(cv||pv)){
      const shortLabel=q.label.length>55?q.label.slice(0,52)+"…":q.label;
      diffs.push({field:shortLabel,old:pv||"–",new:cv||"–"});
    }
  }
  // Risk summary comparison
  const prevRisk=computeRisk(prev.answers,prev.gender);
  return{diffs,prevDate:prev.fillDate,prevRisk,prevCat:prevRisk.cat};
}

/* ═══════════════════════════════════════════════ STORAGE ═══ */
const STORE_LH="osteo-letterhead";
const STORE_DRAFT="osteo-draft";
const STORE_SESSIONS="osteo-sessions";
const DEFAULT_LH={name:"Dr. med. Georg P. Dahmen",title:"Facharzt für Orthopädie",strasse:"Tangstedter Landstraße 77",plz_ort:"22415 Hamburg",telefon:"",fax:"",email:""};

async function storageGet(key,fallback=null){
  try{const r=await window.storage.get(key);return r?JSON.parse(r.value):fallback;}
  catch{return fallback;}
}
async function storageSet(key,val){
  try{await window.storage.set(key,JSON.stringify(val));return true;}
  catch{return false;}
}

/* ═══════════════════════════════════════════════ TEXT EXPORT ═══ */
function buildTextExport(patient,gender,answers,risk,diff,lh,diagDb){
  const db=diagDb||DIAG_DB_DEFAULTS;
  const d=new Date().toLocaleDateString("de-DE");
  const lines=[];
  const sep="═".repeat(65);const sub="─".repeat(65);
  lines.push(sep);
  lines.push(`  ${lh.name}  |  ${lh.title}`);
  lines.push(`  ${lh.strasse}, ${lh.plz_ort}`);
  if(lh.telefon)lines.push(`  Tel.: ${lh.telefon}${lh.fax?" | Fax: "+lh.fax:""}`);
  lines.push(sep);
  lines.push("  OSTEOPOROSE-RISIKOCHECK – AUSWERTUNG");
  lines.push("  DVO-Leitlinie 2023 | S3-Leitlinie AWMF 183-001");
  lines.push(`  Ausgabedatum: ${d}`);
  lines.push(sep);lines.push("");
  lines.push("PATIENTENDATEN");lines.push(sub);
  if(patient.name)lines.push(`Name           : ${patient.name}`);
  if(patient.geburtsdatum)lines.push(`Geburtsdatum   : ${patient.geburtsdatum}`);
  lines.push(`Geschlecht     : ${gender==="f"?"Frau":"Mann"}`);
  lines.push(`Alter          : ${answers.alter||"–"} Jahre`);
  lines.push(`Größe          : ${answers.groesse||"–"} cm`);
  lines.push(`Gewicht        : ${answers.gewicht||"–"} kg`);
  const bmi=calcBMI(parseFloat(answers.groesse),parseFloat(answers.gewicht));
  if(bmi)lines.push(`BMI            : ${bmi.toFixed(1)} kg/m²`);
  lines.push(`Ausfülldatum   : ${patient.fillDate||d}`);
  lines.push("");
  if(answers.dxa_hip){
    lines.push("DXA-KNOCHENDICHTEMESSUNG");lines.push(sub);
    lines.push(`T-Score Gesamthüfte  : ${answers.dxa_hip}`);
    if(answers.dxa_lws)lines.push(`T-Score LWS          : ${answers.dxa_lws}`);
    if(answers.dxa_neck)lines.push(`T-Score Schenkelhals : ${answers.dxa_neck}`);
    if(answers.dxa_tbs)lines.push(`TBS                  : ${answers.dxa_tbs}`);
    lines.push("");
  }
  lines.push("RISIKOFAKTOREN MIT DIAGNOSE UND ICD-10-CODES");lines.push(sub);
  if(!risk.factors.length)lines.push("Keine Risikofaktoren angegeben.");
  else for(const f of risk.factors){
    const diag=db[f.id]||{};
    const diagText=diag.diagnose||f.label;
    const icd5=diag.icd5||f.icd||"";
    lines.push(`• ${diagText}`);
    if(icd5)lines.push(`  ICD-10: ${icd5}`);
    lines.push(`  Risikofaktor: ×${f.faktor}  |  Gruppe: ${f.grp==="sturz"?"Sturzrisiko":f.grp==="gc_ra"?"GK/RA-Gruppe":"Allgemein"}`);
    if(f.rx&&f.rx.length>0)lines.push(`  Medikamente: ${f.rx.join(", ")}`);
    lines.push("");
  }
  lines.push("RISIKOBERECHNUNG (Top 2, DVO-Algorithmus)");lines.push(sub);
  if(risk.top2.length){
    risk.top2.forEach((f,i)=>lines.push(`  ${i+1}. ${f.label} (×${f.faktor})`));
    lines.push(`  Kombinierter Risikofaktor: ×${risk.cF.toFixed(2)}`);
  }else lines.push("  Keine Risikofaktoren erfasst.");
  lines.push("");
  lines.push("THERAPIESCHWELLEN");lines.push(sub);
  lines.push(`   3% (3 Jahre): Benötigt ×${risk.t3??"–"}  |  ${risk.r3===null?"k.A.":risk.r3?"ERREICHT ✓":"nicht erreicht"}`);
  lines.push(`   5% (3 Jahre): Benötigt ×${risk.t5??"–"}  |  ${risk.r5===null?"k.A.":risk.r5?"ERREICHT ✓":"nicht erreicht"}`);
  lines.push(`  10% (3 Jahre): Benötigt ×${risk.t10??"–"}  |  ${risk.r10===null?"k.A.":risk.r10?"ERREICHT ✓":"nicht erreicht"}`);
  lines.push(`  Risikokategorie: ${catLabel(risk.cat)||"–"}`);
  lines.push("");
  if(risk.genInd.length){
    lines.push("GENERELLE THERAPIEINDIKATIONEN (Tabelle 3.1)");lines.push(sub);
    risk.genInd.forEach(g=>lines.push(`  ⚠ ${g}`));
    lines.push("");
  }
  if(diff&&diff.diffs.length>0){
    lines.push(`VERLAUF / ÄNDERUNGEN (Vergleich mit ${diff.prevDate})`);lines.push(sub);
    lines.push(`  Vorherige Kategorie: ${catLabel(diff.prevCat)||"–"}`);
    lines.push(`  Aktuelle Kategorie : ${catLabel(risk.cat)||"–"}`);
    lines.push("");
    for(const d of diff.diffs){
      lines.push(`  ${d.field}:`);
      lines.push(`    Vorher: ${d.old}`);
      lines.push(`    Jetzt:  ${d.new}`);
      lines.push("");
    }
  }
  lines.push(sep);
  lines.push("HINWEIS: Dieser Ausdruck ersetzt keine ärztliche Diagnose.");
  lines.push("Die Therapieentscheidung trifft der behandelnde Arzt.");
  lines.push(sep);
  lines.push("");
  lines.push("DIAGNOSEN");lines.push(sub);
  for(const f of risk.factors){
    const diag=db[f.id]||{};
    const text=diag.diagnose||f.label;
    const icd=diag.icd5||f.icd||"";
    lines.push(icd?text+" {"+icd+"};":text+";");
  }
  return lines.join("\n");
}

/* ═══════════════════════════════════════════════ COMPONENTS ═══ */
function MedInput({qid,meds,rxValue,onRx,autoOpen}){
  const[open,setOpen]=useState(false);
  const prevAutoOpen=React.useRef(false);
  if(autoOpen&&!prevAutoOpen.current){prevAutoOpen.current=true;if(!open)setTimeout(()=>setOpen(true),50);}
  if(!autoOpen&&prevAutoOpen.current){prevAutoOpen.current=false;}
  const[text,setText]=useState("");
  if(!meds)return null;
  const tags=rxValue||[];
  const addTag=(t)=>{const v=t.trim();if(!v||tags.includes(v))return;onRx(qid+"_rx",[...tags,v]);};
  const removeTag=(i)=>onRx(qid+"_rx",tags.filter((_,j)=>j!==i));
  return(
    <div className="med-input-wrap">
      <div className="med-input-header">
        <span>💊 Konkrete Medikamente (optional)</span>
        <button className="med-list-btn no-print" onClick={()=>setOpen(o=>!o)}>
          {open?"▲ Liste schließen":"▼ Auswahl öffnen"}
        </button>
      </div>
      <div className={"med-list-body"+(open?" open":"")}>
        <div className="med-list-inner">
          <div className="med-group-title">{meds.title}</div>
          <div className="med-chips">
            {meds.items.map(m=>(
              <span key={m} className={"med-chip"+(tags.includes(m)?" added":"")}
                onClick={()=>tags.includes(m)?removeTag(tags.indexOf(m)):addTag(m)}>
                {tags.includes(m)?"✓ ":""}{m.split(" (")[0]}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="rx-area">
        <div className="rx-lbl">Eingetragen:</div>
        {tags.length===0&&<div style={{fontSize:11,color:"#a09080",fontStyle:"italic",marginBottom:4}}>Noch keine Medikamente eingetragen</div>}
        <div className="rx-tags">
          {tags.map((t,i)=>(
            <span key={i} className="rx-tag">
              {t}
              <button className="rx-tag-del no-print" onClick={()=>removeTag(i)}>×</button>
            </span>
          ))}
        </div>
        <div className="rx-row no-print">
          <input className="rx-text" value={text} onChange={e=>setText(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"||e.key===","){addTag(text);setText("");}}}
            placeholder="Freitext eingeben, Enter zum Hinzufügen…"/>
          <button className="rx-add" onClick={()=>{addTag(text);setText("");}}>+ Hinzufügen</button>
        </div>
      </div>
    </div>
  );
}

function Question({q,value,onChange,answered,rxValue,onRx}){
  const yn=()=>(
    <div className="rg h">
      {["ja","nein"].map(opt=>(
        <label key={opt} className={`rl${value===opt?" sel":""}`}>
          <input type="radio" name={q.id} value={opt} checked={value===opt} onChange={()=>onChange(q.id,opt)}/>
          {opt==="ja"?"✓  Ja":"✗  Nein"}
        </label>
      ))}
    </div>
  );
  const radio=()=>(
    <div className="rg">
      {q.opts.map(opt=>(
        <label key={opt} className={`rl${value===opt?" sel":""}`}>
          <input type="radio" name={q.id} value={opt} checked={value===opt} onChange={()=>onChange(q.id,opt)}/>
          {opt}
        </label>
      ))}
    </div>
  );
  const numIn=()=>(
    <div style={{display:"flex",gap:8,alignItems:"center"}}>
      <input className="num-in" type="number" placeholder={q.placeholder} value={value||""}
        onChange={e=>onChange(q.id,e.target.value)}/>
      {q.unit&&<span style={{fontSize:12,color:"#8b7a68"}}>{q.unit}</span>}
    </div>
  );
  const dxaIn=()=>(
    <div style={{display:"flex",gap:8,alignItems:"center"}}>
      <input className="dxa-in" type="number" step="0.01" placeholder={q.placeholder||"-2.5"}
        value={value||""} onChange={e=>onChange(q.id,e.target.value)}/>
      <span style={{fontSize:12,color:"#8b7a68"}}>{q.id.includes("tbs")?"":"SD"}</span>
    </div>
  );
  return(
    <div className={`q${!answered?" unanswered":""}`}>
      <div className="q-label">{q.label}</div>
      {q.hint&&<div className="q-hint">{q.hint}</div>}
      {q.meds&&(value==="ja"||(value&&value!=="Nein"&&!value.startsWith("Nein")))&&(
        <MedInput qid={q.id} meds={q.meds} rxValue={rxValue} onRx={onRx} autoOpen={value==="ja"}/>
      )}
      {q.t==="yn"&&yn()}
      {q.t==="radio"&&radio()}
      {q.t==="number"&&numIn()}
      {q.t==="dxa"&&dxaIn()}
    </div>
  );
}

function Section({section,open,onToggle,answers,onAnswer,onRx}){
  return(
    <div className="sec">
      <div className={`sec-hdr${open?" open":""}`} onClick={onToggle}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div className="sec-icon">{section.icon}</div>
          <div>
            <div className="sec-title">{section.title}</div>
            <div className="sec-sub">{section.sub}</div>
          </div>
        </div>
        <span className="chev">▼</span>
      </div>
      <div className={`sec-body${open?" open":""}`}>
        {section.qs.map(q=>(
          <Question key={q.id} q={q} value={answers[q.id]} onChange={onAnswer}
            answered={answers[q.id]!==undefined&&answers[q.id]!==null&&answers[q.id]!==""}
            rxValue={answers[q.id+"_rx"]} onRx={onRx}/>
        ))}
      </div>
    </div>
  );
}

function ThreshPill({label,threshold,reached}){
  const cls=threshold===null?"uk":reached?"yes":"no";
  const sym=threshold===null?"—":reached?"✓":"✗";
  const sub=threshold!==null?`Benötigt: ×${threshold}`:"Alter/DXA fehlt";
  return(
    <div className={`tp ${cls}`}>
      <div className="tp-lbl">{label}</div>
      <div className="tp-val">{sym}</div>
      <div className="tp-sub">{sub}</div>
    </div>
  );
}

function RiskBadge({cat}){
  const cls={top:"rb-top",high:"rb-high",mod:"rb-mod",low:"rb-low"}[cat]||"rb-na";
  return <span className={`risk-badge ${cls}`}>{catShort(cat)}</span>;
}

function DiffCard({diff,currRisk}){
  if(!diff)return null;
  return(
    <div className="diff-card">
      <div className="diff-title">📈 Verlaufsvergleich</div>
      <div className="diff-meta">
        Vergleich mit Vorbefund vom {diff.prevDate} &nbsp;|&nbsp;
        Vorherige Kategorie: <RiskBadge cat={diff.prevCat}/> &nbsp;→&nbsp; Aktuelle Kategorie: <RiskBadge cat={currRisk.cat}/>
        {diff.prevRisk.cF&&<span> &nbsp;|&nbsp; Risikofaktor: ×{diff.prevRisk.cF.toFixed(2)} → ×{currRisk.cF.toFixed(2)}</span>}
      </div>
      {diff.diffs.length===0?(
        <div className="diff-none">Keine Änderungen gegenüber dem letzten Befund.</div>
      ):(
        <table className="diff-table">
          <thead><tr><th>Parameter</th><th>Vorher ({diff.prevDate})</th><th>Jetzt</th></tr></thead>
          <tbody>
            {diff.diffs.map((d,i)=>(
              <tr key={i}>
                <td style={{fontWeight:500,color:"#0369a1",fontSize:11.5}}>{d.field}</td>
                <td><span className="diff-old">{d.old}</span></td>
                <td><span className="diff-new">{d.new}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function ResultCard({gender,answers,patient,diff}){
  const risk=computeRisk(answers,gender);
  const{factors,top2,cF,t3,t5,t10,r3,r5,r10,genInd,cat}=risk;
  const catInfo={
    top:{cls:"top",eye:"Sehr hohes Risiko / Generelle Indikation",h:"10%-Schwelle und/oder generelle Indikation",d:"Osteoanabole Therapie (Romosozumab oder Teriparatid) soll unverzüglich empfohlen werden (A)."},
    high:{cls:"high",eye:"Deutlich erhöhtes Risiko",h:"5%-Schwelle erreicht – Therapie indiziert",d:"Spezifische medikamentöse Therapie soll empfohlen werden (A). Bei 10%-Schwelle: osteoanabole Substanz erwägen."},
    mod:{cls:"mod",eye:"Mäßig erhöhtes Risiko",h:"3%-Schwelle erreicht – Abklärung empfehlenswert",d:"Spezifische Therapie sollte in Betracht gezogen werden, besonders bei starken/irreversiblen Risikofaktoren (B)."},
    low:{cls:"low",eye:"Kein erhöhtes Risiko erkennbar",h:"Aktuell kein erhöhtes Frakturrisiko",d:"Allgemeine Prophylaxemaßnahmen (Kalzium, Vitamin D, Bewegung) sind empfehlenswert."},
  };
  const info=cat?catInfo[cat]:null;
  return(
    <div className="result">
      <div className="result-title">📊 Auswertung Osteoporose-Risikocheck</div>
      <div className="thresh-row">
        <ThreshPill label="3%-Schwelle (3 J.)" threshold={t3} reached={r3}/>
        <ThreshPill label="5%-Schwelle (3 J.)" threshold={t5} reached={r5}/>
        <ThreshPill label="10%-Schwelle (3 J.)" threshold={t10} reached={r10}/>
      </div>
      {info&&(
        <div className={`rb ${info.cls}`}>
          <div className="rb-eye">{info.eye}</div>
          <div className="rb-h">{info.h}</div>
          <div className="rb-d">{info.d}</div>
        </div>
      )}
      {!info&&(
        <div style={{background:"#f8fafc",border:"1.5px solid #cbd5e1",borderRadius:7,padding:"14px 16px",marginBottom:15,color:"#475569",fontSize:12.5}}>
          Bitte Alter angeben für vollständige Risikokalkulation. DXA-Wert verbessert die Genauigkeit erheblich.
        </div>
      )}
      {genInd.length>0&&(
        <div className="gen-ind">
          <div className="gen-ind-title">⚠ Generelle Therapieindikationen (Tabelle 3.1, DVO 2023)</div>
          {genInd.map(g=><div key={g} className="gen-ind-item">• {g}</div>)}
        </div>
      )}
      <div className="calc-box">
        <div className="calc-lbl">Risikoberechnung nach DVO-Algorithmus</div>
        {top2.length?(
          <>
            {top2.map((f,i)=><div key={i} className="calc-row"><span>{i+1}. {f.label}</span><span>×{f.faktor}</span></div>)}
            <div className="calc-row"><span>Kombinierter Risikofaktor</span><span>×{cF.toFixed(2)}</span></div>
          </>
        ):(<div style={{fontSize:12,color:"#8b7a68",textAlign:"center",padding:"6px 0"}}>Keine Risikofaktoren erfasst</div>)}
      </div>
      {factors.length>0&&(
        <>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--L)",marginBottom:8}}>Alle erfassten Risikofaktoren</div>
          <table className="ftable">
            <thead><tr><th>Risikofaktor</th><th>ICD-10</th><th>Faktor</th><th>Gruppe</th></tr></thead>
            <tbody>
              {factors.map((f,i)=>(
                <tr key={i}>
                  <td>{f.label}</td>
                  <td>{f.icd?<span className="icd">{f.icd}</span>:"–"}</td>
                  <td><span className="fbadge">×{f.faktor}</span></td>
                  <td style={{fontSize:11,color:"#8b7a68"}}>{f.grp==="sturz"?"Sturzrisiko":f.grp==="gc_ra"?"GK/RA":"Allgemein"}</td>
                  <td className="rx-cell">{f.rx&&f.rx.length>0?f.rx.join(", "):"–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {diff&&<DiffCard diff={diff} currRisk={risk}/>}
      <DvoChart gender={gender} answers={answers}/>
      <div className="result-note">
        <strong>Wichtiger Hinweis:</strong> Diese Auswertung ist eine Orientierungshilfe auf Basis der DVO-Leitlinie 2023 und ersetzt keine ärztliche Diagnose. Die endgültige Therapieentscheidung erfordert vollständige klinische Untersuchung, Labordiagnostik und ggf. DXA-Knochendichtemessung.
      </div>
    </div>
  );
}

/* ─── LETTERHEAD EDITOR ─── */
function DvoChart({gender,answers}){
  const g=gender||"f";
  const ages=[50,55,60,65,70,75,80,85,90];
  const tscoreCols=["≥0","−0,5","−1,0","−1,5","−2,0","−2,5","−3,0","−3,5","<−3,5"];

  // Patient position — ONLY total hip (DVO 2023: no LWS evidence)
  const patAge=parseInt(answers.alter)||null;
  const patRow=patAge?ageRow(patAge):null;
  const hipVal=answers.dxa_hip!==undefined&&answers.dxa_hip!==""?parseFloat(answers.dxa_hip):null;
  const patColIdx=(hipVal!==null&&!isNaN(hipVal))?tCol(hipVal)-1:null;
  const hasDxa=hipVal!==null&&!isNaN(hipVal);

  // Patient's combined risk factor
  const risk=computeRisk(answers,g);
  const{cF,t3,t5,t10,r3,r5,r10}=risk;

  // Which table to show as primary based on T-score:
  //   ≥ -1.5  (near normal / leichte Osteopenie)  → 3%
  //   -1.5 bis -2.5 (mäßige Osteopenie/Osteoporose) → 5%
  //   < -2.5  (manifeste Osteoporose)              → 10%
  let primaryPerc = 3;
  if(hasDxa){
    if(hipVal < -2.5)      primaryPerc = 10;
    else if(hipVal < -1.5) primaryPerc = 5;
    else                   primaryPerc = 3;
  }
  const [activePerc, setActivePerc] = useState(primaryPerc);
  // Sync when patient data changes
  const prevPrimRef = React.useRef(primaryPerc);
  if(prevPrimRef.current!==primaryPerc){prevPrimRef.current=primaryPerc;if(hasDxa)setActivePerc(primaryPerc);}

  const percLabel={3:"3%-Tabelle",5:"5%-Tabelle",10:"10%-Tabelle"};
  const percDesc={
    3:"T-Score Gesamthüfte ≥ −1,5 (normwertig / leichte Osteopenie) – 3-Jahres-Frakturrisikogrenze",
    5:"T-Score Gesamthüfte −1,5 bis −2,5 (Osteopenie / beginnende Osteoporose) – 3-Jahres-Frakturrisikogrenze",
    10:"T-Score Gesamthüfte < −2,5 (manifeste Osteoporose) – 3-Jahres-Frakturrisikogrenze",
  };

  // Cell display value = from active table, color = based on cF value range (all cells colored like DVO original)
  // cF ≤ 1.0            → rot   (Schwelle bereits ohne Zusatzrisiken überschritten)
  // 1.0 < cF ≤ 2.0      → rosa  (wenige Risikofaktoren reichen)
  // 2.0 < cF ≤ 4.0      → gelb  (mehrere Risikofaktoren nötig)
  // cF > 4.0 oder null  → grün  (sehr niedriges Basisrisiko)
  const getCellInfo=(age,ci)=>{
    const v=(THRESH[g][activePerc][age]||[])[ci];
    if(v===null||v===undefined) return{v:null,cls:"c0"};
    if(v<=1.0)  return{v,cls:"c-top"};
    if(v<=2.0)  return{v,cls:"c-high"};
    if(v<=4.0)  return{v,cls:"c-mod"};
    return{v,cls:"c-low"};
  };

  // Patient cell: color by their actual cF vs ALL thresholds (highest reached)
  const getPatCellCls=()=>{
    if(!hasDxa||!patAge) return null;
    if(r10) return"c-top";
    if(r5)  return"c-high";
    if(r3)  return"c-mod";
    if(r3===false) return"c-low";
    return null;
  };
  const patCellCls=getPatCellCls();

  const tabBtn=(p)=>{
    const isActive=activePerc===p;
    const isPrimary=primaryPerc===p;
    return(
      <button onClick={()=>setActivePerc(p)} style={{
        padding:"6px 14px",border:"none",borderRadius:5,cursor:"pointer",
        fontFamily:"'Source Sans 3',sans-serif",fontSize:12,fontWeight:isActive?700:500,
        background:isActive?(p===10?"#ef4444":p===5?"#f97316":"#22c55e"):"#3d2a15",
        color:"white",
        outline:isPrimary&&!isActive?"2px solid #c8a070":"none",
        outlineOffset:2,
        opacity:isActive?1:0.7,
      }}>
        {percLabel[p]}{isPrimary?" ★":""}
      </button>
    );
  };

  return(
    <div className="dvo-chart-wrap">
      <div className="dvo-chart-head">
        <div style={{flex:1}}>
          <div className="dvo-chart-title">
            DVO 2023 – Tabelle 3.2: {percLabel[activePerc]} {g==="f"?"(Frau ♀)":"(Mann ♂)"}
          </div>
          <div className="dvo-chart-sub">{percDesc[activePerc]}</div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
          {tabBtn(3)}{tabBtn(5)}{tabBtn(10)}
        </div>
      </div>

      {/* Patient summary bar */}
      {(patRow||hasDxa)&&(
        <div style={{display:"flex",gap:8,flexWrap:"wrap",padding:"8px 12px",
          background:"#2c1f0e",borderBottom:"1px solid #4a3420",fontSize:12}}>
          {patRow&&<span style={{background:"#4a3420",color:"#e8ddd0",padding:"3px 10px",borderRadius:4}}>
            Alter: <strong>{patAge} J.</strong> → Zeile {patRow} J.
          </span>}
          {hasDxa&&<span style={{background:"#4a3420",color:"#e8ddd0",padding:"3px 10px",borderRadius:4}}>
            T-Score Gesamthüfte: <strong>{hipVal?.toFixed(1)}</strong> → Spalte {tscoreCols[patColIdx]}
          </span>}
          {!hasDxa&&<span style={{background:"#3d2a15",color:"#f59e0b",padding:"3px 10px",borderRadius:4}}>
            ℹ Kein DXA-Wert (Gesamthüfte) · LWS: keine Evidenz (DVO 2023)
          </span>}
          {hasDxa&&<span style={{background:"#3d2a15",color:"#f59e0b",padding:"3px 10px",borderRadius:4,fontSize:11}}>
            ★ = empfohlene Tabelle laut T-Score
          </span>}
          {hasDxa&&patRow&&patCellCls&&(
            <span style={{background:
              patCellCls==="c-top"?"#ff0000":
              patCellCls==="c-high"?"#ff9999":
              patCellCls==="c-mod"?"#cccc00":"#92d050",
              color:"white",padding:"3px 10px",borderRadius:4,fontWeight:700}}>
              {patCellCls==="c-top"||patCellCls==="c-high"||patCellCls==="c-mod"?
                `⚠ ${activePerc}%-Schwelle überschritten`:"✓ Unter Schwelle"}
              {" "}(cF ×{cF.toFixed(2)} / benötigt ×{activePerc===10?t10:activePerc===5?t5:t3})
            </span>
          )}
        </div>
      )}

      <div className="dvo-chart-body">
        <table className="dvo-grid">
          <thead>
            <tr>
              <th style={{textAlign:"left",minWidth:52}}>Alter</th>
              {tscoreCols.map((col,i)=>(
                <th key={i} style={patColIdx===i?{background:"#c8a070",color:"#2c1f0e"}:{}}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ages.map(age=>{
              const isPatRow=patRow===age;
              return(
                <tr key={age} style={isPatRow?{outline:"2px solid #c8a070",outlineOffset:-1}:{}}>
                  <td style={{background:isPatRow?"#c8a070":"var(--CL)",fontWeight:700,
                    color:isPatRow?"#2c1f0e":"var(--D)",textAlign:"left",paddingLeft:9,
                    borderRight:"2px solid var(--P)",whiteSpace:"nowrap"}}>
                    {age}J.{isPatRow?" 👤":""}
                  </td>
                  {tscoreCols.map((_,ci)=>{
                    const{v,cls}=getCellInfo(age,ci);
                    const isPatCell=isPatRow&&patColIdx===ci;
                    const cellCls=isPatCell?(patCellCls||cls):cls;
                    return(
                      <td key={ci} className={cellCls+(isPatCell?" current":"")}>
                        {v!==null?v:"–"}
                        {isPatCell&&<div style={{fontSize:9,lineHeight:1.1,marginTop:1,opacity:0.85}}>←Sie</div>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="dvo-legend">
        <span className="dvo-legend-item"><span className="dvo-legend-dot" style={{background:"#92d050",border:"1px solid #5a8a20"}}/> unter 3%-Schwelle</span>
        <span className="dvo-legend-item"><span className="dvo-legend-dot" style={{background:"#ffff00",border:"1px solid #cccc00"}}/> 3%-Schwelle</span>
        <span className="dvo-legend-item"><span className="dvo-legend-dot" style={{background:"#ff9999",border:"1px solid #cc4444"}}/> 5%-Schwelle</span>
        <span className="dvo-legend-item"><span className="dvo-legend-dot" style={{background:"#ff0000",border:"1px solid #990000"}}/> 10%-Schwelle</span>
        <span className="dvo-legend-item"><span className="dvo-legend-dot" style={{background:"white",border:"2.5px solid #c8a070"}}/> 👤 Patient</span>
      </div>
      <div className="dvo-note">
        Quelle: DVO-Leitlinie 2023, Tabelle 3.2 · AWMF 183-001 · Werte = benötigter cF für jeweilige Schwelle (3 Jahre).
        ★ = automatisch empfohlene Tabelle. Alle 3 Tabellen per Knopf abrufbar.
        <strong> LWS: keine ausreichende Evidenz (DVO 2023) – nicht für Schwellenbestimmung.</strong>
      </div>
    </div>
  );
}

function LetterheadEditor({lh,onSave}){
  const[open,setOpen]=useState(false);
  const[draft,setDraft]=useState(lh);
  useEffect(()=>setDraft(lh),[lh]);
  const up=(k,v)=>setDraft(p=>({...p,[k]:v}));
  const save=()=>{onSave(draft);setOpen(false);};
  const cancel=()=>{setDraft(lh);setOpen(false);};
  return(
    <div className="lh-wrap">
      <div className="lh-display">
        <div className="lh-logo">⚕</div>
        <div className="lh-text">
          <div className="lh-name">{lh.name}</div>
          {lh.title&&<div className="lh-title">{lh.title}</div>}
          <div className="lh-addr">{lh.strasse}{lh.strasse&&lh.plz_ort?" · ":""}{lh.plz_ort}</div>
          {(lh.telefon||lh.fax||lh.email)&&(
            <div className="lh-contact">
              {lh.telefon&&`Tel.: ${lh.telefon}`}
              {lh.fax&&` | Fax: ${lh.fax}`}
              {lh.email&&` | ${lh.email}`}
            </div>
          )}
        </div>
        <button className="lh-edit-btn no-print" onClick={()=>setOpen(o=>!o)}>
          {open?"✕ Abbrechen":"✏ Briefkopf bearbeiten"}
        </button>
      </div>
      {open&&(
        <div className="lh-form">
          <div className="lh-form-title">Briefkopf bearbeiten</div>
          <div className="lh-grid">
            <div className="lh-field"><label>Name / Titel</label><input value={draft.name} onChange={e=>up("name",e.target.value)} placeholder="Dr. med. Mustermann"/></div>
            <div className="lh-field"><label>Fachrichtung</label><input value={draft.title} onChange={e=>up("title",e.target.value)} placeholder="Facharzt für …"/></div>
            <div className="lh-field"><label>Straße und Hausnummer</label><input value={draft.strasse} onChange={e=>up("strasse",e.target.value)} placeholder="Musterstraße 1"/></div>
            <div className="lh-field"><label>PLZ und Ort</label><input value={draft.plz_ort} onChange={e=>up("plz_ort",e.target.value)} placeholder="12345 Musterstadt"/></div>
            <div className="lh-field"><label>Telefon (optional)</label><input value={draft.telefon} onChange={e=>up("telefon",e.target.value)} placeholder="040 / …"/></div>
            <div className="lh-field"><label>Fax (optional)</label><input value={draft.fax} onChange={e=>up("fax",e.target.value)} placeholder="040 / …"/></div>
          </div>
          <div className="lh-field" style={{marginBottom:14}}><label>E-Mail (optional)</label><input value={draft.email} style={{maxWidth:320}} onChange={e=>up("email",e.target.value)} placeholder="praxis@example.de"/></div>
          <div className="lh-btn-row">
            <button className="lh-save" onClick={save}>💾 Speichern</button>
            <button className="lh-cancel" onClick={cancel}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── HISTORY PANEL ─── */
function HistoryPanel({sessions,onLoad,onDelete,onClose,gender}){
  const patSessions=sessions.filter(s=>s.gender===gender||!gender);
  return(
    <div className="hist-panel">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div className="hist-title">📂 Gespeicherte Befunde ({patSessions.length})</div>
        <button className="lh-cancel" onClick={onClose}>Schließen</button>
      </div>
      {patSessions.length===0?(
        <div className="hist-empty">Noch keine Befunde gespeichert.</div>
      ):patSessions.slice().reverse().map(s=>(
        <div key={s.id} className="hist-item">
          <div className="hist-date">{s.fillDate}</div>
          <div className="hist-pat">
            {s.patient?.name||"(kein Name)"} &nbsp;·&nbsp; {s.gender==="f"?"Frau":"Mann"}
            {s.patient?.geburtsdatum&&` · *${s.patient.geburtsdatum}`}
            <span style={{color:"#8b7a68",fontSize:11,marginLeft:8}}>Risikofaktor ×{s.riskSnapshot?.cF?.toFixed(2)||"–"}</span>
          </div>
          <div className="hist-risk"><RiskBadge cat={s.riskSnapshot?.cat}/></div>
          <button className="hist-load-btn no-print" onClick={()=>onLoad(s)}>Laden</button>
          <button className="hist-del no-print" onClick={()=>onDelete(s.id)} title="Löschen">✕</button>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════ MAIN APP ═══ */
function GebDatInput({value,onChange}){
  const age=calcAgeFromBirthdate(value);
  const invalid=age!==null&&(age<18||age>130);
  const borderColor=invalid?"#c0392b":"var(--CM)";
  return(
    <div>
      <input value={value} onChange={e=>{
        const d=e.target.value.replace(/\D/g,"").slice(0,8);
        let val=d;
        if(d.length>4) val=d.slice(0,2)+"."+d.slice(2,4)+"."+d.slice(4);
        else if(d.length>2) val=d.slice(0,2)+"."+d.slice(2);
        onChange(val);
      }} placeholder="TT.MM.JJJJ" type="text" inputMode="numeric"
      style={{border:"1.5px solid "+borderColor,borderRadius:5,padding:"8px 11px",
        fontSize:13.5,color:"var(--D)",outline:"none",
        fontFamily:"'Source Sans 3',sans-serif",width:"100%",boxSizing:"border-box"}}/>
      {invalid&&(
        <div style={{fontSize:11,color:"#c0392b",marginTop:3,fontWeight:600}}>
          ⚠ Alter {age} Jahre – gültig: 18–130 Jahre
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════ ADMIN PANEL ═══ */
function AdminPanel({diagDb,onSave,onClose}){
  const ICD5_RE=/^[A-Z]\d{2}\.\d{2}$/;
  const allIds=Object.keys(DIAG_DB_DEFAULTS);
  const[draft,setDraft]=useState(()=>{
    const d={};
    for(const id of allIds)d[id]={...DIAG_DB_DEFAULTS[id],...(diagDb[id]||{})};
    return d;
  });
  const[pinInput,setPinInput]=useState("");
  const[pinErr,setPinErr]=useState(false);
  const[unlocked,setUnlocked]=useState(false);

  const update=(id,field,val)=>{
    setDraft(d=>({...d,[id]:{...d[id],[field]:val}}));
  };
  const handleSave=()=>{
    onSave(draft);
    onClose();
  };
  const handleReset=()=>{
    if(window.confirm("Alle Diagnosen auf Standardwerte zurücksetzen?"))
      setDraft(()=>{const d={};for(const id of allIds)d[id]={...DIAG_DB_DEFAULTS[id]};return d;});
  };
  const tryPin=()=>{
    if(pinInput==="1234"){setUnlocked(true);setPinErr(false);}
    else{setPinErr(true);}
  };

  // Label lookup from SECTIONS
  const labelMap={};
  for(const sec of SECTIONS){
    for(const q of sec.qs)labelMap[q.id]=q.label;
  }
  labelMap["bmi"]="BMI (berechnet)";
  labelMap["tbs"]="TBS (DXA Texturanalyse)";

  return(
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-panel" onClick={e=>e.stopPropagation()}>
        <div className="admin-head">
          <span className="admin-head-title">⚙️ Admin – Diagnose-Tabelle</span>
          <button className="viewer-close" onClick={onClose}>×</button>
        </div>
        {!unlocked?(
          <div className="admin-pin-wrap">
            <span style={{fontSize:13,color:"#5a4a3a",fontWeight:600}}>PIN eingeben:</span>
            <input className="admin-pin-input" type="password" maxLength={4} value={pinInput}
              onChange={e=>setPinInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&tryPin()}
              placeholder="••••" autoFocus/>
            <button className="admin-pin-btn" onClick={tryPin}>Entsperren</button>
            {pinErr&&<span className="admin-pin-err">Falscher PIN</span>}
          </div>
        ):(
          <>
            <div style={{padding:"8px 16px",background:"#fef9f4",borderBottom:"1px solid #ece5d8",fontSize:11.5,color:"#7a6a58"}}>
              ICD-10 Format: 1 Buchstabe + 2 Ziffern + Punkt + 2 Ziffern&nbsp;&nbsp;(z. B. <strong>M80.05</strong>)&nbsp;&nbsp;·&nbsp;&nbsp;Rote Felder = ungültiges Format
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{width:110}}>Kennung</th>
                    <th style={{width:200}}>Frage (Kurzform)</th>
                    <th>Klarschrift-Diagnose</th>
                    <th style={{width:100}}>ICD-10 (5-stellig)</th>
                  </tr>
                </thead>
                <tbody>
                  {allIds.map(id=>{
                    const row=draft[id]||{};
                    const icdOk=ICD5_RE.test(row.icd5||"");
                    const shortLabel=(labelMap[id]||id).replace(/\?$/,"").slice(0,60)+(labelMap[id]&&labelMap[id].length>60?"…":"");
                    return(
                      <tr key={id}>
                        <td className="admin-td-id">{id}</td>
                        <td style={{fontSize:11,color:"#5a4a3a",lineHeight:1.4}}>{shortLabel}</td>
                        <td>
                          <input className="admin-input" value={row.diagnose||""} onChange={e=>update(id,"diagnose",e.target.value)}/>
                        </td>
                        <td>
                          <input className={"admin-icd-input"+(icdOk?"":" invalid")}
                            value={row.icd5||""} maxLength={7}
                            onChange={e=>update(id,"icd5",e.target.value.toUpperCase())}/>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="admin-footer">
              <button className="admin-reset-btn" onClick={handleReset}>↩ Auf Standard zurücksetzen</button>
              <button className="admin-save-btn" onClick={handleSave}>✓ Speichern</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function App(){
  const today=new Date().toLocaleDateString("de-DE");
  const[lh,setLh]=useState(DEFAULT_LH);
  const[disclaimerOk,setDisclaimerOk]=useState(false);
  const[printHint,setPrintHint]=useState(false);
  const[showDlModal,setShowDlModal]=useState(null);
  const[diagDb,setDiagDb]=useState(DIAG_DB_DEFAULTS);
  const[adminOpen,setAdminOpen]=useState(false);
  const[adminPin,setAdminPin]=useState("");
  const[adminUnlocked,setAdminUnlocked]=useState(false);
  const ADMIN_PIN="1234";
  const[viewer,setViewer]=useState(null); // {type:"txt"|"pdf", content:string}
  const isAndroid=/Android/i.test(navigator.userAgent);
  const isIOS=/iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isMobile=isAndroid||isIOS;
  const hasPicker=!isMobile&&typeof window.showSaveFilePicker==="function";
  const[gender,setGender]=useState(null);
  const[answers,setAnswers]=useState({});
  const[patient,setPatient]=useState({name:"",geburtsdatum:"",fillDate:today});
  const[openSec,setOpenSec]=useState({});
  const[showResult,setShowResult]=useState(false);
  const[showHist,setShowHist]=useState(false);
  const[sessions,setSessions]=useState([]);
  const[saveStatus,setSaveStatus]=useState("ok");// ok|saving|unsaved
  const saveTimer=useRef(null);

  // Load from storage on mount
  useEffect(()=>{
    (async()=>{
      const storedLh=await storageGet(STORE_LH);
      if(storedLh)setLh(storedLh);
      const draft=await storageGet(STORE_DRAFT);
      if(draft){
        if(draft.gender)setGender(draft.gender);
        if(draft.answers)setAnswers(draft.answers);
        if(draft.patient)setPatient(p=>({...p,...draft.patient,fillDate:today}));
      }
      const sess=await storageGet(STORE_SESSIONS,[]);
      const savedDb=await loadDiagDbAsync();setDiagDb(savedDb);
      setSessions(sess);
    })();
  },[]);

  // Auto-save draft
  const triggerSave=useCallback(()=>{
    setSaveStatus("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(async()=>{
      await storageSet(STORE_DRAFT,{gender,answers,patient});
      setSaveStatus("ok");
    },1500);
  },[gender,answers,patient]);

  useEffect(()=>{if(gender){setSaveStatus("unsaved");triggerSave();}},[gender,answers,patient,triggerSave]);

  const setA=(id,val)=>setAnswers(p=>({...p,[id]:val}));
  const setP=(k,v)=>setPatient(p=>({...p,[k]:v}));
  const toggleSec=(id)=>setOpenSec(p=>({...p,[id]:!p[id]}));

  const visibleSecs=gender?SECTIONS.filter(s=>!s.onlyFor||s.onlyFor===gender):[];
  const totalQ=visibleSecs.flatMap(s=>s.qs).length;
  const answeredQ=Object.values(answers).filter(v=>v!==null&&v!==undefined&&v!=="").length;
  const prog=totalQ>0?Math.round((answeredQ/totalQ)*100):0;
  const bmi=calcBMI(parseFloat(answers.groesse),parseFloat(answers.gewicht));

  // Find previous session for same patient (for diff)
  const prevSession=sessions.filter(s=>{
    if(!patient.name)return false;
    return s.patient?.name?.toLowerCase()===patient.name.toLowerCase()&&
           (!patient.geburtsdatum||s.patient?.geburtsdatum===patient.geburtsdatum);
  }).slice(-1)[0]||null;
  const diff=showResult&&prevSession?computeDiff(answers,prevSession,gender):null;
  const risk=gender?computeRisk(answers,gender):null;

  // Save session to history
  const saveSession=async()=>{
    if(!gender)return;
    const snap=risk||computeRisk(answers,gender);
    const session={
      id:Date.now().toString(),
      fillDate:today,
      patient:{...patient},
      gender,
      answers:{...answers},
      riskSnapshot:{cat:snap.cat,cF:snap.cF,r3:snap.r3,r5:snap.r5,r10:snap.r10}
    };
    const updated=[...sessions,session].slice(-50);
    setSessions(updated);
    await storageSet(STORE_SESSIONS,updated);
    return session;
  };

  const handleSaveLh=async(newLh)=>{setLh(newLh);await storageSet(STORE_LH,newLh);};

  /* ── open TXT viewer ── */
  const handleText=async()=>{
    if(!gender){setViewer({type:"txt",content:"Bitte zuerst Geschlecht auswählen."});return;}
    await saveSession();
    const r=computeRisk(answers,gender);
    const d=prevSession?computeDiff(answers,prevSession,gender):null;
    const text=buildTextExport(patient,gender,answers,r,d,lh,diagDb);
    setViewer({type:"txt",content:text});
  };
  const handlePrint=async()=>{
    if(!gender){alert("Bitte zuerst Geschlecht auswählen.");return;}
    await saveSession();
    const allOpen={};visibleSecs.forEach(s=>allOpen[s.id]=true);
    setOpenSec(allOpen);setShowResult(true);
    // Use window.print() directly after a short delay for DOM to update
    setTimeout(()=>window.print(),500);
  };

  const handleCalc=async()=>{
    await saveSession();
    setShowResult(true);
    setTimeout(()=>document.querySelector(".result")?.scrollIntoView({behavior:"smooth"}),100);
  };

  const handleReset=()=>{
    setAnswers({});setShowResult(false);setOpenSec({});
    setPatient({name:"",geburtsdatum:"",fillDate:today});setGender(null);setDisclaimerOk(false);
    storageSet(STORE_DRAFT,null);
  };

  const handleLoadSession=async(s)=>{
    setGender(s.gender);setAnswers(s.answers);
    setPatient({...s.patient,fillDate:today});
    setShowHist(false);setShowResult(false);
  };

  const handleDeleteSession=async(id)=>{
    const updated=sessions.filter(s=>s.id!==id);
    setSessions(updated);await storageSet(STORE_SESSIONS,updated);
  };

  const openAllSections=()=>{
    const all={};visibleSecs.forEach(s=>all[s.id]=true);setOpenSec(all);
  };

  return(
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      <div className="app">

        <div className="action-strip">
          <div className="action-strip-title">📁 Befunde &amp; Ausgabe</div>
          <button className="as-btn" onClick={()=>setShowHist(v=>!v)}>
            📂 Verlauf ({sessions.length})
          </button>
          {sessions.length>0&&(
            <button className="as-btn hi" onClick={()=>handleLoadSession(sessions[0])}>
              ⟳ {sessions[0]?.patient?.name||"Letzten"} ({sessions[0]?.fillDate||"–"}) laden
            </button>
          )}
          {gender&&<>
            <button className="as-btn" onClick={handleCalc}>📊 Auswertung</button>
            <button className="as-btn" style={{marginLeft:"auto"}} onClick={()=>setAdminOpen(true)}>⚙️ Admin</button>
            <button className="as-btn" onClick={handlePrint}>🖨 PDF speichern unter…</button>
            <button className="as-btn" onClick={handleText}>💾 TXT speichern unter…</button>
          </>}
        </div>

        {/* ── Letterhead (screen + print) ── */}
        <LetterheadEditor lh={lh} onSave={handleSaveLh}/>

        {/* ── App Header ── */}
        <div className="hdr">
          <div className="hdr-eye">Dachverband Osteologie e.V.</div>
          <h1>Osteoporose-Risikocheck</h1>
          <p className="hdr-sub">Systematische Erfassung von Risikofaktoren für Osteoporose und Knochenbrüche – mit automatischer Berechnung der DVO-Therapieschwellen.</p>
          <div className="badge">DVO-Leitlinie 2023 · S3-Leitlinie AWMF 183-001 · Version 2.1</div>
        </div>

        {/* ── Save indicator ── */}
        {gender&&(
          <div className={`save-ind ${saveStatus} no-print`}>
            <span className="save-dot"/>
            {saveStatus==="ok"&&"Alle Eingaben automatisch gespeichert"}
            {saveStatus==="saving"&&"Wird gespeichert…"}
            {saveStatus==="unsaved"&&"Nicht gespeicherte Änderungen"}
          </div>
        )}

        {/* ── Disclaimer Gate ── */}
        <div className={"disclaimer-gate no-print"+(disclaimerOk?" accepted":"")}>
          <div className="disclaimer-gate-title">
            {disclaimerOk?"✅":"⚠️"} Nutzungshinweis
          </div>
          <div className="disclaimer-gate-text">
            Basierend auf der DVO-Leitlinie 2023 zur Prophylaxe, Diagnostik und Therapie der Osteoporose (AWMF-Register 183-001, Version 2.1, November 2023 / Juni 2024). Medikamentennamen sind Beispiele in Deutschland zugelassener Präparate (ohne Gewähr auf Vollständigkeit).<br/><br/>
            <strong>Dieses Instrument dient der Veranschaulichung oder Schulung und ist keine Unterstützung klinischer Entscheidungen und ersetzt keine individuelle ärztliche Beurteilung.</strong>
          </div>
          <label className="disclaimer-gate-check">
            <input type="checkbox" checked={disclaimerOk} onChange={e=>setDisclaimerOk(e.target.checked)}/>
            <span>Ich habe den Hinweis gelesen und verstanden. Dieses Tool wird ausschließlich zu Schulungs- oder Veranschaulichungszwecken verwendet.</span>
          </label>
          {!disclaimerOk&&(
            <div className="disclaimer-gate-blocked">
              ⛔ Bitte bestätigen Sie den Hinweis, um das Formular auszufüllen.
            </div>
          )}
        </div>

        {/* ── Patient card ── */}
        <div className="pat-card" style={disclaimerOk?{}:{opacity:.35,pointerEvents:"none",userSelect:"none"}}>
          <div className="pat-card-title">👤 Patientendaten &amp; Ausfülldatum</div>
          <div className="pat-grid">
            <div className="pat-field"><label>Name des Patienten / der Patientin</label>
              <input value={patient.name} onChange={e=>setP("name",autoCapitalizeName(e.target.value))} placeholder="Nachname, Vorname"/></div>
            <div className="pat-field"><label>Geburtsdatum</label>
              <GebDatInput
                value={patient.geburtsdatum}
                onChange={val=>{
                  setP("geburtsdatum",val);
                  const age=calcAgeFromBirthdate(val);
                  if(age!==null)setA("alter",String(age));
                }}/>
            </div>
            <div className="pat-field">
              <label>Größe (cm)</label>
              <input className="pat-field" value={answers.groesse||""} type="number" min={80} max={250}
                onChange={e=>setA("groesse",e.target.value)}
                placeholder="80–250" style={{width:"100%",padding:"8px 11px",border:"1.5px solid "+(answers.groesse&&(parseFloat(answers.groesse)<80||parseFloat(answers.groesse)>250)?"#c0392b":"var(--CM)"),borderRadius:5,fontSize:13.5,color:"var(--D)",outline:"none",fontFamily:"'Source Sans 3',sans-serif"}}/>
              {answers.groesse&&(parseFloat(answers.groesse)<80||parseFloat(answers.groesse)>250)&&<div style={{fontSize:11,color:"#c0392b",marginTop:2}}>Gültig: 80–250 cm</div>}
            </div>
            <div className="pat-field">
              <label>Gewicht (kg)</label>
              <input value={answers.gewicht||""} type="number" min={30} max={300}
                onChange={e=>setA("gewicht",e.target.value)}
                placeholder="30–300" style={{width:"100%",padding:"8px 11px",border:"1.5px solid "+(answers.gewicht&&(parseFloat(answers.gewicht)<30||parseFloat(answers.gewicht)>300)?"#c0392b":"var(--CM)"),borderRadius:5,fontSize:13.5,color:"var(--D)",outline:"none",fontFamily:"'Source Sans 3',sans-serif"}}/>
              {answers.gewicht&&(parseFloat(answers.gewicht)<30||parseFloat(answers.gewicht)>300)&&<div style={{fontSize:11,color:"#c0392b",marginTop:2}}>Gültig: 30–300 kg</div>}
            </div>
            <div className="pat-field">
              <label>Alter (Jahre){patient.geburtsdatum&&calcAgeFromBirthdate(patient.geburtsdatum)!==null?<span style={{marginLeft:6,fontSize:10,color:"#16a34a",fontWeight:600}}>✓ berechnet</span>:null}</label>
              <input value={answers.alter||""} type="number" min={18} max={130}
                onChange={e=>setA("alter",e.target.value)}
                placeholder="18–130"
                readOnly={!!patient.geburtsdatum&&calcAgeFromBirthdate(patient.geburtsdatum)!==null}
                style={{width:"100%",padding:"8px 11px",border:"1.5px solid "+(answers.alter&&(parseInt(answers.alter)<18||parseInt(answers.alter)>130)?"#c0392b":"var(--CM)"),borderRadius:5,fontSize:13.5,color:"var(--D)",outline:"none",fontFamily:"'Source Sans 3',sans-serif",background:patient.geburtsdatum&&calcAgeFromBirthdate(patient.geburtsdatum)!==null?"#f0fdf4":"white"}}/>

            </div>
            <div className="pat-field">
              <label>Biologisches Geschlecht</label>
              <div className="pat-gender-row">
                <button className={`gbtn${gender==="f"?" active":""}`} onClick={()=>{setGender("f");setShowResult(false);}}>♀ Frau</button>
                <button className={`gbtn${gender==="m"?" active":""}`} onClick={()=>{setGender("m");setShowResult(false);}}>♂ Mann</button>
              </div>
            </div>
          </div>
          <div className="fill-date-row">
            📅 Ausfülldatum: <strong>{today}</strong>
            {prevSession&&<span style={{marginLeft:12,color:"#0369a1"}}>🔁 Vorbefund vom {prevSession.fillDate} gefunden</span>}
          </div>
          {bmi&&(
            <div className="bmi-pill" style={{marginTop:10}}>
              📊 BMI: <strong>{bmi.toFixed(1)} kg/m²</strong>
              {bmi<15?" — sehr starkes Untergewicht (Faktor ×2,2)":bmi<18.5?" — Untergewicht (Faktor ×1,7)":bmi<20?" — leichtes Untergewicht (Faktor ×1,3)":" — kein BMI-bedingtes erhöhtes Risiko"}
            </div>
          )}
        </div>

        {/* ── Progress ── */}
        {gender&&(
          <div className="prog-wrap no-print">
            <div className="prog-label">{answeredQ} von {totalQ} Fragen beantwortet ({prog}%)</div>
            <div className="prog-bar"><div className="prog-fill" style={{width:`${prog}%`}}/></div>
          </div>
        )}

        {!gender&&(
          <div style={{textAlign:"center",padding:"30px 20px",color:"#8b7a68",fontSize:14,background:"white",borderRadius:8,border:"1px dashed var(--P)"}}>
            Bitte oben das biologische Geschlecht auswählen, um den Fragebogen zu starten.
          </div>
        )}

        {/* ── Questionnaire Sections (DXA is last section) ── */}
        {disclaimerOk&&gender&&visibleSecs.map(s=>(
          <Section key={s.id} section={s} open={!!openSec[s.id]}
            onToggle={()=>toggleSec(s.id)} answers={answers} onAnswer={setA} onRx={setA}/>
        ))}

        {/* ── Bottom Action Bar (at end as requested) ── */}
        {gender&&(
          <div className="bottom-bar">
            <div className="bottom-bar-title">🗂 Aktionen &amp; Ausgabe</div>
            <div className="btn-row">
              <button className="btn-calc no-print" onClick={handleCalc}>📊 Auswertung berechnen</button>
              <button className="btn-pdf no-print" onClick={handlePrint}>🖨 Als PDF speichern unter…</button>
              <button className="btn-txt no-print" onClick={handleText}>📄 Textdatei speichern unter…</button>
              <button className="btn-hist no-print" onClick={()=>setShowHist(v=>!v)}>
                📂 Verlauf ({sessions.filter(s=>s.gender===gender||(patient.name&&s.patient?.name?.toLowerCase()===patient.name.toLowerCase())).length})
              </button>
              <button className="btn-calc no-print" style={{background:"white",color:"var(--M)",border:"1.5px solid var(--P)"}}
                onClick={openAllSections}>↕ Alle öffnen</button>
              <button className="btn-reset no-print" onClick={handleReset}>↺ Zurücksetzen</button>
            </div>
          </div>
        )}

        {/* ── History Panel ── */}
        {showHist&&<HistoryPanel sessions={sessions} onLoad={handleLoadSession}
          onDelete={handleDeleteSession} onClose={()=>setShowHist(false)} gender={gender}/>}

        {/* ── Result ── */}
        {showResult&&gender&&(
          <ResultCard gender={gender} answers={answers} patient={patient} diff={diff}/>
        )}

        <div className="disclaimer" style={{marginTop:18}}>
          <strong>DVO-Leitlinie 2023</strong> · AWMF-Register 183-001, Version 2.1 · November 2023 / Juni 2024
        </div>
      </div>

            {adminOpen&&(
        <AdminPanel diagDb={diagDb} onClose={()=>{setAdminOpen(false);setAdminPin("");}}
          onSave={db=>{setDiagDb(db);saveDiagDb(db);}}/>
      )}
            {viewer&&(
        <div className="viewer-overlay">
          <div className="viewer-bar">
            {viewer.type==="txt"?(
              <>
                <span className="viewer-bar-title">📄 Befundbericht – Textansicht</span>
                <button className="viewer-btn primary" onClick={()=>{
                  const ta=document.getElementById("viewer-ta");
                  if(ta){ta.select();document.execCommand("copy");}
                }}>📋 Kopieren</button>
                <button className="viewer-btn" onClick={()=>{
                  const blob=new Blob([viewer.content],{type:"text/plain;charset=utf-8"});
                  const fname=`Osteoporose_${(patient.name||"Patient").replace(/[^a-zA-Z0-9_\-äöüÄÖÜß]/g,"_")}_${today.replace(/\./g,"-")}.txt`;
                  const url=URL.createObjectURL(blob);
                  const a=document.createElement("a");a.href=url;a.download=fname;
                  document.body.appendChild(a);a.click();
                  document.body.removeChild(a);URL.revokeObjectURL(url);
                }}>⬇️ Herunterladen</button>
              </>
            ):(
              <>
                <span className="viewer-bar-title">🖨 Befundbericht – Druckansicht</span>
                <button className="viewer-btn primary" onClick={()=>{
                  const iframe=document.getElementById("viewer-iframe");
                  if(iframe&&iframe.contentWindow)iframe.contentWindow.print();
                  else window.print();
                }}>🖨 Drucken / Als PDF</button>
              </>
            )}
            <button className="viewer-close" onClick={()=>setViewer(null)}>×</button>
          </div>
          <div className="viewer-body">
            {viewer.type==="txt"
              ?<textarea id="viewer-ta" className="viewer-txt" readOnly value={viewer.content}/>
              :<iframe id="viewer-iframe" className="viewer-iframe" srcDoc={viewer.content} title="Druckansicht"/>
            }
          </div>
        </div>
      )}
    </>
  );
}
export default App;
