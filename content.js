// content.js

// استبدل الرابط أدناه بالرابط Raw لملف rules.json الخاص بك على GitHub
const RULES_URL = "https://raw.githubusercontent.com/USERNAME/REPO/main/rules.json";

async function loadRules() {
  try {
    const res = await fetch(RULES_URL);
    if (!res.ok) throw new Error("Failed to fetch rules.json");
    const data = await res.json();
    return data.rules || [];
  } catch (e) {
    console.error("Error loading rules:", e);
    return [];
  }
}

function scanPage(rules) {
  const text = document.body.innerText;

  rules.forEach(rule => {
    if (!rule.regex) return;
    try {
      const regex = new RegExp(rule.regex, "g");
      const matches = text.match(regex);
      if (matches && matches.length > 0) {
        console.log("🚨 Secret found:", { rule: rule.description, matches: matches.slice(0,5) });
        alert("⚠️ Possible secret detected: " + rule.description);
      }
    } catch (e) {
      console.warn("Invalid regex:", rule.regex);
    }
  });
}

// ننتظر الصفحة لتكتمل بالكامل
window.addEventListener("load", async () => {
  const rules = await loadRules();
  console.log("Loaded rules:", rules.length);
  scanPage(rules);
});
