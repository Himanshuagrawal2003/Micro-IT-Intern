document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 100) {
    nav.style.background = "rgba(102, 126, 234, 0.95)";
  } else {
    nav.style.background = "rgba(255, 255, 255, 0.1)";
  }
});

function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target.toString().includes("K")
        ? target
        : target + "+";
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start) + "+";
    }
  }, 16);
}

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = "running";

      if (entry.target.classList.contains("stat-counter")) {
        const text = entry.target.textContent;
        const number = parseInt(text.replace(/[^\d]/g, ""));
        animateCounter(entry.target, number);
      }
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in, .stat-counter").forEach((el) => {
  observer.observe(el);
});

document.querySelectorAll(".university-logo").forEach((logo, index) => {
  logo.style.animationDelay = `${index * 0.1}s`;
  logo.classList.add("fade-in");
});

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector(".hero-pattern");
  if (parallax) {
    parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

document.querySelectorAll(".card-hover").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});
