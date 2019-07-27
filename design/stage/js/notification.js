function notification(text, status) {
  let n = document.createElement("div");

  n.id = "notification";
  n.classList.add(status ? "success" : "error");
  n.style.opacity = 0;
  n.innerText = text;

  document.body.appendChild(n);

  n.style.right = `-${n.clientWidth - 1}px`;

  function out() {
    n.style.opacity = 0;
    n.style.right = `-${n.clientWidth - 1}px`;
    setTimeout(() => n.remove(), 1000);
  }

  setTimeout(() => {
    n.style.opacity = "";
    n.style.right = "";
    setTimeout(out, 2000);
  }, 500);
}
