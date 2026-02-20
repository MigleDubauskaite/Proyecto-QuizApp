// ============================================
// REPRODUCTOR DE MÚSICA PARA THYMELEAF
// ============================================

(function() {
    'use strict';

    let audioElement = null;
    let botonMusica = null;

    // --- FUNCIONES DE PERSISTENCIA ---
    
    // Guarda el estado actual en el navegador
    function guardarEstado() {
        if (audioElement && !audioElement.paused) {
            localStorage.setItem('musica_url', audioElement.src);
            localStorage.setItem('musica_tiempo', audioElement.currentTime);
            localStorage.setItem('musica_mute', audioElement.muted);
        }
    }

    // Cada segundo guardamos el progreso por si el usuario cambia de página de repente
    setInterval(guardarEstado, 1000);

    async function traerMusicaTranquila() {
        try {
            const response = await fetch('/api/movil/musica/buscar');
            return await response.json();
        } catch (error) {
            return null;
        }
    }

    function crearAudioElement(urlAudio, tiempoInicio = 0, silenciado = false) {
        if (audioElement) audioElement.remove();

        audioElement = document.createElement('audio');
        audioElement.src = urlAudio;
        audioElement.autoplay = true;
        audioElement.muted = silenciado;
        audioElement.style.display = 'none';
        document.body.appendChild(audioElement);

        // Saltamos al segundo donde se quedó en la página anterior
        audioElement.currentTime = tiempoInicio;

        // Si la canción termina, limpiamos persistencia y buscamos otra
        audioElement.addEventListener('ended', async () => {
            localStorage.removeItem('musica_url');
            const nueva = await traerMusicaTranquila();
            if (nueva) crearAudioElement(nueva.urlAudio);
        });
    }

    function crearBotonMusica(silenciadoInicial) {
        if (botonMusica) return;
        botonMusica = document.createElement('button');
        botonMusica.className = 'btn-musica-fixed';
        // Estilos básicos por si no carga el CSS
        Object.assign(botonMusica.style, {
            position: 'fixed', bottom: '20px', right: '20px', zIndex: '1000',
            borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer',
            backgroundColor: '#000', color: '#fff', border: 'none'
        });
        
        botonMusica.innerHTML = `<span class="material-symbols-rounded">${silenciadoInicial ? 'volume_off' : 'volume_up'}</span>`;
        
        botonMusica.addEventListener('click', () => {
            if (!audioElement) return;
            audioElement.muted = !audioElement.muted;
            localStorage.setItem('musica_mute', audioElement.muted);
            botonMusica.querySelector('span').textContent = audioElement.muted ? 'volume_off' : 'volume_up';
        });
        document.body.appendChild(botonMusica);
    }

    async function inicializar() {
        const urlGuardada = localStorage.getItem('musica_url');
        const tiempoGuardado = parseFloat(localStorage.getItem('musica_tiempo') || 0);
        const muteGuardado = localStorage.getItem('musica_mute') === 'true';

        crearBotonMusica(muteGuardado);

        if (urlGuardada) {
            // Si ya teníamos una canción sonando en la página anterior, seguimos con esa
            crearAudioElement(urlGuardada, tiempoGuardado, muteGuardado);
        } else {
            // Si no hay nada guardado (es la primera vez), buscamos una nueva
            const cancion = await traerMusicaTranquila();
            if (cancion) {
                crearAudioElement(cancion.urlAudio, 0, muteGuardado);
                localStorage.setItem('musica_url', cancion.urlAudio);
            }
        }
    }

    window.addEventListener('beforeunload', guardarEstado);
    inicializar();
})();
