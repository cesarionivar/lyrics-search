const form = document.getElementById('form');
const inputSearch = document.getElementById('inputSearch');
const btnSearch = document.getElementById('btnSearch');
const content = document.querySelector('.content');
const fragment = document.createDocumentFragment();

const apiURl = `https://api.lyrics.ovh`;

const showSongs = songs => {
  content.innerHTML = 'loading...';
  songs.data.forEach(song => {
    const artistSongHtml = `
      <p class="artist">${song.artist.name} - ${song.title}</p>
      <button class="get-song" data-artist="${song.artist.name}" data-song="${song.title}">Get lyrics</button>
    `;
    const div = document.createElement('div');
    div.classList.add('artist-song');
    div.innerHTML = artistSongHtml;

    fragment.appendChild(div);
  });
  content.innerHTML = '';
  content.appendChild(fragment);
}


const searchSongs = async term => {
  
  try {
    const fetchSongs = await fetch(`${apiURl}/suggest/${term}`);
    const songs =   await fetchSongs.json();
  
    if(songs.data.length > 0) {
      showSongs(songs);
    } else {
      content.innerHTML = 'No se encotraron resultados...';
    }    

  } catch (error) {
    console.log('Error en la petición');
  }

}

const showLirics = lyricsData => {

  const {artist, song, lyrics} = lyricsData;
  
  if(lyrics.error) {
    content.innerHTML = `
      <div class="song">
        <h2 class="song-title">${artist} - ${song}</h2>
        <blockquote>No se encontraron las letras</blockquote>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div class="song">
        <h2 class="song-title">${artist} - ${song}</h2>
        <blockquote>${lyrics.lyrics}</blockquote>
      </div>
    `;
  }

}

const getLyrics = async (artist, song) => {

  try {
    const fetchLyrics = await fetch(`${apiURl}/v1/${artist}/${song}`);
    const lyrics = await fetchLyrics.json();

    const data = {
      lyrics, 
      artist, 
      song
    }
    showLirics(data);

  } catch (error) {
    console.log('Error al cargar las letras...');
    alert('Eror al cargar las letras...');
  }
}

// Event Listener
form.addEventListener('submit', e => {
  e.preventDefault();

  let term = e.target.inputSearch.value;
  term = term.toLowerCase().trim();

  if(term.length === 0 || term.length < 2) {
    alert('Ingresa un término de busqueda válido');
    return;
  }

  searchSongs(term);
  e.target.reset();
  e.target.inputSearch.focus();
});

content.addEventListener('click', e => {
  if(e.target.localName === 'button') {
    const artist = e.target.dataset.artist;
    const song = e.target.dataset.song;

    getLyrics(artist, song);
  }
});