// Animate hero
gsap.from(".hero h1", {
    y: -50,
    opacity: 0,
    duration: 1.2,
    ease: "power2.out"
});

gsap.from(".hero p", {
    y: 30,
    opacity: 0,
    delay: 0.5,
    duration: 1,
    ease: "power1.out"
});

// Animate blog cards
gsap.from(".blog-card", {
    opacity: 0,
    y: 50,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out"
});
