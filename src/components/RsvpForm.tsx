import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { GuestRsvp, RsvpPayload } from '../types/wedding';

const API_URL = import.meta.env.VITE_API_URL
  || `${window.location.protocol}//${window.location.hostname}:5000`;
const API_BASE_URL = `${API_URL.replace(/\/+$/, '')}/api`;

export function RsvpForm() {
  const [code, setCode] = useState('');
  const [guest, setGuest] = useState<GuestRsvp | null>(null);
  const [isAttending, setIsAttending] = useState<boolean>(true);
  const [passes, setPasses] = useState<number>(1);
  const [dietary, setDietary] = useState('');
  const [song, setSong] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'submitted' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchGuestByCode = async (inviteCode: string) => {
    if (!inviteCode.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/rsvp/${inviteCode.trim()}`);
      if (!res.ok) throw new Error('No encontramos ese código. Verifica tu invitación.');
      const data: GuestRsvp = await res.json();
      setGuest(data);
      setPasses(data.confirmedPasses > 0 ? data.confirmedPasses : data.maxPasses);
      if (data.isAttending !== null) setIsAttending(data.isAttending);
      if (data.dietaryRestrictions) setDietary(data.dietaryRestrictions);
      if (data.songRequest) setSong(data.songRequest);
      if (data.messageForCouple) setMessage(data.messageForCouple);
      setStatus('idle');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con el servidor.');
      setStatus('error');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invParam = params.get('inv');
    if (invParam) {
      setCode(invParam);
      fetchGuestByCode(invParam);
    }
  }, []);

  const handleSearchCode = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGuestByCode(code);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest) return;
    setStatus('loading');

    const payload: RsvpPayload = {
      invitationCode: guest.invitationCode,
      isAttending,
      confirmedPasses: isAttending ? passes : 0,
      dietaryRestrictions: dietary,
      songRequest: song,
      messageForCouple: message,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/rsvp/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Ocurrió un error al guardar tu respuesta.');
      setStatus('submitted');
    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  if (status === 'submitted') {
    return (
      <div className="max-w-md mx-auto p-10 bg-white border border-stone-200 text-center shadow-sm">
        <CheckCircle2 className="w-10 h-10 text-gold mx-auto mb-4 stroke-[1.2]" />
        <h3 className="font-editorial text-3xl text-stone-800 mb-2">¡Gracias por confirmar!</h3>
        <p className="text-stone-600 text-sm leading-relaxed">
          Hemos registrado la respuesta para <span className="font-medium">{guest?.guestName}</span>.
          {isAttending ? ` Nos dará mucha alegría celebrar contigo (${passes} ${passes === 1 ? 'pase' : 'pases'}).` : ' Te extrañaremos mucho ese día.'}
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-xs uppercase tracking-widest text-stone-500 underline hover:text-stone-800"
        >
          Modificar respuesta
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {!guest ? (
        <form onSubmit={handleSearchCode} className="space-y-4 bg-white p-8 border border-stone-200 shadow-sm">
          <p className="text-sm text-stone-600 text-center leading-relaxed">
            Ingresa tu código de invitado (ej. <span className="font-mono text-xs bg-stone-100 px-1.5 py-0.5">INV-001</span>) para acceder a tus pases.
          </p>
          <input
            type="text"
            placeholder="CÓDIGO DE INVITACIÓN"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 text-center tracking-widest text-sm focus:outline-none focus:border-gold uppercase"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3.5 bg-stone-800 text-white tracking-[0.2em] text-xs uppercase hover:bg-stone-700 transition disabled:opacity-50"
          >
            {status === 'loading' ? 'Buscando...' : 'Buscar Invitación'}
          </button>
          {errorMsg && <p className="text-red-600 text-xs text-center pt-1">{errorMsg}</p>}
        </form>
      ) : (
        <form onSubmit={handleConfirm} className="space-y-5 bg-white p-8 border border-stone-200 shadow-sm">
          <div className="text-center border-b border-stone-100 pb-5">
            <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400">Invitación reservada para</p>
            <h3 className="font-editorial text-3xl text-stone-800 mt-1">{guest.guestName}</h3>
            <p className="text-xs text-gold mt-1 tracking-wider uppercase">
              {guest.maxPasses} {guest.maxPasses === 1 ? 'Pase asignado' : 'Pases asignados'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsAttending(true)}
              className={`py-3 text-xs uppercase tracking-widest border transition ${
                isAttending
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-ivory text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              Asistiré
            </button>
            <button
              type="button"
              onClick={() => setIsAttending(false)}
              className={`py-3 text-xs uppercase tracking-widest border transition ${
                !isAttending
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-ivory text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              No podré ir
            </button>
          </div>

          {isAttending && (
            <>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-stone-500 mb-1.5">
                  Número de asistentes
                </label>
                <select
                  value={passes}
                  onChange={(e) => setPasses(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-stone-300 bg-white text-sm focus:outline-none focus:border-gold"
                >
                  {Array.from({ length: guest.maxPasses }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Persona' : 'Personas'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-stone-500 mb-1.5">
                  Alergias o restricciones alimenticias
                </label>
                <input
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="Opcional"
                  className="w-full px-3 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-stone-500 mb-1.5">
                  Canción que no puede faltar
                </label>
                <input
                  type="text"
                  value={song}
                  onChange={(e) => setSong(e.target.value)}
                  placeholder="Artista - Canción"
                  className="w-full px-3 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-gold"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-stone-500 mb-1.5">
              Mensaje para los novios
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tus buenos deseos..."
              className="w-full px-3 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3.5 bg-stone-800 text-white tracking-[0.2em] text-xs uppercase hover:bg-stone-700 transition"
          >
            {status === 'loading' ? 'Guardando...' : 'Confirmar Respuesta'}
          </button>

          <button
            type="button"
            onClick={() => { setGuest(null); setCode(''); }}
            className="w-full text-center text-[11px] uppercase tracking-widest text-stone-400 hover:text-stone-600"
          >
            Cambiar código de invitado
          </button>
        </form>
      )}
    </div>
  );
}
