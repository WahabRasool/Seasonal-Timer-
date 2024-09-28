let countdownInterval;
let isRunning = false;
const countdownCircle = document.querySelector(".countdown-circle");
const countdownText = document.getElementById("countdown");
const timeInput = document.getElementById("timeInput");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const startIcon = document.getElementById("startIcon");
const stopIcon = document.getElementById("stopIcon");
const circumference = 2 * Math.PI * 45;
const videoBackground = document.getElementById("video-background");
const mainContainer = document.getElementById("mainContainer");
const seasonVideos = {
  winter:
    "https://video.wixstatic.com/video/60eca0_29ea780c363b43888e81b9e09f0cc3cc/1080p/mp4/file.mp4",
  spring:
    "https://video.wixstatic.com/video/60eca0_2631445d7acd4551bc0307e28bd0c846/1080p/mp4/file.mp4",
  summer:
    "https://video.wixstatic.com/video/60eca0_1544aaa8111a4361ac919ef74527938b/1080p/mp4/file.mp4",
  fall:
    "https://video.wixstatic.com/video/60eca0_ed5232fb25d54c45ba71de8557fafb3c/1080p/mp4/file.mp4"
};
const seasonColors = {
  winter: ["#e0f7fa", "#b2ebf2", "#80deea"], // Ice Blue, Light Cyan, and Light Sky Blue
  spring: ["#ADD8E6", "#FFFACD", "#FFB6C1"], // Light Blue, Lemon Chiffon (Soft Yellow), Light Pink
  summer: ["#FF4500", "#FF7F50", "#FFD700"], // Orange Red, Coral, Gold
  fall: ["#A0522D", "#D2691E", "#FF8C00"] // Sienna, Chocolate, Dark Orange
};

function preloadVideo(url) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.src = url;
    video.oncanplaythrough = () => resolve();
  });
}

async function changeSeason(season) {
  // Update background video
  await preloadVideo(seasonVideos[season]); // Preload the new video
  videoBackground.src = seasonVideos[season];
  videoBackground.load();
  videoBackground.oncanplaythrough = () => {
    videoBackground.style.opacity = 1; // Fade in when the video can play through
  };

  // Update the entire gradient with the seasonal colors
  const gradient = document.getElementById("calm-gradient");
  gradient.innerHTML = `
    <stop offset="0%" style="stop-color:${seasonColors[season][0]}" />
    <stop offset="50%" style="stop-color:${seasonColors[season][1]}" />
    <stop offset="100%" style="stop-color:${seasonColors[season][2]}" />
  `;

  // Change countdown input border color
  const countdownInput = document.querySelector(".countdown-input");
  countdownInput.style.borderColor = seasonColors[season][2];

  // Reset all icons to default color
  document.querySelectorAll(".season-icon").forEach((icon) => {
    icon.classList.remove("active");
    icon.style.color = "";
  });

  // Set active color to the selected season's icon
  const activeIcon = document.getElementById(`${season}Icon`);
  activeIcon.classList.add("active");
  activeIcon.style.color = seasonColors[season][2]; // Set color to match the season's palette
}

function startCountdown() {
  const duration = parseInt(timeInput.value);
  if (isNaN(duration) || duration <= 0) {
    if (!timeInput.value.trim()) {
      showTooltip();
    }
    return;
  }

  if (!isRunning) {
    isRunning = true;
    let timeLeft = duration;

    // Reset the animation before starting the countdown
    countdownCircle.style.animation = "none"; 
    countdownCircle.getBoundingClientRect(); // Trigger a reflow, flushing the CSS changes
    countdownCircle.style.animation = `moveGradient ${duration}s linear`;
    countdownCircle.style.strokeDasharray = `${circumference} ${circumference}`;

    updateCountdown(timeLeft, duration);

    countdownInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft < 0) {
        stopCountdown();
        return;
      }
      updateCountdown(timeLeft, duration);
    }, 1000);

    startButton.disabled = true;
    stopButton.disabled = false;
    timeInput.disabled = true;
    startIcon.classList.add("flipped");
  }
}

function stopCountdown() {
  if (isRunning) {
    clearInterval(countdownInterval);
    isRunning = false;

    // Reset the animation state when countdown stops
    countdownCircle.style.animation = "none"; 
    countdownCircle.style.strokeDashoffset = circumference;

    startButton.disabled = false;
    stopButton.disabled = true;
    timeInput.disabled = false;
    stopIcon.classList.add("flipped");
    startIcon.classList.remove("flipped");
  }
}

function updateCountdown(timeLeft, duration) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  countdownText.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  
  const progress = (duration - timeLeft) / duration;
  const dashoffset = circumference * (1 - progress);
  countdownCircle.style.strokeDashoffset = dashoffset;
}


function incrementTime() {
  timeInput.value = (parseInt(timeInput.value) || 0) + 1;
}

function decrementTime() {
  timeInput.value = Math.max((parseInt(timeInput.value) || 0) - 1, 1);
}

function showTooltip() {
  const tooltip = startButton.querySelector(".tooltip");
  tooltip.style.visibility = "visible";
  tooltip.style.opacity = "1";
  setTimeout(() => {
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = "0";
  }, 2000);
}

timeInput.addEventListener("input", () => {
  if (timeInput.value.trim()) {
    startButton.querySelector(".tooltip").style.display = "none";
  } else {
    startButton.querySelector(".tooltip").style.display = "block";
  }
});

// Initialize with winter season
changeSeason("winter");

// Function to resize the entire main container
function resizeContainer(scale) {
  mainContainer.style.transform = `scale(${scale})`;
}
