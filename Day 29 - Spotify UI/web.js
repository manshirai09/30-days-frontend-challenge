     // Minimal player interactions
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('playBtn');
    const playAll = document.getElementById('playAll');
    const seek = document.getElementById('seek');
    const currentTime = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const list = document.querySelectorAll('.list-row');
    const miniTitle = document.getElementById('miniTitle');
    const miniCover = document.getElementById('miniCover');

    let currentIndex = 1;
    const tracks = Array.from(list).map((row, i)=>({
      src: row.dataset.src,
      title: row.querySelector('.meta strong').innerText,
      subtitle: row.querySelector('.meta span').innerText,
      cover: row.querySelector('img').src
    }));

    // helper
    function formatTime(s){
      if(isNaN(s)) return '0:00';
      const m = Math.floor(s/60); const sec = Math.floor(s%60).toString().padStart(2,'0');
      return `${m}:${sec}`;
    }

    // set track
    function loadTrack(index){
      const t = tracks[index];
      audio.src = t.src;
      miniTitle.innerText = t.title;
      miniCover.src = t.cover;
      // reset
      seek.value = 0; currentTime.innerText='0:00'; durationEl.innerText='0:00';
    }

    // initial
    loadTrack(1);

    // play/pause toggle
    playBtn.addEventListener('click', ()=>{
      if(audio.paused) audio.play(); else audio.pause();
    });

    // play all button -> start from first
    playAll.addEventListener('click', ()=>{ loadTrack(0); audio.play(); });

    // next/prev
    document.getElementById('nextBtn').addEventListener('click', ()=>{ currentIndex = (currentIndex+1)%tracks.length; loadTrack(currentIndex); audio.play(); });
    document.getElementById('prevBtn').addEventListener('click', ()=>{ currentIndex = (currentIndex-1+tracks.length)%tracks.length; loadTrack(currentIndex); audio.play(); });

    // update play button state
    audio.addEventListener('play', ()=> playBtn.innerText='⏸');
    audio.addEventListener('pause', ()=> playBtn.innerText='▶');

    // update duration
    audio.addEventListener('loadedmetadata', ()=>{
      seek.max = Math.floor(audio.duration);
      durationEl.innerText = formatTime(audio.duration);
    });
    audio.addEventListener('timeupdate', ()=>{
      seek.value = Math.floor(audio.currentTime);
      currentTime.innerText = formatTime(audio.currentTime);
    });

    // seek control
    seek.addEventListener('input', ()=>{ audio.currentTime = seek.value; });

    // clicking a track's small play button
    document.querySelectorAll('.list-row .play-btn').forEach((btn, i)=>{
      btn.addEventListener('click', ()=>{
        loadTrack(i);
        currentIndex = i;
        audio.play();
      });
    });

    // autoplay next when ended
    audio.addEventListener('ended', ()=>{ currentIndex = (currentIndex+1)%tracks.length; loadTrack(currentIndex); audio.play(); });

    // small accessibility improvement: keyboard space toggles
    document.addEventListener('keydown', (e)=>{
      if(e.code === 'Space'){
        e.preventDefault(); if(audio.paused) audio.play(); else audio.pause();
      }
    });
