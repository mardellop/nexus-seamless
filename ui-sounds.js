(function() {
    // Force scroll to top on reload
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
    });

    // High-end UI Click Sound (Short & Clean)
    let audioCtx;
    
    function playClick() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    }

    document.addEventListener('mousedown', (e) => {
        playClick();
    });

    // El navegador requiere interacción humana antes de reproducir sonidos de UI
    const startAudioContext = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        // Limpiamos listeners una vez que el contexto está listo
        ['mousedown', 'click', 'touchstart'].forEach(event => {
            document.removeEventListener(event, startAudioContext);
        });
    };

    // Activamos el contexto de audio con la primera interacción para los sonidos de clic
    ['mousedown', 'click', 'touchstart'].forEach(event => {
        document.addEventListener(event, startAudioContext, { once: true });
    });
})();
