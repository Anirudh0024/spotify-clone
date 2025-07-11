


  console.log("Starting JS now");
let currentsong = new Audio();
let songs;
let currfolder;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}


async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${currfolder}/`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  // Show all the songs in the playlist
  let songUL = document.querySelector(".songslist ul");
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML += `
      <li>
        <img class="invert" src="music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
        </div>
        <div class="playnow">
          <span>PlayNow</span>
          <img class="invert" src="play.svg" alt="">
        </div>
      </li>`;
  }

  // Attach an event listener to each song
  Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", () => {
      let songName = e.querySelector(".info div").innerHTML.trim();
      console.log(songName);
      playMusic(songName);
    });
  });

  return songs; // Return songs to use outside the function
}

const playMusic = (track, pause = false) => {
  currentsong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentsong.play();
    document.getElementById("play").src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  Array.from(anchors).forEach(async e => {
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-1)[0];
      // Metadata fetching for the folder (you may add further processing here)
      let a= await fetch(`http://127.0.0.1:5500/songs/`)
      let response=await a.json();
      console.log(response);
    }
  })


}

async function main() {
  // Get the list of all the songs
  await getsongs("songs/ncs");
  playMusic(songs[0], true);

  // Display all the albums on the page
  // displayAlbums();

  // Attach an event listener to play, next, and previous buttons
  document.getElementById("play").addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      document.getElementById("play").src = "pause.svg";
    } else {
      currentsong.pause();
      document.getElementById("play").src = "play.svg";
    }
  });

  // Listen for time update event
  currentsong.addEventListener("timeupdate", () => {
    console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`;
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100;
  });

  // Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Add an event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add event listeners for previous and next buttons
  document.getElementById("previous").addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  document.getElementById("next").addEventListener("click", () => {
    currentsong.pause();
    console.log("next clicked");
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Add event listener to volume bar
  document.querySelector(".range input").addEventListener("change", (e) => {
    console.log("setting volume to", e.target.value);
    currentsong.volume = parseInt(e.target.value) / 100;
  });

  // Load the playlist whenever a card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0], true); // Play the first song in the loaded playlist
    });
  });
  
}

main();
