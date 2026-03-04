import React, { useState, useEffect, useCallback } from "react";
import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

// ╔══════════════════════════════════════════════════════════════╗
// ║                  ✏️  EDITABLE CONFIG                         ║
// ║  Change names, colors, and goals here without touching       ║
// ║  anything else in the file.                                  ║
// ╚══════════════════════════════════════════════════════════════╝

const CONFIG = {
  // ── App name shown in the header
  appName: "TRACKER",
  appTagline: "Journey First · Review Monthly",

  // ── Your name (used in greetings)
  name: "Kofi",

  // ── Nutrition daily goals (grams / kcal)
  nutritionGoals: {
    protein: 180,
    carbs: 250,
    fat: 70,
    calories: 2400,
  },

  // ── GRE target score and test date
  greTarget: { quant: 165, verbal: 160, testDate: "2026-06-01" },

  // ── Nzema current level (A1 / A2 / B1 / B2 / C1 / C2)
  nzemaStartLevel: "A1",
};

// ╔══════════════════════════════════════════════════════════════╗
// ║                  🎨 CATEGORY COLORS                          ║
// ║  Change color values here to restyle the whole app.         ║
// ╚══════════════════════════════════════════════════════════════╝
const CATS = {
  prestige:  { label: "Prestige & IB",   color: "#4A7FC1", accent: "#7FA3D4" },
  work:      { label: "Work & Projects", color: "#6DBD95", accent: "#6DBD95" },
  gym:       { label: "Gym & Body",      color: "#9B84D4", accent: "#B8A8E8" },
  nutrition: { label: "Nutrition",       color: "#E8A050", accent: "#F0C080" },
  nzema:     { label: "Nzema",           color: "#D47080", accent: "#E8A0A8" },
  self:      { label: "Self",            color: "#7AA8C4", accent: "#9BBDD4" },
  recovery:  { label: "Recovery",        color: "#555",    accent: "#777"    },
};

// ╔══════════════════════════════════════════════════════════════╗
// ║                  📅 WEEKLY SCHEDULE                          ║
// ║  Each day = array of blocks. To rename a block change        ║
// ║  the `label` field. To change what tracker it feeds,        ║
// ║  change `cat` and `action`.                                  ║
// ║                                                              ║
// ║  action types:                                               ║
// ║    "checkin"       → logs show-up only                       ║
// ║    "gym-note"      → prompts note → logs to Gym tab          ║
// ║    "gre-session"   → auto-logs GRE minutes to Prestige tab   ║
// ║    "nzema-self"    → auto-logs self-study to Nzema tab       ║
// ║    "nzema-class"   → auto-logs class session to Nzema tab    ║
// ║    "project-note"  → prompts note → logs to Work tab         ║
// ╚══════════════════════════════════════════════════════════════╝
const SCHEDULE = {
  1: [ // ── Monday (Push + Swim)
    { id:"mon-prayer",    time:"6:15–6:40",   label:"Prayer & Reflection",     cat:"self",     action:"checkin" },
    { id:"mon-nzema",     time:"6:40–7:00",   label:"Nzema Self-Study",         cat:"nzema",    action:"nzema-self",    duration:20 },
    { id:"mon-swim",      time:"7:00–7:30",   label:"Swim",                     cat:"gym",      action:"gym-note",      gymSplit:"Swim" },
    { id:"mon-work",      time:"8:00–5:00",   label:"DCA — Core Work",          cat:"work",     action:"checkin" },
    { id:"mon-push",      time:"5:15–6:30",   label:"Gym — Push + Bike",        cat:"gym",      action:"gym-note",      gymSplit:"Push" },
    { id:"mon-dinner",    time:"6:30–7:00",   label:"Dinner & Decompress",      cat:"recovery", action:"checkin" },
    { id:"mon-elephants", time:"7:00–9:00",   label:"Les Éléphants",            cat:"work",     action:"project-note",  project:"Les Éléphants" },
    { id:"mon-wind",      time:"9:00–10:00",  label:"Wind Down · Prayer",       cat:"self",     action:"checkin" },
  ],
  2: [ // ── Tuesday (Pull, No Swim)
    { id:"tue-prayer",    time:"6:45–7:10",   label:"Prayer & Reflection",     cat:"self",     action:"checkin" },
    { id:"tue-nzema",     time:"7:10–7:30",   label:"Nzema Self-Study",         cat:"nzema",    action:"nzema-self",    duration:20 },
    { id:"tue-work",      time:"8:00–5:00",   label:"DCA — Core Work",          cat:"work",     action:"checkin" },
    { id:"tue-pull",      time:"5:15–6:30",   label:"Gym — Pull + Bike",        cat:"gym",      action:"gym-note",      gymSplit:"Pull" },
    { id:"tue-dinner",    time:"6:30–7:00",   label:"Dinner & Decompress",      cat:"recovery", action:"checkin" },
    { id:"tue-chess",     time:"7:00–9:00",   label:"Chess",                    cat:"self",     action:"checkin" },
    { id:"tue-wind",      time:"9:00–10:00",  label:"Wind Down",                cat:"self",     action:"checkin" },
  ],
  3: [ // ── Wednesday (Legs + Swim)
    { id:"wed-prayer",    time:"6:15–6:40",   label:"Prayer & Reflection",     cat:"self",     action:"checkin" },
    { id:"wed-nzema",     time:"6:40–7:00",   label:"Nzema Self-Study",         cat:"nzema",    action:"nzema-self",    duration:20 },
    { id:"wed-swim",      time:"7:00–7:30",   label:"Swim",                     cat:"gym",      action:"gym-note",      gymSplit:"Swim" },
    { id:"wed-work",      time:"8:00–5:00",   label:"DCA — Core Work",          cat:"work",     action:"checkin" },
    { id:"wed-legs",      time:"5:15–6:30",   label:"Gym — Legs + Bike",        cat:"gym",      action:"gym-note",      gymSplit:"Legs" },
    { id:"wed-dinner",    time:"6:30–7:00",   label:"Dinner & Decompress",      cat:"recovery", action:"checkin" },
    { id:"wed-enj",       time:"7:00–9:00",   label:"ENJ",                      cat:"work",     action:"project-note",  project:"ENJ" },
    { id:"wed-wind",      time:"9:00–10:00",  label:"Wind Down",                cat:"self",     action:"checkin" },
  ],
  4: [ // ── Thursday (Upper, No Swim)
    { id:"thu-prayer",    time:"6:45–7:10",   label:"Prayer & Reflection",     cat:"self",     action:"checkin" },
    { id:"thu-nzema",     time:"7:10–7:30",   label:"Nzema Self-Study",         cat:"nzema",    action:"nzema-self",    duration:20 },
    { id:"thu-work",      time:"8:00–5:00",   label:"DCA — Core Work",          cat:"work",     action:"checkin" },
    { id:"thu-upper",     time:"5:15–6:30",   label:"Gym — Upper + Bike",       cat:"gym",      action:"gym-note",      gymSplit:"Upper" },
    { id:"thu-dinner",    time:"6:30–7:00",   label:"Dinner & Decompress",      cat:"recovery", action:"checkin" },
    { id:"thu-prestige",  time:"7:00–9:00",   label:"Prestige Work",            cat:"prestige", action:"checkin" },
    { id:"thu-wind",      time:"9:00–10:00",  label:"Wind Down",                cat:"self",     action:"checkin" },
  ],
  5: [ // ── Friday (Recovery + Swim)
    { id:"fri-prayer",    time:"6:15–6:40",   label:"Prayer & Reflection",     cat:"self",     action:"checkin" },
    { id:"fri-nzema",     time:"6:40–7:00",   label:"Nzema Self-Study",         cat:"nzema",    action:"nzema-self",    duration:20 },
    { id:"fri-swim",      time:"7:00–7:30",   label:"Swim (Recovery)",          cat:"gym",      action:"gym-note",      gymSplit:"Swim" },
    { id:"fri-work",      time:"8:00–5:00",   label:"DCA — Core Work",          cat:"work",     action:"checkin" },
    { id:"fri-bike",      time:"5:15–6:00",   label:"Light Bike Only",          cat:"gym",      action:"gym-note",      gymSplit:"Bike/Cardio" },
    { id:"fri-dinner",    time:"6:00–7:00",   label:"Dinner & Decompress",      cat:"recovery", action:"checkin" },
    { id:"fri-prestige",  time:"7:00–9:00",   label:"Prestige Flex / Rest",     cat:"prestige", action:"checkin" },
    { id:"fri-wind",      time:"9:00–10:00",  label:"Wind Down",                cat:"self",     action:"checkin" },
  ],
  6: [ // ── Saturday
    { id:"sat-prayer",    time:"9:00–9:30",   label:"Prayer Call w/ Friends",  cat:"self",     action:"checkin" },
    { id:"sat-clean",     time:"9:30–11:30",  label:"Apartment Clean",          cat:"recovery", action:"checkin" },
    { id:"sat-gre",       time:"12:00–3:00",  label:"GRE Prep — Quant",         cat:"prestige", action:"gre-session",   duration:180 },
    { id:"sat-nzema",     time:"3:00–4:00",   label:"Nzema Class",              cat:"nzema",    action:"nzema-class",   duration:60 },
    { id:"sat-free",      time:"4:00+",       label:"Evening Free",             cat:"recovery", action:"checkin" },
  ],
  0: [ // ── Sunday
    { id:"sun-wake",      time:"10:00",       label:"Wake Up",                  cat:"self",     action:"checkin" },
    { id:"sun-church",    time:"11:00",       label:"Church",                   cat:"self",     action:"checkin" },
    { id:"sun-lunch",     time:"Post-Church", label:"Lunch & Decompress",       cat:"recovery", action:"checkin" },
    { id:"sun-gre",       time:"2:00–3:30",   label:"GRE — Review & Practice",  cat:"prestige", action:"gre-session",   duration:90 },
    { id:"sun-prestige",  time:"3:30–5:30",   label:"Prestige Flex",            cat:"prestige", action:"checkin" },
    { id:"sun-nzema",     time:"5:30–6:00",   label:"Nzema Self-Study",         cat:"nzema",    action:"nzema-self",    duration:20 },
    { id:"sun-free",      time:"6:00+",       label:"Evening Free",             cat:"recovery", action:"checkin" },
  ],
};

// ══════════════════════════════════════════════════════════════
// CONSTANTS (don't need to edit these)
// ══════════════════════════════════════════════════════════════
const GYM_SPLITS   = ["Push","Pull","Legs","Upper","Swim","Bike/Cardio","Rest"];
const NZEMA_LEVELS = ["A1","A2","B1","B2","C1","C2"];
const MONTHS       = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS_FULL    = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAYS_SHORT   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const todayStr  = () => new Date().toISOString().split("T")[0];
const thisMonth = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; };
const fmtDate   = s => { if(!s) return ""; const d=new Date(s+"T12:00:00"); return `${MONTHS[d.getMonth()]} ${d.getDate()}`; };
const fmtMonth  = s => { const[y,m]=s.split("-"); return `${MONTHS[+m-1]} ${y}`; };
const dateKey   = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const getWeekNum= s => { const d=new Date(s); const jan1=new Date(d.getFullYear(),0,1); return Math.ceil(((d-jan1)/86400000+jan1.getDay()+1)/7); };

// ══════════════════════════════════════════════════════════════
// STORAGE
// ══════════════════════════════════════════════════════════════
const load = async (key, fallback) => {
  try { const r=await window.storage.get(key); return r ? JSON.parse(r.value) : fallback; }
  catch { return fallback; }
};
const save = async (key, val) => { try { await window.storage.set(key, JSON.stringify(val)); } catch {} };

// ══════════════════════════════════════════════════════════════
// EXPORT HELPERS
// ══════════════════════════════════════════════════════════════
const downloadJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:"application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const downloadCSV = (rows, filename) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]).join(",");
  const lines   = rows.map(r => Object.values(r).map(v => `"${String(v||"").replace(/"/g,'""')}"`).join(","));
  const csv     = [headers, ...lines].join("\n");
  const blob    = new Blob([csv], { type:"text/csv" });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

// ══════════════════════════════════════════════════════════════
// SMALL UI COMPONENTS
// ══════════════════════════════════════════════════════════════
const Tag = ({ color, children }) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:3,fontSize:10,padding:"2px 7px",letterSpacing:1,fontFamily:"monospace",textTransform:"uppercase"}}>{children}</span>
);

const SectionHeader = ({ color, title, subtitle, action, actionLabel }) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
    <div>
      <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase",color,marginBottom:4}}>{title}</div>
      {subtitle && <div style={{fontSize:12,color:"#555"}}>{subtitle}</div>}
    </div>
    {action && (
      <button onClick={action} style={{background:color+"22",border:`1px solid ${color}`,color,padding:"6px 16px",borderRadius:3,fontSize:11,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>
        {actionLabel}
      </button>
    )}
  </div>
);

const Card = ({ children, style={} }) => (
  <div style={{background:"#131210",border:"1px solid #2a2820",borderRadius:6,padding:"16px 20px",marginBottom:16,...style}}>
    {children}
  </div>
);

const CardLabel = ({ children }) => (
  <div style={{fontSize:10,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",color:"#888",marginBottom:12}}>{children}</div>
);

const MacroRing = ({ label, val, max, color }) => {
  const pct=Math.min(val/max,1), r=22, circ=2*Math.PI*r;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <svg width={56} height={56} viewBox="0 0 56 56">
        <circle cx={28} cy={28} r={r} fill="none" stroke="#2a2820" strokeWidth={5}/>
        <circle cx={28} cy={28} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
          transform="rotate(-90 28 28)" style={{transition:"stroke-dashoffset 0.5s"}}/>
        <text x={28} y={32} textAnchor="middle" fill={color} fontSize={11} fontFamily="monospace" fontWeight="bold">{val}g</text>
      </svg>
      <span style={{fontSize:9,color:"#888",letterSpacing:1,textTransform:"uppercase",fontFamily:"monospace"}}>{label}</span>
    </div>
  );
};

const StreakDots = ({ days, month }) => {
  const [y,m]=month.split("-").map(Number);
  const dim=new Date(y,m,0).getDate();
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
      {Array.from({length:dim},(_,i)=>{
        const d=`${month}-${String(i+1).padStart(2,"0")}`;
        return <div key={i} title={d} style={{width:10,height:10,borderRadius:2,background:days[d]?"#6DBD95":"#2a2820",transition:"background 0.2s"}}/>;
      })}
    </div>
  );
};

const ExportRow = ({ label, color, onJSON, onCSV }) => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #1a1814"}}>
    <span style={{fontSize:13,color:"#f0ede8",fontWeight:500}}>{label}</span>
    <div style={{display:"flex",gap:8}}>
      <button onClick={onCSV} style={{background:"#1a5c3a22",border:"1px solid #1a5c3a",color:"#6DBD95",padding:"5px 12px",borderRadius:3,fontSize:10,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>CSV</button>
      <button onClick={onJSON} style={{background:color+"22",border:`1px solid ${color}`,color,padding:"5px 12px",borderRadius:3,fontSize:10,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>JSON</button>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════
// NOTE MODAL — shown when tapping gym or project blocks
// ══════════════════════════════════════════════════════════════
const NoteModal = ({ block, onConfirm, onCancel }) => {
  const [note, setNote] = useState("");
  const isProject = block.action === "project-note";
  const col = CATS[block.cat]?.color || "#888";
  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:24}}>
      <div style={{background:"#1a1814",border:`1px solid ${col}44`,borderRadius:8,padding:24,width:"100%",maxWidth:400}}>
        <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",color:CATS[block.cat]?.accent,marginBottom:6}}>{block.label}</div>
        <div style={{fontSize:13,color:"#666",marginBottom:16}}>
          {isProject ? "Quick note — what did you work on?" : "How'd it go? Energy, injury notes, PRs?"}
        </div>
        <textarea autoFocus placeholder={isProject ? "e.g. Reviewed budget, emailed FIF contact..." : "e.g. Good energy, knee fine, hit PR on bench..."}
          value={note} onChange={e=>setNote(e.target.value)}
          style={{width:"100%",background:"#0f0e0c",border:"1px solid #3a3830",color:"#f0ede8",padding:"10px 14px",borderRadius:4,fontSize:13,fontFamily:"monospace",outline:"none",resize:"vertical",minHeight:80,marginBottom:16}}/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>onConfirm(note)} style={{flex:1,background:col,color:"#fff",border:"none",padding:"12px",borderRadius:4,fontSize:12,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>✓ Log It</button>
          <button onClick={onCancel} style={{padding:"12px 20px",background:"transparent",border:"1px solid #3a3830",color:"#666",borderRadius:4,fontSize:12,fontFamily:"monospace",cursor:"pointer"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// CHART TOOLTIP
// ══════════════════════════════════════════════════════════════
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"#1a1814",border:"1px solid #3a3830",borderRadius:4,padding:"8px 12px"}}>
      <div style={{fontSize:10,color:"#888",fontFamily:"monospace",marginBottom:4}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{fontSize:12,color:p.color,fontFamily:"monospace"}}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// SCHEDULE TAB
// ══════════════════════════════════════════════════════════════
const ScheduleTab = ({ blockChecks, onBlockCheck, viewMode, setViewMode }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pendingBlock, setPendingBlock] = useState(null);
  const [weekStart, setWeekStart] = useState(()=>{ const d=new Date(); d.setDate(d.getDate()-d.getDay()); return d; });

  const handleBlockTap = (block, dateStr) => {
    const key = `${dateStr}::${block.id}`;
    if (blockChecks[key]) { onBlockCheck(key, block, dateStr, null, true); return; }
    if (block.action==="gym-note" || block.action==="project-note") {
      setPendingBlock({block, dateStr, key});
    } else {
      onBlockCheck(key, block, dateStr, null, false);
    }
  };

  const renderDay = (date) => {
    const dow  = date.getDay();
    const dStr = dateKey(date);
    const blocks = SCHEDULE[dow] || [];
    const isToday = dStr === todayStr();
    const completed = blocks.filter(b=>blockChecks[`${dStr}::${b.id}`]).length;

    return (
      <div key={dStr} style={{marginBottom: viewMode==="week" ? 24 : 0}}>
        {viewMode==="week" && (
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,paddingBottom:8,borderBottom:"1px solid #1a1814"}}>
            <span style={{fontSize:11,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",color:isToday?CATS.prestige.color:"#555",minWidth:32}}>{DAYS_SHORT[dow]}</span>
            <span style={{fontSize:11,color:"#444",fontFamily:"monospace"}}>{MONTHS[date.getMonth()]} {date.getDate()}</span>
            {isToday && <span style={{background:CATS.prestige.color+"33",color:CATS.prestige.accent,padding:"1px 7px",borderRadius:2,fontSize:9,fontFamily:"monospace",letterSpacing:1}}>TODAY</span>}
            <span style={{marginLeft:"auto",fontSize:10,color:"#444",fontFamily:"monospace"}}>{completed}/{blocks.length}</span>
          </div>
        )}
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {blocks.map(block=>{
            const key=`${dStr}::${block.id}`;
            const checked=!!blockChecks[key];
            const col=CATS[block.cat]?.color||"#888";
            return (
              <div key={block.id} onClick={()=>handleBlockTap(block,dStr)}
                style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:checked?"#0f1a0f":"#131210",borderRadius:4,border:`1px solid ${checked?col+"44":"#2a2820"}`,borderLeft:`3px solid ${checked?col:col+"33"}`,cursor:"pointer",transition:"all 0.2s"}}>
                <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${checked?col:"#3a3830"}`,background:checked?col:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>
                  {checked && <span style={{color:"#000",fontSize:9,fontWeight:"bold"}}>✓</span>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:500,color:checked?"#555":"#f0ede8",textDecoration:checked?"line-through":"none"}}>{block.label}</div>
                  <div style={{fontSize:10,color:"#444",fontFamily:"monospace",marginTop:2}}>{block.time}</div>
                </div>
                <div style={{width:7,height:7,borderRadius:"50%",background:col,opacity:checked?0.3:0.7,flexShrink:0}}/>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const weekDates = Array.from({length:7},(_,i)=>{ const d=new Date(weekStart); d.setDate(weekStart.getDate()+i); return d; });
  const todayBlocks = SCHEDULE[new Date().getDay()]||[];
  const completedToday = todayBlocks.filter(b=>blockChecks[`${todayStr()}::${b.id}`]).length;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase",color:"#888",marginBottom:4}}>Schedule</div>
          {viewMode==="day" && <div style={{fontSize:12,color:"#555"}}>{completedToday}/{todayBlocks.length} blocks today</div>}
        </div>
        <div style={{display:"flex",gap:0,background:"#131210",border:"1px solid #2a2820",borderRadius:4,overflow:"hidden"}}>
          {["day","week"].map(v=>(
            <button key={v} onClick={()=>setViewMode(v)} style={{padding:"7px 16px",background:viewMode===v?"#2a2820":"transparent",border:"none",color:viewMode===v?"#f0ede8":"#444",fontSize:11,fontFamily:"monospace",cursor:"pointer",letterSpacing:1,textTransform:"uppercase"}}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Day navigator */}
      {viewMode==="day" && (
        <div style={{display:"flex",alignItems:"center",marginBottom:20,background:"#131210",border:"1px solid #2a2820",borderRadius:6,overflow:"hidden"}}>
          <button onClick={()=>{const d=new Date(selectedDate);d.setDate(d.getDate()-1);setSelectedDate(d);}} style={{padding:"10px 18px",background:"transparent",border:"none",color:"#555",cursor:"pointer",fontSize:16}}>‹</button>
          <div style={{flex:1,textAlign:"center"}}>
            <div style={{fontSize:13,color:"#f0ede8",fontFamily:"monospace"}}>{DAYS_FULL[selectedDate.getDay()]}</div>
            <div style={{fontSize:10,color:"#555",fontFamily:"monospace"}}>{MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}</div>
          </div>
          <button onClick={()=>{const d=new Date(selectedDate);d.setDate(d.getDate()+1);setSelectedDate(d);}} style={{padding:"10px 18px",background:"transparent",border:"none",color:"#555",cursor:"pointer",fontSize:16}}>›</button>
        </div>
      )}

      {/* Week navigator */}
      {viewMode==="week" && (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <button onClick={()=>{const d=new Date(weekStart);d.setDate(d.getDate()-7);setWeekStart(d);}} style={{background:"transparent",border:"1px solid #2a2820",color:"#555",padding:"6px 14px",borderRadius:3,cursor:"pointer",fontFamily:"monospace",fontSize:11}}>← Prev</button>
          <span style={{fontSize:10,fontFamily:"monospace",color:"#666"}}>{MONTHS[weekStart.getMonth()]} {weekStart.getDate()} – {MONTHS[weekDates[6].getMonth()]} {weekDates[6].getDate()}</span>
          <button onClick={()=>{const d=new Date(weekStart);d.setDate(d.getDate()+7);setWeekStart(d);}} style={{background:"transparent",border:"1px solid #2a2820",color:"#555",padding:"6px 14px",borderRadius:3,cursor:"pointer",fontFamily:"monospace",fontSize:11}}>Next →</button>
        </div>
      )}

      {viewMode==="day" && renderDay(selectedDate)}
      {viewMode==="week" && weekDates.map(d=>renderDay(d))}

      {pendingBlock && <NoteModal block={pendingBlock.block} onConfirm={note=>{onBlockCheck(pendingBlock.key,pendingBlock.block,pendingBlock.dateStr,note,false);setPendingBlock(null);}} onCancel={()=>setPendingBlock(null)}/>}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════
const Dashboard = ({ checkins, onCheckin, month, blockChecks }) => {
  const [y,mo]=month.split("-").map(Number);
  const dim=new Date(y,mo,0).getDate();
  const days=Array.from({length:dim},(_,i)=>`${month}-${String(i+1).padStart(2,"0")}`);
  const showed=days.filter(d=>checkins[d]).length;
  const pct=Math.round((showed/dim)*100);
  const checkedToday=checkins[todayStr()];
  const todayBlocks=SCHEDULE[new Date().getDay()]||[];
  const completedToday=todayBlocks.filter(b=>blockChecks[`${todayStr()}::${b.id}`]).length;

  return (
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:11,color:"#444",fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>{fmtMonth(month)}</div>
        <div style={{fontSize:13,color:"#555",marginBottom:20,lineHeight:1.7}}>The goal is not to check your progress every day.<br/>Show up. Do the work. Review at month's end.</div>
        <button onClick={()=>onCheckin(todayStr())} style={{width:"100%",padding:"22px",borderRadius:6,background:checkedToday?"#0f1a0f":"#1a1814",border:`2px solid ${checkedToday?"#6DBD95":"#2a2820"}`,color:checkedToday?"#6DBD95":"#f0ede8",fontSize:15,fontFamily:"'Playfair Display',serif",fontWeight:700,cursor:"pointer",transition:"all 0.3s",letterSpacing:1}}>
          {checkedToday ? "✓ You Showed Up Today" : "Tap to Log: I Showed Up"}
        </button>
      </div>

      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <CardLabel>Today's Blocks</CardLabel>
          <span style={{fontSize:18,fontFamily:"monospace",fontWeight:"bold",color:"#6DBD95"}}>{completedToday}/{todayBlocks.length}</span>
        </div>
        <div style={{height:6,background:"#2a2820",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",background:"#6DBD95",borderRadius:3,width:`${(completedToday/Math.max(todayBlocks.length,1))*100}%`,transition:"width 0.4s"}}/>
        </div>
      </Card>

      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <CardLabel>Monthly Attendance</CardLabel>
          <span style={{fontSize:22,fontFamily:"monospace",fontWeight:"bold",color:"#6DBD95"}}>{pct}%</span>
        </div>
        <StreakDots days={checkins} month={month}/>
        <div style={{marginTop:10,fontSize:11,color:"#444",fontFamily:"monospace"}}>{showed} of {dim} days logged</div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {Object.entries(CATS).filter(([k])=>k!=="recovery"&&k!=="self").map(([k,c])=>(
          <div key={k} style={{background:"#131210",border:`1px solid ${c.color}22`,borderLeft:`3px solid ${c.color}`,borderRadius:4,padding:"10px 14px"}}>
            <div style={{fontSize:9,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",color:c.accent,marginBottom:3}}>{c.label}</div>
            <div style={{fontSize:11,color:"#333"}}>Review monthly →</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// PRESTIGE TRACKER + PROGRESSION
// ══════════════════════════════════════════════════════════════
const PrestigeTracker = ({ data, setData }) => {
  const [adding, setAdding] = useState(false);
  const [view, setView] = useState("milestones"); // milestones | progress
  const [form, setForm] = useState({title:"",category:"GRE",target:""});
  const PCATS = ["GRE","MBA Application","Fellowship","IB Transition","Networking","Platform","Other"];
  const col = CATS.prestige.color;

  const addMilestone = () => {
    if (!form.title.trim()) return;
    const m={id:Date.now(),title:form.title,category:form.category,target:form.target,done:false,doneDate:null};
    const u={...data,milestones:[...(data.milestones||[]),m]};
    setData(u); save("prestige",u);
    setForm({title:"",category:"GRE",target:""}); setAdding(false);
  };

  const toggle = id => {
    const milestones=(data.milestones||[]).map(m=>m.id===id?{...m,done:!m.done,doneDate:!m.done?todayStr():null}:m);
    const u={...data,milestones}; setData(u); save("prestige",u);
  };

  // GRE weekly chart data
  const greSessions = data.greSessions||[];
  const greByWeek = greSessions.reduce((acc,s)=>{
    const wk=`W${getWeekNum(s.date)}`;
    acc[wk]=(acc[wk]||0)+s.duration;
    return acc;
  },{});
  const greChartData = Object.entries(greByWeek).slice(-8).map(([w,m])=>({week:w,minutes:m,hours:+(m/60).toFixed(1)}));
  const totalGREMins = greSessions.filter(s=>s.date?.startsWith(thisMonth())).reduce((a,s)=>a+s.duration,0);

  const byCategory = PCATS.reduce((acc,cat)=>{
    const items=(data.milestones||[]).filter(m=>m.category===cat);
    if(items.length) acc[cat]=items; return acc;
  },{});

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase",color:CATS.prestige.accent,marginBottom:4}}>Prestige & IB</div>
          <div style={{fontSize:12,color:"#555"}}>{Math.floor(totalGREMins/60)}h {totalGREMins%60}m GRE this month</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <div style={{display:"flex",background:"#131210",border:"1px solid #2a2820",borderRadius:4,overflow:"hidden"}}>
            {["milestones","progress"].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"5px 12px",background:view===v?"#2a2820":"transparent",border:"none",color:view===v?"#f0ede8":"#444",fontSize:10,fontFamily:"monospace",cursor:"pointer",letterSpacing:1,textTransform:"uppercase"}}>{v}</button>
            ))}
          </div>
          {view==="milestones" && <button onClick={()=>setAdding(!adding)} style={{background:col+"22",border:`1px solid ${col}`,color:CATS.prestige.accent,padding:"5px 14px",borderRadius:3,fontSize:11,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>{adding?"✕":"+"}</button>}
        </div>
      </div>

      {/* PROGRESS VIEW */}
      {view==="progress" && (
        <div>
          <Card>
            <CardLabel>GRE Hours by Week</CardLabel>
            {greChartData.length ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={greChartData}>
                  <XAxis dataKey="week" tick={{fill:"#555",fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#555",fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTooltip/>}/>
                  <Bar dataKey="hours" fill={col} radius={[3,3,0,0]} name="Hours"/>
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={{textAlign:"center",color:"#444",fontSize:12,padding:"32px 0",fontFamily:"monospace"}}>No GRE sessions logged yet.</div>}
          </Card>

          <Card>
            <CardLabel>Milestone Progress</CardLabel>
            {PCATS.map(cat=>{
              const items=(data.milestones||[]).filter(m=>m.category===cat);
              if(!items.length) return null;
              const done=items.filter(m=>m.done).length;
              return (
                <div key={cat} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:11,color:"#888",fontFamily:"monospace"}}>{cat}</span>
                    <span style={{fontSize:11,color:col,fontFamily:"monospace"}}>{done}/{items.length}</span>
                  </div>
                  <div style={{height:4,background:"#2a2820",borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",background:col,borderRadius:2,width:`${(done/items.length)*100}%`,transition:"width 0.4s"}}/>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* MILESTONES VIEW */}
      {view==="milestones" && (
        <div>
          {adding && (
            <Card>
              <input placeholder="Milestone title..." value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
                style={{width:"100%",background:"#1a1814",border:"1px solid #3a3830",color:"#f0ede8",padding:"10px 14px",borderRadius:4,fontSize:13,marginBottom:10,fontFamily:"monospace",outline:"none"}}/>
              <div style={{display:"flex",gap:10,marginBottom:10}}>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
                  style={{flex:1,background:"#1a1814",border:"1px solid #3a3830",color:"#aaa",padding:"8px 12px",borderRadius:4,fontSize:12,fontFamily:"monospace",outline:"none"}}>
                  {PCATS.map(c=><option key={c}>{c}</option>)}
                </select>
                <input type="date" value={form.target} onChange={e=>setForm({...form,target:e.target.value})}
                  style={{flex:1,background:"#1a1814",border:"1px solid #3a3830",color:"#aaa",padding:"8px 12px",borderRadius:4,fontSize:12,fontFamily:"monospace",outline:"none"}}/>
              </div>
              <button onClick={addMilestone} style={{background:col,color:"#fff",border:"none",padding:"10px 24px",borderRadius:4,fontSize:12,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>Add</button>
            </Card>
          )}

          {Object.keys(byCategory).length===0 && !adding && (
            <div style={{textAlign:"center",color:"#444",fontSize:13,padding:"40px 0",fontFamily:"monospace"}}>No milestones yet.</div>
          )}

          {Object.entries(byCategory).map(([cat,items])=>(
            <div key={cat} style={{marginBottom:20}}>
              <div style={{fontSize:10,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",color:CATS.prestige.accent,marginBottom:8,opacity:0.6}}>{cat}</div>
              {items.map(m=>(
                <div key={m.id} onClick={()=>toggle(m.id)} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",background:m.done?"#0f1a0f":"#131210",borderRadius:4,border:`1px solid ${m.done?col+"44":"#2a2820"}`,cursor:"pointer",marginBottom:6,transition:"all 0.2s"}}>
                  <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${m.done?col:"#3a3830"}`,background:m.done?col:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                    {m.done&&<span style={{color:"#000",fontSize:9,fontWeight:"bold"}}>✓</span>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <span style={{color:m.done?"#444":"#f0ede8",fontSize:13,fontWeight:500,textDecoration:m.done?"line-through":"none"}}>{m.title}</span>
                      {m.done&&m.doneDate&&<span style={{fontSize:10,color:col,fontFamily:"monospace",flexShrink:0,marginLeft:8}}>{fmtDate(m.doneDate)}</span>}
                    </div>
                    {m.target&&<div style={{fontSize:10,color:"#444",fontFamily:"monospace",marginTop:3}}>Target: {fmtDate(m.target)}</div>}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// GYM TRACKER + PROGRESSION
// ══════════════════════════════════════════════════════════════
const GymTracker = ({ data, setData }) => {
  const [logging, setLogging] = useState(false);
  const [view, setView] = useState("log");
  const [form, setForm] = useState({type:"Push",notes:"",date:todayStr()});
  const col = CATS.gym.color;
  const typeColor = t=>({Push:"#E8A050",Pull:"#4A7FC1",Legs:"#D47080",Upper:"#9B84D4",Swim:"#6DB8D4","Bike/Cardio":"#6DBD95",Rest:"#555"}[t]||"#888");
  const sessions = data.sessions||[];
  const thisMonthS = sessions.filter(s=>s.date?.startsWith(thisMonth()));

  // Monthly chart — sessions per split per month
  const sessionsByMonth = sessions.reduce((acc,s)=>{
    const mo=s.date?.slice(0,7); if(!mo) return acc;
    if(!acc[mo]) acc[mo]={month:MONTHS[+mo.slice(5)-1]};
    acc[mo][s.type]=(acc[mo][s.type]||0)+1;
    return acc;
  },{});
  const chartData = Object.values(sessionsByMonth).slice(-6);

  const logSession = () => {
    const s={id:Date.now(),...form};
    const u={...data,sessions:[...sessions,s]};
    setData(u); save("gym",u);
    setForm({type:"Push",notes:"",date:todayStr()}); setLogging(false);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase",color:CATS.gym.accent,marginBottom:4}}>Gym & Body</div>
          <div style={{fontSize:12,color:"#555"}}>{thisMonthS.length} sessions this month</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <div style={{display:"flex",background:"#131210",border:"1px solid #2a2820",borderRadius:4,overflow:"hidden"}}>
            {["log","progress"].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"5px 12px",background:view===v?"#2a2820":"transparent",border:"none",color:view===v?"#f0ede8":"#444",fontSize:10,fontFamily:"monospace",cursor:"pointer",letterSpacing:1,textTransform:"uppercase"}}>{v}</button>
            ))}
          </div>
          {view==="log" && <button onClick={()=>setLogging(!logging)} style={{background:col+"22",border:`1px solid ${col}`,color:CATS.gym.accent,padding:"5px 14px",borderRadius:3,fontSize:11,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>{logging?"✕":"+"}</button>}
        </div>
      </div>

      {/* PROGRESS VIEW */}
      {view==="progress" && (
        <div>
          <Card>
            <CardLabel>Sessions per Split (Last 6 Months)</CardLabel>
            {chartData.length ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" tick={{fill:"#555",fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#555",fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTooltip/>}/>
                  {["Push","Pull","Legs","Upper"].map(t=>(
                    <Bar key={t} dataKey={t} stackId="a" fill={typeColor(t)} name={t}/>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={{textAlign:"center",color:"#444",fontSize:12,padding:"32px 0",fontFamily:"monospace"}}>No sessions yet.</div>}
          </Card>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {["Push","Pull","Legs","Upper","Swim","Bike/Cardio"].map(t=>(
              <div key={t} style={{background:"#131210",border:`1px solid ${typeColor(t)}22`,borderRadius:4,padding:"12px",textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:"bold",color:typeColor(t),fontFamily:"monospace"}}>{sessions.filter(s=>s.type===t).length}</div>
                <div style={{fontSize:9,color:"#444",letterSpacing:1,textTransform:"uppercase",fontFamily:"monospace",marginTop:2}}>{t}</div>
                <div style={{fontSize:10,color:"#333",fontFamily:"monospace"}}>{thisMonthS.filter(s=>s.type===t).length} this mo.</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOG VIEW */}
      {view==="log" && (
        <div>
          {logging && (
            <Card>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                {GYM_SPLITS.map(t=>(
                  <button key={t} onClick={()=>setForm({...form,type:t})} style={{padding:"7px 12px",borderRadius:4,border:`1px solid ${form.type===t?typeColor(t):"#3a3830"}`,background:form.type===t?typeColor(t)+"22":"#1a1814",color:form.type===t?typeColor(t):"#555",fontSize:11,fontFamily:"monospace",cursor:"pointer"}}>{t}</button>
                ))}
              </div>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}
                style={{width:"100%",background:"#1a1814",border:"1px solid #3a3830",color:"#aaa",padding:"8px 12px",borderRadius:4,fontSize:12,fontFamily:"monospace",outline:"none",marginBottom:10}}/>
              <input placeholder="Notes..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}
                style={{width:"100%",background:"#1a1814",border:"1px solid #3a3830",color:"#f0ede8",padding:"10px 14px",borderRadius:4,fontSize:13,marginBottom:10,fontFamily:"monospace",outline:"none"}}/>
              <button onClick={logSession} style={{background:col,color:"#fff",border:"none",padding:"10px 24px",borderRadius:4,fontSize:12,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>Log</button>
            </Card>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {sessions.slice().reverse().slice(0,25).map(s=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"#131210",borderRadius:4,border:"1px solid #2a2820",borderLeft:`3px solid ${typeColor(s.type)}`}}>
                <span style={{fontSize:10,color:"#444",fontFamily:"monospace",minWidth:55}}>{fmtDate(s.date)}</span>
                <Tag color={typeColor(s.type)}>{s.type}</Tag>
                {s.notes&&<span style={{fontSize:12,color:"#666",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.notes}</span>}
                {s.fromSchedule&&<span style={{fontSize:9,color:"#333",fontFamily:"monospace"}}>auto</span>}
              </div>
            ))}
            {!sessions.length&&<div style={{textAlign:"center",color:"#444",fontSize:13,padding:"40px 0",fontFamily:"monospace"}}>Check off gym blocks in Schedule to auto-log here.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// NUTRITION TRACKER
// ══════════════════════════════════════════════════════════════
const NutritionTracker = ({ data, setData }) => {
  const [form, setForm] = useState({protein:"",carbs:"",fat:"",calories:"",date:todayStr()});
  const [logging, setLogging] = useState(false);
  const [view, setView] = useState("log");
  const goals = data.goals || CONFIG.nutritionGoals;
  const todayEntry=(data.log||[]).find(e=>e.date===todayStr());
  const col = CATS.nutrition.color;

  const logDay = () => {
    const entry={id:Date.now(),date:form.date,protein:+form.protein||0,carbs:+form.carbs||0,fat:+form.fat||0,calories:+form.calories||0};
    const u={...data,log:[...(data.log||[]),entry]};
    setData(u); save("nutrition",u);
    setForm({protein:"",carbs:"",fat:"",calories:"",date:todayStr()}); setLogging(false);
  };

  const updateGoals = (f,v) => {
    const u={...data,goals:{...goals,[f]:+v}}; setData(u); save("nutrition",u);
  };

  // Chart data — protein per month
  const byMonth = (data.log||[]).reduce((acc,e)=>{
    const mo=e.date?.slice(0,7); if(!mo) return acc;
    if(!acc[mo]) acc[mo]={month:MONTHS[+mo.slice(5)-1],protein:0,days:0};
    acc[mo].protein+=e.protein; acc[mo].days+=1;
    acc[mo].avgProtein=Math.round(acc[mo].protein/acc[mo].days);
    return acc;
  },{});
  const chartData = Object.values(byMonth).slice(-6);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase",color:CATS.nutrition.accent}}>Nutrition</div>
        <div style={{display:"flex",gap:6}}>
          <div style={{display:"flex",background:"#131210",border:"1px solid #2a2820",borderRadius:4,overflow:"hidden"}}>
            {["log","progress"].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"5px 12px",background:view===v?"#2a2820":"transparent",border:"none",color:view===v?"#f0ede8":"#444",fontSize:10,fontFamily:"monospace",cursor:"pointer",letterSpacing:1,textTransform:"uppercase"}}>{v}</button>
            ))}
          </div>
          {view==="log" && <button onClick={()=>setLogging(!logging)} style={{background:col+"22",border:`1px solid ${col}`,color:CATS.nutrition.accent,padding:"5px 14px",borderRadius:3,fontSize:11,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>{logging?"✕":"+ Log"}</button>}
        </div>
      </div>

      {view==="progress" && (
        <div>
          <Card>
            <CardLabel>Avg Daily Protein (g) by Month</CardLabel>
            {chartData.length ? (
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#1a1814" strokeDasharray="3 3"/>
                  <XAxis dataKey="month" tick={{fill:"#555",fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#555",fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTooltip/>}/>
                  <Line type="monotone" dataKey="avgProtein" stroke="#4A7FC1" strokeWidth={2} dot={{fill:"#4A7FC1",r:3}} name="Avg Protein"/>
                </LineChart>
              </ResponsiveContainer>
            ) : <div style={{textAlign:"center",color:"#444",fontSize:12,padding:"32px 0",fontFamily:"monospace"}}>No data yet.</div>}
          </Card>
          <Card>
            <CardLabel>Daily Goals</CardLabel>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {[["protein","P","#4A7FC1"],["carbs","C","#E8A050"],["fat","F","#D47080"],["calories","Kcal","#9B84D4"]].map(([f,lb,c])=>(
                <div key={f} style={{textAlign:"center"}}>
                  <div style={{fontSize:9,color:c,fontFamily:"monospace",marginBottom:4,letterSpacing:1}}>{lb}</div>
                  <input type="number" value={goals[f]} onChange={e=>updateGoals(f,e.target.value)}
                    style={{width:"100%",background:"#1a1814",border:`1px solid ${c}33`,color:"#aaa",padding:"6px 4px",borderRadius:3,fontSize:12,fontFamily:"monospace",outline:"none",textAlign:"center"}}/>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {view==="log" && (
        <div>
          {todayEntry && (
            <Card>
              <CardLabel>Today</CardLabel>
              <div style={{display:"flex",justifyContent:"space-around"}}>
                <MacroRing label="Protein" val={todayEntry.protein} max={goals.protein} color="#4A7FC1"/>
                <MacroRing label="Carbs"   val={todayEntry.carbs}   max={goals.carbs}   color="#E8A050"/>
                <MacroRing label="Fat"     val={todayEntry.fat}     max={goals.fat}     color="#D47080"/>
                <MacroRing label="Cals"    val={todayEntry.calories} max={goals.calories} color="#9B84D4"/>
              </div>
            </Card>
          )}
          {logging && (
            <Card>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}
                style={{width:"100%",background:"#1a1814",border:"1px solid #3a3830",color:"#aaa",padding:"8px 12px",borderRadius:4,fontSize:12,fontFamily:"monospace",outline:"none",marginBottom:10}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                {[["protein","Protein (g)","#4A7FC1"],["carbs","Carbs (g)","#E8A050"],["fat","Fat (g)","#D47080"],["calories","Calories","#9B84D4"]].map(([f,lb,c])=>(
                  <div key={f}>
                    <div style={{fontSize:10,fontFamily:"monospace",letterSpacing:1,color:c,marginBottom:4,textTransform:"uppercase"}}>{lb}</div>
                    <input type="number" placeholder="0" value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}
                      style={{width:"100%",background:"#1a1814",border:`1px solid ${c}44`,color:"#f0ede8",padding:"8px 12px",borderRadius:4,fontSize:14,fontFamily:"monospace",outline:"none",textAlign:"center"}}/>
                  </div>
                ))}
              </div>
              <button onClick={logDay} style={{width:"100%",background:col,color:"#fff",border:"none",padding:"10px",borderRadius:4,fontSize:12,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>Log Day</button>
            </Card>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {(data.log||[]).slice().reverse().slice(0,10).map(e=>(
              <div key={e.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"#131210",borderRadius:4,border:"1px solid #2a2820",borderLeft:`3px solid ${col}`}}>
                <span style={{fontSize:10,color:"#444",fontFamily:"monospace",minWidth:55}}>{fmtDate(e.date)}</span>
                <span style={{fontSize:11,color:"#4A7FC1",fontFamily:"monospace"}}>P:{e.protein}g</span>
                <span style={{fontSize:11,color:"#E8A050",fontFamily:"monospace"}}>C:{e.carbs}g</span>
                <span style={{fontSize:11,color:"#D47080",fontFamily:"monospace"}}>F:{e.fat}g</span>
                <span style={{fontSize:11,color:"#9B84D4",fontFamily:"monospace",marginLeft:"auto"}}>{e.calories}kcal</span>
              </div>
            ))}
            {!(data.log||[]).length&&<div style={{textAlign:"center",color:"#444",fontSize:13,padding:"40px 0",fontFamily:"monospace"}}>No nutrition logged yet.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// NZEMA TRACKER + PROGRESSION
// ══════════════════════════════════════════════════════════════
const NzemaTracker = ({ data, setData }) => {
  const [logging, setLogging] = useState(false);
  const [view, setView] = useState("log");
  const [form, setForm] = useState({duration:20,notes:"",date:todayStr()});
  const [editGoal, setEditGoal] = useState(false);
  const [goalForm, setGoalForm] = useState({level:"A2",targetDate:""});
  const currentLevel = data.currentLevel || CONFIG.nzemaStartLevel;
  const currentIdx = NZEMA_LEVELS.indexOf(currentLevel);
  const sessions = data.sessions||[];
  const col = CATS.nzema.color;

  const logSession = () => {
    const s={id:Date.now(),...form};
    const u={...data,sessions:[...sessions,s]};
    setData(u); save("nzema",u);
    setForm({duration:20,notes:"",date:todayStr()}); setLogging(false);
  };

  const setLevel = l => { const u={...data,currentLevel:l}; setData(u); save("nzema",u); };

  const addGoal = () => {
    const g={id:Date.now(),...goalForm,achieved:false};
    const u={...data,goals:[...(data.goals||[]),g]}; setData(u); save("nzema",u); setEditGoal(false);
  };

  const toggleGoal = id => {
    const goals=(data.goals||[]).map(g=>g.id===id?{...g,achieved:!g.achieved,achievedDate:!g.achieved?todayStr():null}:g);
    const u={...data,goals}; setData(u); save("nzema",u);
  };

  // Chart — minutes per month
  const byMonth = sessions.reduce((acc,s)=>{
    const mo=s.date?.slice(0,7); if(!mo) return acc;
    if(!acc[mo]) acc[mo]={month:MONTHS[+mo.slice(5)-1],minutes:0,sessions:0};
    acc[mo].minutes+=s.duration; acc[mo].sessions+=1;
    return acc;
  },{});
  const chartData = Object.values(byMonth).slice(-8);
  const thisMonthMins = sessions.filter(s=>s.date?.startsWith(thisMonth())).reduce((a,s)=>a+s.duration,0);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase",color:CATS.nzema.accent,marginBottom:4}}>Nzema</div>
          <div style={{fontSize:12,color:"#555"}}>{thisMonthMins}min studied this month</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <div style={{display:"flex",background:"#131210",border:"1px solid #2a2820",borderRadius:4,overflow:"hidden"}}>
            {["log","progress"].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"5px 12px",background:view===v?"#2a2820":"transparent",border:"none",color:view===v?"#f0ede8":"#444",fontSize:10,fontFamily:"monospace",cursor:"pointer",letterSpacing:1,textTransform:"uppercase"}}>{v}</button>
            ))}
          </div>
          {view==="log" && <button onClick={()=>setLogging(!logging)} style={{background:col+"22",border:`1px solid ${col}`,color:CATS.nzema.accent,padding:"5px 14px",borderRadius:3,fontSize:11,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>{logging?"✕":"+"}</button>}
        </div>
      </div>

      {/* Level progression — always visible */}
      <Card>
        <CardLabel>Level Progression</CardLabel>
        <div style={{display:"flex",gap:0,alignItems:"center"}}>
          {NZEMA_LEVELS.map((l,i)=>{
            const active=l===currentLevel, past=i<currentIdx;
            return (
              <div key={l} style={{display:"flex",alignItems:"center",flex:1}}>
                <button onClick={()=>setLevel(l)} style={{width:40,height:40,borderRadius:"50%",border:`2px solid ${active?col:past?col+"66":"#3a3830"}`,background:active?col:past?col+"22":"#1a1814",color:active?"#fff":past?col:"#444",fontSize:11,fontFamily:"monospace",fontWeight:"bold",cursor:"pointer",flexShrink:0,transition:"all 0.2s"}}>{l}</button>
                {i<NZEMA_LEVELS.length-1&&<div style={{flex:1,height:2,background:past?col+"44":"#2a2820"}}/>}
              </div>
            );
          })}
        </div>
        <div style={{marginTop:10,fontSize:11,color:"#555",fontFamily:"monospace"}}>Current: <span style={{color:col}}>{currentLevel}</span> · Tap to update</div>
      </Card>

      {/* PROGRESS VIEW */}
      {view==="progress" && (
        <div>
          <Card>
            <CardLabel>Minutes Studied per Month</CardLabel>
            {chartData.length ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" tick={{fill:"#555",fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#555",fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTooltip/>}/>
                  <Bar dataKey="minutes" fill={col} radius={[3,3,0,0]} name="Minutes"/>
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={{textAlign:"center",color:"#444",fontSize:12,padding:"32px 0",fontFamily:"monospace"}}>No sessions yet.</div>}
          </Card>

          {/* Goals */}
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <CardLabel>Level Goals</CardLabel>
              <button onClick={()=>setEditGoal(!editGoal)} style={{background:"transparent",border:"1px solid #3a3830",color:"#555",padding:"4px 10px",borderRadius:3,fontSize:10,fontFamily:"monospace",cursor:"pointer"}}>+ Goal</button>
            </div>
            {editGoal && (
              <div style={{marginBottom:12}}>
                <div style={{display:"flex",gap:10,marginBottom:10}}>
                  <select value={goalForm.level} onChange={e=>setGoalForm({...goalForm,level:e.target.value})}
                    style={{flex:1,background:"#1a1814",border:"1px solid #3a3830",color:"#aaa",padding:"8px 12px",borderRadius:4,fontSize:12,fontFamily:"monospace",outline:"none"}}>
                    {NZEMA_LEVELS.map(l=><option key={l}>{l}</option>)}
                  </select>
                  <input type="date" value={goalForm.targetDate} onChange={e=>setGoalForm({...goalForm,targetDate:e.target.value})}
                    style={{flex:1,background:"#1a1814",border:"1px solid #3a3830",color:"#aaa",padding:"8px 12px",borderRadius:4,fontSize:12,fontFamily:"monospace",outline:"none"}}/>
                </div>
                <button onClick={addGoal} style={{background:col,color:"#fff",border:"none",padding:"8px 20px",borderRadius:4,fontSize:11,fontFamily:"monospace",cursor:"pointer"}}>Add</button>
              </div>
            )}
            {(data.goals||[]).map(g=>(
              <div key={g.id} onClick={()=>toggleGoal(g.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"#1a1814",borderRadius:4,border:`1px solid ${g.achieved?col+"44":"#2a2820"}`,marginBottom:6,cursor:"pointer"}}>
                <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${g.achieved?col:"#444"}`,background:g.achieved?col:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {g.achieved&&<span style={{fontSize:8,color:"#fff",fontWeight:"bold"}}>✓</span>}
                </div>
                <span style={{color:g.achieved?col:"#f0ede8",fontFamily:"monospace",fontSize:13,fontWeight:"bold"}}>{g.level}</span>
                {g.targetDate&&<span style={{fontSize:10,color:"#555",fontFamily:"monospace"}}>by {fmtDate(g.targetDate)}</span>}
                {g.achieved&&g.achievedDate&&<span style={{fontSize:10,color:col,fontFamily:"monospace",marginLeft:"auto"}}>✓ {fmtDate(g.achievedDate)}</span>}
              </div>
            ))}
            {!(data.goals||[]).length&&!editGoal&&<div style={{color:"#444",fontSize:12,fontFamily:"monospace"}}>No level goals set yet.</div>}
          </Card>
        </div>
      )}

      {/* LOG VIEW */}
      {view==="log" && (
        <div>
          {logging && (
            <Card>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}
                style={{width:"100%",background:"#1a1814",border:"1px solid #3a3830",color:"#aaa",padding:"8px 12px",borderRadius:4,fontSize:12,fontFamily:"monospace",outline:"none",marginBottom:10}}/>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,fontFamily:"monospace",letterSpacing:1,color:CATS.nzema.accent,marginBottom:8,textTransform:"uppercase"}}>Duration: {form.duration}min</div>
                <input type="range" min={5} max={120} step={5} value={form.duration} onChange={e=>setForm({...form,duration:+e.target.value})} style={{width:"100%",accentColor:col}}/>
              </div>
              <input placeholder="Notes (vocab, topics covered...)" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}
                style={{width:"100%",background:"#1a1814",border:"1px solid #3a3830",color:"#f0ede8",padding:"10px 14px",borderRadius:4,fontSize:13,marginBottom:10,fontFamily:"monospace",outline:"none"}}/>
              <button onClick={logSession} style={{background:col,color:"#fff",border:"none",padding:"10px 24px",borderRadius:4,fontSize:12,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>Log</button>
            </Card>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {sessions.slice().reverse().slice(0,15).map(s=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"#131210",borderRadius:4,border:"1px solid #2a2820",borderLeft:`3px solid ${col}`}}>
                <span style={{fontSize:10,color:"#444",fontFamily:"monospace",minWidth:55}}>{fmtDate(s.date)}</span>
                <span style={{fontSize:11,color:col,fontFamily:"monospace"}}>{s.duration}min</span>
                {s.type&&<Tag color={col}>{s.type}</Tag>}
                {s.notes&&<span style={{fontSize:12,color:"#555",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.notes}</span>}
                {s.fromSchedule&&<span style={{fontSize:9,color:"#333",fontFamily:"monospace"}}>auto</span>}
              </div>
            ))}
            {!sessions.length&&<div style={{textAlign:"center",color:"#444",fontSize:13,padding:"40px 0",fontFamily:"monospace"}}>Check off Nzema blocks in Schedule to auto-log here.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// WORK TRACKER
// ══════════════════════════════════════════════════════════════
const WorkTracker = ({ data, setData }) => {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({title:"",description:"",status:"In Progress",target:""});
  const [expandedId, setExpandedId] = useState(null);
  const [updateText, setUpdateText] = useState("");
  const col = CATS.work.color;
  const STATUS = ["In Progress","Blocked","Complete","On Deck"];
  const statusColor = s=>({"In Progress":"#4A7FC1","Blocked":"#D47080","Complete":"#6DBD95","On Deck":"#888"}[s]||"#888");
  const projects = data.projects||[];

  const addProject = () => {
    if(!form.title.trim()) return;
    const p={id:Date.now(),...form,updates:[],createdDate:todayStr()};
    const u={...data,projects:[...projects,p]};
    setData(u); save("work",u);
    setForm({title:"",description:"",status:"In Progress",target:""}); setAdding(false);
  };

  const addUpdate = (id) => {
    if(!updateText.trim()) return;
    const ps=projects.map(p=>p.id===id?{...p,updates:[...(p.updates||[]),{text:updateText,date:todayStr()}]}:p);
    const u={...data,projects:ps}; setData(u); save("work",u); setUpdateText("");
  };

  const updateStatus = (id,status) => {
    const ps=projects.map(p=>p.id===id?{...p,status}:p);
    const u={...data,projects:ps}; setData(u); save("work",u);
  };

  return (
    <div>
      <SectionHeader color={CATS.work.accent} title="Work & Projects"
        subtitle={`${projects.filter(p=>p.status==="In Progress").length} active · notes auto-fed from schedule`}
        action={()=>setAdding(!adding)} actionLabel={adding?"Cancel":"+ Add"}/>

      {adding && (
        <Card>
          <input placeholder="Project title..." value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
            style={{width:"100%",background:"#1a1814",border:"1px solid #3a3830",color:"#f0ede8",padding:"10px 14px",borderRadius:4,fontSize:13,marginBottom:10,fontFamily:"monospace",outline:"none"}}/>
          <textarea placeholder="Goal / description..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
            style={{width:"100%",background:"#1a1814",border:"1px solid #3a3830",color:"#f0ede8",padding:"10px 14px",borderRadius:4,fontSize:12,marginBottom:10,fontFamily:"monospace",outline:"none",resize:"vertical",minHeight:56}}/>
          <div style={{display:"flex",gap:10,marginBottom:10}}>
            <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}
              style={{flex:1,background:"#1a1814",border:"1px solid #3a3830",color:"#aaa",padding:"8px 12px",borderRadius:4,fontSize:12,fontFamily:"monospace",outline:"none"}}>
              {STATUS.map(s=><option key={s}>{s}</option>)}
            </select>
            <input type="date" value={form.target} onChange={e=>setForm({...form,target:e.target.value})}
              style={{flex:1,background:"#1a1814",border:"1px solid #3a3830",color:"#aaa",padding:"8px 12px",borderRadius:4,fontSize:12,fontFamily:"monospace",outline:"none"}}/>
          </div>
          <button onClick={addProject} style={{background:col,color:"#fff",border:"none",padding:"10px 24px",borderRadius:4,fontSize:12,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>Add Project</button>
        </Card>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {projects.map(p=>(
          <div key={p.id} style={{background:"#131210",border:"1px solid #2a2820",borderLeft:`3px solid ${statusColor(p.status)}`,borderRadius:4,overflow:"hidden"}}>
            <div onClick={()=>setExpandedId(expandedId===p.id?null:p.id)} style={{padding:"14px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{color:"#f0ede8",fontSize:13,fontWeight:500,marginBottom:3}}>{p.title}</div>
                {p.description&&<div style={{color:"#555",fontSize:11}}>{p.description}</div>}
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0,marginLeft:12}}>
                {p.target&&<span style={{fontSize:10,color:"#444",fontFamily:"monospace"}}>{fmtDate(p.target)}</span>}
                <Tag color={statusColor(p.status)}>{p.status}</Tag>
                <span style={{color:"#333",fontSize:11}}>{expandedId===p.id?"▲":"▼"}</span>
              </div>
            </div>
            {expandedId===p.id&&(
              <div style={{borderTop:"1px solid #1a1814",padding:"14px 16px"}}>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                  {STATUS.map(s=>(
                    <button key={s} onClick={()=>updateStatus(p.id,s)} style={{padding:"4px 10px",borderRadius:3,border:`1px solid ${p.status===s?statusColor(s):"#3a3830"}`,background:p.status===s?statusColor(s)+"22":"#1a1814",color:p.status===s?statusColor(s):"#444",fontSize:10,fontFamily:"monospace",cursor:"pointer"}}>{s}</button>
                  ))}
                </div>
                {(p.updates||[]).length>0&&(
                  <div style={{marginBottom:12}}>
                    {(p.updates||[]).slice().reverse().map((u,i)=>(
                      <div key={i} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:"1px solid #1a1814"}}>
                        <span style={{fontSize:10,color:"#333",fontFamily:"monospace",minWidth:55,flexShrink:0}}>{fmtDate(u.date)}</span>
                        <span style={{fontSize:12,color:"#888"}}>{u.text}</span>
                        {u.fromSchedule&&<span style={{fontSize:9,color:"#2a2820",fontFamily:"monospace",marginLeft:"auto",flexShrink:0}}>auto</span>}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{display:"flex",gap:8}}>
                  <input placeholder="Add update..." value={updateText} onChange={e=>setUpdateText(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&addUpdate(p.id)}
                    style={{flex:1,background:"#1a1814",border:"1px solid #3a3830",color:"#f0ede8",padding:"8px 12px",borderRadius:4,fontSize:12,fontFamily:"monospace",outline:"none"}}/>
                  <button onClick={()=>addUpdate(p.id)} style={{background:col+"22",border:`1px solid ${col}44`,color:CATS.work.accent,padding:"8px 14px",borderRadius:4,fontSize:11,fontFamily:"monospace",cursor:"pointer"}}>Post</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!projects.length&&<div style={{textAlign:"center",color:"#444",fontSize:13,padding:"40px 0",fontFamily:"monospace"}}>No projects yet. ENJ and Les Éléphants notes auto-feed here.</div>}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// EXPORT TAB
// ══════════════════════════════════════════════════════════════
const ExportTab = ({ allData }) => {
  const { gymData, nutritionData, nzemaData, prestigeData, workData, checkins, blockChecks } = allData;

  const exportAll = (fmt) => {
    const bundle = { exportDate: todayStr(), gym: gymData, nutrition: nutritionData, nzema: nzemaData, prestige: prestigeData, work: workData, checkins, blockChecks };
    if (fmt==="json") downloadJSON(bundle, `tracker-export-${todayStr()}.json`);
    if (fmt==="csv") {
      // Export each as separate CSVs
      if ((gymData.sessions||[]).length) downloadCSV(gymData.sessions.map(s=>({date:s.date,type:s.type,notes:s.notes||"",fromSchedule:s.fromSchedule||false})), `gym-${todayStr()}.csv`);
      if ((nutritionData.log||[]).length) downloadCSV(nutritionData.log, `nutrition-${todayStr()}.csv`);
      if ((nzemaData.sessions||[]).length) downloadCSV(nzemaData.sessions.map(s=>({date:s.date,duration:s.duration,type:s.type||"Self-Study",notes:s.notes||""})), `nzema-${todayStr()}.csv`);
      if ((prestigeData.greSessions||[]).length) downloadCSV(prestigeData.greSessions, `gre-sessions-${todayStr()}.csv`);
    }
  };

  const totalGymSessions = (gymData.sessions||[]).length;
  const totalNutritionDays = (nutritionData.log||[]).length;
  const totalNzemaMins = (nzemaData.sessions||[]).reduce((a,s)=>a+s.duration,0);
  const totalGREMins = (prestigeData.greSessions||[]).reduce((a,s)=>a+s.duration,0);
  const totalMilestones = (prestigeData.milestones||[]).length;
  const completedMilestones = (prestigeData.milestones||[]).filter(m=>m.done).length;
  const totalProjects = (workData.projects||[]).length;

  return (
    <div>
      <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase",color:"#888",marginBottom:6}}>Export & Data</div>
      <div style={{fontSize:12,color:"#555",marginBottom:24}}>Download your data anytime. JSON for raw backup, CSV for Excel/Sheets.</div>

      {/* Summary stats */}
      <Card>
        <CardLabel>All-Time Summary</CardLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[
            ["Gym Sessions",     totalGymSessions,     CATS.gym.color],
            ["Nutrition Days",   totalNutritionDays,   CATS.nutrition.color],
            ["Nzema Minutes",    totalNzemaMins,        CATS.nzema.color],
            ["GRE Minutes",      totalGREMins,          CATS.prestige.color],
            ["Milestones Done",  `${completedMilestones}/${totalMilestones}`, CATS.prestige.color],
            ["Work Projects",    totalProjects,         CATS.work.color],
          ].map(([label,val,color])=>(
            <div key={label} style={{background:"#1a1814",borderRadius:4,padding:"12px",borderLeft:`3px solid ${color}`}}>
              <div style={{fontSize:18,fontWeight:"bold",color,fontFamily:"monospace"}}>{val}</div>
              <div style={{fontSize:10,color:"#555",fontFamily:"monospace",marginTop:3,letterSpacing:1,textTransform:"uppercase"}}>{label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Export buttons */}
      <Card>
        <CardLabel>Export All Data</CardLabel>
        <div style={{display:"flex",gap:10,marginBottom:20}}>
          <button onClick={()=>exportAll("json")} style={{flex:1,background:"#1B3A6B22",border:"1px solid #1B3A6B",color:"#7FA3D4",padding:"12px",borderRadius:4,fontSize:12,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>
            ↓ Export JSON
          </button>
          <button onClick={()=>exportAll("csv")} style={{flex:1,background:"#1A5C3A22",border:"1px solid #1A5C3A",color:"#6DBD95",padding:"12px",borderRadius:4,fontSize:12,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>
            ↓ Export CSV Files
          </button>
        </div>

        <div style={{borderTop:"1px solid #1a1814",paddingTop:16}}>
          <div style={{fontSize:10,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",color:"#555",marginBottom:12}}>Export by Tracker</div>
          <ExportRow label="Gym Sessions"     color={CATS.gym.color}       onJSON={()=>downloadJSON(gymData.sessions||[],"gym-sessions.json")}       onCSV={()=>downloadCSV((gymData.sessions||[]).map(s=>({date:s.date,type:s.type,notes:s.notes||""})),"gym-sessions.csv")}/>
          <ExportRow label="Nutrition Log"    color={CATS.nutrition.color} onJSON={()=>downloadJSON(nutritionData.log||[],"nutrition-log.json")}      onCSV={()=>downloadCSV(nutritionData.log||[],"nutrition-log.csv")}/>
          <ExportRow label="Nzema Sessions"   color={CATS.nzema.color}     onJSON={()=>downloadJSON(nzemaData.sessions||[],"nzema-sessions.json")}    onCSV={()=>downloadCSV((nzemaData.sessions||[]).map(s=>({date:s.date,duration:s.duration,type:s.type||"",notes:s.notes||""})),"nzema-sessions.csv")}/>
          <ExportRow label="GRE Sessions"     color={CATS.prestige.color}  onJSON={()=>downloadJSON(prestigeData.greSessions||[],"gre-sessions.json")} onCSV={()=>downloadCSV(prestigeData.greSessions||[],"gre-sessions.csv")}/>
          <ExportRow label="Milestones"       color={CATS.prestige.color}  onJSON={()=>downloadJSON(prestigeData.milestones||[],"milestones.json")}   onCSV={()=>downloadCSV((prestigeData.milestones||[]).map(m=>({title:m.title,category:m.category,done:m.done,doneDate:m.doneDate||"",target:m.target||""})),"milestones.csv")}/>
          <ExportRow label="Work Projects"    color={CATS.work.color}      onJSON={()=>downloadJSON(workData.projects||[],"work-projects.json")}      onCSV={()=>downloadCSV((workData.projects||[]).map(p=>({title:p.title,status:p.status,description:p.description||"",target:p.target||"",updates:(p.updates||[]).length})),"work-projects.csv")}/>
          <ExportRow label="Show-Up Checkins" color="#6DBD95"              onJSON={()=>downloadJSON(checkins,"checkins.json")}                        onCSV={()=>downloadCSV(Object.entries(checkins).map(([date,v])=>({date,showed:v})),"checkins.csv")}/>
        </div>
      </Card>

      <div style={{background:"#131210",border:"1px solid #2a2820",borderRadius:6,padding:16}}>
        <div style={{fontSize:10,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",color:"#555",marginBottom:8}}>About Your Data</div>
        <div style={{fontSize:12,color:"#444",lineHeight:1.7}}>
          All data is stored locally on this device. Export regularly to keep a backup. JSON format preserves all data including notes. CSV is best for monthly reviews in spreadsheets.
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("schedule");
  const [viewMode, setViewMode] = useState("day");
  const [month, setMonth] = useState(thisMonth());
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);

  // ── All tracker state
  const [checkins,      setCheckins]      = useState({});
  const [blockChecks,   setBlockChecks]   = useState({});
  const [prestigeData,  setPrestigeData]  = useState({milestones:[],greSessions:[]});
  const [gymData,       setGymData]       = useState({sessions:[]});
  const [nutritionData, setNutritionData] = useState({log:[],goals:CONFIG.nutritionGoals});
  const [nzemaData,     setNzemaData]     = useState({sessions:[],currentLevel:CONFIG.nzemaStartLevel,goals:[]});
  const [workData,      setWorkData]      = useState({projects:[]});

  useEffect(()=>{
    (async()=>{
      setCheckins(      await load("checkins",      {}));
      setBlockChecks(   await load("blockChecks",   {}));
      setPrestigeData(  await load("prestige",      {milestones:[],greSessions:[]}));
      setGymData(       await load("gym",           {sessions:[]}));
      setNutritionData( await load("nutrition",     {log:[],goals:CONFIG.nutritionGoals}));
      setNzemaData(     await load("nzema",         {sessions:[],currentLevel:CONFIG.nzemaStartLevel,goals:[]}));
      setWorkData(      await load("work",          {projects:[]}));
      setLoaded(true);
    })();
  },[]);

  const showToast = useCallback((msg)=>{ setToast(msg); setTimeout(()=>setToast(null),2500); },[]);

  // ── The central block-check handler — routes to correct tracker
  const handleBlockCheck = useCallback((key, block, dateStr, note, uncheck)=>{
    const newBC = {...blockChecks};
    if (uncheck) { delete newBC[key]; }
    else { newBC[key]={date:dateStr,note,ts:Date.now()}; }
    setBlockChecks(newBC); save("blockChecks",newBC);

    if (uncheck) { showToast("Block unchecked"); return; }

    // Log show-up for any checked block
    if (!checkins[dateStr]) {
      const nc={...checkins,[dateStr]:true}; setCheckins(nc); save("checkins",nc);
    }

    // Route to specific tracker
    if (block.action==="gym-note") {
      const s={id:Date.now(),date:dateStr,type:block.gymSplit||"Swim",notes:note||"",fromSchedule:true};
      const u={...gymData,sessions:[...(gymData.sessions||[]),s]};
      setGymData(u); save("gym",u);
      showToast(`✓ ${block.gymSplit||"Session"} logged`);
    }
    else if (block.action==="gre-session") {
      const s={id:Date.now(),date:dateStr,duration:block.duration||90};
      const u={...prestigeData,greSessions:[...(prestigeData.greSessions||[]),s]};
      setPrestigeData(u); save("prestige",u);
      showToast(`✓ GRE ${block.duration}min logged`);
    }
    else if (block.action==="nzema-self"||block.action==="nzema-class") {
      const s={id:Date.now(),date:dateStr,duration:block.duration||20,type:block.action==="nzema-class"?"Class":"Self-Study",notes:"",fromSchedule:true};
      const u={...nzemaData,sessions:[...(nzemaData.sessions||[]),s]};
      setNzemaData(u); save("nzema",u);
      showToast(`✓ Nzema ${block.action==="nzema-class"?"class":"study"} logged`);
    }
    else if (block.action==="project-note") {
      const projects=workData.projects||[];
      const existing=projects.find(p=>p.title===block.project);
      if (existing) {
        const newNote={text:note||"Session logged",date:dateStr,fromSchedule:true};
        const ps=projects.map(p=>p.id===existing.id?{...p,updates:[...(p.updates||[]),newNote]}:p);
        const u={...workData,projects:ps}; setWorkData(u); save("work",u);
        showToast(`✓ Note added to ${block.project}`);
      } else {
        const np={id:Date.now(),title:block.project,description:"",status:"In Progress",target:"",updates:[{text:note||"Session logged",date:dateStr,fromSchedule:true}],createdDate:dateStr};
        const u={...workData,projects:[...projects,np]}; setWorkData(u); save("work",u);
        showToast(`✓ ${block.project} created + note added`);
      }
    }
    else {
      showToast("✓ Logged");
    }
  },[blockChecks,checkins,gymData,prestigeData,nzemaData,workData,showToast]);

  const handleCheckin = useCallback((dk)=>{
    const was=checkins[dk];
    const u={...checkins,[dk]:!was}; setCheckins(u); save("checkins",u);
    if(!was) showToast("✓ Logged. Keep going.");
  },[checkins,showToast]);

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  ✏️  TABS — To rename a tab change the `label` field.       ║
  // ╚══════════════════════════════════════════════════════════════╝
  const TABS = [
    {id:"schedule",  label:"Schedule"},
    {id:"dashboard", label:"Home"},
    {id:"prestige",  label:"Prestige"},
    {id:"work",      label:"Work"},
    {id:"gym",       label:"Gym"},
    {id:"nutrition", label:"Nutrition"},
    {id:"nzema",     label:"Nzema"},
    {id:"export",    label:"Export"},
  ];

  if (!loaded) return (
    <div style={{background:"#0F0E0C",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{color:"#333",fontFamily:"monospace",letterSpacing:3,fontSize:11,textTransform:"uppercase"}}>Loading...</span>
    </div>
  );

  return (
    <div style={{background:"#0F0E0C",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",maxWidth:600,margin:"0 auto"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>

      {/* ── HEADER */}
      <div style={{padding:"24px 24px 0",borderBottom:"1px solid #1a1814",position:"sticky",top:0,background:"#0F0E0C",zIndex:100}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:18}}>
          <div>
            {/* ✏️ To rename the app change CONFIG.appName at the top of this file */}
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:"#f0ede8",letterSpacing:-0.5,lineHeight:1}}>{CONFIG.appName}</div>
            <div style={{fontSize:10,color:"#333",fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase",marginTop:3}}>{CONFIG.appTagline}</div>
          </div>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            <button onClick={()=>{const[y,m]=month.split("-");const d=new Date(+y,+m-2);setMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);}}
              style={{background:"transparent",border:"1px solid #1a1814",color:"#444",width:24,height:24,borderRadius:"50%",cursor:"pointer",fontSize:11}}>‹</button>
            <span style={{fontFamily:"monospace",fontSize:10,color:"#555",minWidth:56,textAlign:"center"}}>{fmtMonth(month)}</span>
            <button onClick={()=>{const[y,m]=month.split("-");const d=new Date(+y,+m);setMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);}}
              style={{background:"transparent",border:"1px solid #1a1814",color:"#444",width:24,height:24,borderRadius:"50%",cursor:"pointer",fontSize:11}}>›</button>
          </div>
        </div>

        {/* Scrollable tab bar */}
        <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none",msOverflowStyle:"none"}}>
          {TABS.map(t=>{
            const col=CATS[t.id]?.color||"#f0ede8";
            return (
              <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 13px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===t.id?col:"transparent"}`,color:tab===t.id?col:"#333",fontSize:10,fontFamily:"monospace",cursor:"pointer",letterSpacing:1,textTransform:"uppercase",whiteSpace:"nowrap",transition:"all 0.2s"}}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT */}
      <div style={{padding:"24px 24px 80px"}}>
        {tab==="schedule"  && <ScheduleTab blockChecks={blockChecks} onBlockCheck={handleBlockCheck} viewMode={viewMode} setViewMode={setViewMode}/>}
        {tab==="dashboard" && <Dashboard checkins={checkins} onCheckin={handleCheckin} month={month} blockChecks={blockChecks}/>}
        {tab==="prestige"  && <PrestigeTracker data={prestigeData} setData={setPrestigeData}/>}
        {tab==="work"      && <WorkTracker data={workData} setData={setWorkData}/>}
        {tab==="gym"       && <GymTracker data={gymData} setData={setGymData}/>}
        {tab==="nutrition" && <NutritionTracker data={nutritionData} setData={setNutritionData}/>}
        {tab==="nzema"     && <NzemaTracker data={nzemaData} setData={setNzemaData}/>}
        {tab==="export"    && <ExportTab allData={{gymData,nutritionData,nzemaData,prestigeData,workData,checkins,blockChecks}}/>}
      </div>

      {/* ── TOAST */}
      {toast && (
        <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"#0f1a0f",border:"1px solid #6DBD95",color:"#6DBD95",padding:"10px 24px",borderRadius:4,fontFamily:"monospace",fontSize:12,letterSpacing:1,boxShadow:"0 4px 24px #000000cc",zIndex:999,whiteSpace:"nowrap"}}>
          {toast}
        </div>
      )}
    </div>
  );
}
