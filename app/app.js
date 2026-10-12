const API_URL = "https://xhdgijwkiqhtyclomvgn.supabase.co/functions/v1/tax-cockpit";
const conversation = document.querySelector("#conversation");
const toast = document.querySelector("#toast");
let toastTimer;
let currentZoom = 100;
let page = 1;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function addMessage(text, kind = "user") {
  const message = document.createElement("div");
  message.className = `message ${kind}-message`;
  if (kind === "assistant") {
    message.innerHTML = `<div class="message-meta"><span class="mini-avatar">✦</span><span>Tax Cockpit</span><time>now</time></div><p>${text}</p>`;
  } else {
    message.innerHTML = `<p>${text}</p><time>now</time>`;
  }
  conversation.append(message);
  conversation.scrollTop = conversation.scrollHeight;
}

async function createFiling() {
  const tenantId = `demo-tenant-${crypto.randomUUID()}`;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tenantId, assessmentYear: "2026-27", actorId: "demo-user" }),
    });
    if (!response.ok) throw new Error("The filing could not be created.");
    const result = await response.json();
    showToast(`New filing created · ${result.filing.id.slice(0, 8)}…`);
  } catch (error) {
    showToast(error instanceof Error ? error.message : "The filing could not be created.");
  }
}

document.querySelector("#new-filing-button").addEventListener("click", createFiling);
document.querySelector("#upload-button").addEventListener("click", () => {
  showToast("Upload flow is next — your current return stays unchanged.");
});
document.querySelector("#skip-button").addEventListener("click", (event) => {
  event.currentTarget.textContent = "Marked resolved";
  event.currentTarget.disabled = true;
  event.currentTarget.style.opacity = "0.65";
  showToast("HRA exemption left out of this draft.");
});
document.querySelector("#approve-button").addEventListener("click", () => {
  showToast("Approval is protected until all review items are resolved.");
});
document.querySelector("#privacy-button").addEventListener("click", () => {
  document.querySelector("#info-dialog").showModal();
});
document.querySelector("#help-button").addEventListener("click", () => {
  document.querySelector("#info-dialog").showModal();
});
document.querySelector(".dialog-close").addEventListener("click", () => document.querySelector("#info-dialog").close());
document.querySelector("#dialog-ok").addEventListener("click", () => document.querySelector("#info-dialog").close());

document.querySelector("#composer").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#message-input");
  const text = input.value.trim();
  if (!text) return;
  addMessage(text);
  input.value = "";
  window.setTimeout(() => {
    addMessage("I can explain the number, trace it to its source, or ask for the missing fact that changes the result.", "assistant");
  }, 420);
});

function setZoom(nextZoom) {
  currentZoom = Math.max(85, Math.min(115, nextZoom));
  document.querySelector("#zoom-level").textContent = `${currentZoom}%`;
  document.querySelector("#itr-paper").style.transform = `scale(${currentZoom / 100})`;
}
document.querySelector("#zoom-in").addEventListener("click", () => setZoom(currentZoom + 5));
document.querySelector("#zoom-out").addEventListener("click", () => setZoom(currentZoom - 5));
document.querySelector("#form-next").addEventListener("click", () => {
  page = Math.min(6, page + 1);
  document.querySelector(".form-toolbar span").textContent = `Page ${page} of 6`;
  document.querySelector("#form-prev").disabled = page === 1;
  showToast(`Form page ${page} is ready for review.`);
});
document.querySelector("#form-prev").addEventListener("click", () => {
  page = Math.max(1, page - 1);
  document.querySelector(".form-toolbar span").textContent = `Page ${page} of 6`;
  document.querySelector("#form-prev").disabled = page === 1;
});
