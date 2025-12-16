// utils/toast.js
// import { Toast } from "bootstrap";

let container = null;

function getContainer() {
    if (container) return container;

    container = document.querySelector(".toast-container");
    if (!container) {
        console.warn("Toast container not found!");
        return null;
    }
    return container;
}

export function showToast({
    title = "",
    body = "",
    delay = 3000,
    bg = "bg-primary",
} = {}) {
    const container = getContainer();
    if (!container) return;

    // Создаём элемент тоста
    const toastEl = document.createElement("div");
    toastEl.className = `toast ${bg} text-white`;
    toastEl.setAttribute("role", "alert");
    toastEl.setAttribute("aria-live", "assertive");
    toastEl.setAttribute("aria-atomic", "true");

    toastEl.innerHTML = `
    <div class="toast-header ${bg} text-white">
      <strong class="me-auto">${title}</strong>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${body}
    </div>
  `;

    container.appendChild(toastEl);

    const toast = new Toast(toastEl, {
        delay,
        autohide: true,
    });

    toast.show();

    // Удаляем элемент после скрытия, чтобы не засорять DOM
    toastEl.addEventListener("hidden.bs.toast", () => {
        toastEl.remove();
    });
}
