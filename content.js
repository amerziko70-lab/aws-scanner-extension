// content.js
async function loadRules() {
  const res = await fetch(chrome.runtime.getURL("rules.json"));
  const data = await res.json();
  return data.rules || [];
}

function scanPage(rules) {
  const text = document.body.innerText;

  rules.forEach(rule => {
    if (!rule.regex) return;
    try {
      const regex = new RegExp(rule.regex, "g");
      const matches = text.match(regex);
      if (matches && matches.length > 0) {
        console.log("🚨 Secret found:", {rule: rule.description, matches: matches.slice(0,5)});
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
  console.log("Loaded rules:", rules.length); // نتأكد أن القواعد تم تحميلها
  scanPage(rules);
});