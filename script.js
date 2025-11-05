"use strict";

///////////////////////////////////////
//selecting elements
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const learnBtn = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const navLinks = document.querySelector(".nav__links");
const tabBtns = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const tabContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const sections = document.querySelectorAll(".section");
const header = document.querySelector(".header");
const digitalImgs = document.querySelectorAll("img[data-src]");
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const rightBtn = document.querySelector(".slider__btn--right");
const leftBtn = document.querySelector(".slider__btn--left");
const dots = document.querySelector(".dots");

// Modal window
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// learnmore button

learnBtn.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

// navigaton scrolling
navLinks.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
    });
  }
});

//operation

tabContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  if (clicked) {
    tabBtns.forEach((tab) => tab.classList.remove("operations__tab--active"));
    tabContent.forEach((content) =>
      content.classList.remove("operations__content--active")
    );
    clicked.classList.add("operations__tab--active");
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add("operations__content--active");
  }
});

//fading navigation
const fadingNav = function (e, opacity) {
  const mouseOver = e.target;
  if (mouseOver.classList.contains("nav__link")) {
    const links = nav.querySelectorAll(".nav__link");
    const logo = nav.querySelector(".nav__logo");

    links.forEach((li) => {
      if (li !== mouseOver) {
        li.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity;
  }
};
nav.addEventListener("mouseover", function (e) {
  fadingNav(e, 0.5);
});

nav.addEventListener("mouseout", function (e) {
  fadingNav(e, 1);
});

//sticky navigation
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};
const observer = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
observer.observe(header);

//reveling sections

const reveal = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  });
};
const revealObserver = new IntersectionObserver(reveal, {
  root: null,
  threshold: 0.15,
});
sections.forEach((section) => {
  revealObserver.observe(section);
  section.classList.add("section--hidden");
});

//lazy loading
const loadingImgs = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};
const imageObserver = new IntersectionObserver(loadingImgs, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

digitalImgs.forEach((img) => {
  imageObserver.observe(img);
});

//slider
let currentSlide = 0;
const maxSlide = slides.length;

const toSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
};
const createDots = function () {
  slides.forEach((_, i) => {
    dots.insertAdjacentHTML(
      "beforeend",
      `
      <button class="dots__dot" data-slide=${i}></button>
      `
    );
  });
};
const activateDots = function (slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

const nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else currentSlide++;
  toSlide(currentSlide);
  activateDots(currentSlide);
};

const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else currentSlide--;
  toSlide(currentSlide);
  activateDots(currentSlide);
};

const initials = function () {
  toSlide(0);
  createDots();
  activateDots(0);
};
initials();

rightBtn.addEventListener("click", nextSlide);

leftBtn.addEventListener("click", previousSlide);

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") previousSlide();
});

dots.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    const slide = e.target.dataset.slide;
    toSlide(slide);
    activateDots(slide);
  }
});
