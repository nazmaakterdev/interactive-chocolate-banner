const titleText = "Crafted Layer by Layer!";
const descText = "Watch the wrapper peel away as velvety milk, crispy biscuit, and rich cocoa unite:";

const titleEl = document.getElementById("typewriter-title");
const descEl = document.getElementById("typewriter-desc");
const wrapLeft = document.getElementById("wrapper-left");
const wrapRight = document.getElementById("wrapper-right");
const foilLeft = document.getElementById("foil-left");
const foilRight = document.getElementById("foil-right");
const liveTag = document.getElementById("live-tag");
const stepsHeading = document.querySelector(".steps-container h3");
const replayBtn = document.getElementById("replay-btn");
const dustParticles = document.getElementById("dust-particles");
const bgMusic = document.getElementById("bg-music");

const layers = [
    { el: document.getElementById("layer-milk"), step: document.getElementById("step-1"), label: "01. Pouring Creamy Milk" },
    { el: document.getElementById("layer-biscuit"), step: document.getElementById("step-2"), label: "02. Adding Crispy Biscuit" },
    { el: document.getElementById("layer-cocoa"), step: document.getElementById("step-3"), label: "03. Dusting Cocoa Powder" },
    { el: document.getElementById("layer-final"), step: document.getElementById("step-4"), label: "✨ Pure Chocolate Perfection" }
];

let musicTimer;
let fadeInterval;

// 1. Typewriter Effect
function typeWriter(element, text, speed, callback) {
    let i = 0;
    element.innerHTML = "";
    element.classList.add("cursor");

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.remove("cursor");
            if (callback) callback();
        }
    }
    type();
}

// 2. Build Layers Sequentially
function buildLayersSequentially(index = 0) {
    if (index < layers.length) {
        layers[index].el.classList.add("show");
        layers[index].step.classList.add("active");
        liveTag.innerText = layers[index].label;

        // Trigger Cocoa Dust Burst on Step 3 (index 2)
        if (index === 2) {
            dustParticles.classList.remove("burst");
            void dustParticles.offsetWidth;
            dustParticles.classList.add("burst");
        }

        setTimeout(() => {
            buildLayersSequentially(index + 1);
        }, 1150);
    } else {
        replayBtn.classList.add("show");
    }
}

// 3. Interactive Layer Inspection (Click any step after animation)
function inspectLayer(targetIndex) {
    layers.forEach((item, idx) => {
        if (idx <= targetIndex) {
            item.el.classList.add("show");
            item.step.classList.add("active");
        } else {
            item.el.classList.remove("show");
            item.step.classList.remove("active");
        }
    });
    liveTag.innerText = layers[targetIndex].label;
}

// 4. Smooth Fade-Out & Timed Music Control (10 Seconds)
function fadeOutAndStop(audio) {
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (audio.volume > 0.05) {
            audio.volume = Math.max(0, audio.volume - 0.05);
        } else {
            audio.pause();
            audio.currentTime = 0;
            clearInterval(fadeInterval);
        }
    }, 100);
}

function playTimedMusic() {
    if (!bgMusic) return;
    clearTimeout(musicTimer);
    clearInterval(fadeInterval);
    
    bgMusic.currentTime = 0;
    bgMusic.volume = 0.6;

    bgMusic.play().then(() => {
        musicTimer = setTimeout(() => {
            fadeOutAndStop(bgMusic);
        }, 10000); // 10 seconds play limit
    }).catch(() => {
        const unlockAudio = () => {
            playTimedMusic();
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("keydown", unlockAudio);
        };
        document.addEventListener("click", unlockAudio);
        document.addEventListener("keydown", unlockAudio);
    });
}

// 5. Main Animation Sequence (Runs on load & Replay button click)
function startAnimation() {
    wrapLeft.classList.remove("open");
    wrapRight.classList.remove("open");
    foilLeft.classList.remove("open");
    foilRight.classList.remove("open");
    stepsHeading.classList.remove("show");
    replayBtn.classList.remove("show");
    dustParticles.classList.remove("burst");
    liveTag.innerText = "Wrapped Chocolate";

    layers.forEach(item => {
        item.el.classList.remove("show");
        item.step.classList.remove("active");
    });

    // Restart music on replay as well
    playTimedMusic();

    typeWriter(titleEl, titleText, 50, () => {
        liveTag.innerText = "Unwrapping...";
        wrapLeft.classList.add("open");
        wrapRight.classList.add("open");

        setTimeout(() => {
            foilLeft.classList.add("open");
            foilRight.classList.add("open");
        }, 450);

        typeWriter(descEl, descText, 25, () => {
            stepsHeading.classList.add("show");
            buildLayersSequentially(0);
        });
    });
}

// Initialize on Page Load
window.addEventListener("load", startAnimation);

