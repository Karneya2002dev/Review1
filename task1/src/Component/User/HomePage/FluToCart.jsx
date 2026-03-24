export const flyToCart = (imgId, cartId = "cart-icon") => {
  const img = document.getElementById(imgId);
  const cart = document.getElementById(cartId);

  if (!img || !cart) return;

  const imgRect = img.getBoundingClientRect();
  const cartRect = cart.getBoundingClientRect();

  const clone = img.cloneNode(true);

  // Initial style
  clone.style.position = "fixed";
  clone.style.top = `${imgRect.top}px`;
  clone.style.left = `${imgRect.left}px`;
  clone.style.width = `${imgRect.width}px`;
  clone.style.height = `${imgRect.height}px`;
  clone.style.zIndex = "9999";
  clone.style.borderRadius = "12px";
  clone.style.transition = "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
  clone.style.pointerEvents = "none";

  document.body.appendChild(clone);

  // Animate
  requestAnimationFrame(() => {
    clone.style.top = `${cartRect.top}px`;
    clone.style.left = `${cartRect.left}px`;
    clone.style.width = "30px";
    clone.style.height = "30px";
    clone.style.opacity = "0.5";
    clone.style.transform = "scale(0.6)";
  });

  // Remove after animation
  setTimeout(() => {
    clone.remove();

    // 🔥 Cart bounce effect
    cart.classList.add("animate-bounce");
    setTimeout(() => {
      cart.classList.remove("animate-bounce");
    }, 300);

  }, 700);
};