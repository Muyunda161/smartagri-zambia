import { useState, useRef, useEffect } from "react";

const CROPS = [
  { name: "Maize", icon: "🌽", season: "Nov–Apr", water: "High", status: "In Season" },
  { name: "Groundnuts", icon: "🥜", season: "Dec–Mar", water: "Medium", status: "In Season" },
  { name: "Beans", icon: "🫘", season: "Nov–Feb", water: "Low", status: "Planting Soon" },
  { name: "Sorghum", icon: "🌾", season: "Nov–Mar", water: "Low", status: "Planting Soon" },
  { name: "Cassava", icon: "🍠", season: "Oct–May", water: "Low", status: "In Season" },
  { name: "Sunflower", icon: "🌻", season: "Jan–May", water: "Medium", status: "Harvest Soon" },
];

const WEATHER_DATA = [
  { day: "Today", icon: "⛅", high: 28, low: 18, rain: 40, desc: "Partly Cloudy" },
  { day: "Thu", icon: "🌧️", high: 24, low: 17, rain: 80, desc: "Heavy Rain" },
  { day: "Fri", icon: "🌦️", high: 26, low: 18, rain: 55, desc: "Light Showers" },
  { day: "Sat", icon: "☀️", high: 31, low: 19, rain: 10, desc: "Sunny" },
  { day: "Sun", icon: "☀️", high: 33, low: 20, rain: 5, desc: "Clear & Hot" },
  { day: "Mon", icon: "⛅", high: 29, low: 18, rain: 25, desc: "Partly Cloudy" },
  { day: "Tue", icon: "🌩️", high: 25, low: 17, rain: 70, desc: "Thunderstorm" },
];

const RECOMMENDATIONS = [
  {
    priority: "urgent",
    icon: "💧",
    title: "Irrigate Maize Fields",
    detail: "Soil moisture is low. Rain expected Thursday — consider light irrigation today to bridge the gap.",
    crop: "Maize",
    action: "Act Today",
  },
  {
    priority: "info",
    icon: "🌱",
    title: "Optimal Planting Window",
    detail: "Conditions are ideal for bean planting this weekend after Saturday's dry spell.",
    crop: "Beans",
    action: "Plan for Sat",
  },
  {
    priority: "warning",
    icon: "⚠️",
    title: "Storm Alert – Protect Seedlings",
    detail: "Tuesday's thunderstorm could damage young maize seedlings. Consider mulching or windbreaks.",
    crop: "Maize",
    action: "Prepare Now",
  },
  {
    priority: "info",
    icon: "🧪",
    title: "Fertilizer Timing",
    detail: "Apply top dressing fertilizer 3 days after Thursday's expected rain for best absorption.",
    crop: "Groundnuts",
    action: "Plan for Sun",
  },
];

const CALENDAR = [
  { month: "Oct", tasks: ["Land Prep", "Soil Testing"] },
  { month: "Nov", tasks: ["Planting Maize", "Planting Beans"] },
  { month: "Dec", tasks: ["Weed Control", "Fertilizer 1st"] },
  { month: "Jan", tasks: ["Pest Scouting", "Irrigation"] },
  { month: "Feb", tasks: ["Fertilizer 2nd", "Groundnut Plant"] },
  { month: "Mar", tasks: ["Harvest Beans", "Monitor Maize"] },
  { month: "Apr", tasks: ["Maize Harvest", "Post-harvest Storage"] },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --soil: #3d2b1f;
    --bark: #5c3d2e;
    --clay: #8b5e3c;
    --sand: #c9a87c;
    --wheat: #e8d5b0;
    --cream: #faf6ee;
    --leaf: #4a7c59;
    --moss: #6b8f5e;
    --sprout: #8fbf6a;
    --sky: #6fa8c4;
    --rain: #4a7fa8;
    --sun: #e8a830;
    --danger: #c0392b;
    --warn: #d4800a;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--soil); }

  .app {
    max-width: 420px;
    margin: 0 auto;
    min-height: 100vh;
    background: var(--cream);
    position: relative;
    overflow: hidden;
  }

  /* NAV */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 420px;
    background: var(--soil);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px 0 14px;
    z-index: 100;
    border-top: 2px solid var(--bark);
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    cursor: pointer;
    padding: 4px 16px;
    border-radius: 12px;
    transition: all 0.2s;
    background: none;
    border: none;
    color: var(--sand);
  }

  .nav-item.active { color: var(--sprout); }
  .nav-item:hover { color: var(--wheat); }
  .nav-item .nav-icon { font-size: 20px; }
  .nav-item .nav-label { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }

  /* SCREENS */
  .screen { padding: 0 0 90px 0; animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  /* HEADER */
  .hero-header {
    background: linear-gradient(160deg, var(--soil) 0%, var(--bark) 60%, var(--clay) 100%);
    padding: 48px 20px 28px;
    position: relative;
    overflow: hidden;
  }

  .hero-header::before {
    content: '';
    position: absolute;
    top: -30px; right: -40px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(143,191,106,0.15) 0%, transparent 70%);
    border-radius: 50%;
  }

  .hero-header::after {
    content: '🌿';
    position: absolute;
    bottom: -10px; right: 16px;
    font-size: 80px;
    opacity: 0.12;
  }

  .header-loc {
    font-size: 12px;
    color: var(--sand);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .header-greeting {
    font-family: 'Fraunces', serif;
    font-size: 26px;
    color: var(--cream);
    font-weight: 300;
    line-height: 1.2;
    margin-bottom: 16px;
  }

  .header-greeting span { color: var(--sprout); font-style: italic; }

  .weather-widget {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    backdrop-filter: blur(8px);
  }

  .weather-main { display: flex; align-items: center; gap: 12px; }
  .weather-icon-big { font-size: 36px; }
  .weather-temp { font-family: 'Fraunces', serif; font-size: 32px; color: white; font-weight: 300; }
  .weather-desc { font-size: 12px; color: var(--sand); margin-top: 2px; }
  .weather-meta { text-align: right; }
  .weather-meta-item { font-size: 11px; color: var(--wheat); margin-bottom: 2px; }
  .weather-meta-item span { color: var(--sprout); font-weight: 600; }

  /* SECTION */
  .section { padding: 20px 20px 0; }
  .section-title {
    font-family: 'Fraunces', serif;
    font-size: 18px;
    color: var(--soil);
    font-weight: 500;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--sand), transparent);
  }

  /* ALERT BANNER */
  .alert-banner {
    margin: 16px 20px 0;
    background: linear-gradient(135deg, #7d3c1a, #a0522d);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-left: 4px solid var(--sun);
  }

  .alert-text { flex: 1; }
  .alert-title { font-size: 13px; font-weight: 600; color: var(--wheat); }
  .alert-sub { font-size: 11px; color: var(--sand); margin-top: 2px; }

  /* STAT CARDS */
  .stat-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .stat-card {
    background: white;
    border-radius: 14px;
    padding: 14px;
    border: 1px solid #ede5d8;
    position: relative;
    overflow: hidden;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
  }

  .stat-card.green::before { background: linear-gradient(90deg, var(--leaf), var(--sprout)); }
  .stat-card.blue::before { background: linear-gradient(90deg, var(--rain), var(--sky)); }
  .stat-card.amber::before { background: linear-gradient(90deg, var(--warn), var(--sun)); }
  .stat-card.red::before { background: linear-gradient(90deg, var(--danger), #e74c3c); }

  .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--clay); margin-bottom: 6px; }
  .stat-value { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 500; color: var(--soil); }
  .stat-unit { font-size: 12px; color: var(--clay); }
  .stat-icon { position: absolute; bottom: 10px; right: 12px; font-size: 24px; opacity: 0.2; }

  /* RECOMMENDATION CARDS */
  .rec-card {
    background: white;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 10px;
    border: 1px solid #ede5d8;
    display: flex;
    gap: 12px;
    position: relative;
    overflow: hidden;
  }

  .rec-card.urgent { border-left: 4px solid var(--danger); }
  .rec-card.warning { border-left: 4px solid var(--warn); }
  .rec-card.info { border-left: 4px solid var(--leaf); }

  .rec-icon { font-size: 28px; flex-shrink: 0; }
  .rec-body { flex: 1; }
  .rec-title { font-size: 14px; font-weight: 600; color: var(--soil); margin-bottom: 4px; }
  .rec-detail { font-size: 12px; color: var(--clay); line-height: 1.5; margin-bottom: 8px; }
  .rec-footer { display: flex; align-items: center; justify-content: space-between; }
  .rec-crop { font-size: 11px; background: var(--wheat); color: var(--bark); padding: 2px 8px; border-radius: 20px; font-weight: 500; }
  .rec-action {
    font-size: 11px; font-weight: 600; color: var(--leaf);
    background: none; border: none; cursor: pointer; padding: 0;
  }

  /* WEATHER SCREEN */
  .weather-screen-header {
    background: linear-gradient(160deg, var(--rain) 0%, var(--sky) 100%);
    padding: 48px 20px 28px;
  }

  .weather-screen-header h1 {
    font-family: 'Fraunces', serif;
    font-size: 28px;
    color: white;
    font-weight: 300;
    margin-bottom: 4px;
  }

  .weather-screen-header p { font-size: 13px; color: rgba(255,255,255,0.75); }

  .today-weather-card {
    background: white;
    border-radius: 20px;
    padding: 24px 20px;
    margin: -16px 20px 0;
    box-shadow: 0 8px 32px rgba(61,43,31,0.12);
    text-align: center;
  }

  .today-big-icon { font-size: 64px; margin-bottom: 8px; }
  .today-temp-big { font-family: 'Fraunces', serif; font-size: 56px; color: var(--soil); font-weight: 300; }
  .today-desc { font-size: 16px; color: var(--clay); margin-bottom: 16px; }
  .today-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
  .today-stat { background: var(--cream); border-radius: 12px; padding: 10px 8px; }
  .today-stat-val { font-size: 16px; font-weight: 600; color: var(--soil); }
  .today-stat-label { font-size: 10px; color: var(--clay); text-transform: uppercase; letter-spacing: 0.5px; }

  /* FORECAST ROW */
  .forecast-scroll { display: flex; gap: 10px; overflow-x: auto; padding: 0 20px; padding-bottom: 4px; scrollbar-width: none; }
  .forecast-scroll::-webkit-scrollbar { display: none; }

  .forecast-card {
    flex-shrink: 0;
    background: white;
    border-radius: 14px;
    padding: 14px 12px;
    text-align: center;
    border: 1px solid #ede5d8;
    min-width: 76px;
  }

  .forecast-card.today-fc { background: var(--leaf); border-color: var(--leaf); }
  .forecast-card.today-fc .fc-day, .forecast-card.today-fc .fc-high, .forecast-card.today-fc .fc-low { color: white; }
  .forecast-card.today-fc .fc-rain { color: rgba(255,255,255,0.8); }

  .fc-day { font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--clay); letter-spacing: 0.5px; margin-bottom: 6px; }
  .fc-icon { font-size: 24px; margin-bottom: 6px; }
  .fc-high { font-size: 15px; font-weight: 600; color: var(--soil); }
  .fc-low { font-size: 12px; color: var(--clay); }
  .fc-rain { font-size: 10px; color: var(--rain); margin-top: 4px; }

  /* RAIN PROBABILITY BAR */
  .rain-section { margin: 0 20px; }
  .rain-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .rain-day { font-size: 12px; color: var(--clay); width: 32px; flex-shrink: 0; }
  .rain-bar-bg { flex: 1; height: 8px; background: #ede5d8; border-radius: 4px; overflow: hidden; }
  .rain-bar { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--rain), var(--sky)); transition: width 0.6s ease; }
  .rain-pct { font-size: 11px; color: var(--rain); font-weight: 600; width: 30px; text-align: right; flex-shrink: 0; }

  /* CROPS SCREEN */
  .crops-header {
    background: linear-gradient(160deg, var(--leaf) 0%, var(--moss) 100%);
    padding: 48px 20px 28px;
  }

  .crops-header h1 { font-family: 'Fraunces', serif; font-size: 28px; color: white; font-weight: 300; }
  .crops-header p { font-size: 13px; color: rgba(255,255,255,0.75); margin-top: 4px; }

  .crop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .crop-card {
    background: white;
    border-radius: 16px;
    padding: 16px;
    border: 1px solid #ede5d8;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .crop-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(61,43,31,0.1); }
  .crop-emoji { font-size: 32px; margin-bottom: 8px; }
  .crop-name { font-size: 14px; font-weight: 600; color: var(--soil); }
  .crop-season { font-size: 11px; color: var(--clay); margin-top: 2px; }

  .crop-status {
    display: inline-block;
    margin-top: 8px;
    font-size: 10px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-season { background: #e6f4eb; color: var(--leaf); }
  .status-soon { background: #fff3dc; color: var(--warn); }
  .status-harvest { background: #fde8e8; color: var(--danger); }

  .water-dots { display: flex; gap: 3px; margin-top: 8px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: #ede5d8; }
  .dot.filled { background: var(--sky); }

  /* CALENDAR STRIP */
  .cal-scroll { display: flex; gap: 10px; overflow-x: auto; padding: 0 20px 4px; scrollbar-width: none; }
  .cal-scroll::-webkit-scrollbar { display: none; }

  .cal-month {
    flex-shrink: 0;
    background: white;
    border-radius: 14px;
    padding: 14px;
    border: 1px solid #ede5d8;
    min-width: 110px;
  }

  .cal-month-name { font-size: 12px; font-weight: 700; color: var(--bark); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
  .cal-task { font-size: 11px; color: var(--clay); padding: 3px 0; border-bottom: 1px solid #f0e9dd; }
  .cal-task:last-child { border-bottom: none; }

  /* AI ADVISOR SCREEN */
  .advisor-header {
    background: linear-gradient(160deg, var(--soil) 0%, #6b4226 100%);
    padding: 48px 20px 22px;
  }

  .advisor-header h1 { font-family: 'Fraunces', serif; font-size: 26px; color: white; font-weight: 300; }
  .advisor-header p { font-size: 13px; color: var(--sand); margin-top: 4px; }

  .chat-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 220px);
    padding: 16px 20px 0;
  }

  .messages-area { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-bottom: 12px; scrollbar-width: none; }
  .messages-area::-webkit-scrollbar { display: none; }

  .msg { max-width: 85%; display: flex; flex-direction: column; gap: 4px; }
  .msg.user { align-self: flex-end; align-items: flex-end; }
  .msg.ai { align-self: flex-start; align-items: flex-start; }

  .msg-bubble {
    padding: 12px 14px;
    border-radius: 16px;
    font-size: 13px;
    line-height: 1.5;
  }

  .msg.user .msg-bubble { background: var(--leaf); color: white; border-bottom-right-radius: 4px; }
  .msg.ai .msg-bubble { background: white; color: var(--soil); border: 1px solid #ede5d8; border-bottom-left-radius: 4px; }
  .msg-time { font-size: 10px; color: var(--clay); padding: 0 4px; }

  .ai-avatar { width: 28px; height: 28px; background: var(--soil); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; margin-bottom: 4px; }

  .chat-input-area {
    background: white;
    border: 1px solid #ede5d8;
    border-radius: 20px;
    display: flex;
    align-items: center;
    padding: 8px 8px 8px 16px;
    gap: 8px;
    margin-bottom: 4px;
  }

  .chat-input {
    flex: 1;
    border: none;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    background: transparent;
    color: var(--soil);
  }

  .chat-input::placeholder { color: var(--sand); }

  .send-btn {
    width: 36px; height: 36px;
    background: var(--leaf);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.2s;
    flex-shrink: 0;
  }

  .send-btn:hover { background: var(--moss); }
  .send-btn:disabled { background: var(--sand); cursor: not-allowed; }

  .suggestion-chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; margin-top: 8px; }
  .suggestion-chips::-webkit-scrollbar { display: none; }

  .chip {
    flex-shrink: 0;
    background: var(--wheat);
    border: none;
    border-radius: 20px;
    padding: 6px 12px;
    font-size: 11px;
    color: var(--bark);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    transition: background 0.2s;
  }

  .chip:hover { background: var(--sand); }

  .typing-indicator { display: flex; gap: 4px; align-items: center; padding: 12px 14px; background: white; border: 1px solid #ede5d8; border-radius: 16px; border-bottom-left-radius: 4px; width: fit-content; }
  .typing-dot { width: 6px; height: 6px; background: var(--sand); border-radius: 50%; animation: bounce 1.2s infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
`;

const SUGGESTIONS = [
  "When should I plant maize?",
  "Is it safe to irrigate today?",
  "How do I protect from drought?",
  "Best fertilizer for beans?",
  "Pest control for groundnuts",
];

const INITIAL_MESSAGES = [
  {
    role: "ai",
    text: "🌱 Hello! I'm your SmartAgri advisor. I can help you with planting decisions, irrigation timing, pest control, fertilizer advice, and more — tailored for Zambian conditions.\n\nWhat would you like to know today?",
    time: "Now",
  },
];

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function askAdvisor(messages, userMessage) {
  const systemPrompt = `You are SmartAgri, an expert AI agricultural advisor specializing in Zambian farming conditions. You help small-scale and commercial farmers in Zambia with:
- Crop recommendations (maize, groundnuts, beans, sorghum, cassava, sunflower)
- Weather-based planting and irrigation advice
- Fertilizer timing and pest control
- Seasonal farming calendars
- Climate resilience strategies

Context: Current season is November (start of rainy season in Zambia). Recent weather shows rain expected Thursday with 80% probability. Today is partly cloudy, 28°C.

Be warm, practical, and concise. Use bullet points for lists. Give specific, actionable advice. Always consider local Zambian context — low-resource farmers, local crop varieties, typical rainfall patterns in Lusaka/Central/Southern provinces. Keep responses under 200 words.`;

  const history = messages
    .filter((m) => m.role !== "ai" || m !== INITIAL_MESSAGES[0])
    .map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));

  history.push({ role: "user", content: userMessage });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: history,
    }),
  });

  const data = await response.json();
  return data.content?.map((b) => b.text || "").join("") || "Sorry, I couldn't get a response. Please try again.";
}

// ─── SCREENS ────────────────────────────────────────────────────────────────

function Dashboard({ setTab }) {
  return (
    <div className="screen">
      <div className="hero-header">
        <div className="header-loc">📍 Lusaka, Zambia</div>
        <div className="header-greeting">
          Good morning,<br /><span>Farmer</span> 🌄
        </div>
        <div className="weather-widget">
          <div className="weather-main">
            <div className="weather-icon-big">⛅</div>
            <div>
              <div className="weather-temp">28°C</div>
              <div className="weather-desc">Partly Cloudy</div>
            </div>
          </div>
          <div className="weather-meta">
            <div className="weather-meta-item">Rain: <span>40%</span></div>
            <div className="weather-meta-item">Humidity: <span>68%</span></div>
            <div className="weather-meta-item">Wind: <span>12 km/h</span></div>
          </div>
        </div>
      </div>

      <div className="alert-banner">
        <span style={{ fontSize: 24 }}>🌧️</span>
        <div className="alert-text">
          <div className="alert-title">Heavy Rain Expected Thursday</div>
          <div className="alert-sub">80% probability — prepare your fields today</div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">🌿 Farm Overview</div>
        <div className="stat-row">
          <div className="stat-card green">
            <div className="stat-label">Season Status</div>
            <div className="stat-value" style={{ fontSize: 16, marginTop: 4 }}>Rainy</div>
            <div className="stat-unit">Nov – Apr</div>
            <div className="stat-icon">🌱</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-label">Rainfall This Month</div>
            <div className="stat-value">142<span className="stat-unit"> mm</span></div>
            <div className="stat-icon">💧</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-label">Soil Temp</div>
            <div className="stat-value">22<span className="stat-unit">°C</span></div>
            <div className="stat-icon">🌡️</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Active Crops</div>
            <div className="stat-value">3</div>
            <div className="stat-unit">Maize, Beans, G/nuts</div>
            <div className="stat-icon">🌽</div>
          </div>
        </div>
      </div>

      <div className="section" style={{ marginTop: 20 }}>
        <div className="section-title">📋 Today's Recommendations</div>
        {RECOMMENDATIONS.slice(0, 2).map((r, i) => (
          <div key={i} className={`rec-card ${r.priority}`}>
            <div className="rec-icon">{r.icon}</div>
            <div className="rec-body">
              <div className="rec-title">{r.title}</div>
              <div className="rec-detail">{r.detail}</div>
              <div className="rec-footer">
                <span className="rec-crop">{r.crop}</span>
                <button className="rec-action" onClick={() => setTab("advisor")}>Ask AI Advisor →</button>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => setTab("recs")}
          style={{ width: "100%", background: "none", border: "1px solid #ede5d8", borderRadius: 12, padding: "10px", fontSize: 13, color: "var(--clay)", cursor: "pointer", marginTop: 4, fontFamily: "DM Sans, sans-serif" }}
        >
          View all recommendations →
        </button>
      </div>

      <div style={{ height: 10 }} />
    </div>
  );
}

function WeatherScreen() {
  return (
    <div className="screen">
      <div className="weather-screen-header">
        <h1>Weather Forecast</h1>
        <p>📍 Lusaka, Zambia · Updated just now</p>
      </div>

      <div className="section" style={{ marginTop: 20 }}>
        <div className="today-weather-card">
          <div className="today-big-icon">⛅</div>
          <div className="today-temp-big">28°C</div>
          <div className="today-desc">Partly Cloudy — Mild breeze</div>
          <div className="today-stats">
            <div className="today-stat">
              <div className="today-stat-val">💧 40%</div>
              <div className="today-stat-label">Rain Chance</div>
            </div>
            <div className="today-stat">
              <div className="today-stat-val">68%</div>
              <div className="today-stat-label">Humidity</div>
            </div>
            <div className="today-stat">
              <div className="today-stat-val">12km/h</div>
              <div className="today-stat-label">Wind</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section" style={{ marginTop: 20, paddingLeft: 0, paddingRight: 0 }}>
        <div className="section-title" style={{ paddingLeft: 20, paddingRight: 20 }}>📅 7-Day Forecast</div>
        <div className="forecast-scroll">
          {WEATHER_DATA.map((d, i) => (
            <div key={i} className={`forecast-card ${i === 0 ? "today-fc" : ""}`}>
              <div className="fc-day">{d.day}</div>
              <div className="fc-icon">{d.icon}</div>
              <div className="fc-high">{d.high}°</div>
              <div className="fc-low">{d.low}°</div>
              <div className="fc-rain">💧{d.rain}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section" style={{ marginTop: 20 }}>
        <div className="section-title">🌧️ Rain Probability</div>
        <div className="rain-section">
          {WEATHER_DATA.map((d, i) => (
            <div key={i} className="rain-row">
              <div className="rain-day">{d.day}</div>
              <div className="rain-bar-bg">
                <div className="rain-bar" style={{ width: `${d.rain}%` }} />
              </div>
              <div className="rain-pct">{d.rain}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section" style={{ marginTop: 20 }}>
        <div className="section-title">⚡ Weather Alerts</div>
        <div className="rec-card warning">
          <div className="rec-icon">🌩️</div>
          <div className="rec-body">
            <div className="rec-title">Thunderstorm — Tuesday</div>
            <div className="rec-detail">Strong winds and lightning expected. Secure any loose farm structures and protect young seedlings.</div>
          </div>
        </div>
        <div className="rec-card info">
          <div className="rec-icon">🌧️</div>
          <div className="rec-body">
            <div className="rec-title">Heavy Rain — Thursday</div>
            <div className="rec-detail">80% rain probability. Good opportunity to skip irrigation and let nature water your fields.</div>
          </div>
        </div>
      </div>

      <div style={{ height: 10 }} />
    </div>
  );
}

function CropsScreen() {
  const [selected, setSelected] = useState(null);
  const waterDots = { High: 3, Medium: 2, Low: 1 };

  return (
    <div className="screen">
      <div className="crops-header">
        <h1>My Crops</h1>
        <p>Zambia · Rainy Season 2025/26</p>
      </div>

      <div className="section" style={{ marginTop: 20 }}>
        <div className="section-title">🌾 Seasonal Crops</div>
        <div className="crop-grid">
          {CROPS.map((c, i) => (
            <div key={i} className="crop-card" onClick={() => setSelected(selected === i ? null : i)}>
              <div className="crop-emoji">{c.icon}</div>
              <div className="crop-name">{c.name}</div>
              <div className="crop-season">📅 {c.season}</div>
              <div className="water-dots">
                {[1, 2, 3].map((n) => (
                  <div key={n} className={`dot ${n <= waterDots[c.water] ? "filled" : ""}`} />
                ))}
                <span style={{ fontSize: 9, color: "var(--clay)", marginLeft: 4 }}>Water</span>
              </div>
              <div>
                <span className={`crop-status ${c.status === "In Season" ? "status-season" : c.status === "Planting Soon" ? "status-soon" : "status-harvest"}`}>
                  {c.status}
                </span>
              </div>
              {selected === i && (
                <div style={{ marginTop: 10, fontSize: 11, color: "var(--clay)", borderTop: "1px solid #ede5d8", paddingTop: 8, lineHeight: 1.6 }}>
                  💡 <strong>Tip:</strong> Apply basal fertilizer at planting. Scout for pests weekly. Ensure proper spacing for good yield.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="section" style={{ marginTop: 24, paddingLeft: 0, paddingRight: 0 }}>
        <div className="section-title" style={{ paddingLeft: 20, paddingRight: 20 }}>📆 Farming Calendar</div>
        <div className="cal-scroll">
          {CALENDAR.map((m, i) => (
            <div key={i} className="cal-month" style={{ background: i === 1 ? "var(--leaf)" : undefined, borderColor: i === 1 ? "var(--leaf)" : undefined }}>
              <div className="cal-month-name" style={{ color: i === 1 ? "rgba(255,255,255,0.9)" : undefined }}>{m.month}</div>
              {m.tasks.map((t, j) => (
                <div key={j} className="cal-task" style={{ color: i === 1 ? "rgba(255,255,255,0.8)" : undefined, borderColor: i === 1 ? "rgba(255,255,255,0.2)" : undefined }}>
                  {t}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 10 }} />
    </div>
  );
}

function RecsScreen() {
  return (
    <div className="screen">
      <div style={{ background: "linear-gradient(160deg, var(--clay) 0%, var(--sand) 100%)", padding: "48px 20px 28px" }}>
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 28, color: "white", fontWeight: 300 }}>Recommendations</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>AI-powered, updated daily</p>
      </div>

      <div className="section" style={{ marginTop: 20 }}>
        <div className="section-title">🚨 Priority Actions</div>
        {RECOMMENDATIONS.map((r, i) => (
          <div key={i} className={`rec-card ${r.priority}`}>
            <div className="rec-icon">{r.icon}</div>
            <div className="rec-body">
              <div className="rec-title">{r.title}</div>
              <div className="rec-detail">{r.detail}</div>
              <div className="rec-footer">
                <span className="rec-crop">{r.crop}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: r.priority === "urgent" ? "var(--danger)" : r.priority === "warning" ? "var(--warn)" : "var(--leaf)" }}>
                  {r.action}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 10 }} />
    </div>
  );
}

function AdvisorScreen() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", text: text.trim(), time: formatTime() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await askAdvisor(messages, text.trim());
      setMessages([...newMessages, { role: "ai", text: reply, time: formatTime() }]);
    } catch {
      setMessages([...newMessages, { role: "ai", text: "⚠️ Unable to connect. Please check your internet connection and try again.", time: formatTime() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen" style={{ paddingBottom: 0 }}>
      <div className="advisor-header">
        <h1>🤖 AI Farm Advisor</h1>
        <p>Powered by Claude · Zambia-specific knowledge</p>
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.role === "ai" && <div className="ai-avatar">🌱</div>}
              <div className="msg-bubble" style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
              <div className="msg-time">{m.time}</div>
            </div>
          ))}
          {loading && (
            <div className="msg ai">
              <div className="ai-avatar">🌱</div>
              <div className="typing-indicator">
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="suggestion-chips">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className="chip" onClick={() => sendMessage(s)}>{s}</button>
          ))}
        </div>

        <div className="chat-input-area">
          <input
            className="chat-input"
            placeholder="Ask about your crops, weather, soil..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            disabled={loading}
          />
          <button className="send-btn" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "home", icon: "🏡", label: "Home" },
  { id: "weather", icon: "🌤️", label: "Weather" },
  { id: "crops", icon: "🌾", label: "Crops" },
  { id: "recs", icon: "📋", label: "Tips" },
  { id: "advisor", icon: "🤖", label: "Advisor" },
];

export default function SmartAgriApp() {
  const [tab, setTab] = useState("home");

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {tab === "home" && <Dashboard setTab={setTab} />}
        {tab === "weather" && <WeatherScreen />}
        {tab === "crops" && <CropsScreen />}
        {tab === "recs" && <RecsScreen />}
        {tab === "advisor" && <AdvisorScreen />}

        <nav className="bottom-nav">
          {TABS.map((t) => (
            <button key={t.id} className={`nav-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              <span className="nav-icon">{t.icon}</span>
              <span className="nav-label">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
