// ===== Get elements =====
let nextBtn = document.getElementById("nextbtn");
let prevBtn = document.getElementById("previousbtn");
let audio = document.getElementById("audio");
let playPauseBtn = document.getElementById("playBtn");
let mainimg = document.getElementById("mainimg");
let seekBar = document.querySelector("#seekbaar input[type='range']");
let currentTimeEl = document.getElementById("currentTime");
let totalTimeEl = document.getElementById("totalTime");
let libraryDiv = document.getElementById("library");

// ===== Hamburger toggle =====
const hamburgerBtn = document.getElementById("hamburger");
hamburgerBtn.addEventListener("click", () => {
    libraryDiv.classList.toggle("hidden");
});

// ===== Refresh page on logo click =====
document.getElementById("logo").addEventListener("click", () => {
    location.reload();
});

// ===== Play/Pause button =====
playPauseBtn.addEventListener("click", function () {
    if (audio.paused) {
        audio.play();
        playPauseBtn.src = "assets/pause.svg";
    } else {
        audio.pause();
        playPauseBtn.src = "assets/play.svg";
    }
});

audio.addEventListener("ended", function () {
    playPauseBtn.src = "assets/play.svg";
});

// ===== Seekbar =====
audio.addEventListener("loadedmetadata", function () {
    let minutes = Math.floor(audio.duration / 60);
    let seconds = Math.floor(audio.duration % 60);
    if (seconds < 10) seconds = "0" + seconds;
    totalTimeEl.textContent = `${minutes}:${seconds}`;
});

audio.addEventListener("timeupdate", function () {
    const progress = (audio.currentTime / audio.duration) * 100;
    seekBar.value = progress;

    let minutes = Math.floor(audio.currentTime / 60);
    let seconds = Math.floor(audio.currentTime % 60);
    if (seconds < 10) seconds = "0" + seconds;
    currentTimeEl.textContent = `${minutes}:${seconds}`;
});

seekBar.addEventListener("input", function () {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
});

// ===== Fetch songs from iTunes =====
async function getdata() {
    let res = await fetch('https://itunes.apple.com/search?term=arijit+singh&media=music&limit=50');
    let data = await res.json();
    let currentIndex = -1;

    function playSong(index) {
        let song = data.results[index];
        audio.src = song.previewUrl;
        audio.play();
        playPauseBtn.src = "assets/pause.svg";
        mainimg.src = song.artworkUrl100;
        currentIndex = index;
    }

    // Create library items
    data.results.forEach((song, i) => {
        let songItem = document.createElement("div");
        songItem.innerHTML = `
            <img src="${song.artworkUrl100}" alt="Cover" width="50">
            <strong>${song.trackName}</strong> - ${song.artistName}
        `;
        songItem.style.cursor = "pointer";

        songItem.addEventListener("click", () => {
            playSong(i);
        });

        libraryDiv.appendChild(songItem);
    });

    // Next button
    nextBtn.addEventListener("click", function () {
        if (currentIndex < data.results.length - 1) {
            playSong(currentIndex + 1);
        }
    });

    // Previous button
    prevBtn.addEventListener("click", function () {
        if (currentIndex > 0) {
            playSong(currentIndex - 1);
        }
    });
}

// ===== Initialize =====
getdata();
