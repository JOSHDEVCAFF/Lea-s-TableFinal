const navItems = [
  ["01", "Menu Shop", "index.html#menu"],
  ["02", "About Us", "about.html"],
  ["03", "Culinary Services", "services.html"],
  ["04", "Contact Us", "contact.html"],
  ["05", "FAQ", "faq.html"],
  ["06", "Portfolio", "portfolio.html"],
  ["07", "Featured Specials", "index.html#specials"],
  ["08", "Checkout", "checkout.html"],
  ["09", "Payment", "payment.html"]
];

const money = value => `₱${Number(value).toLocaleString("en-PH")}`;
const getTray = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("leas-table-tray") || "[]");
    return Array.isArray(parsed) ? parsed.filter(item => item && typeof item.name === "string" && Number(item.price) > 0 && Number(item.quantity) > 0) : [];
  } catch (error) {
    console.error("Could not read the saved tray.", error);
    return [];
  }
};
const saveTray = tray => {
  localStorage.setItem("leas-table-tray", JSON.stringify(tray));
  updateTrayCount();
};
const updateTrayCount = () => {
  const count = getTray().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("[data-tray-count]").forEach(node => node.textContent = count);
};

function renderShell() {
  const header = document.querySelector("[data-site-header]");
  const footer = document.querySelector("[data-site-footer]");
  const links = navItems.map(([number, label, href]) => `<li><a href="${href}"><small>${number}</small>${label}</a></li>`).join("");
  if (header) header.innerHTML = `
    <header class="site-header"><div class="header-inner">
      <a class="brand" href="index.html" aria-label="Lea's Table home"><span class="brand-mark">L</span><span class="brand-name">LEA'S TABLE<span class="brand-tag">Asian comfort, made with heart</span></span></a>
      <div class="header-status"><i></i> OPEN NOW · MANDAUE CITY, CEBU · DINE-IN, TAKEOUT & DELIVERY</div>
      <div class="header-right"><a class="tray-link" href="checkout.html">Your Tray (<span data-tray-count>0</span>) →</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation"><span class="hamburger" aria-hidden="true"><i></i><i></i></span> MENU</button></div>
    </div></header>
    <nav class="side-nav" id="site-navigation" aria-label="Main navigation"><div class="nav-panel"><div class="nav-top"><p class="nav-kicker">A table for everyone</p><button class="nav-close" type="button" aria-label="Close menu">×</button></div><ol class="nav-list">${links}</ol><p class="nav-note">Mandaue City, Cebu · Made fresh, served with love.</p></div></nav>`;
  if (footer) footer.innerHTML = `
    <footer class="site-footer"><div class="footer-main wrap">
      <div class="footer-intro"><a class="brand" href="index.html"><span class="brand-mark">L</span><span class="brand-name">LEA'S TABLE<span class="brand-tag">Asian comfort, made with heart</span></span></a><p>A little taste of everywhere, made fresh in Mandaue City, Cebu.</p></div>
      <div class="footer-col"><h3>Find your way</h3><a href="index.html#menu">Menu shop</a><a href="index.html#specials">Featured specials</a><a href="about.html">Our story</a><a href="services.html">Catering & services</a><a href="portfolio.html">Website projects</a><a href="images/credits.txt">Photo credits</a></div>
      <div class="footer-col"><h3>Come say hello</h3><p>Mandaue City, Cebu<br>Philippines</p><a href="contact.html">Contact & opening hours ↗</a><a href="faq.html">Frequently asked questions</a></div>
      <div class="footer-col"><h3>Good to know</h3><p>Preview store for demonstration.<br>Prices and payments are mock.</p><a href="checkout.html">Your tray →</a></div>
    </div><div class="footer-bottom wrap"><span>© ${new Date().getFullYear()} LEA'S TABLE · MADE WITH HEART</span><span>STORE PREVIEW · NOT ACCEPTING REAL PAYMENTS</span></div></footer>`;
  updateTrayCount();
  const drawer = document.querySelector(".side-nav");
  const toggle = document.querySelector(".menu-toggle");
  const close = document.querySelector(".nav-close");
  const setDrawer = open => {
    drawer.classList.toggle("open", open);
    document.body.classList.toggle("drawer-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setDrawer(!drawer.classList.contains("open")));
  close.addEventListener("click", () => setDrawer(false));
  drawer.addEventListener("click", event => { if (event.target === drawer) setDrawer(false); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") setDrawer(false); });
}

function initMenu() {
  document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach(chip => chip.classList.toggle("active", chip === button));
    document.querySelectorAll(".food-card").forEach(card => card.classList.toggle("hidden", button.dataset.filter !== "all" && card.dataset.cuisine !== button.dataset.filter));
  }));
  document.querySelectorAll("[data-add]").forEach(button => button.addEventListener("click", () => {
    const tray = getTray();
    const existing = tray.find(item => item.name === button.dataset.add);
    if (existing) existing.quantity += 1;
    else tray.push({ name: button.dataset.add, price: Number(button.dataset.price), quantity: 1 });
    saveTray(tray);
    const original = button.textContent;
    button.textContent = "✓";
    window.setTimeout(() => { button.textContent = original; }, 800);
  }));
}

function initHeroSlider() {
  const image = document.querySelector(".hero-photo");
  if (!image) return;
  const slides = [
    { src: "ihero-sushi.jpg", alt: "Fresh sushi rolls arranged on a dark platter", caption: "Flavors to find your way home" },
    { src: "tonkotsu-ramen.jpg", alt: "A bowl of tonkotsu ramen with sliced pork", caption: "A little warmth in every bowl" },
    { src: "pan-fried-dumplings.jpg", alt: "Golden pan-fried dumplings ready to share", caption: "Made fresh, made to be shared" }
  ];
  let active = 0;
  const render = () => {
    image.src = slides[active].src;
    image.alt = slides[active].alt;
    document.querySelector("[data-hero-count]").textContent = `${String(active + 1).padStart(2, "0")} — ${String(slides.length).padStart(2, "0")}`;
    document.querySelector("[data-hero-caption]").textContent = slides[active].caption;
  };
  document.querySelector("[data-hero-prev]").addEventListener("click", () => { active = (active - 1 + slides.length) % slides.length; render(); });
  document.querySelector("[data-hero-next]").addEventListener("click", () => { active = (active + 1) % slides.length; render(); });
}

function initCheckout() {
  const list = document.querySelector("[data-checkout-items]");
  if (!list) return;
  const subtotal = document.querySelector("[data-subtotal]");
  const total = document.querySelector("[data-total]");
  const render = () => {
    const tray = getTray();
    list.innerHTML = tray.length ? tray.map((item, index) => `<div class="tray-row"><div><h3>${escapeHtml(item.name)}</h3><p>${money(item.price)} each</p></div><div class="quantity"><button type="button" data-change="${index}" data-delta="-1" aria-label="Remove one ${escapeHtml(item.name)}">−</button><span>${item.quantity}</span><button type="button" data-change="${index}" data-delta="1" aria-label="Add one ${escapeHtml(item.name)}">+</button><strong>${money(item.price * item.quantity)}</strong></div></div>`).join("") : `<p class="empty-tray">Your tray is empty for now. <a class="text-link" href="index.html#menu">Find something delicious ↗</a></p>`;
    const amount = tray.reduce((sum, item) => sum + item.price * item.quantity, 0);
    subtotal.textContent = money(amount);
    total.textContent = money(amount);
    document.querySelectorAll("[data-change]").forEach(button => button.addEventListener("click", () => {
      const current = getTray();
      const index = Number(button.dataset.change);
      current[index].quantity += Number(button.dataset.delta);
      if (current[index].quantity <= 0) current.splice(index, 1);
      saveTray(current);
      render();
    }));
    document.querySelector("[data-proceed]").toggleAttribute("disabled", tray.length === 0);
  };
  const escapeHtml = text => text.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  render();
  const addressField = document.querySelector("[data-address-field]");
  const addressInput = addressField.querySelector("input");
  const updateFulfillment = () => {
    const delivery = document.querySelector("[name=fulfillment]:checked").value === "delivery";
    addressField.hidden = !delivery;
    addressInput.required = delivery;
  };
  document.querySelectorAll("[name=fulfillment]").forEach(input => input.addEventListener("change", updateFulfillment));
  updateFulfillment();
  document.querySelector(".checkout-form").addEventListener("submit", event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const details = Object.fromEntries(new FormData(event.currentTarget).entries());
    sessionStorage.setItem("leas-table-order", JSON.stringify(details));
    window.location.href = "payment.html";
  });
}

function initPayment() {
  const form = document.querySelector("[data-payment-form]");
  if (!form) return;
  const amount = getTray().reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelector("[data-payment-total]").textContent = money(amount);
  const paymentFields = [...form.querySelectorAll("[data-payment-fields]")];
  const updatePaymentFields = () => {
    const method = form.querySelector("[name=payment-method]:checked").value;
    paymentFields.forEach(fieldset => {
      const active = fieldset.dataset.paymentFields === method;
      fieldset.hidden = !active;
      fieldset.disabled = !active;
    });
  };
  form.querySelectorAll("[name=payment-method]").forEach(input => input.addEventListener("change", updatePaymentFields));
  updatePaymentFields();
  form.querySelector("[data-payment-submit]").disabled = false;
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const method = new FormData(event.currentTarget).get("payment-method");
    const status = document.querySelector("[data-payment-status]");
    status.textContent = method === "cash"
      ? "Order preview confirmed! Payment would be collected on delivery. No real order was placed."
      : `${method === "card" ? "Card" : "Wallet"} details accepted for preview only. Nothing was sent or saved, and no payment was processed.`;
    status.classList.add("notice");
    localStorage.removeItem("leas-table-tray");
    updateTrayCount();
  });
}

function initGallery() {
  document.querySelectorAll("[data-gallery]").forEach(gallery => {
    const cards = [...gallery.querySelectorAll(".gallery-card")];
    if (!cards.length) return;
    let page = 0;
    const pageSize = () => window.matchMedia("(max-width: 620px)").matches ? 1 : window.matchMedia("(max-width: 850px)").matches ? 2 : 3;
    let currentPageSize = pageSize();
    const render = () => {
      currentPageSize = pageSize();
      const pages = Math.ceil(cards.length / currentPageSize);
      page = Math.min(page, pages - 1);
      cards.forEach((card, index) => {
        const active = index >= page * currentPageSize && index < (page + 1) * currentPageSize;
        card.classList.toggle("current", active);
        card.classList.toggle("gallery-lead", active && index === page * currentPageSize);
        card.hidden = !active;
      });
      gallery.querySelector("[data-gallery-page]").textContent = `${String(page + 1).padStart(2, "0")} / ${String(pages).padStart(2, "0")}`;
    };
    const changePage = direction => {
      const pages = Math.ceil(cards.length / pageSize());
      page = (page + direction + pages) % pages;
      render();
    };
    gallery.querySelector("[data-gallery-next]").addEventListener("click", () => changePage(1));
    gallery.querySelector("[data-gallery-prev]").addEventListener("click", () => changePage(-1));
    window.addEventListener("resize", () => {
      const nextPageSize = pageSize();
      if (nextPageSize !== currentPageSize) {
        page = 0;
        render();
      }
    });
    render();
  });
}

function initContact() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    document.querySelector("[data-contact-status]").textContent = "Thanks for your message! This preview form does not send messages, but we’d love to hear from you in person.";
    form.reset();
  });
}

renderShell();
initMenu();
initHeroSlider();
initCheckout();
initPayment();
initGallery();
initContact();
