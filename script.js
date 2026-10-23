document.getElementById('year').textContent = new Date().getFullYear();

const heroPlayers = Array.from(document.querySelectorAll('.hero-video'));

if (heroPlayers.length === 2) {
  const playlist = ['videos/video-1.mp4', 'videos/video-2.mp4', 'videos/video-3.mp4'];
  const FADE_MS = 1200;
  let activeIdx = 0;
  let currentSong = 0;
  let transitioning = false;

  const preload = (player, songIdx) => {
    player.src = playlist[songIdx];
    player.load();
  };

  if (playlist.length > 1) preload(heroPlayers[1], 1);

  const startCrossfade = () => {
    if (transitioning) return;
    transitioning = true;

    const incoming = heroPlayers[1 - activeIdx];
    const outgoing = heroPlayers[activeIdx];

    incoming.currentTime = 0;
    incoming.play().catch(() => {});
    incoming.classList.add('active');
    outgoing.classList.remove('active');

    currentSong = (currentSong + 1) % playlist.length;
    activeIdx = 1 - activeIdx;

    setTimeout(() => {
      outgoing.pause();
      transitioning = false;
      preload(outgoing, (currentSong + 1) % playlist.length);
    }, FADE_MS + 100);
  };

  heroPlayers.forEach((player) => {
    player.addEventListener('timeupdate', () => {
      if (transitioning || player !== heroPlayers[activeIdx] || !player.duration) return;
      if (player.currentTime >= player.duration - FADE_MS / 1000) {
        startCrossfade();
      }
    });
  });
}

const bookingForm = document.getElementById('booking-form');

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('bf-email').value;
    const phone = document.getElementById('bf-phone').value;
    const people = document.getElementById('bf-people').value;
    const date = document.getElementById('bf-date').value;

    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.es;
    const subject = encodeURIComponent(t['mail.subject']);
    const body = encodeURIComponent(
      `${t['mail.email']}: ${email}\n${t['mail.phone']}: ${phone}\n${t['mail.people']}: ${people}\n${t['mail.date']}: ${date}`
    );
    window.location.href = `mailto:info@casetavella.com?subject=${subject}&body=${body}`;
  });
}
