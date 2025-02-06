document.addEventListener("DOMContentLoaded", function () {
    const sidebarModal = document.getElementById("sidebarModal");
    const toggleSidebarBtn = document.getElementById("toggleSidebar");
    const closeSidebarBtn = document.getElementById("closeSidebar");
    const dragHandle = document.getElementById("drag-handle");

    let offsetX = 0, offsetY = 0, isDragging = false;

    // Toggle Sidebar Modal
    toggleSidebarBtn.addEventListener("click", () => {
        sidebarModal.classList.toggle("hidden");
    });

    // Close Sidebar
    closeSidebarBtn.addEventListener("click", () => {
        sidebarModal.classList.add("hidden");
    });

    // Drag Functionality
    dragHandle.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - sidebarModal.offsetLeft;
        offsetY = e.clientY - sidebarModal.offsetTop;
        document.addEventListener("mousemove", moveSidebar);
        document.addEventListener("mouseup", stopDrag);
    });

    function moveSidebar(e) {
        if (isDragging) {
            sidebarModal.style.left = `${e.clientX - offsetX}px`;
            sidebarModal.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener("mousemove", moveSidebar);
        document.removeEventListener("mouseup", stopDrag);
    }
});

