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
.badge{display:inline-block;background:white;color:#1a1a1a;font-size:11px;font-weight:700;letter-spacing:1px;border:1.5px solid #ccc;padding:5px 14px;border-radius:4px}

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
.sec-hdr-sym{background:linear-gradient(135deg,#2a1a0a,#3d2a10)!important}
.sec-hdr-sym .sec-title{color:#f0d890!important}
.sec-hdr-sym .sec-sub{color:#c8a870!important}
.sec-hdr-sym.open{background:linear-gradient(135deg,#1a0a00,#2d1a05)!important}
.sec-hdr:hover{background:var(--CL)}
.sec-hdr.open{background:#d4edda;border-left:4px solid #4cae6b}
.sec-icon{width:32px;height:32px;border-radius:50%;background:var(--CR);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.sec-hdr.open .sec-icon{background:rgba(76,174,107,.18)}
.sec-title{font-family:'Playfair Display',serif;font-size:16px;font-weight:600;color:var(--D)}
.sec-hdr.open .sec-title{color:#1a4a2a;font-weight:700}
.sec-sub{font-size:13px;color:#a09080;margin-top:1px}
.sec-hdr.open .sec-sub{color:#3a6a4a}
.chev{font-size:11px;color:#a09080;transition:transform .3s;flex-shrink:0}
.sec-hdr.open .chev{transform:rotate(180deg);color:#3a6a4a}
.sec-body{padding:0 20px;max-height:0;overflow:hidden;transition:max-height .4s ease,padding .2s}
.sec-hdr.open.has-risk{background:#fde8e8;border-left:4px solid #e05555}
.sec-hdr.open.has-risk .sec-title{color:#7a1a1a;font-weight:700}
.sec-hdr.open.has-risk .sec-sub{color:#a03030}
.sec-hdr.open.has-risk .sec-icon{background:rgba(224,85,85,.15)}
.sec-hdr.open.has-risk .chev{color:#a03030}
.sec-hdr.has-risk:not(.open){background:#fff0f0;border-left:4px solid #e05555}
.sec-hdr.has-risk:not(.open) .sec-title{color:#7a1a1a}
.sec-hdr.has-risk:not(.open) .sec-sub{color:#a03030}
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
.sek-panel{margin-top:20px;border-radius:10px;overflow:hidden;border:2px solid #e0c88a;box-shadow:0 2px 12px rgba(0,0,0,.08)}
.sek-panel-header{background:linear-gradient(135deg,#7c5c2a,#a07840);color:#fff;padding:14px 20px;display:flex;align-items:center;gap:10px}
.sek-panel-title{font-family:'Playfair Display',serif;font-size:16px;font-weight:700}
.sek-panel-sub{font-size:12px;opacity:.85;margin-top:2px}
.sek-panel-body{background:#fffdf8;padding:0}
.sek-item{border-bottom:1px solid #f0e8d8;padding:16px 20px}
.sek-item:last-child{border-bottom:none}
.sek-item-header{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.sek-item-icon{font-size:18px;flex-shrink:0}
.sek-item-label{font-size:14px;font-weight:700;color:#5a3a10}
.sek-item-count{background:#f59e0b;color:#fff;border-radius:12px;padding:2px 9px;font-size:11px;font-weight:700;margin-left:auto;white-space:nowrap}
.sek-item-count.strong{background:#dc2626}
.sek-hinweis{background:#fffbf0;border-left:3px solid #f59e0b;padding:8px 12px;font-size:12.5px;color:#5a4020;margin-bottom:10px;border-radius:0 5px 5px 0}
.sek-unt-title{font-size:11px;font-weight:700;color:#8b6a3a;text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px}
.sek-unt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:5px}
.sek-unt-item{display:flex;align-items:flex-start;gap:6px;padding:5px 8px;background:white;border:1px solid #e8dfc8;border-radius:5px;font-size:12px}
.sek-unt-item::before{content:"🔬";font-size:11px;flex-shrink:0;margin-top:1px}
.sek-unt-icd{font-family:monospace;font-size:10px;color:#a08060;margin-left:auto;white-space:nowrap}
.sek-none{padding:20px;text-align:center;color:#8b7a68;font-style:italic;font-size:13px}
.sek-triggers{background:#f8f2e8;border:1px solid #e8d8b8;border-radius:6px;padding:8px 12px;margin-bottom:10px}
.sek-triggers-title{font-size:10px;font-weight:700;color:#8b6a3a;text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px;display:flex;align-items:center;gap:5px}
.sek-trigger-row{display:flex;gap:8px;align-items:flex-start;padding:4px 0;border-bottom:1px solid #ede0c8;font-size:12px}
.sek-trigger-row:last-child{border-bottom:none;padding-bottom:0}
.sek-trigger-check{color:#16a34a;font-size:13px;flex-shrink:0;margin-top:1px}
.sek-trigger-q{color:#4a3a20;flex:1;line-height:1.45}
.sek-trigger-sec{font-size:10px;color:#a08060;white-space:nowrap;margin-top:2px}
.hist-panel{background:white;border:1px solid var(--CM);border-radius:8px;padding:18px;margin-top:14px;box-shadow:var(--sh)}
.hist-title{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:var(--D)}
.hist-search{flex:1;min-width:160px;padding:6px 10px;border:1.5px solid var(--CM);border-radius:5px;font-size:12.5px;font-family:'Source Sans 3',sans-serif;outline:none;color:var(--D)}
.hist-search:focus{border-color:var(--L)}
.hist-select{padding:6px 8px;border:1.5px solid var(--CM);border-radius:5px;font-size:12px;background:white;color:var(--D);font-family:'Source Sans 3',sans-serif;cursor:pointer}
.hist-export-btn{background:#f0fdf4;color:#166534;border:1.5px solid #86efac;padding:5px 12px;border-radius:5px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Source Sans 3',sans-serif}
.hist-export-btn:hover{background:#dcfce7}
.hist-item{padding:10px 12px;border:1px solid var(--CM);border-radius:6px;margin-bottom:7px;font-size:12.5px;transition:background .15s;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.hist-item:hover{background:var(--CL)}
.hist-date{font-weight:700;color:var(--D);white-space:nowrap;font-size:12px}
.hist-pat{color:var(--M);flex:1;font-size:12px;min-width:120px}
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
.dvo-grid{border-collapse:collapse;font-size:12px;min-width:580px;width:100%;background:white}
.dvo-grid th{background:#f2f2f2;color:#1a1a1a;padding:7px 8px;text-align:center;font-size:11px;font-weight:700;border:1.5px solid #aaa;line-height:1.3}
.dvo-grid th.age-hdr{background:#e8e8e8;text-align:left;font-size:11px;font-weight:700;padding:7px 10px;min-width:90px}
.dvo-grid td{padding:6px 8px;text-align:center;border:1.5px solid #aaa;font-size:12px;font-weight:600;color:#222;background:white}
.dvo-grid td.age-cell{background:#f2f2f2;font-weight:700;text-align:center;color:#111;border:1.5px solid #aaa}
.dvo-grid td.c0{background:#e8e8e8;color:#888;font-weight:400}
.dvo-grid td.c-low{background:#FFD966;color:#5a3a00;font-weight:700}
.dvo-grid td.c-high{background:#F4A030;color:#4a1a00;font-weight:700}
.dvo-grid td.c-top{background:#D42020;color:#fff;font-weight:700}
.dvo-grid td.current{outline:3px solid #c8a070;outline-offset:-2px;font-size:13px}
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
.admin-panel{background:white;border-radius:10px;width:min(860px,97vw);max-height:92vh;display:flex;flex-direction:column;box-shadow:0 12px 50px rgba(0,0,0,.3);overflow:hidden}
.admin-head{background:#1a1208;color:#e8ddd0;padding:14px 20px;display:flex;align-items:center;gap:12px;flex-shrink:0}
.admin-head-title{flex:1;font-family:'Playfair Display',serif;font-size:16px;font-weight:700}
.admin-pin-wrap{display:flex;align-items:center;gap:10px;padding:20px;border-bottom:1px solid #ece5d8;background:#fdf9f4}
.admin-pin-input{padding:9px 14px;border:1.5px solid var(--CM);border-radius:5px;font-size:14px;font-family:'Source Sans 3',sans-serif;width:120px;letter-spacing:4px}
.admin-pin-input:focus{outline:none;border-color:var(--L)}
.admin-pin-btn{background:var(--D);color:#e8ddd0;border:none;padding:9px 18px;border-radius:5px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Source Sans 3',sans-serif}
.admin-pin-btn:hover{background:#4a3420}
.admin-pin-err{color:#c0392b;font-size:12px;font-weight:600}
/* ── New card-based admin layout ── */
.admin-scroll{flex:1;overflow-y:auto;padding:10px 14px;background:#f8f4ef}
.admin-card{background:white;border:1px solid #e0d4bc;border-radius:8px;margin-bottom:8px;overflow:hidden}
.admin-card-header{padding:8px 12px;background:#f5f0e6;border-bottom:1px solid #e8ddd0;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.admin-card-id{font-family:monospace;font-size:10.5px;color:#8b6a3a;background:#efe8d8;padding:2px 7px;border-radius:3px;white-space:nowrap;flex-shrink:0}
.admin-card-label{font-size:11.5px;color:#4a3a20;line-height:1.4;flex:1}
.admin-card-body{padding:8px 12px 10px}
.admin-diag-row{display:grid;grid-template-columns:1fr 160px auto;gap:6px;align-items:center;margin-bottom:5px}
.admin-diag-row:last-of-type{margin-bottom:0}
.admin-input{width:100%;padding:6px 9px;border:1px solid #d4c4a8;border-radius:4px;font-size:12.5px;font-family:'Source Sans 3',sans-serif;background:white;box-sizing:border-box}
.admin-input:focus{outline:none;border-color:var(--L);background:#fffbf5}
.admin-icd-input{width:100%;padding:6px 9px;border:1px solid #d4c4a8;border-radius:4px;font-size:12.5px;font-family:monospace;background:white;box-sizing:border-box;text-transform:uppercase}
.admin-icd-input:focus{outline:none;border-color:var(--L)}
.admin-icd-input.invalid{border-color:#c0392b;background:#fff0f0}
.admin-del-btn{background:none;border:1px solid #e0c8c8;color:#c0392b;border-radius:4px;width:26px;height:26px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0}
.admin-del-btn:hover{background:#fee2e2}
.admin-del-btn:disabled{opacity:.3;cursor:not-allowed}
.admin-add-btn{margin-top:6px;background:none;border:1px dashed #b09060;color:#8b6030;border-radius:4px;padding:4px 12px;font-size:11.5px;cursor:pointer;font-family:'Source Sans 3',sans-serif;display:flex;align-items:center;gap:4px}
.admin-add-btn:hover{background:#fef6e8;border-color:var(--L)}
.admin-gender-hint{font-size:10px;color:#8b7a68;margin-top:4px;line-height:1.5;padding:4px 6px;background:#fafaf5;border-radius:3px;border-left:2px solid #d4c4a8}
.admin-diag-labels{display:grid;grid-template-columns:1fr 160px auto;gap:6px;margin-bottom:3px}
.admin-diag-col-label{font-size:10px;font-weight:700;color:#a09080;text-transform:uppercase;letter-spacing:.6px}
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
/* ─── CAMERA SCANNER ─── */
.cam-overlay{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:1200;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:16px;overflow-y:auto}
.cam-panel{background:#1a1a1a;border-radius:12px;width:100%;max-width:560px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.7)}
.cam-head{background:#111;padding:14px 18px;display:flex;align-items:center;justify-content:space-between}
.cam-title{color:#f0f0f0;font-size:15px;font-weight:700;font-family:'Source Sans 3',sans-serif}
.cam-close{background:none;border:none;color:#aaa;font-size:22px;cursor:pointer;line-height:1;padding:0 4px}
.cam-mode-row{display:flex;gap:0;border-bottom:1px solid #333}
.cam-mode-btn{flex:1;padding:10px 6px;background:none;border:none;color:#888;font-size:12px;font-weight:600;cursor:pointer;font-family:'Source Sans 3',sans-serif;border-bottom:3px solid transparent;transition:all .2s}
.cam-mode-btn.active{color:#4ade80;border-bottom-color:#4ade80}
.cam-video-wrap{position:relative;background:#000;width:100%;aspect-ratio:4/3;overflow:hidden}
.cam-video{width:100%;height:100%;object-fit:cover}
.cam-canvas{display:none}
.cam-overlay-frame{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}
.cam-frame-box{width:72%;aspect-ratio:1;border:3px solid rgba(74,222,128,.8);border-radius:8px;box-shadow:0 0 0 9999px rgba(0,0,0,.35)}
.cam-frame-box.barcode{aspect-ratio:3/1;border-radius:4px}
.cam-frame-hint{position:absolute;bottom:12px;left:0;right:0;text-align:center;color:rgba(255,255,255,.8);font-size:12px;font-family:'Source Sans 3',sans-serif}
.cam-controls{padding:12px 16px;display:flex;gap:8px;justify-content:center;background:#111}
.cam-snap-btn{background:#4ade80;color:#111;border:none;padding:10px 24px;border-radius:6px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Source Sans 3',sans-serif}
.cam-snap-btn:disabled{opacity:.4;cursor:not-allowed}
.cam-snap-btn.danger{background:#f87171;color:white}
.cam-result{padding:14px 16px;background:#0f1a0f;border-top:1px solid #2a4a2a;max-height:320px;overflow-y:auto}
.cam-result-title{color:#4ade80;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;font-family:'Source Sans 3',sans-serif}
.cam-med-item{display:flex;align-items:center;gap:10px;padding:8px 10px;background:#1a2a1a;border:1px solid #2d4a2d;border-radius:6px;margin-bottom:6px}
.cam-med-check{width:18px;height:18px;accent-color:#4ade80;cursor:pointer;flex-shrink:0}
.cam-med-name{color:#e0f0e0;font-size:13px;font-family:'Source Sans 3',sans-serif;flex:1}
.cam-med-cat{color:#6a9a6a;font-size:11px;font-family:'Source Sans 3',sans-serif}
.cam-apply-btn{width:100%;background:#4ade80;color:#111;border:none;padding:10px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;margin-top:10px;font-family:'Source Sans 3',sans-serif}
.cam-status{padding:10px 16px;text-align:center;color:#aaa;font-size:12.5px;font-family:'Source Sans 3',sans-serif;background:#111}
.cam-status.scanning{color:#fbbf24}
.cam-status.success{color:#4ade80}
.cam-status.error{color:#f87171}
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
    10:{50:[39,33,23,16,11,8,5,3.6,2.5,null],55:[29,26,18,12,8,6,4,2.6,1.8,null],60:[21,20,14,9,6,4,3,1.9,null,null],65:[15,16,11,7,5,3,2.2,null,null,null],70:[11,12,8,6,4,2.5,1.7,null,null,null],75:[8,10,7,4.5,3,2.0,1.3,null,null,null],80:[5,8,5,3.6,2.4,1.6,null,null,null,null],85:[3.2,7,4,2.8,1.8,1.2,null,null,null,null],90:[1.6,5,3,2,1.3,null,null,null,null,null]}
  }
};
function tCol(t){if(!t&&t!==0)return 0;const v=parseFloat(t);if(isNaN(v))return 0;if(v>=0)return 1;if(v>=-0.5)return 2;if(v>=-1.0)return 3;if(v>=-1.5)return 4;if(v>=-2.0)return 5;if(v>=-2.5)return 6;if(v>=-3.0)return 7;if(v>=-3.5)return 8;return 9;}
function ageRow(age){const a=Math.max(50,Math.min(90,parseInt(age)||65));return[50,55,60,65,70,75,80,85,90].reduce((b,r)=>Math.abs(r-a)<Math.abs(b-a)?r:b,50);}
function getTh(g,p,age,t){const r=ageRow(age);const c=tCol(t);return THRESH[g]?.[p]?.[r]?.[c]??null;}

/* ═══════════════════════════════════════════════ SECTIONS DATA ═══ */
const M=(t,i)=>({title:t,items:i});
const SECTIONS=[
  {id:"frakturen",icon:"🦴",title:"Frühere Knochenbrüche",sub:"Fragilitätsfrakturen (kein schwerer Unfall)",qs:[
    {id:"hueft_akut",t:"yn",label:"Haben Sie in den letzten 12 Monaten einen Hüftbruch gehabt?",faktor:4.1,icd:"S72.0, M80.05",hint:"Niedrig-traumatisch = Bruch durch Alltagsbewegung oder Sturz aus Standhöhe."},
    {id:"hueft_alt",t:"yn",label:"Haben Sie früher einmal einen Hüftbruch gehabt – vor mehr als einem Jahr?",faktor:2.5,icd:"S72.0, Z87.39"},
    {id:"wirbelbruch_akut",t:"yn",label:"Haben Sie in den letzten 12 Monaten einen Knochen in der Wirbelsäule gebrochen?",faktor:2.9,icd:"S22, M80.08"},
    {id:"wirbelbruch_anz",t:"radio",label:"Haben Sie früher einen Knochen in der Wirbelsäule gebrochen – vor mehr als einem Jahr?",icd:"M80.08",
      opts:["Keiner","1 Wirbelbruch","2 Wirbelbrüche","3 oder mehr Wirbelbrüche"],
      fmap:{"1 Wirbelbruch":2.0,"2 Wirbelbrüche":2.9,"3 oder mehr Wirbelbrüche":5.0},
      hint:"1 Fraktur=×2,0 | 2=×2,9 | 3+=×5,0. Alternativ Genant-Grad verwenden (s. u.). Immer nur ein WKFx-Faktor einsetzen – der stärkste gilt."},
    {id:"genant",t:"radio",
      label:"Wenn ein Röntgenbefund der Wirbelsäule vorliegt: Welcher Schweregrad nach Genant wurde festgestellt?",
      fmap:{"Grad 1 (leicht, 20–25 % Höhenverlust)":2.0,"Grad 2 (mittelgradig, 25–40 % Höhenverlust)":2.9,"Grad 3 (schwer, > 40 % Höhenverlust)":5.0},
      hint:"Der Genant-Schweregrad ist eine Alternative zur Frakturanzahl – es gilt immer der stärkste WKFx-Faktor. Beispiel: Grad 3 (×5,0) überschreibt '2 Wirbelbrüche' (×2,9). Nur ein WKFx-Faktor darf multipliziert werden."},
    {id:"humerus",t:"yn",label:"Haben Sie jemals den Oberarmknochen gebrochen?",faktor:1.7,icd:"S42.2, M80.02"},
    {id:"becken",t:"yn",label:"Haben Sie jemals einen Knochen im Becken gebrochen?",faktor:1.7,icd:"S32, M80.0"},
    {id:"unterarm",t:"yn",label:"Haben Sie jemals den Unterarmknochen (Speiche) gebrochen?",faktor:1.6,icd:"S52, M80.03"},
    {id:"eltern",t:"yn",label:"Hat Ihre Mutter oder Ihr Vater jemals einen Hüftbruch gehabt?",faktor:1.3,icd:"Z82.61"},
  ]},
  {id:"meds",icon:"💊",title:"Medikamente – Knochen & Sturzrisiko",sub:"Regelmäßig eingenommene Medikamente mit Einfluss auf Knochen oder Sturzrisiko",qs:[
    {id:"glukokortikoide",t:"radio",label:"Nehmen Sie Kortison-Tabletten – seit mehr als 3 Monaten?\nBeispiele: Prednisolon, Decortin®",
      hint:"Kortison-Tabletten und -Säfte hemmen den Knochenaufbau stark. Asthma-Inhalationssprays und Nasensprays zählen nicht.",icd:"Z79.52, M81.4",
      opts:["Nein","Sehr niedrige Dosis (< 2,5 mg Prednisolon/Tag)","Mittlere Dosis (2,5–7,5 mg Prednisolon/Tag)","Hohe Dosis (> 7,5 mg Prednisolon/Tag)","Hohe Dosis – erst kürzlich begonnen oder erhöht"],
      fmap:{"Sehr niedrige Dosis (< 2,5 mg Prednisolon/Tag)":1.4,"Mittlere Dosis (2,5–7,5 mg Prednisolon/Tag)":2.3,"Hohe Dosis (> 7,5 mg Prednisolon/Tag)":4.0,"Hohe Dosis – erst kürzlich begonnen oder erhöht":4.9},
      meds:M("Orale Glukokortikoide",["Prednisolon (Decortin®, Prednigalen®, Prednisolon GALEN®, Prednisolon AL®, Hefasolon®)","Methylprednisolon (Medrol®, Urbason®, Methylprednisolon JENAPHARM®)","Dexamethason (Fortecortin®, Dexa-ratiopharm®, Dexabene®, Dexamethason JENAPHARM®)","Betamethason (Celestamine® N, Celestan®)","Prednison (Prednison acis®)","Cortison (Cortison CIBA®)","Triamcinolon (Volon A®, Triamhexal®)","Budesonid oral (Budenofalk®, Entocort®)","Hydrocortison (Hydrocortison GALEN®, Kortison H Hoechst®)","Deflazacort (Calcort®)"])},
    {id:"ppi",t:"yn",label:"Nehmen Sie täglich Tabletten gegen Sodbrennen oder Magensäure – seit mehr als 3 Monaten?\nBeispiele: Omeprazol, Pantoprazol, Nexium®",faktor:1.4,icd:"Z79.899",
      hint:"Gemeint sind Protonenpumpenhemmer wie Pantoprazol oder Omeprazol. Sie werden oft langfristig verordnet und können die Kalziumaufnahme vermindern.",
      meds:M("Protonenpumpenhemmer (PPI)",["Omeprazol (Antra®, Omep®, Omeprazol-ratiopharm®, Omeprazol AL®)","Pantoprazol (Pantozol®, Pantoloc®, Pantoprazol-ratiopharm®, Pantoprazol AL®, Panto-Byk®)","Esomeprazol (Nexium®, Emanera®, Esomeprazol Sandoz®)","Lansoprazol (Agopton®, Lanzor®, Lansoprazol-ratiopharm®)","Rabeprazol (Pariet®)","Dexlansoprazol (Dexilant®)"])},
    {id:"antidepressiva",t:"yn",label:"Nehmen Sie Medikamente gegen Depression oder anhaltende Niedergeschlagenheit?\nBeispiele: Citalopram, Sertralin, Venlafaxin, Amitriptylin",faktor:1.3,icd:"T43",
      hint:"Antidepressiva – auch die neueren, gut verträglichen Mittel (z. B. Sertralin, Citalopram) – erhöhen das Sturz- und Knochenbruchrisiko.",
      meds:M("Antidepressiva (SSRI / SNRI / TZA und andere)",["Citalopram (Cipramil®, Citalopram-ratiopharm®, Citalopram AL®)","Escitalopram (Cipralex®, Escitalopram-ratiopharm®, Escitalopram AL®)","Sertralin (Zoloft®, Sertralin-ratiopharm®, Sertralin AL®, Sertralin Heumann®)","Fluoxetin (Fluctin®, Fluoxetin-ratiopharm®, Fluoxetin AL®)","Fluvoxamin (Fevarin®)","Paroxetin (Seroxat®, Paroxat®, Paroxetin-ratiopharm®)","Venlafaxin (Trevilor®, Efexor®, Venlafaxin-ratiopharm®, Venlafaxin AL®)","Duloxetin (Cymbalta®, Yentreve®, Duloxetin-ratiopharm®)","Mirtazapin (Remergil®, Mirtazapin-ratiopharm®, Mirtazapin AL®)","Amitriptylin (Saroten®, Amineurin®, Amitriptylin-ratiopharm®)","Nortriptylin (Nortrilen®)","Doxepin (Aponal®, Sinquan®, Doxepin-ratiopharm®)","Imipramin (Tofranil®)","Clomipramin (Anafranil®)","Trimipramin (Stangyl®)","Bupropion (Wellbutrin®, Elontril®)","Vortioxetin (Brintellix®, Trintellix®)","Moclobemid (Aurorix®)","Tranylcypromin (Jatrosom®)","Agomelatin (Valdoxan®)","Trazodon (Trittico®)","Reboxetin (Edronax®, Solvex®)"])},
    {id:"opioide",t:"yn",label:"Nehmen Sie starke Schmerzmittel?\nBeispiele: Morphin, Oxycodon, Tramadol, Tilidin, Fentanyl-Pflaster",faktor:1.4,icd:"Z79.891",
      hint:"Starke Schmerzmittel wie Morphin, Oxycodon, Tramadol oder Fentanyl-Pflaster erhöhen das Sturzrisiko (Schwindel, Benommenheit) und wirken sich direkt negativ auf den Knochen aus.",
      meds:M("Opioidanalgetika",["Tramadol (Tramal®, Tramadolor®, Tramabeta®, Tramadol-ratiopharm®, Tramadol AL®)","Tilidin + Naloxon (Valoron N®, Tilidin-ratiopharm plus®, Tilidin AL comp®)","Codein (z. B. in Kombipräparaten, Hustensäften)","Dihydrocodein (DHC Mundipharma®)","Morphin (MST Mundipharma®, Sevredol®, Morphin-ratiopharm®, Capros®)","Oxycodon (Oxygesic®, Oxycodon-ratiopharm®, OxyContin®)","Oxycodon + Naloxon (Targin®, Oxycodon/Naloxon-ratiopharm®)","Hydromorphon (Palladon®, Jurnista®)","Buprenorphin TD (Transtec®, Norspan®, BuTrans®)","Buprenorphin SL (Temgesic®, Subutex®)","Fentanyl (Durogesic®, Actiq®, Abstral®, Effentora®, Instanyl®, PecFent®)","Tapentadol (Palexia®, Palexia® retard)","Methadon (L-Polamidon®)","Piritramid (Dipidolor®)","Pethidin (Dolantin®)"])},
    {id:"antipsychotika",t:"yn",label:"Nehmen Sie Medikamente gegen starke Unruhe, Wahnvorstellungen oder Psychosen?\nBeispiele: Quetiapin, Haloperidol, Risperidon, Olanzapin",faktor:1.3,icd:"Z79.899",
      hint:"Diese Medikamente (z. B. Haloperidol, Quetiapin, Risperidon) erhöhen das Sturzrisiko und beeinflussen den Knochenstoffwechsel über den Hormonhaushalt.",
      meds:M("Antipsychotika / Neuroleptika",["Haloperidol (Haldol®, Haloperidol-ratiopharm®, Haloperidol NEURAXPHARM®)","Risperidon (Risperdal®, Risperidon-ratiopharm®, Risperidon AL®)","Olanzapin (Zyprexa®, Olanzapin-ratiopharm®, Olanzapin AL®)","Quetiapin (Seroquel®, Quetiapin-ratiopharm®, Quetiapin AL®)","Clozapin (Leponex®, Clozapin-ratiopharm®)","Aripiprazol (Abilify®, Aripiprazol-ratiopharm®)","Amisulprid (Solian®, Amisulprid-ratiopharm®)","Ziprasidon (Zeldox®)","Paliperidon (Invega®, Xeplion®)","Cariprazin (Reagila®)","Brexpiprazol (Rxulti®)","Lurasidon (Latuda®)","Asenapin (Sycrest®)","Flupentixol (Fluanxol®)","Zuclopenthixol (Ciatyl-Z®)","Melperon (Eunerpan®)","Pipamperon (Dipiperon®)","Sulpirid (Dogmatil®)","Tiaprid (Tiapridex®)","Perazin (Taxilan®)","Levomepromazin (Neurocil®)","Promethazin (Atosil®)","Prothipendyl (Dominal®)"])},
    {id:"sedativa",t:"yn",label:"Nehmen Sie regelmäßig Beruhigungs- oder Schlafmittel?\nBeispiele: Diazepam, Lorazepam, Zolpidem, Zopiclon",faktor:1.3,icd:"Z79.899",
      hint:"Mittel wie Diazepam (Valium®), Lorazepam (Tavor®), Zolpidem (Stilnox®) oder Zopiclon können tagsüber Schläfrigkeit und verlangsamte Reflexe verursachen und dadurch das Sturzrisiko erhöhen.",
      meds:M("Benzodiazepine und Z-Substanzen",["Diazepam (Valium®, Faustan®, Diazepam-ratiopharm®, Diazepam Desitin®)","Lorazepam (Tavor®, Lorazepam-ratiopharm®, Lorazepam neuraxpharm®)","Alprazolam (Xanax®, Tafil®, Alprazolam-ratiopharm®)","Oxazepam (Adumbran®, Praxiten®, Oxazepam-ratiopharm®)","Temazepam (Planum®, Remestan®)","Nitrazepam (Mogadan®, Novanox®)","Flunitrazepam (Rohypnol®)","Clobazam (Frisium®)","Chlordiazepoxid (Librium®)","Bromazepam (Lexotanil®, Normoc®)","Clonazepam (Rivotril®)","Zolpidem (Stilnox®, Zolpidem-ratiopharm®, Zolpidem AL®)","Zopiclon (Ximovan®, Optidorm®, Zopiclon-ratiopharm®)","Zaleplon (Sonata®)","Melatonin retard (Circadin®, Slenyto®)"])},
    {id:"schilddruese",t:"radio",label:"Nehmen Sie Tabletten für die Schilddrüse – und hat Ihr Arzt gesagt, der TSH-Wert sei zu niedrig?\nBeispiele: L-Thyroxin, Euthyrox®",icd:"Z79.899",
      hint:"Schilddrüsenhormone sind erst dann ein Risiko für die Knochen, wenn die Dosis zu hoch ist – erkennbar an einem TSH unter 0,5 mU/l im Blutbild.",
      opts:["Nein / kein Schilddrüsenhormon oder TSH normal","TSH leicht erniedrigt (0,1–0,45 mU/l)","TSH stark erniedrigt (< 0,1 mU/l)"],
      fmap:{"TSH leicht erniedrigt (0,1–0,45 mU/l)":1.2,"TSH stark erniedrigt (< 0,1 mU/l)":1.2},
      meds:M("Schilddrüsenhormone",["Levothyroxin (Euthyrox®, L-Thyrox® HEXAL, Berlthyrox®, Eutirox®, Levothyroxin HENNING®, L-Thyrox® AbZ)","Liothyronin (Thybon®)","Kombination: Novothyral® (Levothyroxin + Liothyronin)"])},
    {id:"glitazone",t:"yn",label:"Nehmen Sie das Diabetesmittel Pioglitazon (Actos®)?",faktor:1.3,icd:"Z79.899",
      hint:"Pioglitazon (Wirkstoffgruppe: Glitazone/Thiazolidindione) ist ein Blutzuckermittel, das – besonders bei Frauen – das Knochenbruchrisiko erhöht.",
      meds:M("Glitazone",["Pioglitazon (Actos®, Pioglitazon-ratiopharm®, Pioglitazon Sandoz®, Pioglitazon Teva®, Competact® + Metformin, Tandemact® + Glimepirid, Zomarist® + Sitagliptin)"])},
    {id:"antikonvulsiva",t:"yn",label:"Nehmen Sie Medikamente gegen Epilepsie oder Krampfanfälle?\nBeispiele: Carbamazepin, Valproat, Pregabalin, Gabapentin, Lamotrigin",faktor:1.2,icd:"Z79.899",
      hint:"Viele Antiepileptika (z. B. Carbamazepin, Valproat, Phenytoin) beschleunigen den Vitamin-D-Abbau und erhöhen das Sturzrisiko. Auch Pregabalin und Gabapentin, die oft gegen Nervenschmerzen eingesetzt werden, zählen dazu.",
      meds:M("Antikonvulsiva / Antiepileptika",["Valproinsäure/Valproat (Depakine®, Orfiril®, Ergenyl®, Valpro AL®)","Carbamazepin (Tegretal®, Timonil®, Carbamazepin-ratiopharm®)","Phenytoin (Phenhydan®, Epanutin®)","Phenobarbital (Luminal®, Phenobarbital-neuraxpharm®)","Primidon (Liskantin®, Mylepsinum®)","Lamotrigin (Lamictal®, Lamotrigin-ratiopharm®, Lamotrigin AL®)","Levetiracetam (Keppra®, Levetiracetam-ratiopharm®, Levetiracetam AL®)","Topiramat (Topamax®, Topiramat-ratiopharm®)","Gabapentin (Neurontin®, Gabapentin-ratiopharm®, Gabapentin AL®)","Pregabalin (Lyrica®, Pregabalin-ratiopharm®, Pregabalin AL®)","Oxcarbazepin (Trileptal®)","Eslicarbazepinacetat (Zebinix®)","Lacosamid (Vimpat®)","Zonisamid (Zonegran®)","Perampanel (Fycompa®)","Brivaracetam (Briviact®)","Vigabatrin (Sabril®)","Clonazepam (Rivotril®)"])},
    {id:"orthostase",t:"yn",label:"Haben Sie beim Aufstehen manchmal Schwindel – und könnte das an Ihren Medikamenten liegen?\nDas passiert zum Beispiel bei Blutdruckmitteln, Wassertabletten oder Prostatamitteln.",faktor:1.2,icd:"Z79.899",
      hint:"Manche Medikamente lassen den Blutdruck beim raschen Aufstehen kurz abfallen (Orthostase). Das kann zu Schwindel und Stürzen führen. Typisch: Betablocker, ACE-Hemmer, Diuretika (Wassertabletten), Alpha-Blocker bei Prostatabeschwerden.",
      meds:M("Orthostase-auslösende Medikamente",["Alpha-1-Blocker: Tamsulosin (Alna®, Tamsulosin-ratiopharm®), Alfuzosin (Urion®), Doxazosin (Diblocin®), Terazosin (Flotrin®)","Antihypertensiva: ACE-Hemmer, Sartane, Kalziumantagonisten, Betablocker","Diuretika: Furosemid (Lasix®), Torasemid (Torem®, Unat®), HCT-Kombinationen","Nitrate: Glyceroltrinitrat (Nitrolingual®), Isosorbidmononitrat (Mono Mack®)","Dopaminagonisten: Levodopa-Kombinationen, Pramipexol (Sifrol®), Ropinirol (Requip®), Rotigotin (Neupro®)","Anticholinergika: Oxybutynin (Ditropan®), Tolterodin (Detrusitol®)"])},
  ]},
  {id:"meds_f",icon:"🌸",title:"Medikamente – nur Frauen",sub:"Hormonbezogene Osteoporose-Risiken",onlyFor:"f",qs:[
    {id:"aromatasehemmer",t:"yn",label:"Nehmen Sie nach einer Brustkrebsbehandlung Tabletten, die das Hormon Östrogen blockieren?\nBeispiele: Anastrozol, Letrozol, Exemestan",faktor:1.7,icd:"Z79.811",hint:"Aromatasehemmer (z. B. Anastrozol, Letrozol, Exemestan) senken den Östrogenspiegel auf nahezu null. Das führt zu raschem Knochenverlust.",
      meds:M("Aromatasehemmer (in Deutschland zugelassen)",["Anastrozol (Arimidex®, Anastrozol-ratiopharm®, Anastrozol Sandoz®, Anastrozol Heumann®, Anastrozol AL®)","Letrozol (Femara®, Letrozol-ratiopharm®, Letrozol Sandoz®, Letrozol AL®, Letrozol Heumann®)","Exemestan (Aromasin®, Exemestan-ratiopharm®, Exemestan Teva®)"])},
    {id:"fruehe_meno",t:"yn",label:"Hatten Sie Ihre Wechseljahre schon vor dem 45. Geburtstag?\nOder wurden Ihnen beide Eierstöcke operativ entfernt?",faktor:1.5,icd:"N95.0, Z90.71",
      hint:"Eine früh einsetzende Menopause oder operative Entfernung der Eierstöcke bedeutet einen langen Zeitraum ohne schützende Östrogenwirkung auf den Knochen."},
    {id:"gnrh_f",t:"yn",label:"Bekommen Sie Spritzen oder ein Hormon-Implantat, das Ihre Eierstöcke vorübergehend abschaltet?\nDas wird zum Beispiel bei Endometriose oder Brustkrebs eingesetzt.\nBeispiele: Zoladex®, Enantone®",faktor:1.7,icd:"Z79.818G",hint:"Diese Medikamente (z. B. Zoladex®, Enantone®) schalten die Eierstöcke vorübergehend ab und verursachen eine künstliche Menopause mit raschem Knochenverlust.",
      meds:M("GnRH-Agonisten (Frauen)",["Leuprorelin (Enantone® Gyn, Trenantone® Gyn, Leuprolin Hexal®)","Goserelin (Zoladex® 3,6 mg)","Buserelin (Profact® Depot)","Triptorelin (Decapeptyl® Gyn, Pamorelin®)","Nafarelin (Synarel® Nasenspray)"])},
    {id:"menopause_aktuell",t:"yn_inv",label:"Haben Sie noch Ihre monatliche Regelblutung?",
      hint:"Die Menopause (letzter Zyklus) ist entscheidend für die ICD-10-Kodierung der Osteoporose: Nach der Menopause liegt immer eine postmenopausale Osteoporose (M81.0 / M80.0) vor.",
      subfield:{id:"menopause_seit",label:"Seit wann haben Sie keine Regelblutung mehr? (Bitte Jahr oder Alter angeben)",placeholder:"z. B. 2018 oder Alter 50",showIf:"nein"}},
  ]},
  {id:"meds_m",icon:"🔵",title:"Medikamente – nur Männer",sub:"Hormonablative Therapie bei Prostataerkrankungen",onlyFor:"m",qs:[
    {id:"hormonablation",t:"yn",label:"Bekommen Sie Spritzen gegen Prostatakrebs, die Ihr Testosteron unterdrücken?\nBeispiele: Zoladex®, Enantone®, Firmagon®",faktor:2.0,icd:"Z79.818",hint:"Diese Therapie (z. B. Zoladex®, Enantone®, Firmagon®) senkt den Testosteronspiegel auf nahezu null. Das ist das stärkste hormonelle Risiko für Osteoporose beim Mann.",
      meds:M("GnRH-Agonisten und -Antagonisten (Männer)",["GnRH-Agonisten: Leuprorelin (Enantone®, Trenantone®, Eligard®, Leuprolin Hexal®)","Goserelin (Zoladex® 3,6 mg / 10,8 mg)","Buserelin (Profact® Depot)","Triptorelin (Decapeptyl®, Pamorelin®, Salvacyl®)","GnRH-Antagonisten: Degarelix (Firmagon®)","Relugolix (Orgovyx®)"])},
    {id:"antiandrogene",t:"yn",label:"Nehmen Sie Tabletten, die das männliche Hormon Testosteron blockieren – zum Beispiel bei Prostatakrebs?\nBeispiele: Bicalutamid, Enzalutamid, Abirateron",faktor:1.5,icd:"Z79.818",
      hint:"Medikamente wie Bicalutamid (Casodex®), Enzalutamid (Xtandi®) oder Abirateron (Zytiga®) blockieren die Wirkung von Testosteron und schwächen dadurch den Knochen.",
      meds:M("Antiandrogene / Androgenrezeptorblocker",["Bicalutamid (Casodex®, Bicalutamid-ratiopharm®, Bicalutamid AL®)","Flutamid (Fugerel®, Flutamid-ratiopharm®)","Enzalutamid (Xtandi®)","Apalutamid (Erleada®)","Darolutamid (Nubeqa®)","Cyproteronacetat (Androcur®, Cyprosteron-ratiopharm®)","Abirateron + Prednisolon (Zytiga®, Yonsa®)"])},
    {id:"hypogonadismus",t:"yn",label:"Hat Ihr Arzt einen dauerhaft zu niedrigen Testosteronwert festgestellt – nicht wegen einer Prostata-Behandlung?",faktor:1.8,icd:"E29.1, N50.1",hint:"Z. B. bei Erkrankungen der Hirnanhangdrüse (Hypophyse), Klinefelter-Syndrom oder anderen hormonellen Störungen. Ein niedriger Testosteronwert schwächt den Knochen ähnlich wie der Östrogenmangel bei Frauen."},
  ]},
  {id:"erkrankungen",icon:"🏥",title:"Grunderkrankungen",sub:"Bekannte Erkrankungen mit Einfluss auf die Knochen",qs:[
    {id:"rheuma",t:"yn",label:"Haben Sie entzündliches Gelenk-Rheuma?\nGemeint ist rheumatoide Arthritis – nicht Arthrose.",faktor:2.7,icd:"M05, M06",
      hint:"Gemeint ist das entzündliche Gelenk-Rheuma (nicht Arthrose). Zählt zur GK/RA-Gruppe – nur der stärkste Faktor dieser Gruppe wird gewertet."},
    {id:"diabetes1",t:"yn",label:"Haben Sie Typ-1-Diabetes? Das ist der Diabetes, der meist in der Kindheit beginnt und bei dem man Insulin spritzen muss.",faktor:2.5,icd:"E10",
      hint:"Typ-1-Diabetes beginnt meist im Kindes- oder Jugendalter und erfordert immer Insulin."},
    {id:"diabetes2",t:"radio",label:"Haben Sie Typ-2-Diabetes (Altersdiabetes)? Wenn ja: Seit wie vielen Jahren?",icd:"E11",
      hint:"Typ-2-Diabetes beginnt meist im Erwachsenenalter, oft behandelt mit Tabletten oder Insulin.",
      opts:["Nein","Seit 5–10 Jahren","Seit über 10 Jahren"],fmap:{"Seit 5–10 Jahren":1.2,"Seit über 10 Jahren":1.6}},
    {id:"hpth",t:"yn",label:"Hat Ihr Arzt festgestellt, dass Ihre Nebenschilddrüse überaktiv ist?\nDer Fachbegriff ist primärer Hyperparathyreoidismus.",faktor:2.2,icd:"E21.0",
      hint:"Die Nebenschilddrüsen (vier kleine Drüsen am Hals) steuern den Kalziumhaushalt. Bei dieser Erkrankung ist der Kalziumspiegel im Blut dauerhaft erhöht."},
    {id:"cushing",t:"yn",label:"Hat Ihr Arzt ein Cushing-Syndrom bei Ihnen festgestellt? Dabei ist das Stresshormon Kortisol dauerhaft zu hoch.",faktor:2.5,icd:"E24",
      hint:"Cortisol ist ein körpereigenes Stresshormon. Ein dauerhaft erhöhter Spiegel schwächt den Knochen stark."},
    {id:"schlaganfall",t:"yn",label:"Hatten Sie schon einmal einen Schlaganfall?",faktor:1.6,icd:"I63, I61",
      hint:"Auch ein leichter oder lange zurückliegender Schlaganfall zählt."},
    {id:"ms",t:"yn",label:"Haben Sie Multiple Sklerose (MS)?",faktor:2.1,icd:"G35",
      hint:"MS ist eine chronische Erkrankung des Nervensystems, die Bewegung und Gleichgewicht beeinflussen kann."},
    {id:"parkinson",t:"yn",label:"Haben Sie Parkinson?",faktor:1.7,icd:"G20",
      hint:"Parkinson ist eine Erkrankung des Gehirns, die Zittern, Steifheit und verlangsamte Bewegung verursacht."},
    {id:"epilepsie",t:"yn",label:"Haben Sie Epilepsie – also regelmäßige Krampfanfälle?",faktor:1.2,icd:"G40",
      hint:"Auch wenn die Anfälle medikamentös gut kontrolliert sind."},
    {id:"demenz",t:"yn",label:"Haben Sie Demenz oder Alzheimer?",faktor:1.6,icd:"F03, G30",
      hint:"Demenz ist eine fortschreitende Beeinträchtigung des Gedächtnisses und Denkens."},
    {id:"depression",t:"yn",label:"Haben Sie eine Depression – oder waren Sie deswegen in Behandlung?",faktor:1.3,icd:"F32, F33",
      hint:"Unabhängig davon, ob Sie aktuell Antidepressiva nehmen."},
    {id:"herzinsuffizienz",t:"yn",label:"Hat Ihr Arzt eine Herzschwäche bei Ihnen festgestellt?\nDer Fachbegriff ist Herzinsuffizienz.",faktor:1.5,icd:"I50",
      hint:"Das Herz pumpt nicht mehr ausreichend Blut durch den Körper. Typische Zeichen: Luftnot, geschwollene Beine."},
    {id:"nieren",t:"yn",label:"Haben Sie eine chronische Nierenerkrankung oder eine eingeschränkte Nierenfunktion?",faktor:1.6,icd:"N18.3, N18.4",
      hint:"Gemeint ist eine dauerhaft auf weniger als 60 % reduzierte Nierenleistung (Kreatinin erhöht, GFR 15–59 ml/min)."},
    {id:"copd",t:"yn",label:"Haben Sie eine chronische Lungenerkrankung wie COPD, chronische Bronchitis oder Lungenemphysem?",faktor:1.5,icd:"J44",
      hint:"COPD ist eine chronische Lungenerkrankung, meist durch langjähriges Rauchen verursacht."},
    {id:"lupus",t:"yn",label:"Haben Sie Lupus? Der Fachbegriff ist systemischer Lupus erythematodes (SLE).",faktor:1.5,icd:"M32",
      hint:"Lupus ist eine Autoimmunerkrankung, die viele Organe betreffen kann."},
    {id:"spondylitis",t:"yn",label:"Haben Sie Morbus Bechterew oder eine Entzündung der Wirbelsäule (Spondyloarthritis)?",faktor:1.6,icd:"M45, M46.8",
      hint:"Eine entzündliche Erkrankung der Wirbelsäule, die zu Versteifung führen kann."},
    {id:"zoeliakie",t:"yn",label:"Haben Sie Zöliakie – also eine Unverträglichkeit gegen Gluten (in Weizen, Roggen, Gerste)?",faktor:1.4,icd:"K90.0",
      hint:"Bei Zöliakie schädigt Gluten (in Weizen, Roggen, Gerste) den Dünndarm, was die Kalziumaufnahme stört."},
    {id:"crohn",t:"yn",label:"Haben Sie Morbus Crohn oder Colitis ulcerosa? Das sind chronische Entzündungen im Darm.",faktor:1.4,icd:"K50, K51",
      hint:"Beide Erkrankungen führen zu anhaltenden Darmentzündungen und können die Nährstoffaufnahme beeinträchtigen."},
    {id:"mgus",t:"yn",label:"Hat Ihr Arzt bei Ihnen ein abnormes Eiweiß im Blut festgestellt?\nDer Fachbegriff ist MGUS oder monoklonale Gammopathie.",faktor:2.0,icd:"D47.2",
      hint:"MGUS ist ein Laborbefund: Im Blut wird ein abnormes Eiweiß gefunden, das aus einer einzelnen Immunzelle stammt. Meist ohne Beschwerden, aber mit erhöhtem Knochenrisiko."},
    {id:"magenop",t:"yn",label:"Wurde Ihnen der Magen teilweise oder ganz entfernt, oder hatten Sie eine andere große Magenoperation?",faktor:1.5,icd:"Z90.3",
      hint:"Z. B. Billroth-II-Operation oder Gastrektomie (vollständige Magenentfernung)."},
    {id:"bariatrie",t:"yn",label:"Hatten Sie eine Magenverkleinerung oder einen Magenbypass, um Gewicht zu verlieren?\nBeispiele: Schlauchmagen (Sleeve), Magenband, Bypass",faktor:1.8,icd:"Z98.84",
      hint:"Eingriffe wie Schlauchmagen, Roux-en-Y-Bypass oder Magenband können die Kalziumaufnahme dauerhaft einschränken."},
    {id:"hiv",t:"yn",label:"Haben Sie eine HIV-Infektion?",faktor:1.5,icd:"B24, Z21",
      hint:"Sowohl das Virus selbst als auch bestimmte antiretrovirale Medikamente können den Knochen schwächen."},
    {id:"hyponatriamie",t:"yn",label:"Hat Ihr Arzt einen dauerhaft zu niedrigen Natriumwert in Ihrem Blut festgestellt?\nNatrium ist ein wichtiges Salz im Blut.",faktor:1.4,icd:"E87.1",
      hint:"Natrium ist ein Elektrolyt. Ein dauerhaft zu niedriger Wert (< 135 mmol/l) kann den Knochen direkt schwächen."},
    {id:"wachstumsmangel",t:"yn",label:"Hat Ihr Arzt einen Mangel an Wachstumshormon oder eine Unterfunktion der Hirnanhangsdrüse (Hypophyse) festgestellt?",faktor:1.5,icd:"E23.0",
      hint:"Die Hypophyse (Hirnanhangdrüse) steuert viele Hormone. Ein Mangel an Wachstumshormon tritt auch bei Erwachsenen auf."},
  ]},
  {id:"lebensstil",icon:"🚶",title:"Lebensstil & Sturzrisiko",sub:"Allgemeine Risikofaktoren und Sturzereignisse",qs:[
    {id:"rauchen",t:"yn",label:"Rauchen Sie zurzeit mehr als 10 Zigaretten am Tag?",faktor:1.5,icd:"F17.2, Z72.0"},
    {id:"alkohol",t:"yn",label:"Trinken Sie täglich Alkohol – mehr als 4 Bier oder mehr als 2 Gläser Wein?",faktor:1.9,icd:"F10.1, Z72.1"},
    {id:"immobilitaet",t:"yn",label:"Sind Sie auf einen Rollator, Gehstock oder Rollstuhl angewiesen?",faktor:1.7,icd:"Z74.0"},
    {id:"sturz",t:"radio",label:"Sind Sie in den letzten 12 Monaten gestürzt?",icd:"W19",
      opts:["Nein","Einmal gestürzt","Mehr als einmal gestürzt"],
      fmap:{"Einmal gestürzt":1.6,"Mehr als einmal gestürzt":2.0}},
    {id:"tug",t:"yn",label:"Timed-Up-and-Go-Test (TUG): Haben Sie mehr als 12 Sekunden gebraucht, um aufzustehen, 3 Meter zu gehen, umzudrehen und sich wieder hinzusetzen?",faktor:1.8,icd:"R26.2",
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

  /* ───────────────────────────── SEKUNDÄRE OSTEOPOROSE – SYMPTOMCHECK ──────────── */
  {id:"sek_endokrin",icon:"⚗️",title:"Symptomcheck: Hormonelle Erkrankungen",
   sub:"Hinweise auf endokrine Ursachen einer sekundären Osteoporose",
   symcheck:true,
   qs:[
    {id:"sym_hpth_nierenstein",t:"yn",label:"Hatten Sie schon mehrmals Nierensteine – oder Nierensteine vor dem 50. Geburtstag?",sym:"hpth",
      hint:"Rezidivierende Kalzium-Nierensteine sind ein klassischer Hinweis auf primären Hyperparathyreoidismus (pHPT)."},
    {id:"sym_hpth_hypercalc",t:"yn",label:"Hat Ihr Arzt zu hohe Kalziumwerte in Ihrem Blut festgestellt?",sym:"hpth",
      hint:"Hyperkalzämie ist das häufigste biochemische Zeichen des pHPT."},
    {id:"sym_hpth_osteitis",t:"yn",label:"Haben Sie Knochenschmerzen ohne erklärbaren Grund?\nOder fühlen Sie sich ungewöhnlich schwach und erschöpft?",sym:"hpth",
      hint:"Klassische Trias des pHPT: Bones, Stones, Groans (Knochen, Nieren, Abdomen)."},
    {id:"sym_cushing_gewicht",t:"yn",label:"Haben Sie einen dicken Bauch bei gleichzeitig dünnen Armen und Beinen?\nOder ein rundes Vollmondgesicht oder einen Fettbuckel im Nacken?",sym:"cushing",
      hint:"Charakteristisches Körperfettmuster beim Cushing-Syndrom durch Kortison-Überproduktion."},
    {id:"sym_cushing_striae",t:"yn",label:"Haben Sie breite, rötlich-violette Dehnungsstreifen – am Bauch, an den Oberschenkeln oder in den Achseln?\nGemeint sind nicht die normalen hellen Streifen nach Schwangerschaft.",sym:"cushing",
      hint:"Breite (> 1 cm), dunkelrote Striae distensae sind typisch für Cushing, im Gegensatz zu normalen hellen Schwangerschaftsstreifen."},
    {id:"sym_cushing_haut",t:"yn",label:"Ist Ihre Haut sehr dünn? Bekommen Sie leicht blaue Flecken oder haben Wunden, die schlecht heilen?",sym:"cushing"},
    {id:"sym_hypo_mann",t:"yn",label:"Haben Sie (als Mann) deutlich weniger Lust auf Sex als früher, Probleme mit der Erektion oder kaum noch Bartwuchs?",sym:"hypogonadismus",onlyFor:"m",
      hint:"Hinweise auf Hypogonadismus beim Mann; oft durch Hypophysenerkrankung oder Klinefelter-Syndrom verursacht."},
    {id:"sym_hypo_zykl",t:"yn",label:"Bleibt Ihre Regelblutung manchmal monatelang aus – ohne dass Sie in den Wechseljahren sind oder schwanger sind?",sym:"hypogonadismus_f",onlyFor:"f",
      hint:"Amenorrhoe durch Sport, Essstörung, Hyperprolaktinämie oder Hypophysenerkrankung führt zu Östrogenmangel und raschem Knochenverlust."},
    {id:"sym_hyper_schild",t:"yn",label:"Haben Sie Herzrasen, Zittern, Gewichtsverlust oder ein starkes Hitzegefühl? Vertragen Sie Wärme schlecht?",sym:"hyperthyreose",
      hint:"Klinische Zeichen einer Hyperthyreose oder überdosierten Schilddrüsenhormontherapie."},
    {id:"sym_akro_groesse",t:"yn",label:"Hat sich Ihre Schuh- oder Ringgröße im Erwachsenenalter vergrößert?\nOder haben andere bemerkt, dass Ihre Gesichtszüge gröber geworden sind?",sym:"akromegalie",
      hint:"Akromegalie durch Wachstumshormon-produzierenden Hypophysentumor kann trotz erhöhter Knochenmasse die Knochenqualität verschlechtern."},
    {id:"sym_prolakt",t:"yn",label:"Tritt aus Ihrer Brust Milch aus – obwohl Sie nicht schwanger sind und nicht stillen?",sym:"prolaktinom",onlyFor:"f",
      hint:"Galaktorrhoe kombiniert mit Amenorrhoe ist typisch für ein Prolaktinom (Hypophysenadenom)."},
  ]},

  {id:"sek_gastro",icon:"🫁",title:"Symptomcheck: Magen-Darm & Absorption",
   sub:"Hinweise auf Malabsorptionssyndrome und Erkrankungen des Gastrointestinaltrakts",
   symcheck:true,
   qs:[
    {id:"sym_zoeliakie_bauch",t:"yn",label:"Haben Sie nach dem Essen von Brot, Nudeln oder anderen Getreideprodukten häufig Blähungen, Durchfall oder Bauchschmerzen?",sym:"zoeliakie",
      hint:"Zöliakie kann jahrelang mit unspezifischen Bauchbeschwerden verlaufen. Glutenhaltige Getreidearten lösen die Autoimmunreaktion aus."},
    {id:"sym_zoeliakie_mangel",t:"yn",label:"Hat Ihr Arzt bei Ihnen Blutarmut, Eisenmangel oder Folsäuremangel festgestellt – ohne dafür eine klare Ursache zu finden?",sym:"zoeliakie",
      hint:"Malabsorption bei Zöliakie führt häufig zu Mikronährstoffmangeln, besonders Eisen, Folsäure und fettlöslichen Vitaminen."},
    {id:"sym_ced_bauch",t:"yn",label:"Haben Sie immer wieder Bauchschmerzen und Durchfall – manchmal auch mit Blut oder Schleim im Stuhl?",sym:"ced",
      hint:"Chronisch-entzündliche Darmerkrankungen (Morbus Crohn, Colitis ulcerosa) beeinträchtigen die Kalziumabsorption und fördern den Knochenverlust."},
    {id:"sym_vitd_mangel",t:"yn",label:"Sind Ihre Oberschenkel und Oberarme auffällig schwach? Haben Sie Schmerzen an verschiedenen Knochen, die schwer zu beschreiben sind?",sym:"vit_d",
      hint:"Vitamin-D-Mangel und Osteomalazie zeigen sich oft durch proximale Muskelschwäche und diffusen Knochenschmerz (besonders Brustbein, Tibia)."},
    {id:"sym_malabs_allg",t:"yn",label:"Sind Ihre Stuhlgänge manchmal glänzend, schwimmend oder schwer abzuspülen? Nehmen Sie ab, obwohl Sie normal essen?",sym:"malabsorption",
      hint:"Steatorrhoe ist ein direktes Zeichen der Fettmalabsorption und geht immer mit schlechter Absorption fettlöslicher Vitamine (A, D, E, K) einher."},
    {id:"sym_leber",t:"yn",label:"Haben Sie eine bekannte Lebererkrankung?\nBeispiele: Leberzirrhose, Fettleber, primäre biliäre Cholangitis, Hämochromatose",sym:"lebererkrankung",
      hint:"Chronische Lebererkrankungen vermindern die Vitamin-D-Aktivierung und erhöhen das Osteoporose-Risiko deutlich."},
  ]},

  {id:"sek_niere",icon:"🫘",title:"Symptomcheck: Nieren & Elektrolyte",
   sub:"Hinweise auf renale Ursachen und Elektrolytstörungen",
   symcheck:true,
   qs:[
    {id:"sym_niere_gfr",t:"yn",label:"Hat Ihr Arzt gesagt, dass Ihre Nierenfunktion dauerhaft eingeschränkt ist – Nierenwert GFR unter 45?",sym:"nieren",
      hint:"Ab CKD Stadium 3b ist der Vitamin-D-Aktivierungsweg gestört; renale Osteodystrophie kann die Folge sein."},
    {id:"sym_niere_phosphat",t:"yn",label:"Hat Ihr Arzt festgestellt, dass Ihr Phosphatwert im Blut dauerhaft zu hoch ist?",sym:"nieren",
      hint:"Hyperphosphatämie bei CKD fördert den sekundären Hyperparathyreoidismus und damit den Knochenabbau."},
    {id:"sym_hypokali",t:"yn",label:"Haben Sie öfter niedrige Kaliumwerte im Blut? Oder bekommen Sie häufig Muskelkrämpfe oder fühlen sich Ihre Muskeln schwach an?",sym:"rta_bartter",
      hint:"Chronische Hypokaliämie kann auf renale tubuläre Azidose (RTA) oder Bartter/Gitelman-Syndrom hinweisen – beides mit Knochendemineralisation verbunden."},
    {id:"sym_hypercalciurie",t:"yn",label:"Ist Ihr Urin manchmal stark schäumend? Oder hat Ihr Arzt festgestellt, dass Sie zu viel Kalzium mit dem Urin ausscheiden?",sym:"hypercalciurie",
      hint:"Idiopathische Hyperkalziurie ist eine häufig übersehene Ursache der Osteoporose, besonders bei Männern."},
  ]},

  {id:"sek_haema",icon:"🩸",title:"Symptomcheck: Blut & Blutbildung",
   sub:"Hinweise auf hämatologische Ursachen einer sekundären Osteoporose",
   symcheck:true,
   qs:[
    {id:"sym_myelom_ruecken",t:"yn",label:"Haben Sie anhaltende Rückenschmerzen – besonders nachts oder in Ruhe? Und fühlen Sie sich dabei auffällig abgeschlagen und müde?",sym:"myelom",
      hint:"Multiples Myelom verursacht typischerweise belastungsunabhängige Knochenschmerzen und pathologische Frakturen."},
    {id:"sym_myelom_blut",t:"yn",label:"Hat Ihr Arzt bei Ihnen eine stark erhöhte Blutsenkungsgeschwindigkeit (BSG) oder ein ungewöhnliches Eiweiß im Blut festgestellt?",sym:"myelom",
      hint:"Paraproteinämie, stark erhöhte BSG und Anämie sind hämatologische Hinweise auf Myelom oder MGUS."},
    {id:"sym_masto",t:"yn",label:"Haben Sie chronische Nesselsucht oder starken Juckreiz – besonders beim Waschen oder Reiben der Haut? Hatten Sie jemals einen allergischen Schock?",sym:"mastozytose",
      hint:"Systemische Mastozytose ist eine seltene aber wichtige Ursache junger Osteoporose; Hautveränderungen (Urticaria pigmentosa) sind oft das erste Zeichen."},
    {id:"sym_masto_haut",t:"yn",label:"Haben Sie bräunlich-rötliche Flecken auf der Haut, die sich beim Reiben zu Quaddeln aufwölben?",sym:"mastozytose",
      hint:"Urticaria pigmentosa mit positivem Darier-Zeichen ist pathognomonisch für kutane Mastozytose und kann auf systemische Form hinweisen."},
    {id:"sym_haemo",t:"yn",label:"Hat Ihr Arzt eine Eisenspeicherkrankheit (Hämochromatose) bei Ihnen festgestellt? Oder ist Ihr Ferritin-Wert dauerhaft sehr hoch?",sym:"haemochromatose",
      hint:"Hämochromatose schädigt Leber, Pankreas und Hypophyse – alle drei Organe beeinflussen den Knochenstoffwechsel."},
  ]},

  {id:"sek_immun",icon:"🛡️",title:"Symptomcheck: Immunsystem & Entzündung",
   sub:"Hinweise auf Autoimmunerkrankungen mit Knocheneinfluss",
   symcheck:true,
   qs:[
    {id:"sym_sarkoid",t:"yn",label:"Haben Sie eine Sarkoidose? Oder wurden bei Ihnen unerklärte vergrößerte Lymphknoten gefunden?",sym:"sarkoidose",
      hint:"Sarkoidose-Granulome produzieren unkontrolliert aktives Vitamin D3, was zu Hyperkalzämie und Osteoporose führt."},
    {id:"sym_psa",t:"yn",label:"Haben Sie Schuppenflechte (Psoriasis) – an der Haut oder den Nägeln – und dazu auch entzündete Gelenke?",sym:"psa",
      hint:"Psoriasis-Arthritis ist mit erhöhtem Osteoporoserisiko verbunden, besonders bei systemischer Entzündungsaktivität."},
    {id:"sym_vaskulitis",t:"yn",label:"Haben Sie eine Gefäßentzündung (Vaskulitis) oder eine andere schwere Entzündungserkrankung, die wir bisher nicht erwähnt haben?",sym:"vaskulitis",
      hint:"Systemische Vaskulitiden (Riesenzell, ANCA) erfordern oft hochdosierte Kortisongaben – hohes Osteoporoserisiko."},
    {id:"sym_aids",t:"yn",label:"Haben Sie eine HIV-Infektion oder nehmen Sie Medikamente gegen HIV?",sym:"hiv_ost",
      hint:"HIV selbst und besonders tenofovir-haltige antiretrovirale Therapien erhöhen das Osteoporoserisiko erheblich."},
  ]},

  {id:"sek_neuro",icon:"🧠",title:"Symptomcheck: Neurologie & Mobilität",
   sub:"Hinweise auf neurologische Ursachen verminderter Knochendichte",
   symcheck:true,
   qs:[
    {id:"sym_immo_neuro",t:"yn",label:"Sind Sie dauerhaft gelähmt, haben Sie sehr starke Spastiken oder sind Sie seit mehr als 3 Monaten bettlägerig?",sym:"immo_neuro",
      hint:"Vollständige Immobilisation (z. B. nach Querschnitt) führt innerhalb von Wochen zu raschem Knochenverlust."},
    {id:"sym_essst",t:"yn",label:"Essen Sie sehr wenig und sind dabei sehr leicht? Oder haben Sie eine Essstörung wie Magersucht?",sym:"essstoerung",
      hint:"Anorexia nervosa führt durch Östrogenmangel und Mangelernährung zu schwerem, oft irreversiblem Knochenverlust."},
    {id:"sym_alkohol_2",t:"yn",label:"Trinken Sie täglich mehr als 3 Gläser Alkohol? Oder haben Sie eine Lebererkrankung durch Alkohol?",sym:"alkohol_ost",
      hint:"Alkohol hemmt Osteoblasten direkt, stört Vitamin D und ist mit Sturzrisiko assoziiert."},
  ]},

  {id:"sek_genetisch",icon:"🧬",title:"Symptomcheck: Genetische & seltene Knochenerkrankungen",
   sub:"Hinweise auf hereditäre oder angeborene Knochenerkrankungen – wichtig bei atypischen oder therapieresistenten Verläufen",
   symcheck:true,
   qs:[
    /* ── Osteogenesis imperfecta ── */
    {id:"sym_oi_fraktur",t:"yn",label:"Hatten Sie schon als Kind oder Jugendliche(r) Knochenbrüche – auch nach leichten Stürzen oder sogar ohne erkennbaren Anlass?",sym:"oi",
      hint:"Osteogenesis imperfecta (OI, 'Glasknochenkrankheit') führt durch Kollagen-Typ-I-Defekte zu multiplen Frakturen, oft schon bei Kleinkindern. Milde Formen (Typ I) bleiben bis ins Erwachsenenalter undiagnostiziert."},
    {id:"sym_oi_skleren",t:"yn",label:"Ist das Weiße Ihrer Augen eher bläulich oder grau gefärbt – statt rein weiß?",sym:"oi",
      hint:"Blaue Skleren sind ein charakteristisches, aber nicht immer vorhandenes Zeichen der OI – sichtbar durch das durchscheinende Choroid bei dünner Sklera."},
    {id:"sym_oi_zaehne",t:"yn",label:"Sind Ihre Zähne auffällig brüchig, gelblich-braun verfärbt oder durchscheinend – ohne dass Karies die Ursache ist?",sym:"oi",
      hint:"Dentinogenesis imperfecta tritt bei OI Typ III und IV auf – bernsteinfarbene, brüchige Zähne ohne erklärbaren Kariesbefall."},
    {id:"sym_oi_hoer",t:"yn",label:"Haben Sie vor dem 50. Geburtstag begonnen, schlecht zu hören – ohne äußere Ursache?",sym:"oi",
      hint:"Progressive Schwerhörigkeit durch Otosklerose oder Mittelohrveränderungen findet sich bei ca. 50% der OI-Typ-I-Patienten."},
    {id:"sym_oi_familie",t:"yn",label:"Hatten oder haben Ihre Eltern oder Geschwister auffällig viele Knochenbrüche oder eine sehr kleine Körpergröße?",sym:"oi",
      hint:"OI wird meist autosomal-dominant vererbt. Eine positive Familienanamnese erhöht die Wahrscheinlichkeit erheblich."},

    /* ── XLH / Hypophosphatämie ── */
    {id:"sym_xlh_rachitis",t:"yn",label:"Haben Sie O-Beine oder X-Beine seit der Kindheit? Oder wurde bei Ihnen als Kind Rachitis (Knochenerweichung) festgestellt?",sym:"xlh",
      hint:"XLH (X-linked Hypophosphatemia) ist die häufigste hereditäre Rachitis-Form. O-Beine, Kleinwuchs und Zahnabszesse im Kindesalter sind typische Erstzeichen."},
    {id:"sym_xlh_phosphat",t:"yn",label:"Hat Ihr Arzt dauerhaft zu niedrige Phosphatwerte in Ihrem Blut festgestellt?",sym:"xlh",
      hint:"Renal-phosphatwastende Erkrankungen (XLH, ADHR, TIO) sind durch FGF-23-Überproduktion charakterisiert. Serumphosphat oft < 0,8 mmol/l."},
    {id:"sym_xlh_entesio",t:"yn",label:"Haben Sie als Erwachsene(r) Knochenschmerzen, Schmerzen an Sehnenansätzen oder wurden bei Ihnen Stressfrakturen gefunden?",sym:"xlh",
      hint:"Im Erwachsenenalter manifestiert sich XLH durch Enthesiopathien, Pseudofrakturen (Looser-Umbauzonen) und therapierefraktäre Osteomalazie."},
    {id:"sym_xlh_zahnabsz",t:"yn",label:"Hatten Sie als Kind Zahnabszesse – obwohl keine Karies vorhanden war?",sym:"xlh",
      hint:"Dentale Abszesse ohne Karies durch defektes Dentin sind ein pathognomonisches Zeichen der XLH – auch wenn das Milchgebiss betroffen war."},

    /* ── Hypophosphatasie ── */
    {id:"sym_hpp_ap",t:"yn",label:"Hat Ihr Arzt festgestellt, dass Ihr AP-Wert (alkalische Phosphatase) im Blut dauerhaft sehr niedrig ist?",sym:"hpp",
      hint:"Hypophosphatasia (HPP) ist definiert durch persistierend erniedrigte AP-Aktivität. Die AP kann dabei 'normal' wirken, ist aber für das Alter zu niedrig."},
    {id:"sym_hpp_zahn",t:"yn",label:"Haben Sie als Kind Milchzähne vor dem 5. Geburtstag verloren – mit Wurzel, nicht nur ausgefallen? Oder haben Sie als Erwachsene(r) Zähne verloren, ohne dass Karies oder Zahnfleischerkrankung die Ursache war?",sym:"hpp",
      hint:"Vorzeitiger Milchzahnverlust (< 5 Jahre, mit Wurzel!) ist das früheste klinische Zeichen einer milden adulten HPP – oft jahrzehntelang unerkannt."},
    {id:"sym_hpp_stress",t:"yn",label:"Hatten Sie Stressfrakturen an den Mittelfußknochen, am Schenkelhals oder ungewöhnliche Oberschenkelbrüche?",sym:"hpp",
      hint:"Rezidivierende Metatarsalstressfrakturen bei Erwachsenen sind verdächtig für adulte HPP. Atypische Femurfrakturen können auf HPP statt Bisphosphonat-Therapie zurückzuführen sein – wichtig für die Therapieentscheidung!"},
    {id:"sym_hpp_musku",t:"yn",label:"Haben Sie seit der Kindheit anhaltende Muskelschwäche, Schwierigkeiten beim Gehen oder Schmerzen an Knochen und Muskeln?",sym:"hpp",
      hint:"Adulte HPP zeigt sich oft durch unspezifische Myopathie und Knochen-/Gelenkschmerzen. Pyridoxin-abhängige Krampfanfälle kommen bei schweren Formen vor."},

    /* ── Oncogenic osteomalacia / TIO ── */
    {id:"sym_tio_tumor",t:"yn",label:"Wurde bei Ihnen eine Knochenerweichung (Osteomalazie) festgestellt, die trotz Behandlung nicht besser wird? Gibt es Hinweise auf einen unbekannten Tumor?",sym:"tio",
      hint:"Tumorinduzierte Osteomalazie (TIO): Ein FGF-23-produzierender Tumor (oft sehr klein, gut versteckt) verursacht schwere Phosphaturie und Osteomalazie. Kann jeden Körperbereich betreffen."},
    {id:"sym_tio_phosphat",t:"yn",label:"Sind Ihre Phosphatwerte trotz Behandlung dauerhaft sehr niedrig? Haben Sie dazu unerklärliche Muskelschwäche und Knochenschmerzen?",sym:"tio",
      hint:"TIO gilt als ausgeschlossen erst wenn eine DOTATATE-PET/CT negativ ist – konventionelle Bildgebung reicht nicht."},

    /* ── Paget ── */
    {id:"sym_paget_ap",t:"yn",label:"Hat Ihr Arzt einen erhöhten AP-Wert (alkalische Phosphatase) festgestellt – obwohl Ihre Leberwerte normal sind?",sym:"paget",
      hint:"Morbus Paget des Knochens kann jahrelang asymptomatisch durch zufällig erhöhte AP auffallen. Häufig Schädel, Becken, Wirbelsäule, Femur betroffen."},
    {id:"sym_paget_schmerz",t:"yn",label:"Haben Sie tiefen Knochenschmerz im Kopf, Becken, Rücken oder Oberschenkel – besonders nachts oder in Ruhe?",sym:"paget",
      hint:"Paget-Schmerz ist oft tief, bohrend und lageunabhängig – im Gegensatz zum mechanischen Osteoarthrose-Schmerz."},
    {id:"sym_paget_deform",t:"yn",label:"Ist ein Knochen sichtbar verformt – zum Beispiel Schädel oder Schienbein? Hat sich Ihr Kopfumfang vergrößert oder ist Ihr Gehör mit dem Alter schlechter geworden?",sym:"paget",
      hint:"Schädelvergrößerung, Säbelscheiden-Tibia und Hörminderung durch Einengung des N. VIII sind typische Paget-Spätsymptome."},

    /* ── Marfan / Ehlers-Danlos ── */
    {id:"sym_marfan",t:"yn",label:"Sind Ihre Arme und Beine auffällig lang? Sind Sie sehr groß? Wurde bei Ihnen eine Erweiterung der Hauptschlagader, eine verschobene Augenlinse oder ein spontaner Lungenkollaps festgestellt?",sym:"marfan",
      hint:"Marfan-Syndrom (FBN1-Mutation) geht mit erniedrigter Knochendichte und Wirbelkörperfrakturen einher – häufig unterschätzt."},
    {id:"sym_eds",t:"yn",label:"Sind Ihre Gelenke überbeweglicher als bei anderen? Ist Ihre Haut ungewöhnlich dehnbar oder reißt leicht? Haben Sie häufig Gelenke ausgerenkt?",sym:"eds",
      hint:"Hypermobiles Ehlers-Danlos-Syndrom (hEDS) und klassisches EDS sind mit niedrigerer Knochendichte und Frakturneigung assoziiert."},

    /* ── Weitere seltene ── */
    {id:"sym_gaucher",t:"yn",label:"Haben Sie eine Gaucher-Erkrankung? Oder hat Ihr Arzt eine vergrößerte Milz festgestellt – zusammen mit Knochen-/Gelenkschmerzen und erhöhter Blutungsneigung?",sym:"gaucher",
      hint:"Morbus Gaucher Typ I: Glukozerebrosidasemangel führt zu Knocheninfarkt, Osteoporose und Frakturen. Oft lange Zeit nur als 'Rückenschmerzen' behandelt."},
    {id:"sym_glycogen",t:"yn",label:"Haben Sie eine bekannte seltene Stoffwechselerkrankung – zum Beispiel Pompe-Krankheit, Glykogenspeicherkrankheit oder eine mitochondriale Erkrankung?",sym:"seltene_metabolisch",
      hint:"Diverse Stoffwechselerkrankungen (Glykogenosen, mitochondriale Myopathien, Mukopolysaccharidosen) können Sekundärosteoporose verursachen."},
    {id:"sym_turner",t:"yn",label:"Wurde bei Ihnen ein Turner-Syndrom oder eine ähnliche Chromosomenbesonderheit festgestellt?",sym:"turner",onlyFor:"f",
      hint:"Turner-Syndrom führt durch primären Hypogonadismus zu schwerer Osteoporose – oft erst im Erwachsenenalter erkannt."},
    {id:"sym_klinefelter_ost",t:"yn",label:"Wurde bei Ihnen ein Klinefelter-Syndrom oder eine ähnliche Chromosomenbesonderheit festgestellt?",sym:"klinefelter",onlyFor:"m",
      hint:"Klinefelter-Syndrom führt durch Hypogonadismus zu erhöhtem Osteoporoserisiko – DXA empfohlen ab Diagnosestellung."},
  ]},
];

/* ═══════════════════════════════════════════════ RISK CALC ═══ */
const STURZ_GRP=new Set(["schlaganfall","ms","parkinson","epilepsie","demenz","depression","immobilitaet","sturz","tug","antidepressiva","opioide","antipsychotika","sedativa","orthostase"]);
const GC_RA_GRP=new Set(["glukokortikoide","rheuma"]);
const WKFx_GRP=new Set(["wirbelbruch_akut","wirbelbruch_anz","genant"]);
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
  hueft_akut:       {diagnose:"Hüftfraktur (niedrigtraumatisch, akut, < 12 Monate)",             icd5:"S72.00G",  icd5_f_meno:"M80.05G, T93.1G", icd5_m:"M80.55G, T93.1G"},
  hueft_alt:        {diagnose:"Zustand nach Hüftfraktur (niedrigtraumatisch, > 12 Monate)",       icd5:"M80.05G, T93.1G", icd5_f_meno:"M80.05G, T93.1G", icd5_m:"M80.55G, T93.1G"},
  wirbelbruch_akut: {diagnose:"Wirbelkörperfraktur (niedrigtraumatisch, akut, < 12 Monate)",      icd5:"M80.08G",          icd5_f_meno:"M80.08G",         icd5_m:"M80.58G"},
  wirbelbruch_anz:  {diagnose:"Wirbelkörperfrakturen (niedrigtraumatisch, > 12 Monate)",           icd5:"M80.08G",          icd5_f_meno:"M80.08G",         icd5_m:"M80.58G"},
  humerus:          {diagnose:"Humerusfraktur (niedrigtraumatisch)",                               icd5:"M80.02G",          icd5_f_meno:"M80.02G",         icd5_m:"M80.52G"},
  becken:           {diagnose:"Beckenfraktur (niedrigtraumatisch)",                                icd5:"M80.0XG",          icd5_f_meno:"M80.0XG",         icd5_m:"M80.5XG"},
  genant:           {diagnose:"Wirbelkörperfraktur (nach Genant-Schweregrad klassifiziert)",    icd5:"M80.08G", icd5_f_meno:"M80.08G", icd5_m:"M80.58G"},
  unterarm:         {diagnose:"Distale Radiusfraktur (niedrigtraumatisch)",                        icd5:"M80.03G",          icd5_f_meno:"M80.03G",         icd5_m:"M80.53G"},
  eltern:           {diagnose:"Familienanamnese: proximale Femurfraktur (Elternteil)",             icd5:"Z82.61G"},
  bmi:              {diagnose:"Untergewicht / Malnutrition",                                       icd5:"E44.90G"},
  tbs:              {diagnose:"Pathologische Trabekelknochen-Texturanalyse (TBS)",                 icd5:"M85.80G"},
  glukokortikoide:  {diagnose:"Glukokortikoid-induzierte Osteoporose",                            icd5:"M81.40G"},
  ppi:              {diagnose:"Langzeittherapie mit Protonenpumpenhemmern (> 3 Monate)",          icd5:"Z79.89G"},
  antidepressiva:   {diagnose:"Antidepressiva-Dauermedikation (SSRI/SNRI/TZA)",                   icd5:"Z79.89G"},
  opioide:          {diagnose:"Opioidanalgetika-Dauermedikation",                                  icd5:"Z79.89G"},
  antipsychotika:   {diagnose:"Antipsychotika-/Neuroleptika-Dauermedikation",                     icd5:"Z79.89G"},
  sedativa:         {diagnose:"Benzodiazepin-/Z-Substanzen-Dauermedikation",                      icd5:"Z79.89G"},
  schilddruese:     {diagnose:"Supprimierter TSH unter L-Thyroxin-Therapie",                      icd5:"E05.90G"},
  glitazone:        {diagnose:"Pioglitazon-Dauertherapie (Diabetes mellitus Typ 2)",               icd5:"Z79.89G"},
  antikonvulsiva:   {diagnose:"Antikonvulsiva-Dauermedikation (inkl. Pregabalin/Gabapentin)",      icd5:"Z79.89G"},
  orthostase:       {diagnose:"Orthostatische Hypotension / Sturzrisiko durch Medikation",         icd5:"I95.10G"},
  aromatasehemmer:  {diagnose:"Aromatasehemmer-Therapie (Mammakarzinom)",                          icd5:"Z79.81G"},
  fruehe_meno:      {diagnose:"Prämature Menopause / bilaterale Ovarektomie",                     icd5:"N95.00G"},
  menopause_aktuell:{diagnose:"Postmenopausale Osteoporose",                                             icd5:"M81.00G"},
  gnrh_f:           {diagnose:"GnRH-Agonisten-Therapie (Endometriose / Mammakarzinom)",           icd5:"Z79.81G"},
  hormonablation:   {diagnose:"Androgendeprivationstherapie (Prostatakarzinom)",                   icd5:"Z79.81G"},
  antiandrogene:    {diagnose:"Antiandrogen-Therapie (Prostatakarzinom)",                          icd5:"Z79.81G"},
  hypogonadismus:   {diagnose:"Männlicher Hypogonadismus",                                        icd5:"E29.10G"},
  rheuma:           {diagnose:"Rheumatoide Arthritis",                                             icd5:"M05.90G"},
  diabetes1:        {diagnose:"Diabetes mellitus Typ 1",                                           icd5:"E10.90G"},
  diabetes2:        {diagnose:"Diabetes mellitus Typ 2",                                           icd5:"E11.90G"},
  hpth:             {diagnose:"Primärer Hyperparathyreoidismus",                                   icd5:"E21.00G"},
  cushing:          {diagnose:"Cushing-Syndrom",                                                   icd5:"E24.90G"},
  schlaganfall:     {diagnose:"Zustand nach Schlaganfall / zerebraler Ischämie",                  icd5:"I63.90G"},
  ms:               {diagnose:"Multiple Sklerose",                                                 icd5:"G35.90G"},
  parkinson:        {diagnose:"Morbus Parkinson",                                                  icd5:"G20.90G"},
  epilepsie:        {diagnose:"Epilepsie",                                                          icd5:"G40.90G"},
  demenz:           {diagnose:"Demenz (inkl. Morbus Alzheimer)",                                  icd5:"F03.90G"},
  depression:       {diagnose:"Depressive Störung",                                               icd5:"F32.90G"},
  herzinsuffizienz: {diagnose:"Herzinsuffizienz",                                                  icd5:"I50.90G"},
  nieren:           {diagnose:"Chronische Nierenerkrankung (CKD Stadium 3b–4)",                   icd5:"N18.30G"},
  copd:             {diagnose:"COPD (chron. obstruktive Lungenerkrankung)",                        icd5:"J44.10G"},
  lupus:            {diagnose:"Systemischer Lupus erythematodes (SLE)",                            icd5:"M32.90G"},
  spondylitis:      {diagnose:"Axiale Spondyloarthritis / Morbus Bechterew",                      icd5:"M45.90G"},
  zoeliakie:        {diagnose:"Zöliakie (glutensensitive Enteropathie)",                           icd5:"K90.00G"},
  crohn:            {diagnose:"Morbus Crohn / Colitis ulcerosa (CED)",                            icd5:"K50.90G"},
  mgus:             {diagnose:"MGUS (monoklonale Gammopathie unklarer Signifikanz)",               icd5:"D47.20G"},
  magenop:          {diagnose:"Zustand nach Magenresektion / Gastrektomie",                        icd5:"Z90.39G"},
  bariatrie:        {diagnose:"Zustand nach bariatrischer Operation (Sleeve/Bypass)",              icd5:"Z98.84G"},
  hiv:              {diagnose:"HIV-Infektion",                                                     icd5:"B24.00G"},
  hyponatriamie:    {diagnose:"Chronische Hyponatriämie",                                         icd5:"E87.10G"},
  wachstumsmangel:  {diagnose:"Hypophyseninsuffizienz / Wachstumshormonmangel",                   icd5:"E23.00G"},
  rauchen:          {diagnose:"Nikotinkonsum (aktiv, > 10 Zigaretten/Tag)",                       icd5:"F17.20G"},
  alkohol:          {diagnose:"Chronischer Alkoholmissbrauch (> 50 g/Tag)",                        icd5:"F10.10G"},
};
// Stabiler Schlüssel – nie versionieren, damit Nutzeränderungen alle Updates überleben
const DIAG_DB_OVERRIDES_KEY = "osteo_diagdb_overrides_v1";

/* ─── Sekundäre Osteoporose: Diagnose-DB (sym-key → diagnose + icd5) ─── */
const SEK_DIAG_DB_DEFAULTS = {
  // Endokrin
  hpth:              {diagnose:"Primärer Hyperparathyreoidismus",                          icd5:"E21.0G"},
  cushing:           {diagnose:"Cushing-Syndrom (endogener Hyperkortisolismus)",           icd5:"E24.9G"},
  hypogonadismus:    {diagnose:"Hypogonadismus (Mann)",                                    icd5:"E29.1G"},
  hypogonadismus_f:  {diagnose:"Hypogonadismus / Amenorrhoe (Frau, prämenopausal)",       icd5:"N91.2G"},
  hyperthyreose:     {diagnose:"Hyperthyreose / Überdosierung Schilddrüsenhormon",         icd5:"E05.9G"},
  akromegalie:       {diagnose:"Akromegalie (Wachstumshormon-Exzess)",                     icd5:"E22.0G"},
  prolaktinom:       {diagnose:"Prolaktinom / Hyperprolaktinämie",                         icd5:"E22.1G"},
  // Gastro
  zoeliakie:         {diagnose:"Zöliakie (glutensensitive Enteropathie)",                  icd5:"K90.0G"},
  ced:               {diagnose:"Chronisch-entzündliche Darmerkrankung (Morbus Crohn/CU)", icd5:"K50.9G"},
  vit_d:             {diagnose:"Vitamin-D-Mangel / Osteomalazie",                          icd5:"E55.9G"},
  malabsorption:     {diagnose:"Malabsorptionssyndrom",                                    icd5:"K90.9G"},
  lebererkrankung:   {diagnose:"Hepatische Osteodystrophie / Lebererkrankung",            icd5:"K74.6G"},
  // Nieren
  nieren:            {diagnose:"Renale Osteodystrophie / CKD-MBD",                        icd5:"N25.8G"},
  rta_bartter:       {diagnose:"Renale tubuläre Azidose / Bartter-/Gitelman-Syndrom",     icd5:"N25.8G"},
  hypercalciurie:    {diagnose:"Idiopathische Hyperkalziurie",                             icd5:"E83.52G"},
  // Hämatologie
  myelom:            {diagnose:"Multiples Myelom / Plasmozytom",                           icd5:"C90.0G"},
  mastozytose:       {diagnose:"Systemische Mastozytose",                                  icd5:"D47.02G"},
  haemochromatose:   {diagnose:"Hereditäre Hämochromatose",                               icd5:"E83.11G"},
  // Immun
  sarkoidose:        {diagnose:"Sarkoidose mit Knochenbeteiligung",                        icd5:"D86.9G"},
  psa:               {diagnose:"Psoriasis-Arthritis",                                      icd5:"M07.3G"},
  vaskulitis:        {diagnose:"Systemische Vaskulitis",                                   icd5:"M31.9G"},
  hiv_ost:           {diagnose:"HIV-assoziierte Osteoporose",                              icd5:"B24.0G"},
  // Neurologie / Lebensstil
  immo_neuro:        {diagnose:"Immobilisationsosteoporose (neurogen / vollständig)",      icd5:"M81.8G"},
  essstoerung:       {diagnose:"Osteoporose bei Essstörung / Anorexia nervosa",            icd5:"F50.0G"},
  alkohol_ost:       {diagnose:"Alkohol-assoziierte Osteoporose",                          icd5:"F10.2G"},
  // Genetisch / selten
  oi:                {diagnose:"Osteogenesis imperfecta",                                  icd5:"Q78.0G"},
  xlh:               {diagnose:"X-linked Hypophosphatemia (XLH)",                          icd5:"E83.30G"},
  hpp:               {diagnose:"Hypophosphatasia (HPP)",                                   icd5:"E83.39G"},
  tio:               {diagnose:"Tumorinduzierte Osteomalazie (TIO)",                       icd5:"M83.8G"},
  paget:             {diagnose:"Morbus Paget des Knochens",                                icd5:"M88.9G"},
  marfan:            {diagnose:"Marfan-Syndrom",                                           icd5:"Q87.4G"},
  eds:               {diagnose:"Ehlers-Danlos-Syndrom",                                    icd5:"Q79.6G"},
  gaucher:           {diagnose:"Morbus Gaucher",                                           icd5:"E75.22G"},
  turner:            {diagnose:"Turner-Syndrom (45,X)",                                    icd5:"Q96.0G"},
  klinefelter:       {diagnose:"Klinefelter-Syndrom (47,XXY)",                             icd5:"Q98.0G"},
  seltene_metabolisch:{diagnose:"Seltene Stoffwechselerkrankung mit Knochenbeteiligung",   icd5:"E74.0G"},
};
const SEK_DIAG_DB_KEY = "osteo_sekdb_overrides_v1";
const SEK_PROFILE_KEY  = "osteo_sekprofile_overrides_v1";
const SEK_UNTERS_KEY   = "osteo_sekunters_overrides_v1";
const SEK_QS_KEY       = "osteo_sekqs_overrides_v1";

// Build default question map from SECTIONS at runtime
function buildSekQsDefaults(){
  const m={};
  for(const sec of SECTIONS){
    if(!sec.symcheck) continue;
    for(const q of (sec.qs||[])){
      m[q.id]={label:q.label, hint:q.hint||""};
    }
  }
  return m;
}
// Build default profile map from SEK_PROFILE at runtime
function buildSekProfileDefaults(){
  const m={};
  for(const [sym,p] of Object.entries(SEK_PROFILE)){
    m[sym]={label:p.label, hinweis:p.hinweis};
  }
  return m;
}
// Build default unters map from SEK_PROFILE at runtime
function buildSekUntersDefaults(){
  const m={};
  for(const [sym,p] of Object.entries(SEK_PROFILE)){
    m[sym]=(p.untersuchungen||[]).map(u=>({...u}));
  }
  return m;
}

function loadSekDb(key, buildDefaults){
  try{
    const raw=localStorage.getItem(key);
    const overrides=raw?JSON.parse(raw):{};
    return mergeDeepSek(buildDefaults(), overrides);
  }catch(e){ return buildDefaults(); }
}
function mergeDeepSek(defaults, overrides){
  const result={...defaults};
  for(const [k,v] of Object.entries(overrides)){
    result[k]=v; // override entire entry
  }
  return result;
}
function saveSekDb(key, current, buildDefaults){
  const defaults=buildDefaults();
  const overrides={};
  for(const [k,v] of Object.entries(current)){
    if(JSON.stringify(v)!==JSON.stringify(defaults[k])) overrides[k]=v;
  }
  localStorage.setItem(key, JSON.stringify(overrides));
}

function loadSekDiagDb(){
  try{
    const raw = localStorage.getItem(SEK_DIAG_DB_KEY);
    const overrides = raw ? JSON.parse(raw) : {};
    return {...SEK_DIAG_DB_DEFAULTS, ...overrides};
  } catch(e){ return {...SEK_DIAG_DB_DEFAULTS}; }
}
function saveSekDiagDb(db){
  const overrides={};
  for(const id of Object.keys(db)){
    const def = SEK_DIAG_DB_DEFAULTS[id];
    const cur = db[id];
    if(!def || cur.diagnose!==def.diagnose || cur.icd5!==def.icd5){
      overrides[id]=cur;
    }
  }
  localStorage.setItem(SEK_DIAG_DB_KEY, JSON.stringify(overrides));
}

function loadDiagDb(){
  return{...DIAG_DB_DEFAULTS};
}

// Nur abweichende Einträge speichern (Delta).
// Neue Standard-Einträge in künftigen Versionen erscheinen automatisch;
// eigene Anpassungen bleiben immer erhalten.
async function saveDiagDb(db){
  try{
    const overrides={};
    for(const id of Object.keys(db)){
      const def=DIAG_DB_DEFAULTS[id];
      const cur=db[id];
      if(!def) { overrides[id]=cur; continue; }
      // Compare entries array vs defaults
      const defEntries=normEntries(def);
      const curEntries=normEntries(cur);
      const entriesChanged = JSON.stringify(curEntries)!==JSON.stringify(defEntries);
      if(entriesChanged||cur.diagnose!==def.diagnose||cur.icd5!==def.icd5
         ||cur.icd5_f_meno!==def.icd5_f_meno||cur.icd5_m!==def.icd5_m){
        overrides[id]=cur;
      }
    }
    localStorage.setItem(DIAG_DB_OVERRIDES_KEY,JSON.stringify(overrides));
  }catch(e){}
}

async function loadDiagDbAsync(){
  try{
    const v=localStorage.getItem(DIAG_DB_OVERRIDES_KEY);
    if(v){
      const overrides=JSON.parse(v);
      // Merge: alle aktuellen Defaults (inkl. neuer Einträge) + eigene Überschreibungen
      return{...DIAG_DB_DEFAULTS,...overrides};
    }
  }catch(e){}
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
    const grp=STURZ_GRP.has(q.id)?"sturz":GC_RA_GRP.has(q.id)?"gc_ra":WKFx_GRP.has(q.id)?"wkfx":"other";
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
    // Same exclusive group → skip (only one per group)
    const sameGrp=(grp)=>first.grp===grp&&f.grp===grp;
    if(sameGrp("sturz")||sameGrp("gc_ra")||sameGrp("wkfx"))continue;
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
const DEFAULT_LH={name:"Dr. med. Georg P. Dahmen",title:"Facharzt für Orthopädie",strasse:"Tangstedter Landstraße 77",plz_ort:"22415 Hamburg",telefon:"",fax:"",email:""};

/* ═══════════════════════════════════════════════ LOCALSTORAGE (Einstellungen) ═══ */
async function storageGet(key,fallback=null){
  try{const v=localStorage.getItem(key);return v!==null?JSON.parse(v):fallback;}
  catch{return fallback;}
}
async function storageSet(key,val){
  try{localStorage.setItem(key,JSON.stringify(val));return true;}
  catch{return false;}
}

/* ═══════════════════════════════════════════════ INDEXEDDB (Befund-Datenbank) ═══
   DB-Schema (für späteren SQLite-Export identisch):
   Store "befunde":  id, fillDate, geaendert, status, gender,
                     patient {name, geburtsdatum},
                     answers (JSON), riskSnapshot (JSON)
   Store "settings": key/value (Draft, Briefkopf etc.)
*/
const IDB_NAME   = "osteo_db";
const IDB_VER    = 1;
let _idb = null;

function openIDB(){
  if(_idb) return Promise.resolve(_idb);
  return new Promise((res,rej)=>{
    const req = indexedDB.open(IDB_NAME, IDB_VER);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if(!db.objectStoreNames.contains("befunde")){
        const s = db.createObjectStore("befunde",{keyPath:"id"});
        s.createIndex("patName",  "patName",  {unique:false});
        s.createIndex("fillDate", "fillDate", {unique:false});
        s.createIndex("gender",   "gender",   {unique:false});
        s.createIndex("status",   "status",   {unique:false});
      }
    };
    req.onsuccess = e => { _idb = e.target.result; res(_idb); };
    req.onerror   = e => rej(e.target.error);
  });
}

// Hilfsfunktion: IDB-Request als Promise
function idbReq(fn){
  return openIDB().then(db=>new Promise((res,rej)=>{
    const r=fn(db); r.onsuccess=e=>res(e.target.result); r.onerror=e=>rej(e.target.error);
  }));
}
function idbTx(store,mode,fn){
  return openIDB().then(db=>new Promise((res,rej)=>{
    const tx=db.transaction(store,mode);
    const s=tx.objectStore(store);
    const r=fn(s);
    tx.oncomplete=()=>res(r?.result??true);
    tx.onerror=e=>rej(e.target.error);
  }));
}

// Befunde CRUD
async function idbSaveBefund(session){
  const rec={
    ...session,
    patName: (session.patient?.name||"").toLowerCase(),
    geaendert: new Date().toISOString(),
    status: session.status||"offen"
  };
  return idbTx("befunde","readwrite", s=>s.put(rec));
}
async function idbLoadAll(){
  return openIDB().then(db=>new Promise((res,rej)=>{
    const tx=db.transaction("befunde","readonly");
    const req=tx.objectStore("befunde").getAll();
    req.onsuccess=e=>res(e.target.result||[]);
    req.onerror=e=>rej(e.target.error);
  }));
}
async function idbDelete(id){
  return idbTx("befunde","readwrite", s=>s.delete(id));
}
async function idbExportJSON(){
  const all = await idbLoadAll();
  const blob = new Blob([JSON.stringify(all,null,2)],{type:"application/json"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href=url; a.download="osteo_befunde_"+new Date().toISOString().slice(0,10)+".json";
  a.click(); URL.revokeObjectURL(url);
}

/* ═════════════════════════ SEKUNDÄRE OSTEOPOROSE – AUSWERTUNG ═══ */
// symptom → {label, untersuchungen: [{name, icd}], hinweis}
const SEK_PROFILE = {
  hpth: {
    label: "Primärer Hyperparathyreoidismus (pHPT)",
    hinweis: "Erhöhtes Kalzium, Nierensteine und Knochenschmerzen sind die klassische Trias. Häufigste endokrine Ursache der sekundären Osteoporose.",
    untersuchungen: [
      {name:"Serumkalzium (Gesamt + ionisiert)",icd:"E21.0"},
      {name:"Parathormon (PTH intakt)",icd:"E21.0"},
      {name:"Phosphat, Magnesium",icd:"E21.0"},
      {name:"24h-Kalzium im Urin",icd:"E21.0"},
      {name:"Vitamin D (25-OH-D3)",icd:"E55.9"},
      {name:"Alkalische Phosphatase (AP)",icd:"E21.0"},
      {name:"Nierensonographie (Steine?)",icd:"N20.0"},
      {name:"Halsonsonographie (Epithelkörperchen?)",icd:"E21.0"},
    ]
  },
  cushing: {
    label: "Cushing-Syndrom (endogener Hyperkortisolismus)",
    hinweis: "Das Cushing-Syndrom ist die schwerste sekundäre Osteoporoseform durch Kortisol. Klinische Zeichen können sehr subtil sein.",
    untersuchungen: [
      {name:"Cortisol im 24h-Urin",icd:"E24.9"},
      {name:"Cortisol morgens/abends (zirkadianer Rhythmus)",icd:"E24.9"},
      {name:"1-mg-Dexamethason-Hemmtest (Overnight)",icd:"E24.9"},
      {name:"ACTH basal (zentral vs. adrenal)",icd:"E24.9"},
      {name:"MRT Hypophyse (Adenom?)",icd:"D35.2"},
      {name:"CT Nebennieren",icd:"D35.0"},
    ]
  },
  hypogonadismus: {
    label: "Hypogonadismus (Mann)",
    hinweis: "Testosteronmangel beim Mann ist die häufigste sekundäre Osteoporoseursache bei jüngeren Männern. Auch an Hypophysenerkrankung denken.",
    untersuchungen: [
      {name:"Testosteron gesamt + SHBG (freies Testosteron berechnet)",icd:"E29.1"},
      {name:"LH, FSH",icd:"E29.1"},
      {name:"Prolaktin",icd:"E22.1"},
      {name:"MRT Hypophyse bei Prolaktin ↑ oder LH/FSH ↓",icd:"D35.2"},
      {name:"Chromosomenanalyse bei Verdacht Klinefelter",icd:"Q98.0"},
    ]
  },
  hypogonadismus_f: {
    label: "Hypogonadismus / Amenorrhoe (Frau, prämenopausal)",
    hinweis: "Jede länger anhaltende Amenorrhoe (> 6 Monate) außerhalb von Schwangerschaft/Menopause führt zu Östrogenmangel und Knochenverlust.",
    untersuchungen: [
      {name:"FSH, LH, Östradiol",icd:"N91.2"},
      {name:"Prolaktin",icd:"E22.1"},
      {name:"TSH",icd:"E03.9"},
      {name:"Testosteron, DHEAS (Ausschluss Androgen-Überschuss)",icd:"E28.1"},
      {name:"MRT Hypophyse bei Prolaktin ↑",icd:"D35.2"},
    ]
  },
  hyperthyreose: {
    label: "Hyperthyreose / Überdosierung Schilddrüsenhormon",
    hinweis: "Subklinische Hyperthyreose (TSH < 0,1 mU/l) ist ein signifikanter Risikofaktor für Osteoporose, besonders postmenopausal.",
    untersuchungen: [
      {name:"TSH basal, fT3, fT4",icd:"E05.9"},
      {name:"Anti-TPO, Anti-TSHR (Immunthyreopathie?)",icd:"E05.0"},
      {name:"Schilddrüsensonographie",icd:"E05.9"},
      {name:"Szintigraphie bei Autonomie",icd:"E05.2"},
    ]
  },
  akromegalie: {
    label: "Akromegalie (Wachstumshormon-Exzess)",
    hinweis: "Akromegalie erhöht trotz zunächst erhöhter Knochenmasse durch IGF-1 das Frakturrisiko durch veränderte Knochenqualität.",
    untersuchungen: [
      {name:"IGF-1 (alters- und geschlechtsnormiert)",icd:"E22.0"},
      {name:"Wachstumshormon (GH) nüchtern",icd:"E22.0"},
      {name:"Oraler Glukosetoleranztest mit GH-Messung",icd:"E22.0"},
      {name:"MRT Hypophyse",icd:"D35.2"},
    ]
  },
  prolaktinom: {
    label: "Prolaktinom / Hyperprolaktinämie",
    hinweis: "Hyperprolaktinämie supprimiert die GnRH-Sekretion und führt so zu Hypogonadismus und Knochenverlust – bei Männern und Frauen.",
    untersuchungen: [
      {name:"Prolaktin nüchtern (mind. 2× messen)",icd:"E22.1"},
      {name:"MRT Hypophyse",icd:"D35.2"},
      {name:"FSH, LH, Östradiol / Testosteron",icd:"E22.1"},
    ]
  },
  zoeliakie: {
    label: "Zöliakie (glutensensitive Enteropathie)",
    hinweis: "Unerkannte Zöliakie ist eine der häufigsten und oft übersehenen Ursachen der sekundären Osteoporose, besonders bei Frauen < 50 Jahren.",
    untersuchungen: [
      {name:"Anti-Transglutaminase-IgA (tTG-IgA)",icd:"K90.0"},
      {name:"Gesamt-IgA (IgA-Mangel ausschließen)",icd:"K90.0"},
      {name:"Anti-Endomysium-Antikörper (EMA)",icd:"K90.0"},
      {name:"Gastroskopie mit Dünndarmbiopsie (Goldstandard)",icd:"K90.0"},
      {name:"Ferritin, Folsäure, Vitamin B12",icd:"K90.0"},
      {name:"25-OH-Vitamin D, Kalzium, AP",icd:"K90.0"},
    ]
  },
  ced: {
    label: "Chronisch-entzündliche Darmerkrankung (Morbus Crohn / Colitis ulcerosa)",
    hinweis: "Bei CED wirken entzündliche Zytokine, Malabsorption und Kortisongaben zusammen und erhöhen das Frakturrisiko deutlich.",
    untersuchungen: [
      {name:"Calprotectin im Stuhl",icd:"K50.9"},
      {name:"CRP, BSG, Blutbild",icd:"K50.9"},
      {name:"Vitamin D, Kalzium, Magnesium, Zink",icd:"K50.9"},
      {name:"Koloskopie mit Biopsie",icd:"K50.9"},
    ]
  },
  vit_d: {
    label: "Vitamin-D-Mangel / Osteomalazie",
    hinweis: "Schwerer Vitamin-D-Mangel (< 12 ng/ml) führt zur Osteomalazie – weiche, nicht-mineralisierte Knochen. Klinisch oft mit Osteoporose verwechselt.",
    untersuchungen: [
      {name:"25-OH-Vitamin D3",icd:"E55.9"},
      {name:"Kalzium, Phosphat, Magnesium",icd:"E55.9"},
      {name:"PTH intakt",icd:"E55.9"},
      {name:"Alkalische Phosphatase (bei Osteomalazie oft ↑)",icd:"E55.9"},
      {name:"Kreatinin, GFR (renale Vitamin-D-Aktivierung?)",icd:"E55.9"},
    ]
  },
  malabsorption: {
    label: "Allgemeines Malabsorptionssyndrom",
    hinweis: "Fettstühle sind ein zuverlässiges Zeichen schwerer Malabsorption. Ursachen: exokrine Pankreasinsuffizienz, Kurzdarmsyndrom, bakterielle Fehlbesiedlung.",
    untersuchungen: [
      {name:"Stuhlgewicht, Stuhlfett (Elastase-1 im Stuhl)",icd:"K90.9"},
      {name:"25-OH-Vitamin D, Vitamin E, A, K",icd:"K90.9"},
      {name:"Kalzium, Phosphat, Magnesium, Zink",icd:"K90.9"},
      {name:"Albumin, Präalbumin, Transferrin",icd:"K90.9"},
      {name:"H2-Atemtest (bakterielle Fehlbesiedlung)",icd:"K90.9"},
    ]
  },
  lebererkrankung: {
    label: "Hepatische Osteodystrophie / Lebererkrankung",
    hinweis: "Die Leber aktiviert Vitamin D und synthetisiert Bindungsproteine. Bei schwerer Lebererkrankung ist der Knochenstoffwechsel immer mitbetroffen.",
    untersuchungen: [
      {name:"GOT, GPT, GGT, AP, Bilirubin",icd:"K74.6"},
      {name:"Quick/INR, Albumin, Cholinesterase",icd:"K74.6"},
      {name:"ANA, AMA (primäre biliäre Cholangitis?)",icd:"K74.3"},
      {name:"25-OH-Vitamin D3",icd:"K74.6"},
      {name:"Leberbiopsie / Fibroscan bei Bedarf",icd:"K74.6"},
    ]
  },
  nieren: {
    label: "Renale Osteodystrophie / CKD-MBD",
    hinweis: "Ab GFR < 45 entsteht eine komplexe Störung aus sekundärem HPT, Vitamin-D-Mangel und Phosphatstau (CKD-MBD: mineral and bone disorder).",
    untersuchungen: [
      {name:"Kreatinin, GFR (CKD-EPI)",icd:"N18.3"},
      {name:"PTH intakt, Kalzium, Phosphat",icd:"N25.8"},
      {name:"25-OH-Vitamin D, 1,25-OH2-Vitamin D",icd:"N25.8"},
      {name:"Alkalische Phosphatase, Knochenspezifische AP",icd:"N25.8"},
      {name:"FGF-23 bei Verdacht auf Hyperphosphatonismus",icd:"N25.8"},
    ]
  },
  rta_bartter: {
    label: "Renale tubuläre Azidose (RTA) / Bartter/Gitelman-Syndrom",
    hinweis: "Chronische metabolische Azidose bei RTA führt zur Pufferung durch Kalzium aus dem Knochen – eine selten erkannte Ursache.",
    untersuchungen: [
      {name:"Blutgasanalyse (metabolische Azidose?)",icd:"N25.8"},
      {name:"Kalium, Natrium, Chlorid",icd:"N25.8"},
      {name:"Urin-pH, Urin-Ammonium",icd:"N25.8"},
      {name:"Kalzium und Phosphat im 24h-Urin",icd:"N25.8"},
    ]
  },
  hypercalciurie: {
    label: "Idiopathische Hyperkalziurie",
    hinweis: "Kalziurie > 300 mg/d (♂) oder > 250 mg/d (♀) bei normalem Serum-Kalzium – häufig bei Männern mit Osteoporose und Nierensteinen.",
    untersuchungen: [
      {name:"Kalzium im 24h-Urin (Referenz: < 7,5 mmol/d)",icd:"E83.5"},
      {name:"Kreatinin-Clearance im 24h-Urin",icd:"E83.5"},
      {name:"Serumkalzium, PTH",icd:"E83.5"},
      {name:"Vitamin D (25-OH-D3)",icd:"E83.5"},
    ]
  },
  myelom: {
    label: "Multiples Myelom / Plasmozytom",
    hinweis: "Bei ungeklärter Osteoporose, besonders mit Rückenschmerz und Anämie, muss ein multiples Myelom ausgeschlossen werden.",
    untersuchungen: [
      {name:"Serumelektrophorese + Immunfixation",icd:"C90.0"},
      {name:"Freie Leichtketten (kappa/lambda) im Serum",icd:"C90.0"},
      {name:"Serum-IgG, IgA, IgM",icd:"C90.0"},
      {name:"Bence-Jones-Protein im 24h-Urin",icd:"C90.0"},
      {name:"Blutbild, Differenzialblutbild",icd:"C90.0"},
      {name:"BSG (oft massiv erhöht)",icd:"C90.0"},
      {name:"LDH, β2-Mikroglobulin",icd:"C90.0"},
      {name:"Ganzkörper-MRT oder PET-CT bei Verdacht",icd:"C90.0"},
    ]
  },
  mastozytose: {
    label: "Systemische Mastozytose",
    hinweis: "Systemische Mastozytose ist selten, aber eine klassische Ursache junger Osteoporose – oft lange nicht erkannt. An Urticaria pigmentosa denken.",
    untersuchungen: [
      {name:"Tryptase im Serum (Screening)",icd:"D47.0"},
      {name:"Knochenmarkbiopsie (Goldstandard)",icd:"D47.0"},
      {name:"cKIT-Mutation (D816V) im Blut/Knochenmark",icd:"D47.0"},
      {name:"Urin-Methylhistamin im 24h-Urin",icd:"D47.0"},
      {name:"Ganzkörper-CT (Organbefall?)",icd:"D47.0"},
    ]
  },
  haemochromatose: {
    label: "Hereditäre Hämochromatose",
    hinweis: "Eisenablagerungen in Leber, Pankreas und Hypophyse führen zu multiplen Stoffwechselstörungen mit Sekundärosteoporose.",
    untersuchungen: [
      {name:"Ferritin, Transferrinsättigung (> 45% auffällig)",icd:"E83.1"},
      {name:"HFE-Genotypisierung (C282Y, H63D)",icd:"E83.1"},
      {name:"Leberwerte, Lebersonographie",icd:"E83.1"},
      {name:"Testosteron, LH, FSH (Hypophysenbefall?)",icd:"E83.1"},
      {name:"Nüchternblutzucker, HbA1c (Pankreas?)",icd:"E83.1"},
    ]
  },
  sarkoidose: {
    label: "Sarkoidose",
    hinweis: "Sarkoidose-Granulome aktivieren unkontrolliert Vitamin D3, was zu Hyperkalzämie, Hyperkalziurie und Osteoporose führt.",
    untersuchungen: [
      {name:"ACE (Angiotensin-Converting-Enzyme)",icd:"D86.9"},
      {name:"Serumkalzium, 1,25-OH2-Vitamin D3",icd:"D86.9"},
      {name:"Kalzium im 24h-Urin",icd:"D86.9"},
      {name:"Röntgen-Thorax / CT-Thorax (Lymphome?)",icd:"D86.0"},
      {name:"Bronchoalveoläre Lavage, ggf. Biopsie",icd:"D86.0"},
    ]
  },
  psa: {
    label: "Psoriasis-Arthritis / Psoriasis",
    hinweis: "Chronische systemische Entzündung bei Psoriasis-Arthritis erhöht das Frakturrisiko – besonders bei Kortisoneinsatz.",
    untersuchungen: [
      {name:"CRP, BSG, Blutbild",icd:"M07.3"},
      {name:"Röntgen Hände/Füße, Sakroiliakalgelenke",icd:"M07.3"},
      {name:"HLA-B27 (axiale Beteiligung?)",icd:"M07.3"},
    ]
  },
  vaskulitis: {
    label: "Systemische Vaskulitis",
    hinweis: "Vaskulitiden (Riesenzell, ANCA-assoziiert) erfordern häufig hochdosierte Kortisongaben – sofortiges Osteoporoseprophylaxe-Konzept nötig.",
    untersuchungen: [
      {name:"ANCA (p-ANCA, c-ANCA)",icd:"M31.9"},
      {name:"ANA, Anti-dsDNA",icd:"M32.9"},
      {name:"CRP, BSG, Komplement (C3, C4)",icd:"M31.9"},
      {name:"Urinstatus, Protein im 24h-Urin (renale Beteiligung?)",icd:"M31.9"},
    ]
  },
  hiv_ost: {
    label: "HIV-assoziierte Osteoporose",
    hinweis: "HIV-Patienten haben ein 3-fach erhöhtes Osteoporoserisiko – durch das Virus selbst, Entzündung und tenofovir-haltige Regime.",
    untersuchungen: [
      {name:"DXA frühzeitig ab Diagnosestellung",icd:"B24"},
      {name:"Vitamin D, Kalzium, Phosphat",icd:"B24"},
      {name:"Nüchtertes PTH, AP",icd:"B24"},
      {name:"Antiretroviales Regime prüfen (TDF vs. TAF?)",icd:"B24"},
    ]
  },
  immo_neuro: {
    label: "Neurogene Osteoporose / Immobilisationsosteoporose",
    hinweis: "Vollständige Immobilisation führt zu sehr raschem Knochenverlust (bis 40% in einem Jahr bei Querschnitt). Prophylaxe sofort einleiten.",
    untersuchungen: [
      {name:"DXA möglichst früh",icd:"M81.8"},
      {name:"Kalzium, Phosphat, AP",icd:"M81.8"},
      {name:"Vitamin D, PTH",icd:"M81.8"},
    ]
  },
  essstoerung: {
    label: "Essstörung / Anorexia nervosa",
    hinweis: "Anorexia nervosa führt zum schwerwiegendsten Knochenverlust in der Psychiatrie – oft irreversibel. DXA und Behandlung dringend.",
    untersuchungen: [
      {name:"DXA dringend",icd:"F50.0"},
      {name:"Östradiol, LH, FSH (hypothalamische Amenorrhoe?)",icd:"F50.0"},
      {name:"IGF-1, Wachstumshormon",icd:"F50.0"},
      {name:"Elektrolyte (Hypokaliämie bei Purging?)",icd:"F50.0"},
      {name:"Albumin, Präalbumin, Vitamin D, Zink",icd:"F50.0"},
    ]
  },
  alkohol_ost: {
    label: "Alkohol-assoziierte Osteoporose",
    hinweis: "Alkohol hemmt Osteoblasten direkt. Lebererkrankung und schlechte Ernährung verstärken den Effekt. Sturzrisiko erhöht.",
    untersuchungen: [
      {name:"GGT, GOT, GPT, Bilirubin (Leberschaden?)",icd:"F10.2"},
      {name:"Vitamin D, Kalzium, Magnesium, Phosphat",icd:"F10.2"},
      {name:"Folsäure, Vitamin B1 (Thiamin)",icd:"F10.2"},
      {name:"CDT (Carbohydrate-deficient transferrin, Marker chron. Alkohol)",icd:"F10.2"},
    ]
  },

  /* ── Genetische & seltene Knochenerkrankungen ── */
  oi: {
    label: "Osteogenesis imperfecta (OI, Glasknochenkrankheit)",
    hinweis: "OI Typ I (mildeste Form) bleibt häufig bis ins Erwachsenenalter undiagnostiziert. Blaue Skleren, familiäre Häufung und Frakturen im Kindesalter sind Warnsignale. Bisphosphonate wirken bei OI, aber die Grundlage ist ein Kollagen-I-Defekt – keine klassische Osteoporose.",
    untersuchungen: [
      {name:"Kollagen-Typ-I-Genetik (COL1A1/COL1A2) – Sequenzierung",icd:"Q78.0"},
      {name:"DXA (oft stark erniedrigt)",icd:"Q78.0"},
      {name:"Knochen-Biomarker: P1NP, CTX, AP",icd:"Q78.0"},
      {name:"Spaltlampenuntersuchung (blaue Skleren)",icd:"Q78.0"},
      {name:"Röntgen Skelett-Survey (Deformitäten, alte Frakturen)",icd:"Q78.0"},
      {name:"Audiometrie (Schalleitungsschwerhörigkeit?)",icd:"Q78.0"},
      {name:"Überweisung Humangenetik / Zentrum für seltene Knochenerkrankungen",icd:"Q78.0"},
    ]
  },
  xlh: {
    label: "X-linked Hypophosphatemia (XLH) / hereditäre Hypophosphatämie",
    hinweis: "XLH ist die häufigste Form hereditärer Rachitis (Prävalenz 1:20.000). Im Erwachsenenalter Enthesiopathien, Osteomalazie und Spontanfrakturen. Entscheidend: Burosumab (Anti-FGF23) ist seit 2018 zugelassen und hochwirksam – aber nur bei gesicherter Diagnose.",
    untersuchungen: [
      {name:"Phosphat im Serum nüchtern (Referenz 0,87–1,45 mmol/l)",icd:"E83.3"},
      {name:"Phosphat-Rückresorption im Urin (TmP/GFR)",icd:"E83.3"},
      {name:"FGF-23 (Fibroblast Growth Factor 23, intakt)",icd:"E83.3"},
      {name:"PHEX-Genanalyse (häufigste Mutation bei XLH)",icd:"E83.3"},
      {name:"Alkalische Phosphatase, Kalzium, PTH",icd:"E83.3"},
      {name:"25-OH-Vitamin D und 1,25-OH2-Vitamin D",icd:"E83.3"},
      {name:"Röntgen: Looser-Umbauzonen (Pseudofrakturen)?",icd:"E83.3"},
      {name:"Überweisung Endokrinologie / Phosphat-Spezialzentrum",icd:"E83.3"},
    ]
  },
  hpp: {
    label: "Hypophosphatasia (HPP)",
    hinweis: "HPP ist unterdiagnostiziert. Milde Formen (adult HPP) zeigen dauerhaft erniedrigte AP, Stressfrakturen und frühen Zahnverlust. Wichtig: Bisphosphonate sind bei HPP kontraindiziert und können den Verlauf verschlimmern – daher Diagnosesicherung vor Therapiebeginn essenziell. Enzymersatztherapie mit Asfotase alfa verfügbar.",
    untersuchungen: [
      {name:"Alkalische Phosphatase (AP) – alters- und geschlechtsspezifische Norm beachten",icd:"E83.3"},
      {name:"Pyridoxal-5-Phosphat (PLP) im Plasma (↑ bei HPP)",icd:"E83.3"},
      {name:"Phosphoethanolamin im Urin (↑ bei HPP)",icd:"E83.3"},
      {name:"Anorganisches Pyrophosphat (PPi) im Plasma",icd:"E83.3"},
      {name:"ALPL-Genanalyse (Alkalische-Phosphatase-Gen)",icd:"E83.3"},
      {name:"Röntgen: Metatarsale Stressfrakturen, Chondrokalzinose?",icd:"E83.3"},
      {name:"Kalzium, Phosphat, PTH, Vitamin D",icd:"E83.3"},
      {name:"Überweisung HPP-Zentrum (vor Bisphosphonat-Beginn!)",icd:"E83.3"},
    ]
  },
  tio: {
    label: "Tumorinduzierte Osteomalazie (TIO / Oncogenic Osteomalacia)",
    hinweis: "TIO ist selten aber potenziell kurativ durch Tumorentfernung. Der ursächliche Tumor ist meist winzig (< 2 cm), mesenchymal, und versteckt sich in Weichteilen oder Knochen. Konventionelle Bildgebung reicht nicht – DOTATATE-PET/CT oder DOTATOC-Szintigraphie nötig.",
    untersuchungen: [
      {name:"FGF-23 (intakt, im Plasma) – oft massiv erhöht",icd:"M83.8"},
      {name:"Phosphat nüchtern, TmP/GFR",icd:"M83.8"},
      {name:"1,25-OH2-Vitamin D (bei TIO oft ↓ trotz normaler 25-OH-D)",icd:"M83.8"},
      {name:"DOTATATE-PET/CT (Ganzkörper – Somatostatin-Rezeptor-Szintigraphie)",icd:"M83.8"},
      {name:"MRT Ganzkörper ergänzend",icd:"M83.8"},
      {name:"Gallium-68-DOTATOC-PET/CT alternativ",icd:"M83.8"},
      {name:"Überweisung Endokrinologie/Nuklearmedizin-Zentrum",icd:"M83.8"},
    ]
  },
  paget: {
    label: "Morbus Paget des Knochens",
    hinweis: "Paget ist im Frühstadium asymptomatisch und wird häufig als Zufallsbefund durch erhöhte AP entdeckt. Komplikationen: Frakturen, Arthrosen, seltene maligne Entartung (Osteosarkom). Bisphosphonate (v. a. Zoledronsäure) sind hochwirksam.",
    untersuchungen: [
      {name:"Alkalische Phosphatase gesamt + Knochen-spezifische AP",icd:"M88.9"},
      {name:"Kalzium, Phosphat, PTH",icd:"M88.9"},
      {name:"Knochenumbaumarker: P1NP, β-CTX",icd:"M88.9"},
      {name:"Röntgen der betroffenen Region(en)",icd:"M88.9"},
      {name:"Skelettszintigraphie (Tc-99m – Verteilungsmuster?)",icd:"M88.9"},
      {name:"MRT bei Kompression nervaler Strukturen",icd:"M88.9"},
    ]
  },
  marfan: {
    label: "Marfan-Syndrom",
    hinweis: "Marfan-Syndrom (FBN1) geht mit erniedrigter Knochendichte und erhöhtem Wirbelkörperfrakturrisiko einher. Hauptgefahr sind Aortendissektion und Linsenluxation – Knochenbeteiligung wird oft übersehen.",
    untersuchungen: [
      {name:"FBN1-Genanalyse (Fibrillin-1)",icd:"Q87.4"},
      {name:"Echokardiographie (Aortenwurzel-Durchmesser!)",icd:"Q87.4"},
      {name:"Spaltlampenuntersuchung (Linsenluxation?)",icd:"Q87.4"},
      {name:"DXA (Wirbelkörper, Hüfte)",icd:"Q87.4"},
      {name:"Röntgen/MRT Wirbelsäule (Skoliose, Duralektasie?)",icd:"Q87.4"},
      {name:"Überweisung Humangenetik + Kardiologie",icd:"Q87.4"},
    ]
  },
  eds: {
    label: "Ehlers-Danlos-Syndrom (EDS)",
    hinweis: "Hypermobiles EDS ist die häufigste EDS-Form (keine Genmutation bekannt). Klassisches EDS und vaskuläres EDS durch COL5A1/COL3A1-Mutationen. Niedrigere Knochendichte und Frakturneigung, besonders bei klassischem EDS.",
    untersuchungen: [
      {name:"Klinische Diagnose nach Brighton/Beighton-Score (hEDS)",icd:"Q79.6"},
      {name:"Kollagen-Panel (COL5A1, COL3A1 für klass./vasc. EDS)",icd:"Q79.6"},
      {name:"DXA Wirbelsäule und Hüfte",icd:"Q79.6"},
      {name:"Echokardiographie (vaskuläres EDS: Aortenbeteiligung?)",icd:"Q79.6"},
      {name:"Überweisung Humangenetik",icd:"Q79.6"},
    ]
  },
  gaucher: {
    label: "Morbus Gaucher (Glukozerebrosidasemangel)",
    hinweis: "Gaucher Typ I ist die häufigste lysosomale Speicherkrankheit. Knochenbeteiligung (Knocheninfarkte, Osteonekrose, Osteoporose) ist die häufigste Ursache bleibender Behinderung. Enzymersatztherapie (Imiglucerase) ist kurativ für die Knochenmanifestation.",
    untersuchungen: [
      {name:"Glukozerebrosidase-Aktivität in Leukozyten",icd:"E75.2"},
      {name:"GBA1-Genanalyse",icd:"E75.2"},
      {name:"Chitotriosidase im Serum (Aktivitätsmarker)",icd:"E75.2"},
      {name:"Ferritin, ACE (oft erhöht)",icd:"E75.2"},
      {name:"MRT Oberschenkelknochen (Ermark-Infiltration, Nekrose?)",icd:"E75.2"},
      {name:"DXA",icd:"E75.2"},
      {name:"Überweisung Hämato-Onkologie / Stoffwechselzentrum",icd:"E75.2"},
    ]
  },
  turner: {
    label: "Turner-Syndrom (45,X und Varianten)",
    hinweis: "Beim Turner-Syndrom führt primärer Hypogonadismus zu schwerem Östrogenmangel und frühzeitiger Osteoporose. DXA schon ab Diagnosestellung; Hormonersatztherapie bis zur natürlichen Menopause essenziell.",
    untersuchungen: [
      {name:"Chromosomenanalyse (Karyotyp 45,X oder Mosaikform)",icd:"Q96.0"},
      {name:"FSH, LH, Östradiol",icd:"Q96.0"},
      {name:"DXA Wirbelsäule und Hüfte",icd:"Q96.0"},
      {name:"Schilddrüsen-AK (erhöhtes Hashimoto-Risiko bei Turner)",icd:"Q96.0"},
      {name:"Echokardiographie (Aortenstenose, bikuspide Aortenklappe?)",icd:"Q96.0"},
      {name:"Überweisung Endokrinologie / gynäkologische Endokrinologie",icd:"Q96.0"},
    ]
  },
  klinefelter: {
    label: "Klinefelter-Syndrom (47,XXY und Varianten)",
    hinweis: "Klinefelter führt durch primären Hypogonadismus zu niedrigem Testosteron und erhöhtem Osteoporoserisiko. DXA empfohlen ab Diagnosestellung; Testosteronersatz schützt den Knochen.",
    untersuchungen: [
      {name:"Chromosomenanalyse (Karyotyp 47,XXY)",icd:"Q98.0"},
      {name:"Testosteron gesamt + SHBG, LH, FSH",icd:"Q98.0"},
      {name:"DXA Wirbelsäule und Hüfte",icd:"Q98.0"},
      {name:"Spermiogramm (Infertilität?)",icd:"Q98.0"},
      {name:"Überweisung Andrologie/Endokrinologie",icd:"Q98.0"},
    ]
  },
  seltene_metabolisch: {
    label: "Seltene Stoffwechselerkrankungen mit Knochenbeteiligung",
    hinweis: "Glykogenosen, mitochondriale Myopathien und Mukopolysaccharidosen können Sekundärosteoporose verursachen – meist im Kontext bekannter Grunderkrankung. Individuelle Abklärung mit Spezialzentrum empfohlen.",
    untersuchungen: [
      {name:"Laktat, Pyruvat (mitochondrial?)",icd:"E74.0"},
      {name:"Tandem-MS: organische Säuren, Aminosäuren",icd:"E74.0"},
      {name:"Lykosaminoglykane im Urin (MPS-Screening)",icd:"E76.0"},
      {name:"Muskelbiopsie / genetisches Panel bei klinischem Verdacht",icd:"E74.0"},
      {name:"DXA, Kalzium, Phosphat, Vitamin D",icd:"E74.0"},
      {name:"Überweisung Humangenetik / Stoffwechselzentrum",icd:"E74.0"},
    ]
  },
};

// Compute secondary osteoporosis flags from answers
function computeSecondary(answers){
  if(!answers) return [];
  // symMap: sym-key → array of {label, sectionTitle, answer}
  const symMap = {};
  for(const sec of SECTIONS){
    if(!sec.symcheck) continue;
    for(const q of (sec.qs||[])){
      const v = answers[q.id];
      if(v==="ja" && q.sym){
        if(!symMap[q.sym]) symMap[q.sym]=[];
        symMap[q.sym].push({
          label: q.label,
          sectionTitle: sec.title,
          qid: q.id,
        });
      }
    }
  }
  // Return array sorted by hit-count descending
  return Object.entries(symMap)
    .filter(([sym])=>SEK_PROFILE[sym])
    .sort((a,b)=>b[1].length-a[1].length)
    .map(([sym,hits])=>({sym, count:hits.length, hits, profile:SEK_PROFILE[sym]}));
}

/* ═══════════════════════ ICD-CODE HELPER ═══ */
// Returns the correct ICD-10 codes as string for a given DIAG_DB entry,
// considering gender and menopause status.
function getIcdCodes(entry, gender, answers){
  if(!entry) return "";
  const isPostMeno = gender==="f" && answers?.menopause_aktuell==="nein";
  if(isPostMeno && entry.icd5_f_meno) return entry.icd5_f_meno;
  if(gender==="m"  && entry.icd5_m)   return entry.icd5_m;
  return entry.icd5||"";
}
// Returns all ICD codes from all entries (entries array + gender codes)
function getAllIcdCodes(entry, gender, answers){
  if(!entry) return [];
  const isPostMeno = gender==="f" && answers?.menopause_aktuell==="nein";
  // Gender-specific override takes precedence
  if(isPostMeno && entry.icd5_f_meno){
    return entry.icd5_f_meno.split(",").map(s=>s.trim()).filter(Boolean);
  }
  if(gender==="m" && entry.icd5_m){
    return entry.icd5_m.split(",").map(s=>s.trim()).filter(Boolean);
  }
  // Collect from entries array
  if(Array.isArray(entry.entries) && entry.entries.length>0){
    return entry.entries.flatMap(e=>(e.icd5||"").split(",").map(s=>s.trim())).filter(Boolean);
  }
  return (entry.icd5||"").split(",").map(s=>s.trim()).filter(Boolean);
}
// Returns all diagnose texts from all entries
function getAllDiagnoses(entry, fallbackLabel){
  if(!entry) return [fallbackLabel||""];
  if(Array.isArray(entry.entries) && entry.entries.length>0){
    return entry.entries.map(e=>e.diagnose||fallbackLabel||"").filter(Boolean);
  }
  return [entry.diagnose||fallbackLabel||""];
}
// Returns display-friendly array of codes (legacy, uses first entry)
function getIcdArray(entry, gender, answers){
  return getAllIcdCodes(entry, gender, answers);
}

/* ═══════════════════════════════════════════════ TEXT EXPORT ═══ */
function buildTextExport(patient,gender,answers,risk,diff,lh,diagDb,sekDb){
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
    const icds=getIcdArray(diag,gender,answers);
    const icdStr=icds.join(", ");
    lines.push(`• ${diagText}`);
    if(icdStr)lines.push(`  ICD-10: ${icdStr}`);
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
  // Add postmenopausal osteoporosis base diagnosis if applicable
  const isPostMeno=gender==="f"&&answers?.menopause_aktuell==="nein";
  lines.push("DIAGNOSEN");lines.push(sub);
  if(isPostMeno){
    lines.push("Postmenopausale Osteoporose {M81.00G};");
  } else if(gender==="m"&&risk.factors.some(f=>["hueft_akut","hueft_alt","wirbelbruch_akut","wirbelbruch_anz","humerus","becken","unterarm"].includes(f.id))){
    lines.push("Osteoporose beim Mann {M81.50G};");
  }
  for(const f of risk.factors){
    const diag=db[f.id]||{};
    const diagTexts=getAllDiagnoses(diag,f.label);
    const allIcds=getAllIcdCodes(diag,gender,answers);
    if(diagTexts.length===1){
      const icdStr=allIcds.join(", ");
      lines.push(icdStr?diagTexts[0]+" {"+icdStr+"};":diagTexts[0]+";");
    } else {
      // Multiple entries: first line with codes, rest below
      diagTexts.forEach((text,i)=>{
        const icd=allIcds[i]||"";
        lines.push(icd?text+" {"+icd+"};":text+";");
      });
    }
  }
  // Menopause since
  if(isPostMeno&&answers?.menopause_seit){
    lines.push(`Menopause seit: ${answers.menopause_seit}`);
  }
  // ── Secondary osteoporosis diagnoses ──
  const sekHits = computeSecondary(answers);
  if(sekHits.length>0){
    lines.push("");
    lines.push("ABKLÄRUNGSHINWEISE – SEKUNDÄRE OSTEOPOROSEFORMEN");lines.push(sub);
    lines.push("Folgende Befundkonstellationen sollten weiter abgeklärt werden:");
    lines.push("");
    for(const {sym,count,hits,profile} of sekHits){
      const sekEntry = (sekDb||SEK_DIAG_DB_DEFAULTS)[sym]||{};
      const diagText = sekEntry.diagnose || profile.label;
      const icdCode  = sekEntry.icd5  || "";
      lines.push(icdCode ? `• ${diagText} {${icdCode}}` : `• ${diagText}`);
      lines.push(`  Klinischer Hinweis: ${profile.hinweis.slice(0,120)}${profile.hinweis.length>120?"…":""}`);
      lines.push(`  Auslösende Angaben (${count}):`);
      for(const h of hits){
        lines.push(`    – ${h.label}`);
      }
      lines.push(`  Vorgeschlagene Diagnostik:`);
      for(const u of profile.untersuchungen){
        lines.push(`    • ${u.name}${u.icd?" ["+u.icd+"]":""}`);
      }
      lines.push("");
    }
    lines.push("⚠ Abklärungsempfehlungen sind Orientierungshilfen. Diagnosestellung obliegt dem Arzt.");
  }
  return lines.join("\n");
}

/* ═══════════════════════════════════════════════ COMPONENTS ═══ */
function MedInput({qid,meds,rxValue,onRx,autoOpen}){
  const[open,setOpen]=useState(false);
  React.useEffect(()=>{if(autoOpen)setOpen(true);},[autoOpen]);
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
  const radio=()=>{
    // opts array is canonical; fall back to fmap keys for fmap-only questions (e.g. genant)
    const radioOpts = q.opts || (q.fmap ? Object.keys(q.fmap) : []);
    return(
      <div className="rg">
        {radioOpts.map(opt=>(
          <label key={opt} className={`rl${value===opt?" sel":""}`}>
            <input type="radio" name={q.id} value={opt} checked={value===opt} onChange={()=>onChange(q.id,opt)}/>
            {opt}
          </label>
        ))}
      </div>
    );
  };
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
        <MedInput qid={q.id} meds={q.meds} rxValue={rxValue} onRx={onRx} autoOpen={value==="ja"||(q.t==="radio"&&!!value&&value!=="Nein")}/>
      )}
      {q.t==="yn"&&yn()}
      {q.t==="yn_inv"&&(()=>{
        // yn_inv: "Ja" = kein Risiko, "Nein" = relevant (invertiert)
        const opts=["Ja","Nein"];
        return(
          <div className="yn-row">
            {opts.map(opt=>{
              const sel=value===opt.toLowerCase();
              return(
                <label key={opt} className={"yn-label"+(sel?" yn-sel":"")}>
                  <input type="radio" name={q.id} value={opt.toLowerCase()}
                    checked={sel} onChange={()=>onChange(q.id,opt.toLowerCase())} style={{display:"none"}}/>
                  {opt}
                </label>
              );
            })}
          </div>
        );
      })()}
      {q.t==="yn_inv"&&value==="nein"&&q.subfield&&(
        <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}>
          <label style={{fontSize:13,color:"#5a4a3a",whiteSpace:"nowrap"}}>{q.subfield.label}</label>
          <input type="text" placeholder={q.subfield.placeholder}
            value={answers[q.subfield.id]||""}
            onChange={e=>onChange(q.subfield.id,e.target.value)}
            style={{padding:"5px 9px",border:"1.5px solid #d4c4a8",borderRadius:5,
              fontSize:13,width:180,fontFamily:"inherit"}}/>
        </div>
      )}
      {q.t==="radio"&&radio()}
      {q.t==="number"&&numIn()}
      {q.t==="dxa"&&dxaIn()}
    </div>
  );
}

function Section({section,open,onToggle,answers,onAnswer,onRx,hasRisk,onCameraOpen}){
  return(
    <div className="sec">
      <div className={`sec-hdr${open?" open":""}${hasRisk?" has-risk":""}`} onClick={onToggle}>
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
        {(section.id==="meds"||section.id==="meds_f"||section.id==="meds_m")&&onCameraOpen&&(
          <div style={{margin:"12px 0 16px 0"}}>
            <button onClick={onCameraOpen} style={{
              width:"100%",padding:"14px 16px",background:"linear-gradient(135deg,#1a3a2a,#2a5a3a)",
              color:"white",border:"none",borderRadius:8,cursor:"pointer",
              fontFamily:"'Source Sans 3',sans-serif",fontSize:14,fontWeight:600,
              display:"flex",alignItems:"center",justifyContent:"center",gap:10,
              boxShadow:"0 4px 14px rgba(0,0,0,.25)"}}>
              <span style={{fontSize:22}}>📷</span>
              <span>Photographieren Sie Ihren Medikamentenplan oder Medikamentenschachteln</span>
            </button>
            <div style={{fontSize:11,color:"#8b7a68",textAlign:"center",marginTop:6,fontStyle:"italic"}}>
              QR-Code (Einheitlicher Medikationsplan) · Barcode (PZN/EAN) · KI-Fotoerkennung
            </div>
          </div>
        )}
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
  // Zulassungsgerechte Therapieempfehlungen nach deutschen Fachinformationen (Stand 2024)
  // Romosozumab (Evenity®): in Deutschland nur für postmenopausale Frauen zugelassen
  // Raloxifen, Bazedoxifen: nur für Frauen zugelassen
  // Ibandronat oral/i.v.: nur für Frauen zugelassen
  // Teriparatid (Forsteo® u. a.): für Frauen und Männer zugelassen
  // Denosumab (Prolia®): für Frauen und Männer zugelassen
  // Alendronat, Risedronat, Zoledronat: für Frauen und Männer zugelassen
  const catInfo={
    top:{
      cls:"top",
      eye:"Sehr hohes Risiko / Generelle Indikation",
      h:"10%-Schwelle und/oder generelle Indikation erreicht",
      d: gender==="f"
        ? "Osteoanabole Therapie sollte unverzüglich erwogen werden (A). In Deutschland zugelassene osteoanabole Optionen für Frauen: Romosozumab (Evenity®, 12 Monate) oder Teriparatid (Forsteo®/Terrosa®/Movymia®, max. 24 Monate). Anschließend Sequenztherapie mit Bisphosphonat oder Denosumab (Prolia®) essenziell."
        : "Osteoanabole Therapie sollte unverzüglich erwogen werden (A). In Deutschland für Männer zugelassene osteoanabole Option: Teriparatid (Forsteo®/Terrosa®/Movymia®, max. 24 Monate). Hinweis: Romosozumab ist in Deutschland für Männer nicht zugelassen. Anschließend Sequenztherapie mit Alendronat, Risedronat, Zoledronat oder Denosumab (Prolia®).",
    },
    high:{
      cls:"high",
      eye:"Deutlich erhöhtes Risiko",
      h:"5%-Schwelle erreicht – spezifische Therapie indiziert",
      d: gender==="f"
        ? "Antiresorptive Therapie wird empfohlen (A). Optionen: Bisphosphonate oral (Alendronat, Risedronat, Ibandronat) oder i.v. (Zoledronat, Ibandronat), Denosumab (Prolia® 60 mg s.c. alle 6 Monate), Raloxifen oder Bazedoxifen (SERM, wenn keine Frakturhochrisikokonstellation). Bei 10%-Schwelle osteoanabole Substanz erwägen."
        : "Antiresorptive Therapie wird empfohlen (A). Für Männer in Deutschland zugelassen: Alendronat, Risedronat, Zoledronat (i.v.) sowie Denosumab (Prolia®). Hinweis: Ibandronat, Raloxifen und Bazedoxifen sind für Männer nicht zugelassen. Bei 10%-Schwelle Teriparatid erwägen.",
    },
    mod:{
      cls:"mod",
      eye:"Mäßig erhöhtes Risiko",
      h:"3%-Schwelle erreicht – Abklärung empfehlenswert",
      d: gender==="f"
        ? "Spezifische Therapie kann erwogen werden, insbesondere bei starken oder irreversiblen Risikofaktoren (B). DXA zur Therapieschwellenbestimmung empfohlen. Basistherapie: Kalzium 1000 mg/Tag, Vitamin D 800–1000 IE/Tag, körperliche Aktivität, Sturzprophylaxe."
        : "Spezifische Therapie kann erwogen werden, insbesondere bei starken oder irreversiblen Risikofaktoren (B). DXA zur Therapieschwellenbestimmung empfohlen. Basistherapie: Kalzium 1000 mg/Tag, Vitamin D 800–1000 IE/Tag, körperliche Aktivität, Sturzprophylaxe.",
    },
    low:{
      cls:"low",
      eye:"Kein erhöhtes Risiko erkennbar",
      h:"Aktuell kein erhöhtes Frakturrisiko",
      d:"Allgemeine Prophylaxemaßnahmen werden empfohlen: Kalzium 1000 mg/Tag (bevorzugt über Ernährung), Vitamin D 800–1000 IE/Tag, regelmäßige körperliche Aktivität, Sturzprophylaxe. Verlaufskontrolle in 3–5 Jahren.",
    },
  };
  const info=cat?catInfo[cat]:null;
  return(
    <div className="result">
      <div className="result-title">📊 Auswertung – Osteoporose-Dokumentationshilfe</div>
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
        <strong>Wichtiger Hinweis:</strong> Diese Auswertung ist eine Demonstrations- und Schulungshilfe auf Basis der DVO-Leitlinie 2023 und ersetzt keine ärztliche Diagnose. Sie ist kein Medizinprodukt und darf daher nicht im medizinischen Umfeld zu Diagnose- oder Therapieentscheidungszwecken eingesetzt werden. Eine osteologische Therapieentscheidung erfordert unter anderem eine vollständige und gründliche Anamnese, klinische Untersuchung, ggf. Labordiagnostik und ggf. DXA-Knochendichtemessung.
      </div>
    </div>
  );
}

/* ─── SECONDARY OSTEOPOROSIS PANEL ─── */
function SecondaryPanel({answers,sekProfileDb,sekUntersDb,sekQsDb}){
  const sek = computeSecondary(answers);
  return(
    <div className="sek-panel">
      <div className="sek-panel-header">
        <span style={{fontSize:22}}>🔎</span>
        <div>
          <div className="sek-panel-title">Abklärung sekundärer Osteoporoseformen</div>
          <div className="sek-panel-sub">
            {sek.length>0
              ? `${sek.length} klinischer Hinweis${sek.length>1?"e":""} – bei Bestätigung weiterführende Diagnostik empfohlen`
              : "Keine spezifischen Symptomhinweise auf sekundäre Osteoporose angegeben"}
          </div>
        </div>
      </div>
      <div className="sek-panel-body">
        {sek.length===0 ? (
          <div className="sek-none">
            Bei den angegebenen Symptomen ergeben sich aktuell keine konkreten Hinweise auf eine abklärungsbedürftige sekundäre Osteoporoseform.
            <br/>Falls klinisch ein Verdacht besteht, bitte die entsprechenden Symptome oben eintragen.
          </div>
        ) : sek.map(({sym,count,hits,profile})=>(
          <div key={sym} className="sek-item">
            <div className="sek-item-header">
              <div className="sek-item-label">{(sekProfileDb&&sekProfileDb[sym]&&sekProfileDb[sym].label)||profile.label}</div>
              <span className={"sek-item-count"+(count>=2?" strong":"")}>
                {count} Hinweis{count>1?"e":""}
              </span>
            </div>

            {/* Auslösende Fragen / Antworten */}
            <div className="sek-triggers">
              <div className="sek-triggers-title">
                ✅ Folgende Angaben haben diesen Hinweis ausgelöst:
              </div>
              {hits.map((hit,i)=>(
                <div key={i} className="sek-trigger-row">
                  <span className="sek-trigger-check">✓</span>
                  <div style={{flex:1}}>
                    <div className="sek-trigger-q">{(sekQsDb&&sekQsDb[hit.qid]&&sekQsDb[hit.qid].label)||hit.label}</div>
                    <div className="sek-trigger-sec">{hit.sectionTitle}</div>
                  </div>
                  <span style={{fontSize:11,color:"#16a34a",fontWeight:700,
                    background:"#dcfce7",padding:"1px 7px",borderRadius:10,
                    whiteSpace:"nowrap",alignSelf:"flex-start",marginTop:2}}>
                    Ja
                  </span>
                </div>
              ))}
            </div>

            <div className="sek-hinweis">
              <strong>Klinischer Hinweis:</strong> {(sekProfileDb&&sekProfileDb[sym]&&sekProfileDb[sym].hinweis)||profile.hinweis}
            </div>
            <div className="sek-unt-title">Bei klinischem Verdacht könnten folgende Befunde interessant sein:</div>
            <div className="sek-unt-grid">
              {((sekUntersDb&&sekUntersDb[sym])||profile.untersuchungen||[]).map((u,i)=>(
                <div key={i} className="sek-unt-item">
                  <span style={{flex:1}}>{u.name}</span>
                  {u.icd&&<span className="sek-unt-icd">{u.icd}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{padding:"10px 20px 12px",fontSize:10.5,color:"#a09080",borderTop:"1px solid #f0e8d8",lineHeight:1.5}}>
          ⚠ Diese Empfehlungen sind Orientierungshilfen und ersetzen keine ärztliche Diagnose. Die Indikation zur weiteren Diagnostik liegt beim behandelnden Arzt.
        </div>
      </div>
    </div>
  );
}

/* ─── LETTERHEAD EDITOR ─── */
function DvoChart({gender,answers}){
  const g=gender||"f";
  const ages=[50,55,60,65,70,75,80,85,90];
  // Columns match image: "Ohne BMD" = index 0, then T 0.0 = index 1 … T −4.0 = index 9
  const tscoreCols=["Ohne BMD","T 0,0","T −0,5","T −1,0","T −1,5","T −2,0","T −2,5","T −3,0","T −3,5","T −4,0"];

  // Patient position — ONLY total hip (DVO 2023: no LWS evidence)
  const patAge=parseInt(answers.alter)||null;
  const patRow=patAge?ageRow(patAge):null;
  const hipVal=answers.dxa_hip!==undefined&&answers.dxa_hip!==""?parseFloat(answers.dxa_hip):null;
  // tCol returns 1-based (1=≥0 … 9=≤-3.5), +1 offset for "Ohne BMD" column at index 0
  const patColIdx=(hipVal!==null&&!isNaN(hipVal))?tCol(hipVal):null;
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

  // ci=0 → "Ohne BMD" = array index 0, ci=1 → T 0.0 etc.
  // null = cF < 1.0, i.e. threshold already exceeded without additional factors
  // Color priority: 10% (red) > 5% (orange) > 3% (yellow) > white
  const getCellInfo=(age,ci)=>{
    const v=(THRESH[g][activePerc][age]||[])[ci];
    const v10=(THRESH[g][10][age]||[])[ci];
    const v5=(THRESH[g][5][age]||[])[ci];
    const v3=(THRESH[g][3][age]||[])[ci];
    const ex10=v10===null||(v10!==undefined&&v10<=1.0);
    const ex5 =v5===null ||(v5!==undefined &&v5<=1.0);
    const ex3 =v3===null ||(v3!==undefined &&v3<=1.0);
    // Determine color from highest exceeded threshold
    const cls=ex10?"c-top":ex5?"c-high":ex3?"c-low":"";
    // Displayed value: from active table (null = no number shown)
    return{v:(v===undefined?null:v),cls};
  };

  // Patient cell: color by their actual cF vs ALL thresholds (highest reached)
  const getPatCellCls=()=>{
    if(!hasDxa||!patAge) return null;
    if(r10) return"c-top";
    if(r5)  return"c-high";
    if(r3)  return"c-low";
    if(r3===false) return"";
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
              patCellCls==="c-top"?"#D42020":
              patCellCls==="c-high"?"#F4A030":
              patCellCls==="c-low"?"#FFD966":"#4ade80",
              color:"white",padding:"3px 10px",borderRadius:4,fontWeight:700}}>
              {patCellCls==="c-top"||patCellCls==="c-high"||patCellCls==="c-low"?
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
              <th className="age-hdr">Alter</th>
              {tscoreCols.map((col,i)=>(
                <th key={i} style={patColIdx===i?{background:"#c8a070",color:"#2c1f0e",fontWeight:800}:{}}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ages.map(age=>{
              const isPatRow=patRow===age;
              return(
                <tr key={age} style={isPatRow?{outline:"2px solid #c8a070",outlineOffset:-1}:{}}>
                  <td className="age-cell" style={isPatRow?{background:"#c8a070",color:"#2c1f0e"}:{}}>
                    {age}{isPatRow?" 👤":""}
                  </td>
                  {tscoreCols.map((_,ci)=>{
                    const{v,cls}=getCellInfo(age,ci);
                    const isPatCell=isPatRow&&patColIdx===ci;
                    const cellCls=isPatCell?(patCellCls||cls||""):cls;
                    return(
                      <td key={ci} className={cellCls} style={isPatCell?{
                        outline:"3px solid #1a1a1a",
                        outlineOffset:"-2px",
                        position:"relative",
                        padding:"4px 6px"
                      }:{}}>
                        {isPatCell?(
                          <>
                            <div style={{fontSize:11,lineHeight:1.3}}>{v!==null?v:"–"}</div>
                            <div style={{fontSize:12,fontWeight:900,lineHeight:1.3,marginTop:2,borderTop:"1px solid rgba(0,0,0,0.25)",paddingTop:2}}>
                              {cF.toFixed(2)}
                            </div>
                          </>
                        ):(v!==null?v:"–")}
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
        <span className="dvo-legend-item"><span className="dvo-legend-dot" style={{background:"#FFD966",border:"1px solid #c8a030"}}/> 3% Schwelle erreicht</span>
        <span className="dvo-legend-item"><span className="dvo-legend-dot" style={{background:"#F4A030",border:"1px solid #c07010"}}/> 5% Schwelle erreicht</span>
        <span className="dvo-legend-item"><span className="dvo-legend-dot" style={{background:"#D42020",border:"1px solid #a00000"}}/> 10% Schwelle erreicht</span>
        <span className="dvo-legend-item"><span className="dvo-legend-dot" style={{background:"white",border:"1.5px solid #aaa"}}/> Wert = benötigter cF</span>
        {(patRow||patColIdx!==null)&&<span className="dvo-legend-item"><span className="dvo-legend-dot" style={{background:"#c8a070",border:"2px solid #8a6030"}}/> 👤 Patient</span>}
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
  const[search,setSearch]=useState("");
  const[sortBy,setSortBy]=useState("datum");  // "datum"|"name"|"risiko"
  const[filterGender,setFilterGender]=useState(gender||"alle");

  const filtered=sessions
    .filter(s=>{
      if(filterGender!=="alle"&&s.gender!==filterGender)return false;
      if(!search.trim())return true;
      const q=search.toLowerCase();
      return(s.patient?.name||"").toLowerCase().includes(q)||
             (s.fillDate||"").includes(q)||
             (s.patient?.geburtsdatum||"").includes(q);
    })
    .sort((a,b)=>{
      if(sortBy==="name")return(a.patient?.name||"").localeCompare(b.patient?.name||"");
      if(sortBy==="risiko")return(b.riskSnapshot?.cF||0)-(a.riskSnapshot?.cF||0);
      return b.id.localeCompare(a.id); // neueste zuerst
    });

  return(
    <div className="hist-panel">
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div className="hist-title">📂 Befund-Datenbank ({sessions.length})</div>
        <div style={{display:"flex",gap:6}}>
          <button className="hist-export-btn no-print" onClick={idbExportJSON} title="Alle Befunde als JSON exportieren">
            ⬇ JSON-Export
          </button>
          <button className="lh-cancel" onClick={onClose}>Schließen</button>
        </div>
      </div>

      {/* Suche & Filter */}
      <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
        <input
          className="hist-search"
          placeholder="🔍 Name, Datum, Geburtsdatum…"
          value={search} onChange={e=>setSearch(e.target.value)}
        />
        <select className="hist-select" value={filterGender} onChange={e=>setFilterGender(e.target.value)}>
          <option value="alle">Alle</option>
          <option value="f">Frauen</option>
          <option value="m">Männer</option>
        </select>
        <select className="hist-select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="datum">↓ Datum</option>
          <option value="name">A–Z Name</option>
          <option value="risiko">↓ Risiko</option>
        </select>
      </div>

      {/* Ergebniszeile */}
      <div style={{fontSize:11,color:"#8b7a68",marginBottom:8}}>
        {filtered.length} von {sessions.length} Befund{sessions.length!==1?"en":""}
        {search&&` · Suche: "${search}"`}
      </div>

      {/* Liste */}
      {filtered.length===0?(
        <div className="hist-empty">
          {sessions.length===0?"Noch keine Befunde gespeichert.":"Keine Treffer für diese Suche."}
        </div>
      ):filtered.map(s=>(
        <div key={s.id} className="hist-item">
          <div className="hist-date">
            {s.fillDate}
            {s.geaendert&&<span style={{fontSize:10,color:"#aaa",marginLeft:6}}>
              (geändert {new Date(s.geaendert).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})})
            </span>}
          </div>
          <div className="hist-pat">
            <strong>{s.patient?.name||"(kein Name)"}</strong>
            &nbsp;·&nbsp;{s.gender==="f"?"Frau ♀":"Mann ♂"}
            {s.patient?.geburtsdatum&&<span style={{color:"#5a4a3a"}}> · *{s.patient.geburtsdatum}</span>}
            <span style={{color:"#8b7a68",fontSize:11,marginLeft:8}}>
              cF ×{s.riskSnapshot?.cF?.toFixed(2)||"–"}
            </span>
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
/* ═══════════════════════════════════════════ CAMERA SCANNER ═══ */
// Medikamenten-Scanner: QR-Code (Einheitlicher Medikationsplan), Barcode (EAN/PZN), Foto + KI
function CameraScanner({onMedsFound, onClose}){
  const[mode,setMode]=useState("qr");   // "qr" | "barcode" | "foto"
  const[status,setStatus]=useState("Kamera wird gestartet…");
  const[statusCls,setStatusCls]=useState("scanning");
  const[result,setResult]=useState(null); // [{name, checked}]
  const[scanning,setScanning]=useState(true);
  const videoRef=React.useRef(null);
  const canvasRef=React.useRef(null);
  const streamRef=React.useRef(null);
  const scanTimerRef=React.useRef(null);
  const jsQRRef=React.useRef(null);

  // Load jsQR dynamically
  React.useEffect(()=>{
    if(!window.jsQR){
      const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
      s.onload=()=>{jsQRRef.current=window.jsQR;};
      document.head.appendChild(s);
    } else {
      jsQRRef.current=window.jsQR;
    }
  },[]);

  // Start camera
  React.useEffect(()=>{
    startCamera();
    return()=>stopCamera();
  },[]);

  // Restart scan loop when mode changes
  React.useEffect(()=>{
    setResult(null);setScanning(true);
    setStatus(mode==="foto"?"Ausrichten und Foto aufnehmen":mode==="qr"?"QR-Code im Rahmen positionieren":"Barcode im Rahmen positionieren");
    setStatusCls("scanning");
    if(mode!=="foto") startScanLoop();
    else stopScanLoop();
    return()=>stopScanLoop();
  },[mode]);

  const startCamera=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({
        video:{facingMode:"environment",width:{ideal:1280},height:{ideal:960}}
      });
      streamRef.current=stream;
      if(videoRef.current){videoRef.current.srcObject=stream;await videoRef.current.play();}
      setStatus(mode==="foto"?"Foto aufnehmen":"Scannen läuft…");setStatusCls("scanning");
      if(mode!=="foto") startScanLoop();
    }catch(e){
      setStatus("Kamerazugriff verweigert – bitte Erlaubnis erteilen");setStatusCls("error");
    }
  };

  const stopCamera=()=>{
    stopScanLoop();
    streamRef.current?.getTracks().forEach(t=>t.stop());
  };

  const stopScanLoop=()=>{
    if(scanTimerRef.current){clearInterval(scanTimerRef.current);scanTimerRef.current=null;}
  };

  const startScanLoop=()=>{
    stopScanLoop();
    scanTimerRef.current=setInterval(()=>scanFrame(),300);
  };

  const scanFrame=()=>{
    const video=videoRef.current;const canvas=canvasRef.current;
    if(!video||!canvas||video.readyState<2) return;
    const ctx=canvas.getContext('2d');
    canvas.width=video.videoWidth;canvas.height=video.videoHeight;
    ctx.drawImage(video,0,0);
    const imgData=ctx.getImageData(0,0,canvas.width,canvas.height);
    // Try jsQR for QR codes
    if(mode==="qr"&&jsQRRef.current){
      const code=jsQRRef.current(imgData.data,imgData.width,imgData.height);
      if(code){stopScanLoop();setScanning(false);parseQrCode(code.data);return;}
    }
    // For barcodes: basic EAN detection hint
    if(mode==="barcode"){
      // ZXing not available inline – prompt user to snap photo for API
      setStatus("Barcode positionieren und 📸 Foto aufnehmen klicken");setStatusCls("scanning");
    }
  };

  // Parse Einheitlicher Medikationsplan QR code
  const parseQrCode=async(data)=>{
    setStatus("QR-Code erkannt – wird ausgewertet…");setStatusCls("scanning");
    try{
      // EMP QR: starts with compressed XML or plain XML
      let xml=data;
      // Try base64 decompress (pako)
      if(!data.trim().startsWith('<')&&!data.trim().startsWith('{')){
        if(window.pako){
          try{
            const bin=atob(data.replace(/-/g,'+').replace(/_/g,'/'));
            const arr=new Uint8Array(bin.split('').map(c=>c.charCodeAt(0)));
            xml=window.pako.inflate(arr,{to:'string'});
          }catch(e2){xml=data;}
        }
      }
      // Parse XML for medication names
      const meds=[];
      if(xml.includes('<M ')||xml.includes('<m ')){
        const parser=new DOMParser();
        const doc=parser.parseFromString(xml,'text/xml');
        const mEls=[...doc.querySelectorAll('M'),...doc.querySelectorAll('m')];
        mEls.forEach(m=>{
          const name=m.getAttribute('a')||m.getAttribute('n')||m.getAttribute('name')||'';
          const pzn=m.getAttribute('p')||m.getAttribute('pzn')||'';
          if(name) meds.push({name:name+(pzn?` (PZN: ${pzn})`:''),checked:true});
        });
      }
      if(meds.length>0){
        setResult(meds);setStatus(`${meds.length} Medikamente erkannt`);setStatusCls("success");
      } else {
        // Fallback: send to Claude Vision/API for interpretation
        await analyzeWithAI("QR-Code Inhalt:\n"+data.substring(0,2000));
      }
    }catch(e){
      setStatus("Fehler beim Auslesen – versuche KI-Analyse…");setStatusCls("error");
      await analyzeWithAI("QR-Code Inhalt:\n"+data.substring(0,2000));
    }
  };

  // Take photo and analyze with Claude Vision API
  const takePhotoAndAnalyze=async()=>{
    const video=videoRef.current;const canvas=canvasRef.current;
    if(!video||!canvas) return;
    setScanning(false);setStatus("Foto wird analysiert…");setStatusCls("scanning");
    canvas.width=video.videoWidth;canvas.height=video.videoHeight;
    canvas.getContext('2d').drawImage(video,0,0);
    const base64=canvas.toDataURL('image/jpeg',0.85).split(',')[1];
    const prompt=mode==="barcode"
      ? "Lies den Barcode oder EAN-Code auf dieser Medikamentenschachtel. Nenne den Medikamentennamen, Wirkstoff und Stärke. Gib das Ergebnis als JSON-Array: [{\"name\":\"Vollständiger Name mit Stärke\",\"wirkstoff\":\"Wirkstoff\"}]"
      : "Erkenne alle Medikamentennamen in diesem Bild (Schachtel, Medikationsplan oder Liste). Gib das Ergebnis als JSON-Array: [{\"name\":\"Medikamentname Stärke Form\"}]. Nur JSON, kein anderer Text.";
    await analyzeWithAI(null, base64, prompt);
  };

  const analyzeWithAI=async(textInput, imageBase64=null, prompt=null)=>{
    try{
      const msgContent=[];
      if(imageBase64) msgContent.push({type:"image",source:{type:"base64",media_type:"image/jpeg",data:imageBase64}});
      msgContent.push({type:"text",text:prompt||"Erkenne alle Medikamentennamen. JSON-Array: [{\"name\":\"...\"}]. Nur JSON."});
      if(textInput) msgContent[msgContent.length-1].text+="\n\n"+textInput;

      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{role:"user",content:msgContent}]
        })
      });
      const data=await resp.json();
      const text=data.content?.map(b=>b.text||'').join('');
      const jsonMatch=text.match(/\[[\s\S]*\]/);
      if(jsonMatch){
        const parsed=JSON.parse(jsonMatch[0]);
        const meds=parsed.map(m=>({name:m.name||(typeof m==='string'?m:'Unbekannt'),checked:true}));
        if(meds.length>0){
          setResult(meds);setStatus(`${meds.length} Medikamente erkannt`);setStatusCls("success");return;
        }
      }
      setStatus("Keine Medikamente erkannt – bitte erneut versuchen");setStatusCls("error");setScanning(true);
      if(mode!=="foto")startScanLoop();
    }catch(e){
      setStatus("KI-Analyse fehlgeschlagen: "+e.message);setStatusCls("error");setScanning(true);
    }
  };

  const toggleItem=(i)=>setResult(r=>r.map((m,j)=>j===i?{...m,checked:!m.checked}:m));

  const applyMeds=()=>{
    const selected=result.filter(m=>m.checked).map(m=>m.name);
    if(selected.length>0) onMedsFound(selected);
    onClose();
  };

  return(
    <div className="cam-overlay">
      <div className="cam-panel">
        <div className="cam-head">
          <span className="cam-title">📷 Medikamenten-Scanner</span>
          <button className="cam-close" onClick={()=>{stopCamera();onClose();}}>×</button>
        </div>
        <div className="cam-mode-row">
          <button className={`cam-mode-btn${mode==="qr"?" active":""}`} onClick={()=>setMode("qr")}>
            🔲 QR-Code<br/><span style={{fontSize:10,fontWeight:400}}>Medikationsplan</span>
          </button>
          <button className={`cam-mode-btn${mode==="barcode"?" active":""}`} onClick={()=>setMode("barcode")}>
            ▌▌▌ Barcode<br/><span style={{fontSize:10,fontWeight:400}}>Schachtel EAN/PZN</span>
          </button>
          <button className={`cam-mode-btn${mode==="foto"?" active":""}`} onClick={()=>setMode("foto")}>
            🤖 KI-Foto<br/><span style={{fontSize:10,fontWeight:400}}>Name/Plan erkennen</span>
          </button>
        </div>
        <div className="cam-video-wrap">
          <video ref={videoRef} className="cam-video" playsInline muted autoPlay/>
          <canvas ref={canvasRef} className="cam-canvas"/>
          <div className="cam-overlay-frame">
            <div className={`cam-frame-box${mode==="barcode"?" barcode":""}`}/>
          </div>
          <div className="cam-frame-hint">
            {mode==="qr"&&"QR-Code des Medikationsplans positionieren"}
            {mode==="barcode"&&"Barcode auf Schachtel positionieren"}
            {mode==="foto"&&"Schachtel / Liste / Plan fotografieren"}
          </div>
        </div>
        <div className="cam-controls">
          {(mode==="foto"||mode==="barcode")&&(
            <button className="cam-snap-btn" onClick={takePhotoAndAnalyze} disabled={!scanning&&!result}>
              📸 Foto aufnehmen &amp; analysieren
            </button>
          )}
          {mode==="qr"&&scanning&&(
            <button className="cam-snap-btn danger" onClick={()=>{stopScanLoop();setScanning(false);setStatus("Scan gestoppt");}}>
              ⏹ Scan stoppen
            </button>
          )}
          {!scanning&&mode==="qr"&&!result&&(
            <button className="cam-snap-btn" onClick={()=>{setScanning(true);startScanLoop();}}>
              ▶ Neu scannen
            </button>
          )}
        </div>
        <div className={`cam-status ${statusCls}`}>{status}</div>
        {result&&result.length>0&&(
          <div className="cam-result">
            <div className="cam-result-title">✓ Erkannte Medikamente – bitte prüfen</div>
            {result.map((m,i)=>(
              <div key={i} className="cam-med-item">
                <input type="checkbox" className="cam-med-check" checked={m.checked} onChange={()=>toggleItem(i)}/>
                <div>
                  <div className="cam-med-name">{m.name}</div>
                </div>
              </div>
            ))}
            <button className="cam-apply-btn" onClick={applyMeds}
              disabled={!result.some(m=>m.checked)}>
              ✓ {result.filter(m=>m.checked).length} Medikamente übernehmen
            </button>
          </div>
        )}
      </div>
      <div style={{color:"#666",fontSize:11,textAlign:"center",marginTop:12,padding:"0 20px",fontFamily:"'Source Sans 3',sans-serif"}}>
        QR-Code: Einheitlicher Medikationsplan (KBV) · Barcode: EAN-13 / PZN · KI-Foto: Claude Vision API
      </div>
    </div>
  );
}

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
// Helper: normalize a DB entry to entries-array format
function normEntries(entry){
  if(!entry) return [{diagnose:"",icd5:""}];
  // Already has entries array
  if(Array.isArray(entry.entries) && entry.entries.length>0) return entry.entries.map(e=>({...e}));
  // Legacy single-entry format
  return [{diagnose:entry.diagnose||"", icd5:entry.icd5||""}];
}
// Helper: flatten entries array back to DB entry format
function flattenEntries(id, entries, original){
  const def = DIAG_DB_DEFAULTS[id]||{};
  const result = {
    ...original,
    entries: entries.map(e=>({...e})),
    // Keep first entry in legacy fields for backward compatibility
    diagnose: entries[0]?.diagnose||"",
    icd5:     entries[0]?.icd5||"",
  };
  return result;
}

function AdminPanel({diagDb,sekDiagDb,sekProfileDb,sekUntersDb,sekQsDb,onSave,onSaveSek,onSaveSekProfile,onSaveSekUnters,onSaveSekQs,onClose}){
  const ICD5_RE=/^[A-Z]\d{2}\.[\d]{2}[XG]?G?$/;
  const validateIcd=(s)=>(s||"").trim()===""||ICD5_RE.test((s||"").trim());
  const allIds=Object.keys(DIAG_DB_DEFAULTS);

  // draft: { [id]: { entries:[{diagnose,icd5},...], icd5_f_meno, icd5_m } }
  const[draft,setDraft]=useState(()=>{
    const d={};
    for(const id of allIds){
      const merged={...DIAG_DB_DEFAULTS[id],...(diagDb[id]||{})};
      d[id]={...merged, entries: normEntries(merged)};
    }
    return d;
  });
  const[pinInput,setPinInput]=useState("");
  const[pinErr,setPinErr]=useState(false);
  const[unlocked,setUnlocked]=useState(false);
  const[search,setSearch]=useState("");
  const[activeTab,setActiveTab]=useState("risiko"); // "risiko" | "sek"
  // Secondary DB draft
  const sekAllIds=Object.keys(SEK_DIAG_DB_DEFAULTS);
  const[sekDraft,setSekDraft]=useState(()=>{
    const d={};
    for(const id of sekAllIds) d[id]={...SEK_DIAG_DB_DEFAULTS[id],...((sekDiagDb||{})[id]||{})};
    return d;
  });
  // Profile (label + hinweis), Untersuchungen, Questions drafts
  const[sekProfileDraft,setSekProfileDraft]=useState(()=>({...buildSekProfileDefaults(),...(sekProfileDb||{})}));
  const[sekUntersDraft,setSekUntersDraft]=useState(()=>({...buildSekUntersDefaults(),...(sekUntersDb||{})}));
  const[sekQsDraft,setSekQsDraft]=useState(()=>({...buildSekQsDefaults(),...(sekQsDb||{})}));
  const[expandedSym,setExpandedSym]=useState(null);

  // Entry CRUD
  const updateEntry=(id,idx,field,val)=>{
    setDraft(d=>{
      const entries=[...normEntries(d[id])];
      entries[idx]={...entries[idx],[field]:val};
      return{...d,[id]:flattenEntries(id,entries,d[id])};
    });
  };
  const addEntry=(id)=>{
    setDraft(d=>{
      const entries=[...normEntries(d[id]),{diagnose:"",icd5:""}];
      return{...d,[id]:flattenEntries(id,entries,d[id])};
    });
  };
  const removeEntry=(id,idx)=>{
    setDraft(d=>{
      let entries=[...normEntries(d[id])];
      if(entries.length<=1){entries=[{diagnose:"",icd5:""}];}
      else{entries=entries.filter((_,i)=>i!==idx);}
      return{...d,[id]:flattenEntries(id,entries,d[id])};
    });
  };

  const handleSave=()=>{
    if(activeTab==="risiko"){ onSave(draft); }
    else {
      onSaveSek(sekDraft);
      onSaveSekProfile(sekProfileDraft);
      onSaveSekUnters(sekUntersDraft);
      onSaveSekQs(sekQsDraft);
    }
    onClose();
  };
  const handleReset=()=>{
    if(activeTab==="risiko"){
      if(window.confirm("Alle Risikofaktor-Diagnosen auf Standardwerte zurücksetzen?")){
        setDraft(()=>{
          const d={};
          for(const id of allIds){
            const def={...DIAG_DB_DEFAULTS[id]};
            d[id]={...def,entries:normEntries(def)};
          }
          return d;
        });
      }
    } else {
      if(window.confirm("Alle Sekundärform-Daten auf Standardwerte zurücksetzen?")){
        setSekDraft(()=>{const d={};for(const id of sekAllIds)d[id]={...SEK_DIAG_DB_DEFAULTS[id]};return d;});
        setSekProfileDraft(buildSekProfileDefaults());
        setSekUntersDraft(buildSekUntersDefaults());
        setSekQsDraft(buildSekQsDefaults());
      }
    }
  };
  const tryPin=()=>{
    if(pinInput==="1234"){setUnlocked(true);setPinErr(false);}
    else{setPinErr(true);}
  };

  // Label lookup
  const labelMap={};
  for(const sec of SECTIONS){
    for(const q of sec.qs)labelMap[q.id]=q.label;
  }
  labelMap["bmi"]="BMI (berechnet)";
  labelMap["tbs"]="TBS (DXA Texturanalyse)";

  const filteredIds = search.trim()
    ? allIds.filter(id=>{
        const q = search.toLowerCase();
        const label=(labelMap[id]||id).toLowerCase();
        const entries=normEntries(draft[id]);
        return id.includes(q)||label.includes(q)||
               entries.some(e=>(e.diagnose||"").toLowerCase().includes(q)||(e.icd5||"").toLowerCase().includes(q));
      })
    : allIds;
  const filteredSekIds = search.trim()
    ? sekAllIds.filter(id=>{
        const q=search.toLowerCase();
        const row=sekDraft[id]||{};
        return id.includes(q)||(row.diagnose||"").toLowerCase().includes(q)||(row.icd5||"").toLowerCase().includes(q);
      })
    : sekAllIds;

  return(
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-panel" onClick={e=>e.stopPropagation()}>
        <div className="admin-head">
          <span className="admin-head-title">⚙️ Admin – Diagnose-Datenbank</span>
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
            {/* Tab bar */}
            <div style={{display:"flex",background:"#1a1208",borderBottom:"2px solid #c8a070",flexShrink:0}}>
              {[["risiko","🦴 Risikofaktoren"],["sek","🔎 Sekundäre Osteoporose"]].map(([key,label])=>(
                <button key={key} onClick={()=>setActiveTab(key)}
                  style={{padding:"10px 20px",border:"none",cursor:"pointer",
                    fontFamily:"'Source Sans 3',sans-serif",fontSize:13,fontWeight:700,
                    background:activeTab===key?"#c8a070":"transparent",
                    color:activeTab===key?"#1a1208":"#c8a070",
                    borderBottom:activeTab===key?"2px solid #c8a070":"2px solid transparent",
                    marginBottom:-2,transition:"all .15s"}}>
                  {label}
                </button>
              ))}
            </div>

            {/* Search bar + info */}
            <div style={{padding:"8px 14px",background:"#fef9f4",borderBottom:"1px solid #ece5d8",
              display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",flexShrink:0}}>
              <input
                value={search} onChange={e=>setSearch(e.target.value)}
                placeholder={activeTab==="risiko"
                  ?"🔍 Suche nach Kennung, Frage oder Diagnose…"
                  :"🔍 Suche nach Erkrankung oder ICD-Code…"}
                style={{flex:1,minWidth:180,padding:"6px 10px",border:"1.5px solid #d4c4a8",
                  borderRadius:5,fontSize:12.5,fontFamily:"inherit",outline:"none"}}/>
              <span style={{fontSize:11,color:"#a09080",whiteSpace:"nowrap"}}>
                {activeTab==="risiko"
                  ? `${filteredIds.length} / ${allIds.length} Einträge`
                  : `${filteredSekIds.length} / ${sekAllIds.length} Einträge`}
              </span>
              <span style={{fontSize:11,color:"#7a6a58"}}>
                ICD-10: Buchstabe + 2 Ziffern + Punkt + 2 Ziffern + G&nbsp;&nbsp;·&nbsp;&nbsp;Rote Felder = ungültiges Format
              </span>
            </div>

            {/* Card list */}
            <div className="admin-scroll">
              {activeTab==="risiko" ? filteredIds.map(id=>{
                const row = draft[id]||{};
                const entries = normEntries(row);
                const def = DIAG_DB_DEFAULTS[id]||{};
                const label = labelMap[id]||id;
                return(
                  <div key={id} className="admin-card">
                    {/* Row 1: ID + question label */}
                    <div className="admin-card-header">
                      <span className="admin-card-id">{id}</span>
                      <span className="admin-card-label">{label}</span>
                    </div>

                    {/* Row 2+: one diagnosis row per entry */}
                    <div className="admin-card-body">
                      {/* Column labels (only shown once per card) */}
                      <div className="admin-diag-labels">
                        <span className="admin-diag-col-label">Klarschrift-Diagnose</span>
                        <span className="admin-diag-col-label">ICD-10-GM (mit G)</span>
                        <span></span>
                      </div>

                      {entries.map((entry,idx)=>{
                        const icdOk = validateIcd(entry.icd5);
                        return(
                          <div key={idx} className="admin-diag-row">
                            <input className="admin-input"
                              value={entry.diagnose||""}
                              placeholder="Klarschrift-Diagnose…"
                              onChange={e=>updateEntry(id,idx,"diagnose",e.target.value)}/>
                            <input className={"admin-icd-input"+(icdOk?"":" invalid")}
                              value={entry.icd5||""}
                              placeholder="z. B. M80.05G"
                              onChange={e=>updateEntry(id,idx,"icd5",e.target.value.toUpperCase())}/>
                            <button className="admin-del-btn"
                              title="Zeile löschen"
                              disabled={entries.length===1&&!entry.diagnose&&!entry.icd5}
                              onClick={()=>removeEntry(id,idx)}>✕</button>
                          </div>
                        );
                      })}

                      {/* + Zeile hinzufügen */}
                      <button className="admin-add-btn" onClick={()=>addEntry(id)}>
                        ＋ Diagnose-Zeile hinzufügen
                      </button>

                      {/* Gender-specific hint */}
                      {(def.icd5_f_meno||def.icd5_m)&&(
                        <div className="admin-gender-hint">
                          {def.icd5_f_meno&&<span>♀ postmenopausal: <strong>{row.icd5_f_meno||def.icd5_f_meno}</strong>&emsp;</span>}
                          {def.icd5_m&&<span>♂ Mann: <strong>{row.icd5_m||def.icd5_m}</strong></span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }) : (()=>{
              // ── SEK TAB (full editor) ────────────────────────────────
              // Build sym→questions lookup from SECTIONS at render time
              const symQsMap={};
              for(const sec of SECTIONS){
                if(!sec.symcheck) continue;
                for(const q of (sec.qs||[])){
                  if(q.sym){
                    if(!symQsMap[q.sym])symQsMap[q.sym]=[];
                    symQsMap[q.sym].push({...q,sectionTitle:sec.title});
                  }
                }
              }
              const sekSectionMap={
                hpth:"Hormonell",cushing:"Hormonell",hypogonadismus:"Hormonell",
                hypogonadismus_f:"Hormonell",hyperthyreose:"Hormonell",
                akromegalie:"Hormonell",prolaktinom:"Hormonell",
                zoeliakie:"Gastro/Absorption",ced:"Gastro/Absorption",
                vit_d:"Gastro/Absorption",malabsorption:"Gastro/Absorption",
                lebererkrankung:"Gastro/Absorption",
                nieren:"Nieren/Elektrolyte",rta_bartter:"Nieren/Elektrolyte",
                hypercalciurie:"Nieren/Elektrolyte",
                myelom:"Hämatologie",mastozytose:"Hämatologie",
                haemochromatose:"Hämatologie",
                sarkoidose:"Immunsystem",psa:"Immunsystem",
                vaskulitis:"Immunsystem",hiv_ost:"Immunsystem",
                immo_neuro:"Neurologie/Lebensstil",essstoerung:"Neurologie/Lebensstil",
                alkohol_ost:"Neurologie/Lebensstil",
                oi:"Genetisch/Selten",xlh:"Genetisch/Selten",hpp:"Genetisch/Selten",
                tio:"Genetisch/Selten",paget:"Genetisch/Selten",
                marfan:"Genetisch/Selten",eds:"Genetisch/Selten",
                gaucher:"Genetisch/Selten",turner:"Genetisch/Selten",
                klinefelter:"Genetisch/Selten",seltene_metabolisch:"Genetisch/Selten",
              };
              const groupOrder=["Hormonell","Gastro/Absorption","Nieren/Elektrolyte",
                "Hämatologie","Immunsystem","Neurologie/Lebensstil","Genetisch/Selten"];
              // Filter by search
              const filteredSekIds2=search.trim()
                ? Object.keys(SEK_PROFILE).filter(sym=>{
                    const q=search.toLowerCase();
                    const prof=sekProfileDraft[sym]||{};
                    const diag=sekDraft[sym]||{};
                    const qLabels=(symQsMap[sym]||[]).map(x=>(sekQsDraft[x.id]||{}).label||x.label).join(" ");
                    return sym.includes(q)||(prof.label||"").toLowerCase().includes(q)
                      ||(prof.hinweis||"").toLowerCase().includes(q)
                      ||(diag.diagnose||"").toLowerCase().includes(q)
                      ||qLabels.toLowerCase().includes(q);
                  })
                : Object.keys(SEK_PROFILE);
              const grouped={};
              for(const sym of filteredSekIds2){
                const grp=sekSectionMap[sym]||"Sonstige";
                if(!grouped[grp])grouped[grp]=[];
                grouped[grp].push(sym);
              }
              const inputSt={padding:"5px 9px",border:"1.5px solid #d4c4a8",borderRadius:5,
                fontSize:12.5,fontFamily:"inherit",width:"100%",background:"#fff",outline:"none"};
              const labelSt={fontSize:10,fontWeight:700,color:"#8b6a3a",textTransform:"uppercase",
                letterSpacing:".8px",marginBottom:3,display:"block"};
              const icdSt=(ok)=>({...inputSt,width:120,border:`1.5px solid ${ok?"#d4c4a8":"#dc2626"}`,
                flexShrink:0,background:ok?"#fff":"#fef2f2"});
              return groupOrder.flatMap(grp=>{
                if(!(grp in grouped))return[];
                return[
                  <div key={"grp-"+grp} style={{
                    padding:"6px 12px",fontSize:10.5,fontWeight:700,
                    color:"#c8a070",textTransform:"uppercase",letterSpacing:"1px",
                    background:"#1e1208",borderRadius:5,marginBottom:4,marginTop:10}}>
                    {grp}
                  </div>,
                  ...grouped[grp].map(sym=>{
                    const profRow=sekProfileDraft[sym]||{};
                    const diagRow=sekDraft[sym]||{};
                    const untersRows=sekUntersDraft[sym]||[];
                    const symQs=symQsMap[sym]||[];
                    const isOpen=expandedSym===sym;
                    const icdOk=validateIcd(diagRow.icd5);
                    return(
                      <div key={sym} className="admin-card" style={{marginBottom:6}}>

                        {/* ── Card header: toggle + Erkrankungsname ── */}
                        <div style={{display:"flex",alignItems:"center",gap:8,
                          padding:"10px 14px",background:"#f8f0e4",
                          borderBottom:"1px solid #ece0cc",borderRadius:"6px 6px 0 0",
                          cursor:"pointer"}}
                          onClick={()=>setExpandedSym(isOpen?null:sym)}>
                          <span style={{fontSize:13,color:"#c8a070",fontWeight:700,
                            transform:isOpen?"rotate(90deg)":"none",
                            transition:"transform .2s",display:"inline-block"}}>▶</span>
                          <span className="admin-card-id" style={{flexShrink:0}}>{sym}</span>
                          <span style={{flex:1,fontSize:13,fontWeight:600,color:"#3a2a10"}}>
                            {profRow.label||sym}
                          </span>
                          <span style={{fontSize:10,color:"#a09070",whiteSpace:"nowrap"}}>
                            {symQs.length} Frage{symQs.length!==1?"n":""} · {untersRows.length} Unt.
                          </span>
                        </div>

                        {isOpen&&(
                          <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:14}}>

                            {/* ── Erkrankungsname ── */}
                            <div>
                              <label style={labelSt}>🏷 Erkrankungsname (Anzeige & Auswertung)</label>
                              <input style={inputSt}
                                value={profRow.label||""}
                                placeholder="Erkrankungsname…"
                                onChange={e=>setSekProfileDraft(d=>({...d,[sym]:{...d[sym]||{},label:e.target.value}}))}/>
                            </div>

                            {/* ── Klinischer Hinweis ── */}
                            <div>
                              <label style={labelSt}>📋 Klinischer Hinweis (Auswertungstext)</label>
                              <textarea style={{...inputSt,resize:"vertical",minHeight:72,lineHeight:1.55}}
                                value={profRow.hinweis||""}
                                placeholder="Klinischer Hinweis für die Auswertungsansicht…"
                                onChange={e=>setSekProfileDraft(d=>({...d,[sym]:{...d[sym]||{},hinweis:e.target.value}}))}/>
                            </div>

                            {/* ── Diagnose bei Bestätigung ── */}
                            <div>
                              <label style={labelSt}>🏥 Diagnose & ICD-10 bei Bestätigung (Textexport)</label>
                              <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                                <input style={{...inputSt,flex:1}}
                                  value={diagRow.diagnose||""}
                                  placeholder="Diagnosebezeichnung für den Textexport…"
                                  onChange={e=>setSekDraft(d=>({...d,[sym]:{...d[sym],diagnose:e.target.value}}))}/>
                                <input style={icdSt(icdOk)}
                                  value={diagRow.icd5||""}
                                  placeholder="E21.0G"
                                  onChange={e=>setSekDraft(d=>({...d,[sym]:{...d[sym],icd5:e.target.value.toUpperCase()}}))}/>
                              </div>
                              {!icdOk&&<div style={{fontSize:10,color:"#dc2626",marginTop:2}}>
                                Ungültiges ICD-10-Format (Beispiel: E21.0G)
                              </div>}
                            </div>

                            {/* ── Auslösende Symptomfragen ── */}
                            <div>
                              <label style={labelSt}>❓ Auslösende Symptomfragen ({symQs.length})</label>
                              {symQs.length===0&&(
                                <div style={{fontSize:12,color:"#a09080",fontStyle:"italic",padding:"6px 0"}}>
                                  Keine Fragen für diese Erkrankung definiert.
                                </div>
                              )}
                              {symQs.map((q,qi)=>{
                                const qRow=sekQsDraft[q.id]||{label:q.label,hint:q.hint||""};
                                return(
                                  <div key={q.id} style={{
                                    background:"#f4f0ea",borderRadius:6,
                                    padding:"10px 12px",marginBottom:6,
                                    border:"1px solid #e0d4c0"}}>
                                    <div style={{display:"flex",gap:6,marginBottom:2,alignItems:"center"}}>
                                      <span style={{fontSize:9.5,fontWeight:700,color:"#a08050",
                                        textTransform:"uppercase",letterSpacing:".6px",
                                        background:"#e8d8b0",padding:"1px 6px",borderRadius:8,flexShrink:0}}>
                                        {q.id}
                                      </span>
                                      {q.onlyFor&&(
                                        <span style={{fontSize:9,color:"#fff",
                                          background:q.onlyFor==="f"?"#db2777":"#2563eb",
                                          padding:"1px 5px",borderRadius:8,flexShrink:0}}>
                                          nur {q.onlyFor==="f"?"♀ Frauen":"♂ Männer"}
                                        </span>
                                      )}
                                      <span style={{fontSize:10,color:"#9a8a70",marginLeft:"auto",flexShrink:0}}>
                                        {q.sectionTitle}
                                      </span>
                                    </div>
                                    <label style={{...labelSt,marginTop:6,marginBottom:3}}>Fragetext</label>
                                    <textarea style={{...inputSt,resize:"vertical",minHeight:52,
                                      fontSize:12,lineHeight:1.5,whiteSpace:"pre-wrap"}}
                                      value={qRow.label||""}
                                      placeholder="Fragetext…"
                                      onChange={e=>setSekQsDraft(d=>({...d,[q.id]:{...d[q.id]||{},label:e.target.value}}))}/>
                                    <label style={{...labelSt,marginTop:6,marginBottom:3}}>
                                      Erklärungstext (wird dem Arzt als Hinweis angezeigt)
                                    </label>
                                    <input style={{...inputSt,fontSize:12}}
                                      value={qRow.hint||""}
                                      placeholder="Klinischer Erklärungstext (optional)…"
                                      onChange={e=>setSekQsDraft(d=>({...d,[q.id]:{...d[q.id]||{},hint:e.target.value}}))}/>
                                  </div>
                                );
                              })}
                            </div>

                            {/* ── Vorgeschlagene Untersuchungen ── */}
                            <div>
                              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                                <label style={{...labelSt,marginBottom:0}}>
                                  🔬 Vorgeschlagene Untersuchungen ({untersRows.length})
                                </label>
                                <button onClick={()=>setSekUntersDraft(d=>({...d,[sym]:[...(d[sym]||[]),{name:"",icd:""}]}))}
                                  style={{fontSize:11,padding:"3px 10px",background:"#1a7f4f",color:"#fff",
                                    border:"none",borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>
                                  + Zeile hinzufügen
                                </button>
                              </div>
                              {untersRows.length===0&&(
                                <div style={{fontSize:12,color:"#a09080",fontStyle:"italic",padding:"4px 0"}}>
                                  Noch keine Untersuchungen – Zeile hinzufügen.
                                </div>
                              )}
                              {untersRows.map((u,ui)=>{
                                const icdU=validateIcd(u.icd||(u.icd||"").replace(/G$/,"")+"G");
                                return(
                                  <div key={ui} style={{display:"flex",gap:6,marginBottom:5,alignItems:"center"}}>
                                    <input style={{...inputSt,flex:1,fontSize:12}}
                                      value={u.name||""}
                                      placeholder="Untersuchungsname / Labortest…"
                                      onChange={e=>setSekUntersDraft(d=>{
                                        const rows=[...(d[sym]||[])];
                                        rows[ui]={...rows[ui],name:e.target.value};
                                        return{...d,[sym]:rows};
                                      })}/>
                                    <input style={{...inputSt,width:90,flexShrink:0,fontSize:12}}
                                      value={u.icd||""}
                                      placeholder="ICD"
                                      onChange={e=>setSekUntersDraft(d=>{
                                        const rows=[...(d[sym]||[])];
                                        rows[ui]={...rows[ui],icd:e.target.value.toUpperCase()};
                                        return{...d,[sym]:rows};
                                      })}/>
                                    <button
                                      onClick={()=>setSekUntersDraft(d=>({...d,[sym]:(d[sym]||[]).filter((_,i)=>i!==ui)}))}
                                      style={{flexShrink:0,background:"#fee2e2",color:"#dc2626",
                                        border:"1px solid #fca5a5",borderRadius:5,padding:"3px 8px",
                                        cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>✕</button>
                                  </div>
                                );
                              })}
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })
                ];
              });
            })()}
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
  const[sekDiagDb,setSekDiagDb]=useState(SEK_DIAG_DB_DEFAULTS);
  const[sekProfileDb,setSekProfileDb]=useState(()=>buildSekProfileDefaults());
  const[sekUntersDb,setSekUntersDb]=useState(()=>buildSekUntersDefaults());
  const[sekQsDb,setSekQsDb]=useState(()=>buildSekQsDefaults());
  const[adminOpen,setAdminOpen]=useState(false);
  const[adminPin,setAdminPin]=useState("");
  const[adminUnlocked,setAdminUnlocked]=useState(false);
  const ADMIN_PIN="1234";
  const[viewer,setViewer]=useState(null); // {type:"txt"|"pdf", content:string}
  const[camOpen,setCamOpen]=useState(false);
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
      const savedDb=await loadDiagDbAsync();setDiagDb(savedDb);
      setSekDiagDb(loadSekDiagDb());
      setSekProfileDb(loadSekDb(SEK_PROFILE_KEY, buildSekProfileDefaults));
      setSekUntersDb(loadSekDb(SEK_UNTERS_KEY, buildSekUntersDefaults));
      setSekQsDb(loadSekDb(SEK_QS_KEY, buildSekQsDefaults));
      const sess=await idbLoadAll();
      setSessions(sess.sort((a,b)=>b.id.localeCompare(a.id)));
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
    await idbSaveBefund(session);
    const updated=await idbLoadAll();
    setSessions(updated.sort((a,b)=>b.id.localeCompare(a.id)));
    return session;
  };

  const handleSaveLh=async(newLh)=>{setLh(newLh);await storageSet(STORE_LH,newLh);};
  const handleCamMeds=(meds)=>{
    // Add found medications as free-text entries to the first applicable rx field,
    // or to a dedicated "aktuelle_medikation_rx" catch-all field
    const existing=answers["aktuelle_medikation_rx"]||[];
    const merged=[...new Set([...existing,...meds])];
    setA("aktuelle_medikation_rx",merged);
    // Also try to match to known questions
    meds.forEach(name=>{
      const lower=name.toLowerCase();
      // Try to match to sections by keywords
      const qMatch=Object.keys(answers).find(k=>k.endsWith("_rx")&&false); // placeholder
    });
  };

  /* ── helpers ── */
  const makeFilename=(ext)=>{
    const name=(patient.name||"Patient").replace(/[^a-zA-Z0-9_\-äöüÄÖÜß]/g,"_");
    const date=today.replace(/\./g,"-");
    return `Osteoporose_${name}_${date}.${ext}`;
  };

  /* ── TXT: direct save-as with picker ── */
  const handleText=async()=>{
    if(!gender){alert("Bitte zuerst Geschlecht auswählen.");return;}
    await saveSession();
    const r=computeRisk(answers,gender);
    const d=prevSession?computeDiff(answers,prevSession,gender):null;
    const text=buildTextExport(patient,gender,answers,r,d,lh,diagDb,sekDiagDb);
    const fname=makeFilename("txt");
    // Try native File System Access API (shows real "Speichern unter" dialog)
    if(typeof window.showSaveFilePicker==="function"){
      try{
        const fh=await window.showSaveFilePicker({
          suggestedName:fname,
          types:[{description:"Textdatei",accept:{"text/plain":[".txt"]}}],
        });
        const ws=await fh.createWritable();
        await ws.write(text);
        await ws.close();
        return;
      } catch(e){
        if(e.name==="AbortError") return; // user cancelled – do nothing
        // fall through to viewer fallback
      }
    }
    // Fallback: show viewer with download button
    setViewer({type:"txt",content:text});
  };

  /* ── PDF: print dialog → user selects "Als PDF speichern" ── */
  const handlePrint=async()=>{
    if(!gender){alert("Bitte zuerst Geschlecht auswählen.");return;}
    await saveSession();
    const allOpen={};visibleSecs.forEach(s=>allOpen[s.id]=true);
    setOpenSec(allOpen);setShowResult(true);
    // Short delay for DOM, then print dialog (browser handles "Save as PDF")
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
    await idbDelete(id);
    setSessions(prev=>prev.filter(s=>s.id!==id));
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
          <button className="as-btn" style={{marginLeft:"auto"}} onClick={()=>setAdminOpen(true)}>⚙️ Admin</button>
          {gender&&<>
            <button className="as-btn" onClick={handleCalc}>📊 Auswertung</button>
            <button className="as-btn" onClick={handlePrint}>🖨 PDF speichern unter…</button>
            <button className="as-btn" onClick={handleText}>💾 TXT speichern unter…</button>
          </>}
        </div>

        {/* ── Letterhead (screen + print) ── */}
        <LetterheadEditor lh={lh} onSave={handleSaveLh}/>

        {/* ── App Header ── */}
        <div className="hdr">
          <h1>Osteoporose-Dokumentationshilfe und Risikocheck</h1>
          <p className="hdr-sub">Systematische Erfassung von Risikofaktoren und Symptomen sekundärer Osteoporoseformen – mit automatischer Berechnung der DVO-Therapieschwellen und Abklärungsempfehlungen.</p>
          <div className="badge">In Anlehnung an die DVO-Leitlinie 2023 · S3-Leitlinie AWMF 183-001 · Version 2.1</div>
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
            <strong>Dieses Instrument dient der Veranschaulichung und Schulung von strukturierter Dokumentation bereits bestehender Befunde und ist keine Unterstützung klinischer Entscheidungen und ersetzt keine individuelle ärztliche Beurteilung.</strong>
          </div>
          <label className="disclaimer-gate-check">
            <input type="checkbox" checked={disclaimerOk} onChange={e=>setDisclaimerOk(e.target.checked)}/>
            <span>Ich habe den Hinweis gelesen und verstanden. Dieses Tool wird ausschließlich zu Dokumentations-, Schulungs- oder Veranschaulichungszwecken verwendet.</span>
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
        {disclaimerOk&&gender&&visibleSecs.map(s=>{
          const sWithEdits = s.symcheck ? {
            ...s,
            qs:(s.qs||[]).map(q=>({
              ...q,
              label:(sekQsDb&&sekQsDb[q.id]&&sekQsDb[q.id].label)||q.label,
              hint: sekQsDb&&sekQsDb[q.id]&&sekQsDb[q.id].hint!==undefined
                ? (sekQsDb[q.id].hint||undefined) : q.hint,
            }))
          } : s;
          return(
            <Section key={s.id} section={sWithEdits} open={!!openSec[s.id]}
              onToggle={()=>toggleSec(s.id)} answers={answers} onAnswer={setA} onRx={setA}
              hasRisk={sWithEdits.qs.some(q=>answers[q.id]==="ja")}
              onCameraOpen={()=>setCamOpen(true)}/>
          );
        })}

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

      {showResult&&gender&&(
        <SecondaryPanel answers={answers}/>
      )}

        <div className="disclaimer" style={{marginTop:18}}>
          Auswertung in Analogie zur <strong>DVO-Leitlinie 2023</strong> · AWMF-Register 183-001, Version 2.1 · November 2023 / Juni 2024
        </div>
      </div>

            {adminOpen&&(
        <AdminPanel diagDb={diagDb} sekDiagDb={sekDiagDb}
          sekProfileDb={sekProfileDb} sekUntersDb={sekUntersDb} sekQsDb={sekQsDb}
          onClose={()=>{setAdminOpen(false);setAdminPin("");}}
          onSave={db=>{setDiagDb(db);saveDiagDb(db);}}
          onSaveSek={db=>{setSekDiagDb(db);saveSekDiagDb(db);}}
          onSaveSekProfile={db=>{setSekProfileDb(db);saveSekDb(SEK_PROFILE_KEY,db,buildSekProfileDefaults);}}
          onSaveSekUnters={db=>{setSekUntersDb(db);saveSekDb(SEK_UNTERS_KEY,db,buildSekUntersDefaults);}}
          onSaveSekQs={db=>{setSekQsDb(db);saveSekDb(SEK_QS_KEY,db,buildSekQsDefaults);}}/>
      )}
            {camOpen&&(
        <CameraScanner onMedsFound={handleCamMeds} onClose={()=>setCamOpen(false)}/>
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
                <button className="viewer-btn" onClick={async()=>{
                  const fname=makeFilename("txt");
                  if(typeof window.showSaveFilePicker==="function"){
                    try{
                      const fh=await window.showSaveFilePicker({
                        suggestedName:fname,
                        types:[{description:"Textdatei",accept:{"text/plain":[".txt"]}}],
                      });
                      const ws=await fh.createWritable();
                      await ws.write(viewer.content);
                      await ws.close();
                      setViewer(null);
                      return;
                    }catch(e){if(e.name==="AbortError")return;}
                  }
                  // Fallback anchor download
                  const blob=new Blob([viewer.content],{type:"text/plain;charset=utf-8"});
                  const url=URL.createObjectURL(blob);
                  const a=document.createElement("a");a.href=url;a.download=fname;
                  document.body.appendChild(a);a.click();
                  document.body.removeChild(a);URL.revokeObjectURL(url);
                }}>⬇️ Speichern unter…</button>
              </>
            ):(
              <>
                <span className="viewer-bar-title">🖨 Befundbericht – Druckansicht</span>
                <button className="viewer-btn primary" onClick={()=>{
                  const iframe=document.getElementById("viewer-iframe");
                  if(iframe&&iframe.contentWindow)iframe.contentWindow.print();
                  else window.print();
                }}>🖨 Drucken / Als PDF speichern</button>
                <span style={{fontSize:11,color:"#a09080",marginLeft:4}}>
                  → Im Druckdialog „Als PDF speichern" wählen
                </span>
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
