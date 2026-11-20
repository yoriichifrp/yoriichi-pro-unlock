import { useState } from 'react';
import { YoriichiArt } from './YoriichiArt';

/*
  Retrato del personaje en el Hero.

  Prioridad de resolución (sin peticiones fallidas):
  1) src/assets/yoriichi-original.(png|webp|jpg|jpeg|avif)
     -> Vite la empaqueta con hash. Es la opción recomendada.
  2) public/images/yoriichi-original.(png|webp|jpg|jpeg)
     -> la ruta que indica el brief; vite.config.js la detecta al compilar.
  3) Si no hay ninguna imagen, se mantiene la ilustración vectorial existente para
     que la portada nunca quede vacía ni con un hueco roto.
*/
const bundled = import.meta.glob('../assets/yoriichi-original.{png,webp,jpg,jpeg,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const bundledUrl = Object.values(bundled)[0];

const publicUrl = typeof __HERO_IMAGE__ !== 'undefined' ? __HERO_IMAGE__ : null;

const SRC = bundledUrl || publicUrl || null;

export function HeroPortrait() {
  const [broken, setBroken] = useState(false);

  if (!SRC || broken) {
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
        src={SRC}
        alt="Yoriichi Tsugikuni con su haori carmesí, sus pendientes hanafuda y su katana Nichirin"
        width="880"
        height="702"
        decoding="async"
        onError={() => setBroken(true)}
      />
    </div>
  );
}
