import { useState } from 'react';
import { YoriichiArt } from './YoriichiArt';

/*
  Slot de imagen real del personaje.

  Orden de resolución:
  1) src/assets/yoriichi-original.{png,webp,jpg,jpeg} -> Vite la empaqueta y se usa
     sin ninguna petición fallida (ruta recomendada si quieres optimización).
  2) public/images/yoriichi-original.png -> ruta pública indicada en el brief.
  3) public/images/yoriichi-original.webp
  4) Si no existe ninguna, se mantiene la ilustración vectorial actual como respaldo
     para que la portada nunca quede vacía ni rota.
*/
const bundled = import.meta.glob('../assets/yoriichi-original.{png,webp,jpg,jpeg,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const bundledUrl = Object.values(bundled)[0];

const SOURCES = [
  bundledUrl,
  '/images/yoriichi-original.png',
  '/images/yoriichi-original.webp',
].filter(Boolean);

export function HeroPortrait() {
  const [index, setIndex] = useState(0);
  const src = SOURCES[index];

  if (!src) {
    return (
      <div className="hero-portrait hero-portrait-fallback" data-portrait-source="vector">
        <YoriichiArt />
      </div>
    );
  }

  return (
    <div className="hero-portrait" data-portrait-source="image">
      <img
        className="hero-portrait-img"
        src={src}
        alt="Yoriichi Tsugikuni, cazador de demonios, con su haori carmesí, sus pendientes hanafuda y su katana Nichirin"
        decoding="async"
        onError={() => setIndex((current) => current + 1)}
      />
    </div>
  );
}
