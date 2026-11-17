import { useRef, useState } from 'react';
import { MapPin, Clock, Gift, Shirt, Copy, Check, Church, Wine, Utensils, Music, GiftIcon, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Countdown } from './components/Countdown';
import { RsvpForm } from './components/RsvpForm';
import headerBg from './assets/Martin-y-Pau-97.jpg'; 
import loveMeTender from './assets/love-me-tender.mp3';

const galleryPhotos = [
  {
    src: new URL('./assets/Martin-y-Pau-19.jpg', import.meta.url).href,
    alt: 'Paula y Martin abrazados durante la sesión',
    className: 'object-center',
  },
  {
    src: new URL('./assets/Martin-y-Pau-7.jpg', import.meta.url).href,
    alt: 'Paula y Martin compartiendo un beso',
    className: 'object-center',
  },
  {
    src: new URL('./assets/Martin-y-Pau-6.jpg', import.meta.url).href,
    alt: 'Paula y Martin abrazados bajo un gran árbol',
    className: 'object-bottom',
  },
  {
    src: new URL('./assets/Martin-y-Pau-13.jpg', import.meta.url).href,
    alt: 'Paula y Martin juntos durante una caminata',
    className: 'object-[65%_center]',
  },
  {
    src: new URL('./assets/Martin-y-Pau-47.jpg', import.meta.url).href,
    alt: 'Paula y Martin abrazados en el parque',
    className: 'object-center',
  },
];

const itineraryPhotos = [

  {
    src: new URL('./assets/Martin-y-Pau-117.jpg', import.meta.url).href,
    alt: 'Paula y Martin durante su sesión de fotos',
  },
  {
    src: new URL('./assets/Martin-y-Pau-30.jpg', import.meta.url).href,
    alt: 'Paula y Martin durante su sesión de fotos',
  },
  {
    src: new URL('./assets/Martin-y-Pau-123.jpg', import.meta.url).href,
    alt: 'Paula y Martin durante su sesión de fotos',
  },
];

const fallingPetals = [
  { left: 7, delay: -8, duration: 16, size: 10 },
  { left: 17, delay: -2, duration: 19, size: 8 },
  { left: 28, delay: -12, duration: 17, size: 12 },
  { left: 39, delay: -5, duration: 20, size: 9 },
  { left: 51, delay: -15, duration: 18, size: 11 },
  { left: 63, delay: -7, duration: 16, size: 8 },
  { left: 74, delay: -11, duration: 21, size: 12 },
  { left: 86, delay: -4, duration: 17, size: 9 },
  { left: 95, delay: -13, duration: 19, size: 10 },
];

function FallingPetals({ variant }: { variant: 'cover' | 'invitation' }) {
  const sizeMultiplier = variant === 'invitation' ? 1.4 : 1;
  const className = variant === 'invitation'
    ? 'falling-petals falling-petals--invitation'
    : 'falling-petals';

  return (
    <div className={className} aria-hidden="true">
      {fallingPetals.map((petal) => (
        <span
          key={petal.left}
          className={`falling-petal falling-petal--${petal.left % 3}`}
          style={{
            left: `${petal.left}%`,
            width: `${petal.size * sizeMultiplier}px`,
            height: `${petal.size * sizeMultiplier * 1.6}px`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function App() {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [isInvitationMounted, setIsInvitationMounted] = useState(false);
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [isEnvelopeOpening, setIsEnvelopeOpening] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const openInvitation = () => {
    if (isEnvelopeOpening) return;

    setIsEnvelopeOpening(true);
    setIsInvitationMounted(true);
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          setMusicError('Toca play para escuchar la música.');
          return;
        }

        console.error('No se pudo iniciar la música.', error);
        setMusicError('No se pudo reproducir la música. Intenta de nuevo.');
      });
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const openingDelay = prefersReducedMotion ? 0 : 750;
    const fadeDuration = prefersReducedMotion ? 0 : 1300;

    window.setTimeout(() => {
      setIsInvitationOpen(true);
      if (fadeDuration === 0) {
        setIsIntroVisible(false);
        return;
      }

      window.setTimeout(() => setIsIntroVisible(false), fadeDuration);
    }, openingDelay);
  };

  const handleCopyClabe = () => {
    navigator.clipboard.writeText('012180015489234567');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleMusicPlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      setMusicError(null);
      try {
        await audio.play();
      } catch (error) {
        if (error instanceof DOMException) {
          setMusicError('No se pudo reproducir la música. Intenta de nuevo.');
          return;
        }
        throw error;
      }
    } else {
      audio.pause();
    }
  };

  const toggleMusicMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMusicMuted(audio.muted);
  };

  const timeline = [
    { time: '16:45', title: 'Ceremonia Religiosa', desc: 'Parroquia de Nuestra Señora del Carmen La Sabatina', icon: Church },
    { time: '18:30', title: 'Recepción & Cóctel de Bienvenida', desc: 'Salón Gaudí', icon: Wine },
    { time: '19:00', title: 'Fiesta', desc: 'Finaliza a las 03:00 AM', icon: Music },
    
  ];

  return (
    <div className={`min-h-screen bg-ivory text-stone-800${isInvitationOpen ? '' : ' h-screen overflow-hidden'}`}>
      <audio
        ref={audioRef}
        src={loveMeTender}
        loop
        preload="none"
        onPlay={() => setIsMusicPlaying(true)}
        onPause={() => setIsMusicPlaying(false)}
        onError={() => setMusicError('No se pudo cargar la música.')}
        className="hidden"
      />
      {isIntroVisible && (
        <main
          className={`invitation-intro fixed inset-0 z-[100] flex h-screen min-h-screen items-center justify-center overflow-hidden px-5 py-12 text-center${isInvitationOpen ? ' is-fading-out' : ''}`}
          aria-hidden={isInvitationOpen}
        >
          <div className="invitation-intro__glow invitation-intro__glow--one" aria-hidden="true" />
          <div className="invitation-intro__glow invitation-intro__glow--two" aria-hidden="true" />
          <FallingPetals variant="cover" />
          <div className="invitation-intro__content relative z-10 mx-auto flex w-full max-w-xl flex-col items-center">
            <p className="mb-2 text-[10px] uppercase tracking-[0.38em] text-[#8f5960] sm:text-xs">
              Una invitación para celebrar juntos
            </p>
            <h1 className="font-editorial text-4xl font-light text-[#702D3A] sm:text-5xl">
              Paula <span className="italic text-[#bd8887]">&</span> Martin
            </h1>
            <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-[#957c6a]">
              06 · 02 · 2027
            </p>

            <div
              className={`invitation-envelope mt-12${isEnvelopeOpening ? ' is-opening' : ''}`}
              aria-label="Sobre de invitación"
            >
              <div className="invitation-envelope__back" />
              <div className="invitation-envelope__letter">
                <span className="font-editorial text-sm italic text-[#9b7770]">Con mucho amor</span>
                <span className="font-editorial text-2xl text-[#702D3A] sm:text-3xl">Paula & Martin</span>
                <span className="mt-1 text-[9px] uppercase tracking-[0.24em] text-[#a88f78]">Nos casamos</span>
              </div>
              <div className="invitation-envelope__front" />
              <div className="invitation-envelope__flap" />
              <div className="invitation-envelope__seal" aria-hidden="true">
                <span className="font-editorial text-xl italic">P<span className="text-[#e7c7bc]">&</span>M</span>
              </div>
            </div>

            <button
              type="button"
              onClick={openInvitation}
              disabled={isEnvelopeOpening}
              className="invitation-open-button mt-9 inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.24em] text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#702D3A]"
            >
              {isEnvelopeOpening ? 'Abriendo...' : 'Abrir invitación'}
              {!isEnvelopeOpening && <span aria-hidden="true" className="text-base leading-none">→</span>}
            </button>
            <p className="mt-4 font-editorial text-base italic text-[#9b8175]">
              Será un honor compartir este día contigo
            </p>
          </div>
        </main>
      )}
      {isInvitationMounted && (
      <div
        className={`invitation-page min-h-screen bg-ivory text-stone-800${isInvitationOpen ? ' is-visible' : ''}`}
        aria-hidden={!isInvitationOpen}
      >
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        {musicError && (
          <span role="status" className="absolute bottom-full right-0 mb-2 whitespace-nowrap rounded bg-[#702D3A] px-3 py-2 text-xs text-white shadow-lg">
            {musicError}
          </span>
        )}
        <button
          type="button"
          onClick={() => void toggleMusicPlayback()}
          aria-label={isMusicPlaying ? 'Pausar música' : 'Reproducir música'}
          title={isMusicPlaying ? 'Pausar música' : 'Reproducir música'}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#702D3A] text-white shadow-lg transition hover:bg-[#57232D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {isMusicPlaying
            ? <Pause aria-hidden="true" className="h-5 w-5" />
            : <Play aria-hidden="true" className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={toggleMusicMute}
          aria-label={isMusicMuted ? 'Activar sonido' : 'Silenciar música'}
          title={isMusicMuted ? 'Activar sonido' : 'Silenciar música'}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#702D3A] text-white shadow-lg transition hover:bg-[#57232D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {isMusicMuted
            ? <VolumeX aria-hidden="true" className="h-5 w-5" />
            : <Volume2 aria-hidden="true" className="h-5 w-5" />}
        </button>
      </div>

      {/* 1. HERO SECTION */}
      <header className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              `url(${headerBg})`,
          }}
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 text-white max-w-2xl mx-auto space-y-6">
          {/* Monograma Minimalista en Contorno */}
          <div className="w-20 h-20 mx-auto rounded-full border border-white/60 flex items-center justify-center">
            <span className="font-editorial text-2xl tracking-widest font-light">P & M</span>
          </div>

          <p className="text-xs uppercase tracking-[0.35em] text-white/90">¡Nos Casamos!</p>

          <h1 className="font-editorial text-5xl sm:text-7xl font-light tracking-wide">
            Paula & Martin
          </h1>

          <div className="w-16 h-[1px] bg-white/60 mx-auto" />

          <p className="font-editorial italic text-xl sm:text-2xl text-white/95">
            06 de Febrero de 2027 · Ciudad de México
          </p>
        </div>

        <a
          href="#historia"
          className="absolute bottom-10 z-10 text-white/80 text-[11px] uppercase tracking-[0.3em] animate-bounce"
        >
          Desliza
        </a>
      </header>

      {/* 2. MENSAJE Y PADRES */}
      <section id="historia" className="py-24 px-6 max-w-3xl mx-auto text-center space-y-10">
        <p className="font-editorial italic text-2xl sm:text-3xl text-stone-700 leading-relaxed">
          “Dicen que el hogar no es un lugar, sino una persona. Nosotros decidimos construir el nuestro para toda la vida.”
        </p>

        <div className="w-12 h-[1px] bg-gold mx-auto" />

        <div className="grid sm:grid-cols-2 gap-8 pt-4">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Padres del Novio</p>
            <p className="font-editorial text-xl">José Martin León</p>
            <p className="font-editorial text-xl">Claudia Cedillo</p>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Madre de la Novia</p>
            <p className="font-editorial text-xl"> </p>
            <p className="font-editorial text-xl">María de Lourdes Robles</p>
          </div>
        </div>
      </section>

      {/* SAVE THE DATE GALLERY */}
      <section className="py-20 px-6 bg-champagne/30 border-y border-stone-200/70">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Nuestros recuerdos</p>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light">Galería de fotos</h2>
          </div>

          <div
            className="relative mx-auto h-[27rem] max-w-5xl overflow-hidden sm:h-[34rem]"
            style={{ perspective: '1200px' }}
            role="region"
            aria-roledescription="carrusel"
            aria-label="Galería de fotos"
          >
            {galleryPhotos.map((photo, index) => {
              const relativeIndex = (index - activePhotoIndex + galleryPhotos.length) % galleryPhotos.length;
              const offset = relativeIndex > galleryPhotos.length / 2
                ? relativeIndex - galleryPhotos.length
                : relativeIndex;
              const distance = Math.abs(offset);

              if (distance > 2) return null;

              return (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => setActivePhotoIndex(index)}
                  aria-label={`Mostrar foto ${index + 1} de ${galleryPhotos.length}: ${photo.alt}`}
                  aria-current={offset === 0 ? 'true' : undefined}
                  className="absolute left-1/2 top-1/2 h-[22rem] w-[min(66vw,19rem)] overflow-hidden rounded-lg border border-white shadow-xl transition-all duration-500 ease-out motion-reduce:transition-none sm:h-[28rem] sm:w-[20rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  style={{
                    transform: `translate(-50%, -50%) translateX(${offset * 72}%) translateZ(-${distance * 80}px) rotateY(${-offset * 28}deg) scale(${1 - distance * 0.1})`,
                    opacity: distance === 0 ? 1 : distance === 1 ? 0.82 : 0.42,
                    zIndex: 10 - distance,
                  }}
                >
                  <img
                    src={photo.src}
                    alt=""
                    loading={distance === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className={`h-full w-full object-cover ${photo.className}`}
                  />
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setActivePhotoIndex((index) => (index - 1 + galleryPhotos.length) % galleryPhotos.length)}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-stone-700/80 p-2 text-white transition hover:bg-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:left-6"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setActivePhotoIndex((index) => (index + 1) % galleryPhotos.length)}
              aria-label="Foto siguiente"
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-stone-700/80 p-2 text-white transition hover:bg-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:right-6"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-4 text-center text-xs tracking-widest text-stone-500" aria-live="polite">
            {activePhotoIndex + 1} / {galleryPhotos.length}
          </p>
        </div>
      </section>

      {/* 3. CUENTA REGRESIVA */}
      <section className="py-16 px-6 bg-champagne/60 border-y border-stone-200/70">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Faltan</p>
          <Countdown targetDate="2027-02-06T17:00:00" />
        </div>
      </section>

      {/* 4. UBICACIONES */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Dónde & Cuándo</p>
          <h2 className="font-editorial text-4xl sm:text-5xl font-light">Ceremonia & Recepción</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-10 border border-stone-200 text-center space-y-4">
            <Church className="w-8 h-8 mx-auto text-gold stroke-[1.2]" />
            <h3 className="font-editorial text-3xl">Ceremonia Religiosa</h3>
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-stone-500">
              <Clock className="w-3.5 h-3.5" /> 16:45 HRS
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
            Parroquia de Nuestra Señora del Carmen La Sabatina <br />
            Fernando Montes de Oca 150, San Miguel Chapultepec I Sección, Miguel Hidalgo, 11850 Ciudad de México, CDMX
            </p>
            <div className="pt-3">
              <a
                href="https://maps.app.goo.gl/MAciPAmsgVWjd3Zt5"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-stone-800 text-xs uppercase tracking-widest hover:bg-stone-800 hover:text-white transition"
              >
                <MapPin className="w-3.5 h-3.5" /> Ver Mapa
              </a>
            </div>
          </div>

          <div className="bg-white p-10 border border-stone-200 text-center space-y-4">
            <Wine className="w-8 h-8 mx-auto text-gold stroke-[1.2]" />
            <h3 className="font-editorial text-3xl">Recepción</h3>
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-stone-500">
              <Clock className="w-3.5 h-3.5" /> 18:30 HRS
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Salón Gaudí<br />
              Av Constituyentes 800, Lomas Altas, Miguel Hidalgo, 11950 Ciudad de México, CDMX
            </p>
            <div className="pt-3">
              <a
                href="https://maps.app.goo.gl/dg4N8mSpAuDkntZa9"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-stone-800 text-xs uppercase tracking-widest hover:bg-stone-800 hover:text-white transition"
              >
                <MapPin className="w-3.5 h-3.5" /> Ver Mapa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ITINERARIO */}
      <section className="py-24 px-6 bg-champagne/40 border-y border-stone-200/70">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Programa</p>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light">Itinerario</h2>
          </div>

          <div className="relative border-l border-gold/50 ml-6 sm:ml-1/2 space-y-12">
            {timeline.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative pl-10">
                  <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-ivory border border-gold flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gold stroke-[1.5]" />
                  </div>
                  <span className="text-xs tracking-widest text-gold font-medium">{item.time} HRS</span>
                  <h3 className="font-editorial text-2xl mt-0.5">{item.title}</h3>
                  <p className="text-sm text-stone-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ITINERARY PHOTO STRIP */}
      <section className="py-16 px-6 bg-ivory border-b border-stone-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Un día para recordar</p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-light">Momentos especiales</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
            {itineraryPhotos.map((photo) => (
              <figure key={photo.src} className="group aspect-[4/3] overflow-hidden border border-white shadow-sm">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DRESS CODE & MESA DE REGALOS */}
      <section className="py-24 px-6 max-w-4xl mx-auto grid md:grid-cols-2 gap-12 text-center">
        <div className="space-y-4 p-8 bg-white border border-stone-200">
          <Shirt className="w-8 h-8 mx-auto text-gold stroke-[1.2]" />
          <h3 className="font-editorial text-3xl">Código de Vestimenta</h3>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Etiqueta Rigurosa</p>
          <p className="text-sm text-stone-600 leading-relaxed">
            Mujeres: Vestido largo.<br />
            Hombres: Smoking o traje oscuro.<br />
            <span className="italic text-xs text-stone-400">(Blanco y marfil reservados para la novia; verde olivo exclusivo para damas y caballeros de honor.)</span>
          </p>
        </div>

        <div className="space-y-4 p-8 bg-white border border-stone-200">
          <Gift className="w-8 h-8 mx-auto text-gold stroke-[1.2]" />
          <h3 className="font-editorial text-3xl">Mesa de Regalos</h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            Su presencia es nuestro mejor regalo, pero si desean tener un detalle con nosotros:
          </p>
          <div className="bg-ivory p-4 border border-stone-200 text-xs space-y-1">
            <p className="uppercase tracking-widest text-stone-400">Liverpool</p>
            <p className="font-mono text-sm text-stone-800"></p>
            <div className="pt-3">
              <a
                href="https://mesaderegalos.liverpool.com.mx/milistaderegalos/60060822"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-stone-800 text-xs uppercase tracking-widest hover:bg-stone-800 hover:text-white transition"
              >
                <GiftIcon className="w-3.5 h-3.5" /> Ver Mesa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. RSVP */}
      <section id="rsvp" className="py-24 px-6 bg-champagne/60 border-t border-stone-200">
        <div className="text-center mb-12 max-w-xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">R.S.V.P.</p>
          <h2 className="font-editorial text-4xl sm:text-5xl font-light mb-3">Confirma tu Asistencia</h2>
          <p className="text-sm text-stone-600">
            Por favor confírmanos tu asistencia antes del 5 de Diciembre de 2026.
          </p>
        </div>

        <RsvpForm />
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center bg-[#702D3A] text-stone-400 text-xs tracking-widest ">
        <p className="font-editorial text-2xl text-white mb-2">Paula Robles & Martin León</p>
        <p>06 · 02 · 2027</p>
      </footer>
      </div>
      )}
      {isInvitationOpen && <FallingPetals variant="invitation" />}
    </div>
  );
}

export default App;
