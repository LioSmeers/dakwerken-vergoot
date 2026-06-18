const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const scrollMeter = document.querySelector(".scroll-meter");

if (navToggle) {
    navToggle.addEventListener("click", () => {
        const isOpen = body.classList.toggle("menu-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

window.addEventListener("scroll", () => {
    if (!scrollMeter) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    scrollMeter.style.width = `${progress}%`;
});

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.18 });

revealItems.forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll("[data-count-to]");
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.dataset.countTo);
        const duration = 900;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            element.textContent = Math.floor(progress * target).toLocaleString("nl-BE");

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
        counterObserver.unobserve(element);
    });
}, { threshold: 0.4 });

counters.forEach((counter) => counterObserver.observe(counter));

const filterButtons = document.querySelectorAll("[data-filter]");
const workCards = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        workCards.forEach((card) => {
            const show = filter === "all" || card.dataset.category === filter;
            card.classList.toggle("is-hidden", !show);
        });
    });
});

const roofType = document.querySelector("#roofType");
const roofSize = document.querySelector("#roofSize");
const sizeOutput = document.querySelector("[data-size-output]");
const estimateOutput = document.querySelector("[data-estimate]");

function updateEstimate() {
    if (!roofType || !roofSize || !sizeOutput || !estimateOutput) return;

    const size = Number(roofSize.value);
    const price = Number(roofType.value);
    const estimate = Math.round((size * price) / 100) * 100;

    sizeOutput.textContent = size;
    estimateOutput.textContent = `${estimate.toLocaleString("nl-BE")} euro`;
}

roofType?.addEventListener("change", updateEstimate);
roofSize?.addEventListener("input", updateEstimate);
updateEstimate();

const contactForm = document.querySelector("[data-contact-form]");
const formFeedback = document.querySelector("[data-form-feedback]");

contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name") || "Bedankt";
    const urgency = formData.get("urgency");

    if (urgency === "storm") {
        formFeedback.textContent = `${name}, bel ook meteen 0472 81 39 20. We zetten je aanvraag bovenaan.`;
        return;
    }

    formFeedback.textContent = `${name}, je aanvraag staat klaar. In deze demo wordt er niets verzonden, maar zo voelt het formulier wel afgewerkt.`;
    contactForm.reset();
});
