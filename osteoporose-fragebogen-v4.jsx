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
.sek-scoring-box{margin-top:14px;background:#f4f0fa;border:1px solid #d8c8f0;border-radius:8px;overflow:hidden}
.sek-scoring-title{padding:8px 14px;background:#ede4fa;font-size:12px;font-weight:700;color:#3a1a6a;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.sek-scoring-src{font-size:10px;color:#6a4a9a;text-decoration:underline;font-weight:400}
.sek-scoring-grid{padding:8px 10px;display:flex;flex-direction:column;gap:5px}
.sek-scoring-row{display:grid;grid-template-columns:190px 1fr;gap:8px;align-items:baseline;padding:4px 6px;background:white;border:1px solid #e4d8f8;border-radius:5px}
.sek-scoring-name{font-weight:700;color:#4a2a8a;font-size:11px;line-height:1.4}
.sek-scoring-desc{color:#3a3050;line-height:1.5;font-size:11.5px}
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

.action-strip{background:#1a2f1a;border-radius:8px;padding:11px 16px;margin-bottom:14px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.action-strip-title{font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#8ab88a;width:100%;margin-bottom:2px}
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
.admin-panel{background:white;border-radius:10px;width:min(1020px,98vw);max-height:96vh;display:flex;flex-direction:column;box-shadow:0 12px 50px rgba(0,0,0,.3);overflow:hidden}
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
/* ─── Anamnese & Pain Drawing ─── */
.anam-section{background:white;border-radius:10px;border:1px solid #e0d0bc;margin-bottom:12px;overflow:hidden}
.anam-header{display:flex;justify-content:space-between;align-items:center;padding:12px 18px;background:linear-gradient(90deg,#fdf6ee,#faf0e4);cursor:pointer;user-select:none}
.anam-header:hover{background:linear-gradient(90deg,#f7efe2,#f4ebd8)}
.pain-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:8px 14px;background:#f7f0e6;border-bottom:1px solid #e8d8c0}
.pain-tabs{display:flex;gap:4px;padding:8px 14px 0;flex-wrap:wrap}
.pain-tab{padding:5px 12px;border-radius:6px 6px 0 0;border:1px solid #d8c8b0;font-size:11.5px;font-family:inherit;cursor:pointer}
.pain-canvas-area{display:flex;justify-content:center;gap:16px;padding:12px 14px 14px;border-top:1px solid #d8c8b0;background:white;flex-wrap:wrap}
.pain-legend{font-size:11.5px;color:#9b8a7a;line-height:1.9;max-width:150px;padding-top:4px}
@media print{.pain-print-grid{display:grid!important;grid-template-columns:repeat(3,1fr);gap:6px;padding:6px}.pain-no-print{display:none!important}}
.pain-print-grid{display:none}
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
    {id:"andere_fraktur",t:"yn",label:"Hatten Sie einen anderen Knochenbruch durch einen leichten Sturz oder ohne besonderen Unfall?\nBeispiele: Knie, Schlüsselbein, Rippe – nicht Finger, Zehen oder Schädel.",
      hint:"Jede niedrigtraumatische Fraktur bei postmenopausalen Frauen oder Männern ab 60 Jahren ist laut DVO 2023 ein Risikoindikator – Basisdiagnostik (DXA, Labor) ist dann empfohlen.",icd:"M84.40G"},
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

    /* ── Eisen-Osteomalazie ── */
    {id:"sym_eisen_ost",t:"yn",label:"Erhalten Sie regelmäßig Eisen-Infusionen? (z.B. Ferinject®, Monofer®, Cosmofer®)",sym:"eisen_osteomalazie",
      hint:"Ferrioxid-haltige Eisenpräparate (besonders Ferric Carboxymaltose / Ferinject®) können eine FGF-23-vermittelte Hypophosphatämie mit Osteomalazie auslösen. Das Risiko steigt mit wiederholten Gaben."},
    {id:"sym_eisen_ost_praep",t:"text",label:"Wenn ja – welches Eisenpräparat wird verwendet?",
      showIf:{id:"sym_eisen_ost",val:"ja"},
      hint:"Bitte Präparatname angeben, z.B. Ferinject®, Monofer®, Cosmofer®, Venofer®, Fermed®"},
    {id:"sym_eisen_ost_seit",t:"text",label:"Seit wann erhalten Sie Eisen-Infusionen? (Monat/Jahr)",
      showIf:{id:"sym_eisen_ost",val:"ja"},
      hint:"Bei längerer Anwendung (> 3 Monate) sollte Phosphat und FGF-23 kontrolliert werden."},

    /* ── MTX-Osteopathie ── */
    {id:"sym_mtx_ost",t:"yn",label:"Nehmen Sie Methotrexat (MTX)? (z.B. als Rheuma-, Psoriasis- oder Tumortherapie)",sym:"mtx_osteopathie",
      hint:"Methotrexat kann bei längerer Anwendung (> 6 Monate) oder höherer kumulativer Dosis eine Osteopathie mit Stressfrakturen und Knochenschmerzen verursachen (MTX-Osteopathie)."},
    {id:"sym_mtx_seit",t:"text",label:"Wenn ja – seit wann nehmen Sie MTX und in welcher Dosis?",
      showIf:{id:"sym_mtx_ost",val:"ja"},
      hint:"Bitte angeben: Dosis in mg/Woche und ungefähre Therapiedauer. Kumulativdosen > 6 g sind mit erhöhtem Osteopathierisiko assoziiert."},
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
  return age>=0&&age<=130?age:null;
}
// Buchstaben inkl. Umlaute, Apostroph, Bindestrich – keine Zahlen, keine Sonderzeichen
const NAME_RE = /^[A-Za-zÄÖÜäöüßÀ-žÁáÉéÍíÓóÚúÂâÊêÎîÔôÛûËëÏïÜüÿŒœÆæ'\-\s]+$/;

function nameFilter(v){
  // Lässt nur erlaubte Buchstaben durch, blockiert Zahlen + echte Sonderzeichen
  return v.replace(/[^A-Za-zÄÖÜäöüßÀ-žÁáÉéÍíÓóÚúÂâÊêÎîÔôÛûËëÏïÜüÿŒœÆæ'\-\s]/g, "");
}
function autoCapitalizeName(v){
  if(!v)return v;
  // Filtert zuerst ungültige Zeichen heraus, dann Großschreibung
  const f=nameFilter(v);
  return f.split(/([\-\s]+)/).map(p=>{
    if(/^[\-\s]+$/.test(p))return p;
    return p.charAt(0).toUpperCase()+p.slice(1);
  }).join("");
}
function validateName(v){
  if(!v||v.trim().length<2) return "Mindestens 2 Buchstaben erforderlich.";
  if(v.trim().length>100)   return "Maximal 100 Zeichen erlaubt.";
  if(!NAME_RE.test(v.trim()))return "Nur Buchstaben erlaubt – keine Zahlen oder Sonderzeichen.";
  return null; // gültig
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
  // Sturzrisiko & Mobilität
  sturz:            {entries:[
                      {diagnose:"Sturzgeschehen in den letzten 12 Monaten (einmal)",              icd5:"W19.XXXG"},
                      {diagnose:"Rezidivierende Stürze in den letzten 12 Monaten (> 1×)",        icd5:"R29.60G"},
                    ]},
  immobilitaet:     {diagnose:"Eingeschränkte Mobilität / Hilfsmittelbedarf (Rollator, Gehstock, Rollstuhl)", icd5:"R26.89G"},
  tug:              {diagnose:"Pathologischer TUG-Test (> 12 s) – erhöhtes Sturzrisiko",          icd5:"R26.89G"},
  andere_fraktur:   {diagnose:"Niedrigtraumatische Fraktur, sonstige Lokalisation (z. B. Rippe, Klavikula, Knie)", icd5:"M80.08G"},
};
// Stabiler Schlüssel – nie versionieren, damit Nutzeränderungen alle Updates überleben
const DIAG_DB_OVERRIDES_KEY = "osteo_diagdb_overrides_v1";

/* ══════════════════════════════════════════════════════════════════════
   RISIKOINDIKATOREN  –  DVO-Leitlinie 2023, Kapitel 7.2
   Kein quantifiziertes RR im DVO-Rechner, aber Indikation zur
   Basisdiagnostik (DXA + Labor). Fließen NICHT in cF-Berechnung ein.
   ══════════════════════════════════════════════════════════════════════ */
const RISIKOINDIKATOR_IDS = new Set([
  "aromatasehemmer", // Aromatasehemmer-Therapie (Mammakarzinom)
  "cushing",         // Cushing-Syndrom / subklinischer Hyperkortisolismus
  "wachstumsmangel", // Wachstumshormonmangel / Hypophyseninsuffizienz
  "hormonablation",  // Hypogonadismus – Hormonablative Therapie
  "hypogonadismus",  // Hypogonadismus anderer Ursache
  "lupus",           // Systemischer Lupus erythematodes (SLE)
  "zoeliakie",       // Zöliakie
  "crohn",           // Morbus Crohn / Colitis ulcerosa
  "magenop",         // BII-Magenresektion / Gastrektomie
  "bariatrie",       // Bariatrische Operation
  "hiv",             // HIV-Infektion
  "andere_fraktur",  // Andere niedrigtraumatische Fraktur (postmenopausal / ♂ ≥60)
]);

const INDICATOR_LABELS = {
  aromatasehemmer: "Aromatasehemmer-Therapie (Mammakarzinom)",
  cushing:         "Cushing-Syndrom / subklinischer Hyperkortisolismus",
  wachstumsmangel: "Wachstumshormonmangel bei Hypophyseninsuffizienz",
  hormonablation:  "Männl. Hypogonadismus – Hormonablative Therapie",
  hypogonadismus:  "Männl. Hypogonadismus anderer Ursache",
  lupus:           "Systemischer Lupus erythematodes (SLE)",
  zoeliakie:       "Zöliakie (glutensensitive Enteropathie)",
  crohn:           "Morbus Crohn / Colitis ulcerosa",
  magenop:         "BII-Magenresektion oder Gastrektomie",
  bariatrie:       "Bariatrische Operation (Sleeve / Bypass)",
  hiv:             "HIV-Infektion",
  andere_fraktur:  "Andere niedrigtraumatische Fraktur (postmenopausal / ♂ ≥60)",
};

// * = Basisdiagnostik auch vor Alter 50 erwägen
const INDICATOR_ASTERISK = new Set(["lupus","crohn","bariatrie","hiv","aromatasehemmer"]);

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
  eisen_osteomalazie:{diagnose:"Eisen-Infusionsbedingte Osteomalazie (Ferrioxid-assoziierte Hypophosphatämie)",icd5:"E83.30G"},
  mtx_osteopathie:   {diagnose:"Methotrexat-Induzierte Osteopathie",                                          icd5:"M81.4G"},
};
// ══════════════════════════════════════════════════════════════════════
// SEK_SCORES_DEFAULTS  –  Klinische Scores & Stadieneinteilungen
// je Erkrankung: Array von Scoring-Systemen
// Jeder Eintrag: { name, quelle, stufen: [{label, info}] }
// ══════════════════════════════════════════════════════════════════════
const SEK_SCORES_DEFAULTS = {

  hpth: [
    { name:"5th Intl. Workshop PHPT 2022 – Klinische Phänotypen",
      quelle:"Bilezikian JP et al. J Bone Miner Res 2022;37(11):2293",
      url:"https://doi.org/10.1002/jbmr.4677",
      stufen:[
        {label:"Symptomatisch",     info:"Skelettkomplikationen (Osteitis fibrosa cystica, Frakturen) und/oder Nierenbeteiligung (Nephrolithiasis, Nephrokalzinose)"},
        {label:"Asymptomatisch",    info:"Biochemisch auffällig (Ca ↑, PTH ↑), keine klinischen Organkomplikationen; Zufallsbefund"},
        {label:"Normokalzämisch",   info:"Normales Albumin-korr. Ca + normales ionisiertes Ca, aber PTH ↑ – mind. 2× gemessen über 3–6 Monate nach Ausschluss aller Sekundärursachen"},
      ]
    },
    { name:"OP-Indikationen bei asymptomatischem pHPT (5th Workshop 2022)",
      quelle:"Bilezikian JP et al. J Bone Miner Res 2022;37(11):2293",
      url:"https://doi.org/10.1002/jbmr.4677",
      stufen:[
        {label:"Serum-Ca",          info:"> 1 mg/dl (0,25 mmol/l) über oberer Normwertgrenze"},
        {label:"Niere",             info:"eGFR < 60 ml/min, Nephrolithiasis/Nephrokalzinose in Bildgebung, Hyperkalziurie > 400 mg/24 h mit erhöhtem Steinrisiko"},
        {label:"Skelett",           info:"T-Score ≤ −2,5 (LWS, Schenkelhals, Gesamthüfte oder dist. 1/3 Radius), morphometrische Wirbelkörperfraktur (VFA/Röntgen)"},
        {label:"Alter < 50 Jahre",  info:"Operationsindikation unabhängig von weiteren Kriterien"},
      ]
    },
  ],

  cushing: [
    { name:"Nieman 2008 – Endocrine Society Diagnosekriterien",
      quelle:"Nieman LK et al. J Clin Endocrinol Metab 2008;93(5):1526",
      url:"https://doi.org/10.1210/jc.2007-2343",
      stufen:[
        {label:"Initial-Screening",          info:"UFC > Norm, Spätnacht-Speichelkortisol > 145 ng/dl (4 nmol/l), Serum-Kortisol nach 1 mg Dex > 1,8 µg/dl (50 nmol/l)"},
        {label:"Konfirmation",               info:"≥2 pathologische Tests → Endokrinologie; bei Diskordanz: Mitternachts-Serumkortisol oder Dex-CRH-Test"},
        {label:"Ursachendiagnostik",         info:"ACTH (ACTH-abhängig vs. ACTH-unabhängig), IPSS bei V.a. M. Cushing, MRT Hypophyse / CT Nebenniere"},
      ]
    },
    { name:"Cushing Syndrome Severity Index (CSI) – Sonino et al.",
      quelle:"Sonino N et al. J Intern Med 2000;247(5):623",
      url:"https://pubmed.ncbi.nlm.nih.gov/10840314",
      stufen:[
        {label:"Leicht (0–5)",          info:"Wenige diskrete Zeichen; minimale Alltagseinschränkung"},
        {label:"Mittelschwer (6–10)",   info:"Deutliche Körperveränderungen, metabolische Störungen (Hyperglykämie, Hypertonie)"},
        {label:"Schwer (11–16)",        info:"Ausgeprägte Symptomatik, schwere Komplikationen (Myopathie, Frakturen, Psychose)"},
      ],
      note:"8 Merkmale (Körperfett, Haut, Hypertonie, Muskeln, Knochen, Sexualsphäre, Psyche, Glucose), je 0–2 Punkte; Gesamt 0–16"
    },
  ],

  hypogonadismus: [
    { name:"EAU / Endocrine Society – Hypogonadismus-Definition (Mann)",
      quelle:"Bhasin S et al. J Clin Endocrinol Metab 2018;103(5):1715",
      url:"https://doi.org/10.1210/jc.2018-00229",
      stufen:[
        {label:"Gesamt-Testosteron < 300 ng/dl (10,4 nmol/l)", info:"Grenzwert für hypogonadalen Bereich; gilt für 2 Morgenmessungen (nüchtern, 8–10 Uhr)"},
        {label:"Symptome erforderlich",                          info:"Niedrige Libido, erektile Dysfunktion, verminderter Bartwuchs, Müdigkeit, Abnahme Muskelmasse oder -kraft"},
        {label:"Primär (hypergonadotrop)",                       info:"LH/FSH ↑ → testikuläre Ursache (z.B. Klinefelter)"},
        {label:"Sekundär (hypogonadotrop)",                      info:"LH/FSH niedrig/normal → hypophysär/hypothalamisch"},
      ]
    },
  ],

  hypogonadismus_f: [
    { name:"ESE/ASRM – Amenorrhoe-Klassifikation (Frau, prämenopausal)",
      quelle:"Gordon CM et al. J Clin Endocrinol Metab 2017;102(5):1413",
      url:"https://doi.org/10.1210/jc.2017-00131",
      stufen:[
        {label:"Hypoth. Amenorrhoe (FHA)",  info:"LH/FSH niedrig oder normal, Östradiol niedrig – Stress, Untergewicht, Leistungssport, PCOS-ähnlich"},
        {label:"Hyperprolaktinämisch",       info:"Prolaktin ↑, LH/FSH supprimiert → Prolaktinom ausschließen"},
        {label:"Hypergonadotrop",            info:"LH/FSH ↑, Östradiol ↓ → Ovarialinsuffizienz; bei < 40 J. = prämature Ovarialinsuffizienz (POI)"},
      ]
    },
  ],

  hyperthyreose: [
    { name:"ATA Guidelines 2016 – Schweregrad Hyperthyreose",
      quelle:"Ross DS et al. Thyroid 2016;26(10):1343",
      url:"https://doi.org/10.1089/thy.2016.0397",
      stufen:[
        {label:"Subklinisch",   info:"TSH < 0,4 mU/l, fT3/fT4 im Referenzbereich; erhöhtes Osteoporoserisiko, insbes. bei TSH < 0,1 mU/l"},
        {label:"Manifest",      info:"TSH < 0,1 mU/l, fT3 und/oder fT4 ↑; Symptome: Herzrasen, Gewichtsverlust, Tremor, Wärmeintoleranz"},
        {label:"Thyreotoxische Krise", info:"Burch-Wartofsky-Score ≥ 45 Punkte – lebensbedrohlich"},
      ]
    },
  ],

  akromegalie: [
    { name:"Giustina Consensus 2020 – Diagnose- und Aktivitätskriterien",
      quelle:"Giustina A et al. J Clin Endocrinol Metab 2020;105(4):dgz048",
      url:"https://doi.org/10.1210/clinem/dgz048",
      stufen:[
        {label:"Aktiv",       info:"IGF-1 > alters-/geschlechtsspezifische Obergrenze UND/ODER GH-Nadir im oGTT ≥ 0,4 µg/l (nach modernen Assays)"},
        {label:"Biochemisch kontrolliert (Medikament)", info:"IGF-1 normal UND GH < 1,0 µg/l unter Medikation"},
        {label:"Remission (postoperativ)",              info:"IGF-1 normalisiert UND GH < 0,4 µg/l (oGTT-Nadir) in spezifischem Assay"},
      ]
    },
  ],

  prolaktinom: [
    { name:"Melmed 2011 – Hyperprolaktinämie-Schweregrad (Endocrine Society)",
      quelle:"Melmed S et al. J Clin Endocrinol Metab 2011;96(2):273",
      url:"https://doi.org/10.1210/jc.2010-1990",
      stufen:[
        {label:"Milde Hyperprolaktinämie (< 100 ng/ml)",    info:"Häufig medikamentös oder Stress; selten Mikroprolaktinom"},
        {label:"Moderate (100–250 ng/ml)",                   info:"Prolaktinom-verdächtig; MRT Hypophyse indiziert"},
        {label:"Ausgeprägt (> 250 ng/ml)",                   info:"Sehr wahrscheinlich Makroprolaktinom; typische Werte > 500–1000 ng/ml bei Makroprolaktinom"},
      ]
    },
  ],

  zoeliakie: [
    { name:"Marsh-Oberhuber-Klassifikation 1999",
      quelle:"Oberhuber G et al. Eur J Gastroenterol Hepatol 1999;11(10):1185",
      url:"https://pubmed.ncbi.nlm.nih.gov/10524652",
      stufen:[
        {label:"Typ 0",  info:"Normal – Zöliakie unwahrscheinlich"},
        {label:"Typ 1",  info:"Intraepitheliale Lymphozytose (IEL ≥ 25/100 Enterozyten), Krypten normal, Zotten normal"},
        {label:"Typ 2",  info:"IEL ↑ + Kryptenhyperplasie, Zotten normal (sehr selten)"},
        {label:"Typ 3a", info:"Milde Zottenatrophie + IEL ↑ + Kryptenhyperplasie"},
        {label:"Typ 3b", info:"Ausgeprägte Zottenatrophie"},
        {label:"Typ 3c", info:"Vollständige Zottenatrophie (flat mucosa) – klassische Zöliakie"},
      ]
    },
    { name:"Corazza-Villanacci-Klassifikation (vereinfacht)",
      quelle:"Corazza GR, Villanacci V. J Clin Pathol 2005;58(6):573",
      url:"https://doi.org/10.1136/jcp.2004.025395",
      stufen:[
        {label:"Grad A",  info:"IEL ↑, keine Atrophie"},
        {label:"Grad B1", info:"Zottenatrophie, Zotten noch erkennbar (Vh:Kd-Ratio < 3)"},
        {label:"Grad B2", info:"Totale Zottenatrophie"},
      ]
    },
  ],

  ced: [
    { name:"Harvey-Bradshaw-Index (HBI) – Morbus Crohn Aktivität",
      quelle:"Harvey RF, Bradshaw JM. Lancet 1980;1(8167):514",
      url:"https://pubmed.ncbi.nlm.nih.gov/6102272",
      stufen:[
        {label:"Remission (0–4)",        info:"Keine oder minimale Symptome"},
        {label:"Leicht aktiv (5–7)",      info:"Geringe Beschwerden, keine systemische Beeinträchtigung"},
        {label:"Mäßig aktiv (8–16)",     info:"Deutliche Symptome; Therapieanpassung indiziert"},
        {label:"Schwer aktiv (≥ 17)",    info:"Schwere Beschwerden, Krankenhausaufnahme erwägen"},
      ]
    },
    { name:"Mayo-Score – Colitis ulcerosa Aktivität",
      quelle:"Schroeder KW et al. N Engl J Med 1987;317(26):1625",
      url:"https://doi.org/10.1056/NEJM198712243172603",
      stufen:[
        {label:"Remission (0–2)",        info:"Keine wesentliche Krankheitsaktivität"},
        {label:"Leicht aktiv (3–5)",     info:"Geringe rektale Blutung, leichte Endoskopieveränderungen"},
        {label:"Mäßig aktiv (6–10)",    info:"Häufige Blutung, moderate Endoskopieveränderungen"},
        {label:"Schwer aktiv (11–12)",   info:"Kontinuierliche Blutung, schwere Endoskopieveränderungen"},
      ]
    },
  ],

  vit_d: [
    { name:"Holick 2011 – Vitamin-D-Status nach 25-OH-D3",
      quelle:"Holick MF et al. J Clin Endocrinol Metab 2011;96(7):1911",
      url:"https://doi.org/10.1210/jc.2011-0385",
      stufen:[
        {label:"Ausreichend",    info:"25-OH-D3 ≥ 30 ng/ml (75 nmol/l)"},
        {label:"Insuffizient",   info:"25-OH-D3 20–29 ng/ml (50–74 nmol/l) – erhöhtes Frakturrisiko"},
        {label:"Defizient",      info:"25-OH-D3 < 20 ng/ml (50 nmol/l) – signifikant erhöhtes Osteoporoserisiko"},
        {label:"Schwerer Mangel",info:"25-OH-D3 < 10 ng/ml (25 nmol/l) – Osteomalazie-Risiko"},
      ]
    },
  ],

  malabsorption: [
    { name:"Klinisches Schweregrad-Schema Malabsorption",
      quelle:"Klinische Einteilung nach internationalem Konsens (keine formal standardisierte Skala)",
      stufen:[
        {label:"Leicht",        info:"Gelegentliche Steatorrhoe, leichte Mikronährstoffmängel"},
        {label:"Mäßig",        info:"Regelmäßige Steatorrhoe, Gewichtsverlust, Eisenmangel/Anämie"},
        {label:"Schwer",        info:"Ausgeprägte Steatorrhoe, Gewichtsverlust > 10%, multiple Mängel (Vit. D, A, E, K, Kalzium, Zink)"},
      ]
    },
  ],

  lebererkrankung: [
    { name:"Child-Pugh-Klassifikation – Leberzirrhose-Schweregrad",
      quelle:"Child CG, Turcotte JG. Surgery 1964;65:14 – modifiziert Pugh RN et al. Br J Surg 1973;60(9):646",
      url:"https://pubmed.ncbi.nlm.nih.gov/4541592",
      stufen:[
        {label:"Child A (5–6 Pkt.)",  info:"Gute Leberfunktion; 1-Jahres-Überleben ca. 95%"},
        {label:"Child B (7–9 Pkt.)",  info:"Mäßig eingeschränkte Leberfunktion; 1-Jahres-Überleben ca. 75%"},
        {label:"Child C (10–15 Pkt.)", info:"Schwere Leberzirrhose; 1-Jahres-Überleben < 50%"},
      ],
      note:"Kriterien: Aszites, Enzephalopathie, Bilirubin, Albumin, Quick/INR – je 1–3 Punkte"
    },
    { name:"MELD-Score – Mortalitätsprädiktion",
      quelle:"Kamath PS et al. Hepatology 2001;33(2):464",
      url:"https://doi.org/10.1053/jhep.2001.22172",
      stufen:[
        {label:"MELD < 10",    info:"Geringe 90-Tages-Mortalität (ca. 2%)"},
        {label:"MELD 10–19",   info:"Mäßig erhöhtes Risiko (ca. 6–20%)"},
        {label:"MELD 20–29",   info:"Erhöhtes Risiko (ca. 20%)"},
        {label:"MELD ≥ 30",    info:"Hohes Risiko (> 50% Mortalität ohne Transplantation)"},
      ],
      note:"MELD = 10 × (0,957 × ln(Kreatinin) + 0,378 × ln(Bilirubin) + 1,12 × ln(INR)) + 6,43"
    },
  ],

  nieren: [
    { name:"KDIGO 2012/2017 – CKD-Stadien nach eGFR (CKD-EPI)",
      quelle:"KDIGO CKD-MBD Update Work Group. Kidney Int Suppl 2017;7:1",
      url:"https://doi.org/10.1016/j.kint.2017.04.001",
      stufen:[
        {label:"G1  (≥ 90 ml/min)",    info:"Normales Filtrat, CKD nur bei Strukturschaden/Proteinurie"},
        {label:"G2  (60–89 ml/min)",   info:"Leicht eingeschränkt"},
        {label:"G3a (45–59 ml/min)",   info:"Leicht-mäßig eingeschränkt – MBD-Monitoring beginnen!"},
        {label:"G3b (30–44 ml/min)",   info:"Mäßig-schwer eingeschränkt – PTH, Phosphat, Ca halbjährlich"},
        {label:"G4  (15–29 ml/min)",   info:"Schwer eingeschränkt – Vitamin-D-Aktivierung gestört, sek. HPT"},
        {label:"G5  (< 15 ml/min)",    info:"Nierenversagen / Dialyse (G5D) – CKD-MBD komplex"},
      ]
    },
  ],

  rta_bartter: [
    { name:"RTA-Typen-Klassifikation nach Pathomechanismus",
      quelle:"Rodriguez Soriano J. Pediatr Nephrol 2002;17(3):187",
      url:"https://doi.org/10.1007/s004670100650",
      stufen:[
        {label:"RTA Typ 1 (distale RTA)", info:"Unfähigkeit zur Urinansäuerung; Urin-pH > 5,5; Hyperkalziurie, Nephrolithiasis, Osteopenie"},
        {label:"RTA Typ 2 (proximale RTA)", info:"Bikarbonat-Verlust; hypokaliämisch; Fanconi-Syndrom möglich"},
        {label:"RTA Typ 4 (hyperkaliämisch)", info:"Aldosteron-Mangel/-Resistenz; häufig bei CKD, Diabetes"},
        {label:"Bartter-Syndrom",           info:"Chlorid-Kanal-Defekt; Hypokaliämie, metabolische Alkalose, Hyperkalziurie"},
        {label:"Gitelman-Syndrom",          info:"Mildes Salzverlust-Syndrom; Hypomagnesiämie, Hypokalziurie"},
      ]
    },
  ],

  hypercalciurie: [
    { name:"Definition Hyperkalziurie – internationale Schwellenwerte",
      quelle:"Worcester EM, Coe FL. N Engl J Med 2010;363(10):954",
      url:"https://doi.org/10.1056/NEJMcp1001511",
      stufen:[
        {label:"Normal (♂)",          info:"< 300 mg/d (7,5 mmol/d) im 24h-Urin"},
        {label:"Normal (♀)",          info:"< 250 mg/d (6,2 mmol/d) im 24h-Urin"},
        {label:"Hyperkalziurie",      info:"♂ ≥ 300 mg/d oder ♀ ≥ 250 mg/d – Osteoporoserisiko erhöht"},
        {label:"Schwere Hyperkalziurie", info:"≥ 400 mg/d – OP-Indikation bei pHPT; Nierensteinrisiko sehr hoch"},
      ]
    },
  ],

  myelom: [
    { name:"R-ISS – Revised International Staging System (IMWG 2015)",
      quelle:"Palumbo A et al. J Clin Oncol 2015;33(26):2863",
      url:"https://doi.org/10.1200/JCO.2015.61.2267",
      stufen:[
        {label:"R-ISS I",   info:"ISS I + Standard-Risiko-Zytogenetik (iFISH, kein Hochrisiko) + LDH ≤ ULN; 5-JÜL ~82%"},
        {label:"R-ISS II",  info:"Weder I noch III; heterogene Gruppe; 5-JÜL ~62%"},
        {label:"R-ISS III", info:"ISS III + Hochrisiko-Zytogenetik (del17p, t(4;14), t(14;16)) ODER LDH > ULN; 5-JÜL ~40%"},
      ]
    },
    { name:"ISS – International Staging System (IMWG 2005)",
      quelle:"Greipp PR et al. J Clin Oncol 2005;23(15):3412",
      url:"https://doi.org/10.1200/JCO.2005.04.242",
      stufen:[
        {label:"ISS I",   info:"β2-Mikroglobulin < 3,5 mg/l UND Albumin ≥ 3,5 g/dl; medianes Überleben 62 Monate"},
        {label:"ISS II",  info:"Weder I noch III; medianes Überleben 44 Monate"},
        {label:"ISS III", info:"β2-Mikroglobulin ≥ 5,5 mg/l; medianes Überleben 29 Monate"},
      ]
    },
    { name:"IMWG CRAB-Kriterien – Symptomatisches Myelom",
      quelle:"Rajkumar SV et al. Lancet Oncol 2014;15(12):e538",
      url:"https://doi.org/10.1016/S1470-2045(14)70442-5",
      stufen:[
        {label:"C – Hyperkalzämie", info:"Serumkalzium > 0,25 mmol/l über ULN ODER > 2,75 mmol/l"},
        {label:"R – Niereninsuffizienz", info:"Kreatinin-Clearance < 40 ml/min ODER Kreatinin > 177 µmol/l"},
        {label:"A – Anämie",        info:"Hb < 100 g/l ODER > 20 g/l unter Untergrenze"},
        {label:"B – Bone lesions",  info:"≥1 osteolytische Läsion (Röntgen, CT, PET-CT)"},
      ]
    },
  ],

  mastozytose: [
    { name:"WHO 2022 – Klassifikation der Mastozytose",
      quelle:"Swerdlow SH et al. WHO Classification of Tumours of Haematopoietic Tissue 2022",
      stufen:[
        {label:"Kutane Mastozytose (CM)",       info:"Nur Hautbeteiligung; Urticaria pigmentosa häufigste Form"},
        {label:"Indolente SM (ISM)",             info:"Systemische Beteiligung, keine Organschäden; Tryptase oft > 20 ng/ml"},
        {label:"Smouldering SM (SSM)",           info:"Hohes Knochenmarksbefalls (≥ 30%), aber keine Organdysfunktion"},
        {label:"Aggressive SM (ASM)",            info:"Organdysfunktion (Zytopenie, Malabsorption, Leberdysfunktion)"},
        {label:"SM-AHN",                         info:"SM + assoziierte hämatologische Neoplasie"},
        {label:"Mastzellleukämie (MCL)",         info:"Mastzellen > 20% im Blutausstrich; sehr selten, sehr aggressiv"},
      ]
    },
  ],

  haemochromatose: [
    { name:"EASL 2022 – Hereditäre Hämochromatose Stadieneinteilung",
      quelle:"EASL Clinical Practice Guidelines – Haemochromatosis 2022. J Hepatol 2022;77(2):479",
      url:"https://doi.org/10.1016/j.jhep.2022.03.033",
      url:"https://doi.org/10.1016/j.jhep.2022.03.033",
      stufen:[
        {label:"Stadium 0", info:"Genetisch positiv (HFE C282Y homozygot), Transferrinsättigung und Ferritin normal"},
        {label:"Stadium 1", info:"Transferrinsättigung > 45% (♂) / > 40% (♀), Ferritin normal – Eisenüberladung ohne Schaden"},
        {label:"Stadium 2", info:"Ferritin ↑ (> 300 µg/l ♂ / > 200 µg/l ♀), keine Organkomplikationen"},
        {label:"Stadium 3", info:"Leberfibrose und/oder Arthropathie, Diabetes, Kardiomyopathie möglich"},
        {label:"Stadium 4", info:"Leberzirrhose – irreversibel; erhöhtes HCC-Risiko; Osteoporose durch Hypogonadismus/Lebererkrankung"},
      ]
    },
  ],

  sarkoidose: [
    { name:"Scadding 1961 – Radiologisches Staging (Thorax-Röntgen)",
      quelle:"Scadding JG. Br Med J 1961;2(5261):1165",
      url:"https://pubmed.ncbi.nlm.nih.gov/13900713",
      stufen:[
        {label:"Stadium 0",  info:"Keine intrathorakalen Veränderungen"},
        {label:"Stadium I",  info:"Bihiläre Lymphadenopathie ohne Lungenparenchymbefall"},
        {label:"Stadium II", info:"Bihiläre LAP + Lungenparenchymveränderungen"},
        {label:"Stadium III",info:"Lungenparenchymveränderungen ohne LAP"},
        {label:"Stadium IV", info:"Pulmonale Fibrose – irreversibel; Cor pulmonale möglich"},
      ]
    },
  ],

  psa: [
    { name:"CASPAR-Kriterien – Psoriasis-Arthritis-Diagnose 2006",
      quelle:"Taylor W et al. Arthritis Rheum 2006;54(8):2665",
      url:"https://doi.org/10.1002/art.22174",
      stufen:[
        {label:"Diagnose bestätigt (≥ 3 Punkte)", info:"Entzündliche Gelenkerkrankung + ≥3 Punkte aus: Psoriasis (aktuell=2/anamnestisch=1/familiär=1), Nagelveränderungen (1), neg. RF (1), Daktylitis (1), juxta-artikuläre Knochenneubildung (1)"},
        {label:"DAS28 Remission",    info:"DAS28 < 2,6 (kein aktives Gelenk)"},
        {label:"Niedrige Aktivität", info:"DAS28 2,6–3,2"},
        {label:"Mittlere Aktivität", info:"DAS28 3,2–5,1"},
        {label:"Hohe Aktivität",     info:"DAS28 > 5,1 – stark erhöhtes Osteoporoserisiko durch Inflammation"},
      ]
    },
  ],

  vaskulitis: [
    { name:"Birmingham Vasculitis Activity Score (BVAS) v3 – Aktivität",
      quelle:"Mukhtyar C et al. Ann Rheum Dis 2009;68(12):1827",
      url:"https://doi.org/10.1136/ard.2011.150235",
      stufen:[
        {label:"Remission",          info:"BVAS = 0; keine aktiven Vaskulitis-Manifestationen"},
        {label:"Geringe Aktivität",  info:"BVAS 1–5; wenige Organbeteiligungen"},
        {label:"Moderate Aktivität", info:"BVAS 6–15; mehrere Organe betroffen"},
        {label:"Schwere Aktivität",  info:"BVAS > 15; lebensbedrohliche Organbeteiligung (Nieren, ZNS, Lunge)"},
      ],
      note:"BVAS: 9 Organsysteme, 56 Items; max. 63 Punkte"
    },
  ],

  hiv_ost: [
    { name:"WHO HIV-Klinisches Staging – Immunsuppression",
      quelle:"WHO Clinical Staging of HIV Disease 2006",
      url:"https://www.who.int/publications/i/item/WHO-HIV-2006.2",
      stufen:[
        {label:"Stadium 1", info:"Asymptomatisch oder persistierende generalisierte Lymphadenopathie"},
        {label:"Stadium 2", info:"Milde Symptome (Gewichtsverlust < 10%, Herpes zoster, Mundpilz etc.)"},
        {label:"Stadium 3", info:"Fortgeschrittene Erkrankung: Gewichtsverlust > 10%, chronische Diarrhoe, rezid. Infektionen"},
        {label:"Stadium 4 (AIDS)",info:"Schwere Immunsuppression, AIDS-definierende Erkrankungen (CD4 < 200/µl)"},
      ]
    },
  ],

  immo_neuro: [
    { name:"Immobilisationsgrad – klinische Einstufung",
      quelle:"Kortebein P et al. JAMA 2007;297(16):1772 / Frostick SP. Bone Jt J 2010",
      url:"https://doi.org/10.1001/jama.297.16.1772",
      stufen:[
        {label:"Bettruhe 1–3 Tage",      info:"Gering; schnell reversibel; BMD-Verlust < 1%"},
        {label:"Bettruhe 1–4 Wochen",    info:"Mäßig; ca. 1–2% BMD-Verlust/Woche im trabekulären Knochen"},
        {label:"Bettruhe > 4 Wochen",    info:"Erheblich; bis 40% BMD-Verlust p.a. bei Querschnittlähmung; Osteoporoseprophylaxe dringend"},
        {label:"Permanente Immobilisation", info:"Vollständige Denervierung (Querschnitt): Verlust vorwiegend sublesional; Bisphosphonate erwägen"},
      ]
    },
  ],

  essstoerung: [
    { name:"DSM-5 – Schweregrad Anorexia nervosa nach BMI",
      quelle:"American Psychiatric Association. DSM-5 2013",
      stufen:[
        {label:"Leicht   (BMI ≥ 17 kg/m²)",    info:"Deutliche Unterernährung; Knochendichteverlust beginnend"},
        {label:"Mittel   (BMI 16–17 kg/m²)",   info:"Signifikante Einschränkung; DXA dringend empfohlen"},
        {label:"Schwer   (BMI 15–16 kg/m²)",   info:"Erhebliche Unterernährung; irreversibler Knochenverlust wahrscheinlich"},
        {label:"Extrem   (BMI < 15 kg/m²)",    info:"Lebensbedrohlich; schwere Osteoporose; hormonelle Achse supprimiert"},
      ]
    },
  ],

  alkohol_ost: [
    { name:"AUDIT-C – Alkohol-Screening (WHO)",
      quelle:"Bush K et al. Arch Intern Med 1998;158(16):1789",
      url:"https://doi.org/10.1001/archinte.158.16.1789",
      stufen:[
        {label:"Kein Risiko (0–3 ♂ / 0–2 ♀)",  info:"Kein problematischer Konsum"},
        {label:"Riskanter Konsum (4–7)",          info:"Erhöhtes Risiko für alkoholbedingte Probleme; Beratung empfohlen"},
        {label:"Schädlicher Konsum (8–12)",       info:"Deutlich erhöhtes Risiko; Leberschaden möglich; direkte Osteoblastentoxizität"},
        {label:"Wahrscheinliche Abhängigkeit (≥ 13)", info:"Schwerer Alkoholmissbrauch; Osteoporose oft ausgeprägt; Sturz-/Frakturrisiko stark erhöht"},
      ]
    },
  ],

  oi: [
    { name:"Sillence-Klassifikation 1979 (klassisch, klinisch-genetisch)",
      quelle:"Sillence DO et al. J Med Genet 1979;16(2):101",
      url:"https://pubmed.ncbi.nlm.nih.gov/449268",
      stufen:[
        {label:"Typ I (mild)",        info:"Mildeste Form; blaue Skleren; autosomal dominant; Frakturen durch Bagatelltrauma; keine Deformitäten; Schwerhörigkeit möglich"},
        {label:"Typ II (letal)",      info:"Perinatal letal; schwerste Knochenverformungen; meist de-novo-Mutation in COL1A1/COL1A2"},
        {label:"Typ III (schwer)",    info:"Progrediente Knochendeformität; schwerste überlebende Form; Kleinwuchs; Rollierpflichtigkeit möglich"},
        {label:"Typ IV (mäßig)",     info:"Moderate Schwere; variabler Phänotyp; weiße/blaugraue Skleren; Dentinogenesis imperfecta möglich"},
        {label:"Typ V (Glorieux)",   info:"Hyperplastische Kallusse, Verkalkung Membrana interossea; IFITM5-Mutation – keine Kollagen-I-Mutation"},
      ]
    },
  ],

  xlh: [
    { name:"XLH-Klinischer Schweregrad – Erwachsene",
      quelle:"Linglart A et al. Endocrine 2014;47(2):333 / Ruppe MD. GeneReviews 2023",
      url:"https://doi.org/10.1007/s12020-014-0382-0",
      stufen:[
        {label:"Laborchemisch (nur Phosphat ↓)",  info:"Hypophosphatämie ohne klinische Manifestation"},
        {label:"Mäßig",                            info:"Enthesiopathien, Zahnabszesse, diffuse Knochen-/Gelenkschmerzen; GdB 30–50% möglich"},
        {label:"Schwer",                           info:"Pseudofrakturen (Looser-Umbauzonen), Osteomalazie, Muskelschwäche, GdB > 50%"},
      ]
    },
  ],

  hpp: [
    { name:"HPP – Klinische Formen nach Manifestationsalter (Whyte 2016)",
      quelle:"Whyte MP. Calcif Tissue Int 2016;98(4):329",
      url:"https://doi.org/10.1007/s00223-015-9909-7",
      stufen:[
        {label:"Perinatal-letal",     info:"Schwerste Form; Hydrops, Atemsuffizienz, kaum ossifiziertes Skelett bei Geburt"},
        {label:"Prenatal benigne",    info:"In utero Rachitis-Zeichen, postnatal Spontanremission möglich"},
        {label:"Infantil (< 6 Mo.)", info:"Frühzeitiger Fontanellenverschluss, Rachitis, respiratorisch kompromittiert; hohe Mortalität ohne Therapie"},
        {label:"Kindheit",            info:"Milchzahnverlust < 5 Jahre mit Wurzel; Rachitis, Skelettschmerzen"},
        {label:"Adulte Form",         info:"Metatarsalstressfrakturen, chronische Schmerzen, Chondrokalzinose; AP dauerhaft erniedrigt"},
        {label:"Odonto-HPP",         info:"Nur Zahnmanifestation (Hypozementose, frühzeitiger Zahnverlust)"},
      ]
    },
  ],

  tio: [
    { name:"TIO – Biochemische Diagnosekriterien",
      quelle:"Jan de Beur SM et al. JBMR Plus 2021;5(8):e10475",
      url:"https://doi.org/10.1002/jbm4.10475",
      stufen:[
        {label:"FGF-23 erhöht",       info:"Intaktes FGF-23 > 100 pg/ml (altersabhängig); bei TIO oft massiv erhöht (500–10.000 pg/ml)"},
        {label:"Phosphat erniedrigt", info:"Serum-Phosphat < 0,6–0,8 mmol/l nüchtern; TmP/GFR erniedrigt"},
        {label:"Vitamin-D-Aktivierung gestört", info:"1,25-OH2-D3 ↓ trotz normalem 25-OH-D3 – pathognomisch für FGF-23-Exzess"},
        {label:"Tumorsuche",          info:"DOTATATE-PET/CT oder 68Ga-DOTATOC als sensitivste Methode; konventionelle Bildgebung insuffizient"},
      ]
    },
  ],

  paget: [
    { name:"Paget-Aktivitätsmarker – Biochemische Einteilung",
      quelle:"Singer FR et al. J Bone Miner Res 2014;29(12):2536 (Endocrine Society Guideline)",
      url:"https://doi.org/10.1002/jbmr.2500",
      url:"https://doi.org/10.1002/jbmr.2500",
      stufen:[
        {label:"Inaktiv",              info:"Knochenspezifische AP (BSAP) + P1NP im Normbereich; asymptomatisch"},
        {label:"Leicht aktiv",         info:"BSAP oder Gesamt-AP leicht erhöht (< 2× ULN); wenig befallene Knochen"},
        {label:"Mäßig aktiv",         info:"AP 2–5× ULN; mehrere Skelettregionen befallen"},
        {label:"Stark aktiv",          info:"AP > 5× ULN; ausgedehnter Befall; Fraktur- und Kompressionsrisiko hoch"},
      ]
    },
  ],

  marfan: [
    { name:"Ghent-Nosologie 2010 – Revised Ghent Criteria",
      quelle:"Loeys BL et al. J Med Genet 2010;47(7):476",
      url:"https://doi.org/10.1136/jmg.2009.072785",
      stufen:[
        {label:"Diagnose (ohne Familienanamnese)",    info:"Aortenwurzelerweiterung Z-Score ≥ 2 + Ektopia lentis ODER Aortenwurzelerweiterung Z-Score ≥ 2 + FBN1-Mutation ODER Aortenwurzelerweiterung Z-Score ≥ 2 + Systemscore ≥ 7"},
        {label:"Diagnose (mit pos. Familienanamnese)", info:"Familienanamnese MFS + Ektopia lentis ODER Familienanamnese + Systemscore ≥ 7 ODER Familienanamnese + Aortenwurzelerweiterung Z-Score ≥ 2 (< 20 J.) / Z-Score ≥ 3 (≥ 20 J.)"},
        {label:"Systemscore-Elemente",                 info:"Daumen-/Handgelenkszeichen, Pectus, Fußgewölbe, Pneumothorax, Durektasie, Protrusio acetabuli, Augenlinse, Gesichtsmerkmale"},
      ]
    },
  ],

  eds: [
    { name:"Beighton-Score – Hypermobilitätsbeurteilung",
      quelle:"Beighton P et al. Ann Rheum Dis 1973;32(5):413",
      url:"https://pubmed.ncbi.nlm.nih.gov/4613763",
      stufen:[
        {label:"Positiv (≥ 6/9 Kinder, ≥ 5/9 Frauen, ≥ 4/9 Männer)", info:"Klinisch signifikante Hypermobilität"},
        {label:"Grenzwertig",                                             info:"3–5 Punkte – leichte Hypermobilität, individuelle Abklärung"},
        {label:"Normal (0–2)",                                            info:"Keine klinisch relevante Hypermobilität"},
      ],
      note:"5 Tests (2× Kleinfinger, 2× Daumen, 2× Ellbogen, 2× Knie, 1× Rumpf), Gesamtpunkte 0–9"
    },
    { name:"EDS-Typen-Klassifikation (ICOGS 2017)",
      quelle:"Malfait F et al. Am J Med Genet C 2017;175(1):8",
      url:"https://doi.org/10.1002/ajmg.c.31552",
      stufen:[
        {label:"Hypermobiles EDS (hEDS)", info:"Häufigste Form; kein bekanntes Gendefekt; Diagnose klinisch-kriteriologisch; niedrigere BMD"},
        {label:"Klassisches EDS",         info:"COL5A1/COL5A2; Haut überdehnbar + schlechte Wundheilung; Papyrusnarbigkeit"},
        {label:"Vaskuläres EDS",          info:"COL3A1; Arteriendissektion/-ruptur; lebensbedrohlich; BMD erniedrigt"},
      ]
    },
  ],

  gaucher: [
    { name:"Zimran Severity Score Index (SSI) – Morbus Gaucher",
      quelle:"Zimran A et al. Blood 1992;79(9):2229",
      url:"https://pubmed.ncbi.nlm.nih.gov/1571538",
      stufen:[
        {label:"Leicht (SSI < 9)",     info:"Keine oder minimale Organmanifestation"},
        {label:"Mäßig (SSI 9–18)",    info:"Hepatosplenomegalie, Anämie, geringe Knochenbeteiligung"},
        {label:"Schwer (SSI 19–30)",   info:"Schwere Organbeteiligung, Knochennekrosen, Wachstumsstörung"},
      ],
      note:"SSI: Milz, Leber, Blutbild, Knochen, Neurologie bewertet; Gesamt 0–30"
    },
  ],

  turner: [
    { name:"Turner-Syndrom – Karyotyp-Varianten und klinische Relevanz",
      quelle:"Gravholt CH et al. Nat Rev Dis Primers 2019;5(1):41",
      url:"https://doi.org/10.1038/s41572-019-0088-8",
      stufen:[
        {label:"45,X (klassisch)",             info:"Häufigstes Muster (50%); schwerer primärer Hypogonadismus; ausgeprägteste Osteoporose"},
        {label:"Mosaik 45,X/46,XX",            info:"Variablerer Phänotyp; partielle Ovarfunktion möglich; Knochendichte besser als 45,X"},
        {label:"46,X,i(Xq)",                   info:"Isochromosom; ähnlich scherer Phänotyp wie 45,X"},
        {label:"46,XY-Mosaik",                 info:"Gonaden-Dysgenesie; erhöhtes Gonadoblastomrisiko; Gonadektomie empfohlen"},
      ]
    },
  ],

  klinefelter: [
    { name:"Klinefelter-Syndrom – Karyotyp und endokrine Relevanz",
      quelle:"Gravholt CH et al. Nat Rev Endocrinol 2018;14(8):475",
      url:"https://doi.org/10.1038/s41574-018-0010-y",
      stufen:[
        {label:"47,XXY (klassisch, 80%)",       info:"Primärer Hypogonadismus; Testosteron ↓, LH/FSH ↑; Osteoporoserisiko moderat bis hoch"},
        {label:"Polysomie (48,XXXY / 49,XXXXY)", info:"Schwererer Phänotyp; ausgeprägtere kognitive Defizite; Osteoporoserisiko höher"},
        {label:"Mosaik 46,XY/47,XXY",           info:"Mildererer Phänotyp; partielle Hodenfunktion möglich; Fertilität eingeschränkt"},
      ]
    },
  ],

  seltene_metabolisch: [
    { name:"Überblick seltene Stoffwechselerkrankungen mit Knochenbeteiligung",
      quelle:"Kliegman RM (eds). Nelson Textbook of Pediatrics 2020 / Orpha.net",
      stufen:[
        {label:"Pompe (M. Pompe / GSDII)",    info:"Glykogen-Abbaudefekt; progrediente Myopathie; Knochendichte ↓ durch Immobilität"},
        {label:"Mukopolysaccharidosen (MPS)", info:"Lysosomale Ablagerungen; Skelettdysplasie, Gelenksteife, Knochennekrosen"},
        {label:"Mitochondriale Myopathien",   info:"Variable Knochenmanifestationen; MELAS, MERRF, Leigh-Syndrom"},
        {label:"Homozystinurie",              info:"CBS-Defekt; Osteoporose + Gefäßkomplikationen + Marfan-ähnlicher Habitus"},
      ]
    },
  ],

};

// ── SEK_SCORES storage ────────────────────────────────────────────────
const SEK_SCORES_KEY = "osteo_sekscores_overrides_v1";
function loadSekScores(){ return loadSekDb(SEK_SCORES_KEY, ()=>JSON.parse(JSON.stringify(SEK_SCORES_DEFAULTS))); }
function saveSekScores(db){ saveSekDb(SEK_SCORES_KEY, db, ()=>JSON.parse(JSON.stringify(SEK_SCORES_DEFAULTS))); }

const SEK_DIAG_DB_KEY = "osteo_sekdb_overrides_v1";
const SEK_PROFILE_KEY  = "osteo_sekprofile_overrides_v1";
const SEK_UNTERS_KEY   = "osteo_sekunters_overrides_v1";
const SEK_QS_KEY       = "osteo_sekqs_overrides_v1";

/* ─── SCORING / STADIENEINTEILUNG für Sekundäre Osteoporose ─────────────── */
// Struktur: { [sym]: { titel, quelle, url, stufen:[{name, beschreibung}] } }
const SEK_SCORING_DEFAULTS = {
  // ── HORMONELL ──────────────────────────────────────────────────────────────
  hpth: {
    titel: "Grenzwerte pHPT-Diagnose (AWMF / Endocrine Society)",
    quelle: "Bilezikian JP et al. J Bone Miner Res 2022; AWMF S2k-Leitlinie",
    url: "https://doi.org/10.1002/jbmr.4677",
    stufen: [
      {name: "Serumkalzium (Gesamt)",  beschreibung: "Normal: 2,15–2,55 mmol/l | Hyperkalzämie: >2,55 mmol/l (Wiederholung nüchtern)"},
      {name: "PTH intakt",             beschreibung: "Normal: 10–65 pg/ml | pHPT: PTH erhöht bei gleichzeitiger Hyperkalzämie"},
      {name: "Vitamin D (25-OH-D3)",   beschreibung: "Ausreichend: >50 nmol/l (>20 ng/ml) | Mangel: <30 nmol/l (<12 ng/ml)"},
      {name: "24h-Kalzium im Urin",    beschreibung: "Normal: <7,5 mmol/d | FHH-Ausschluss: Kalzium/Kreatinin-Clearance-Ratio >0,01"},
    ]
  },
  cushing: {
    titel: "Stufendiagnostik Cushing-Syndrom (Endocrine Society 2021)",
    quelle: "Lacroix A et al. Lancet Diabetes Endocrinol 2021; Nieman LK JCEM 2008",
    url: "https://doi.org/10.1016/S2213-8587(21)00235-7",
    stufen: [
      {name: "Stufe 1: Screening",     beschreibung: "Mindestens 2 von 3 Tests pathologisch: (1) 1-mg-Dexamethason-Hemmtest: Cortisol nächsten Morgen >50 nmol/l (>1,8 μg/dl); (2) Freies Cortisol im 24h-Urin: >2× obere Norm; (3) Mitternacht-Speichelcortisol: >2× Normwert"},
      {name: "Stufe 2: ACTH",          beschreibung: "ACTH-abhängig (zentral/ektop): ACTH >10 pg/ml | ACTH-unabhängig (adrenal): ACTH <5 pg/ml"},
      {name: "Stufe 3: Differenzierung", beschreibung: "Hochdosierter Dexamethason (8 mg): Morbus Cushing → Suppression >50%; Ektop / Adrenal → keine Suppression | CRH-Test, Sinus-petrosus-Katheter"},
    ]
  },
  hypogonadismus: {
    titel: "Hypogonadismus Mann – Diagnosegrenzen (EAU / EAU-Leitlinie 2024)",
    quelle: "EAU Guidelines on Male Hypogonadism 2024",
    url: "https://uroweb.org/guideline/male-hypogonadism",
    stufen: [
      {name: "Testosteron gesamt",   beschreibung: "Normal: ≥12,1 nmol/l (≥350 ng/dl) | Hypogonadismus-Grenze: <12,1 nmol/l | Eindeutig symptomatisch: <8 nmol/l (<230 ng/dl)"},
      {name: "Freies Testosteron",   beschreibung: "Berechnet über SHBG: Hypogonadismus bei <220 pmol/l"},
      {name: "LH / FSH",             beschreibung: "Primärer Hypogonadismus (Klinefelter): LH/FSH ↑↑ | Sekundär (hypophysär): LH/FSH normal oder ↓"},
    ]
  },
  hypogonadismus_f: {
    titel: "Hypogonadismus Frau / Amenorrhoe (ESHRE/DGGG 2023)",
    quelle: "ESHRE Guideline Amenorrhea 2023",
    url: "https://doi.org/10.1093/humrep/deae003",
    stufen: [
      {name: "Östradiol",     beschreibung: "Prämenopausal normal: 100–400 pmol/l | Hypogonadismus: <100 pmol/l | Postmenopause: <80 pmol/l"},
      {name: "FSH/LH",        beschreibung: "Primäre Ovarialinsuffizienz (POI): FSH >25 IU/l (2× im Abstand von 4 Wo.) | Hypothalamisch: FSH/LH niedrig-normal"},
      {name: "Prolaktin",     beschreibung: "Normal: <530 mIU/l (<25 ng/ml) | Makroprolaktinom: oft >3000 mIU/l | Prolaktinom-Schwelle für MRT: >1000 mIU/l"},
    ]
  },
  hyperthyreose: {
    titel: "TSH-basierte Klassifikation Hyperthyreose (ETA / AWMF 2023)",
    quelle: "ETA Guidelines 2023; DGIM/AWMF S2k Schilddrüse",
    url: "https://doi.org/10.1089/thy.2016.0397",
    stufen: [
      {name: "Subklinische Hyperthyreose", beschreibung: "TSH <0,4 mIU/l bei normalem fT3 + fT4 | Grad 1: TSH 0,1–0,4 mIU/l | Grad 2: TSH <0,1 mIU/l – erhöhtes Osteoporoserisiko!"},
      {name: "Manifeste Hyperthyreose",    beschreibung: "TSH <0,1 mIU/l + fT4 >22 pmol/l oder fT3 >6,8 pmol/l"},
      {name: "Schilddrüsenhormon-Substitution", beschreibung: "Supprimiertes TSH <0,4 mIU/l unter L-Thyroxin: erhöhtes Frakturrisiko; Ziel-TSH postmenopausal: 0,5–2,0 mIU/l"},
    ]
  },
  akromegalie: {
    titel: "Akromegalie-Diagnose (Endocrine Society 2014, revidiert 2020)",
    quelle: "Katznelson L et al. JCEM 2014; Fleseriu M et al. JCEM 2020",
    url: "https://doi.org/10.1210/jc.2014-2700",
    stufen: [
      {name: "IGF-1",                    beschreibung: "Diagnose bei alters- und geschlechtsnormiertem IGF-1 >2 SD über Normalwert"},
      {name: "GH-Nadir (oGTT)",          beschreibung: "Goldstandard: 75g oGTT – GH-Nadir >0,4 ng/ml (moderner Assay) bestätigt Akromegalie | Normal: GH-Nadir <0,4 ng/ml"},
      {name: "Remissionskriterien",       beschreibung: "Remission: IGF-1 normal + GH-Nadir <0,4 ng/ml nach Therapie"},
    ]
  },
  prolaktinom: {
    titel: "Prolaktinom-Diagnose (EES / Endocrine Society 2011)",
    quelle: "Melmed S et al. JCEM 2011; EES Clinical Practice Guideline",
    url: "https://doi.org/10.1210/jc.2010-1692",
    stufen: [
      {name: "Prolaktin-Grenzwerte",  beschreibung: "Normal: <530 mIU/l (♀) / <400 mIU/l (♂) | Mikroprolaktinom: 500–4000 mIU/l | Makroprolaktinom: oft >4000 mIU/l | Wert >6000 mIU/l → Mikroprolaktinom sehr unwahrscheinlich"},
      {name: "Hook-Effekt",            beschreibung: "Bei sehr großen Tumoren kann Prolaktin falsch-niedrig gemessen werden → 1:100-Verdünnung bei Makroadenom"},
      {name: "MRT-Grenzwerte",         beschreibung: "Mikroprolaktinom: <10 mm | Makroprolaktinom: ≥10 mm"},
    ]
  },

  // ── GASTRO / ABSORPTION ────────────────────────────────────────────────────
  zoeliakie: {
    titel: "Marsh-Oberhuber-Klassifikation (mod. 2001) · DGVS S2k 2022",
    quelle: "DGVS S2k-Leitlinie Zöliakie 2022; Oberhuber et al. Virchows Arch 1999",
    url: "https://www.awmf.org/leitlinien",
    stufen: [
      {name: "Marsh 0",   beschreibung: "Normal: <25 IEL/100 Enterozyten, Zotten normal → kein Hinweis auf Zöliakie"},
      {name: "Marsh 1",   beschreibung: "Infiltrativ: ≥25 IEL/100 Enterozyten, Zotten normal → unspezifisch, viele Differentialdiagnosen (PPV für Zöliakie nur 15%)"},
      {name: "Marsh 2",   beschreibung: "Hyperplastisch: ≥25 IEL + Kryptenhyperplasie, Zotten normal → selten; Übergang zu Marsh 3"},
      {name: "Marsh 3a",  beschreibung: "Destruktiv partiell: ≥25 IEL + Kryptenhyperplasie + partielle Zottenatrophie → typisch aktive Zöliakie"},
      {name: "Marsh 3b",  beschreibung: "Destruktiv subtotal: subtotale Zottenatrophie → klassische Zöliakie"},
      {name: "Marsh 3c",  beschreibung: "Destruktiv total: totale Zottenatrophie (Flat mucosa) → schwere Zöliakie; Komplikationsrisiko ↑"},
    ]
  },
  ced: {
    titel: "Aktivitätsscores CED: Harvey-Bradshaw (Crohn) / Mayo-Score (CU)",
    quelle: "Harvey RF, Bradshaw JM. Lancet 1980; Schroeder KW et al. NEJM 1987",
    url: "https://www.ecco-ibd.eu",
    stufen: [
      {name: "Harvey-Bradshaw-Index (Morbus Crohn)", beschreibung: "Remission: ≤4 | Leicht aktiv: 5–7 | Mäßig aktiv: 8–16 | Schwer aktiv: ≥17 | Parameter: Wohlbefinden, Bauchschmerz, Stuhlfrequenz, Bauchbefund, Komplikationen"},
      {name: "Mayo-Score (Colitis ulcerosa)",         beschreibung: "Remission: 0–2 | Leicht aktiv: 3–5 | Mäßig aktiv: 6–10 | Schwer aktiv: 11–12 | Parameter: Stuhlfrequenz, rektale Blutung, Endoskopie-Befund, Arzturteil"},
    ]
  },
  vit_d: {
    titel: "Vitamin-D-Status-Klassifikation (DVO 2023 / DACH-Liga 2012)",
    quelle: "DVO-Leitlinie Osteoporose 2023; DACH-Liga Vitamin D 2012",
    url: "https://dvo-osteologie.de",
    stufen: [
      {name: "Schwerer Mangel / Osteomalazie",  beschreibung: "25-OH-D3 <30 nmol/l (<12 ng/ml): Risiko für Osteomalazie; PTH sekundär erhöht"},
      {name: "Mangel",                          beschreibung: "25-OH-D3 30–50 nmol/l (12–20 ng/ml): erhöhtes Osteoporoserisiko, erhöhtes PTH"},
      {name: "Insuffizienz",                    beschreibung: "25-OH-D3 50–75 nmol/l (20–30 ng/ml): suboptimaler Status"},
      {name: "Ausreichend",                     beschreibung: "25-OH-D3 >75 nmol/l (>30 ng/ml): optimal für Knochen und Muskel"},
    ]
  },
  malabsorption: {
    titel: "Steatorrhoe-Klassifikation (klinisch)",
    quelle: "Siegmund B, Zeitz M. Innere Medizin 2012; Gastroenterologie-Leitlinien",
    url: "https://www.awmf.org",
    stufen: [
      {name: "Leichte Malabsorption",   beschreibung: "Fettstuhl: 7–15 g/d (Normal: <7 g/d); geringe Gewichtsabnahme"},
      {name: "Mäßige Malabsorption",    beschreibung: "Fettstuhl: 15–30 g/d; BMI-Abfall, Mikronährstoffmängel"},
      {name: "Schwere Malabsorption",   beschreibung: "Fettstuhl: >30 g/d; Kachexie, multiple Mangelzustände (Vit. A, D, E, K, Ca, Mg, Zn)"},
    ]
  },
  lebererkrankung: {
    titel: "Child-Pugh-Score + MELD-Score (Leberzirrhose)",
    quelle: "Child CG, Turcotte JG 1964; Malinchoc M et al. Hepatology 2000",
    url: "https://www.easl.eu",
    stufen: [
      {name: "Child-Pugh A (5–6 Punkte)",  beschreibung: "Gut kompensiert; 1-JÜR: ~100% | Parameter: Bilirubin, Albumin, Quick/INR, Aszites, Enzephalopathie"},
      {name: "Child-Pugh B (7–9 Punkte)",  beschreibung: "Mäßig kompensiert; 1-JÜR: ~80%"},
      {name: "Child-Pugh C (10–15 Punkte)", beschreibung: "Dekompensiert; 1-JÜR: ~45%; Transplantationsindikation prüfen"},
      {name: "MELD-Score",                  beschreibung: "Formel: 9,6 × ln(Kreatinin) + 3,78 × ln(Bilirubin) + 11,2 × ln(INR) + 6,4 | MELD >20: erhöhte 3-Monats-Mortalität; MELD >25: Transplantationslistung empfohlen"},
    ]
  },

  // ── NIEREN ────────────────────────────────────────────────────────────────
  nieren: {
    titel: "KDIGO 2024 CKD-Klassifikation (CGA-System)",
    quelle: "KDIGO CKD Guideline 2024 (Kidney International Vol. 105, Suppl. 4)",
    url: "https://kdigo.org/guidelines/ckd-evaluation-and-management/",
    stufen: [
      {name: "G1: GFR ≥90 ml/min",   beschreibung: "Normal/hoch – nur mit Nierenschaden (Proteinurie, Hämaturie, Bildgebung) diagnostizierbar"},
      {name: "G2: GFR 60–89",         beschreibung: "Leicht erniedrigt – nur mit Nierenschaden diagnostizierbar"},
      {name: "G3a: GFR 45–59",        beschreibung: "Leicht bis mäßig erniedrigt – Vitamin-D-Aktivierung beginnt zu sinken"},
      {name: "G3b: GFR 30–44",        beschreibung: "Mäßig bis stark erniedrigt – sek. HPT häufig; Nephrologe einbeziehen"},
      {name: "G4: GFR 15–29",         beschreibung: "Stark erniedrigt – Dialyseplanung; CKD-MBD ausgeprägt"},
      {name: "G5: GFR <15 ml/min",    beschreibung: "Nierenversagen – Nierenersatztherapie oder Transplantation"},
      {name: "Albuminurie A1–A3",      beschreibung: "A1: <30 mg/g (normal–mild) | A2: 30–300 mg/g (mäßig erhöht) | A3: >300 mg/g (stark erhöht) → zusätzlicher Risikomarker"},
    ]
  },
  rta_bartter: {
    titel: "Klassifikation renaler tubulärer Azidosen (RTA Typ 1–4)",
    quelle: "Rodriguez Soriano J. Pediatr Nephrol 2002",
    url: "https://pubmed.ncbi.nlm.nih.gov/11505303",
    stufen: [
      {name: "RTA Typ 1 (distal)",    beschreibung: "Unfähigkeit, Urin anzusäuern (pH >5,5); Hypokaliämie; Nephrolithiasis; stärkster Knocheneffekt"},
      {name: "RTA Typ 2 (proximal)",  beschreibung: "Bikarbonatverlust im Urin; Hypokaliämie; Fanconi-Syndrom möglich; Rachitis/Osteomalazie"},
      {name: "RTA Typ 4",             beschreibung: "Hyperkaliämie; Aldosteronmangel oder -resistenz; Diabetes häufigste Ursache"},
      {name: "Bartter/Gitelman",      beschreibung: "Bartter: Hypokaliämie, Hyperaldosteronismus, normaler Blutdruck | Gitelman: Hypokaliämie + Hypomagnesiämie; Knochen- und Muskelbeteiligung"},
    ]
  },
  hypercalciurie: {
    titel: "Grenzwerte Hyperkalziurie",
    quelle: "KDIGO; Pak CY. Kidney Int 1998",
    url: "https://kdigo.org",
    stufen: [
      {name: "Kalzium im 24h-Urin",   beschreibung: "Hyperkalziurie: >7,5 mmol/d (♂) | >6,25 mmol/d (♀) | Entspricht: >300 mg/d (♂) / >250 mg/d (♀)"},
      {name: "Typ 1 (absortiv)",       beschreibung: "Erhöhte intestinale Ca-Absorption; Serum-Ca normal; häufigster Typ (~50%)"},
      {name: "Typ 2 (renaler Leak)",   beschreibung: "Primär renaler Kalziumverlust; sekundär ↑ PTH; Nierensteine + Osteoporose"},
    ]
  },

  // ── HÄMATOLOGIE ───────────────────────────────────────────────────────────
  myelom: {
    titel: "R-ISS / R2-ISS Staging Multiples Myelom (IMWG 2015/2022)",
    quelle: "Palumbo A et al. JCO 2015; D'Agostino M et al. JCO 2022",
    url: "https://doi.org/10.1200/JCO.21.02614",
    stufen: [
      {name: "ISS I",    beschreibung: "β2-Mikroglobulin <3,5 mg/l + Albumin ≥35 g/l"},
      {name: "ISS II",   beschreibung: "Weder I noch III"},
      {name: "ISS III",  beschreibung: "β2-Mikroglobulin ≥5,5 mg/l"},
      {name: "R-ISS I",  beschreibung: "ISS I + Standardrisiko-Zytogenetik + LDH normal → medianes OS: 8–10 Jahre"},
      {name: "R-ISS II", beschreibung: "Weder R-ISS I noch III → medianes OS: 5–7 Jahre"},
      {name: "R-ISS III", beschreibung: "ISS III + Hochrisikozyto [t(4;14), t(14;16), del(17p)] ODER erhöhte LDH → medianes OS: 3–5 Jahre"},
      {name: "R2-ISS (2022)", beschreibung: "Additivsystem: ISS II (+1 Pt), ISS III (+1,5 Pt), del(17p) (+1 Pt), LDH↑ (+1 Pt), t(4;14) (+1 Pt), +1q21 (+0,5 Pt) → 4 Risikoklassen I–IV"},
    ]
  },
  mastozytose: {
    titel: "WHO 2022 Klassifikation Mastozytose",
    quelle: "WHO Classification of Haematolymphoid Tumours 2022 (Blue Book 5th ed.)",
    url: "https://www.who.int",
    stufen: [
      {name: "Kutane Mastozytose (CM)",             beschreibung: "Nur Haut betroffen; Urticaria pigmentosa, diffuse CM, Mastozytom"},
      {name: "Indolente systemische Mastozytose (ISM)", beschreibung: "Häufigste Form; Osteoporose/Osteopenie häufig; normale Lebenserwartung; Tryptase meist 20–100 ng/ml"},
      {name: "Aggressive systemische Mastozytose (ASM)", beschreibung: "Organfunktionsstörungen (Knochenmark, Leber, GI); Tryptase meist >100 ng/ml"},
      {name: "Systemische Mastozytose mit hämatol. Neoplasie (SM-AHN)", beschreibung: "SM + assoziierte hämatologische Neoplasie (z.B. AML, MDS)"},
      {name: "Mastzellleukämie (MCL)",              beschreibung: "Seltenste Form; >20% Mastzellen im KM-Ausstrich; schlechteste Prognose"},
      {name: "Diagnosekriterien ISM",               beschreibung: "1 Hauptkriterium + 1 Nebenkriterium ODER 3 Nebenkriterien | Hauptkrit.: multifokale Mastzellinfiltrate im KM ≥15 Zellen | Nebenkriterien: atypische Mastzellmorphologie, cKIT-D816V-Mutation, CD25/CD2-Expression, Tryptase >20 ng/ml"},
    ]
  },
  haemochromatose: {
    titel: "EASL Hämochromatose Staging I–IV (2022)",
    quelle: "EASL Clinical Practice Guideline Haemochromatosis 2022",
    url: "https://doi.org/10.1016/j.jhep.2022.03.033",
    stufen: [
      {name: "Stadium I",    beschreibung: "Genetisch, keine Eisenüberladung: Ferritin normal, TS normal"},
      {name: "Stadium II",   beschreibung: "Eisenüberladung ohne Symptome: Ferritin ↑, Transferrinsättigung >45%; Organschäden noch nicht nachweisbar"},
      {name: "Stadium III",  beschreibung: "Symptome (Müdigkeit, Gelenkschmerzen, Libidoverlust): Ferritin oft 500–1000 µg/l; Beginn der Organschäden"},
      {name: "Stadium IV",   beschreibung: "Schwere Endorganschäden: Leberzirrhose, Herzinsuffizienz, Diabetes, Hypogonadismus, Arthropathie; irreversibel"},
      {name: "Screening",    beschreibung: "Transferrinsättigung >45% (nüchtern, morgens) → HFE-Genotyp prüfen (C282Y/H63D). Ferritin: Grenzwert ♂ 300 µg/l, ♀ 200 µg/l"},
    ]
  },

  // ── IMMUNSYSTEM ───────────────────────────────────────────────────────────
  sarkoidose: {
    titel: "Scadding-Staging (Röntgen-Thorax) · Sarkoidose",
    quelle: "Scadding JG. BMJ 1961; ERS Statement Sarcoidosis 2021",
    url: "https://doi.org/10.1183/13993003.00353-2021",
    stufen: [
      {name: "Stadium 0",  beschreibung: "Normaler Röntgen-Thorax-Befund"},
      {name: "Stadium I",  beschreibung: "Bilaterale hiläre Lymphadenopathie ohne Parenchymveränderungen"},
      {name: "Stadium II", beschreibung: "Bilaterale hiläre Lymphadenopathie + Parenchymveränderungen"},
      {name: "Stadium III", beschreibung: "Parenchymveränderungen ohne hiläre Lymphadenopathie"},
      {name: "Stadium IV",  beschreibung: "Fibrose, Honigwabenlunge; irreversibel"},
    ]
  },
  psa: {
    titel: "CASPAR-Kriterien Psoriasis-Arthritis (2006)",
    quelle: "Taylor W et al. Arthritis Rheum 2006;54:2665",
    url: "https://doi.org/10.1002/art.21972",
    stufen: [
      {name: "CASPAR-Kriterien (≥3 Punkte → PsA)",  beschreibung: "Entzündliche Gelenkerkrankung + ≥3 Punkte aus: (1) aktive Psoriasis (+2P), Psoriasis in Anamnese (+1P), Psoriasis familienanamnestisch (+1P); (2) psoriasistypische Nagelveränderungen (+1P); (3) neg. Rheumafaktor (+1P); (4) aktive Daktylyitis (+1P); (5) juxtaartikuläre Knochenneubildung im Röntgenbild (+1P)"},
    ]
  },
  vaskulitis: {
    titel: "ANCA-Vaskulitis: BVAS-Score + ACR/EULAR 2022-Klassifikation",
    quelle: "Suppiah R et al. ARD 2011 (BVAS); Robson JC et al. ACR 2022",
    url: "https://doi.org/10.1136/ard.2011.150235",
    stufen: [
      {name: "BVAS (Birmingham Vasculitis Activity Score)", beschreibung: "Aktivitätsscore 0–63 | Remission: BVAS=0 | Aktive Erkrankung: BVAS>0 | Schwere Aktivität: BVAS>20"},
      {name: "ACR/EULAR 2022 GPA-Klassifikation",          beschreibung: "≥5 Punkte aus: c-ANCA/Anti-PR3 (+3P), obere Atemwegsbeteiligung (+3P), Lungenbeteiligung (+2P), Granulome in Biopsie (+2P), ENT-Symptome (+1P) minus: p-ANCA/Anti-MPO (-1P)"},
    ]
  },
  hiv_ost: {
    titel: "HIV-Staging (CDC/WHO) + Knochenrisiko-Faktoren",
    quelle: "CDC HIV Classification 2014; Cotter AG et al. Osteoporos Int 2015",
    url: "https://doi.org/10.1007/s00198-015-3109-5",
    stufen: [
      {name: "Tenofovirdiphosphat (TDF)",    beschreibung: "TDF-enthaltende Regime erhöhen Knochenverlust um 2–3% pro Jahr vs. TAF-basierte Alternativen"},
      {name: "DXA-Screening-Empfehlung",    beschreibung: "Alle HIV-Patienten: DXA ab Diagnosestellung wenn >40 J. (♂) / postmenopausal (♀) oder weitere Risikofaktoren"},
      {name: "Vitamin-D-Monitoring",        beschreibung: "Ziel: 25-OH-D3 >50 nmol/l; Mangel sehr häufig (~75%) bei HIV-Patienten"},
    ]
  },

  // ── NEUROLOGIE / LEBENSSTIL ───────────────────────────────────────────────
  immo_neuro: {
    titel: "Immobilisations-Knochenverlust (quantitativ)",
    quelle: "de Roos EW et al. Osteoporos Int 2020; Biering-Sørensen et al.",
    url: "https://doi.org/10.1007/s00198-020-05460-5",
    stufen: [
      {name: "Vollimmobilisation",  beschreibung: "Knochenverlust bis 4% BMD/Monat (Querschnittgelähmte); 1%/Woche Bettruhe"},
      {name: "Teilimmobilisation",  beschreibung: "Knochenverlust ca. 1–2% BMD/Monat; stark abhängig von Restbelastung"},
      {name: "Rehabilitation",      beschreibung: "Remineralisation langsamer als Verlust; oft kein vollständiger Ausgleich"},
    ]
  },
  essstoerung: {
    titel: "Anorexia nervosa – Klassifikation (ICD-11 / DSM-5)",
    quelle: "DSM-5 2013; Arcelus J et al. Arch Gen Psychiatry 2011",
    url: "https://doi.org/10.1001/archgenpsychiatry.2011.74",
    stufen: [
      {name: "BMI-basierte Schwere (DSM-5)",  beschreibung: "Leicht: BMI ≥17 kg/m² | Mäßig: 16–16,99 | Schwer: 15–15,99 | Extrem schwer: <15 kg/m²"},
      {name: "Knochendichte-Verlust",          beschreibung: "BMD-Verlust proportional zu Dauer und Schwere; Z-Score oft <-2 SD; häufig irreversibel"},
      {name: "Endpunkt Amenorrhoe",            beschreibung: "Amenorrhoe ≥6 Monate → hypothalamisch; Östradiol ↓ → rascher Knochenverlust"},
    ]
  },
  alkohol_ost: {
    titel: "AUDIT-Score (Alkohol-Screening) + Knochenschwelle",
    quelle: "Saunders JB et al. WHO 1993 AUDIT; Maurel DB et al. Osteoporos Int 2012",
    url: "https://doi.org/10.1007/s00198-012-1975-0",
    stufen: [
      {name: "AUDIT-Risikozonen",        beschreibung: "Zone I: 0–7 (risikoarm) | Zone II: 8–15 (gefährlicher Konsum) | Zone III: 16–19 (schädlicher Konsum) | Zone IV: 20–40 (Abhängigkeit)"},
      {name: "Knochenwirksame Schwelle", beschreibung: "Ab >30 g Alkohol/d (♂) / >20 g/d (♀): signifikant erhöhter Knochenverlust | 1 Standardglas ≈ 10–15 g Alkohol (DE)"},
    ]
  },

  // ── GENETISCH / SELTEN ────────────────────────────────────────────────────
  oi: {
    titel: "Sillence-Klassifikation OI (erweitert, klinisch; mod. 2014)",
    quelle: "Van Dijk FS, Sillence DO. Am J Med Genet 2014;164:1470",
    url: "https://doi.org/10.1002/ajmg.a.36545",
    stufen: [
      {name: "Typ I (mild)",    beschreibung: "Häufigste Form (~50%); keine Knochendeformitäten; blaue Skleren; Hörverlust möglich; Frakturen selten; Diagnose oft erst im Erwachsenenalter"},
      {name: "Typ II (letal)",  beschreibung: "Perinatale Letalität; multiple Rippenfrakturen bei Geburt; dunkle Skleren"},
      {name: "Typ III (schwer)", beschreibung: "Progressiver Kleinwuchs, schwere Kyphoskoliose, Beindeformitäten; intensive Bisphosphonat-Therapie"},
      {name: "Typ IV (mäßig)",  beschreibung: "Variable Schwere; weiße/graue Skleren; Frakturen vor Pubertät häufig"},
      {name: "Typ V (mäßig-mild)", beschreibung: "Hyperplastischer Kallus; Kalzifizierung der Interosseusmembran; kein COL1A1/2-Defekt (IFITM5)"},
      {name: "Typ VI (selten)", beschreibung: "Fischgrätenmuster in Knochenhistologie; SERPINF1-Mutation; normal Skleren"},
    ]
  },
  xlh: {
    titel: "XLH-Diagnoseparameter (Phosphat-Stoffwechsel)",
    quelle: "Haffner D et al. Nat Rev Nephrol 2019; EAR-Konsensus 2019",
    url: "https://doi.org/10.1038/s41581-019-0152-5",
    stufen: [
      {name: "Serumphosphat nüchtern",    beschreibung: "Grenzwerte altersnormiert; XLH: meist 0,5–0,8 mmol/l (Normal Erwachsene: 0,87–1,45 mmol/l)"},
      {name: "TmP/GFR (tubuläre Max.)",   beschreibung: "Phosphatrückresorption: Kinder <1,15, Erwachsene <0,8 mmol/l = pathologisch (renaler Phosphatverlust)"},
      {name: "FGF-23 intakt",             beschreibung: "FGF-23 bei XLH deutlich erhöht; >100 RU/ml (Referenzlabor) unterstützt Diagnose"},
      {name: "1,25(OH)2-Vitamin D",        beschreibung: "Bei XLH paradox normal oder niedrig trotz Hypophosphatämie (FGF-23 hemmt 1α-Hydroxylase)"},
    ]
  },
  hpp: {
    titel: "Hypophosphatasia (HPP) – Whyte-Klassifikation nach Manifestationsalter",
    quelle: "Whyte MP. Endocr Rev 1994; Rockman-Greenberg C. Pediatr Endocrinol 2013",
    url: "https://doi.org/10.1210/er.1994-15-4-439",
    stufen: [
      {name: "Perinatal letal",   beschreibung: "Schwerste Form; hypomineralisierte Knochen intrauterin; Atemversagen; oft tödlich"},
      {name: "Perinatal benigne", beschreibung: "Spontane Remission nach Geburt (selten)"},
      {name: "Infantil",          beschreibung: "Manifestation <6 Monate; Hypo-/Aplasie der Schädelknochen; hohe Letalität unbehandelt"},
      {name: "Kindlich",          beschreibung: "Vorzeitiger Milchzahnverlust (<5 Jahre, mit Wurzel); Rachitis-Zeichen; Kleinwuchs"},
      {name: "Adult (häufig übersehen!)", beschreibung: "Wiederkehrende Metatarsal-Stressfrakturen; atypische Femurfrakturen; AP dauerhaft erniedrigt (<40 U/l Erwachsene) → Cave: Bisphosphonate kontraindiziert!"},
      {name: "Odonto-HPP",        beschreibung: "Nur Zähne betroffen; mildeste Form; Zahnverlust ohne Karies vor dem 5. Lebensjahr"},
    ]
  },
  tio: {
    titel: "TIO-Diagnostik-Algorithmus (FGF-23 + Bildgebung)",
    quelle: "Jiang Y et al. ENDO 2019; Florenzano P et al. JCEM 2021",
    url: "https://doi.org/10.1210/clinem/dgab536",
    stufen: [
      {name: "Biochemie",         beschreibung: "FGF-23 intakt >100 RU/ml + Hypophosphatämie + TmP/GFR niedrig + 1,25(OH)2D normal/niedrig → TIO-Verdacht"},
      {name: "Bildgebung Stufe 1", beschreibung: "DOTATATE-PET/CT (Ga-68) oder DOTATOC-Szintigraphie → Sensitivität >80% für FGF-23-produzierende Tumoren"},
      {name: "Bildgebung Stufe 2", beschreibung: "MRT Ganzkörper ergänzend (Weichteiltumore, Muskeln, subkutan); Cave: Tumor oft <2 cm!"},
      {name: "Venensampling",      beschreibung: "Bei negativer Bildgebung + starker klinischer Evidenz: selektives venöses FGF-23-Sampling zur Tumorlokalisation"},
    ]
  },
  paget: {
    titel: "Morbus Paget – Labormonitoring (ALP + Biomarker)",
    quelle: "Singer FR et al. Endocrine Practice 2014 (Endocrine Society Guideline)",
    url: "https://doi.org/10.4158/EP14267.GL",
    stufen: [
      {name: "Alkalische Phosphatase (Knochen-ALP)", beschreibung: "Wichtigster Aktivitätsmarker; Normalwert: 40–130 U/l (gesamt); bei Paget 3–10× erhöht | Knochen-spez. ALP: sensibler"},
      {name: "β-CTX + P1NP",                         beschreibung: "β-CTX (Resorption) und P1NP (Formation) ergänzen ALP-Monitoring und Therapieansprechen"},
      {name: "Therapieindikation",                    beschreibung: "ALP ≥2× obere Normgrenze + Symptome ODER asymptomatische Hochrisikolokalisation (Schädel, Wirbelsäule, gewichtsbelastende Knochen)"},
      {name: "Remissionskriterium",                   beschreibung: "Normalisierung der ALP unter Bisphosphonat-Therapie (Zoledronsäure 5 mg i.v. = Standard); Dauer: meist Monate bis Jahre"},
    ]
  },
  marfan: {
    titel: "Ghent-Nosologie 2010 (Marfan-Syndrom-Diagnose)",
    quelle: "Loeys BL et al. J Med Genet 2010;47:476",
    url: "https://doi.org/10.1136/jmg.2009.072785",
    stufen: [
      {name: "Aortenwurzel (Z-Score)",     beschreibung: "Aortenwurzel-Durchmesser ≥2 Z-Score (oder Dissektion) = Hauptkriterium; Messung Sinus Valsalvae"},
      {name: "Ectopia lentis",             beschreibung: "Linsenluxation in Augenhöhle; pathognomonisch"},
      {name: "FBN1-Mutation",              beschreibung: "Bekannte pathogene FBN1-Mutation = Hauptkriterium"},
      {name: "Systemischer Score (≥7 Pkt)", beschreibung: "Handzeichen (+1), Handgelenkzeichen (+2), Kielbrust (+2), Hühnerbrust (+1), Plattfuß (+1), Pneumothorax (+2), Duraektasie (+2), Acetabulumprotrusion (+2), Extremitätenlänge (+1), Skoliose/Kyphose (+1), Ellbogen (+1), Gesichtszeichen (+1), Striae (+1), Myopie (+1), Mitralsegel (+1)"},
    ]
  },
  eds: {
    titel: "Beighton-Score (Hypermobilität) + EDS-Diagnosekriterien 2017",
    quelle: "Malfait F et al. Am J Med Genet 2017;175C:8",
    url: "https://doi.org/10.1002/ajmg.c.31552",
    stufen: [
      {name: "Beighton-Score (0–9 Pkt)", beschreibung: "Hypermobiles EDS (hEDS): ≥5/9 (Erwachsene) | Fünffingerkontakt Boden (+1), Ellbogenüberstreckung (+2), Knieüberstreckung (+2), Daumen-Unterarm (+2), Kleinfinger-Rückwärts (+2)"},
      {name: "hEDS-Hauptkriterien (alle 3 erforderlich)", beschreibung: "1. Generalisierte Gelenkhypermobilität (GJH) | 2. Bindegewebe-Merkmale (Hautdehnbarkeit, atrophe Narben, Kapsel-/Bandlaxität) | 3. Familiäre Häufung und/oder Ausschluss anderer EDS-Typen"},
      {name: "Klassisches EDS",          beschreibung: "COL5A1/A2-Mutation: stark dehnbare Haut + Samthaut + atrophe Narben"},
      {name: "Vaskuläres EDS",           beschreibung: "COL3A1-Mutation: Aortenruptur, Hohlorganruptur; KEINE Hypermobilität!"},
    ]
  },
  gaucher: {
    titel: "Gaucher Disease Severity Score Index (SSI/GSDI)",
    quelle: "Zimran A et al. Blood 1992; Pastores GM et al. Semin Hematol 2004",
    url: "https://doi.org/10.1053/j.seminhematol.2004.07.012",
    stufen: [
      {name: "SSI leicht (0–3 Pkt)",    beschreibung: "Geringe Organomegalie; keine Knochenschmerzen; normale Hämatologie"},
      {name: "SSI mäßig (4–7 Pkt)",     beschreibung: "Moderate Hepato-/Splenomegalie; Anämie; Thrombopenie; Knochenbeschwerden"},
      {name: "SSI schwer (8–15 Pkt)",   beschreibung: "Schwere Organmanifestation; Knocheninfarkte; Nekrosen; Transfusionsbedarf"},
      {name: "Enzymersatztherapie-Indikation", beschreibung: "Symptomat. Gaucher Typ I: Imiglucerase / Velaglucerase / Taliglucerase; Substratreduktion: Eliglustat / Miglustat bei Erwachsenen ohne Knochenbeteiligung"},
    ]
  },
  turner: {
    titel: "Turner-Syndrom – Karyotyp-Varianten + Knochenrisiko",
    quelle: "Gravholt CH et al. Nat Rev Endocrinol 2017; ESHRE 2023",
    url: "https://doi.org/10.1038/nrendo.2017.165",
    stufen: [
      {name: "45,X (klassisch, ~50%)",    beschreibung: "Vollständige Monosomie; schwerster Phänotyp; primärer Hypogonadismus fast immer"},
      {name: "45,X/46,XX (Mosaik)",       beschreibung: "Milder Phänotyp möglich; ggf. Spontanpubertät; DXA trotzdem empfohlen"},
      {name: "46,Xi(Xq) / 46,X,del(Xp)", beschreibung: "Isochromosom oder partielle Deletion; variables Bild"},
      {name: "Knochenrisiko",             beschreibung: "BMD Z-Score oft -1 bis -2 SD; Substitution mit Östrogen bis natürliche Menopause obligat; DXA alle 5 Jahre (früher bei Fraktur/Risiko)"},
    ]
  },
  klinefelter: {
    titel: "Klinefelter-Syndrom (47,XXY) – Hypogonadismus + Knochenrisiko",
    quelle: "Gravholt CH et al. Nat Rev Endocrinol 2018",
    url: "https://doi.org/10.1038/nrendo.2018.29",
    stufen: [
      {name: "47,XXY (klassisch, ~80%)",    beschreibung: "Primärer Hypogonadismus; kleine Testes; Infertilität; Gynäkomastie; Testosteron meist <10 nmol/l"},
      {name: "Höheres Aneuploidie (48,XXXY)", beschreibung: "Schwerere Ausprägung; intellektuelle Beeinträchtigung häufiger"},
      {name: "Knochenrisiko",               beschreibung: "BMD-Verlust durch Hypogonadismus; Testosteronsubstitution verbessert BMD signifikant | DXA bei Diagnosestellung; Ziel Testosteron: ≥12 nmol/l"},
    ]
  },
  seltene_metabolisch: {
    titel: "Gaucher/Fabry/Pompe – Screeningparameter",
    quelle: "Orphanet; Desnick RJ et al. 2021 Review",
    url: "https://www.orpha.net",
    stufen: [
      {name: "Enzymaktivität (Trockenblut/Leukozyten)", beschreibung: "Gaucher: Glukozerebrosidase | Fabry: α-Galaktosidase A | Pompe: saure Maltase (GAA) – jeweils im Trockenblut-Screening messbar"},
      {name: "Biomarker",                               beschreibung: "Gaucher: Chitotriosidase ↑↑ | Fabry: Lyso-Gb3 im Plasma | Pompe: Urinary Hex4 (Hexaglukose)"},
      {name: "Gentestung",                              beschreibung: "GBA1 (Gaucher), GLA (Fabry), GAA (Pompe) – Ergebnis entscheidet über Enzymersatz-Indikation"},
    ]
  },
  eisen_osteomalazie: {
    titel: "Ferrioxid-assoziierte Hypophosphatämie – Diagnostische Kriterien",
    quelle: "Schaefer B et al. J Hepatol 2021; Fachinformationen Ferinject®",
    url: "https://doi.org/10.1016/j.jhep.2020.09.027",
    stufen: [
      {name: "Hypophosphatämie", beschreibung: "Phosphat < 0,87 mmol/l – bei wiederholten Ferinject®-Infusionen in bis zu 75% der Patienten"},
      {name: "FGF-23-Erhöhung", beschreibung: "Intaktes FGF-23 > 100 pg/ml → renale Phosphatverschwendung + Hemmung Vitamin-D-Aktivierung"},
      {name: "Osteomalazie leicht", beschreibung: "Phosphat ↓, keine/geringe Symptome, Knochendichte erhalten"},
      {name: "Osteomalazie mäßig", beschreibung: "Knochenschmerzen, proximale Muskelschwäche, Gang unsicher"},
      {name: "Osteomalazie schwer", beschreibung: "Looser-Umbauzonen, Stressfrakturen (Rippen, Metatarsalia), Gehunfähigkeit"},
      {name: "Hochrisiko-Indikator", beschreibung: "≥ 3 Ferric-Carboxymaltose-Infusionen (Ferinject®) ODER kumulative Dosis > 3 g/12 Monate → Phosphat-Monitoring zwingend erforderlich"},
    ]
  },
  mtx_osteopathie: {
    titel: "Methotrexat-Osteopathie – Risikostratifizierung nach kumulativer Dosis",
    quelle: "Zonneveld IM et al. Dermatology 1996; Braun J et al. Ann Rheum Dis 2010; DGRh",
    url: "https://doi.org/10.1159/000246975",
    stufen: [
      {name: "Niedrigrisiko", beschreibung: "MTX < 6 Monate ODER kumulative Dosis < 1,5 g – Osteopathie selten; DXA-Baseline empfohlen"},
      {name: "Moderates Risiko", beschreibung: "MTX 6–24 Monate ODER kum. Dosis 1,5–6 g – DXA-Monitoring, Folsäuresubstitution sicherstellen"},
      {name: "Hochrisiko", beschreibung: "MTX > 24 Monate ODER kum. Dosis > 6 g – erhöhtes Frakturrisiko (Tibia, Metatarsalia); DXA jährlich; ggf. Bisphosphonat-Prophylaxe"},
      {name: "Klinisches Bild", beschreibung: "Periartikuläre Knochenschmerzen (Knöchel, Füße), Stressfrakturen ohne adäquates Trauma; Laborbefunde oft unauffällig"},
    ]
  },
};

const SEK_SCORING_KEY = "osteo_sekscoring_overrides_v1";
function buildSekScoringDefaults(){ return JSON.parse(JSON.stringify(SEK_SCORING_DEFAULTS)); }


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

function getIndicators(answers,gender){
  const res=[];
  for(const q of visibleQs(gender)){
    if(!RISIKOINDIKATOR_IDS.has(q.id))continue;
    const val=answers[q.id];
    if(val!=="ja"&&val!==true)continue;
    const diagEntry=DIAG_DB_DEFAULTS[q.id];
    res.push({
      id:q.id,
      label:INDICATOR_LABELS[q.id]||q.label.split("\n")[0],
      icd:diagEntry?.icd5||q.icd||"",
      asterisk:INDICATOR_ASTERISK.has(q.id),
    });
  }
  return res;
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
    if(RISIKOINDIKATOR_IDS.has(q.id))continue; // Risikoindikator – nicht im Rechner
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
  const indicators=getIndicators(answers,gender);
  return{factors,top2,cF,t3,t5,t10,r3,r5,r10,genInd,cat,indicators};
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
const IDB_VER    = 2;
let _idb = null;

// Einfacher Hash (kein kryptographischer Anspruch – Daten bleiben lokal)
function simpleHash(s){ let h=0; for(let i=0;i<s.length;i++){h=(Math.imul(31,h)+s.charCodeAt(i))|0;} return (h>>>0).toString(16).padStart(8,'0'); }
function hashPw(pw){ return pw?simpleHash(pw+"osteo2024"):"";}

// Cookie-Hilfsfunktionen (30 Tage)
function cookieSet(k,v){ document.cookie=k+"="+encodeURIComponent(v)+";max-age=2592000;path=/;SameSite=Strict"; }
function cookieGet(k){ const m=document.cookie.match("(?:^|; )"+k+"=([^;]*)"); return m?decodeURIComponent(m[1]):null; }
function cookieDel(k){ document.cookie=k+"=;max-age=0;path=/"; }

function openIDB(){
  if(_idb) return Promise.resolve(_idb);
  return new Promise((res,rej)=>{
    const req = indexedDB.open(IDB_NAME, IDB_VER);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      const oldVer = e.oldVersion;
      // v1 → v2: befunde store ggf. anlegen, patienten store neu
      if(!db.objectStoreNames.contains("befunde")){
        const s = db.createObjectStore("befunde",{keyPath:"id"});
        s.createIndex("patName",     "patName",     {unique:false});
        s.createIndex("patientId",   "patientId",   {unique:false});
        s.createIndex("fillDate",    "fillDate",    {unique:false});
        s.createIndex("gender",      "gender",      {unique:false});
        s.createIndex("status",      "status",      {unique:false});
      } else if(oldVer<2){
        // Upgrade existing befunde store – add patientId index
        const bs = e.target.transaction.objectStore("befunde");
        if(!bs.indexNames.contains("patientId")) bs.createIndex("patientId","patientId",{unique:false});
      }
      if(!db.objectStoreNames.contains("patienten")){
        const p = db.createObjectStore("patienten",{keyPath:"id"});
        p.createIndex("nachname",      "nachname",      {unique:false});
        p.createIndex("vorname",       "vorname",       {unique:false});
        p.createIndex("geburtsdatum",  "geburtsdatum",  {unique:false});
        p.createIndex("letzterZugriff","letzterZugriff",{unique:false});
      }
    };
    req.onsuccess = e => { _idb = e.target.result; res(_idb); };
    req.onerror   = e => rej(e.target.error);
  });
}

/* ── Patienten-CRUD ── */
async function idbSavePatient(pat){
  const rec={...pat,letzterZugriff:new Date().toISOString()};
  return idbTx("patienten","readwrite", s=>s.put(rec));
}
async function idbGetPatient(id){
  return openIDB().then(db=>new Promise((res,rej)=>{
    const req=db.transaction("patienten","readonly").objectStore("patienten").get(id);
    req.onsuccess=e=>res(e.target.result||null);
    req.onerror=e=>rej(e.target.error);
  }));
}
async function idbLoadAllPatients(){
  return openIDB().then(db=>new Promise((res,rej)=>{
    const req=db.transaction("patienten","readonly").objectStore("patienten").getAll();
    req.onsuccess=e=>res(e.target.result||[]);
    req.onerror=e=>rej(e.target.error);
  }));
}
async function idbDeletePatient(id){
  return idbTx("patienten","readwrite",s=>s.delete(id));
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
    patName: ((session.patient?.nachname||session.patient?.name||"")).toLowerCase(),
    patientId: session.patientId||null,
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
  eisen_osteomalazie: {
    label: "Eisen-Infusionsbedingte Osteomalazie",
    hinweis: "Ferrioxid-haltige Eisenpräparate – insbesondere Ferric Carboxymaltose (Ferinject®) – können über eine FGF-23-vermittelte Phosphaturie eine Hypophosphatämie und Osteomalazie auslösen. Das Risiko steigt mit der Anzahl der Infusionen und vorbestehender Niereninsuffizienz. Phosphat und FGF-23 sollten bei regelmäßigen Eisen-Infusionen routinemäßig kontrolliert werden.",
    untersuchungen: [
      {name:"Phosphat im Serum (Zielwert: 0,87–1,45 mmol/l)",icd:"E83.30"},
      {name:"FGF-23 (Fibroblast Growth Factor 23, intakt)",icd:"E83.30"},
      {name:"Kalzium, Albumin (korrigiertes Kalzium)",icd:"E83.30"},
      {name:"Vitamin D (25-OH-D3)",icd:"E55.9"},
      {name:"Parathormon (PTH)",icd:"E83.30"},
      {name:"Alkalische Phosphatase (AP), Knochen-AP",icd:"E83.30"},
      {name:"Kalzium und Phosphat im 24h-Urin (TmP/GFR berechnen)",icd:"E83.30"},
      {name:"Röntgen / MRT: Stress- und Ermüdungsfrakturen (Rippen, Metatarsalia)?",icd:"M83.8"},
      {name:"DXA Knochendichte (Hüfte + LWS) bei symptomatischen Patienten",icd:"E83.30"},
    ]
  },
  mtx_osteopathie: {
    label: "Methotrexat-Induzierte Osteopathie",
    hinweis: "Methotrexat (MTX) inhibiert die Dihydrofolatreduktase und hemmt Osteoblasten-Proliferation sowie Knochenmineralisierung. Bei kumulativen Dosen > 6 g oder Therapiedauer > 6 Monate treten periartikuläre Knochenschmerzen und Stressfrakturen (bevorzugt Tibia, Metatarsalia) auf – laborchemisch oft unauffällig. Folsäuresubstitution reduziert die MTX-Toxizität.",
    untersuchungen: [
      {name:"DXA Knochendichte (Hüfte + LWS)",icd:"M81.4"},
      {name:"Alkalische Phosphatase (AP), Knochen-AP (Osteocalcin)",icd:"M81.4"},
      {name:"Vitamin D (25-OH-D3), Kalzium",icd:"E55.9"},
      {name:"Homocystein im Serum (MTX-Toxizitätsmarker)",icd:"M81.4"},
      {name:"Folsäure im Serum (Substitution ausreichend?)",icd:"M81.4"},
      {name:"Röntgen Tibia / Metatarsalia (Looser-Umbauzonen?, Periostreaktion?)",icd:"M83.8"},
      {name:"MRT betroffene Region (Knochenmarködem, Stressfraktur?)",icd:"M81.4"},
      {name:"Kumulative MTX-Dosis dokumentieren und evaluieren (Risikoschwelle > 6 g)",icd:"M81.4"},
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
/* ═══ PATIENTEN-EINGABE-PDF (ohne Auswertung) ══════════════════════════════ */
function buildPatientEingabeHtml(patient, gender, answers, anamnese, lh, SECTIONS){
  const fmt = v => v===undefined||v===null||v===""?"–":String(v);
  const fmtDate = d => { if(!d)return "–"; const p=d.split(".");return p.length===3?d:d; };

  // Antwort-Darstellung je Fragetyp
  function renderAnswer(q){
    const v = answers[q.id];
    if(q.t==="yn"||q.t==="yn_inv"){
      if(v==="ja"||v===true||v==="true")return '<span style="color:#1a5a1a;font-weight:700">✓ Ja</span>';
      if(v==="nein"||v===false||v==="false")return '<span style="color:#5a1a1a">✗ Nein</span>';
      return '<span style="color:#888">–</span>';
    }
    if(q.t==="radio"||q.t==="select"){
      return v?`<span style="font-weight:600">${v}</span>`:'<span style="color:#888">–</span>';
    }
    if(q.t==="number"||q.t==="text"){
      return v?`<span style="font-weight:600">${v}</span>`:'<span style="color:#888">–</span>';
    }
    if(q.t==="multi"){
      const sel=Array.isArray(v)?v:[];
      return sel.length?sel.map(s=>`<span style="display:inline-block;background:#e8f4e8;border:1px solid #aad4aa;border-radius:3px;padding:1px 6px;margin:1px 2px;font-size:12px">${s}</span>`).join(""):'<span style="color:#888">–</span>';
    }
    return v?`<span style="font-weight:600">${fmt(v)}</span>`:'<span style="color:#888">–</span>';
  }

  // Sektionen – nur beantwortete Fragen anzeigen (mindestens eine Antwort in Sektion)
  let sectionsHtml = "";
  for(const sec of SECTIONS){
    if(sec.symcheck) continue;   // Sekundäre Osteoporose gehört nicht in die Patienteneingabe
    // Gender-Filter
    const gok = !sec.gender || sec.gender===gender;
    if(!gok) continue;
    const qs = (sec.qs||[]).filter(q => !q.gender || q.gender===gender);
    if(!qs.length) continue;

    sectionsHtml += `
      <div style="margin-bottom:20px;break-inside:avoid">
        <div style="background:#3a2a0e;color:#f0e8d0;padding:8px 14px;border-radius:5px 5px 0 0;
          font-size:13px;font-weight:700;display:flex;align-items:center;gap:8px">
          <span>${sec.icon||""}</span>
          <span>${sec.title}</span>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12.5px">`;

    for(const q of qs){
      const v=answers[q.id];
      const answered=v!==undefined&&v!==null&&v!=="";
      const row=answered?"":" style=\"opacity:.55\"";
      // Kurzlabel: erste Zeile der Frage
      const shortLabel=q.label.split("\n")[0].slice(0,120);
      sectionsHtml += `
          <tr${row} style="border-bottom:1px solid #efe6d8">
            <td style="padding:6px 10px;vertical-align:top;width:62%;color:#2a1a0a;line-height:1.4">${shortLabel}</td>
            <td style="padding:6px 10px;vertical-align:top;text-align:right">${renderAnswer(q)}</td>
          </tr>`;
    }
    sectionsHtml += `
        </table>
      </div>`;
  }

  // Anamnese-Zusammenfassung
  let anamHtml="";
  if(anamnese){
    const dxList=(anamnese.diagnosen||[]).filter(d=>d&&d.trim());
    const fracList=(anamnese.fractures||[]).filter(f=>f&&(f.typ||f.seite));
    if(dxList.length||fracList.length||(anamnese.weitere||[]).filter(s=>s).length){
      anamHtml=`
      <div style="margin-bottom:20px;break-inside:avoid">
        <div style="background:#3a2a0e;color:#f0e8d0;padding:8px 14px;border-radius:5px 5px 0 0;
          font-size:13px;font-weight:700">📋 Anamnese / Krankengeschichte</div>
        <div style="border:1px solid #ddd;border-top:none;padding:10px 14px;font-size:12.5px">`;
      if(dxList.length) anamHtml+=`<div style="margin-bottom:6px"><strong>Diagnosen:</strong> ${dxList.join(" · ")}</div>`;
      if(fracList.length) anamHtml+=`<div style="margin-bottom:6px"><strong>Frühere Frakturen:</strong> ${fracList.map(f=>[f.typ,f.seite,f.jahr].filter(Boolean).join(" ")).join(", ")}</div>`;
      const weitereSet=(anamnese.weitere||[]).filter(s=>s);
      if(weitereSet.length) anamHtml+=`<div><strong>Weitere Angaben:</strong> ${weitereSet.join(", ")}</div>`;
      anamHtml+=`</div></div>`;
    }
  }

  const patName=[patient.vorname,patient.nachname].filter(Boolean).join(" ")||"–";
  const genderLabel=gender==="w"?"weiblich":gender==="m"?"männlich":"–";

  return `<!DOCTYPE html>
<html lang="de"><head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Fragebogen – ${patName}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#1a1a1a;background:white;padding:16px}
  @media print{body{padding:0} .print-bar{display:none!important}}
  h1{font-size:18px;color:#2a1808;margin-bottom:4px}
  .pat-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px 20px;margin-bottom:20px;
    background:#faf6f0;border:1.5px solid #d4a84b;border-radius:7px;padding:12px 16px}
  .pat-item label{font-size:10.5px;font-weight:700;color:#7a5a38;text-transform:uppercase;
    letter-spacing:.4px;display:block;margin-bottom:2px}
  .pat-item span{font-size:13.5px;font-weight:600;color:#1a1a1a}
  .footer{margin-top:24px;padding-top:10px;border-top:1px solid #ddd;font-size:10.5px;
    color:#888;text-align:center}
  .print-bar{background:#2c1f0e;color:#f0e8d0;padding:12px 16px;margin:-16px -16px 18px;
    display:flex;align-items:center;gap:12px;flex-wrap:wrap}
  .print-bar h2{font-size:14px;font-weight:700;flex:1;margin:0}
  .print-btn{padding:9px 18px;border:none;border-radius:6px;cursor:pointer;
    font-size:13px;font-weight:700;font-family:inherit}
  .print-btn.primary{background:#4a9a4a;color:white}
  .print-btn.secondary{background:#c8a84a;color:#1a1a0a}
  .hint{font-size:11px;color:#c8a060;line-height:1.4;flex-basis:100%}
  @media(max-width:600px){
    .pat-grid{grid-template-columns:1fr 1fr}
    .print-bar{flex-direction:column;align-items:flex-start}
  }
</style>
<script>
(function(){
  // Plattformerkennung
  var ua=navigator.userAgent;
  var isIOS=/iPad|iPhone|iPod/.test(ua)&&!window.MSStream;
  var isAndroid=/Android/.test(ua);
  var isMac=/Macintosh/.test(ua)&&navigator.maxTouchPoints>1; // iPad Pro
  var isMobile=isIOS||isAndroid||isMac;

  function setHint(){
    var hint=document.getElementById('pf-hint');
    if(!hint)return;
    if(isIOS||isMac){
      hint.textContent='iOS/iPadOS: Teilen-Symbol ↗️ → „Auf AirDrop“ oder „Drucken“ → PDF';
    } else if(isAndroid){
      hint.textContent='Android: 3-Punkte-Menü oben rechts → „Drucken“ → „Als PDF speichern“';
    } else {
      hint.textContent='Desktop: Klick auf „Drucken / Als PDF“ → Drucker „Als PDF speichern“ wählen';
    }
  }

  window.addEventListener('load',function(){
    setHint();
    // Web Share API (iOS/Android native Share)
    var shareBtn=document.getElementById('pf-share');
    if(shareBtn && navigator.share && isIOS){
      shareBtn.style.display='inline-block';
      shareBtn.addEventListener('click',function(){
        navigator.share({title:document.title,text:'Osteoporose-Fragebogen',url:location.href})
          .catch(function(){});
      });
    }
  });

  window.doPrint=function(){window.print();};
})();
<\/script>
</head><body>
<div class="print-bar no-print">
  <h2>&#x1F9BE; Osteoporose-Fragebogen &ndash; Patienteneingabe</h2>
  <button class="print-btn primary" onclick="window.doPrint()">&#x1F5A8; Drucken / Als PDF</button>
  <button id="pf-share" class="print-btn secondary" style="display:none">&#x1F4E4; Teilen</button>
  <span id="pf-hint" class="hint"></span>
</div>
<h1>Osteoporose-Fragebogen (Patienteneingabe)</h1>
<div style="font-size:11px;color:#888;margin-bottom:16px">
  Praxis: ${lh.name||""} · ${lh.strasse||""}, ${lh.plz_ort||""} · Ausgefüllt: ${patient.fillDate||"–"}
</div>

<div class="pat-grid">
  <div class="pat-item"><label>Name</label><span>${patName}</span></div>
  <div class="pat-item"><label>Geburtsdatum</label><span>${fmtDate(patient.geburtsdatum)}</span></div>
  <div class="pat-item"><label>Geschlecht</label><span>${genderLabel}</span></div>
  ${patient.email?`<div class="pat-item"><label>E-Mail</label><span>${patient.email}</span></div>`:""}
  ${answers.groesse?`<div class="pat-item"><label>Größe</label><span>${answers.groesse} cm</span></div>`:""}
  ${answers.gewicht?`<div class="pat-item"><label>Gewicht</label><span>${answers.gewicht} kg</span></div>`:""}
</div>

${anamHtml}
${sectionsHtml}

<div class="footer">
  Osteoporose-Fragebogen · Patienteneingabe ohne ärztliche Auswertung · DVO-Leitlinie 2023 ·
  Nur für den internen Praxisgebrauch
</div>
</body></html>`;
}

function buildTextExport(patient,gender,answers,risk,diff,lh,diagDb,sekDb,anamnese,therapieHistory,osteoTherapieDb,freitextTherapieMeds){
  const db=diagDb||DIAG_DB_DEFAULTS;
  const d=new Date().toLocaleDateString("de-DE");
  const lines=[];
  const sep="═".repeat(65);const sub="─".repeat(65);
  lines.push(sep);
  lines.push(`  ${lh.name}  |  ${lh.title}`);
  lines.push(`  ${lh.strasse}, ${lh.plz_ort}`);
  if(lh.telefon)lines.push(`  Tel.: ${lh.telefon}${lh.fax?" | Fax: "+lh.fax:""}`);
  lines.push(sep);
  lines.push("  ANAMNESE- UND OSTEOPOROSE-DOKUMENTATIONSHILFE UND RISIKOCHECK – AUSWERTUNG");
  lines.push("  DVO-Leitlinie 2023 | S3-Leitlinie AWMF 183-001");
  lines.push(`  Ausgabedatum: ${d}`);
  lines.push(sep);lines.push("");
  lines.push("PATIENTENDATEN");lines.push(sub);
  const patVollName=[patient.nachname||patient.name,patient.vorname].filter(Boolean).join(", ");
  if(patVollName)lines.push(`Name           : ${patVollName}`);
  if(patient.geburtsdatum)lines.push(`Geburtsdatum   : ${patient.geburtsdatum}`);
  lines.push(`Geschlecht     : ${gender==="f"?"Frau":"Mann"}`);
  lines.push(`Alter          : ${answers.alter||"–"} Jahre`);
  lines.push(`Größe          : ${answers.groesse||"–"} cm`);
  lines.push(`Gewicht        : ${answers.gewicht||"–"} kg`);
  const bmi=calcBMI(parseFloat(answers.groesse),parseFloat(answers.gewicht));
  if(bmi)lines.push(`BMI            : ${bmi.toFixed(1)} kg/m²`);
  lines.push(`Ausfülldatum   : ${patient.fillDate||d}`);
  lines.push("");
  // ─ Anamnese ─
  const an=anamnese||{};
  if((an.diagnosen||[]).length>0||(an.weitere||[]).length>0||(an.allergien||[]).length>0||(an.familienanamnese||[]).length>0||(an.fractures||[]).length>0||(an.ops||[]).length>0||an.menarche||an.menoPause||(an.kinder||[]).length>0){
    lines.push("PERSÖNLICHE KRANKENGESCHICHTE");lines.push(sub);
    if((an.diagnosen||[]).length>0){
      lines.push("Bekannte Diagnosen / Vorerkrankungen:");
      an.diagnosen.forEach(function(dx,i){
        var flags=[];
        if(dx.vitdRisiko)flags.push("VitD↓-Risiko");
        if(dx.phosphatRisiko)flags.push("PO₄↑-Risiko");
        var s="  "+(i+1)+". "+(dx.name||"–");
        if(dx.seitJahr)s+=" (seit "+dx.seitJahr+")";
        if(flags.length)s+=" ["+flags.join(", ")+"]";
        lines.push(s);
        if(dx.medikation)lines.push("     Medikation: "+dx.medikation);
      });
      lines.push("");
    }
    if((an.weitere||[]).length>0){
      lines.push("Weitere Erkrankungen:");
      an.weitere.forEach(function(we,i){
        var s="  "+(i+1)+". "+(we.name||"–");
        if(we.seitJahr)s+=" (seit "+we.seitJahr+")";
        if(we.status&&we.status!=="aktiv")s+=" ["+we.status+"]";
        if(we.anmerkung)s+=" – "+we.anmerkung;
        lines.push(s);
      });
      lines.push("");
    }
    if((an.allergien||[]).length>0){
      lines.push("Allergien / Unverträglichkeiten / Kontraindikationen:");
      an.allergien.forEach(function(al,i){
        var s="  "+(i+1)+". "+(al.substanz||"–");
        if(al.reaktion)s+=" → "+al.reaktion;
        if(al.schwere)s+=" ["+al.schwere+"]";
        lines.push(s);
      });
      lines.push("");
    }
    if((an.familienanamnese||[]).length>0){
      lines.push("Familienanamnese:");
      an.familienanamnese.forEach(function(fa,i){
        var s="  "+(i+1)+". "+(fa.verwandtschaft||"Verwandter")+": "+(fa.diagnose||"–");
        if(fa.erkranktMit)s+=" (mit ca. "+fa.erkranktMit+" J.)";
        if(fa.osteoRelevant)s+=" [OSTEOPOROSE-RELEVANT]";
        lines.push(s);
      });
      lines.push("");
    }
    if((an.fractures||[]).length>0){
      lines.push("Frühere Knochenbrüche:");
      an.fractures.forEach(function(fr,i){
        var parts=[fr.ort||"–"];
        if(fr.seite)parts.push(fr.seite);
        if(fr.jahr)parts.push("ca. "+fr.jahr);
        if(fr.ursache)parts.push("("+fr.ursache+")");
        lines.push("  "+(i+1)+". "+parts.join(" · "));
      });
      lines.push("");
    }
    if((an.ops||[]).length>0){
      lines.push("Frühere Operationen:");
      an.ops.forEach(function(op,i){
        var parts=[op.art||"–"];
        if(op.jahr)parts.push(""+op.jahr);
        if(op.klinik)parts.push(op.klinik);
        lines.push("  "+(i+1)+". "+parts.join(" · "));
      });
      lines.push("");
    }
    if(gender==="f"){
      if(an.menarche)lines.push("Menarche           : "+an.menarche+" Jahre");
      if(an.menoPause==="ja")lines.push("Regelblutung       : Vorhanden (regelmäßig)");
      else if(an.menoPause==="unregelmaessig")lines.push("Regelblutung       : Vorhanden (unregelmäßig)");
      else if(an.menoPause==="nein"){
        lines.push("Menopause          : Ja (keine Regelblutung)");
        if(an.menoYear)lines.push("Letzte Blutung     : "+an.menoYear);
        var gMap={natuerlich:"Natürliche Wechseljahre",op:"Ovarektomie (OP)",medikamentoes:"Medikamentöse Unterdrückung",strahlen:"Strahlentherapie",pof:"Vorzeitige Ovarialinsuffizienz (<40. LJ)",sonstige:an.menoSonstige||"Sonstiges"};
        if(an.menoGrund)lines.push("Ursache Menopause  : "+(gMap[an.menoGrund]||an.menoGrund));
      }
      if((an.kinder||[]).length>0){
        lines.push("Kinder             : "+an.kinder.length);
        an.kinder.forEach(function(k,i){
          var s="  "+(i+1)+". Geburtsjahr "+(k.geburtsjahr||"–");
          if(k.gestillt==="ja")s+=", gestillt "+(k.stilldauer||"?")+" Monate";
          else if(k.gestillt==="nein")s+=", nicht gestillt";
          lines.push(s);
        });
      }
      lines.push("");
    }
  }
  if(answers.dxa_hip){
    lines.push("DXA-KNOCHENDICHTEMESSUNG");lines.push(sub);
    lines.push(`T-Score Gesamthüfte  : ${answers.dxa_hip}`);
    if(answers.dxa_lws)lines.push(`T-Score LWS          : ${answers.dxa_lws}`);
    if(answers.dxa_neck)lines.push(`T-Score Schenkelhals : ${answers.dxa_neck}`);
    if(answers.dxa_tbs)lines.push(`TBS                  : ${answers.dxa_tbs}`);
    lines.push("");
  }
  // ─ Aktuelle Medikamente (vom Patienten eingetragen) ─
  const alleMeds=answers["alle_medikamente_rx"]||[];
  if(alleMeds.length>0){
    lines.push("AKTUELLE MEDIKATION (Patientenangabe)");lines.push(sub);
    alleMeds.forEach(function(m,i){lines.push("  "+(i+1)+". "+m);});
    lines.push("");
  }

  // ─ Bisherige Osteoporose-Therapie ─
  const freiTh=freitextTherapieMeds||[];
  const th=therapieHistory||[];
  const tdb=osteoTherapieDb||OSTEO_THERAPIE_DEFAULTS;
  if(freiTh.length>0||th.length>0){
    lines.push("BISHERIGE OSTEOPOROSE-THERAPIE");lines.push(sub);
    if(freiTh.length>0){
      lines.push("  Schnellerfassung (Kamera/Freitext):");
      freiTh.forEach(function(m,i){lines.push("    "+(i+1)+". "+m);});
      if(th.length>0)lines.push("");
    }
  }
  if(th.length>0){
    lines.push(" ");
    th.forEach(function(en,i){
      const med=tdb.find(function(m){return m.id===en.medId;})||null;
      let s="  "+(i+1)+". "+(med?med.wirkstoff:(en.medId||"Unbekannt"));
      if(med&&med.handelsnamen)s+=" ("+med.handelsnamen.split(",")[0]+")";
      if(en.vonJahr)s+="  von "+en.vonJahr;
      if(en.nochAktuell)s+=" – noch aktuell";
      else if(en.bisJahr)s+=" bis "+en.bisJahr;
      lines.push(s);
      if(en.dosierung)lines.push("     Dosierung: "+en.dosierung);
      if(en.abgesetzt&&en.absetzGrund){
        const grund=ABSETZ_GRUENDE.find(function(g){return g.id===en.absetzGrund;});
        lines.push("     Abgesetzt: "+(grund?grund.label:en.absetzGrund));
        if(en.absetzGrund==="nw"&&(en.absetzNwIds||[]).length>0&&med&&med.nw){
          const nwTexts=en.absetzNwIds.map(function(nid){
            const nwObj=med.nw.find(function(n){return n.id===nid;});
            return nwObj?nwObj.label+" ["+nwObj.icd+"]":nid;
          });
          lines.push("     Nebenwirkungen: "+nwTexts.join("; "));
        }
      }
      if(en.anmerkung)lines.push("     Anmerkung: "+en.anmerkung);
    });
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
  // ── Risikoindikatoren ──
  const activeInds=risk.indicators||[];
  if(activeInds.length){
    lines.push("RISIKOINDIKATOREN (DVO 2023) – BASISDIAGNOSTIK EMPFOHLEN");lines.push(sub);
    lines.push("Folgende Befunde begründen eine Indikation zur Basisdiagnostik (DXA + Labor).");
    lines.push("Sie fließen NICHT in den DVO-Risikorechner ein.");
    lines.push("");
    for(const ind of activeInds){
      const icdStr=ind.icd?` {${ind.icd}}`:"";
      lines.push(`• ${ind.label}${icdStr}${ind.asterisk?" *":""}`);
    }
    if(activeInds.some(i=>i.asterisk))lines.push("  * Basisdiagnostik auch vor dem 50. Lebensjahr erwägen");
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
  // Risikoindikator-Diagnosen
  for(const ind of activeInds){
    const diag=db[ind.id]||DIAG_DB_DEFAULTS[ind.id]||{};
    const diagText=diag.diagnose||ind.label;
    const icdStr=ind.icd||"";
    lines.push(icdStr?diagText+" {"+icdStr+"};":diagText+";");
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

/* ── AutoTextarea: Zeilenzahl aus Inhalt berechnet, kein Leerraum ── */
function AutoTextarea({value,onChange,placeholder,style,minRows=2,maxRows=10,...rest}){
  const text=value||"";
  // Leerzeilen am Ende ignorieren, Höhe minimal halten
  const charsPerLine=52;
  const trimmedLines=text.replace(/[\n\r]+$/,"").split("\n");
  const lineCount=trimmedLines.reduce((sum,line)=>sum+Math.max(1,Math.ceil(line.length/charsPerLine)),0);
  const rows=Math.min(Math.max(lineCount,minRows),maxRows);
  return(
    <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder}
      style={{...style,resize:"none",boxSizing:"border-box",minHeight:undefined,height:undefined}}
      {...rest}/>
  );
}

/* ── Medikamenten-Sammelbereich (oben in jeder Meds-Section) ── */
function MedsSammlung({rxValue,onRx,onCameraOpen}){
  const[text,setText]=useState("");
  const tags=rxValue||[];
  const addTag=(t)=>{const v=t.trim();if(!v||tags.includes(v))return;onRx("alle_medikamente_rx",[...tags,v]);};
  const removeTag=(i)=>onRx("alle_medikamente_rx",tags.filter((_,j)=>j!==i));
  const handleKey=(e)=>{if(e.key==="Enter"||e.key===","){addTag(text);setText("");}};
  return(
    <div style={{background:"#f0f7f4",border:"2px solid #4a8a6a",borderRadius:10,
      padding:"16px 18px",marginBottom:18}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,
        color:"#1a3a2a",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
        💊 Alle Ihre Medikamente – bitte hier eintragen
      </div>

      {/* Kamera-Button */}
      <button onClick={onCameraOpen} className="no-print" style={{
        width:"100%",padding:"13px 16px",
        background:"linear-gradient(135deg,#1a3a2a,#2a5a3a)",
        color:"white",border:"none",borderRadius:8,cursor:"pointer",
        fontFamily:"'Source Sans 3',sans-serif",fontSize:13.5,fontWeight:600,
        display:"flex",alignItems:"center",justifyContent:"center",gap:10,
        boxShadow:"0 3px 12px rgba(0,0,0,.2)",marginBottom:8}}>
        <span style={{fontSize:20}}>📷</span>
        <div style={{textAlign:"left"}}>
          <div>Medikamentenplan oder Schachtel fotografieren</div>
          <div style={{fontSize:11,fontWeight:400,opacity:.8,marginTop:2}}>
            QR-Code (Einheitlicher Medikationsplan) · Barcode (PZN/EAN) · KI-Fotoerkennung
          </div>
        </div>
      </button>

      {/* Klarschrift-Eingabe */}
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={handleKey}
          placeholder="Medikamentenname eingeben, dann Enter drücken…"
          style={{flex:1,padding:"9px 12px",border:"1.5px solid #7ab0a0",borderRadius:6,
            fontSize:13.5,fontFamily:"'Source Sans 3',sans-serif",outline:"none",
            background:"white",color:"#1a3a2a"}}/>
        <button onClick={()=>{addTag(text);setText("");}}
          style={{padding:"9px 16px",background:"#2a6a4a",color:"white",border:"none",
            borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:600,
            fontFamily:"'Source Sans 3',sans-serif",whiteSpace:"nowrap"}}>
          + Hinzufügen
        </button>
      </div>

      {/* Eingetragene Medikamente */}
      {tags.length===0
        ? <div style={{fontSize:12,color:"#6a8a7a",fontStyle:"italic",padding:"6px 2px"}}>
            Noch keine Medikamente eingetragen – bitte Kamera nutzen oder Namen eingeben
          </div>
        : <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {tags.map((t,i)=>(
              <span key={i} style={{display:"inline-flex",alignItems:"center",gap:5,
                padding:"5px 10px",background:"#d4ede4",border:"1px solid #7ab0a0",
                borderRadius:20,fontSize:12.5,color:"#1a3a2a",fontWeight:500}}>
                💊 {t}
                <button onClick={()=>removeTag(i)} className="no-print"
                  style={{background:"none",border:"none",cursor:"pointer",
                    color:"#5a8a6a",fontSize:14,lineHeight:1,padding:"0 2px",fontWeight:700}}>
                  ×
                </button>
              </span>
            ))}
          </div>
      }
      <div style={{fontSize:11,color:"#6a8a7a",marginTop:8,lineHeight:1.5}}>
        ℹ Tragen Sie alle Medikamente ein, die Sie regelmäßig einnehmen. Die Fragen unten helfen dem Arzt, die knochenrelevanten Präparate einzuordnen.
      </div>
    </div>
  );
}

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
  const isMeds=section.id==="meds"||section.id==="meds_f"||section.id==="meds_m";
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
        {isMeds&&onCameraOpen&&(
          <MedsSammlung
            rxValue={answers["alle_medikamente_rx"]}
            onRx={onRx}
            onCameraOpen={onCameraOpen}/>
        )}
        {isMeds&&(
          <div style={{fontSize:12,fontWeight:700,color:"#7a5a38",letterSpacing:"1px",
            textTransform:"uppercase",margin:"4px 0 12px",display:"flex",alignItems:"center",gap:8}}>
            <span style={{flex:1,height:1,background:"#e8d8c0"}}/>
            Bitte beantworten Sie jetzt die folgenden Fragen
            <span style={{flex:1,height:1,background:"#e8d8c0"}}/>
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
  const{factors,top2,cF,t3,t5,t10,r3,r5,r10,genInd,cat,indicators}=risk;
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
      <div className="result-title">📊 Auswertung – Anamnese- und Osteoporose-Dokumentationshilfe</div>
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
      {/* ── Risikoindikatoren (DVO 2023) ── */}
      {indicators&&indicators.length>0&&(
        <div style={{background:"#fffbeb",border:"1.5px solid #f59e0b",borderRadius:8,
          padding:"12px 14px",marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:13,color:"#92400e",marginBottom:6}}>
            🔔 Risikoindikatoren (DVO 2023)
          </div>
          <div style={{fontSize:11.5,color:"#78350f",marginBottom:8,lineHeight:1.5}}>
            Diese Befunde begründen eine Indikation zur Basisdiagnostik (DXA + Labor), fließen aber nicht in den Risikorechner ein.
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {indicators.map((ind,i)=>(
              <div key={i} style={{display:"flex",gap:7,alignItems:"flex-start"}}>
                <span style={{color:"#f59e0b",flexShrink:0,fontSize:13}}>⚠</span>
                <span style={{fontSize:12,color:"#2a1a0a",flex:1}}>{ind.label}
                  {ind.asterisk&&<sup style={{color:"#b45309",fontSize:9,marginLeft:2}}>*</sup>}
                </span>
                {ind.icd&&<span style={{fontSize:10,fontFamily:"monospace",color:"#6a4a9a",
                  background:"#f3e8ff",padding:"1px 6px",borderRadius:3,whiteSpace:"nowrap",flexShrink:0}}>{ind.icd}</span>}
              </div>
            ))}
          </div>
          {indicators.some(i=>i.asterisk)&&(
            <div style={{fontSize:10,color:"#9a6a3a",marginTop:8,fontStyle:"italic"}}>
              * Basisdiagnostik auch vor dem Alter von 50 Jahren erwägen
            </div>
          )}
        </div>
      )}
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

/* ─── BODY IMAGES (base64 embedded, alle 12 Ansichten) ──────────────────────── */
const BODY_IMGS = {
  kopf_vorn: "data:image/jpeg;base64,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",
  kopf_hinten: "data:image/jpeg;base64,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",
  kopf_links: "data:image/jpeg;base64,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",
  kopf_rechts: "data:image/jpeg;base64,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",
  koerper_vorn: "data:image/jpeg;base64,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",
  koerper_hinten: "data:image/jpeg;base64,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",
  koerper_links: "data:image/jpeg;base64,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",
  koerper_rechts: "data:image/jpeg;base64,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",
  hand_rechts: "data:image/jpeg;base64,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",
  hand_links: "data:image/jpeg;base64,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",
  fuss_rechts: "data:image/jpeg;base64,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",
  fuss_links: "data:image/jpeg;base64,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",
};

const PAIN_VIEWS=[
  {id:"kopf_vorn",      group:"Kopf",   label:"Kopf – Vorderansicht",  short:"Kopf vorne",   w:400,h:531},
  {id:"kopf_hinten",    group:"Kopf",   label:"Kopf – Rückansicht",    short:"Kopf hinten",  w:400,h:518},
  {id:"kopf_links",     group:"Kopf",   label:"Kopf – linke Seite",    short:"Kopf links",   w:400,h:533},
  {id:"kopf_rechts",    group:"Kopf",   label:"Kopf – rechte Seite",   short:"Kopf rechts",  w:400,h:483},
  {id:"koerper_vorn",   group:"Körper", label:"Körper – Vorderseite",  short:"Körper vorne", w:400,h:764},
  {id:"koerper_hinten", group:"Körper", label:"Körper – Rückseite",    short:"Körper hinten",w:400,h:677},
  {id:"koerper_links",  group:"Körper", label:"Körper – linke Seite",  short:"Körper links", w:280,h:819},
  {id:"koerper_rechts", group:"Körper", label:"Körper – rechte Seite", short:"Körper rechts",w:280,h:819},
  {id:"hand_rechts",    group:"Hände",  label:"Rechte Hand",           short:"Re. Hand",     w:500,h:269},
  {id:"hand_links",     group:"Hände",  label:"Linke Hand",            short:"Li. Hand",     w:500,h:269},
  {id:"fuss_rechts",    group:"Füße",   label:"Rechter Fuß",           short:"Re. Fuß",      w:500,h:373},
  {id:"fuss_links",     group:"Füße",   label:"Linker Fuß",            short:"Li. Fuß",      w:500,h:373},
];

function PainBodySection({painMaps,setPainMaps,open,onToggle}){
  const [brushColor,setBrushColor]=useState("#e63946");
  const [brushSize,setBrushSize]=useState(10);
  const [erasing,setErasing]=useState(false);

  // ONE ref per canvas, stored as DOM nodes directly (no createRef duplication)
  const canvasRefs=useRef({});
  const drawing=useRef(false);
  const lastPos=useRef(null);

  const COLORS=[
    {c:"#e63946",l:"Starker Schmerz"},
    {c:"#f4a261",l:"Mäßiger Schmerz"},
    {c:"#52b788",l:"Gelegentlich"},
    {c:"#9b5de5",l:"Taubheit / Kribbeln"},
  ];

  // Convert SVG to base64 data URL (avoids all CSP / blob URL issues)
  const svgToDataUrl=(svgStr)=>"data:image/svg+xml;base64,"+btoa(unescape(encodeURIComponent(svgStr)));

  const redrawCanvas=(vid)=>{
    const canvas=canvasRefs.current[vid];
    if(!canvas) return;
    const v=PAIN_VIEWS.find(x=>x.id===vid);
    const ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,v.w,v.h);
    ctx.fillStyle="#fffdf8"; ctx.fillRect(0,0,v.w,v.h);
    const img=new Image();
    img.onload=()=>{
      ctx.drawImage(img,0,0,v.w,v.h);
      const saved=painMaps[vid];
      if(saved){
        const p=new Image();
        p.onload=()=>ctx.drawImage(p,0,0,v.w,v.h);
        p.src=saved;
      }
    };
    img.onerror=()=>{
      ctx.fillStyle="#f7f0e8"; ctx.fillRect(0,0,v.w,v.h);
      ctx.strokeStyle="#9b7a5a"; ctx.lineWidth=2; ctx.strokeRect(4,4,v.w-8,v.h-8);
      ctx.fillStyle="#9b7a5a"; ctx.font="bold 14px Arial"; ctx.textAlign="center";
      ctx.fillText(v.label||vid, v.w/2, v.h/2);
    };
    img.src=BODY_IMGS[vid]||"";
  };

  // Redraw all views whenever painMaps or open changes
  useEffect(()=>{
    if(!open) return;
    const t=setTimeout(()=>PAIN_VIEWS.forEach(v=>redrawCanvas(v.id)),50);
    return ()=>clearTimeout(t);
  },[open,painMaps]);

  // Redraw ALL views on open (so saved marks are restored)
  useEffect(()=>{
    if(!open) return;
    const t=setTimeout(()=>PAIN_VIEWS.forEach(v=>redrawCanvas(v.id)),80);
    return ()=>clearTimeout(t);
  },[open]);

  const getPos=(e,canvas)=>{
    const r=canvas.getBoundingClientRect();
    const sx=canvas.width/r.width, sy=canvas.height/r.height;
    if(e.touches){
      const t=e.touches[0];
      return{x:(t.clientX-r.left)*sx, y:(t.clientY-r.top)*sy};
    }
    return{x:(e.clientX-r.left)*sx, y:(e.clientY-r.top)*sy};
  };

  const startDraw=(e,vid)=>{
    e.preventDefault();
    const canvas=canvasRefs.current[vid];
    if(!canvas) return;
    drawing.current=true;
    const pos=getPos(e,canvas);
    lastPos.current=pos;
    const ctx=canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(pos.x,pos.y,brushSize/2,0,Math.PI*2);
    ctx.fillStyle=erasing?"#fffdf8":brushColor;
    ctx.globalAlpha=erasing?1:0.72;
    ctx.fill();
    ctx.globalAlpha=1;
  };

  const doDraw=(e,vid)=>{
    if(!drawing.current) return;
    e.preventDefault();
    const canvas=canvasRefs.current[vid];
    if(!canvas) return;
    const pos=getPos(e,canvas);
    const ctx=canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x,lastPos.current.y);
    ctx.lineTo(pos.x,pos.y);
    ctx.strokeStyle=erasing?"#fffdf8":brushColor;
    ctx.lineWidth=brushSize;
    ctx.lineCap="round"; ctx.lineJoin="round";
    ctx.globalAlpha=erasing?1:0.72;
    ctx.stroke();
    ctx.globalAlpha=1;
    lastPos.current=pos;
  };

  const endDraw=(vid)=>{
    if(!drawing.current) return;
    drawing.current=false;
    const canvas=canvasRefs.current[vid];
    if(canvas) setPainMaps(pm=>({...pm,[vid]:canvas.toDataURL()}));
  };

  const clearView=(vid)=>{
    setPainMaps(pm=>({...pm,[vid]:null}));
    setTimeout(()=>redrawCanvas(vid),20);
  };

  const hasDrawing=Object.values(painMaps).some(v=>v);

  // Sidebar: shared toolbar rendered next to each canvas
  const Sidebar=({vid})=>(
    <div style={{
      minWidth:170,maxWidth:200,flexShrink:0,
      display:"flex",flexDirection:"column",gap:10,
      paddingTop:2,
    }}>
      {/* Title */}
      <div style={{fontWeight:700,fontSize:14,color:"#5a3e2a",lineHeight:1.3}}>
        {(PAIN_VIEWS.find(v=>v.id===vid)||{}).label}
      </div>
      <div style={{fontSize:12,color:"#9b8a7a",lineHeight:1.5}}>
        Mit Finger, Stift oder Maus Schmerzbereiche einmalen.
      </div>

      {/* Color picker */}
      <div>
        <div style={{fontSize:11,fontWeight:700,color:"#6b5a4a",marginBottom:6,
          textTransform:"uppercase",letterSpacing:".8px"}}>Farbe &amp; Bedeutung</div>
        {COLORS.map(({c,l})=>(
          <button key={c} title={l}
            onClick={()=>{setBrushColor(c);setErasing(false);}}
            style={{
              display:"flex",alignItems:"center",gap:8,width:"100%",
              padding:"5px 8px",marginBottom:4,
              borderRadius:6,border:brushColor===c&&!erasing?"2px solid #333":"1.5px solid #d8c8b0",
              background:brushColor===c&&!erasing?"#fdf4e8":"white",
              cursor:"pointer",textAlign:"left",fontFamily:"inherit",
            }}>
            <span style={{width:18,height:18,borderRadius:"50%",background:c,
              flexShrink:0,border:"1px solid rgba(0,0,0,.15)",display:"inline-block"}}/>
            <span style={{fontSize:12,color:"#3a2a1a",fontWeight:brushColor===c&&!erasing?700:400}}>{l}</span>
          </button>
        ))}
      </div>

      {/* Brush size */}
      <div>
        <div style={{fontSize:11,fontWeight:700,color:"#6b5a4a",marginBottom:6,
          textTransform:"uppercase",letterSpacing:".8px"}}>Pinselgröße</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {[[6,"S"],[12,"M"],[22,"L"],[36,"XL"]].map(([sz,lbl])=>(
            <button key={sz} onClick={()=>setBrushSize(sz)}
              style={{
                padding:"4px 10px",borderRadius:5,fontFamily:"inherit",fontSize:12,
                cursor:"pointer",fontWeight:brushSize===sz?700:400,
                border:brushSize===sz?"2px solid #9b7a5a":"1.5px solid #c8b8a0",
                background:brushSize===sz?"#f7efe0":"white",
              }}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Eraser + clear */}
      <div style={{display:"flex",flexDirection:"column",gap:5}}>
        <button onClick={()=>setErasing(e=>!e)}
          style={{
            padding:"6px 10px",borderRadius:5,fontFamily:"inherit",fontSize:12,
            cursor:"pointer",fontWeight:erasing?700:400,textAlign:"left",
            border:erasing?"2px solid #dc2626":"1.5px solid #c8b8a0",
            background:erasing?"#fee2e2":"white",
          }}>
          ✦ Radierer {erasing?"(aktiv)":""}
        </button>
        <button onClick={()=>clearView(vid)}
          style={{
            padding:"6px 10px",borderRadius:5,fontFamily:"inherit",fontSize:12,
            cursor:"pointer",textAlign:"left",
            border:"1.5px solid #fca5a5",background:"#fff1f2",color:"#b91c1c",
          }}>
          🗑 Ansicht löschen
        </button>
      </div>
    </div>
  );

  return(
    <div className="section-card" style={{marginBottom:12,overflow:"hidden"}}>
      <div className="section-header" onClick={onToggle} style={{cursor:"pointer",userSelect:"none"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>✏️</span>
          <div>
            <div style={{fontWeight:700,fontSize:15}}>Schmerzzeichnung</div>
            <div style={{fontSize:12,color:"#9b8a7a",fontWeight:400}}>
              Schmerzbereiche mit Finger oder Stift einzeichnen
              {hasDrawing&&<span style={{marginLeft:8,color:"#e63946",fontWeight:600,fontSize:11}}>● Eingezeichnet</span>}
            </div>
          </div>
        </div>
        <span style={{fontSize:18,color:"var(--P)"}}>{open?"▲":"▼"}</span>
      </div>

      {open&&(
        <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:24,background:"white"}}>
          {PAIN_VIEWS.map(v=>(
            <div key={v.id} className="pain-no-print" style={{
              display:"flex",gap:20,alignItems:"flex-start",
              paddingBottom:20,
              borderBottom:"1px solid #ede5d8",
            }}>
              {/* Canvas */}
              <div style={{
                maxWidth: v.w > v.h
                  ? "min(65vw, "+v.w+"px)"
                  : "min(45vw, "+v.w+"px, 340px)",
                maxHeight:"clamp(260px,75vh,860px)",
                aspectRatio:v.w+"/"+v.h,
                width:"100%",
                height:"auto",
                border:"1px solid #d0c0a8",
                borderRadius:10,
                overflow:"hidden",
                boxShadow:"0 3px 14px rgba(0,0,0,.12)",
                flexShrink:0,
                background:"#fffdf8",
                position:"relative",
                alignSelf:"flex-start",
              }}>
                <canvas
                  ref={el=>{if(el) canvasRefs.current[v.id]=el;}}
                  width={v.w} height={v.h}
                  style={{width:"100%",height:"100%",display:"block",touchAction:"none",
                    cursor:erasing?"cell":"crosshair"}}
                  onMouseDown={e=>startDraw(e,v.id)}
                  onMouseMove={e=>doDraw(e,v.id)}
                  onMouseUp={()=>endDraw(v.id)}
                  onMouseLeave={()=>endDraw(v.id)}
                  onTouchStart={e=>startDraw(e,v.id)}
                  onTouchMove={e=>doDraw(e,v.id)}
                  onTouchEnd={()=>endDraw(v.id)}
                />
              </div>
              {/* Sidebar */}
              <Sidebar vid={v.id}/>
            </div>
          ))}

          {/* Print grid */}
          <div className="pain-print-grid">
            {PAIN_VIEWS.map(v=>(
              <div key={v.id} style={{textAlign:"center"}}>
                <div style={{fontWeight:700,fontSize:9,marginBottom:2,color:"#5a3e2a"}}>{v.label}</div>
                <canvas
                  ref={el=>{
                    if(el&&painMaps[v.id]){
                      const ctx=el.getContext("2d");
                      const bg=new Image(); bg.onload=()=>{
                        ctx.drawImage(bg,0,0,v.w,v.h);
                        if(painMaps[v.id]){const p=new Image();p.onload=()=>ctx.drawImage(p,0,0,v.w,v.h);p.src=painMaps[v.id];}
                      };
                      bg.src=BODY_IMGS[v.id]||"";
                    } else if(el){
                      const ctx=el.getContext("2d");
                      ctx.fillStyle="#fdf6ee"; ctx.fillRect(0,0,v.w,v.h);
                      ctx.strokeStyle="#d0c0a8"; ctx.lineWidth=1; ctx.strokeRect(1,1,v.w-2,v.h-2);
                      const img=new Image();
                      img.onload=()=>ctx.drawImage(img,0,0,v.w,v.h);
                      img.src=BODY_IMGS[v.id]||"";
                    }
                  }}
                  width={v.w} height={v.h}
                  style={{width:"100%",maxWidth:v.w===200?120:90,border:"1px solid #d8c8b0",borderRadius:4,display:"block",margin:"0 auto"}}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
/* ─── ANAMNESE SECTION ───────────────────────────────────────────────────── */
function AnamneseSection({gender,data,onChange,open,onToggle}){
  const DEF={diagnosen:[],weitere:[],allergien:[],familienanamnese:[],fractures:[],ops:[],menarche:"",menoPause:"",menoYear:"",menoGrund:"",menoSonstige:"",kinder:[]};
  const d={...DEF,...data};

  const updFrac=(i,f,v)=>{const r=[...d.fractures];r[i]={...r[i],[f]:v};onChange({...d,fractures:r});};
  const addFrac=()=>onChange({...d,fractures:[...d.fractures,{ort:"",seite:"",jahr:"",ursache:""}]});
  const delFrac=(i)=>onChange({...d,fractures:d.fractures.filter((_,j)=>j!==i)});

  const updOp=(i,f,v)=>{const r=[...d.ops];r[i]={...r[i],[f]:v};onChange({...d,ops:r});};
  const addOp=()=>onChange({...d,ops:[...d.ops,{art:"",jahr:"",klinik:""}]});
  const delOp=(i)=>onChange({...d,ops:d.ops.filter((_,j)=>j!==i)});

  const updKind=(i,f,v)=>{const r=[...d.kinder];r[i]={...r[i],[f]:v};onChange({...d,kinder:r});};
  const addKind=()=>onChange({...d,kinder:[...d.kinder,{geburtsjahr:"",gestillt:"",stilldauer:""}]});
  const delKind=(i)=>onChange({...d,kinder:d.kinder.filter((_,j)=>j!==i)});

  const updDiag=(i,f,v)=>{const r=[...d.diagnosen];r[i]={...r[i],[f]:v};onChange({...d,diagnosen:r});};
  const addDiag=(vorschlag)=>onChange({...d,diagnosen:[...d.diagnosen,{name:vorschlag||"",seitJahr:"",medikation:"",vitdRisiko:false,phosphatRisiko:false}]});
  const delDiag=(i)=>onChange({...d,diagnosen:d.diagnosen.filter((_,j)=>j!==i)});

  const updWeitere=(i,f,v)=>{const r=[...d.weitere];r[i]={...r[i],[f]:v};onChange({...d,weitere:r});};
  const addWeitere=(vorschlag)=>onChange({...d,weitere:[...d.weitere,{name:vorschlag||"",seitJahr:"",status:"aktiv",anmerkung:""}]});
  const delWeitere=(i)=>onChange({...d,weitere:d.weitere.filter((_,j)=>j!==i)});

  const updAllerg=(i,f,v)=>{const r=[...d.allergien];r[i]={...r[i],[f]:v};onChange({...d,allergien:r});};
  const addAllerg=()=>onChange({...d,allergien:[...d.allergien,{substanz:"",reaktion:"",schwere:""}]});
  const delAllerg=(i)=>onChange({...d,allergien:d.allergien.filter((_,j)=>j!==i)});

  const updFam=(i,f,v)=>{const r=[...d.familienanamnese];r[i]={...r[i],[f]:v};onChange({...d,familienanamnese:r});};
  const addFam=(vorschlag)=>onChange({...d,familienanamnese:[...d.familienanamnese,{diagnose:vorschlag||"",verwandtschaft:"",erkranktMit:"",osteoRelevant:false}]});
  const delFam=(i)=>onChange({...d,familienanamnese:d.familienanamnese.filter((_,j)=>j!==i)});

  const FRAKTUR_ORTE=["Wirbelsäule","Hüfte / Oberschenkelhals","Unterarm / Handgelenk","Oberarm","Rippe(n)","Becken","Fuß","Hand / Finger","Sprunggelenk","Schulter","Sonstiges"];
  const MENOGRUNDE=[
    {v:"natuerlich",l:"Natürliche Wechseljahre"},
    {v:"op",l:"Operative Entfernung der Eierstöcke (Ovarektomie)"},
    {v:"medikamentoes",l:"Medikamentöse Unterdrückung (z.B. GnRH-Analoga bei Endometriose)"},
    {v:"strahlen",l:"Strahlentherapie im Beckenbereich"},
    {v:"pof",l:"Vorzeitige Ovarialinsuffizienz (vor dem 40. Lebensjahr)"},
    {v:"sonstige",l:"Sonstiger Grund"},
  ];

  const iSt={padding:"5px 8px",border:"1px solid #d8c8b0",borderRadius:6,fontSize:13,fontFamily:"inherit",background:"white",outline:"none"};
  const selSt={...iSt,cursor:"pointer"};
  const lblSt={fontSize:12,color:"#6b5a4a",fontWeight:600,whiteSpace:"nowrap"};
  const addBSt={padding:"5px 14px",borderRadius:6,border:"1px dashed #9b7a5a",background:"white",color:"#6b5040",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600};
  const delBSt={padding:"4px 9px",borderRadius:5,border:"1px solid #fca5a5",background:"#fee2e2",color:"#dc2626",cursor:"pointer",fontSize:13,fontFamily:"inherit",flexShrink:0,alignSelf:"flex-end"};
  const rowSt={display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap",padding:"8px 10px",background:"white",border:"1px solid #ede4d4",borderRadius:7,marginBottom:5};
  const grpTSt={fontSize:13,fontWeight:700,color:"#5a3e2a",marginBottom:8,paddingBottom:4,borderBottom:"1px solid #e8d8c0"};
  const fld=(label,children)=>(<div style={{display:"flex",flexDirection:"column",gap:3}}><label style={lblSt}>{label}</label>{children}</div>);

  const hasData=d.diagnosen.length>0||d.weitere.length>0||d.allergien.length>0||d.familienanamnese.length>0||d.fractures.length>0||d.ops.length>0||d.menarche||(gender==="f"&&(d.menoPause||d.kinder.length>0));

  return(
    <div className="section-card anam-section" style={{marginBottom:12,overflow:"hidden"}}>
      <div className="section-header" onClick={onToggle} style={{cursor:"pointer",userSelect:"none"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>📋</span>
          <div>
            <div style={{fontWeight:700,fontSize:15}}>Persönliche Krankengeschichte</div>
            <div style={{fontSize:12,color:"#9b8a7a",fontWeight:400}}>
              Vorerkrankungen · Familienanamnese · Allergien · Knochenbrüche · Operationen{gender==="f"?" · Gynäkologische Anamnese":""}
              {hasData&&<span style={{marginLeft:8,color:"#4a8f3a",fontWeight:600,fontSize:11}}>✓ Ausgefüllt</span>}
            </div>
          </div>
        </div>
        <span style={{fontSize:18,color:"var(--P)"}}>{open?"▲":"▼"}</span>
      </div>

      {open&&(
        <div style={{padding:"14px 18px"}}>

          {/* ── Bekannte Diagnosen & Vorerkrankungen (Checkliste) ── */}
          {(()=>{
            const DIAG_LISTE = [
              // Erkrankungen
              {id:"niere",     kat:"Erkrankungen", vitd:true,  ph:true,
               label:"Nierenerkrankung (chronische Niereninsuffizienz, Dialyse)",
               hint:"Nieren aktivieren Vitamin D – bei eingeschränkter Funktion fehlt der letzte Aktivierungsschritt"},
              {id:"darm",      kat:"Erkrankungen", vitd:true,  ph:false,
               label:"Darmerkrankung (Morbus Crohn, Colitis ulcerosa, Zöliakie / Glutenunverträglichkeit)",
               hint:"Entzündliche Darmerkrankungen und Zöliakie beeinträchtigen die Aufnahme von Vitamin D und Kalzium"},
              {id:"magen_op",  kat:"Erkrankungen", vitd:true,  ph:false,
               label:"Magenoperation oder Magenbypass (bariatrische Operation)",
               hint:"Nach Magenbypass oder -verkleinerung ist die Aufnahme von Vitamin D und Kalzium dauerhaft vermindert"},
              {id:"leber",     kat:"Erkrankungen", vitd:true,  ph:false,
               label:"Lebererkrankung (Leberzirrhose, chronische Hepatitis)",
               hint:"Die Leber ist für den ersten Aktivierungsschritt von Vitamin D zuständig"},
              {id:"epilepsie", kat:"Erkrankungen", vitd:true,  ph:false,
               label:"Epilepsie / Krampfanfälle (mit Medikamenten behandelt)",
               hint:"Antiepileptika (z.B. Carbamazepin, Phenytoin) lassen Vitamin D in der Leber viel schneller abbauen"},
              {id:"nsd",       kat:"Erkrankungen", vitd:true,  ph:true,
               label:"Nebenschilddrüsen-Erkrankung (zu viel oder zu wenig Nebenschilddrüsenhormon)",
               hint:"Das Nebenschilddrüsenhormon (PTH) steuert Kalzium und Phosphat – Störungen hier beeinflussen Knochen direkt"},
              {id:"cushing",   kat:"Erkrankungen", vitd:true,  ph:false,
               label:"Cushing-Syndrom oder langfristige Kortisontherapie (> 3 Monate)",
               hint:"Kortison vermindert die Kalziumaufnahme und fördert Knochenabbau – einer der häufigsten Auslöser von Osteoporose durch Medikamente"},
              {id:"sarkoidose",kat:"Erkrankungen", vitd:true,  ph:false,
               label:"Sarkoidose oder ähnliche Granulomerkrankung",
               hint:"Sarkoidose kann den Vitamin-D-Stoffwechsel stark verändern"},
              {id:"hyperthyr", kat:"Erkrankungen", vitd:true,  ph:false,
               label:"Schilddrüsenüberfunktion (Hyperthyreose, Morbus Basedow)",
               hint:"Zu viel Schilddrüsenhormon beschleunigt den Knochenumbau"},
              {id:"tb",        kat:"Erkrankungen", vitd:true,  ph:false,
               label:"Tuberkulose (aktuell oder früher, mit Rifampicin behandelt)",
               hint:"Rifampicin lässt Vitamin D sehr schnell abbauen"},
              {id:"hiv",       kat:"Erkrankungen", vitd:true,  ph:true,
               label:"HIV-Infektion (mit Virostatika behandelt, insbesondere Tenofovir)",
               hint:"Bestimmte HIV-Medikamente (Tenofovir) können die Nieren schädigen und Phosphatverluste verursachen"},
              {id:"fanconi",   kat:"Erkrankungen", vitd:false, ph:true,
               label:"Fanconi-Syndrom oder angeborene Nieren-Tubulus-Erkrankung",
               hint:"Erkrankung der Nierenkanälchen mit übermäßigem Phosphatverlust im Urin"},
              {id:"xlh",       kat:"Erkrankungen", vitd:false, ph:true,
               label:"Erblicher Phosphatmangel (XLH / X-chromosomale Hypophosphatämie)",
               hint:"Seltene Erbkrankheit: Phosphat wird übermäßig über die Nieren ausgeschieden"},
              {id:"rachitis",  kat:"Erkrankungen", vitd:true,  ph:false,
               label:"Rachitis (Knochenerweichung) in der Kindheit",
               hint:"Hinweis auf früheren schweren Vitamin-D-Mangel"},
              // Medikamente
              {id:"kortison_m",kat:"Medikamente",  vitd:true,  ph:false,
               label:"Kortison / Cortison / Prednisolon – länger als 3 Monate eingenommen",
               hint:"z.B. Prednisolon, Dexamethason – einer der häufigsten Auslöser von Osteoporose"},
              {id:"antiepil",  kat:"Medikamente",  vitd:true,  ph:false,
               label:"Antiepileptika (Mittel gegen Krampfanfälle oder Epilepsie)",
               hint:"z.B. Carbamazepin (Tegretal®), Phenytoin, Valproat (Ergenyl®) – bauen Vitamin D schnell ab"},
              {id:"ferinject", kat:"Medikamente",  vitd:false, ph:true,
               label:"Eisen-Infusionen (z.B. Ferinject®, Monofer®, Cosmofer®)",
               hint:"Ferinject® kann einen Botenstoff (FGF-23) erhöhen, der dazu führt, dass Phosphat über die Nieren verloren geht"},
              {id:"mtx_m",     kat:"Medikamente",  vitd:true,  ph:false,
               label:"Methotrexat (MTX) – Rheuma- oder Psoriasis-Mittel",
               hint:"Bei langer Einnahme (> 6 Monate) kann MTX die Knochenmineralisierung stören"},
              {id:"ppi",       kat:"Medikamente",  vitd:true,  ph:false,
               label:"Magenschutz-Tabletten dauerhaft (Omeprazol, Pantoprazol, Esomeprazol)",
               hint:"Protonenpumpenhemmer (PPI) – bei Dauereinnahme verminderte Aufnahme von Vitamin D und Kalzium"},
              {id:"cholestyr", kat:"Medikamente",  vitd:true,  ph:false,
               label:"Gallensäurebinder (Cholestyramin, Colestipol)",
               hint:"Binden fettlösliche Vitamine (Vitamin D, K, A) im Darm, sodass sie nicht aufgenommen werden"},
              {id:"phosphatb", kat:"Medikamente",  vitd:false, ph:true,
               label:"Phosphatbinder (Sevelamer, aluminiumhaltige Antazida wie Maaloxan®)",
               hint:"Werden zur Behandlung von zu hohem Phosphat eingesetzt, können aber zu Phosphatmangel führen"},
            ];

            const toggleDiag=(id)=>{
              const already=d.diagnosen.some(x=>x.id===id);
              if(already){
                onChange({...d,diagnosen:d.diagnosen.filter(x=>x.id!==id)});
              } else {
                const item=DIAG_LISTE.find(x=>x.id===id);
                onChange({...d,diagnosen:[...d.diagnosen,{
                  id,name:item.label,seitJahr:"",
                  vitdRisiko:item.vitd,phosphatRisiko:item.ph
                }]});
              }
            };
            const updDiagJahr=(id,val)=>{
              onChange({...d,diagnosen:d.diagnosen.map(x=>x.id===id?{...x,seitJahr:val}:x)});
            };
            const isChecked=(id)=>d.diagnosen.some(x=>x.id===id);
            const getJahr=(id)=>{const x=d.diagnosen.find(x=>x.id===id);return x?.seitJahr||"";};
            const checkedCount=d.diagnosen.filter(x=>DIAG_LISTE.some(l=>l.id===x.id)).length;

            return(
              <div style={{marginBottom:20}}>
                <div style={grpTSt}>🏥 Erkrankungen und Medikamente mit Einfluss auf Vitamin D und Knochen</div>
                <div style={{marginBottom:12,padding:"10px 13px",background:"#fff8f0",
                  border:"1px solid #e8c880",borderRadius:7,fontSize:13.5,lineHeight:1.7,color:"#5a3010"}}>
                  <strong>Bitte ankreuzen: Welches trifft bei Ihnen zu?</strong><br/>
                  <span style={{fontSize:12.5,color:"#7a5010"}}>
                    Diese Erkrankungen und Medikamente können Vitamin D im Körper vermindern oder
                    Phosphat aus den Knochen herauslösen – auch wenn man es selbst nicht bemerkt.
                  </span>
                  {checkedCount>0&&<span style={{marginLeft:8,fontWeight:700,color:"#d97706",fontSize:12}}>
                    ({checkedCount} angekreuzt)
                  </span>}
                </div>

                {["Erkrankungen","Medikamente"].map(kat=>(
                  <div key={kat} style={{marginBottom:16}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#6b5a4a",marginBottom:7,
                      display:"flex",alignItems:"center",gap:6}}>
                      <span>{kat==="Erkrankungen"?"🦠 Erkrankungen":"💊 Medikamente (die ich regelmäßig einnehme)"}</span>
                    </div>
                    {DIAG_LISTE.filter(x=>x.kat===kat).map(item=>{
                      const checked=isChecked(item.id);
                      return(
                        <div key={item.id} style={{
                          marginBottom:5,padding:"8px 11px",borderRadius:8,
                          background:checked?"#fffbf0":"white",
                          border:checked?"1.5px solid #f59e0b":"1px solid #e4d8c8",
                        }}>
                          <label style={{display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer",
                            userSelect:"none"}}>
                            <input type="checkbox" checked={checked}
                              onChange={()=>toggleDiag(item.id)}
                              style={{width:20,height:20,marginTop:1,accentColor:"#d97706",
                                cursor:"pointer",flexShrink:0}}/>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13.5,fontWeight:checked?700:400,
                                color:checked?"#92400e":"#2a1a0a",lineHeight:1.45}}>
                                {item.label}
                                {item.vitd&&<span style={{marginLeft:6,fontSize:10.5,padding:"1px 6px",
                                  borderRadius:8,background:"#fef3c7",color:"#92400e",fontWeight:700,
                                  whiteSpace:"nowrap"}}>Vit. D ↓</span>}
                                {item.ph&&<span style={{marginLeft:4,fontSize:10.5,padding:"1px 6px",
                                  borderRadius:8,background:"#fce7f3",color:"#831843",fontWeight:700,
                                  whiteSpace:"nowrap"}}>Phosphat ↓</span>}
                              </div>
                              <div style={{fontSize:11.5,color:"#8a7a6a",marginTop:2,lineHeight:1.4}}>
                                {item.hint}
                              </div>
                              {checked&&(
                                <div style={{marginTop:6,display:"flex",alignItems:"center",gap:8}}>
                                  <span style={{fontSize:12,color:"#7a5a3a",fontWeight:600}}>Bekannt seit:</span>
                                  <input type="number" min="1950" max="2025"
                                    placeholder="Jahr (kann leer bleiben)"
                                    value={getJahr(item.id)}
                                    onChange={e=>updDiagJahr(item.id,e.target.value)}
                                    onClick={e=>e.stopPropagation()}
                                    style={{...iSt,width:130,fontSize:12}}/>
                                </div>
                              )}
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {checkedCount>0&&(
                  <div style={{padding:"8px 12px",background:"#fffbf0",border:"1px solid #f59e0b",
                    borderRadius:7,fontSize:12,color:"#78350f",marginTop:4}}>
                    <strong>✓ Angekreuzt ({checkedCount}):</strong>{" "}
                    {d.diagnosen.filter(x=>DIAG_LISTE.some(l=>l.id===x.id)).map((x,i,arr)=>(
                      <span key={x.id||i}>
                        {x.name}{x.seitJahr?" ("+x.seitJahr+")":""}
                        {i<arr.length-1?", ":""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

                    {/* ── Frakturen ── */}
          <div style={{marginBottom:18}}>
            <div style={grpTSt}>🦴 Frühere Knochenbrüche</div>
            {d.fractures.length===0&&<div style={{fontSize:12,color:"#a09080",fontStyle:"italic",marginBottom:8}}>Noch keine Knochenbrüche eingetragen.</div>}
            {d.fractures.map((fr,i)=>(
              <div key={i} style={rowSt}>
                <span style={{fontSize:13,fontWeight:700,color:"#9b7a5a",minWidth:20,alignSelf:"flex-end",paddingBottom:6}}>{i+1}.</span>
                {fld("Knochen / Lokalisation",
                  <select style={{...selSt,minWidth:180}} value={fr.ort||""} onChange={e=>updFrac(i,"ort",e.target.value)}>
                    <option value="">Bitte wählen…</option>
                    {FRAKTUR_ORTE.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                )}
                {fld("Seite",
                  <select style={{...selSt,width:88}} value={fr.seite||""} onChange={e=>updFrac(i,"seite",e.target.value)}>
                    <option value="">–</option>
                    <option value="rechts">Rechts</option>
                    <option value="links">Links</option>
                    <option value="beidseitig">Beidseitig</option>
                    <option value="mittig">Mittig</option>
                  </select>
                )}
                {fld("Jahr (ca.)",
                  <input type="number" min="1920" max="2025" placeholder="z.B. 2018"
                    style={{...iSt,width:88}} value={fr.jahr||""} onChange={e=>updFrac(i,"jahr",e.target.value)}/>
                )}
                {fld("Ursache (opt.)",
                  <input placeholder="z.B. Sturz, spontan, Unfall"
                    style={{...iSt,minWidth:140,flex:1}} value={fr.ursache||""} onChange={e=>updFrac(i,"ursache",e.target.value)}/>
                )}
                <button onClick={()=>delFrac(i)} style={delBSt}>✕</button>
              </div>
            ))}
            <button onClick={addFrac} style={addBSt}>+ Knochenbruch hinzufügen</button>
          </div>

          {/* ── Operationen ── */}
          <div style={{marginBottom:18}}>
            <div style={grpTSt}>🏥 Frühere Operationen</div>
            {d.ops.length===0&&<div style={{fontSize:12,color:"#a09080",fontStyle:"italic",marginBottom:8}}>Noch keine Operationen eingetragen.</div>}
            {d.ops.map((op,i)=>(
              <div key={i} style={rowSt}>
                <span style={{fontSize:13,fontWeight:700,color:"#9b7a5a",minWidth:20,alignSelf:"flex-end",paddingBottom:6}}>{i+1}.</span>
                {fld("Art der Operation",
                  <input placeholder="z.B. Hüftprothese rechts, Wirbelsäulen-OP, Magenbypass, Gastrektomie"
                    style={{...iSt,minWidth:220,flex:1}} value={op.art||""} onChange={e=>updOp(i,"art",e.target.value)}/>
                )}
                {fld("Jahr",
                  <input type="number" min="1920" max="2025" placeholder="Jahr"
                    style={{...iSt,width:80}} value={op.jahr||""} onChange={e=>updOp(i,"jahr",e.target.value)}/>
                )}
                {fld("Klinik / Ort (opt.)",
                  <input placeholder="z.B. UKE Hamburg"
                    style={{...iSt,minWidth:130,flex:1}} value={op.klinik||""} onChange={e=>updOp(i,"klinik",e.target.value)}/>
                )}
                <button onClick={()=>delOp(i)} style={delBSt}>✕</button>
              </div>
            ))}
            <button onClick={addOp} style={addBSt}>+ Operation hinzufügen</button>
          </div>

          {/* ── Gynäkologische Anamnese (nur Frauen) ── */}
          {gender==="f"&&(
            <div>
              <div style={grpTSt}>♀ Gynäkologische Anamnese</div>

              <div style={{display:"flex",gap:18,flexWrap:"wrap",marginBottom:14,alignItems:"flex-start"}}>
                {fld("Erste Regelblutung (Menarche) – Alter in Jahren",
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <input type="number" min="8" max="22" placeholder="z.B. 13"
                      style={{...iSt,width:80}} value={d.menarche||""} onChange={e=>onChange({...d,menarche:e.target.value})}/>
                    <span style={{fontSize:12,color:"#9b8a7a"}}>Jahre</span>
                  </div>
                )}
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={lblSt}>Aktuelle Regelblutung vorhanden?</label>
                  <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                    {[{v:"ja",l:"Ja, regelmäßig"},{v:"unregelmaessig",l:"Unregelmäßig"},{v:"nein",l:"Nein (Menopause / Ausbleiben)"}].map(opt=>(
                      <label key={opt.v} style={{display:"flex",gap:5,alignItems:"center",cursor:"pointer",fontSize:13}}>
                        <input type="radio" name="am_menopause" value={opt.v}
                          checked={d.menoPause===opt.v} onChange={()=>onChange({...d,menoPause:opt.v})}/>
                        {opt.l}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {d.menoPause==="nein"&&(
                <div style={{padding:"12px 14px",background:"#fdf6f0",border:"1px solid #e8d4b8",borderRadius:8,marginBottom:14}}>
                  <div style={{fontWeight:700,fontSize:12,color:"#6b5a4a",marginBottom:10}}>Details zum Ende der Regelblutung</div>
                  <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"flex-start"}}>
                    {fld("Jahr der letzten Regelblutung",
                      <input type="number" min="1950" max="2025" placeholder="z.B. 2016"
                        style={{...iSt,width:110}} value={d.menoYear||""} onChange={e=>onChange({...d,menoYear:e.target.value})}/>
                    )}
                    {fld("Ursache des Endes der Regelblutung",
                      <select style={{...selSt,minWidth:280}} value={d.menoGrund||""} onChange={e=>onChange({...d,menoGrund:e.target.value})}>
                        <option value="">Bitte wählen…</option>
                        {MENOGRUNDE.map(g=><option key={g.v} value={g.v}>{g.l}</option>)}
                      </select>
                    )}
                    {d.menoGrund==="sonstige"&&fld("Sonstige Ursache (bitte beschreiben)",
                      <input placeholder="Bitte beschreiben…"
                        style={{...iSt,minWidth:180}} value={d.menoSonstige||""} onChange={e=>onChange({...d,menoSonstige:e.target.value})}/>
                    )}
                  </div>
                  <div style={{marginTop:10,fontSize:11.5,color:"#9b7a5a",background:"#fff8f0",borderRadius:5,padding:"5px 9px",borderLeft:"3px solid #e0b07a"}}>
                    <strong>Hinweis:</strong> Eine frühe Menopause (vor 45 J.) oder vorzeitige Ovarialinsuffizienz (vor 40 J.) ist ein eigenständiger Osteoporose-Risikofaktor (DVO 2023).
                  </div>
                </div>
              )}

              {/* Kinder */}
              <div style={{marginBottom:4}}>
                <div style={{fontWeight:700,fontSize:12,color:"#6b5a4a",marginBottom:8}}>
                  Schwangerschaften / Kinder
                </div>
                {d.kinder.length===0&&<div style={{fontSize:12,color:"#a09080",fontStyle:"italic",marginBottom:8}}>Noch keine Kinder eingetragen (oder keine Kinder / keine Schwangerschaften).</div>}
                {d.kinder.map((k,i)=>(
                  <div key={i} style={rowSt}>
                    <span style={{fontSize:13,fontWeight:700,color:"#9b7a5a",minWidth:20,alignSelf:"flex-end",paddingBottom:6}}>{i+1}.</span>
                    {fld("Geburtsjahr des Kindes",
                      <input type="number" min="1950" max="2025" placeholder="z.B. 1988"
                        style={{...iSt,width:100}} value={k.geburtsjahr||""} onChange={e=>updKind(i,"geburtsjahr",e.target.value)}/>
                    )}
                    {fld("Gestillt?",
                      <select style={{...selSt,width:100}} value={k.gestillt||""} onChange={e=>updKind(i,"gestillt",e.target.value)}>
                        <option value="">–</option>
                        <option value="nein">Nein</option>
                        <option value="ja">Ja</option>
                      </select>
                    )}
                    {k.gestillt==="ja"&&fld("Stilldauer (Monate)",
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <input type="number" min="0" max="36" placeholder="0"
                          style={{...iSt,width:64}} value={k.stilldauer||""} onChange={e=>updKind(i,"stilldauer",e.target.value)}/>
                        <span style={{fontSize:12,color:"#9b8a7a"}}>Monate</span>
                      </div>
                    )}
                    <button onClick={()=>delKind(i)} style={delBSt}>✕</button>
                  </div>
                ))}
                <button onClick={addKind} style={addBSt}>+ Kind / Geburt hinzufügen</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


/* ─── SECONDARY OSTEOPOROSIS PANEL ─── */
function SecondaryPanel({answers,sekProfileDb,sekUntersDb,sekQsDb,sekScoringDb,sekStatus,onSekStatus}){
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

            {/* ── Bekanntheits-Abfrage ── */}
            {(()=>{
              const st=sekStatus[sym]||{};
              const upd=(field,val)=>onSekStatus&&onSekStatus(prev=>({...prev,[sym]:{...(prev[sym]||{}),bekannt:st.bekannt||"",[field]:val}}));
              const updB=(val)=>onSekStatus&&onSekStatus(prev=>({...prev,[sym]:{...(prev[sym]||{}),bekannt:val}}));
              return(
                <div style={{margin:"10px 0",padding:"10px 12px",background:"#f0f9f4",border:"1px solid #86efac",borderRadius:7}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#166534",marginBottom:8}}>
                    📋 Ist diese Erkrankung bereits bekannt und diagnostiziert?
                  </div>
                  <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap",marginBottom:st.bekannt==="ja"?8:0}}>
                    {[{v:"ja",l:"Ja, bekannt"},{v:"nein",l:"Nein / unklar"},{v:"verdacht",l:"Klinischer Verdacht"}].map(opt=>(
                      <label key={opt.v} style={{display:"flex",gap:5,alignItems:"center",cursor:"pointer",fontSize:13}}>
                        <input type="radio" name={"sek_bekannt_"+sym} value={opt.v}
                          checked={st.bekannt===opt.v} onChange={()=>updB(opt.v)}/>
                        {opt.l}
                      </label>
                    ))}
                  </div>
                  {st.bekannt==="ja"&&(
                    <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end",marginTop:6}}>
                      <div style={{display:"flex",flexDirection:"column",gap:3}}>
                        <label style={{fontSize:11.5,fontWeight:600,color:"#166534"}}>Bekannt seit (Jahr / Monat)</label>
                        <input type="text" placeholder="z.B. 2019, März 2022"
                          style={{padding:"5px 8px",border:"1px solid #86efac",borderRadius:5,fontSize:12,fontFamily:"inherit",background:"white",width:140}}
                          value={st.seitWann||""} onChange={e=>upd("seitWann",e.target.value)}/>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:3,flex:1,minWidth:160}}>
                        <label style={{fontSize:11.5,fontWeight:600,color:"#166534"}}>Aktuelle Behandlung / Therapie</label>
                        <input type="text" placeholder="z.B. Vitamin D, keine Therapie, Calcitriol + Phosphat"
                          style={{padding:"5px 8px",border:"1px solid #86efac",borderRadius:5,fontSize:12,fontFamily:"inherit",background:"white",width:"100%"}}
                          value={st.behandlung||""} onChange={e=>upd("behandlung",e.target.value)}/>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

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
            {(()=>{
              const sc=(sekScoringDb&&sekScoringDb[sym]);
              if(!sc||!(sc.stufen||[]).length) return null;
              return(
                <div className="sek-scoring-box">
                  <div className="sek-scoring-title">
                    {sc.url
                      ?<a href={sc.url} target="_blank" rel="noopener noreferrer"
                          style={{color:"#3a1a6a",fontWeight:700,textDecoration:"underline",fontSize:"inherit"}}>
                          📊 {sc.titel||"Klassifikation"}
                        </a>
                      :<span>📊 {sc.titel||"Klassifikation"}</span>
                    }
                    {sc.quelle&&(
                      <div style={{marginTop:4,display:"flex",flexWrap:"wrap",gap:4,alignItems:"center"}}>
                        <LitLinks url={sc.url} label={sc.quelle}/>
                      </div>
                    )}
                  </div>
                  <div className="sek-scoring-grid">
                    {sc.stufen.map((st,si)=>(
                      <div key={si} className="sek-scoring-row">
                        <span className="sek-scoring-name">{st.name}</span>
                        <span className="sek-scoring-desc">{st.beschreibung}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
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
            <strong>{[s.patient?.nachname||s.patient?.name,s.patient?.vorname].filter(Boolean).join(", ")||"(kein Name)"}</strong>
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
  // Determine validation state only when date looks complete (8 digits entered)
  const digits=(value||"").replace(/\D/g,"").length;
  const complete=digits>=8;

  let borderColor="var(--CM)";
  let errMsg=null;
  if(complete){
    if(age===null){
      errMsg="Ungültiges Datum – bitte prüfen.";
      borderColor="#c0392b";
    } else if(age<18){
      errMsg=`Alter ${age} Jahre – Patienten müssen mindestens 18 Jahre alt sein.`;
      borderColor="#c0392b";
    } else if(age>130){
      errMsg=`Alter ${age} Jahre – Maximalalter beträgt 130 Jahre.`;
      borderColor="#c0392b";
    } else {
      borderColor="#2a7a2a"; // gültig
    }
  }

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
      {errMsg&&(
        <div style={{fontSize:11,color:"#c0392b",marginTop:3,fontWeight:600}}>
          ⚠ {errMsg}
        </div>
      )}
      {!errMsg&&complete&&(
        <div style={{fontSize:11,color:"#2a7a2a",marginTop:3}}>
          ✓ Alter: {age} Jahre
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

/* ═══ PASSWORT-DOPPELEINGABE ═══════════════════════════════════════════════ */
function PwDoppelInput({value, onChange, patientId, onReset}){
  const[show,setShow]=useState(false);
  const[pw2,setPw2]=useState("");
  const mismatch = pw2.length>0 && pw2!==value;
  const match    = pw2.length>0 && pw2===value && value.length>0;

  const inStyle=(err)=>({
    flex:1, padding:"8px 11px",
    border:"1.5px solid "+(err?"#c0392b":match?"#2a7a2a":"var(--CM)"),
    borderRadius:5, fontSize:13.5, color:"var(--D)", outline:"none",
    fontFamily:"'Source Sans 3',sans-serif", boxSizing:"border-box", width:"100%"
  });

  return(
    <div>
      <label style={{display:"block",marginBottom:8,fontWeight:600,fontSize:13,color:"var(--D)"}}>
        Passwort{" "}
        <span style={{fontWeight:400,color:"#9a8a7a",fontSize:12}}>
          (optional – zum Fortsetzen bei Unterbrechung)
        </span>
      </label>

      <div style={{marginBottom:8}}>
        <div style={{fontSize:11,fontWeight:700,color:"#7a5a38",marginBottom:4,
          textTransform:"uppercase",letterSpacing:".4px"}}>Passwort eingeben</div>
        <div style={{display:"flex",gap:6}}>
          <input type={show?"text":"password"} value={value}
            onChange={e=>onChange(e.target.value)}
            placeholder="Passwort…"
            style={inStyle(false)}/>
          <button type="button" onClick={()=>setShow(v=>!v)}
            style={{padding:"8px 11px",background:"#f8f4ee",border:"1px solid #d8c8b0",
              borderRadius:5,cursor:"pointer",fontSize:13,fontWeight:600,flexShrink:0,
              color:"#5a4a3a",fontFamily:"'Source Sans 3',sans-serif",whiteSpace:"nowrap"}}>
            {show?"verbergen":"anzeigen"}
          </button>
        </div>
      </div>

      <div style={{marginBottom:6}}>
        <div style={{fontSize:11,fontWeight:700,color:"#7a5a38",marginBottom:4,
          textTransform:"uppercase",letterSpacing:".4px"}}>Passwort wiederholen</div>
        <div style={{display:"flex",gap:6}}>
          <input type={show?"text":"password"} value={pw2}
            onChange={e=>setPw2(e.target.value)}
            placeholder="Passwort nochmal eingeben…"
            style={inStyle(mismatch)}/>
          <button type="button" onClick={()=>setShow(v=>!v)}
            style={{padding:"8px 11px",background:"#f8f4ee",border:"1px solid #d8c8b0",
              borderRadius:5,cursor:"pointer",fontSize:13,fontWeight:600,flexShrink:0,
              color:"#5a4a3a",fontFamily:"'Source Sans 3',sans-serif",whiteSpace:"nowrap"}}>
            {show?"verbergen":"anzeigen"}
          </button>
        </div>
        {mismatch&&<div style={{fontSize:11,color:"#c0392b",marginTop:3,fontWeight:600}}>
          ⚠ Passwörter stimmen nicht überein.</div>}
        {match&&<div style={{fontSize:11,color:"#2a7a2a",marginTop:3}}>
          ✓ Passwörter stimmen überein.</div>}
      </div>

      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginTop:4}}>
        {patientId&&onReset&&(
          <button type="button"
            onClick={()=>window.confirm("Passwort wirklich zurücksetzen?")&&onReset()}
            style={{padding:"6px 13px",background:"#fff8f0",border:"1px solid #d4a060",
              borderRadius:5,cursor:"pointer",fontSize:12,color:"#7a4a10",
              fontFamily:"'Source Sans 3',sans-serif"}}>
            Passwort zurücksetzen
          </button>
        )}
        {patientId&&<div style={{fontSize:11,color:"#6a9a6a"}}>
          ✓ In Datenbank · ID: {patientId.slice(0,8)}…
          <span style={{marginLeft:8,cursor:"pointer",color:"#4a7a8a",textDecoration:"underline"}}
            onClick={()=>cookieSet("osteo_pat",patientId)}>Cookie setzen</span>
        </div>}
      </div>
    </div>
  );
}

/* ═══ RESUME MODAL KOMPONENTE ══════════════════════════════════════════════ */
function ResumeModal({pat,sessions,today,onResume,onNew,onForget}){
  const hasPw=!!pat.passwortHash;
  const[pwIn,setPwIn]=useState("");
  const[err,setErr]=useState(false);

  const tryLogin=()=>{
    if(!hasPw||hashPw(pwIn)===pat.passwortHash){
      const bs=(sessions||[])
        .filter(s=>s.patientId===pat.id)
        .sort((a,b)=>b.id.localeCompare(a.id));
      const s=bs[0]||null;
      if(s) onResume(s,pat.id,hasPw?pwIn:"");
      else   onNew();
    } else {
      setErr(true);
    }
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:5000,
      display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"white",borderRadius:14,padding:"30px 28px",maxWidth:420,
        width:"100%",boxShadow:"0 12px 50px rgba(0,0,0,.35)",textAlign:"center"}}
        onClick={e=>e.stopPropagation()}>

        <div style={{fontSize:36,marginBottom:8}}>👋</div>
        <div style={{fontSize:18,fontWeight:700,color:"#1a1208",marginBottom:6,
          fontFamily:"'Playfair Display',serif"}}>
          Willkommen zurück!
        </div>
        <div style={{fontSize:14,color:"#5a4a3a",marginBottom:18,lineHeight:1.7,
          background:"#fdf9f4",padding:"10px 14px",borderRadius:8}}>
          <strong style={{fontSize:15}}>{pat.nachname}{pat.vorname&&", "+pat.vorname}</strong><br/>
          {pat.geburtsdatum&&<span>* {pat.geburtsdatum}<br/></span>}
          <span style={{fontSize:12,color:"#9a8a7a"}}>
            Letzter Zugriff: {pat.letzterZugriff
              ?new Date(pat.letzterZugriff).toLocaleDateString("de-DE"):"–"}
          </span>
        </div>

        {hasPw&&(
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:12,fontWeight:700,color:"#5a4a3a",
              marginBottom:6,textTransform:"uppercase",letterSpacing:".5px"}}>
              🔒 Passwort eingeben
            </label>
            <input type="password" value={pwIn} autoFocus
              onChange={e=>{setPwIn(e.target.value);setErr(false);}}
              onKeyDown={e=>e.key==="Enter"&&tryLogin()}
              placeholder="Ihr Passwort…"
              style={{width:"100%",padding:"11px 12px",
                border:"1.5px solid "+(err?"#c0392b":"#d0c0a8"),
                borderRadius:7,fontSize:14,textAlign:"center",fontFamily:"inherit",
                outline:"none",boxSizing:"border-box"}}/>
            {err&&<div style={{color:"#c0392b",fontSize:12.5,marginTop:5,fontWeight:600}}>
              ✗ Falsches Passwort. Bitte erneut versuchen.
            </div>}
          </div>
        )}

        <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}>
          <button onClick={tryLogin}
            style={{padding:"12px",background:"#2c1f0e",color:"#e8d8b0",border:"none",
              borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
              letterSpacing:".3px"}}>
            {hasPw?"🔓 Anmelden & Fragebogen fortsetzen":"▶ Fragebogen fortsetzen"}
          </button>
          <button onClick={onNew}
            style={{padding:"10px",background:"white",color:"#5a4a3a",
              border:"1.5px solid #d0c0a8",borderRadius:8,fontSize:13,
              cursor:"pointer",fontFamily:"inherit"}}>
            ＋ Neuen Fragebogen beginnen
          </button>
          <button onClick={onForget}
            style={{padding:"8px",background:"none",border:"none",color:"#b0a090",
              fontSize:11.5,cursor:"pointer",fontFamily:"inherit",marginTop:2}}>
            🍪 Cookie löschen – nicht mehr vorschlagen
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ PATIENTENLISTE KOMPONENTE (Arzt-Zugang) ══════════════════════════════ */
function PatientenListe({patients,sessions,onSelectPatient,onDeletePatient,onResetPw}){
  const[q,setQ]=useState({nachname:"",vorname:"",geburtsdatum:"",zugriffAb:"",sort:"zugriff"});
  const upQ=(k,v)=>setQ(p=>({...p,[k]:v}));

  const filtered=patients
    .filter(p=>{
      if(q.nachname&&!((p.nachname||"").toLowerCase().includes(q.nachname.toLowerCase())))return false;
      if(q.vorname&&!((p.vorname||"").toLowerCase().includes(q.vorname.toLowerCase())))return false;
      if(q.geburtsdatum&&!(p.geburtsdatum||"").includes(q.geburtsdatum))return false;
      if(q.zugriffAb&&(p.letzterZugriff||"").slice(0,10)<q.zugriffAb)return false;
      return true;
    })
    .sort((a,b)=>{
      if(q.sort==="name") return (a.nachname||"").localeCompare(b.nachname||"");
      if(q.sort==="geb")  return (a.geburtsdatum||"").localeCompare(b.geburtsdatum||"");
      // Default: letzter Zugriff
      return (b.letzterZugriff||"").localeCompare(a.letzterZugriff||"");
    });

  const patBefunde=(pid)=>sessions.filter(s=>s.patientId===pid);
  const lastBefund=(pid)=>{const bs=patBefunde(pid);return bs.length?bs.sort((a,b)=>b.id.localeCompare(a.id))[0]:null;};
  const riskColor=(cat)=>({top:"#fee2e2",high:"#fef3c7",mod:"#fff0e0",low:"#f0fdf4"}[cat]||"white");
  const riskBadgeColor=(cat)=>({top:"#b91c1c",high:"#d97706",mod:"#9a4a10",low:"#065f46"}[cat]||"#9a8a7a");

  const iSt={padding:"6px 10px",border:"1.5px solid #d8c8b0",borderRadius:5,fontSize:12.5,
    fontFamily:"'Source Sans 3',sans-serif",outline:"none",background:"white",height:36,boxSizing:"border-box"};

  return(
    <div style={{padding:"8px 14px 14px"}}>
      {/* Suchleiste */}
      <div style={{background:"#f8f4ee",border:"1px solid #e0d0b8",borderRadius:8,
        padding:"12px 14px",marginBottom:14,display:"flex",flexWrap:"wrap",gap:10,alignItems:"flex-end"}}>
        <div style={{display:"flex",flexDirection:"column",gap:3,flex:"1 1 120px"}}>
          <label style={{fontSize:11,fontWeight:700,color:"#7a5a38",textTransform:"uppercase",letterSpacing:".5px"}}>Nachname</label>
          <input style={iSt} value={q.nachname} onChange={e=>upQ("nachname",e.target.value)} placeholder="Suche…"/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:3,flex:"1 1 120px"}}>
          <label style={{fontSize:11,fontWeight:700,color:"#7a5a38",textTransform:"uppercase",letterSpacing:".5px"}}>Vorname</label>
          <input style={iSt} value={q.vorname} onChange={e=>upQ("vorname",e.target.value)} placeholder="Suche…"/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:3,flex:"1 1 100px"}}>
          <label style={{fontSize:11,fontWeight:700,color:"#7a5a38",textTransform:"uppercase",letterSpacing:".5px"}}>Geburtsdatum</label>
          <input style={iSt} value={q.geburtsdatum} onChange={e=>upQ("geburtsdatum",e.target.value)} placeholder="TT.MM.JJJJ"/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          <label style={{fontSize:11,fontWeight:700,color:"#7a5a38",textTransform:"uppercase",letterSpacing:".5px"}}>Letzter Zugriff ab</label>
          <input type="date" style={iSt} value={q.zugriffAb||""} onChange={e=>upQ("zugriffAb",e.target.value)}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          <label style={{fontSize:11,fontWeight:700,color:"#7a5a38",textTransform:"uppercase",letterSpacing:".5px"}}>Sortierung</label>
          <select style={iSt} value={q.sort} onChange={e=>upQ("sort",e.target.value)}>
            <option value="zugriff">Letzter Zugriff ↓</option>
            <option value="name">Name A–Z</option>
            <option value="geb">Geburtsdatum</option>
          </select>
        </div>
        <div style={{fontSize:12,color:"#9a8a7a",alignSelf:"flex-end",paddingBottom:6}}>
          {filtered.length} / {patients.length} Patient{patients.length!==1?"en":""}
        </div>
      </div>

      {patients.length===0&&(
        <div style={{textAlign:"center",padding:"30px",color:"#9a8a7a",fontSize:14}}>
          Noch keine Patienten in der Datenbank.<br/>
          <span style={{fontSize:12}}>Patienten werden beim ersten Speichern automatisch angelegt.</span>
        </div>
      )}

      {/* Patientenkarten */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map(pat=>{
          const lb=lastBefund(pat.id);
          const anzBefunde=patBefunde(pat.id).length;
          const riskCat=lb?.riskSnapshot?.cat||null;
          return(
            <div key={pat.id} style={{
              border:"1.5px solid #e0d0b8",borderRadius:9,background:"white",
              overflow:"hidden",boxShadow:"0 1px 4px rgba(44,31,14,.07)"}}>
              {/* Header */}
              <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",
                padding:"10px 14px",background:riskCat?riskColor(riskCat):"white",
                borderBottom:"1px solid #e8d8c0"}}>
                <div style={{flex:1,minWidth:160}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,
                    fontSize:15,color:"#2c1f0e"}}>
                    {pat.nachname||"–"}{pat.vorname&&", "+pat.vorname}
                  </div>
                  <div style={{fontSize:12,color:"#7a5a38",marginTop:2}}>
                    {pat.geburtsdatum&&<span>* {pat.geburtsdatum}</span>}
                    {pat.email&&<span style={{marginLeft:10}}>✉ {pat.email}</span>}
                  </div>
                </div>
                {riskCat&&(
                  <div style={{padding:"3px 10px",borderRadius:5,fontSize:11,fontWeight:700,
                    background:riskBadgeColor(riskCat),color:"white"}}>
                    {catLabel(riskCat)}
                  </div>
                )}
                <div style={{fontSize:11,color:"#9a8a7a",textAlign:"right"}}>
                  <div>{anzBefunde} Befund{anzBefunde!==1?"e":""}</div>
                  {pat.letzterZugriff&&<div>Zugriff: {new Date(pat.letzterZugriff).toLocaleDateString("de-DE")}</div>}
                  {pat.passwortHash&&<div style={{color:"#6a9a6a"}}>🔒 PW gesetzt</div>}
                </div>
              </div>

              {/* Befund-Vorschau + Aktionen */}
              <div style={{padding:"8px 14px",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                {lb&&(
                  <div style={{fontSize:11.5,color:"#5a4a3a",flex:1}}>
                    Letzter Befund: {lb.fillDate} · 
                    {lb.riskSnapshot?.cF!=null&&<span> ×{lb.riskSnapshot.cF.toFixed(2)} komb. Faktor</span>}
                    {lb.gender&&<span> · {lb.gender==="f"?"♀":"♂"}</span>}
                  </div>
                )}
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <button onClick={()=>onSelectPatient(pat)}
                    style={{padding:"6px 13px",background:"#2c1f0e",color:"#e8d8b0",
                      border:"none",borderRadius:5,cursor:"pointer",fontSize:12,
                      fontWeight:600,fontFamily:"'Source Sans 3',sans-serif"}}>
                    📂 Befunde laden
                  </button>
                  <button onClick={()=>onResetPw(pat)}
                    style={{padding:"6px 11px",background:"#f0f8ff",color:"#2a4a8a",
                      border:"1px solid #aac0e0",borderRadius:5,cursor:"pointer",
                      fontSize:12,fontFamily:"'Source Sans 3',sans-serif"}}>
                    🔓 PW reset
                  </button>
                  <button onClick={()=>{
                      if(window.confirm(`Patient "${pat.nachname}, ${pat.vorname}" und alle Befunde wirklich löschen?`))
                        onDeletePatient(pat.id);
                    }}
                    style={{padding:"6px 11px",background:"#fff0f0",color:"#b91c1c",
                      border:"1px solid #fca5a5",borderRadius:5,cursor:"pointer",
                      fontSize:12,fontFamily:"'Source Sans 3',sans-serif"}}>
                    ✕ Löschen
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── BesonderheitPanel: Besonderheiten mit Edit-Toggle (Hook-konform) ── */

/* ── RichTextField: WYSIWYG-Editor mit Link-Einfüge-Dialog ── */
function RichTextField({value,onChange,placeholder,style,editMode=true}){
  const editorRef=useRef(null);
  const[showLink,setShowLink]=useState(false);
  const[linkUrl,setLinkUrl]=useState("");
  const[linkText,setLinkText]=useState("");
  const savedSel=useRef(null);

  useEffect(()=>{
    if(!editMode||!editorRef.current)return;
    // Nur initialisieren wenn leer oder beim ersten Öffnen
    if(editorRef.current.innerHTML!==(value||""))
      editorRef.current.innerHTML=value||"";
  },[editMode]);

  const saveSel=()=>{
    const s=window.getSelection();
    if(s&&s.rangeCount)savedSel.current=s.getRangeAt(0).cloneRange();
  };
  const restoreSel=()=>{
    if(!savedSel.current||!editorRef.current)return;
    editorRef.current.focus();
    const s=window.getSelection();
    s.removeAllRanges();
    s.addRange(savedSel.current);
  };
  const cmd=(c)=>{
    editorRef.current.focus();
    document.execCommand(c,false,null);
    onChange({target:{value:editorRef.current.innerHTML}});
  };
  const insertLink=()=>{
    restoreSel();
    if(linkUrl){
      const txt=linkText||linkUrl;
      document.execCommand("insertHTML",false,
        `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${txt}</a> `);
      onChange({target:{value:editorRef.current.innerHTML}});
    }
    setShowLink(false);setLinkUrl("");setLinkText("");
  };

  if(!editMode){
    if(!value)return<span style={{color:"#ccc",fontStyle:"italic",fontSize:11.5}}>{placeholder||""}</span>;
    return<div style={{...style,lineHeight:1.55,fontSize:12,wordBreak:"break-word"}}
      dangerouslySetInnerHTML={{__html:value}}/>;
  }
  const btnSt={fontSize:11,padding:"1px 7px",background:"#fff",border:"1px solid #d4c4a8",
    borderRadius:3,cursor:"pointer",fontFamily:"inherit",lineHeight:1.5};
  return(
    <div style={{position:"relative"}}>
      {/* Toolbar */}
      <div style={{display:"flex",gap:3,padding:"3px 4px",background:"#f4ede0",
        borderRadius:"4px 4px 0 0",border:"1.5px solid #d4c4a8",borderBottom:"none",flexWrap:"wrap"}}>
        <button style={{...btnSt,fontWeight:700}} title="Fett"
          onMouseDown={e=>{e.preventDefault();cmd("bold");}}>B</button>
        <button style={{...btnSt,fontStyle:"italic"}} title="Kursiv"
          onMouseDown={e=>{e.preventDefault();cmd("italic");}}>I</button>
        <button style={{...btnSt,textDecoration:"underline"}} title="Unterstrichen"
          onMouseDown={e=>{e.preventDefault();cmd("underline");}}>U</button>
        <button style={{...btnSt,background:"#e0eaff",borderColor:"#93c5fd",color:"#1e40af"}}
          title="Link einfügen"
          onMouseDown={e=>{e.preventDefault();saveSel();setLinkText("");setLinkUrl("");setShowLink(v=>!v);}}>
          🔗 Link
        </button>
        {(value||"").includes("<a ")&&(
          <button style={{...btnSt,background:"#fff0f0",borderColor:"#fca5a5",color:"#dc2626"}}
            title="Link entfernen"
            onMouseDown={e=>{e.preventDefault();cmd("unlink");}}>
            ✂ Link entf.
          </button>
        )}
      </div>
      {/* Link-Dialog */}
      {showLink&&(
        <div style={{position:"absolute",zIndex:999,top:30,left:0,background:"#fff",
          border:"1.5px solid #93c5fd",borderRadius:8,padding:"10px 12px",
          boxShadow:"0 6px 24px rgba(0,0,0,.18)",display:"flex",flexDirection:"column",
          gap:6,minWidth:300,maxWidth:460}}>
          <div style={{fontSize:11,fontWeight:700,color:"#1e40af",marginBottom:2}}>
            🔗 Literatur-Link einfügen
          </div>
          <label style={{fontSize:10,color:"#8a7a6a",fontWeight:600}}>
            Anzeigetext (Autoren, Titel – leer = markierter Text)
          </label>
          <input value={linkText} onChange={e=>setLinkText(e.target.value)}
            placeholder="z. B. Ross et al. 2016 – ATA Guidelines"
            style={{padding:"4px 8px",border:"1px solid #d4c4a8",borderRadius:4,
              fontSize:12,fontFamily:"inherit",outline:"none"}}/>
          <label style={{fontSize:10,color:"#8a7a6a",fontWeight:600}}>
            URL / DOI-Link
          </label>
          <input value={linkUrl} onChange={e=>setLinkUrl(e.target.value)}
            placeholder="https://doi.org/10.xxxx/..."
            onKeyDown={e=>e.key==="Enter"&&insertLink()}
            style={{padding:"4px 8px",border:"1px solid #d4c4a8",borderRadius:4,
              fontSize:12,fontFamily:"inherit",outline:"none"}}/>
          <div style={{display:"flex",gap:6,justifyContent:"flex-end",marginTop:2}}>
            <button onClick={()=>setShowLink(false)}
              style={{fontSize:11,padding:"2px 10px",background:"#f3f4f6",
                border:"1px solid #d1d5db",borderRadius:4,cursor:"pointer",fontFamily:"inherit"}}>
              Abbrechen
            </button>
            <button onClick={insertLink} disabled={!linkUrl}
              style={{fontSize:11,padding:"2px 12px",
                background:linkUrl?"#1e40af":"#b0c4e8",color:"#fff",border:"none",
                borderRadius:4,cursor:linkUrl?"pointer":"default",fontFamily:"inherit"}}>
              ✓ Einfügen
            </button>
          </div>
        </div>
      )}
      {/* Editierbares Feld */}
      <div ref={editorRef} contentEditable suppressContentEditableWarning
        onInput={e=>onChange({target:{value:e.currentTarget.innerHTML}})}
        onBlur={e=>onChange({target:{value:e.currentTarget.innerHTML}})}
        style={{...style,outline:"none",borderRadius:"0 0 5px 5px",
          border:"1.5px solid #d4c4a8",borderTop:"none",
          minHeight:28,padding:"5px 10px",lineHeight:1.6,
          wordBreak:"break-word",caretColor:"#1a4a8f",fontSize:12}}/>
    </div>
  );
}

function BesonderheitPanel({med,onUpdate}){
  const[edit,setEdit]=React.useState(false);
  return(
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
        <span style={{fontSize:11.5,fontWeight:700,color:"#6b5a4a"}}>
          📚 Besonderheiten / Vergleiche
        </span>
        <button onClick={()=>setEdit(v=>!v)}
          style={{fontSize:10,padding:"2px 8px",borderRadius:5,cursor:"pointer",
            border:"1px solid #c8b090",background:edit?"#fce7c0":"#fffaf4",
            color:"#7a5a3a",fontFamily:"inherit"}}>
          {edit?"✓ Fertig":"✏ Bearbeiten"}
        </button>
      </div>
      {edit
        ?<AutoTextarea placeholder="Wirkungsvergleiche, Studiendaten, Literatur mit Links"
            minRows={3} maxRows={14}
            style={{width:"100%",padding:"6px 8px",
              border:"1.5px solid #c8a84a",borderRadius:5,fontSize:12,
              fontFamily:"inherit",outline:"none",lineHeight:1.6}}
            value={med.besonderheit||""}
            onChange={e=>onUpdate(e.target.value)}/>
        :<div style={{background:"#f8f4ee",border:"1px solid #d8c8b0",borderRadius:5,
            padding:"8px 10px",fontSize:12,lineHeight:1.9,color:"#2a1a0a",
            whiteSpace:"pre-wrap",minHeight:30}}>
          {med.besonderheit
            ?med.besonderheit.split(new RegExp("(https?://[^\s\n]+)","g")).map((part,pi)=>
                new RegExp("^https?://").test(part)
                  ?<LitLinks key={pi} url={part}/>
                  :<span key={pi}>{part}</span>
              )
            :<span style={{color:"#aaa",fontStyle:"italic"}}>Noch keine Besonderheiten – auf ✏ Bearbeiten klicken.</span>
          }
        </div>
      }
    </div>
  );
}

/* ── Unpaywall-Cache (verhindert Doppel-Requests für gleiche DOI) ── */
const _oaCache={};

/* ── LitLinks: direkter Link + Live-Unpaywall-Check auf freies PDF ── */
function LitLinks({url,label}){
  if(!url)return null;
  const [oaUrl,setOaUrl]=useState(undefined); // undefined=loading, null=nicht frei, string=frei
  const isDoi=url.includes("doi.org");
  const isPubmed=url.includes("pubmed")||url.includes("ncbi.nlm.nih.gov");
  const doiId=isDoi?url.replace(/.*doi\.org\//,""):"";
  const pubmedUrl=isDoi
    ?"https://pubmed.ncbi.nlm.nih.gov/?term="+encodeURIComponent(doiId)
    :url;
  const shortLabel=label||(isDoi?"doi:"+doiId:url.replace(/^https?:\/\//,""));

  useEffect(()=>{
    if(!isDoi){setOaUrl(null);return;}
    // Cache-Treffer
    if(doiId in _oaCache){setOaUrl(_oaCache[doiId]);return;}
    // Unpaywall-API-Abfrage (kostenlos, kein Key nötig)
    const email="ost-check@orthopaedie-langenhorn.de";
    fetch("https://api.unpaywall.org/v2/"+encodeURIComponent(doiId)+"?email="+email,
      {signal:AbortSignal.timeout?AbortSignal.timeout(6000):undefined})
      .then(r=>r.ok?r.json():null)
      .then(d=>{
        const best=d?.best_oa_location;
        const pdf=best?.url_for_pdf||best?.url||null;
        _oaCache[doiId]=pdf;
        setOaUrl(pdf);
      })
      .catch(()=>{_oaCache[doiId]=null;setOaUrl(null);});
  },[url]);

  // Kompakt: eine Zeile – Label als Link + OA/PubMed-Badge
  const badgeSt=(bg,col,bdr)=>({
    display:"inline-flex",alignItems:"center",gap:2,padding:"1px 6px",flexShrink:0,
    background:bg,color:col,border:`1px solid ${bdr}`,
    borderRadius:4,fontSize:10,fontWeight:700,textDecoration:"none",whiteSpace:"nowrap"});
  return(
    <span style={{display:"inline-flex",flexWrap:"nowrap",gap:4,alignItems:"center",
      maxWidth:"100%",overflow:"hidden"}}>
      <a href={url} target="_blank" rel="noopener noreferrer" title={label||url}
        style={label
          ?{fontSize:10.5,color:"#4a2a8a",fontWeight:600,textDecoration:"underline",
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",minWidth:0}
          :{fontFamily:"'Courier New',monospace",fontSize:10,color:"#1a5a9a",
            textDecoration:"underline",overflow:"hidden",textOverflow:"ellipsis",
            whiteSpace:"nowrap",minWidth:0}}>
        {shortLabel}
      </a>
      {oaUrl===undefined&&isDoi&&<span style={{fontSize:9,color:"#aaa",flexShrink:0}}>⏳</span>}
      {oaUrl&&(
        <a href={oaUrl} target="_blank" rel="noopener noreferrer"
          style={badgeSt("#dcfce7","#166534","#86efac")}>📄 PDF</a>
      )}
      {oaUrl===null&&isDoi&&(
        <a href={pubmedUrl} target="_blank" rel="noopener noreferrer"
          style={badgeSt("#fef3c7","#92400e","#fcd34d")}>🔍</a>
      )}
      {oaUrl===null&&isPubmed&&!isDoi&&(
        <a href={url} target="_blank" rel="noopener noreferrer"
          style={badgeSt("#dbeafe","#1e40af","#93c5fd")}>🔗</a>
      )}
    </span>
  );
}

function AdminPanel({diagDb,sekDiagDb,sekProfileDb,sekUntersDb,sekQsDb,sekScoringDb,osteoTherapieDb,onSave,onSaveSek,onSaveSekProfile,onSaveSekUnters,onSaveSekQs,onSaveSekScoring,onSaveTherapieDb,onClose,
  // Auswertung props
  gender,answers,patient,anamnese,therapieHistory,lh,onSaveLh,sessions,sekStatus,setSekStatus,
  onExportPdf,onExportTxt,onLoadSession,onDeleteSession,
  patients,onDeletePatient,onResetPatientPw,
  initialTab,diff}){
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
  const[activeTab,setActiveTab]=useState(initialTab||"auswertung"); // "auswertung" | "risiko" | "sek" | "therapie"
  const[editModeSek,setEditModeSek]=useState(false);
  const[editModeRisiko,setEditModeRisiko]=useState(false);
  const[editModeTherapie,setEditModeTherapie]=useState(false);
  const[patSearch,setPatSearch]=useState("");
  const[patSortCol,setPatSortCol]=useState("lastDate");
  const[patSortDir,setPatSortDir]=useState("desc");
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
  const[sekScoringDraft,setSekScoringDraft]=useState(()=>({...buildSekScoringDefaults(),...(sekScoringDb||{})}));
  const[sekEditMode,setSekEditMode]=useState({});
  const[therapieEditMode,setTherapieEditMode]=useState(false);
  const[therapieDraft,setTherapieDraft]=useState(()=>{
    const base=buildOsteoTherapieDefaults();
    const over=osteoTherapieDb||[];
    // Merge overrides by id
    return base.map(m=>{const ov=over.find(x=>x.id===m.id);return ov?{...m,...ov}:m;});
  });
  const[therapieExpanded,setTherapieExpanded]=useState({});
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
    if(activeTab==="auswertung"||activeTab==="verlauf"){ onClose(); return; }
    if(activeTab==="risiko"){ onSave(draft); }
    else if(activeTab==="therapie"){ onSaveTherapieDb(therapieDraft); }
    else {
      onSaveSek(sekDraft);
      onSaveSekProfile(sekProfileDraft);
      onSaveSekUnters(sekUntersDraft);
      onSaveSekQs(sekQsDraft);
      onSaveSekScoring(sekScoringDraft);
    }
    onClose();
  };
  const handleReset=()=>{
    if(activeTab==="auswertung"||activeTab==="verlauf"){ return; }
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
    } else if(activeTab==="therapie"){
      if(window.confirm("Osteoporose-Therapie-Datenbank auf Standardwerte zurücksetzen?")){
        setTherapieDraft(buildOsteoTherapieDefaults());
      }
    } else {
      if(window.confirm("Alle Sekundärform-Daten auf Standardwerte zurücksetzen?")){
        setSekDraft(()=>{const d={};for(const id of sekAllIds)d[id]={...SEK_DIAG_DB_DEFAULTS[id]};return d;});
        setSekProfileDraft(buildSekProfileDefaults());
        setSekUntersDraft(buildSekUntersDefaults());
        setSekQsDraft(buildSekQsDefaults());
        setSekScoringDraft(buildSekScoringDefaults());
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
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            <span className="admin-head-title">🩺 Arzt-Zugang</span>
            <span style={{fontSize:11,color:"#c8a070",fontWeight:400,letterSpacing:".3px"}}>Auswertung · Patienten · Einstellungen · Datenbank</span>
          </div>
          <button className="viewer-close" onClick={onClose}>×</button>
        </div>
        {!unlocked?(
          <div className="admin-pin-wrap">
            <div style={{textAlign:"center",marginBottom:12}}>
              <div style={{fontSize:22,marginBottom:6}}>🔐</div>
              <div style={{fontSize:15,fontWeight:700,color:"#2c1f0e",marginBottom:4}}>Arzt-Zugang</div>
              <div style={{fontSize:12,color:"#7a6a5a"}}>Bitte PIN eingeben</div>
            </div>
            <span style={{fontSize:13,color:"#5a4a3a",fontWeight:600}}>PIN:</span>
            <input className="admin-pin-input" type="password" maxLength={4} value={pinInput}
              onChange={e=>setPinInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&tryPin()}
              placeholder="••••" autoFocus/>
            <button className="admin-pin-btn" onClick={tryPin}>Entsperren</button>
            {pinErr&&<span className="admin-pin-err">Falscher PIN</span>}
          </div>
        ):(
          <>
            {/* Tab bar – responsiv: umbrechen auf schmalem Bildschirm */}
            <div style={{display:"flex",flexWrap:"wrap",background:"#1a1208",
              borderBottom:"2px solid #c8a070",flexShrink:0}}>
              {[["auswertung","📊 Auswertung"],["verlauf","👥 Patienten"],["risiko","🦴 Risikofaktoren & -indikatoren"],["sek","🔎 Sekundäre Osteoporose"],["therapie","💊 Osteoporose-Therapie"],["briefkopf","✏ Briefkopf"]].map(([key,label])=>(
                <button key={key} onClick={()=>setActiveTab(key)}
                  style={{padding:"9px 14px",border:"none",cursor:"pointer",whiteSpace:"nowrap",
                    fontFamily:"'Source Sans 3',sans-serif",fontSize:12.5,fontWeight:700,
                    background:activeTab===key?"#c8a070":"transparent",
                    color:activeTab===key?"#1a1208":"#c8a070",
                    borderBottom:activeTab===key?"2px solid #c8a070":"2px solid transparent",
                    marginBottom:-2,transition:"all .15s",flexShrink:0}}>
                  {label}
                </button>
              ))}
            </div>

            {/* Search bar + info – DB tabs only */}
            {(activeTab!=="auswertung"&&activeTab!=="verlauf"&&activeTab!=="briefkopf"&&activeTab!=="patienten")&&<div style={{padding:"8px 14px",background:"#fef9f4",borderBottom:"1px solid #ece5d8",
              display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",flexShrink:0}}>
              <input
                value={search} onChange={e=>setSearch(e.target.value)}
                placeholder={activeTab==="risiko"
                  ?"🔍 Suche nach Kennung, Frage oder Diagnose…"
                  :activeTab==="therapie"
                  ?"🔍 Suche nach Wirkstoff oder Handelsname…"
                  :"🔍 Suche nach Erkrankung oder ICD-Code…"}
                style={{flex:1,minWidth:180,padding:"6px 10px",border:"1.5px solid #d4c4a8",
                  borderRadius:5,fontSize:12.5,fontFamily:"inherit",outline:"none"}}/>
              <span style={{fontSize:11,color:"#a09080",whiteSpace:"nowrap"}}>
                {activeTab==="risiko"
                  ? `${filteredIds.length} / ${allIds.length} Einträge`
                  :activeTab==="therapie"
                  ? `${therapieDraft.length} Medikamente`
                  : `${filteredSekIds.length} / ${sekAllIds.length} Einträge`}
              </span>
              <span style={{fontSize:11,color:"#7a6a58"}}>
                ICD-10: Buchstabe + 2 Ziffern + Punkt + 2 Ziffern + G&nbsp;&nbsp;·&nbsp;&nbsp;Rote Felder = ungültiges Format
              </span>
            </div>}

            {/* Card list */}
            <div className="admin-scroll">
              {/* ═══ AUSWERTUNG TAB ═══════════════════════════════════════ */}
              {activeTab==="auswertung"&&(()=>{
                const risk=gender?computeRisk(answers,gender):null;
                const iSt={padding:"5px 9px",border:"1px solid #d8c8b0",borderRadius:6,fontSize:13,fontFamily:"inherit",background:"white",outline:"none",height:34,boxSizing:"border-box"};
                return(
                  <div style={{padding:"6px 0"}}>
                    {!gender&&(
                      <div style={{padding:"20px",textAlign:"center",color:"#9b8a7a",fontSize:14}}>
                        Bitte zuerst im Fragebogen das Geschlecht auswählen.
                      </div>
                    )}
                    {gender&&(<>
                      {/* Export-Buttons */}
                      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14,padding:"10px 4px"}}>
                        <button onClick={onExportPdf}
                          style={{padding:"9px 18px",borderRadius:6,border:"1.5px solid var(--P)",background:"white",color:"var(--M)",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
                          🖨 PDF speichern
                        </button>
                        <button onClick={onExportTxt}
                          style={{padding:"9px 18px",borderRadius:6,border:"1.5px solid var(--P)",background:"white",color:"var(--M)",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
                          💾 TXT speichern
                        </button>
                        <button onClick={()=>{ onClose(); }}
                          style={{padding:"9px 18px",borderRadius:6,border:"1.5px solid #9b7a5a",background:"#faf4ed",color:"#5a3010",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
                          ← Zurück zum Fragebogen
                        </button>
                      </div>

                      {/* Risiko-Ergebnis */}
                      <ResultCard gender={gender} answers={answers} patient={patient} diff={diff}/>


                    </>)}
                  </div>
                );
              })()}

              {/* ═══ VERLAUF TAB ════════════════════════════════════════════ */}
              {activeTab==="verlauf"&&(()=>{
                const sessList=sessions||[];
                const byKey={};
                for(const s of sessList){
                  const key=s.patientId||(s.patient?.name||"")+"__"+(s.patient?.geburtsdatum||"");
                  if(!byKey[key]){
                    byKey[key]={key,name:s.patient?.name||"(unbekannt)",geb:s.patient?.geburtsdatum||"",
                      gender:s.gender||"",lastDate:s.fillDate||"",lastRisiko:s.riskSnapshot?.cat||"",
                      lastR10:s.riskSnapshot?.r10,sessions:[s]};
                  } else {
                    byKey[key].sessions.push(s);
                    if((s.fillDate||"")>(byKey[key].lastDate||"")){
                      byKey[key].lastDate=s.fillDate||"";
                      byKey[key].lastRisiko=s.riskSnapshot?.cat||"";
                      byKey[key].lastR10=s.riskSnapshot?.r10;
                    }
                  }
                }
                let rows=Object.values(byKey);
                const q=(patSearch||"").toLowerCase().trim();
                if(q) rows=rows.filter(r=>r.name.toLowerCase().includes(q)||r.geb.includes(q)||r.lastDate.includes(q));
                const dir=patSortDir==="asc"?1:-1;
                rows=[...rows].sort((a,b)=>{
                  let av="",bv="";
                  if(patSortCol==="name"){av=a.name.toLowerCase();bv=b.name.toLowerCase();}
                  else if(patSortCol==="geb"){av=a.geb;bv=b.geb;}
                  else if(patSortCol==="lastDate"){av=a.lastDate;bv=b.lastDate;}
                  else if(patSortCol==="gender"){av=a.gender;bv=b.gender;}
                  else if(patSortCol==="risiko"){av=a.lastRisiko||"";bv=b.lastRisiko||"";}
                  return av<bv?-1*dir:av>bv?1*dir:0;
                });
                const SortBtn=({col,label})=>{
                  const active=patSortCol===col;
                  return(<span onClick={()=>{if(active)setPatSortDir(d=>d==="asc"?"desc":"asc");else{setPatSortCol(col);setPatSortDir("asc");}}}
                    style={{cursor:"pointer",userSelect:"none",whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:4,
                      color:active?"#c8a070":"#e8d8b0",fontWeight:active?700:500}}>
                    {label}<span style={{fontSize:10,opacity:active?1:.4}}>{active?(patSortDir==="asc"?"▲":"▼"):"⇅"}</span>
                  </span>);
                };
                const risikoColor=(cat)=>{
                  if(!cat)return{bg:"#f5f0e8",col:"#9a8a78"};
                  const c=cat.toLowerCase();
                  if(c.includes("sehr hoch"))return{bg:"#fee2e2",col:"#b91c1c"};
                  if(c.includes("hoch"))return{bg:"#fef3c7",col:"#d97706"};
                  if(c.includes("erhöht")||c.includes("mäßig"))return{bg:"#fff0e0",col:"#9a4a10"};
                  return{bg:"#f0f9ff",col:"#1a5a8a"};
                };
                return(
                  <div style={{padding:"14px 0 6px"}}>
                    <div style={{padding:"0 16px 12px",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                      <div style={{flex:1,minWidth:220,position:"relative"}}>
                        <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",
                          fontSize:15,pointerEvents:"none",color:"#9a8a78"}}>🔍</span>
                        <input value={patSearch} onChange={e=>setPatSearch(e.target.value)}
                          placeholder="Name, Vorname, Geburtsdatum oder Untersuchungsdatum …"
                          style={{width:"100%",padding:"9px 10px 9px 32px",border:"1.5px solid #d8c8b0",
                            borderRadius:7,fontSize:13,fontFamily:"inherit",background:"white",
                            boxSizing:"border-box",outline:"none"}}/>
                      </div>
                      <div style={{fontSize:12,color:"#9a8a78",whiteSpace:"nowrap"}}>
                        {rows.length}&nbsp;Patient{rows.length!==1?"en":""}
                      </div>
                    </div>
                    {rows.length===0?(
                      <div style={{padding:"28px",textAlign:"center",color:"#9b8a7a",fontSize:13}}>
                        {sessList.length===0?"Noch keine gespeicherten Sitzungen vorhanden.":"Keine Patienten gefunden."}
                      </div>
                    ):(
                      <div style={{overflowX:"auto"}}>
                        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5,fontFamily:"inherit"}}>
                          <thead>
                            <tr style={{background:"#2c1f0e",color:"#e8d8b0"}}>
                              <th style={{padding:"9px 14px",textAlign:"left",fontWeight:700,borderRight:"1px solid #3a2a18"}}><SortBtn col="name" label="Name"/></th>
                              <th style={{padding:"9px 12px",textAlign:"left",fontWeight:700,borderRight:"1px solid #3a2a18"}}><SortBtn col="geb" label="Geburtsdatum"/></th>
                              <th style={{padding:"9px 12px",textAlign:"left",fontWeight:700,borderRight:"1px solid #3a2a18"}}><SortBtn col="lastDate" label="Letztes Untersuchungsdatum"/></th>
                              <th style={{padding:"9px 12px",textAlign:"left",fontWeight:700,borderRight:"1px solid #3a2a18"}}><SortBtn col="gender" label="Geschlecht"/></th>
                              <th style={{padding:"9px 12px",textAlign:"left",fontWeight:700}}><SortBtn col="risiko" label="Risikokategorie"/></th>
                              <th style={{padding:"9px 10px",width:70}}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((r,i)=>{
                              const rc=risikoColor(r.lastRisiko);
                              const bestSess=[...r.sessions].sort((a,b)=>(b.fillDate||"").localeCompare(a.fillDate||""))[0];
                              return(
                                <tr key={r.key}
                                  style={{background:i%2===0?"white":"#faf6f0",borderBottom:"1px solid #ece5d8",cursor:"pointer",transition:"background .15s"}}
                                  onMouseEnter={e=>e.currentTarget.style.background="#f0e8d8"}
                                  onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"white":"#faf6f0"}
                                  onClick={()=>{if(bestSess){onLoadSession(bestSess);onClose();}}}>
                                  <td style={{padding:"10px 14px",fontWeight:700,color:"#2c1f0e",borderRight:"1px solid #ece5d8"}}>
                                    {r.name}
                                    {r.sessions.length>1&&<span style={{marginLeft:6,fontSize:10.5,fontWeight:600,
                                      background:"#e8d8b0",color:"#5a3a10",padding:"1px 5px",borderRadius:4}}>
                                      {r.sessions.length} Befunde</span>}
                                  </td>
                                  <td style={{padding:"10px 12px",color:"#5a4a3a",borderRight:"1px solid #ece5d8"}}>{r.geb||"—"}</td>
                                  <td style={{padding:"10px 12px",color:"#5a4a3a",borderRight:"1px solid #ece5d8"}}>{r.lastDate||"—"}</td>
                                  <td style={{padding:"10px 12px",borderRight:"1px solid #ece5d8"}}>{r.gender==="f"?"♀ Frau":r.gender==="m"?"♂ Mann":"—"}</td>
                                  <td style={{padding:"10px 12px"}}>
                                    {r.lastRisiko?<span style={{padding:"3px 9px",borderRadius:5,
                                      background:rc.bg,color:rc.col,fontWeight:600,fontSize:12}}>
                                      {r.lastRisiko}</span>:"—"}
                                  </td>
                                  <td style={{padding:"8px 10px",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
                                    <button onClick={()=>{if(bestSess){onLoadSession(bestSess);onClose();}}}
                                      style={{padding:"5px 11px",borderRadius:5,border:"1px solid #9b7a5a",
                                        background:"#faf4ed",color:"#5a3010",cursor:"pointer",
                                        fontSize:12,fontFamily:"inherit",fontWeight:600}}>↩</button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })()}
              {/* ═══ PATIENTEN TAB ════════════════════════════════════ */}
              {activeTab==="patienten"&&(
                <PatientenListe
                  patients={patients||[]}
                  sessions={sessions||[]}
                  onSelectPatient={(pat)=>{
                    // Load most recent session for this patient
                    const bs=(sessions||[])
                      .filter(s=>s.patientId===pat.id)
                      .sort((a,b)=>b.id.localeCompare(a.id));
                    if(bs.length){onLoadSession(bs[0]);onClose();}
                    else{alert("Keine Befunde für diesen Patienten gefunden.");}
                  }}
                  onDeletePatient={onDeletePatient}
                  onResetPw={onResetPatientPw}/>
              )}

              {/* ═══ RISIKOÜBERSICHT TAB ══════════════════════════════ */}
              {activeTab==="risiko"&&(()=>{
                // ── Unified editable reference table ──
                const allQs=SECTIONS.flatMap(sec=>
                  (sec.qs||[]).map(q=>({...q,
                    sectionTitle:sec.title,
                    sectionIcon:sec.icon,
                    onlyFor:sec.onlyFor||null
                  }))
                );
                const bySection={};
                for(const q of allQs){
                  if(!q.faktor&&!q.fmap&&!RISIKOINDIKATOR_IDS.has(q.id))continue;
                  const key=q.sectionTitle;
                  if(!bySection[key])bySection[key]={icon:q.sectionIcon,title:q.sectionTitle,onlyFor:q.onlyFor,qs:[]};
                  bySection[key].qs.push(q);
                }
                const fColor=(f)=>{
                  if(!f)return"#e8e0d8";
                  if(f>=3.0)return"#fee2e2";
                  if(f>=2.0)return"#fef3c7";
                  if(f>=1.5)return"#fff0e0";
                  return"#f0f9ff";
                };
                const fTextColor=(f)=>{
                  if(!f)return"#9a8a78";
                  if(f>=3.0)return"#b91c1c";
                  if(f>=2.0)return"#d97706";
                  if(f>=1.5)return"#9a4a10";
                  return"#1a5a8a";
                };
                return(
                  <div style={{padding:"6px 14px 14px"}}>
                    {/* Header */}
                    <div style={{marginBottom:14,padding:"12px 16px",
                      background:"#1a1208",borderRadius:10,color:"#e8d8b0",lineHeight:1.6}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,
                          fontWeight:700,color:"#c8a070"}}>
                          📋 DVO-Leitlinie 2023 – Risikofaktoren &amp; Risikoindikatoren
                        </div>
                        <button onClick={()=>setEditModeRisiko(v=>!v)}
                          style={{fontSize:11,padding:"3px 12px",borderRadius:5,cursor:"pointer",
                            fontFamily:"inherit",border:"1.5px solid",flexShrink:0,
                            background:editModeRisiko?"#c8a070":"transparent",
                            color:editModeRisiko?"#1a1208":"#c8a070",
                            borderColor:editModeRisiko?"#c8a070":"#6a5040"}}>
                          {editModeRisiko?"✓ Bearbeitung aktiv":"✏ Bearbeiten"}
                        </button>
                      </div>
                      <div style={{fontSize:12}}>
                        <strong style={{color:"#c8a070"}}>Risikofaktoren</strong> gehen mit RR in den DVO-Risikorechner ein.{" "}
                        <strong style={{color:"#f59e0b"}}>🔔 Risikoindikatoren</strong> begründen Basisdiagnostik (DXA + Labor), fließen aber <em>nicht</em> in die Risikokalkulation ein.{" "}
                        Diagnosen und ICD-10-Codes sind direkt editierbar.
                      </div>
                    </div>
                    {/* Legende */}
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8,fontSize:12}}>
                      {[["≥3.0","Sehr hoch","#fee2e2","#b91c1c"],["≥2.0","Hoch","#fef3c7","#d97706"],
                        ["≥1.5","Mäßig","#fff0e0","#9a4a10"],["<1.5","Gering","#f0f9ff","#1a5a8a"]].map(([f,l,bg,tc])=>(
                        <div key={f} style={{padding:"2px 9px",background:bg,borderRadius:4,
                          color:tc,fontWeight:700,border:`1px solid ${tc}30`,fontSize:11}}>×{f} {l}</div>
                      ))}
                      <div style={{padding:"2px 9px",background:"#fef3c7",borderRadius:4,
                        color:"#92400e",fontWeight:700,border:"1px solid #f59e0b40",fontSize:11}}>
                        🔔 Risikoindikator
                      </div>
                    </div>
                    <div style={{fontSize:10.5,color:"#9a8a7a",marginBottom:12}}>
                      <sup style={{color:"#b45309"}}>*</sup> Basisdiagnostik auch vor dem 50. Lebensjahr erwägen
                    </div>

                    {/* Unified table per section */}
                    {Object.values(bySection).map(sec=>(
                      <div key={sec.title} style={{marginBottom:18}}>
                        <div style={{
                          padding:"8px 12px",background:"#2c1f0e",color:"#c8a070",
                          borderRadius:"6px 6px 0 0",fontFamily:"'Playfair Display',serif",
                          fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>
                          <span>{sec.icon}</span>
                          <span>{sec.title}</span>
                          {sec.onlyFor&&(
                            <span style={{marginLeft:"auto",fontSize:11,fontWeight:400,
                              color:"#9a8a5a",background:"#1a1208",padding:"2px 7px",borderRadius:4}}>
                              {sec.onlyFor==="f"?"♀ nur Frauen":"♂ nur Männer"}
                            </span>
                          )}
                        </div>
                        <table style={{width:"100%",borderCollapse:"collapse",
                          fontSize:12,border:"1px solid #e0d0b8",
                          borderRadius:"0 0 6px 6px",overflow:"hidden"}}>
                          <thead>
                            <tr style={{background:"#f8f4ee",color:"#5a4a38",fontSize:11,fontWeight:700}}>
                              <th style={{padding:"6px 10px",textAlign:"left",borderBottom:"1px solid #e0d0b8",width:"28%"}}>Frage / Befund</th>
                              <th style={{padding:"6px 8px",textAlign:"center",borderBottom:"1px solid #e0d0b8",width:"9%"}}>RR / Typ</th>
                              <th style={{padding:"6px 8px",textAlign:"left",borderBottom:"1px solid #e0d0b8",width:"33%"}}>Diagnose-Klarschrift</th>
                              <th style={{padding:"6px 8px",textAlign:"left",borderBottom:"1px solid #e0d0b8",width:"18%"}}>ICD-10-GM</th>
                              <th style={{padding:"6px 6px",textAlign:"center",borderBottom:"1px solid #e0d0b8",width:"12%"}}>Aktionen</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sec.qs.flatMap((q)=>{
                              const isIndicator=RISIKOINDIKATOR_IDS.has(q.id);
                              const displayFactor=q.faktor||(q.fmap?Math.max(...Object.values(q.fmap)):null);
                              const row=draft[q.id]||{};
                              const entries=normEntries(row);
                              const def=DIAG_DB_DEFAULTS[q.id]||{};
                              // Vollständiger Fragentext – alle Zeilen, keine Kürzung
                              const fullLabel=q.label.replace(/\n/g," · ");
                              return entries.map((entry,idx)=>{
                                const icdOk=validateIcd(entry.icd5);
                                const isFirst=idx===0;
                                const rowBg=isIndicator?"#fffdf7":"white";
                                const borderL=isIndicator?"3px solid #f59e0b":"3px solid transparent";
                                return(
                                  <tr key={q.id+"-"+idx} style={{
                                    background:rowBg,
                                    borderBottom:"1px solid #f0e8d8",
                                    borderLeft:borderL}}>
                                    {/* Frage-Spalte – vollständig lesbar */}
                                    <td style={{padding:"10px 12px",color:"#3a2a18",lineHeight:1.5,verticalAlign:"top",
                                      borderTop:isFirst?"none":"1px dashed #f0e0c8",minWidth:180}}>
                                      {isFirst&&(
                                        <>
                                        <div style={{fontWeight:500,fontSize:12,whiteSpace:"normal",wordBreak:"break-word"}}>
                                          {fullLabel}
                                          {isIndicator&&INDICATOR_ASTERISK.has(q.id)&&
                                            <sup style={{color:"#b45309",marginLeft:2,fontSize:9}}>*</sup>}
                                        </div>
                                        {isIndicator&&(
                                          <div style={{fontSize:10.5,color:"#92400e",marginTop:3,lineHeight:1.4,
                                            background:"#fef9ec",borderRadius:3,padding:"2px 5px",marginTop:4}}>
                                            🔔 Risikoindikator – kein RR im DVO-Rechner
                                          </div>
                                        )}
                                        {!isIndicator&&q.fmap&&(
                                          <div style={{fontSize:10.5,color:"#6a7a8a",marginTop:4,lineHeight:1.4}}>
                                            Staffelung: {Object.entries(q.fmap).map(([k,v])=>"×"+v).join(" / ")}
                                          </div>
                                        )}
                                        {(def.icd5_f_meno||def.icd5_m)&&(
                                          <div style={{fontSize:10,color:"#6a5a88",marginTop:4,lineHeight:1.5}}>
                                            {def.icd5_f_meno&&<div>♀ postmenopausal: {def.icd5_f_meno}</div>}
                                            {def.icd5_m&&<div>♂ Mann: {def.icd5_m}</div>}
                                          </div>
                                        )}
                                        </>
                                      )}
                                    </td>
                                    {/* RR-Badge */}
                                    <td style={{padding:"10px 8px",textAlign:"center",verticalAlign:"top"}}>
                                      {isFirst&&(isIndicator?(
                                        <span style={{display:"inline-block",padding:"3px 7px",borderRadius:4,fontSize:10,
                                          fontWeight:700,background:"#fef3c7",color:"#92400e",
                                          border:"1px solid #f59e0b",whiteSpace:"nowrap"}}>🔔 Ind.</span>
                                      ):displayFactor?(
                                        <span style={{display:"inline-block",padding:"3px 8px",borderRadius:4,
                                          fontSize:12,fontWeight:700,
                                          background:fColor(displayFactor),color:fTextColor(displayFactor),
                                          whiteSpace:"nowrap"}}>×{displayFactor}</span>
                                      ):null)}
                                    </td>
                                    {/* Diagnose – editierbar, auto-resize textarea */}
                                    <td style={{padding:"6px 7px",verticalAlign:"top"}}>
                                      <AutoTextarea
                                        value={entry.diagnose||""}
                                        placeholder="Klarschrift-Diagnose…"
                                        minRows={1} maxRows={6}
                                        onChange={e=>updateEntry(q.id,idx,"diagnose",e.target.value)}
                                        style={{width:"100%",fontSize:12,padding:"5px 8px",lineHeight:1.5,
                                          border:"1px solid #e0d0b8",borderRadius:4,
                                          background:"#fafaf8",outline:"none",fontFamily:"inherit"}}/>
                                    </td>
                                    {/* ICD-10 – editierbar */}
                                    <td style={{padding:"6px 7px",verticalAlign:"top"}}>
                                      <input
                                        value={entry.icd5||""}
                                        placeholder="z. B. M80.05G"
                                        onChange={e=>updateEntry(q.id,idx,"icd5",e.target.value.toUpperCase())}
                                        style={{width:"100%",fontSize:12,padding:"5px 8px",fontFamily:"monospace",
                                          border:`1px solid ${icdOk?"#e0d0b8":"#f87171"}`,
                                          borderRadius:4,background:icdOk?"#fafaf8":"#fff5f5",
                                          outline:"none",boxSizing:"border-box",height:36}}/>
                                    </td>
                                    {/* Aktionen */}
                                    <td style={{padding:"6px 6px",textAlign:"center",verticalAlign:"top",whiteSpace:"nowrap"}}>
                                      <button onClick={()=>addEntry(q.id)} title="Diagnose-Zeile hinzufügen"
                                        style={{display:"block",width:"100%",fontSize:13,background:"none",border:"none",
                                          cursor:"pointer",color:"#6a9a4a",padding:"3px 2px"}}>＋</button>
                                      <button onClick={()=>removeEntry(q.id,idx)}
                                        disabled={entries.length===1&&!entry.diagnose&&!entry.icd5}
                                        title="Zeile löschen"
                                        style={{display:"block",width:"100%",fontSize:12,background:"none",border:"none",
                                          cursor:"pointer",color:"#c05050",padding:"3px 2px",
                                          opacity:entries.length===1&&!entry.diagnose&&!entry.icd5?0.3:1}}>✕</button>
                                    </td>
                                  </tr>
                                );
                              });
                            })}
                          </tbody>
                        </table>
                      </div>
                    ))}
                    <div style={{fontSize:11,color:"#9a8a7a",textAlign:"center",paddingTop:6,lineHeight:1.7}}>
                      Alle Faktoren gemäß DVO-Leitlinie 2023 · AWMF 183-001 · ICD-10-GM-Codes sind Richtwerte
                    </div>
                  </div>
                );
              })()}
              {(()=>{
              if(activeTab!=="sek") return null;
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
              const inputSt={padding:"5px 10px",border:"1.5px solid #d4c4a8",borderRadius:5,
                fontSize:12.5,fontFamily:"inherit",width:"100%",background:"#fff",outline:"none",
                boxSizing:"border-box",lineHeight:1.45};
              const labelSt={fontSize:10,fontWeight:700,color:"#8b6a3a",textTransform:"uppercase",
                letterSpacing:".8px",marginBottom:3,display:"block"};
              const icdSt=(ok)=>({...inputSt,width:130,border:`1.5px solid ${ok?"#d4c4a8":"#dc2626"}`,
                flexShrink:0,background:ok?"#fff":"#fef2f2",fontFamily:"monospace",fontSize:12,height:36,padding:"7px 9px"});
              // ── Edit-Mode-Toggle ──────────────────────────────────────
              return [
                <div key="sek-edit-toggle" style={{
                  display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"8px 14px",background:"#1a1208",borderRadius:8,marginBottom:8,marginTop:4}}>
                  <span style={{fontSize:11.5,color:"#c8a070",fontWeight:600}}>
                    🔎 Sekundäre Osteoporosen – {Object.keys(SEK_PROFILE).length} Erkrankungen
                  </span>
                  <button onClick={()=>setEditModeSek(v=>!v)}
                    style={{fontSize:11.5,padding:"4px 14px",borderRadius:6,cursor:"pointer",
                      fontFamily:"inherit",border:"1.5px solid",
                      background:editModeSek?"#c8a070":"transparent",
                      color:editModeSek?"#1a1208":"#c8a070",
                      borderColor:editModeSek?"#c8a070":"#6a5040"}}>
                    {editModeSek?"✓ Bearbeitungsmodus aktiv":"✏ Bearbeitungsmodus"}
                  </button>
                </div>,
                ...groupOrder.flatMap(grp=>{
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
                            {/* ── Bearbeitungsmodus-Toggle ── */}
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                              padding:"6px 10px",background:"#f0ece4",borderRadius:6,
                              border:"1px solid #e0d4c0"}}>
                              <span style={{fontSize:11,color:"#7a6a5a",fontStyle:"italic"}}>
                                {sekEditMode[sym]?"✏ Bearbeitungsmodus aktiv":"👁 Nur-Lese-Ansicht"}
                              </span>
                              <button onClick={()=>setSekEditMode(m=>({...m,[sym]:!m[sym]}))}
                                style={{fontSize:11,padding:"3px 12px",borderRadius:5,cursor:"pointer",
                                  fontFamily:"inherit",fontWeight:600,
                                  background:sekEditMode[sym]?"#fce7c0":"#d1fae5",
                                  border:`1px solid ${sekEditMode[sym]?"#d97706":"#6ee7b7"}`,
                                  color:sekEditMode[sym]?"#92400e":"#065f46"}}>
                                {sekEditMode[sym]?"✓ Fertig":"✏ Bearbeiten"}
                              </button>
                            </div>

                            {/* ── Erkrankungsname ── */}
                            <div>
                              <label style={labelSt}>🏷 Erkrankungsname (Anzeige & Auswertung)</label>
                              {sekEditMode[sym]
                                ?<input style={inputSt}
                                    value={profRow.label||""}
                                    placeholder="Erkrankungsname…"
                                    onChange={e=>setSekProfileDraft(d=>({...d,[sym]:{...d[sym]||{},label:e.target.value}}))}/>
                                :<div style={{...inputSt,background:"#f8f4ee",color:"#3a2a10",cursor:"default",
                                    height:"auto",padding:"6px 10px",fontSize:13,fontWeight:600}}>
                                    {profRow.label||sym}
                                  </div>
                              }
                            </div>

                            {/* ── Klinischer Hinweis ── */}
                            <div>
                              <label style={labelSt}>📋 Klinischer Hinweis (Auswertungstext)</label>
                              <RichTextField
                                editMode={!!sekEditMode[sym]}
                                style={{...inputSt,lineHeight:1.6}}
                                value={profRow.hinweis||""}
                                placeholder="Klinischer Hinweis für die Auswertungsansicht…"
                                onChange={e=>setSekProfileDraft(d=>({...d,[sym]:{...d[sym]||{},hinweis:e.target.value}}))}/>
                            </div>

                            {/* ── Diagnose bei Bestätigung ── */}
                            <div>
                              <label style={labelSt}>🏥 Diagnose & ICD-10 bei Bestätigung (Textexport)</label>
                              <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                                <AutoTextarea style={{...inputSt,flex:1,lineHeight:1.55}}
                                  minRows={1} maxRows={5}
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
                                    <AutoTextarea style={{...inputSt,fontSize:12,lineHeight:1.6,whiteSpace:"pre-wrap"}}
                                      minRows={1} maxRows={6}
                                      value={qRow.label||""}
                                      placeholder="Fragetext…"
                                      onChange={e=>setSekQsDraft(d=>({...d,[q.id]:{...d[q.id]||{},label:e.target.value}}))}/>
                                    <label style={{...labelSt,marginTop:6,marginBottom:3}}>
                                      Erklärungstext (wird dem Arzt als Hinweis angezeigt)
                                    </label>
                                    <RichTextField
                                      editMode={!!sekEditMode[sym]}
                                      style={{...inputSt,fontSize:12,lineHeight:1.55}}
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
                                {sekEditMode[sym]&&(
                                <button onClick={()=>setSekUntersDraft(d=>({...d,[sym]:[...(d[sym]||[]),{name:"",icd:""}]}))}
                                  style={{fontSize:11,padding:"3px 10px",background:"#1a7f4f",color:"#fff",
                                    border:"none",borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>
                                  + Zeile hinzufügen
                                </button>
                                )}
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
                                    <AutoTextarea style={{...inputSt,flex:1,fontSize:12,lineHeight:1.55}}
                                      minRows={1} maxRows={5}
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

                            {/* ── Scoring / Stadieneinteilung ── */}
                            {(()=>{
                              const sc=sekScoringDraft[sym]||{};
                              return(
                                <div>
                                  <label style={{...labelSt,marginBottom:4}}>📊 Scoring & Stadieneinteilung (leitlinienbasiert)</label>
                                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                                    <div>
                                      <label style={{...labelSt,marginBottom:2}}>Titel des Klassifikationssystems</label>
                                      {sekEditMode[sym]
                                        ?<AutoTextarea style={{...inputSt,fontSize:12,lineHeight:1.5,width:"100%"}}
                                            minRows={1} maxRows={4}
                                            value={sc.titel||""}
                                            placeholder="z. B. Marsh-Oberhuber-Klassifikation (mod. 2001)"
                                            onChange={e=>setSekScoringDraft(d=>({...d,[sym]:{...(d[sym]||{}),titel:e.target.value}}))}/>
                                        :<div style={{fontSize:12,fontWeight:600,color:"#3a1a6a",padding:"4px 0"}}>
                                            {sc.titel||<em style={{color:"#bbb"}}>kein Titel</em>}
                                          </div>
                                      }
                                    </div>
                                    <div>
                                      <label style={{...labelSt,marginBottom:2}}>Quelle / Leitlinie</label>
                                      {sekEditMode[sym]
                                        ?<AutoTextarea style={{...inputSt,fontSize:12,lineHeight:1.5,width:"100%"}}
                                            minRows={1} maxRows={4}
                                            value={sc.quelle||""}
                                            placeholder="z. B. DGVS S2k-Leitlinie Zöliakie 2022"
                                            onChange={e=>setSekScoringDraft(d=>({...d,[sym]:{...(d[sym]||{}),quelle:e.target.value}}))}/>
                                        :sc.quelle
                                          ?<div style={{fontSize:11.5,color:"#4a2a8a",lineHeight:1.5,padding:"2px 0"}}>
                                              <LitLinks url={sc.url} label={sc.quelle}/>
                                            </div>
                                          :<span style={{fontSize:11,color:"#bbb",fontStyle:"italic"}}>keine Quelle</span>
                                      }
                                    </div>
                                    {sekEditMode[sym]&&(
                                    <div>
                                      <label style={{...labelSt,marginBottom:2}}>URL (optional)</label>
                                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                                        <input style={{...inputSt,fontSize:12,flex:1}}
                                          value={sc.url||""}
                                          placeholder="https://..."
                                          onChange={e=>setSekScoringDraft(d=>({...d,[sym]:{...(d[sym]||{}),url:e.target.value}}))}/>
                                        {sc.url&&(
                                          <a href={sc.url} target="_blank" rel="noopener noreferrer"
                                            title={sc.url}
                                            style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
                                              width:34,height:34,flexShrink:0,borderRadius:5,
                                              background:"#dbeafe",border:"1px solid #93c5fd",
                                              color:"#1e40af",fontSize:16,textDecoration:"none",lineHeight:1}}>
                                            🔗
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                    )}
                                    <div>
                                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                                        <label style={{...labelSt,marginBottom:0}}>Stufen / Grenzwerte ({(sc.stufen||[]).length})</label>
                                        {sekEditMode[sym]&&(
                                        <button onClick={()=>setSekScoringDraft(d=>{
                                          const rows=[...(d[sym]?.stufen||[]),{name:"",beschreibung:""}];
                                          return{...d,[sym]:{...(d[sym]||{}),stufen:rows}};
                                        })} style={{fontSize:11,padding:"3px 10px",background:"#1a4a8f",color:"#fff",
                                          border:"none",borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>
                                          + Stufe hinzufügen
                                        </button>
                                        )}
                                      </div>
                                      {(sc.stufen||[]).map((st,si)=>(
                                        <div key={si} style={{display:"flex",gap:6,marginBottom:5,alignItems:"flex-start"}}>
                                          <input style={{...inputSt,width:180,flexShrink:0,fontSize:12}}
                                            value={st.name||""}
                                            placeholder="Stadium / Score"
                                            onChange={e=>setSekScoringDraft(d=>{
                                              const rows=[...(d[sym]?.stufen||[])];
                                              rows[si]={...rows[si],name:e.target.value};
                                              return{...d,[sym]:{...(d[sym]||{}),stufen:rows}};
                                            })}/>
                                          <RichTextField
                                            editMode={!!sekEditMode[sym]}
                                            style={{...inputSt,flex:1,fontSize:12,lineHeight:1.6}}
                                            value={st.beschreibung||""}
                                            placeholder="Kriterien, Grenzwerte, klinische Bedeutung…"
                                            onChange={e=>setSekScoringDraft(d=>{
                                              const rows=[...(d[sym]?.stufen||[])];
                                              rows[si]={...rows[si],beschreibung:e.target.value};
                                              return{...d,[sym]:{...(d[sym]||{}),stufen:rows}};
                                            })}/>
                                          {sekEditMode[sym]&&(
                                          <button onClick={()=>setSekScoringDraft(d=>({...d,[sym]:{...(d[sym]||{}),stufen:(d[sym]?.stufen||[]).filter((_,i)=>i!==si)}}))}
                                            style={{flexShrink:0,background:"#fee2e2",color:"#dc2626",
                                              border:"1px solid #fca5a5",borderRadius:5,padding:"3px 8px",
                                              cursor:"pointer",fontSize:13,fontFamily:"inherit",marginTop:2}}>✕</button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                          </div>
                        )}
                      </div>
                    );
                  })
                ];
              })
              ]
            })()}
            {activeTab==="therapie"&&(
              <div style={{padding:"10px 14px"}}>
                {/* ── Bearbeitungsmodus-Toggle Therapie ── */}
                <div style={{marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"7px 12px",background:"#f0ece4",borderRadius:6,border:"1px solid #e0d4c0"}}>
                  <span style={{fontSize:11,color:"#7a6a5a",fontStyle:"italic"}}>
                    {therapieEditMode?"✏ Bearbeitungsmodus aktiv – Felder editierbar":"👁 Nur-Lese-Ansicht – WYSIWYG mit Klick auf ✏ Bearbeiten aktivieren"}
                  </span>
                  <button onClick={()=>setTherapieEditMode(v=>!v)}
                    style={{fontSize:11,padding:"3px 12px",borderRadius:5,cursor:"pointer",
                      fontFamily:"inherit",fontWeight:600,
                      background:therapieEditMode?"#fce7c0":"#d1fae5",
                      border:`1px solid ${therapieEditMode?"#d97706":"#6ee7b7"}`,
                      color:therapieEditMode?"#92400e":"#065f46"}}>
                    {therapieEditMode?"✓ Fertig":"✏ Bearbeiten"}
                  </button>
                </div>
                <div style={{marginBottom:10,fontSize:12,color:"#8a7a6a",lineHeight:1.6,padding:"8px 12px",
                  background:"#fef9f4",border:"1px solid #e8d8c0",borderRadius:6}}>
                  Handelsnamen, Dosierungen, Zulassungstexte und Nebenwirkungen – Änderungen nur lokal.
                </div>
                {therapieDraft.map((med,mi)=>{
                  const expanded=!!therapieExpanded[med.id];
                  return(
                    <div key={med.id} style={{marginBottom:8,border:"1px solid #d8c8b0",borderRadius:8,background:"#fffcf8",overflow:"hidden"}}>
                      {/* Header */}
                      <div onClick={()=>setTherapieExpanded(e=>({...e,[med.id]:!e[med.id]}))}
                        style={{display:"flex",alignItems:"center",gap:10,padding:"9px 13px",
                          background:expanded?"#f7ede0":"#fdf8f4",cursor:"pointer",userSelect:"none"}}>
                        <span style={{fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:10,
                          background:"#9b7a5a",color:"white",whiteSpace:"nowrap"}}>{med.gruppe.split(" ")[0]}</span>
                        <div style={{flex:1}}>
                          <span style={{fontWeight:700,fontSize:13,color:"#3a2010"}}>{med.wirkstoff}</span>
                          <span style={{fontSize:11.5,color:"#7a6a5a",marginLeft:8}}>{med.handelsnamen.split(",")[0]}</span>
                          <div style={{marginTop:3,display:"flex",gap:4,flexWrap:"wrap"}}>
                            {(med.indikation||[]).map(ind=>{
                              const cfg={
                                "Osteoporose":          {bg:"#dbeafe",color:"#1e40af",border:"#93c5fd"},
                                "manifeste Osteoporose":{bg:"#ffedd5",color:"#c2410c",border:"#fdba74"},
                                "Tumortherapie":        {bg:"#fce7f3",color:"#9d174d",border:"#f9a8d4"},
                              }[ind]||{bg:"#f3f4f6",color:"#374151",border:"#d1d5db"};
                              return(
                                <span key={ind} style={{fontSize:10,fontWeight:700,padding:"1px 6px",
                                  borderRadius:9,background:cfg.bg,color:cfg.color,
                                  border:`1px solid ${cfg.border}`,whiteSpace:"nowrap"}}>
                                  {{"Osteoporose":"🦴 Osteoporose","manifeste Osteoporose":"🦴💔 manifeste Osteoporose","Tumortherapie":"💉 Tumortherapie"}[ind]||ind}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <span style={{fontSize:12,color:"#9b7a5a"}}>{expanded?"▲":"▼"}</span>
                      </div>
                      {expanded&&(
                        <div style={{padding:"10px 14px",borderTop:"1px solid #e8d8c0"}}>
                          {[
                            ["Wirkstoff",         "wirkstoff",    "text",     "Wirkstoffname"],
                            ["Gruppe",            "gruppe",       "text",     "z.B. Bisphosphonate (oral)"],
                            ["Handelsnamen (DE)", "handelsnamen", "textarea", "Kommagetrennte Handelsnamen"],
                            ["Dosierung",         "dosierung",   "textarea", "Standarddosierung"],
                            ["Zulassung",         "zulassung",   "textarea", "Zugelassene Indikationen"],
                            ["Anmerkung / Warnung","anmerkung",  "textarea", "Klinisch relevante Hinweise"],

                          ].map(([lbl,field,type,ph])=>(
                            <div key={field} style={{marginBottom:8}}>
                              <label style={{fontSize:11.5,fontWeight:700,color:"#6b5a4a",display:"block",marginBottom:3}}>{lbl}</label>
                              {type==="textarea"
                                ? <RichTextField editMode={therapieEditMode}
                                    placeholder={ph}
                                    style={{width:"100%",padding:"5px 8px",
                                      border:"1px solid #d8c8b0",borderRadius:5,fontSize:12,fontFamily:"inherit"}}
                                    value={med[field]||""}
                                    onChange={e=>setTherapieDraft(d=>d.map((m,i)=>i===mi?{...m,[field]:e.target.value}:m))}/>
                                : therapieEditMode
                                  ?<input placeholder={ph}
                                      style={{width:"100%",boxSizing:"border-box",padding:"5px 8px",
                                        border:"1px solid #d8c8b0",borderRadius:5,fontSize:12,fontFamily:"inherit",outline:"none"}}
                                      value={med[field]||""}
                                      onChange={e=>{const v=e.target.value;
                                        setTherapieDraft(d=>d.map((m,i)=>i===mi?{...m,[field]:v}:m));}}/>
                                  :<div style={{fontSize:12,color:"#3a2010",padding:"3px 0"}}>{med[field]||<em style={{color:"#bbb"}}>{ph}</em>}</div>
                              }
                            </div>
                          ))}
                          {/* Besonderheiten – eigene Komponente wegen Hook-Regel */}
                          <BesonderheitPanel
                            med={med}
                            onUpdate={v=>setTherapieDraft(d=>d.map((m,i)=>i===mi?{...m,besonderheit:v}:m))}
                          />
                          {/* Indikation */}
                          <div style={{marginBottom:10}}>
                            <label style={{fontSize:11.5,fontWeight:700,color:"#6b5a4a",display:"block",marginBottom:5}}>Indikation</label>
                            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                              {["Osteoporose","manifeste Osteoporose","Tumortherapie"].map(opt=>{
                                const cfg={
                                  "Osteoporose":          {bg:"#dbeafe",color:"#1e40af",border:"#93c5fd"},
                                  "manifeste Osteoporose":{bg:"#ffedd5",color:"#c2410c",border:"#fdba74"},
                                  "Tumortherapie":        {bg:"#fce7f3",color:"#9d174d",border:"#f9a8d4"},
                                }[opt];
                                const checked=(med.indikation||[]).includes(opt);
                                return(
                                  <label key={opt} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",
                                    padding:"4px 10px",borderRadius:8,border:`1.5px solid ${checked?cfg.border:"#d8c8b0"}`,
                                    background:checked?cfg.bg:"#fffcf8",userSelect:"none"}}>
                                    <input type="checkbox" checked={checked}
                                      onChange={()=>{
                                        setTherapieDraft(d=>d.map((m,i)=>{
                                          if(i!==mi)return m;
                                          const cur=m.indikation||[];
                                          return{...m,indikation:checked?cur.filter(x=>x!==opt):[...cur,opt]};
                                        }));
                                      }}
                                      style={{accentColor:cfg.color}}/>
                                    <span style={{fontSize:12,fontWeight:checked?700:400,
                                      color:checked?cfg.color:"#7a6a5a"}}>{{"Osteoporose":"🦴 Osteoporose","manifeste Osteoporose":"🦴💔 manifeste Osteoporose","Tumortherapie":"💉 Tumortherapie"}[opt]||opt}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                          {/* Nebenwirkungen */}
                          <div style={{marginTop:10}}>
                            <div style={{fontSize:12,fontWeight:700,color:"#7a5a3a",marginBottom:6,
                              display:"flex",alignItems:"center",gap:8}}>
                              ⚠ Nebenwirkungen (aus Fachinformation)
                              <button onClick={()=>setTherapieDraft(d=>d.map((m,i)=>i!==mi?m:{...m,
                                nw:[...(m.nw||[]),{id:"nw_"+Date.now(),label:"",icd:"",haeuf:"gelegentlich"}]}))}
                                style={{fontSize:11,padding:"2px 8px",borderRadius:5,border:"1px dashed #9b7a5a",
                                  background:"white",cursor:"pointer",fontFamily:"inherit"}}>+ Nebenwirkung</button>
                            </div>
                            {(med.nw||[]).map((nw,ni)=>(
                              <div key={nw.id||ni} style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:5}}>
                                <input placeholder="Bezeichnung (z.B. Kieferosteonekrose)"
                                  style={{flex:3,padding:"4px 7px",border:"1px solid #d8c8b0",borderRadius:5,
                                    fontSize:12,fontFamily:"inherit",outline:"none"}}
                                  value={nw.label||""}
                                  onChange={e=>{const v=e.target.value;
                                    setTherapieDraft(d=>d.map((m,i)=>{
                                      if(i!==mi)return m;
                                      const nwArr=[...(m.nw||[])];nwArr[ni]={...nwArr[ni],label:v};
                                      return{...m,nw:nwArr};}));}}/>
                                <input placeholder="ICD-10 (z.B. M87.18)"
                                  style={{flex:1,padding:"4px 7px",border:"1px solid #d8c8b0",borderRadius:5,
                                    fontSize:12,fontFamily:"inherit",outline:"none",textTransform:"uppercase"}}
                                  value={nw.icd||""}
                                  onChange={e=>{const v=e.target.value.toUpperCase();
                                    setTherapieDraft(d=>d.map((m,i)=>{
                                      if(i!==mi)return m;
                                      const nwArr=[...(m.nw||[])];nwArr[ni]={...nwArr[ni],icd:v};
                                      return{...m,nw:nwArr};}));}}/>
                                <select value={nw.haeuf||"gelegentlich"}
                                  style={{flex:1,padding:"4px 6px",border:"1px solid #d8c8b0",borderRadius:5,
                                    fontSize:11.5,fontFamily:"inherit",cursor:"pointer"}}
                                  onChange={e=>{const v=e.target.value;
                                    setTherapieDraft(d=>d.map((m,i)=>{
                                      if(i!==mi)return m;
                                      const nwArr=[...(m.nw||[])];nwArr[ni]={...nwArr[ni],haeuf:v};
                                      return{...m,nw:nwArr};}));}}>
                                  <option>sehr häufig (&gt;10%)</option>
                                  <option>häufig (1-10%)</option>
                                  <option>gelegentlich (0.1-1%)</option>
                                  <option>selten (0.01-0.1%)</option>
                                  <option>sehr selten (&lt;0.01%)</option>
                                  <option>häufig bei Absetzen ohne Anschluss</option>
                                  <option>erhöhtes Langzeitrisiko</option>
                                </select>
                                <button onClick={()=>setTherapieDraft(d=>d.map((m,i)=>{
                                  if(i!==mi)return m;
                                  return{...m,nw:(m.nw||[]).filter((_,j)=>j!==ni)};}))}
                                  style={{flexShrink:0,background:"#fee2e2",color:"#dc2626",
                                    border:"1px solid #fca5a5",borderRadius:5,padding:"3px 7px",
                                    cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>✕</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            </div>

            {/* ── Briefkopf Tab ── */}
            {activeTab==="briefkopf"&&(
              <div style={{padding:"22px 24px",maxWidth:640}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,
                  color:"var(--D)",marginBottom:6}}>✏ Briefkopf bearbeiten</div>
                <div style={{fontSize:12.5,color:"#7a6a5a",marginBottom:18,lineHeight:1.6}}>
                  Diese Angaben erscheinen auf allen ausgedruckten Dokumenten und Befundberichten.
                </div>
                <div className="lh-grid" style={{marginBottom:14}}>
                  <div className="lh-field"><label>Name / Titel</label>
                    <input value={lh.name} onChange={e=>onSaveLh({...lh,name:e.target.value})} placeholder="Dr. med. Mustermann"/></div>
                  <div className="lh-field"><label>Fachrichtung</label>
                    <input value={lh.title} onChange={e=>onSaveLh({...lh,title:e.target.value})} placeholder="Facharzt für …"/></div>
                  <div className="lh-field"><label>Straße und Hausnummer</label>
                    <input value={lh.strasse} onChange={e=>onSaveLh({...lh,strasse:e.target.value})} placeholder="Musterstraße 1"/></div>
                  <div className="lh-field"><label>PLZ und Ort</label>
                    <input value={lh.plz_ort} onChange={e=>onSaveLh({...lh,plz_ort:e.target.value})} placeholder="12345 Musterstadt"/></div>
                  <div className="lh-field"><label>Telefon (optional)</label>
                    <input value={lh.telefon} onChange={e=>onSaveLh({...lh,telefon:e.target.value})} placeholder="040 / …"/></div>
                  <div className="lh-field"><label>Fax (optional)</label>
                    <input value={lh.fax} onChange={e=>onSaveLh({...lh,fax:e.target.value})} placeholder="040 / …"/></div>
                </div>
                <div className="lh-field" style={{marginBottom:18}}>
                  <label>E-Mail (optional)</label>
                  <input value={lh.email} style={{maxWidth:340}} onChange={e=>onSaveLh({...lh,email:e.target.value})} placeholder="praxis@example.de"/>
                </div>
                {/* Preview */}
                <div style={{padding:"14px 18px",background:"#faf8f4",border:"1.5px solid #d8c8a8",
                  borderRadius:8,marginTop:4}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",
                    color:"#9a8878",marginBottom:10}}>Vorschau</div>
                  <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                    <div style={{fontSize:26,color:"#9a7a5a",lineHeight:1}}>⚕</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:15,color:"#2c1f0e"}}>{lh.name||"Name fehlt"}</div>
                      {lh.title&&<div style={{fontSize:12.5,color:"#7a6a5a"}}>{lh.title}</div>}
                      <div style={{fontSize:12,color:"#9a8a7a",marginTop:2}}>
                        {lh.strasse}{lh.strasse&&lh.plz_ort?" · ":""}{lh.plz_ort}
                      </div>
                      {(lh.telefon||lh.fax||lh.email)&&(
                        <div style={{fontSize:11.5,color:"#9a8a7a",marginTop:2}}>
                          {lh.telefon&&`Tel.: ${lh.telefon}`}
                          {lh.fax&&` | Fax: ${lh.fax}`}
                          {lh.email&&` | ${lh.email}`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{marginTop:14,fontSize:12,color:"#9a8a7a"}}>
                  💾 Änderungen werden sofort gespeichert.
                </div>
              </div>
            )}

            <div className="admin-footer">
              {(activeTab!=="auswertung"&&activeTab!=="verlauf"&&activeTab!=="briefkopf"&&activeTab!=="risiko"&&activeTab!=="patienten")&&<button className="admin-reset-btn" onClick={handleReset}>↩ Auf Standard zurücksetzen</button>}
              <button className="admin-save-btn" onClick={handleSave}>{(activeTab==="auswertung"||activeTab==="verlauf"||activeTab==="briefkopf"||activeTab==="risiko"||activeTab==="patienten")?"✕ Schließen":"✓ Speichern & Schließen"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}



/* ─── OSTEOPOROSE THERAPIE SEKTION ────────────────────────────────────────── */
function OsteoMedSammlung({onCameraOpen,freitextMeds,onFreitextMeds}){
  const[text,setText]=useState("");
  const tags=freitextMeds||[];
  const addTag=(t)=>{const v=t.trim();if(!v||tags.includes(v))return;onFreitextMeds([...tags,v]);};
  const removeTag=(i)=>onFreitextMeds(tags.filter((_,j)=>j!==i));
  const handleKey=(e)=>{if(e.key==="Enter"||e.key===","){addTag(text);setText("");}};
  return(
    <div style={{background:"#f4f7f0",border:"2px solid #6a9a5a",borderRadius:10,
      padding:"15px 17px",marginBottom:16}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:13.5,fontWeight:700,
        color:"#1a3a10",marginBottom:11,display:"flex",alignItems:"center",gap:8}}>
        📋 Frühere Osteoporose-Medikamente – schnell erfassen
      </div>

      {/* Kamera */}
      {onCameraOpen&&(
        <button onClick={onCameraOpen} className="no-print" style={{
          width:"100%",padding:"12px 15px",
          background:"linear-gradient(135deg,#1a3a10,#2a5a1a)",
          color:"white",border:"none",borderRadius:8,cursor:"pointer",
          fontFamily:"'Source Sans 3',sans-serif",fontSize:13,fontWeight:600,
          display:"flex",alignItems:"center",justifyContent:"center",gap:10,
          boxShadow:"0 3px 12px rgba(0,0,0,.18)",marginBottom:8}}>
          <span style={{fontSize:19}}>📷</span>
          <div style={{textAlign:"left"}}>
            <div>Medikamentenplan oder Schachtel fotografieren</div>
            <div style={{fontSize:11,fontWeight:400,opacity:.8,marginTop:1}}>
              QR-Code (Einheitlicher Medikationsplan) · Barcode (PZN/EAN) · KI-Fotoerkennung
            </div>
          </div>
        </button>
      )}

      {/* Klarschrift */}
      <div style={{display:"flex",gap:8,marginBottom:9}}>
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={handleKey}
          placeholder="Medikamentenname eingeben, dann Enter drücken…"
          style={{flex:1,padding:"8px 11px",border:"1.5px solid #7aaa5a",borderRadius:6,
            fontSize:13,fontFamily:"'Source Sans 3',sans-serif",outline:"none",background:"white"}}/>
        <button onClick={()=>{addTag(text);setText("");}}
          style={{padding:"8px 14px",background:"#3a7a2a",color:"white",border:"none",
            borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:600,
            fontFamily:"'Source Sans 3',sans-serif",whiteSpace:"nowrap"}}>
          + Hinzufügen
        </button>
      </div>

      {/* Tags */}
      {tags.length===0
        ? <div style={{fontSize:12,color:"#6a8a5a",fontStyle:"italic",padding:"4px 2px"}}>
            Noch nichts eingetragen – Kamera nutzen oder Namen eingeben
          </div>
        : <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {tags.map((t,i)=>(
              <span key={i} style={{display:"inline-flex",alignItems:"center",gap:5,
                padding:"5px 10px",background:"#d8edd0",border:"1px solid #7aaa5a",
                borderRadius:20,fontSize:12,color:"#1a3a10",fontWeight:500}}>
                💊 {t}
                <button onClick={()=>removeTag(i)} className="no-print"
                  style={{background:"none",border:"none",cursor:"pointer",
                    color:"#4a7a3a",fontSize:14,lineHeight:1,padding:"0 2px",fontWeight:700}}>
                  ×
                </button>
              </span>
            ))}
          </div>
      }
      <div style={{fontSize:11,color:"#6a8a5a",marginTop:7,lineHeight:1.5}}>
        ℹ Tragen Sie hier alle früheren und aktuellen Osteoporose-Medikamente ein. Unten können Sie die Einnahme detailliert (mit Zeitraum, Dosis und Absetzgrund) erfassen.
      </div>
    </div>
  );
}

function OsteoTherapieSection({history,setHistory,db,open,onToggle,onCameraOpen,freitextMeds,onFreitextMeds}){
  const iSt={padding:"5px 8px",border:"1px solid #d8c8b0",borderRadius:6,fontSize:13,fontFamily:"inherit",background:"white",outline:"none"};
  const selSt={...iSt,cursor:"pointer"};
  const delBSt={padding:"4px 9px",borderRadius:5,border:"1px solid #fca5a5",background:"#fee2e2",color:"#dc2626",cursor:"pointer",fontSize:13,fontFamily:"inherit",flexShrink:0};
  const addBSt={padding:"5px 14px",borderRadius:6,border:"1px dashed #9b7a5a",background:"white",color:"#6b5040",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600};
  const fld=(label,children)=>(<div style={{display:"flex",flexDirection:"column",gap:3}}><label style={{fontSize:12,color:"#6b5a4a",fontWeight:600,whiteSpace:"nowrap"}}>{label}</label>{children}</div>);

  const addEntry=()=>setHistory(h=>[...h,{medId:"",vonJahr:"",bisJahr:"",nochAktuell:false,dosierung:"",abgesetzt:false,absetzGrund:"",absetzNwIds:[],anmerkung:""}]);
  const updEntry=(i,f,v)=>setHistory(h=>{const r=[...h];r[i]={...r[i],[f]:v};return r;});
  const delEntry=(i)=>setHistory(h=>h.filter((_,j)=>j!==i));
  const toggleNw=(i,nwId)=>setHistory(h=>{
    const r=[...h]; const ids=r[i].absetzNwIds||[];
    r[i]={...r[i],absetzNwIds:ids.includes(nwId)?ids.filter(x=>x!==nwId):[...ids,nwId]};
    return r;
  });

  const hasData=history.length>0;
  const gruppen=[...new Set((db||OSTEO_THERAPIE_DEFAULTS).map(m=>m.gruppe))];

  return(
    <div className="section-card" style={{marginBottom:12,overflow:"hidden"}}>
      <div className="section-header" onClick={onToggle} style={{cursor:"pointer",userSelect:"none"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>💊</span>
          <div>
            <div style={{fontWeight:700,fontSize:15}}>Bisherige Osteoporose-Therapie</div>
            <div style={{fontSize:12,color:"#9b8a7a",fontWeight:400}}>
              Frühere und aktuelle medikamentöse Behandlung der Osteoporose
              {hasData&&<span style={{marginLeft:8,color:"#4a8f3a",fontWeight:600,fontSize:11}}>✓ {history.length} Eintrag{history.length!==1?"einträge":""}</span>}
            </div>
          </div>
        </div>
        <span style={{fontSize:18,color:"var(--P)"}}>{open?"▲":"▼"}</span>
      </div>

      {open&&(
        <div style={{padding:"14px 18px"}}>
          {/* ── Kamera + Klarschrifteingabe (wie MedsSammlung) ── */}
          <OsteoMedSammlung
            onCameraOpen={onCameraOpen}
            freitextMeds={freitextMeds}
            onFreitextMeds={onFreitextMeds}/>

          {/* Trennlinie */}
          <div style={{fontSize:12,fontWeight:700,color:"#7a5a38",letterSpacing:"1px",
            textTransform:"uppercase",margin:"16px 0 12px",display:"flex",alignItems:"center",gap:8}}>
            <span style={{flex:1,height:1,background:"#e8d8c0"}}/>
            Strukturierte Therapieerfassung
            <span style={{flex:1,height:1,background:"#e8d8c0"}}/>
          </div>

          {history.length===0&&(
            <div style={{fontSize:12,color:"#a09080",fontStyle:"italic",marginBottom:8}}>
              Noch keine strukturierten Einträge. Nutzen Sie den Button unten zum Hinzufügen.
            </div>
          )}

          {history.map((en,i)=>{
            const med=(db||OSTEO_THERAPIE_DEFAULTS).find(m=>m.id===en.medId)||null;
            return(
              <div key={i} style={{marginBottom:10,padding:"11px 13px",border:`1.5px solid ${med?"#9b7a5a":"#e0d0b8"}`,
                borderRadius:9,background:med?"#fffcf8":"#fafaf8",position:"relative"}}>
                {/* Header row */}
                <div style={{display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap",marginBottom:8}}>
                  <span style={{fontSize:13,fontWeight:700,color:"#9b7a5a",minWidth:22,paddingBottom:4}}>{i+1}.</span>
                  {fld("Medikament / Wirkstoff",
                    <select style={{...selSt,minWidth:300,flex:2}} value={en.medId}
                      onChange={e=>updEntry(i,"medId",e.target.value)}>
                      <option value="">– Bitte wählen –</option>
                      {gruppen.map(grp=>(
                        <optgroup key={grp} label={"── "+grp+" ──"}>
                          {(db||OSTEO_THERAPIE_DEFAULTS).filter(m=>m.gruppe===grp).map(m=>(
                            <option key={m.id} value={m.id}>{m.wirkstoff}{m.handelsnamen?" ("+m.handelsnamen.split(",")[0]+")":""}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  )}
                  {fld("Von (Jahr)",
                    <input type="number" min="1980" max="2026" placeholder="z.B. 2018"
                      style={{...iSt,width:88}} value={en.vonJahr}
                      onChange={e=>updEntry(i,"vonJahr",e.target.value)}/>
                  )}
                  {en.nochAktuell
                    ? <div style={{alignSelf:"flex-end",padding:"5px 0",fontSize:12,color:"#4a8f3a",fontWeight:700}}>→ noch aktuell</div>
                    : fld("Bis (Jahr)",
                        <input type="number" min="1980" max="2026" placeholder="z.B. 2022"
                          style={{...iSt,width:88}} value={en.bisJahr}
                          onChange={e=>updEntry(i,"bisJahr",e.target.value)}/>
                      )
                  }
                  <div style={{alignSelf:"flex-end",paddingBottom:4}}>
                    <label style={{display:"flex",gap:5,alignItems:"center",cursor:"pointer",fontSize:12,fontWeight:600,color:"#5a7a3a"}}>
                      <input type="checkbox" checked={!!en.nochAktuell}
                        onChange={e=>updEntry(i,"nochAktuell",e.target.checked)}
                        style={{width:14,height:14,accentColor:"#5a7a3a",cursor:"pointer"}}/>
                      Noch aktuell
                    </label>
                  </div>
                  <button onClick={()=>delEntry(i)} style={{...delBSt,alignSelf:"flex-end"}}>✕ Entfernen</button>
                </div>

                {/* Med info box */}
                {med&&(
                  <div style={{marginBottom:8,padding:"7px 10px",background:"#f7f4ee",borderRadius:6,fontSize:12,lineHeight:1.6}}>
                    <div><strong>Handelsnamen:</strong> {med.handelsnamen}</div>
                    <div><strong>Standarddosis:</strong> {med.dosierung}</div>
                    <div><strong>Zulassung:</strong> {med.zulassung}</div>
                    {med.anmerkung&&<div style={{color:"#9b5a10",marginTop:2}}>⚠ {med.anmerkung}</div>}
                  </div>
                )}

                {/* Dosierung + Abgesetzt */}
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                  {fld("Verwendete Dosierung / Darreichungsform (opt.)",
                    <input placeholder={med?med.dosierung:"z.B. 70 mg 1×/Woche"}
                      style={{...iSt,minWidth:220,flex:2}} value={en.dosierung}
                      onChange={e=>updEntry(i,"dosierung",e.target.value)}/>
                  )}
                </div>

                {/* Absetzen */}
                {!en.nochAktuell&&(
                  <div style={{marginBottom:8}}>
                    <label style={{display:"flex",gap:6,alignItems:"center",cursor:"pointer",
                      padding:"5px 10px",borderRadius:6,fontSize:12.5,fontWeight:600,
                      background:en.abgesetzt?"#fef3c7":"#f5f0ea",
                      border:en.abgesetzt?"1px solid #f59e0b":"1px solid #e0d0b0",
                      display:"inline-flex",marginBottom:6}}>
                      <input type="checkbox" checked={!!en.abgesetzt}
                        onChange={e=>updEntry(i,"abgesetzt",e.target.checked)}
                        style={{width:15,height:15,accentColor:"#d97706",cursor:"pointer"}}/>
                      Medikament wurde abgesetzt / beendet
                    </label>
                    {en.abgesetzt&&(
                      <div style={{padding:"8px 10px",background:"#fffbf0",border:"1px solid #f59e0b",borderRadius:6,marginTop:4}}>
                        <div style={{marginBottom:6}}>
                          {fld("Absetzgrund",
                            <select style={{...selSt,minWidth:280}} value={en.absetzGrund}
                              onChange={e=>updEntry(i,"absetzGrund",e.target.value)}>
                              <option value="">– Grund wählen –</option>
                              {ABSETZ_GRUENDE.map(g=><option key={g.id} value={g.id}>{g.label}</option>)}
                            </select>
                          )}
                        </div>
                        {en.absetzGrund==="nw"&&med&&med.nw&&med.nw.length>0&&(
                          <div>
                            <div style={{fontSize:12,fontWeight:700,color:"#7a5010",marginBottom:5}}>
                              Welche Nebenwirkungen? (Mehrfachauswahl, aus Fachinformation)
                            </div>
                            {med.nw.map(nw=>{
                              const checked=(en.absetzNwIds||[]).includes(nw.id);
                              return(
                                <label key={nw.id} style={{display:"flex",gap:7,alignItems:"flex-start",
                                  cursor:"pointer",padding:"4px 8px",borderRadius:5,marginBottom:2,
                                  background:checked?"#fff8e1":"white",
                                  border:checked?"1px solid #f59e0b":"1px solid transparent"}}>
                                  <input type="checkbox" checked={checked}
                                    onChange={()=>toggleNw(i,nw.id)}
                                    style={{width:15,height:15,marginTop:1,accentColor:"#d97706",cursor:"pointer",flexShrink:0}}/>
                                  <div>
                                    <span style={{fontSize:12.5,fontWeight:checked?700:400}}>{nw.label}</span>
                                    <span style={{marginLeft:6,fontSize:10.5,padding:"1px 5px",borderRadius:8,
                                      background:"#e8f0fe",color:"#1a3a8a",fontWeight:600}}>{nw.icd}</span>
                                    <span style={{marginLeft:6,fontSize:10.5,color:"#9b8a7a"}}>{nw.haeuf}</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Anmerkung */}
                <div>
                  {fld("Anmerkung / Verlauf / Ergebnis (opt.)",
                    <input placeholder="z.B. gut verträglich, Therapieerfolg DXA +5%, Umstellung wegen ONJ…"
                      style={{...iSt,width:"100%",boxSizing:"border-box"}} value={en.anmerkung}
                      onChange={e=>updEntry(i,"anmerkung",e.target.value)}/>
                  )}
                </div>
              </div>
            );
          })}

          <button onClick={addEntry} style={addBSt}>+ Osteoporose-Medikament hinzufügen</button>
        </div>
      )}
    </div>
  );
}

/* ═══════════ OSTEOPOROSE-THERAPIE DATENBANK ═══════════════════════════════ */
const OSTEO_THERAPIE_KEY="osteo_therapie_db_v1";
// This will be inserted as OSTEO_THERAPIE_DEFAULTS

const OSTEO_THERAPIE_DEFAULTS = [

  /* ═══════════════════════════════════════════════════════════════════
     BISPHOSPHONATE – ORAL
     ═══════════════════════════════════════════════════════════════════ */
  {
    id:"alendronat",gruppe:"Bisphosphonate (oral)",
    indikation:["Osteoporose","manifeste Osteoporose"],
    wirkstoff:"Alendronsäure",
    handelsnamen:"Fosamax® 70 mg · Tevanate® 70 mg · Alendronat-Actavis® 70 mg · Alendronat AL 70® · Alendronat Aurobindo 70 mg® · Alendronat Bluefish 70 mg® · Alendronat Heumann 70 mg® · Alendronat HEXAL 70 mg® · Alendronat-ratiopharm® 70 mg · Alendronat Sandoz® 70 mg · Alendronat Stada® 70 mg · Alendronat TAD® 70 mg · Alendronat Winthrop® 70 mg · Alendronsäure Aristo® 70 mg · Alendronsäure-CT 70 mg® · Binosto® 70 mg (brausetablette)",
    dosierung:"🦴 Osteoporose / manifeste Osteoporose (Fachinformation):\n70 mg einmal wöchentlich oral. Einnahme nüchtern, mindestens 30 Minuten vor der ersten Mahlzeit, dem ersten Getränk (außer Leitungswasser) oder Arzneimittel des Tages. Tablette mit einem vollen Glas Leitungswasser (mind. 200 ml) schlucken. Danach mindestens 30 Minuten aufrecht bleiben (sitzen oder stehen), nicht hinlegen.\n\n✅ In der Praxis üblich:\n70 mg 1× pro Woche, z.B. montags nüchtern. Binosto® 70 mg als Brausetablette (in Wasser auflösen) bei Schluckproblemen oder Ösophagus-Empfindlichkeit. Alternativ täglich 10 mg (seltener verwendet). Glukokortikoid-induziert: 10 mg täglich oder 70 mg wöchentlich.",
    zulassung:"Postmenopausale Osteoporose (F); Osteoporose beim Mann (M); Glukokortikoid-induzierte Osteoporose",
    anmerkung:"Häufigstes Bisphosphonat in Deutschland. Binosto® als Brausetablette bei Schluckproblemen.",
    besonderheit:"📊 Vergleiche & Studien:\n\n🔬 vs. Risedronat (Frakturreduktion):\nBeide zeigen vergleichbare Wirksamkeit. Eine Netzwerkmetaanalyse (Migliore et al., 2021) fand keine signifikanten Unterschiede in der vertebralen Frakturreduktion (RR ~0.55–0.60 vs. Placebo).\nLiteratur: https://doi.org/10.1007/s00198-021-05910-4\n\n🔬 vs. Zoledronat (Adhärenz + Wirkung):\nZoledronsäure 1×/Jahr zeigt in der HORIZON-PFT-Studie (Black et al., NEJM 2007) überlegene Adhärenz durch Jahresgabe; vergleichbare Frakturreduktion. Bei postmenopausaler OP nach Hüftfraktur deutlich bessere Mortalitätsreduktion (27%).\nLiteratur: https://doi.org/10.1056/NEJMoa0707725\n\n🔬 Geschwindigkeit der Wirkung:\nBMD-Anstieg nach 6–12 Monaten messbar; Frakturreduktion vertebral bereits ab Jahr 1 (FIT-Studie, Black et al., Lancet 1996).\nLiteratur: https://doi.org/10.1016/S0140-6736(96)91487-7\n\n⚠ Ösophagus-NW-Vergleich:\nAlendronsäure > Risedronsäure bezüglich GI-Nebenwirkungen (Solomon et al., Arch Intern Med 2005).\nLiteratur: https://doi.org/10.1001/archinte.165.16.1861",
    nw:[
      {id:"oeso",    label:"Ösophagitis / Speiseröhrenentzündung / Ösophagusulkus", icd:"K20",   haeuf:"häufig"},
      {id:"dysphagie",label:"Schluckbeschwerden (Dysphagie)",                       icd:"R13.1", haeuf:"häufig"},
      {id:"bauch",   label:"Bauchschmerzen / Sodbrennen / Übelkeit / Diarrhoe",     icd:"R10.1", haeuf:"häufig"},
      {id:"onj",     label:"Kieferosteonekrose (ONJ)",                              icd:"M87.18",haeuf:"selten"},
      {id:"aff",     label:"Atypische Femurfraktur",                                icd:"M84.55",haeuf:"sehr selten (< 1/10.000)"},
      {id:"myalg",   label:"Muskel-, Gelenk- und Knochenschmerzen",                icd:"M79.3", haeuf:"häufig"},
      {id:"hypokal", label:"Hypokalzämie",                                          icd:"E83.51",haeuf:"gelegentlich"},
      {id:"kopf",    label:"Kopfschmerzen",                                          icd:"R51",   haeuf:"gelegentlich"},
      {id:"auge",    label:"Augenentzündung (Uveitis / Skleritis / Episkleritis)",  icd:"H20",   haeuf:"selten"},
    ]
  },
  {
    id:"risedronat",gruppe:"Bisphosphonate (oral)",
    indikation:["Osteoporose","manifeste Osteoporose"],
    wirkstoff:"Risedronsäure",
    handelsnamen:"Actonel® 35 mg (wöchentlich) · Actonel® 75 mg (2 Tage/Monat) · Actonel Combi® (mit Kalzium+Vit.D) · Actonel Combi D® · Risedronat AL® · Risedronat Aristo® · Risedronat Aurobindo® · Risedronat Bluefish® · Risedronat Heumann® · Risedronat HEXAL® · Risedronat-ratiopharm® · Risedronat Sandoz® · Risedronat Stada® · Risedronat Winthrop® · Risedronsäure Actavis® · Risedronsäure-CT®",
    dosierung:"🦴 Osteoporose / manifeste Osteoporose (Fachinformation):\n35 mg einmal wöchentlich oral. Einnahme nüchtern, mindestens 30 Minuten vor der ersten Mahlzeit des Tages, mit einem Glas klarem Wasser (kein Mineralwasser), aufrecht sitzen oder stehen (mind. 30 min). Alternativ: 75 mg an 2 aufeinanderfolgenden Tagen pro Monat. Für Glukokortikoid-Osteoporose: 5 mg täglich.\n\n✅ In der Praxis üblich:\n35 mg 1× wöchentlich – bevorzugt bei Patienten mit GI-Empfindlichkeit gegenüber Alendronat. Actonel Combi D® enthält zusätzlich Kalzium + Vitamin D als Beutel an den anderen 6 Wochentagen.",
    zulassung:"Postmenopausale Osteoporose (F); Glukokortikoid-induzierte Osteoporose; Osteoporose beim Mann",
    anmerkung:"Etwas besser ösophagusverträglich als Alendronsäure. Actonel Combi® enthält Kalzium + Vitamin D in Beutelform.",
    besonderheit:"📊 Vergleiche & Studien:\n\n🔬 vs. Alendronat (GI-Verträglichkeit):\nRisedronsäure hat signifikant weniger Ösophagus-Nebenwirkungen als Alendronsäure (Solomon et al., Arch Intern Med 2005).\nLiteratur: https://doi.org/10.1001/archinte.165.16.1861\n\n🔬 Frakturreduktion (VERT-Studien):\nVERT-MN und VERT-NA: vertebrale Frakturreduktion 41–49% vs. Placebo nach 3 Jahren; nicht-vertebrale 36% (Harris et al., JAMA 1999; Reginster et al., Osteoporos Int 2000).\nLiteratur: https://doi.org/10.1001/jama.282.14.1344\nLiteratur: https://pubmed.ncbi.nlm.nih.gov/10663363\n\n🔬 vs. Zoledronat (Wirkgeschwindigkeit):\nZoledronsäure zeigt etwas schnellere BTM-Suppression (nach 3 Monaten) als orale Bisphosphonate.\nLiteratur: https://doi.org/10.1007/s00198-009-1066-z\n\n🏥 HIP-Studie (McClung et al., NEJM 2001):\nHüftfrakturreduktion 40% bei ≥ 70-jährigen Frauen mit Osteoporose; 30% in Gesamtgruppe.\nLiteratur: https://doi.org/10.1056/NEJM200102013440504",
    nw:[
      {id:"oeso",    label:"Ösophagitis / Speiseröhrenentzündung",                  icd:"K20",   haeuf:"gelegentlich"},
      {id:"bauch",   label:"Bauchschmerzen / Übelkeit / Diarrhoe / Obstipation",   icd:"R10.1", haeuf:"häufig"},
      {id:"onj",     label:"Kieferosteonekrose (ONJ)",                              icd:"M87.18",haeuf:"selten"},
      {id:"aff",     label:"Atypische Femurfraktur",                                icd:"M84.55",haeuf:"sehr selten"},
      {id:"myalg",   label:"Muskel-, Gelenk- und Knochenschmerzen",                icd:"M79.3", haeuf:"gelegentlich"},
      {id:"hypokal", label:"Hypokalzämie",                                          icd:"E83.51",haeuf:"gelegentlich"},
      {id:"kopf",    label:"Kopfschmerzen / Schwindel",                             icd:"R51",   haeuf:"gelegentlich"},
      {id:"auge",    label:"Augenentzündung (Uveitis / Skleritis / Iritis)",        icd:"H20",   haeuf:"selten"},
    ]
  },
  {
    id:"ibandronat_oral",gruppe:"Bisphosphonate (oral)",
    indikation:["Osteoporose"],
    wirkstoff:"Ibandronsäure (oral, monatlich)",
    handelsnamen:"Bonviva® 150 mg Tablette · Bondronat® 50 mg (täglich, onkologisch) · Ibandronsäure Actavis® 150 mg · Ibandronsäure AL 150 mg® · Ibandronsäure Aurobindo 150 mg® · Ibandronsäure Bluefish 150 mg® · Ibandronsäure Heumann 150 mg® · Ibandronsäure HEXAL 150 mg® · Ibandronsäure-ratiopharm® 150 mg · Ibandronsäure Sandoz® 150 mg · Ibandronsäure Stada® 150 mg · Ibandronsäure Winthrop® 150 mg",
    dosierung:"🦴 Osteoporose (Fachinformation):\n150 mg einmal monatlich oral. Einnahme nüchtern, mindestens 60 Minuten vor der ersten Mahlzeit, dem ersten Getränk (außer Leitungswasser) oder Arzneimittel des Tages. Mit einem Glas klarem Leitungswasser (mind. 180 ml), aufrecht bleiben (sitzen/stehen, nicht hinlegen) für mindestens 60 Minuten nach Einnahme.\n\n✅ In der Praxis üblich:\n150 mg einmal monatlich, z.B. immer am 1. des Monats. Gute Option bei wöchentlicher Einnahme-Compliance-Problemen. Keine manifeste Osteoporose-Zulassung (nur postmenopausale OP).\n\n⚠ Bondronat® 50 mg täglich oral: ausschließlich onkologische Zulassung (Prävention skelettbezogener Komplikationen bei Knochenmetastasen, Mammakarzinom) – NICHT für Osteoporose.",
    zulassung:"Postmenopausale Osteoporose",
    anmerkung:"Monatliche Einnahme verbessert Adhärenz. Bondronat® 50 mg täglich ist onkologisch zugelassen (nicht für Osteoporose).",
    besonderheit:"📊 Vergleiche & Studien:\n\n🔬 vs. Alendronat/Risedronat (nicht-vertebral):\nIbandronsäure oral zeigt in der BONE-Studie (Chesnut et al., J Bone Miner Res 2004) vertebrale Frakturreduktion 52% vs. Placebo. Für nicht-vertebrale Frakturen: KEINE signifikante Reduktion in der Hauptstudie (nur in Post-hoc-Analyse bei höherer Dosierung).\nLiteratur: https://doi.org/10.1359/jbmr.040406\n\n⚠ Stellenwert laut DVO-Leitlinie 2023:\nIbandronsäure oral ist bei DVO 2023 für die Frakturreduktion weniger gut belegt als Alendronat, Risedronat oder Zoledronsäure. Kann bei Unverträglichkeit der anderen Bisphosphonate eingesetzt werden.\n\n🔬 MOTION-Studie (Reginster et al., 2006):\nMonatlich 150 mg oral nicht unterlegen vs. täglich 2,5 mg oral bezüglich BMD-Anstieg.\nLiteratur: https://doi.org/10.1093/rheumatology/kel090",
    nw:[
      {id:"bauch",   label:"Bauchschmerzen / Übelkeit / Diarrhoe / Dyspepsie",     icd:"R10.1", haeuf:"häufig"},
      {id:"oeso",    label:"Ösophagitis / Speiseröhrenentzündung",                  icd:"K20",   haeuf:"gelegentlich"},
      {id:"onj",     label:"Kieferosteonekrose (ONJ)",                              icd:"M87.18",haeuf:"selten"},
      {id:"aff",     label:"Atypische Femurfraktur",                                icd:"M84.55",haeuf:"sehr selten"},
      {id:"myalg",   label:"Muskel- und Knochenschmerzen",                          icd:"M79.3", haeuf:"gelegentlich"},
      {id:"hypokal", label:"Hypokalzämie",                                          icd:"E83.51",haeuf:"gelegentlich"},
    ]
  },
  {
    id:"etidronat",gruppe:"Bisphosphonate (oral)",
    indikation:[],
    wirkstoff:"Etidronat (historisch, kaum noch verwendet)",
    handelsnamen:"Didronel® 400 mg · Didrokit® (mit Kalzium, zyklisch) · Diphos® – alle Präparate in Deutschland nicht mehr aktiv vermarktet",
    dosierung:"400 mg/Tag für 14 Tage, dann 76 Tage Kalzium (zyklisch)",
    zulassung:"Ehemals: Postmenopausale Osteoporose; Morbus Paget. Zulassung für Osteoporose in DE faktisch nicht mehr relevant.",
    anmerkung:"Erstes zugelassenes Bisphosphonat. Heute vollständig durch neuere Substanzen ersetzt. Nur noch in Therapieanamnesen älterer Patienten relevant.",
    nw:[
      {id:"bauch",  label:"Übelkeit / Diarrhoe / Bauchschmerzen",                   icd:"R10.1", haeuf:"häufig"},
      {id:"osteo",  label:"Osteomalazie bei Langzeitgabe (paradoxer Effekt)",        icd:"M83",   haeuf:"bei Überdosierung"},
      {id:"myalg",  label:"Knochen- und Muskelschmerzen",                            icd:"M79.3", haeuf:"gelegentlich"},
    ]
  },
  {
    id:"clodronat_oral",gruppe:"Bisphosphonate (oral)",
    indikation:["Osteoporose"],
    wirkstoff:"Clodronsäure (oral)",
    handelsnamen:"Bonefos® 400 mg Kapseln · Clodronat Hexal® · Ostac® – primär onkologische Indikation",
    dosierung:"1600 mg/Tag oral (bei Osteoporose, off-label; zugelassen für Hyperkalzämie/Knochenmetastasen)",
    zulassung:"In DE keine Zulassung für Osteoporose; zugelassen für tumorbedingte Hyperkalzämie und Knochenmetastasen",
    anmerkung:"Nur der Vollständigkeit halber – kein Standard in der Osteoporosetherapie. Relevant bei onkologischen Patienten.",
    nw:[
      {id:"bauch",  label:"Übelkeit / Diarrhoe / Bauchschmerzen",                   icd:"R10.1", haeuf:"sehr häufig"},
      {id:"niere",  label:"Nierenfunktionsverschlechterung",                         icd:"N17",   haeuf:"gelegentlich"},
      {id:"hypokal",label:"Hypokalzämie",                                            icd:"E83.51",haeuf:"gelegentlich"},
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     BISPHOSPHONATE – INTRAVENÖS
     ═══════════════════════════════════════════════════════════════════ */
  {
    id:"zoledronat",gruppe:"Bisphosphonate (intravenös)",
    indikation:["Osteoporose","manifeste Osteoporose","Tumortherapie"],
    wirkstoff:"Zoledronsäure",
    handelsnamen:"Aclasta® 5 mg/100 ml Infusionslösung · Zoledronsäure Accord® 5 mg · Zoledronsäure Actavis® 5 mg · Zoledronsäure AL 5 mg® · Zoledronsäure Aurobindo® 5 mg · Zoledronsäure Bluefish® · Zoledronsäure Fresenius Kabi® 5 mg · Zoledronsäure Heumann® 5 mg · Zoledronsäure HEXAL® 5 mg · Zoledronsäure Kabi® · Zoledronsäure-ratiopharm® 5 mg · Zoledronsäure Sandoz® 5 mg · Zoledronsäure Stada® 5 mg · Zoledronsäure Sun® · Zometa® 4 mg (onkologisch, andere Konzentration)",
    dosierung:"🦴 Osteoporose / manifeste Osteoporose (Aclasta® – Fachinformation):\n5 mg als einmalige IV-Infusion über mindestens 15 Minuten, 1× jährlich. Patient muss ausreichend hydriert sein (Trinken vor der Infusion empfohlen). Kalzium und Vitamin D vor/nach Gabe sicherstellen. Kontraindiziert bei GFR < 35 ml/min.\n\n💉 Tumortherapie / Knochenmetastasen (Zometa® – Fachinformation):\n4 mg als IV-Infusion über mindestens 15 Minuten, alle 3–4 Wochen. Bei GFR 30–60 ml/min Dosisreduktion erforderlich (3,0–3,5 mg). Kontraindiziert bei GFR < 30 ml/min.\n\n✅ In der Praxis üblich:\nOsteoporose: 5 mg i.v. 1× jährlich (Aclasta®). Tumortherapie: 4 mg i.v. alle 4 Wochen (Zometa®), im Verlauf Intervall auf alle 12 Wochen verlängerbar (nach Leitlinie bei stabiler Situation). Cave: Unterschiedliche Konzentration und Indikation – Aclasta® ≠ Zometa®!",
    zulassung:"Postmenopausale Osteoporose (F); Osteoporose beim Mann (M); Glukokortikoid-induzierte Osteoporose; Morbus Paget (einmalig 5 mg)",
    anmerkung:"Beste Adhärenz durch jährliche Einmalgabe. Akutphasenreaktion v.a. nach Erstgabe (ca. 30%). Kontraindikation: GFR < 35 ml/min.",
    besonderheit:"📊 Vergleiche & Studien:\n\n🔬 HORIZON-PFT-Studie (Black et al., NEJM 2007) – Kernstudie:\nZoledronsäure 5 mg i.v. 1×/Jahr vs. Placebo: Vertebrale Frakturreduktion 70%, nicht-vertebrale 25%, Hüftfraktur 41%. Zusätzlich: 27% Mortalitätsreduktion bei Patienten nach Hüftfraktur.\nLiteratur: https://doi.org/10.1056/NEJMoa0707725\n\n🔬 HORIZON-RFT-Studie (Lyles et al., NEJM 2007) – nach Hüftfraktur:\nZoledronsäure nach Hüftfraktur-OP: 35% Reduktion neuer klinischer Frakturen, 28% Mortalitätsreduktion. Einziges Bisphosphonat mit nachgewiesener Mortalitätsreduktion.\nLiteratur: https://doi.org/10.1056/NEJMoa074941\n\n🔬 vs. Alendronat (BTM-Suppression):\nZoledronsäure supprimiert Knochenumbaumarker schneller und vollständiger als wöchentliches Alendronat (Rosen et al., 2004).\nLiteratur: https://doi.org/10.1359/jbmr.040906\n\n🔬 Akutphasenreaktion (Häufigkeit):\nNach Erstgabe: 31,6% Fieber/Grippe (HORIZON). Zweite Gabe: < 7%. Präventiv: Paracetamol 1000 mg vor/nach Infusion (Reid et al., 2010).\nLiteratur: https://doi.org/10.1007/s00198-010-1326-3\n\n💉 Zometa® 4 mg Tumor vs. Pamidronsäure:\nZometa überlegen vs. Pamidronat bezüglich skelettbezogene Ereignisse bei multiplem Myelom und Brustkrebsmetastasen (Rosen et al., Cancer 2003).\nLiteratur: https://doi.org/10.1002/cncr.11600",
    nw:[
      {id:"akutphase",label:"Akute-Phase-Reaktion: Fieber, Grippe, Muskelschmerzen (v.a. nach Erstgabe)", icd:"R68.89",haeuf:"sehr häufig (> 30% nach Erstgabe)"},
      {id:"onj",      label:"Kieferosteonekrose (ONJ)",                              icd:"M87.18",haeuf:"selten"},
      {id:"aff",      label:"Atypische Femurfraktur",                                icd:"M84.55",haeuf:"sehr selten"},
      {id:"niere",    label:"Nierenfunktionsverschlechterung (Kontraindikation GFR < 35)", icd:"N17",haeuf:"selten"},
      {id:"hypokal",  label:"Hypokalzämie (Kalzium + Vit-D vor Gabe sicherstellen!)",icd:"E83.51",haeuf:"häufig"},
      {id:"vorhof",   label:"Vorhofflimmern",                                         icd:"I48",  haeuf:"selten"},
      {id:"myalg",    label:"Muskel-, Gelenk- und Knochenschmerzen",                 icd:"M79.3",haeuf:"häufig"},
      {id:"kopf",     label:"Kopfschmerzen",                                          icd:"R51",  haeuf:"häufig"},
      {id:"auge",     label:"Augenentzündung (Uveitis / Skleritis)",                 icd:"H20",  haeuf:"selten"},
    ]
  },
  {
    id:"ibandronat_iv",gruppe:"Bisphosphonate (intravenös)",
    indikation:["Osteoporose"],
    wirkstoff:"Ibandronsäure (intravenös, quartalsweise)",
    handelsnamen:"Bonviva® 3 mg/3 ml Injektionslösung · Ibandronsäure Actavis® 3 mg · Ibandronsäure AL 3 mg® · Ibandronsäure Aurobindo® 3 mg · Ibandronsäure HEXAL® 3 mg · Ibandronsäure-ratiopharm® 3 mg · Ibandronsäure Sandoz® 3 mg · Ibandronsäure Stada® 3 mg · Bondronat® 2 mg / 6 mg (onkologisch)",
    dosierung:"🦴 Osteoporose (Bonviva® i.v. – Fachinformation):\n3 mg als IV-Bolusinjektion über 15–30 Sekunden alle 3 Monate. Kein Infusionsgerät erforderlich. Keine Einschränkung hinsichtlich Nahrungsaufnahme. GFR-Grenze: nicht empfohlen bei GFR < 30 ml/min.\n\n💉 Tumortherapie / Knochenmetastasen (Bondronat® – Fachinformation):\n6 mg als IV-Infusion über 1 Stunde, alle 3–4 Wochen. Bei GFR 30–50 ml/min: 4 mg über 1 Stunde. Bei GFR < 30 ml/min: 2 mg über 1 Stunde. Nur für Knochenmetastasen bei Mammakarzinom zugelassen.\n\n✅ In der Praxis üblich:\nOsteoporose: 3 mg i.v. alle 3 Monate (Quartalsspritze) – praxistauglich da kurze Injektionszeit. Kein Akutphasensyndrom. Tumortherapie: 6 mg i.v. alle 3–4 Wochen (Bondronat®).",
    zulassung:"Postmenopausale Osteoporose",
    anmerkung:"Quartalsgabe; Injektion als schneller Bolus möglich (kein Infusionsgerät erforderlich). Kein Akutphasensyndrom wie bei Zoledronsäure.",
    besonderheit:"📊 Vergleiche & Studien:\n\n🔬 DIVA-Studie (Eisman et al., J Bone Miner Res 2008):\n3 mg i.v. alle 3 Monate nicht unterlegen vs. 150 mg oral monatlich bezüglich BMD-Anstieg an LWS und Hüfte. Kein Wirksamkeitsunterschied.\nLiteratur: https://doi.org/10.1359/jbmr.071115\n\n🔬 vs. Zoledronat (Akutphasenreaktion):\nIbandronsäure i.v. löst deutlich seltener Akutphasenreaktionen aus als Zoledronsäure (< 5% vs. ~30% nach Erstgabe).\nLiteratur: https://doi.org/10.1007/s00198-010-1326-3\n\n⚠ Stellenwert laut DVO-Leitlinie 2023:\nKeine ausreichende Studie zur nicht-vertebralen Frakturreduktion für i.v.-Ibandronsäure. Weniger belegt als Zoledronat. Praktische Option bei GI-Intoleranz und Wunsch nach parenteraler Therapie ohne Akutphase.\n\n💉 Bondronat® 6 mg Tumor vs. Zoledronat:\nVergleichbare Wirksamkeit bei Knochenmetastasen durch Mammakarzinom (Body et al., Ann Oncol 2003).\nLiteratur: https://doi.org/10.1093/annonc/mdg290",
    nw:[
      {id:"akutphase",label:"Grippeähnliche Reaktion nach Injektion (milder als Zoledronsäure)", icd:"R68.89",haeuf:"gelegentlich"},
      {id:"onj",      label:"Kieferosteonekrose (ONJ)",                              icd:"M87.18",haeuf:"selten"},
      {id:"hypokal",  label:"Hypokalzämie",                                          icd:"E83.51",haeuf:"gelegentlich"},
      {id:"niere",    label:"Nierenfunktionsverschlechterung",                       icd:"N17",   haeuf:"selten"},
      {id:"myalg",    label:"Muskel- und Knochenschmerzen",                          icd:"M79.3", haeuf:"gelegentlich"},
      {id:"kopf",     label:"Kopfschmerzen",                                          icd:"R51",  haeuf:"gelegentlich"},
    ]
  },
  {
    id:"pamidronat_iv",gruppe:"Bisphosphonate (intravenös)",
    indikation:["Tumortherapie"],
    wirkstoff:"Pamidronsäure (intravenös)",
    handelsnamen:"Aredia® 15 mg / 30 mg / 60 mg / 90 mg · Pamidronat Medac® · Pamidronat Gry® · Pamidronat Hexal® – überwiegend onkologisch",
    dosierung:"💉 Tumortherapie / Knochenmetastasen (Fachinformation):\nHyperkalzämie: 15–90 mg IV als Einzelinfusion (Dosis nach Kalziumspiegel). Knochenmetastasen (Mamma-Ca, Myelom): 90 mg IV alle 4 Wochen als Infusion über mind. 2 Stunden. Morbus Paget: 30 mg IV wöchentlich × 3 (Infusion 4 Stunden).\n\n🔄 Off-label Osteoporose:\n30 mg IV alle 3 Monate – wird eingesetzt bei oraler Bisphosphonat-Unverträglichkeit und wenn Zoledronsäure kontraindiziert (z.B. GFR 30–35 ml/min). Keine DE-Zulassung für diese Indikation.\n\n✅ In der Praxis üblich:\nTumortherapie: 90 mg alle 4 Wochen i.v. (Aredia®/Pamidronat Medac®). Infusion über 2–4 Stunden (langsamer als Zoledronsäure). Cave: stärkere Akutphasenreaktion und Nephrotoxizität als neuere Bisphosphonate.",
    zulassung:"In DE keine Zulassung für Osteoporose; zugelassen für Morbus Paget, tumor-induzierte Hyperkalzämie, Knochenmetastasen, Osteogenesis imperfecta",
    anmerkung:"Wird off-label bei Patienten mit GI-Unverträglichkeit auf orale Bisphosphonate und fehlender Zoledronsäure-Indikation eingesetzt.",
    besonderheit:"📊 Vergleiche & Studien:\n\n🔬 vs. Zoledronat (Knochenmetastasen, Rosen et al., Cancer 2003):\nZoledronsäure 4 mg war Pamidronat 90 mg bei Mammakarzinom-Knochenmetastasen nicht unterlegen; bei multiplem Myelom überlegen bezüglich skelettbezogener Ereignisse.\nLiteratur: https://doi.org/10.1002/cncr.11600\n\n🔬 Myelom (MRC IX, Morgan et al., Lancet 2010):\nPamidronat im Vergleich mit Zoledronsäure: vergleichbare Skelett-Ereignisrate, Zoledronsäure zeigte Überlebensvorteil von 5,5 Monaten.\nLiteratur: https://doi.org/10.1016/S0140-6736(10)60993-4\n\n⚠ Nephrotoxizität:\nPamidronat hat höhere Nephrotoxizität als Zoledronsäure bei zu schneller Infusion. Infusionsdauer mind. 2–4 Stunden, bei Niereninsuffizienz verlängern.\n\n🔬 Infusionsdauer-Vergleich:\nPamidronat: 2–4 Stunden vs. Zoledronat: 15 Minuten. Praktisch nachteilig; heute weitgehend durch Zoledronat ersetzt.",
    nw:[
      {id:"akutphase",label:"Akute-Phase-Reaktion: Fieber, Schüttelfrost",           icd:"R68.89",haeuf:"sehr häufig"},
      {id:"hypokal",  label:"Hypokalzämie / Hypofosfatämie",                         icd:"E83.51",haeuf:"häufig"},
      {id:"niere",    label:"Nierenfunktionsverschlechterung",                       icd:"N17",   haeuf:"gelegentlich"},
      {id:"onj",      label:"Kieferosteonekrose (ONJ)",                              icd:"M87.18",haeuf:"selten"},
      {id:"vene",     label:"Lokalreaktion / Phlebitis an der Infusionsstelle",      icd:"T80.1", haeuf:"häufig"},
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     RANKL-ANTIKÖRPER
     ═══════════════════════════════════════════════════════════════════ */
  {
    id:"denosumab",gruppe:"RANKL-Antikörper",
    indikation:["Osteoporose","manifeste Osteoporose","Tumortherapie"],
    wirkstoff:"Denosumab",
    handelsnamen:[
      // ── Originalpräparat ──────────────────────────────────────────────────────
      "Prolia® 60 mg/ml Fertigspritze (Originator, Amgen – Osteoporose, alle 6 Monate)",
      "Xgeva® 120 mg/1,7 ml (Originator, Amgen – onkologisch, alle 4 Wochen – andere Indikation)",
      // ── Biosimilars zu Prolia® 60 mg (Osteoporose) – EU-Zulassung ────────────
      "Jubbonti® 60 mg/ml Fertigspritze (Sandoz – EU-Zulassung Mai 2024, erste EU-Markteinführung Dez. 2025)",
      "Rolcya® 60 mg/ml Fertigspritze (Sandoz – EU-Zulassung Juli 2025)",
      "Obodence® 60 mg/ml Fertigspritze (Samsung Bioepis/Biogen – EU-Zulassung Feb. 2025)",
      "Stoboclo® 60 mg/ml Fertigspritze (Celltrion – EU-Zulassung Feb. 2025)",
      "Osvyrti® 60 mg/ml Fertigspritze (Accord Healthcare/Intas – EU-Zulassung Mai 2025)",
      "Zadenvi® 60 mg/ml Fertigspritze (Zentiva – EU-Zulassung Juni 2025)",
      "Izamby® 60 mg/ml Fertigspritze (Zentiva/mAbxience – EU-Zulassung Juni 2025)",
      "Evfraxy® 60 mg/ml Fertigspritze (Biocon – EU-Zulassung Juli 2025)",
      "Conexxence® 60 mg/ml Fertigspritze (Fresenius Kabi – EU-Zulassung Juli 2025)",
      "Junod® 60 mg/ml Fertigspritze (Gedeon Richter – EU-Zulassung 2025)",
      "Bildyos® 60 mg/ml Fertigspritze (Organon/Henlius – EU-Zulassung Sept. 2025)",
      "Kefdensis® 60 mg/ml Fertigspritze (STADA/Alvotech – EU-Zulassung Nov. 2025)",
      "Acvybra® 60 mg/ml Fertigspritze (Dr. Reddy's/Alvotech – EU-Zulassung Nov. 2025)",
      "Ponlimsi® 60 mg/ml Fertigspritze (Teva – EU-Zulassung Nov. 2025)",
      // ── Biosimilars zu Xgeva® 120 mg (onkologisch – andere Indikation) ────────
      "Wyost® 120 mg/1,7 ml (Sandoz – EU-Zulassung Mai 2024, onkologisch)",
      "Xbryk® 120 mg/1,7 ml (Samsung Bioepis – EU-Zulassung Feb. 2025, onkologisch)",
      "Osenvelt® 120 mg/1,7 ml (Celltrion – EU-Zulassung Feb. 2025, onkologisch)",
      "Jubereq® 120 mg/1,7 ml (Accord Healthcare – EU-Zulassung Mai 2025, onkologisch)",
      "Yaxwer® 120 mg/1,7 ml (Gedeon Richter – EU-Zulassung 2025, onkologisch)",
      "Denbrayce® 120 mg/1,7 ml (mAbxience – EU-Zulassung 2025, onkologisch)",
      "Vevzuo® 120 mg/1,7 ml (Biocon – EU-Zulassung Juli 2025, onkologisch)",
      "Bomyntra® 120 mg/1,7 ml (Fresenius Kabi – EU-Zulassung Juli 2025, onkologisch)",
      "Bilprevda® 120 mg/1,7 ml (Organon/Henlius – EU-Zulassung Sept. 2025, onkologisch)",
      "Zvogra® 120 mg/1,7 ml (STADA/Alvotech – EU-Zulassung Nov. 2025, onkologisch)",
      "Xbonzy® 120 mg/1,7 ml (Dr. Reddy's/Alvotech – EU-Zulassung Nov. 2025, onkologisch)",
      "Degevma® 120 mg/1,7 ml (Teva – EU-Zulassung Nov. 2025, onkologisch)",
    ].join(" · "),
    dosierung:"🦴 Osteoporose / manifeste Osteoporose (Prolia® – Fachinformation):\n60 mg subkutan als Einzelinjektion alle 6 Monate. Injektionsort: Oberschenkel, Bauch oder Oberarm (hinten). Gleichzeitig Kalzium ≥ 1000 mg/Tag und Vitamin D ≥ 400 IE/Tag supplementieren.\n⚠ INJEKTIONSINTERVALL DARF NICHT ÜBERSCHRITTEN WERDEN – Reboundgefahr mit multiplen Wirbelkörperfrakturen bei Verzögerung > 7 Monate!\n\n💉 Tumortherapie / Knochenmetastasen (Xgeva® – Fachinformation):\n120 mg subkutan alle 4 Wochen. In den ersten 2 Wochen: zusätzliche Gaben am Tag 8 und 15 der ersten Therapiewoche (sog. Loading Dose bei Riesenzelltumor). Keine Dosisanpassung bei Niereninsuffizienz erforderlich (Vorteil gegenüber Bisphosphonaten).\n\n✅ In der Praxis üblich:\nOsteoporose: Prolia® 60 mg s.c. alle 6 Monate (z.B. Januar + Juli). Konsequente Termintreue essenziell, ggf. Recall-System einrichten.\nTumortherapie: Xgeva® 120 mg s.c. alle 4 Wochen – Prolia® und Xgeva® sind NICHT austauschbar (unterschiedliche Indikation, Dosis und Zulassung).\n\n🔄 Absetzen: Immer mit Anschlusstherapie (Bisphosphonat, z.B. Zoledronat oder Alendronat) – sonst Reboundfrakturen!",
    zulassung:"Postmenopausale Osteoporose (F); Osteoporose beim Mann (M); Knochenschwund bei antihormoneller Tumortherapie; Glukokortikoid-induzierte Osteoporose",
    anmerkung:"⚠ WICHTIG: Absetzen ohne Anschlusspräparat (Bisphosphonat) führt zu schwerem Rebound mit multiplen Wirbelkörperfrakturen! Strenge Adhärenz und Übergangstherapie zwingend.",
    besonderheit:"📊 Vergleiche & Studien:\n\n🔬 FREEDOM-Studie (Cummings et al., NEJM 2009) – Kernstudie Prolia®:\nDenosumab 60 mg s.c. alle 6 Monate vs. Placebo: Vertebrale Frakturreduktion 68%, nicht-vertebrale 20%, Hüftfraktur 40% über 3 Jahre.\nLiteratur: https://doi.org/10.1056/NEJMoa0809493\n\n🔬 FREEDOM Extension (Bone et al., Osteoporos Int 2017):\n10-Jahres-Langzeitdaten: kontinuierlicher BMD-Anstieg (LWS +21,7%, Hüfte +9,2%) ohne Plateaueffekt – einzigartig unter allen Osteoporose-Medikamenten.\nLiteratur: https://doi.org/10.1007/s00198-017-4083-6\n\n🔬 vs. Alendronat (DECIDE-Studie, Brown et al., JBMR 2009):\nDenosumab überlegen vs. Alendronat bezüglich BMD-Anstieg (LWS, Hüfte, Radius) nach 12 Monaten.\nLiteratur: https://doi.org/10.1359/jbmr.090501\n\n🔬 vs. Zoledronat (DAPS-Studie, Recknor et al., Osteoporos Int 2013):\nKein signifikanter Unterschied in BMD-Anstieg; Denosumab etwas überlegen am distalen Radius.\nLiteratur: https://doi.org/10.1007/s00198-012-2198-0\n\n⚠ Rebound nach Absetzen (Cummings et al., JBMR 2018):\nNach Absetzen ohne Anschlusstherapie: rasche BTM-Erholung, BMD-Verlust auf Ausgangsniveau, Risiko multipler Wirbelkörperfrakturen (8,9× erhöht). Anschluss-Bisphosphonat zwingend!\nLiteratur: https://doi.org/10.1002/jbmr.3452\n\n💉 XGEVA vs. Zoledronat (Knochenmetastasen, Stopeck et al., JCO 2010):\nBei Mammakarzinom: Denosumab 120 mg signifikant überlegen vs. Zoledronsäure in Verzögerung skelettbezogener Ereignisse (SRE). NNT ~13 für 1 SRE.\nLiteratur: https://doi.org/10.1200/JCO.2010.30.4264\n\n🔬 Niereninsuffizienz:\nDenosumab als einziges Antiresorptivum ohne Dosisanpassung bei Niereninsuffizienz geeignet (GFR-unabhängige Elimination via RES). Cave: höheres Hypokalzämierisiko bei GFR < 30.",
    nw:[
      {id:"hypokal",    label:"Hypokalzämie (oft schwer, besonders bei Niereninsuffizienz)",    icd:"E83.51",haeuf:"häufig"},
      {id:"infekt",     label:"Schwere Infektionen: Haut (Zellulitis), Harnwege, Atemwege",     icd:"A49.9", haeuf:"häufig"},
      {id:"onj",        label:"Kieferosteonekrose (ONJ)",                                         icd:"M87.18",haeuf:"selten"},
      {id:"aff",        label:"Atypische Femurfraktur",                                           icd:"M84.55",haeuf:"sehr selten"},
      {id:"rebound",    label:"Rebound-Frakturen (Wirbelkörper) nach Absetzen ohne Anschluss",   icd:"M48.5", haeuf:"häufig bei Absetzen ohne Anschluss"},
      {id:"haut",       label:"Hautreaktionen (Dermatitis, Ekzem, Urtikaria, Ausschlag)",        icd:"L29.8", haeuf:"gelegentlich"},
      {id:"myalg",      label:"Muskel- und Knochenschmerzen",                                    icd:"M79.3", haeuf:"gelegentlich"},
      {id:"hypophosph", label:"Hypofosfatämie",                                                  icd:"E83.30",haeuf:"gelegentlich"},
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     PARATHORMON-ANALOGA (ANABOL)
     ═══════════════════════════════════════════════════════════════════ */
  {
    id:"teriparatid",gruppe:"Parathormon-Analoga (anabol)",
    indikation:["manifeste Osteoporose"],
    wirkstoff:"Teriparatid (PTH 1-34)",
    handelsnamen:"Forsteo® 20 µg/80 µl Fertigpen · Terrosa® 20 µg Fertigpen · Movymia® 20 µg Fertigpen · Teriparatid Accord® · Teriparatid Gedeon Richter® · Teriparatid Pfizer® · Teriparatid SUN® · Teriparatid Stada® · Teriparatid Alvogen® · Teriparatid Aristo®",
    dosierung:"20 µg subkutan täglich (max. Gesamtdauer 24 Monate im Leben – lebenslange Beschränkung)",
    zulassung:"Schwere postmenopausale Osteoporose (F); Osteoporose beim Mann mit hohem Frakturrisiko (M); Glukokortikoid-induzierte Osteoporose",
    anmerkung:"⚠ Maximale Gesamtdauer 24 Monate (lebenslange Einschränkung). Danach Anschlusspräparat (Antiresorptivum) ZWINGEND. Tierstudie: Osteosarkomrisiko bei Ratten (bisher keine Evidenz beim Menschen).",
    besonderheit:"📊 Vergleiche & Studien:\n\n🔬 Frakture Prevention Trial (Neer et al., NEJM 2001) – Kernstudie:\nTeriparatid 20 µg täglich vs. Placebo: Vertebrale Frakturreduktion 65%, nicht-vertebral 53% nach median 21 Monaten bei schwerer postmenopausaler Osteoporose.\nLiteratur: https://doi.org/10.1056/NEJMoa010856\n\n🔬 vs. Alendronat (STAND-Studie, Kendler et al., Osteoporos Int 2010):\nNach Alendronat-Vorbehandlung: Teriparatid überlegen in BMD-Anstieg (LWS +7,8% vs. +3,4%) und Frakturreduktion.\nLiteratur: https://doi.org/10.1007/s00198-009-1079-7\n\n🔬 vs. Risedronat (VERO-Studie, Kendler et al., Lancet 2018):\nTeriparatid überlegen vs. Risedronat: vertebrale Frakturen -56%, klinische Frakturen -52% bei schwerer postmenopausaler Osteoporose mit Vorfrakturen. Erste Head-to-Head-Studie.\nLiteratur: https://doi.org/10.1016/S0140-6736(17)32137-2\n\n🔬 Wirkgeschwindigkeit:\nBMD-Anstieg signifikant bereits nach 3 Monaten. Antifrakturer Effekt bereits im 1. Jahr nachweisbar.\n\n⚠ Sequenztherapie nach Teriparatid:\nOhne Anschlussbisphosphonat: BTM-Erholung und BMD-Verlust nach Absetzen (Ettinger et al., JBMR 2004).\nLiteratur: https://doi.org/10.1359/jbmr.2004.19.12.2029\n\n🔬 vs. Romosozumab (STRUCTURE-Studie, Langdahl et al., Lancet 2017):\nRomosozumab überlegen vs. Teriparatid in BMD-Anstieg (Hüfte) nach 12 Monaten.\nLiteratur: https://doi.org/10.1016/S0140-6736(17)31613-6",
    nw:[
      {id:"hyperkal",   label:"Hyperkalzämie (transienter Kalziumanstieg nach Injektion)",       icd:"E83.52",haeuf:"gelegentlich"},
      {id:"nausea",     label:"Übelkeit / Erbrechen",                                             icd:"R11",   haeuf:"häufig"},
      {id:"schwindel",  label:"Schwindel / Benommenheit",                                         icd:"R42",   haeuf:"häufig"},
      {id:"kopf",       label:"Kopfschmerzen",                                                    icd:"R51",   haeuf:"häufig"},
      {id:"krampf",     label:"Muskelkrämpfe (Wadenkrämpfe)",                                     icd:"R25.2", haeuf:"häufig"},
      {id:"hypotonie",  label:"Orthostatische Hypotonie (Schwindel beim Aufstehen)",              icd:"I95.1", haeuf:"gelegentlich"},
      {id:"harnsaeure", label:"Erhöhte Harnsäure / Gicht",                                       icd:"M10.9", haeuf:"gelegentlich"},
      {id:"tachy",      label:"Herzrasen (Tachykardie) / Palpitationen",                         icd:"R00.0", haeuf:"gelegentlich"},
      {id:"reaktion",   label:"Lokalreaktion an der Injektionsstelle",                            icd:"T88.7", haeuf:"häufig"},
      {id:"osteosark",  label:"Osteosarkom (theoretisches Risiko auf Basis von Rattenstudien)",   icd:"C41.9", haeuf:"theoretisch; bisher nicht beim Menschen nachgewiesen"},
    ]
  },
  {
    id:"abaloparatid",gruppe:"Parathormon-Analoga (anabol)",
    indikation:["manifeste Osteoporose"],
    wirkstoff:"Abaloparatid (PTHrP-Analogon)",
    handelsnamen:"Eladynos® 80 µg/dose Fertigpen (seit 2023 EU-Zulassung, Einführung in DE schrittweise)",
    dosierung:"80 µg subkutan täglich (max. 18 Monate Gesamtdauer)",
    zulassung:"Schwere postmenopausale Osteoporose (hohes Frakturrisiko, nach Versagen oder Unverträglichkeit anderer Therapien)",
    anmerkung:"Neueres PTHrP-Analogon; ähnlich Teriparatid, etwas geringeres Hyperkalzämierisiko. Maximaldauer 18 Monate.",
    besonderheit:"📊 Vergleiche & Studien:\n\n🔬 ACTIVE-Studie (Miller et al., JAMA 2016) – Kernstudie:\nAbaloparatid 80 µg täglich vs. Placebo: Vertebrale Frakturreduktion 86%, nicht-vertebrale 43% nach 18 Monaten. Aktiver Vergleichsarm mit Teriparatid: Abaloparatid numerisch besser (nicht signifikant).\nLiteratur: https://doi.org/10.1001/jama.2016.7589\n\n🔬 vs. Teriparatid (Hyperkalzämie):\nAbaloparatid zeigt signifikant weniger Hyperkalzämie-Episoden als Teriparatid (3,4% vs. 6,4% in ACTIVE, p < 0,05).\nLiteratur: https://doi.org/10.1001/jama.2016.7589\n\n🔬 ACTIVExtend (Bone et al., JAMA Internal Medicine 2018):\nNach 18 Monaten Abaloparatid → 24 Monate Alendronat: persistierende Frakturreduktion, BMD-Anstieg hält an. Sequenztherapie gut etabliert.\nLiteratur: https://doi.org/10.1001/jamainternmed.2017.7264\n\n⚠ Einschränkung:\nKein direkter Head-to-Head-Vergleich mit Denosumab oder Zoledronsäure verfügbar. Stellenwert ähnlich Teriparatid, etwas geringeres Hyperkalzämierisiko.",
    nw:[
      {id:"hyperkal",  label:"Hyperkalzämie",                                                     icd:"E83.52",haeuf:"gelegentlich"},
      {id:"nausea",    label:"Übelkeit",                                                           icd:"R11",   haeuf:"häufig"},
      {id:"schwindel", label:"Schwindel",                                                          icd:"R42",   haeuf:"häufig"},
      {id:"hypotonie", label:"Orthostatische Hypotonie",                                          icd:"I95.1", haeuf:"gelegentlich"},
      {id:"herzrate",  label:"Palpitationen / Tachykardie",                                       icd:"R00.2", haeuf:"gelegentlich"},
      {id:"reaktion",  label:"Lokalreaktion an der Injektionsstelle (Rötung, Schmerz)",           icd:"T88.7", haeuf:"sehr häufig"},
      {id:"hypurik",   label:"Erhöhte Harnsäure",                                                 icd:"E79.0", haeuf:"gelegentlich"},
    ]
  },
  {
    id:"pth84",gruppe:"Parathormon-Analoga (anabol)",
    indikation:[],
    wirkstoff:"Parathormon 1-84 (intaktes PTH)",
    handelsnamen:"Preotact® 100 µg Fertigpen – in DE seit 2012 nicht mehr vermarktet (Marktrücknahme aus kommerziellen Gründen)",
    dosierung:"100 µg subkutan täglich (max. 24 Monate)",
    zulassung:"Ehemals: Postmenopausale Osteoporose mit hohem Frakturrisiko (2006–2012 in DE)",
    anmerkung:"Freiwillige Marktrücknahme aus wirtschaftlichen Gründen (nicht wegen Sicherheitsproblemen). Nur für ältere Therapieanamnesen relevant.",
    nw:[
      {id:"hyperkal",  label:"Hyperkalzämie (häufiger als bei Teriparatid)",                      icd:"E83.52",haeuf:"sehr häufig"},
      {id:"nausea",    label:"Übelkeit",                                                           icd:"R11",   haeuf:"häufig"},
      {id:"schwindel", label:"Schwindel",                                                          icd:"R42",   haeuf:"häufig"},
      {id:"reaktion",  label:"Lokalreaktion an der Injektionsstelle",                             icd:"T88.7", haeuf:"häufig"},
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     SKLEROSTIN-ANTIKÖRPER (DUAL WIRKSAM: anabol + antiresorptiv)
     ═══════════════════════════════════════════════════════════════════ */
  {
    id:"romosozumab",gruppe:"Sklerostin-Antikörper (anabol + antiresorptiv)",
    indikation:["manifeste Osteoporose"],
    wirkstoff:"Romosozumab",
    handelsnamen:"Evenity® 105 mg/1,17 ml Fertigspritze (2 Spritzen à 105 mg = 210 mg pro Monat)",
    dosierung:"210 mg subkutan 1× pro Monat (2 getrennte Injektionen à 105 mg) – maximal 12 Monate Gesamttherapie, danach Antiresorptivum",
    zulassung:"Schwere postmenopausale Osteoporose (hohes Frakturrisiko). EU-Zulassung seit 2020.",
    anmerkung:"⚠ KONTRAINDIKATION: Vorhergehender Herzinfarkt oder Schlaganfall (< 12 Monate). EMA-Auflage wegen kardiovaskulärem Risiko. Keine Zulassung beim Mann in DE.",
    besonderheit:"📊 Vergleiche & Studien:\n\n🔬 FRAME-Studie (Cosman et al., NEJM 2016) – Kernstudie:\nRomosozumab 210 mg s.c. monatlich × 12 → Denosumab vs. Placebo → Denosumab: Vertebrale Frakturreduktion nach 12 Monaten 73% vs. Placebo. Nicht-vertebrale Frakturen: Signifikante Reduktion nach Sequenz.\nLiteratur: https://doi.org/10.1056/NEJMoa1607948\n\n🔬 ARCH-Studie (Saag et al., NEJM 2017) – vs. Alendronat:\nRomosozumab 12 Monate → Alendronat vs. Alendronat allein: vertebrale Frakturen -48%, Hüft -38%, klinische Frakturen -27%. Stärkste Frakturreduktionsdaten im Head-to-Head-Vergleich. ABER: leicht erhöhte kardiovaskuläre Ereignisse (1,8% vs. 1,2%).\nLiteratur: https://doi.org/10.1056/NEJMoa1708322\n\n🔬 STRUCTURE-Studie (Langdahl et al., Lancet 2017) – vs. Teriparatid:\nRomosozumab überlegen bezüglich Hüft-BMD-Anstieg nach 12 Monaten (+2,6% vs. -0,4%, p<0,0001). An LWS vergleichbar.\nLiteratur: https://doi.org/10.1016/S0140-6736(17)31613-6\n\n🔬 Dualer Wirkmechanismus (anabol + antiresorptiv):\nEinziges Medikament mit gleichzeitiger Osteoblastenaktivierung und Osteoklastenhemmung → schneller und ausgeprägter BMD-Anstieg als rein anabole oder rein antiresorptive Substanzen.\n\n⚠ Kardiovaskuläres Risiko:\nFDA Black Box Warning (2019): erhöhtes Herzinfarkt-/Schlaganfallrisiko. EMA: Kontraindikation bei stattgehabtem MI/Schlaganfall < 12 Monate.\nLiteratur: https://doi.org/10.1056/NEJMoa1708322",
    nw:[
      {id:"kv",      label:"Herzinfarkt / Schlaganfall (erhöhtes Risiko – KI bei Vorgeschichte!)",icd:"I25.9",haeuf:"selten (vs. Alendronsäure: leicht erhöht)"},
      {id:"onj",     label:"Kieferosteonekrose (ONJ)",                                             icd:"M87.18",haeuf:"selten"},
      {id:"aff",     label:"Atypische Femurfraktur",                                               icd:"M84.55",haeuf:"sehr selten"},
      {id:"reaktion",label:"Lokalreaktion an der Injektionsstelle",                               icd:"T88.7", haeuf:"sehr häufig"},
      {id:"arthr",   label:"Gelenkschmerzen (Arthralgie)",                                         icd:"M25.5", haeuf:"häufig"},
      {id:"kopf",    label:"Kopfschmerzen",                                                        icd:"R51",   haeuf:"gelegentlich"},
      {id:"hypokal", label:"Hypokalzämie",                                                        icd:"E83.51",haeuf:"gelegentlich"},
      {id:"uebers",  label:"Überempfindlichkeitsreaktionen (Angioödem, Urtikaria)",                icd:"T78.4", haeuf:"selten"},
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     SERM – SELEKTIVE ÖSTROGEN-REZEPTOR-MODULATOREN
     ═══════════════════════════════════════════════════════════════════ */
  {
    id:"raloxifen",gruppe:"SERM (Selektive Östrogen-Rezeptor-Modulatoren)",
    indikation:["Osteoporose"],
    wirkstoff:"Raloxifen",
    handelsnamen:"Evista® 60 mg Filmtablette · Optruma® 60 mg Filmtablette · Raloxifen AL 60 mg® · Raloxifen Aristo® 60 mg · Raloxifen Aurobindo® 60 mg · Raloxifen Heumann 60 mg® · Raloxifen HEXAL® 60 mg · Raloxifen-ratiopharm® 60 mg · Raloxifen Sandoz® 60 mg · Raloxifen Stada® 60 mg",
    dosierung:"60 mg täglich oral (mit oder ohne Mahlzeit, kein nüchternes Einnehmen erforderlich)",
    zulassung:"Postmenopausale Osteoporose – besonders geeignet bei gleichzeitig erhöhtem Mammakarzinom-Risiko (senkt invasives ER+-Brustkrebsrisiko)",
    anmerkung:"Nur für Frauen. Keine HRT-Wirkung (verbessert KEINE Hitzewallungen, kann diese sogar verschlechtern). Thromboseprophylaxe erforderlich bei Immobilisation.",
    besonderheit:"📊 Vergleiche & Studien:\n\n🔬 MORE-Studie (Ettinger et al., JAMA 1999) – Kernstudie:\nRaloxifen 60 mg vs. Placebo: Vertebrale Frakturreduktion 30% (ohne Vorfraktur) bzw. 55% (mit Vorfraktur). KEIN Nachweis für nicht-vertebrale oder Hüftfrakturreduktion.\nLiteratur: https://doi.org/10.1001/jama.282.7.637\n\n⚠ vs. Bisphosphonate (Stellenwert):\nDVO-Leitlinie 2023: Raloxifen hat schmaleres Indikationsspektrum als Bisphosphonate oder Denosumab – fehlende Hüftfrakturreduktion. Nische: postmenopausale Frauen mit erhöhtem Mammakarzinom-Risiko und niedriger Hüftfraktur-Inzidenz.\n\n🔬 Mammakarzinom-Risiko (STAR-Studie, Vogel et al., JAMA 2006):\nRaloxifen reduziert invasives ER+-Mammakarzinomrisiko vergleichbar zu Tamoxifen, mit weniger Endometrium-Karzinom und weniger TVT.\nLiteratur: https://doi.org/10.1001/jama.295.23.2727\n\n⚠ TVT-Risiko:\nDreifach erhöhtes Thromboserisiko vs. Placebo – bei Immobilisation oder TVT-Anamnese kontraindiziert.",
    nw:[
      {id:"tvt",      label:"Tiefe Venenthrombose (TVT) – erhöhtes Risiko",                      icd:"I82.4", haeuf:"gelegentlich (3-fach erhöhtes Risiko vs. Placebo)"},
      {id:"le",       label:"Lungenembolie",                                                       icd:"I26",   haeuf:"selten"},
      {id:"hitzew",   label:"Hitzewallungen / Schweißausbrüche (Verstärkung möglich!)",           icd:"N95.1", haeuf:"sehr häufig"},
      {id:"beinoede", label:"Beinödeme / Beinschwellung",                                         icd:"R60.0", haeuf:"häufig"},
      {id:"wadenkr",  label:"Wadenkrämpfe",                                                        icd:"R25.2", haeuf:"häufig"},
      {id:"schwindel",label:"Schwindel",                                                           icd:"R42",   haeuf:"gelegentlich"},
      {id:"grippe",   label:"Grippeartige Symptome",                                               icd:"J06.9", haeuf:"gelegentlich"},
    ]
  },
  {
    id:"bazedoxifen",gruppe:"SERM (Selektive Östrogen-Rezeptor-Modulatoren)",
    indikation:["Osteoporose"],
    wirkstoff:"Bazedoxifen",
    handelsnamen:"Conbriza® 20 mg Filmtablette · Duavive® 20 mg / 0,625 mg (Bazedoxifen + konjugierte Östrogene – für Wechseljahresbeschwerden + Osteoporoseschutz)",
    dosierung:"20 mg täglich oral",
    zulassung:"Postmenopausale Osteoporose (bei Unverträglichkeit anderer Präparate). Duavive® für Wechseljahresbeschwerden bei Frauen mit Uterus (kein Gestagen nötig dank Bazedoxifen).",
    anmerkung:"Selten eigenständig eingesetzt. Duavive® kombiniert Östrogen (gegen Hitzewallungen) + Bazedoxifen (Endometriumschutz statt Gestagen).",
    nw:[
      {id:"tvt",    label:"Tiefe Venenthrombose (TVT)",                                           icd:"I82.4", haeuf:"selten"},
      {id:"hitzew", label:"Hitzewallungen / Schweißausbrüche",                                    icd:"N95.1", haeuf:"häufig"},
      {id:"muskeln",label:"Muskelkrämpfe / Wadenkrämpfe",                                         icd:"R25.2", haeuf:"gelegentlich"},
      {id:"abdomen",label:"Bauchschmerzen / Übelkeit",                                            icd:"R10.1", haeuf:"gelegentlich"},
      {id:"kopf",   label:"Kopfschmerzen",                                                        icd:"R51",   haeuf:"gelegentlich"},
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     KALZIUM & VITAMIN D (BASISTHERAPIE / KOMBINATION)
     ═══════════════════════════════════════════════════════════════════ */
  {
    id:"kalzium_vitd",gruppe:"Basistherapie (Kalzium + Vitamin D)",
    indikation:["Osteoporose","manifeste Osteoporose"],
    wirkstoff:"Kalzium + Vitamin D3 (Kombinationspräparate)",
    handelsnamen:"Calcimagon-D3® · Calcivit D Forte® · Calcivit D3® · Calcicare D3® · Calcium D3 AL® · Calcium D3-ratiopharm® · Calcium D3 Stada® · Calcium-D3 HEXAL® · Calcium Sandoz D Osteo® · Calos D3® · Caltrate® · Ideos® · Kalzium D3-Sandoz® · Macrokal D3® · Ossoforte D3® · Osteocare® · Osteoplus D3® · Os-Cal® · Vigantoletten® (nur Vit.D) · Dekristol® (nur Vit.D, hochdosiert)",
    dosierung:"1000–1200 mg Kalzium/Tag + 800–2000 IE Vitamin D3/Tag (individuelle Anpassung nach Spiegel)",
    zulassung:"Prävention und Therapie von Kalzium- und Vitamin-D-Mangel; adjuvante Therapie bei Osteoporose (Begleitmedikation zu Antiresorptiva/Anabolika)",
    anmerkung:"Begleittherapie zu allen Osteoporosepräparaten. Vor IV-Bisphosphonaten und Denosumab: Kalziumspiegel normalisieren. Bei Nierensteinen: Tagesdosis verteilen, Urinkalzium überwachen.",
    nw:[
      {id:"nierenstein",label:"Nierensteine (Nephrolithiasis) bei übermäßiger Dosierung",         icd:"N20.0", haeuf:"selten bei normaler Dosierung"},
      {id:"hyperkal",   label:"Hyperkalzämie (bei Überdosierung)",                                 icd:"E83.52",haeuf:"selten bei normaler Dosierung"},
      {id:"bauch",      label:"Verstopfung / Blähungen / Übelkeit",                               icd:"K59.0", haeuf:"gelegentlich"},
      {id:"interakt",   label:"Wechselwirkungen (Tetracycline, Fluoride, L-Thyroxin – Abstand einhalten!)", icd:"T50.9",haeuf:"häufig"},
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     HORMONTHERAPIE / ÖSTROGEN (HRT bei postmenopausaler Osteoporose)
     ═══════════════════════════════════════════════════════════════════ */
  {
    id:"hrt",gruppe:"Hormontherapie (HRT / Östrogen)",
    indikation:["Osteoporose"],
    wirkstoff:"Östrogen-Gestagen-Kombinationen / Östrogene (HRT)",
    handelsnamen:"Klimonorm® · Kliogest® · Trisequens® · Femoston® · Femoston conti® · Angeliq® · Activelle® · Climen® · Cycloprogynova® · Fem7® (Pflaster) · Estradot® (Pflaster) · Climara® (Pflaster) · Evorel® (Pflaster) · Dermestril® (Pflaster) · Estreva® (Gel) · Gynokadin® (Gel) · Sandrena® (Gel) · Vagifem® (lokal) · Tibolon: Liviella® · Xyvion®",
    dosierung:"Individuell; niedrigste wirksame Dosis. Systemisch (oral, transdermal) bei ausgeprägten Wechseljahresbeschwerden + Osteoporose.",
    zulassung:"Postmenopausale Osteoporose: nur noch Zweitlinie bei Frauen < 60 J. mit Wechseljahresbeschwerden, die keine anderen Osteoporosemittel vertragen. Primäre Indikation: Wechseljahresbeschwerden.",
    anmerkung:"DVO 2023: HRT nur noch eingeschränkt für Osteoporose (kein First-Line-Mittel). Nutzen-Risiko-Abwägung erforderlich (Brustkrebsrisiko, TVT). Bei chirurgischer Menopause < 45 J. weiterhin empfohlen.",
    nw:[
      {id:"brustkrebs",label:"Erhöhtes Brustkrebsrisiko (v.a. bei kombinierter Östrogen-Gestagen-HRT > 5 J.)", icd:"C50", haeuf:"gelegentlich (erhöhtes Risiko)"},
      {id:"tvt",       label:"Tiefe Venenthrombose / Lungenembolie (oral > transdermal)",         icd:"I82.4",haeuf:"gelegentlich"},
      {id:"schlaganfall",label:"Schlaganfall",                                                     icd:"I64",  haeuf:"selten"},
      {id:"hitzew",    label:"Mastodynie (Brustspannen)",                                          icd:"N64.4",haeuf:"sehr häufig"},
      {id:"blutung",   label:"Unregelmäßige Blutungen (Durchbruchblutungen)",                     icd:"N93.9",haeuf:"häufig"},
      {id:"oedem",     label:"Wassereinlagerungen / Ödeme",                                        icd:"R60",  haeuf:"häufig"},
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     HISTORISCH / NICHT MEHR IN DEUTSCHLAND IM EINSATZ
     ═══════════════════════════════════════════════════════════════════ */
  {
    id:"strontium",gruppe:"Historisch (nicht mehr erhältlich in DE)",
    indikation:[],
    wirkstoff:"Strontiumranelat",
    handelsnamen:"Protelos® 2 g Granulat · Osseor® 2 g Granulat (beide seit Oktober 2017 in DE vom Markt genommen)",
    dosierung:"2 g täglich oral (abends, mind. 2 h nach Mahlzeit, in Wasser aufgelöst)",
    zulassung:"Ehemals (bis 2017): Postmenopausale Osteoporose; Osteoporose beim Mann. EU-Marktrücknahme 2017 wegen kardiovaskulärem Risiko.",
    anmerkung:"Seit Oktober 2017 kein Marktvertrieb mehr in Deutschland (EU). Nur noch für Therapieanamnesen älterer Patienten relevant (Einnahme bis ca. 2017 möglich).",
    nw:[
      {id:"herzinfarkt",label:"Herzinfarkt / koronare Ereignisse (Hauptgrund für Marktrücknahme)", icd:"I21",  haeuf:"selten (aber signifikant erhöhtes Risiko vs. Placebo)"},
      {id:"tvt",        label:"Tiefe Venenthrombose / Lungenembolie",                              icd:"I82.4",haeuf:"selten"},
      {id:"dress",      label:"DRESS-Syndrom (Drug Rash with Eosinophilia – potenziell lebensbedrohlich)", icd:"L27.1",haeuf:"sehr selten"},
      {id:"nausea",     label:"Übelkeit / Diarrhoe (initial sehr häufig)",                        icd:"R11",  haeuf:"sehr häufig"},
      {id:"kopf",       label:"Kopfschmerzen / Schwindel",                                        icd:"R51",  haeuf:"häufig"},
      {id:"memory",     label:"Gedächtnisstörungen / kognitive Beeinträchtigung",                 icd:"F06.7",haeuf:"selten"},
      {id:"panse",      label:"Pankreatitis",                                                      icd:"K85.9",haeuf:"sehr selten"},
    ]
  },
  {
    id:"kalzitonin",gruppe:"Historisch (Zulassung für Osteoporose entzogen)",
    indikation:[],
    wirkstoff:"Lachskalzitonin (synthetisch)",
    handelsnamen:"Miacalcic® 200 IE Nasenspray · Miacalcic® 50 / 100 IE Injektionslösung · Karil® Nasenspray – Zulassung für Osteoporose in EU seit 2013 widerrufen",
    dosierung:"200 IE/Tag intranasal (historisch); 100 IE subkutan/i.m. bei akuten Schmerzen (Wirbelkörperfraktur)",
    zulassung:"Zulassung für Osteoporose in EU am 20. Juni 2013 von der EMA widerrufen (Nutzenschaden-Verhältnis ungünstig, Langzeit-Krebsrisiko). Noch zugelassen: Morbus Paget, tumorbedingte Hyperkalzämie (parenteral).",
    anmerkung:"War früher Standard bei akuten Wirbelfrakturen (Schmerztherapie). Heute vollständig abgelöst. Nur für ältere Anamnesen (vor 2013 behandelte Patienten) relevant.",
    nw:[
      {id:"krebsrisiko",label:"Erhöhtes Krebsrisiko (Hauptgrund für Zulassungsentzug bei Osteoporose)",icd:"C80.1",haeuf:"erhöhtes Langzeitrisiko"},
      {id:"rhinitis",   label:"Rhinitis / Nasenreizung / Nasenbluten (intranasal)",                icd:"J31.0",haeuf:"sehr häufig"},
      {id:"flush",      label:"Hitzegefühl / Flush (besonders nach Injektion)",                   icd:"R23.2",haeuf:"häufig"},
      {id:"nausea",     label:"Übelkeit / Bauchschmerzen / Erbrechen",                            icd:"R11",  haeuf:"häufig"},
      {id:"reaktion",   label:"Lokalreaktion an der Injektionsstelle",                            icd:"T88.7",haeuf:"häufig"},
    ]
  },
  {
    id:"ipriflavon",gruppe:"Historisch (kein Standard, Zulassung DE erloschen)",
    indikation:[],
    wirkstoff:"Ipriflavon (Isoflavon-Derivat)",
    handelsnamen:"Ossiplex® Retard – Zulassung in Deutschland erloschen",
    dosierung:"600 mg/Tag oral (200 mg 3×/Tag)",
    zulassung:"Ehemals: Postmenopausale Osteoporose (schwache Evidenz; DE-Zulassung erloschen). In einigen osteuropäischen Ländern noch erhältlich.",
    anmerkung:"Nur für sehr alte Therapieanamnesen (vor 2005) relevant. Wirksamkeit nie überzeugend belegt.",
    nw:[
      {id:"bauch",     label:"Übelkeit / Bauchschmerzen / Diarrhoe",                              icd:"R10.1",haeuf:"gelegentlich"},
      {id:"lymphopenie",label:"Lymphopenie (Rückgang weißer Blutkörperchen)",                     icd:"D72.8",haeuf:"selten"},
    ]
  },
  {
    id:"fluorid",gruppe:"Historisch (kein Standard mehr)",
    indikation:[],
    wirkstoff:"Natriumfluorid / Monofluorphosphat",
    handelsnamen:"Tridin® · Ossopan® · Fluoretten® · Natriumfluorid Leiras® – alle nicht mehr für Osteoporose vermarktet",
    dosierung:"20–40 mg Fluorid/Tag oral (historisch)",
    zulassung:"Ehemals in DE für Osteoporose verwendet; heute kein anerkannter Standard (NVL / DVO: nicht empfohlen).",
    anmerkung:"Fluoride erhöhen Knochendichte (DXA), aber erhöhen NICHT die Knochenqualität und reduzieren Frakturrisiko NICHT. Seit den 1990ern verlassen. Nur für sehr alte Anamnesen relevant.",
    nw:[
      {id:"oeso",     label:"Ösophagitis / Magenreizung",                                         icd:"K20",  haeuf:"häufig"},
      {id:"schmerz",  label:"Knochenschmerzen (periostale Reaktion)",                             icd:"M89.9",haeuf:"gelegentlich"},
      {id:"stress_fx",label:"Stressfrakturen (Mikrofrakturen durch minderwertige Knochenqualität)",icd:"M84.3",haeuf:"bei Langzeitgabe"},
    ]
  },
];
function buildOsteoTherapieDefaults(){ return JSON.parse(JSON.stringify(OSTEO_THERAPIE_DEFAULTS)); }

const ABSETZ_GRUENDE=[
  {id:"nw",      label:"Nebenwirkung / Unverträglichkeit"},
  {id:"ziel",    label:"Therapieziel erreicht / planmäßiges Ende"},
  {id:"arzt",    label:"Ärztliche Entscheidung (Sonstiges)"},
  {id:"patient", label:"Patientenwunsch"},
  {id:"kosten",  label:"Kostenübernahme / Zuzahlung"},
  {id:"non_adn", label:"Schwierige Einnahme / Adhärenz-Problem"},
  {id:"sonstige",label:"Sonstiger Grund"},
];

/* ── ViewerIframe: uses blob URL, with Android fallback ── */
function ViewerIframe({content,onDownload}){
  const isAndroid=/Android/i.test(navigator.userAgent);
  const isIOSv=/iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isMobileOS=isAndroid||isIOSv;
  const[src,setSrc]=React.useState("");
  React.useEffect(()=>{
    const blob=new Blob([content],{type:"text/html;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    setSrc(url);
    return()=>URL.revokeObjectURL(url);
  },[content]);
  if(isMobileOS){
    // Android: iframe unreliable – show download prompt instead
    return(
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",padding:28,gap:18,background:"#f5f0e8"}}>
        <div style={{fontSize:48}}>📄</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,
          color:"#2c1f0e",textAlign:"center"}}>
          Vorschau auf Android nicht verfügbar
        </div>
        <div style={{fontSize:13,color:"#7a6a58",textAlign:"center",lineHeight:1.6,maxWidth:300}}>
          Bitte laden Sie die HTML-Datei herunter und öffnen Sie sie im Browser —
          dort können Sie sie drucken oder als PDF teilen.
        </div>
        <a href={src} download="Osteoporose-Fragebogen.html"
          style={{padding:"13px 28px",background:"#2c7a2c",color:"white",borderRadius:8,
            fontSize:14,fontWeight:700,textDecoration:"none",
            display:"flex",alignItems:"center",gap:9,
            boxShadow:"0 3px 12px rgba(44,122,44,.3)"}}>
          ⬇️ HTML-Datei herunterladen
        </a>
        <div style={{fontSize:11.5,color:"#9a8878",textAlign:"center",maxWidth:300}}>
          Tipp: Nach dem Öffnen im Browser → Menü → Drucken / Als PDF speichern
        </div>
      </div>
    );
  }
  if(!src)return <div style={{padding:20,color:"#888"}}>Lade Vorschau…</div>;
  return <iframe id="viewer-iframe" className="viewer-iframe" src={src} title="Druckansicht"/>;
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
  const[sekScoringDb,setSekScoringDb]=useState(()=>buildSekScoringDefaults());
  const[osteoTherapieDb,setOsteoTherapieDb]=useState(()=>buildOsteoTherapieDefaults());
  const[therapieHistory,setTherapieHistory]=useState([]); // [{medId,vonJahr,bisJahr,nochAktuell,dosierung,abgesetzt,absetzGrund,absetzNwIds,anmerkung}]
  const[openTherap,setOpenTherap]=useState(true);
  const[freitextTherapieMeds,setFreitextTherapieMeds]=useState([]);
  const[adminOpen,setAdminOpen]=useState(false);
  const[adminPin,setAdminPin]=useState("");
  const[adminUnlocked,setAdminUnlocked]=useState(false);
  const[arztStartTab,setArztStartTab]=useState("auswertung"); // "auswertung" | "risiko" | "sek" | "therapie" 
  const ADMIN_PIN="1234";
  const[viewer,setViewer]=useState(null); // {type:"txt"|"pdf", content:string}
  const[camOpen,setCamOpen]=useState(false);
  const[therapieCam,setTherapieCam]=useState(false);
  const isAndroid=/Android/i.test(navigator.userAgent);
  const isIOS=/iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isMobile=isAndroid||isIOS;
  const hasPicker=!isMobile&&typeof window.showSaveFilePicker==="function";
  const[gender,setGender]=useState(null);
  const[anamnese,setAnamnese]=useState({diagnosen:[],weitere:[],allergien:[],familienanamnese:[],fractures:[],ops:[],menarche:"",menoPause:"",menoYear:"",menoGrund:"",menoSonstige:"",kinder:[]});
  const[painMaps,setPainMaps]=useState({});
  const[openAnam,setOpenAnam]=useState(true);
  const[openPain,setOpenPain]=useState(true);
  const[sekStatus,setSekStatus]=useState({}); // {[sym]: {bekannt:'ja'|'nein'|'', seitWann:'', behandlung:''}}
  const[answers,setAnswers]=useState({});
  const[patient,setPatient]=useState({nachname:"",vorname:"",geburtsdatum:"",email:"",fillDate:today});
  const[patientId,setPatientId]=useState(null); // IDB patienten.id
  const[patientPw,setPatientPw]=useState("");    // aktuell gesetztes Passwort (Klartext, nur im RAM)
  const[patientModal,setPatientModal]=useState(null); // null | "resume" | "login" | "new"
  const[patients,setPatients]=useState([]); // alle Patienten für Arzt-Liste
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
        if(draft.patientId)setPatientId(draft.patientId);
      }
      const savedDb=await loadDiagDbAsync();setDiagDb(savedDb);
      setSekDiagDb(loadSekDiagDb());
      setSekProfileDb(loadSekDb(SEK_PROFILE_KEY, buildSekProfileDefaults));
      setSekUntersDb(loadSekDb(SEK_UNTERS_KEY, buildSekUntersDefaults));
      setSekQsDb(loadSekDb(SEK_QS_KEY, buildSekQsDefaults));
      const sess=await idbLoadAll();
      setSessions(sess.sort((a,b)=>b.id.localeCompare(a.id)));
      const pats=await idbLoadAllPatients();
      setPatients(pats);
      // Cookie-Resume: letzten Patienten anbieten
      const cookiePat=cookieGet("osteo_pat");
      if(cookiePat){
        const patObj=pats.find(p=>p.id===cookiePat);
        if(patObj)setPatientModal({type:"resume",pat:patObj});
      }
    })();
  },[]);

  // Auto-save draft
  const triggerSave=useCallback(()=>{
    setSaveStatus("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(async()=>{
      await storageSet(STORE_DRAFT,{gender,answers,patient,patientId});
      setSaveStatus("ok");
    },1500);
  },[gender,answers,patient]);

  useEffect(()=>{if(gender){setSaveStatus("unsaved");triggerSave();}},[gender,answers,patient,triggerSave]);

  const setA=(id,val)=>setAnswers(p=>({...p,[id]:val}));
  const setP=(k,v)=>setPatient(p=>({...p,[k]:v}));
  const toggleSec=(id)=>setOpenSec(p=>({...p,[id]:!p[id]}));

  const visibleSecs=gender?SECTIONS.filter(s=>(!s.onlyFor||s.onlyFor===gender)&&!s.symcheck):[];
  const totalQ=visibleSecs.flatMap(s=>s.qs).length;
  const answeredQ=Object.values(answers).filter(v=>v!==null&&v!==undefined&&v!=="").length;
  const prog=totalQ>0?Math.round((answeredQ/totalQ)*100):0;
  const bmi=calcBMI(parseFloat(answers.groesse),parseFloat(answers.gewicht));

  // Find previous session for same patient (for diff)
  const patNach=(patient.nachname||patient.name||"").toLowerCase();
  const prevSession=sessions.filter(s=>{
    if(!patNach)return false;
    const sNach=(s.patient?.nachname||s.patient?.name||"").toLowerCase();
    if(sNach!==patNach)return false;
    if(patient.geburtsdatum&&s.patient?.geburtsdatum!==patient.geburtsdatum)return false;
    return true;
  }).slice(-1)[0]||null;
  const diff=prevSession?computeDiff(answers,prevSession,gender):null;
  const risk=gender?computeRisk(answers,gender):null;

  // Save session to history
  // Validation helper – returns null if OK, error string if not
  const validatePatientNames=()=>{
    const en=validateName(patient.nachname||"");
    const ev=validateName(patient.vorname||"");
    if(en) return `Nachname: ${en}`;
    if(ev) return `Vorname: ${ev}`;
    return null;
  };

  const saveSession=async()=>{
    if(!gender)return;
    const nameErr=validatePatientNames();
    if(nameErr){alert("⚠ Bitte Personalien prüfen:\n\n"+nameErr);return null;}
    // Geburtsdatum prüfen
    const gebAge=calcAgeFromBirthdate(patient.geburtsdatum||"");
    const gebDigits=(patient.geburtsdatum||"").replace(/\D/g,"").length;
    if(gebDigits>=8&&(gebAge===null||gebAge<18||gebAge>130)){
      const msg=gebAge===null?"Ungültiges Datum.": gebAge<18?`Alter ${gebAge} J. – Mindestalter 18 Jahre.`:`Alter ${gebAge} J. – Maximalter 130 Jahre.`;
      alert("⚠ Geburtsdatum ungültig:\n\n"+msg);return null;
    }
    // Ensure patient has a DB record
    let pid=patientId;
    const fullName=(patient.nachname||patient.name||"")+" "+(patient.vorname||"");
    if(!pid){
      pid=Date.now().toString()+"_p";
      const newPat={
        id:pid,
        nachname:patient.nachname||patient.name||"",
        vorname:patient.vorname||"",
        geburtsdatum:patient.geburtsdatum||"",
        email:patient.email||"",
        passwortHash:patientPw?hashPw(patientPw):"",
        erstelltAm:new Date().toISOString(),
        letzterZugriff:new Date().toISOString()
      };
      await idbSavePatient(newPat);
      setPatientId(pid);
      cookieSet("osteo_pat",pid);
    } else {
      // Update last access + sync fields
      const existing=await idbGetPatient(pid)||{};
      await idbSavePatient({...existing,
        nachname:patient.nachname||patient.name||existing.nachname||"",
        vorname:patient.vorname||existing.vorname||"",
        geburtsdatum:patient.geburtsdatum||existing.geburtsdatum||"",
        email:patient.email||existing.email||"",
        passwortHash:patientPw?hashPw(patientPw):(existing.passwortHash||""),
        letzterZugriff:new Date().toISOString()
      });
      cookieSet("osteo_pat",pid);
    }
    const snap=risk||computeRisk(answers,gender);
    const session={
      id:Date.now().toString(),
      fillDate:today,
      patient:{...patient},
      patientId:pid,
      gender,
      answers:{...answers},
      riskSnapshot:{cat:snap.cat,cF:snap.cF,r3:snap.r3,r5:snap.r5,r10:snap.r10}
    };
    await idbSaveBefund(session);
    const updated=await idbLoadAll();
    setSessions(updated.sort((a,b)=>b.id.localeCompare(a.id)));
    const updPats=await idbLoadAllPatients();
    setPatients(updPats);
    return session;
  };

  const handleSaveLh=async(newLh)=>{setLh(newLh);await storageSet(STORE_LH,newLh);};
  const handleCamMeds=(meds)=>{
    // Erkannte Medikamente in die zentrale Medikamenten-Sammelbox eintragen
    const existing=answers["alle_medikamente_rx"]||[];
    const merged=[...new Set([...existing,...meds])];
    setA("alle_medikamente_rx",merged);
    setCamOpen(false);
  };

  /* ── helpers ── */
  const makeFilename=(ext)=>{
    const name=((patient.nachname||patient.name||"Patient")+"_"+(patient.vorname||"")).trim().replace(/[^a-zA-Z0-9_\-äöüÄÖÜß]/g,"_");
    const date=today.replace(/\./g,"-");
    return `Osteoporose_${name}_${date}.${ext}`;
  };

  /* ── TXT: direct save-as with picker ── */
  const handleText=async()=>{
    if(!gender){alert("Bitte zuerst Geschlecht auswählen.");return;}
    await saveSession();
    const r=computeRisk(answers,gender);
    const d=prevSession?computeDiff(answers,prevSession,gender):null;
    const text=buildTextExport(patient,gender,answers,r,d,lh,diagDb,sekDiagDb,anamnese,therapieHistory,osteoTherapieDb,freitextTherapieMeds);
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
    setAnamnese({diagnosen:[],weitere:[],allergien:[],familienanamnese:[],fractures:[],ops:[],menarche:"",menoPause:"",menoYear:"",menoGrund:"",menoSonstige:"",kinder:[]});
    setPainMaps({});
    setSekStatus({});
    setTherapieHistory([]);
    setPatient({nachname:"",vorname:"",geburtsdatum:"",email:"",fillDate:today});setPatientId(null);setPatientPw("");setGender(null);setDisclaimerOk(false);cookieDel("osteo_pat");
    storageSet(STORE_DRAFT,null);
  };

  const handleLoadSession=async(s)=>{
    setGender(s.gender);setAnswers(s.answers);
    setPatient({...s.patient,fillDate:today});
    if(s.patientId)setPatientId(s.patientId);
    setShowHist(false);setShowResult(false);
  };

  const handleDeleteSession=async(id)=>{
    await idbDelete(id);
    setSessions(prev=>prev.filter(s=>s.id!==id));
  };

  const openAllSections=()=>{
    const all={};visibleSecs.forEach(s=>all[s.id]=true);setOpenSec(all);
  };

  /* ── Patienten-PDF: Eingabe ohne Auswertung ── */
  const handleSendToPatient=()=>{
    if(!gender){alert("Bitte zuerst Geschlecht auswählen.");return;}
    // Sofort PDF bauen und anzeigen – kein Speichern, kein Blocking
    let html;
    try{
      html=buildPatientEingabeHtml(patient,gender,answers,anamnese,lh,SECTIONS);
    }catch(e){
      alert("PDF konnte nicht erstellt werden: "+e.message);
      return;
    }
    setViewer({type:"html",content:html});
  };

  return(
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      <div className="app">

        {/* ── Letterhead display (screen + print, editing in Arzt-Zugang) ── */}
        <div className="lh-wrap">
          <div className="lh-display" style={{display:"flex",alignItems:"center",gap:12}}>
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
            <button className="no-print"
              onClick={()=>{setArztStartTab("auswertung");setAdminOpen(true);}}
              style={{marginLeft:"auto",padding:"8px 16px",background:"#2c1f0e",color:"#e8d8b0",
                border:"none",borderRadius:6,fontSize:13,fontWeight:700,cursor:"pointer",
                display:"flex",alignItems:"center",gap:7,whiteSpace:"nowrap",flexShrink:0,
                boxShadow:"0 2px 8px rgba(44,31,14,.3)"}}>
              🩺 Arzt-Zugang
            </button>
          </div>
        </div>

        {/* ── App Header ── */}
        <div className="hdr">
          <h1>Anamnese- und Osteoporose-Dokumentationshilfe und Risikocheck</h1>
          <p className="hdr-sub">Bitte füllen Sie diesen Fragebogen sorgfältig aus. Ihre Angaben helfen der Ärztin / dem Arzt, Ihre Knochengesundheit besser einzuschätzen. Nehmen Sie sich Zeit – es gibt keine richtigen oder falschen Antworten.</p>
          <div className="badge">DVO-Leitlinie 2023 · AWMF 183-001 · Patientenfragebogen</div>
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
            {disclaimerOk?"✅":"📋"} Hinweis vor dem Ausfüllen
          </div>
          <div className="disclaimer-gate-text">
            <div style={{marginBottom:12,padding:"8px 12px",background:"#fff3cd",border:"1px solid #f0c040",borderRadius:5,color:"#7a5010",fontWeight:700,fontSize:13}}>
              ⚠ Die vorliegende Version ist als Demo- und Machbarkeitsstudie und daher noch nicht zur klinischen Anwendung vorgesehen.
            </div>
            <strong style={{display:"block",marginBottom:6}}>Liebe Patientin, lieber Patient</strong>
            Dieser Fragebogen hilft Ihrer Ärztin / Ihrem Arzt, Ihre Knochengesundheit besser einzuschätzen.
            Bitte beantworten Sie alle Fragen so vollständig wie möglich. Es gibt keine richtigen oder falschen Antworten –
            Ihre ehrlichen Angaben sind am wertvollsten.<br/><br/>
            <strong>Die Auswertung des Fragebogens erfolgt ausschließlich durch das Praxisteam. Sie erhalten keine automatischen Diagnosen oder Therapieempfehlungen aus diesem Fragebogen.</strong>
            <div style={{marginTop:12,padding:"8px 10px",background:"#fff8f0",borderRadius:5,borderLeft:"3px solid #d4a060",fontSize:12}}>
              <strong>Datenschutz (DSGVO)</strong><br/>
              Alle eingegebenen Daten verbleiben ausschließlich auf dem Gerät des Nutzers. Es findet <strong>keine Übertragung</strong> von Patientendaten an externe Server, Datenbanken oder Dritte statt. Daten werden im lokalen Browserspeicher (localStorage / IndexedDB) des verwendeten Endgeräts gespeichert und können jederzeit gelöscht werden.<br/><br/>
              Die Verarbeitung personenbezogener Patientendaten im Rahmen der ärztlichen Dokumentation erfolgt auf Grundlage von <strong>Art. 6 Abs. 1 lit. c DSGVO</strong> (rechtliche Verpflichtung) in Verbindung mit <strong>Art. 9 Abs. 2 lit. h DSGVO</strong> (Gesundheitsversorgung) sowie § 22 Abs. 1 Nr. 1 lit. b BDSG. Der für die Verarbeitung Verantwortliche im Sinne von <strong>Art. 4 Nr. 7 DSGVO</strong> ist die das Programm einsetzende medizinische Einrichtung bzw. die behandelnde Ärztin / der behandelnde Arzt.<br/><br/>
              Das Instrument verarbeitet keine Daten auf eigene Veranlassung. Bei dauerhafter klinischer Nutzung mit Patientenbezug ist eine Aufnahme in das Verfahrensverzeichnis gemäß <strong>Art. 30 DSGVO</strong> zu empfehlen.
            </div>
            <div style={{marginTop:10,padding:"8px 10px",background:"#f0f8ff",borderRadius:5,borderLeft:"3px solid #7ab0d4",fontSize:12}}>
              <strong>Externe Ressourcen, die beim Laden des Programms genutzt werden:</strong><br/>
              <span style={{display:"block",marginTop:4}}>
                • <strong>Google Fonts API</strong> (fonts.googleapis.com / fonts.gstatic.com): Schriftarten „Playfair Display" und „Source Sans 3" – Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Datenschutzerklärung: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{color:"#4a7ab0"}}>policies.google.com/privacy</a>. Beim Laden werden IP-Adresse und Browser-Informationen an Google übermittelt.<br/>
                • <strong>jsQR via jsDelivr CDN</strong> (cdn.jsdelivr.net): JavaScript-Bibliothek zur QR-Code-Erkennung im Medikamenten-Scanner (wird nur bei Kameranutzung geladen) – jsDelivr, Prosperous Net Claymoor, 9 Castle Street, Castletown, IM9 1LF, Isle of Man.
              </span>
              Die React-Bibliotheken (react, react-dom) und alle übrigen Programmbestandteile sind direkt in das Dokument eingebettet und erfordern nach dem erstmaligen Laden keine externe Verbindung.
            </div>
          </div>
          <label className="disclaimer-gate-check">
            <input type="checkbox" checked={disclaimerOk} onChange={e=>setDisclaimerOk(e.target.checked)}/>
            <span>Ich habe den Hinweis gelesen und bin damit einverstanden, dass meine Angaben gespeichert und unter anderem zu Test- und Übungszwecken ausgewertet werden.</span>
          </label>
          {!disclaimerOk&&(
            <div className="disclaimer-gate-blocked">
              Bitte bestätigen Sie den Hinweis oben, um den Fragebogen auszufüllen.
            </div>
          )}
        </div>

        {/* ── Patient card ── */}
        <div className="pat-card" style={disclaimerOk?{}:{opacity:.35,pointerEvents:"none",userSelect:"none"}}>
          <div className="pat-card-title">👤 Name der Patientin / des Patienten &amp; Ausfülldatum</div>
          <div className="pat-grid">
            {/* ── Nachname ─────────────────────────── */}
            <div className="pat-field">
              <label>
                Nachname <span style={{color:"#c0392b",fontWeight:700}}>*</span>
                {(()=>{const e=patient.nachname!==undefined&&patient.nachname!==null?validateName(patient.nachname):null;
                  return e?<span style={{marginLeft:6,fontSize:11,color:"#c0392b",fontWeight:400}}>⚠ {e}</span>:
                    (patient.nachname&&patient.nachname.trim().length>=2?
                      <span style={{marginLeft:6,fontSize:11,color:"#2a7a2a"}}>✓</span>:null);
                })()}
              </label>
              <input
                value={patient.nachname||""}
                maxLength={100}
                onChange={e=>setP("nachname",autoCapitalizeName(e.target.value))}
                onKeyDown={e=>{if(/[0-9]/.test(e.key)||(e.key.length===1&&!/[A-Za-zÄÖÜäöüßÀ-žÁáÉéÍíÓóÚúÂâÊêÎîÔôÛûËëÏïÜüÿŒœÆæ'\-\s]/.test(e.key)))e.preventDefault();}}
                placeholder="Mustermann"
                style={{
                  borderColor:(()=>{const v=patient.nachname;if(!v&&v!==undefined)return"var(--CM)";const e=validateName(v);return e?"#c0392b":"#2a7a2a";})()
                }}/>
              <div style={{fontSize:11,color:"#9a8a7a",marginTop:2}}>
                {patient.nachname?`${patient.nachname.trim().length}/100 Zeichen`:"Nur Buchstaben, Bindestrich, Apostroph"}
              </div>
            </div>

            {/* ── Vorname ──────────────────────────── */}
            <div className="pat-field">
              <label>
                Vorname <span style={{color:"#c0392b",fontWeight:700}}>*</span>
                {(()=>{const e=patient.vorname!==undefined&&patient.vorname!==null?validateName(patient.vorname):null;
                  return e?<span style={{marginLeft:6,fontSize:11,color:"#c0392b",fontWeight:400}}>⚠ {e}</span>:
                    (patient.vorname&&patient.vorname.trim().length>=2?
                      <span style={{marginLeft:6,fontSize:11,color:"#2a7a2a"}}>✓</span>:null);
                })()}
              </label>
              <input
                value={patient.vorname||""}
                maxLength={100}
                onChange={e=>setP("vorname",autoCapitalizeName(e.target.value))}
                onKeyDown={e=>{if(/[0-9]/.test(e.key)||(e.key.length===1&&!/[A-Za-zÄÖÜäöüßÀ-žÁáÉéÍíÓóÚúÂâÊêÎîÔôÛûËëÏïÜüÿŒœÆæ'\-\s]/.test(e.key)))e.preventDefault();}}
                placeholder="Maria"
                style={{
                  borderColor:(()=>{const v=patient.vorname;if(!v&&v!==undefined)return"var(--CM)";const e=validateName(v);return e?"#c0392b":"#2a7a2a";})()
                }}/>
              <div style={{fontSize:11,color:"#9a8a7a",marginTop:2}}>
                {patient.vorname?`${patient.vorname.trim().length}/100 Zeichen`:"Nur Buchstaben, Bindestrich, Apostroph"}
              </div>
            </div>
            <div className="pat-field"><label>Geburtsdatum</label>
              <GebDatInput
                value={patient.geburtsdatum}
                onChange={val=>{
                  setP("geburtsdatum",val);
                  const age=calcAgeFromBirthdate(val);
                  if(age!==null)setA("alter",String(age));
                }}/>
            </div>
            <div className="pat-field" style={{gridColumn:"span 2"}}>
              <label>E-Mail-Adresse (für Zusendung des ausgefüllten Fragebogens)</label>
              <input type="email" value={patient.email||""} onChange={e=>setP("email",e.target.value)}
                placeholder="patient@beispiel.de"
                style={{width:"100%",padding:"8px 11px",border:"1.5px solid var(--CM)",borderRadius:5,
                  fontSize:13.5,color:"var(--D)",outline:"none",fontFamily:"'Source Sans 3',sans-serif"}}/>
            </div>
            <div className="pat-field" style={{gridColumn:"span 2"}}>
              <PwDoppelInput
                value={patientPw}
                onChange={setPatientPw}
                patientId={patientId}
                onReset={async()=>{
                  const existing=await idbGetPatient(patientId)||{};
                  await idbSavePatient({...existing,passwortHash:"",
                    letzterZugriff:new Date().toISOString()});
                  setPatientPw("");
                  alert("Passwort wurde zur\u00fcckgesetzt.");
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

        {/* ── Anamnese + Schmerzzeichnung (vor Fragebogen) ── */}
        {disclaimerOk&&gender&&(
          <>
            <AnamneseSection
              gender={gender}
              data={anamnese}
              onChange={setAnamnese}
              open={openAnam}
              onToggle={()=>setOpenAnam(v=>!v)}/>
            <PainBodySection
              painMaps={painMaps}
              setPainMaps={setPainMaps}
              open={openPain}
              onToggle={()=>setOpenPain(v=>!v)}/>
            <OsteoTherapieSection
              history={therapieHistory}
              setHistory={setTherapieHistory}
              db={osteoTherapieDb}
              open={openTherap}
              onToggle={()=>setOpenTherap(v=>!v)}
              onCameraOpen={()=>{setTherapieCam(true);}}
              freitextMeds={freitextTherapieMeds}
              onFreitextMeds={setFreitextTherapieMeds}/>
          </>
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

        {/* ── Bottom Bar ── */}
        {gender&&(
          <div className="bottom-bar no-print">

            {/* ── Patient: Abschluss-Button ── */}
            <button
                onClick={handleSendToPatient}
                style={{width:"100%",padding:"18px 20px",borderRadius:10,border:"2px solid #4a9a4a",
                  background:"linear-gradient(135deg,#f0f9f0,#e4f4e4)",cursor:"pointer",
                  textAlign:"center",transition:"all .2s",boxShadow:"0 2px 10px rgba(74,154,74,.15)",
                  fontFamily:"'Source Sans 3',sans-serif"}}>
                <div style={{fontSize:26,marginBottom:6}}>✅</div>
                <div style={{fontSize:16,fontWeight:700,color:"#1a5a1a",marginBottom:4}}>
                  Fragebogen abschließen – als PDF herunterladen
                </div>
                <div style={{fontSize:12.5,color:"#4a7a4a",lineHeight:1.5}}>
                  PDF der Patienteneingabe erstellen (ohne ärztliche Auswertung)
                </div>
              </button>

          </div>
        )}

        <div className="disclaimer" style={{marginTop:18}}>
          Dieser Fragebogen basiert auf der <strong>DVO-Leitlinie 2023</strong> · AWMF-Register 183-001, Version 2.1 · Auswertung durch das Praxisteam im Arzt-Zugang
        </div>
      </div>

            {adminOpen&&(
        <AdminPanel diagDb={diagDb} sekDiagDb={sekDiagDb}
          sekProfileDb={sekProfileDb} sekUntersDb={sekUntersDb} sekQsDb={sekQsDb} sekScoringDb={sekScoringDb}
          onClose={()=>{setAdminOpen(false);setAdminPin("");setShowResult(false);}}
          onSave={db=>{setDiagDb(db);saveDiagDb(db);}}
          onSaveSek={db=>{setSekDiagDb(db);saveSekDiagDb(db);}}
          onSaveSekProfile={db=>{setSekProfileDb(db);saveSekDb(SEK_PROFILE_KEY,db,buildSekProfileDefaults);}}
          onSaveSekUnters={db=>{setSekUntersDb(db);saveSekDb(SEK_UNTERS_KEY,db,buildSekUntersDefaults);}}
          onSaveSekQs={db=>{setSekQsDb(db);saveSekDb(SEK_QS_KEY,db,buildSekQsDefaults);}}
          onSaveSekScoring={db=>{setSekScoringDb(db);saveSekDb(SEK_SCORING_KEY,db,buildSekScoringDefaults);}}
          osteoTherapieDb={osteoTherapieDb}
          onSaveTherapieDb={db=>{setOsteoTherapieDb(db);}}
          gender={gender} answers={answers} patient={patient} anamnese={anamnese}
          therapieHistory={therapieHistory} lh={lh} onSaveLh={handleSaveLh} sessions={sessions}
          patients={patients}
          onDeletePatient={async(pid)=>{
            await idbDeletePatient(pid);
            const bs=sessions.filter(s=>s.patientId===pid);
            for(const b of bs) await idbDelete(b.id);
            const updPats=await idbLoadAllPatients();
            const updSess=await idbLoadAll();
            setPatients(updPats);
            setSessions(updSess.sort((a,b)=>b.id.localeCompare(a.id)));
          }}
          onResetPatientPw={async(pat)=>{
            const newPw=window.prompt(`Neues Passwort für ${pat.nachname}, ${pat.vorname}:
(Leer lassen = Passwort entfernen)`);
            if(newPw===null)return; // abgebrochen
            const existing=await idbGetPatient(pat.id)||{};
            await idbSavePatient({...existing,passwortHash:newPw?hashPw(newPw):"",letzterZugriff:new Date().toISOString()});
            const updPats=await idbLoadAllPatients();
            setPatients(updPats);
            alert(newPw?"Passwort gesetzt.":"Passwort entfernt.");
          }}
          sekStatus={sekStatus} setSekStatus={setSekStatus}
          onExportPdf={handlePrint} onExportTxt={handleText}
          onLoadSession={handleLoadSession} onDeleteSession={handleDeleteSession}
          initialTab={arztStartTab||"auswertung"}
          diff={diff}/>
      )}
            {/* ── Cookie-Resume Modal ── */}
      {patientModal&&(
        <ResumeModal
          pat={patientModal.pat}
          sessions={sessions}
          today={today}
          onResume={(s,pid,pw)=>{
            setGender(s.gender);setAnswers(s.answers||{});
            setPatient({...s.patient,fillDate:today});
            if(s.anamnese)setAnamnese(s.anamnese);
            if(s.therapieHistory)setTherapieHistory(s.therapieHistory);
            setPatientId(pid);setPatientPw(pw);
            setDisclaimerOk(true);
            cookieSet("osteo_pat",pid);
            setPatientModal(null);
          }}
          onNew={()=>setPatientModal(null)}
          onForget={()=>{cookieDel("osteo_pat");setPatientModal(null);}}/>
      )}

            {camOpen&&(
        <CameraScanner onMedsFound={handleCamMeds} onClose={()=>setCamOpen(false)}/>
      )}
      {therapieCam&&(
        <CameraScanner
          onMedsFound={(meds)=>{
            setFreitextTherapieMeds(prev=>[...new Set([...prev,...meds])]);
            setTherapieCam(false);
          }}
          onClose={()=>setTherapieCam(false)}/>
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
                <span className="viewer-bar-title">
                  {viewer.type==="html"?"📄 Patienteneingabe – Vorschau":"🖨 Befundbericht – Druckansicht"}
                </span>
                {/* Neuer Tab öffnen – dort ist die Print-Bar direkt eingebaut */}
                {/(Android|iPhone|iPad|iPod)/i.test(navigator.userAgent)?(
                  <a className="viewer-btn primary"
                    href={URL.createObjectURL(new Blob([viewer.content],{type:"text/html;charset=utf-8"}))}
                    download="Osteoporose-Fragebogen.html"
                    style={{textDecoration:"none",display:"inline-flex",alignItems:"center",gap:7}}>
                    ⬇️ HTML herunterladen
                  </a>
                ):(
                  <button className="viewer-btn primary" onClick={()=>{
                    const blob=new Blob([viewer.content],{type:"text/html;charset=utf-8"});
                    const url=URL.createObjectURL(blob);
                    const opened=window.open(url,"_blank");
                    if(!opened){
                      const iframe=document.getElementById("viewer-iframe");
                      if(iframe&&iframe.contentWindow)iframe.contentWindow.print();
                      else window.print();
                    }
                    setTimeout(()=>URL.revokeObjectURL(url),120000);
                  }}>🖨 In neuem Tab öffnen / Drucken</button>
                )}
              </>
            )}
            <button className="viewer-close" onClick={()=>setViewer(null)}>×</button>
          </div>
          <div className="viewer-body">
            {viewer.type==="txt"
              ?<textarea id="viewer-ta" className="viewer-txt" readOnly value={viewer.content}/>
              :<ViewerIframe content={viewer.content}/>
            }
          </div>
        </div>
      )}
    </>
  );
}
export default App;
