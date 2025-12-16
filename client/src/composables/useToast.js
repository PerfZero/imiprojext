import { ref, onMounted, onUnmounted } from "vue";

export function useToast() {
    let toastContainer;
    let toastLiveExample1;
    let toastBootstrap1;
    onMounted(() => {
        toastLiveExample1 = document.getElementById("toast");
        toastContainer = toastLiveExample1.parentElement;
    });

    function showToast(header, content, delay) {
        const clonedToastLiveExample1 = toastLiveExample1.cloneNode(true);
        toastContainer.appendChild(clonedToastLiveExample1);

        clonedToastLiveExample1.id = "aaa" + Math.random();

        clonedToastLiveExample1.setAttribute("data-bs-delay", delay);

        let headerEl = clonedToastLiveExample1.querySelector(".me-auto");
        headerEl.innerText = header;

        let contentEl = clonedToastLiveExample1.querySelector(".toast-body");
        contentEl.innerText = content;

        toastBootstrap1 = bootstrap.Toast.getOrCreateInstance(
            clonedToastLiveExample1
        );

        clonedToastLiveExample1.addEventListener("hidden.bs.toast", () => {
            console.log("Toast hide");
            clonedToastLiveExample1.remove();
        });

        toastBootstrap1.show();
    }

    return { showToast };
}
