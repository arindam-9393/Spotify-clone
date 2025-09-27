let nextBtn = document.getElementById("nextbtn"); // <-- Added for Next
let prevBtn = document.getElementById("previousbtn"); // <-- Added for Previous
let audio = document.getElementById("audio");
let playPauseBtn = document.getElementById("playBtn");
let mainimg=document.getElementById("mainimg");
console.log("is audio paused??", audio.paused);

console.log(audio.duration);

playPauseBtn.addEventListener("click", function () {
    if (audio.paused) {
        audio.play();
        playPauseBtn.src = "/play.svg"
    } else {
        audio.pause();
        playPauseBtn.src = "/pause.svg"
    }
});
audio.addEventListener("ended", function () {
    playPauseBtn.src = "/pause.svg"
})
let seekBar = document.querySelector("#seekbaar input[type='range']");

let currentTimeEl = document.getElementById("currentTime");
let totalTimeEl = document.getElementById("totalTime");
audio.addEventListener("loadedmetadata", function () {   // loadedmetadata → fires when the audio’s duration is available
    let minutes = Math.floor(audio.duration / 60);
    let seconds = Math.floor(audio.duration % 60);
    if (seconds < 10) seconds = "0" + seconds;
    totalTimeEl.textContent = `${minutes}:${seconds}`;
});
audio.addEventListener("timeupdate", function () {   // ye sab dhyan me rakhna jab bhi time update wagera banana ho seekbaar ke sath
    const progress = (audio.currentTime / audio.duration) * 100;
    seekBar.value = progress;

    let minutes = Math.floor(audio.currentTime / 60);
    let seconds = Math.floor(audio.currentTime % 60);
    if (seconds < 10) seconds = "0" + seconds;
    currentTimeEl.textContent = `${minutes}:${seconds}`;
});

seekBar.addEventListener("input", function () {    // input is used to drag the seekbaar
    audio.currentTime = (seekBar.value / 100) * audio.duration;
});

let libraryDiv = document.getElementById("library");
async function getdata() {
    let a = await fetch('https://itunes.apple.com/search?term=arijit+singh&media=music&limit=2000');
    let b = await a.json();
    let currentIndex = -1; // No song playing yet

    function playSong(index) {
        let song = b.results[index];
        audio.src = song.previewUrl;
        audio.play();
        playPauseBtn.src = "/play.svg";
        currentIndex = index;
    }

    for (let i = 0; i < b.results.length; i++) {
        let c = b.results[i];
        let songItem = document.createElement("div");
        
        songItem.innerHTML = `
            <img src="${c.artworkUrl100}" alt="Cover" width="50">
            <strong>${c.trackName}</strong> - ${c.artistName}
        `;
        songItem.style.cursor = "pointer";

        songItem.addEventListener("click", () => {
            playSong(i);
            mainimg.src=`${c.artworkUrl100}`;

        });

        libraryDiv.appendChild(songItem);
    }

    // --- Added Next Button functionality ---
    nextBtn.addEventListener("click", function () {
        if (currentIndex < b.results.length - 1) {
            playSong(currentIndex + 1);
            mainimg.src=`${c.artworkUrl100}`;
            
        }
         
    });

    // --- Added Previous Button functionality ---
    prevBtn.addEventListener("click", function () {
        if (currentIndex > 0) {
            playSong(currentIndex - 1);
            mainimg.src=`${c.artworkUrl100}`;
        }
         
    });

    console.log(b.results);
}

 
// ===== Hamburger Toggle for Song Library =====
const hamburgerBtn = document.getElementById("hamburger");
const libraryContainer = document.getElementById("library");

hamburgerBtn.addEventListener("click", () => {
    // Toggle the 'hidden' class on click
    libraryContainer.classList.toggle("hidden");
});



// ===== Refresh Page on Logo Click =====
const logo = document.getElementById("logo"); // make sure your logo has id="logo"

logo.addEventListener("click", () => {
    location.reload(); // refreshes the page
});



getdata();
