import { useId } from 'react';

/**
 * Yoriichi Tsugikuni — ilustración vectorial original construida en SVG puro.
 *
 * Rasgos reconocibles del personaje: melena larga negra con puntas rojizas,
 * marca de fuego en la frente, pendientes hanafuda rectangulares con sol,
 * ojos rojizos de mirada seria, uniforme oscuro de espadachín, haori carmesí,
 * katana tradicional con energía y luna carmesí al fondo.
 *
 * Todo el dibujo es geometría propia: no usa imágenes externas, fotografías
 * ni material protegido.
 */
export function YoriichiArt({ className = '' }) {
  const uid = useId().replace(/:/g, '');
  const g = (name) => `${name}-${uid}`;

  return (
    <svg
      className={`yoriichi-art ${className}`.trim()}
      viewBox="0 0 460 640"
      role="img"
      aria-labelledby={g('title')}
      preserveAspectRatio="xMidYMax meet"
    >
      <title id={g('title')}>
        Ilustración original de Yoriichi Tsugikuni: espadachín de melena negra rojiza, marca de fuego
        en la frente, pendientes hanafuda, haori carmesí y katana con energía
      </title>

      <defs>
        <radialGradient id={g('halo')} cx="50%" cy="42%" r="56%">
          <stop offset="0%" stopColor="#c8102e" stopOpacity="0.5" />
          <stop offset="52%" stopColor="#78091a" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#05060c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={g('moon')} cx="42%" cy="36%" r="64%">
          <stop offset="0%" stopColor="#ff9b74" />
          <stop offset="38%" stopColor="#e23a2c" />
          <stop offset="76%" stopColor="#9c0f1f" />
          <stop offset="100%" stopColor="#38050a" />
        </radialGradient>
        <linearGradient id={g('skin')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f9e0cc" />
          <stop offset="52%" stopColor="#e8bda3" />
          <stop offset="100%" stopColor="#c88f7b" />
        </linearGradient>
        <linearGradient id={g('skinShadow')} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#c98a72" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8a5348" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id={g('hair')} x1="0.25" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#282a3a" />
          <stop offset="40%" stopColor="#15151f" />
          <stop offset="100%" stopColor="#07070d" />
        </linearGradient>
        <linearGradient id={g('hairTip')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a1220" stopOpacity="0" />
          <stop offset="52%" stopColor="#71182a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#a51b2e" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={g('haori')} x1="0.08" y1="0" x2="0.92" y2="1">
          <stop offset="0%" stopColor="#941426" />
          <stop offset="44%" stopColor="#570a17" />
          <stop offset="100%" stopColor="#1a0207" />
        </linearGradient>
        <linearGradient id={g('uniform')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1d2432" />
          <stop offset="52%" stopColor="#0b0f19" />
          <stop offset="100%" stopColor="#04060c" />
        </linearGradient>
        <linearGradient id={g('blade')} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#9fd8ff" />
          <stop offset="42%" stopColor="#f8fdff" />
          <stop offset="100%" stopColor="#d3eaff" />
        </linearGradient>
        <linearGradient id={g('energy')} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff2f2f" stopOpacity="0" />
          <stop offset="46%" stopColor="#ff6a3c" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffd27a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={g('gold')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbecc0" />
          <stop offset="46%" stopColor="#e0b45c" />
          <stop offset="100%" stopColor="#9a6c22" />
        </linearGradient>
        <radialGradient id={g('eye')} cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#ff9a62" />
          <stop offset="52%" stopColor="#e0242c" />
          <stop offset="100%" stopColor="#680612" />
        </radialGradient>
        <filter id={g('soft')} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={g('glow')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={g('fire')} x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="13" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ---------- Atmósfera: halo carmesí y luna roja ---------- */}
      <ellipse cx="244" cy="318" rx="214" ry="284" fill={`url(#${g('halo')})`} />
      <g className="yo-moon">
        <circle cx="320" cy="170" r="126" fill={`url(#${g('moon')})`} opacity="0.52" />
        <circle cx="320" cy="170" r="126" fill="none" stroke="#ff9a7a" strokeOpacity="0.3" strokeWidth="1.2" />
        <circle cx="320" cy="170" r="110" fill="none" stroke="#3d0509" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="2 14" />
      </g>

      {/* ---------- Melena posterior ---------- */}
      <path
        d="M232 124 C176 124 140 164 136 228 C132 296 118 362 104 432 C92 490 92 556 100 626 L170 626 C158 544 160 472 174 414 C150 380 146 318 152 266 C158 212 182 174 232 166 C282 174 306 212 312 266 C318 318 314 380 290 414 C304 472 306 544 294 626 L364 626 C372 556 372 490 360 432 C346 362 332 296 328 228 C324 164 288 124 232 124 Z"
        fill={`url(#${g('hair')})`}
      />
      <path
        d="M136 228 C132 296 118 362 104 432 C92 490 92 556 100 626 L170 626 C158 544 160 472 174 414 C150 380 146 318 152 266 Z"
        fill={`url(#${g('hairTip')})`}
      />
      <path
        d="M328 228 C332 296 346 362 360 432 C372 490 372 556 364 626 L294 626 C306 544 304 472 290 414 C314 380 318 318 312 266 Z"
        fill={`url(#${g('hairTip')})`}
      />

      {/* ---------- Cuello y uniforme ---------- */}
      <path d="M206 286 L206 340 C214 356 250 356 258 340 L258 286 Z" fill={`url(#${g('skin')})`} />
      <path d="M206 286 L206 318 C216 332 248 332 258 318 L258 286 Z" fill={`url(#${g('skinShadow')})`} />

      <path
        d="M186 348 L208 294 L256 294 L278 348 L272 388 L192 388 Z"
        fill={`url(#${g('uniform')})`}
        stroke="#e0b45c"
        strokeOpacity="0.22"
        strokeWidth="1.2"
      />
      <path
        d="M118 640 C106 520 124 424 178 382 L232 404 L286 382 C340 424 358 520 346 640 Z"
        fill={`url(#${g('uniform')})`}
      />
      <g stroke="#38e1ff" strokeOpacity="0.16" strokeWidth="1.2" fill="none">
        <path d="M198 424 L188 560M266 424 L276 560" />
      </g>
      <path d="M232 404 L232 640" stroke="#e0b45c" strokeOpacity="0.2" strokeWidth="1.2" />

      {/* ---------- Haori carmesí ---------- */}
      <path
        d="M178 382 C126 410 98 502 90 640 L214 640 C208 520 214 442 232 404 Z"
        fill={`url(#${g('haori')})`}
        stroke="#12030a"
        strokeOpacity="0.7"
        strokeWidth="1.4"
      />
      <path
        d="M286 382 C338 410 366 502 374 640 L250 640 C256 520 250 442 232 404 Z"
        fill={`url(#${g('haori')})`}
        stroke="#12030a"
        strokeOpacity="0.7"
        strokeWidth="1.4"
      />
      <path d="M232 404 C214 442 208 520 214 640" stroke="#08080f" strokeWidth="11" fill="none" />
      <path d="M232 404 C250 442 256 520 250 640" stroke="#08080f" strokeWidth="11" fill="none" />
      <path d="M232 404 C214 442 208 520 214 640" stroke={`url(#${g('gold')})`} strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
      <path d="M232 404 C250 442 256 520 250 640" stroke={`url(#${g('gold')})`} strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
      <path d="M232 404 L246 420 L232 438 L218 420 Z" fill={`url(#${g('gold')})`} fillOpacity="0.85" stroke="#7a5a1c" strokeWidth="1" />

      {/* ---------- Rostro ---------- */}
      <path
        d="M176 208 C176 168 200 146 232 146 C264 146 288 168 288 208 C288 242 280 272 262 290 C250 302 238 308 232 308 C226 308 214 302 202 290 C184 272 176 242 176 208 Z"
        fill={`url(#${g('skin')})`}
      />
      <path
        d="M176 208 C176 242 184 272 202 290 C214 302 226 308 232 308 C238 308 250 302 262 290 C280 272 288 242 288 208 C288 236 276 262 258 278 C248 288 238 292 232 292 C226 292 216 288 206 278 C188 262 176 236 176 208 Z"
        fill={`url(#${g('skinShadow')})`}
      />

      {/* Orejas */}
      <ellipse cx="176" cy="236" rx="9" ry="15" fill={`url(#${g('skin')})`} stroke="#b98271" strokeOpacity="0.55" strokeWidth="1" />
      <ellipse cx="288" cy="236" rx="9" ry="15" fill={`url(#${g('skin')})`} stroke="#b98271" strokeOpacity="0.55" strokeWidth="1" />

      {/* ---------- Flequillo y mechones ---------- */}
      <path
        d="M176 206 C174 166 196 140 232 138 C268 140 290 166 288 206 C280 176 266 164 246 160 C250 150 246 143 240 141 C236 156 228 166 214 172 C206 162 196 166 190 176 C184 186 180 196 176 206 Z"
        fill={`url(#${g('hair')})`}
      />
      <path d="M180 200 C174 240 176 276 184 302 C175 268 175 232 183 198 Z" fill={`url(#${g('hair')})`} />
      <path d="M284 200 C290 240 288 276 280 302 C289 268 289 232 281 198 Z" fill={`url(#${g('hair')})`} />
      <path d="M196 168 C204 158 214 154 224 154" stroke="#3a3c50" strokeOpacity="0.55" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M268 166 C260 158 250 154 240 154" stroke="#3a3c50" strokeOpacity="0.45" strokeWidth="1.4" fill="none" strokeLinecap="round" />

      {/* ---------- Marca de fuego en la frente ---------- */}
      <g filter={`url(#${g('glow')})`} opacity="0.9">
        <path d="M264 160 C272 171 276 182 272 192 C270 198 262 200 258 194 C254 186 256 173 264 160 Z" fill="#c8102e" fillOpacity="0.92" />
      </g>
      <path
        d="M264 162 C271 172 274 182 271 190 C269 195 263 196 260 191 C257 184 259 173 264 162 Z"
        fill="none"
        stroke="#f7d68a"
        strokeOpacity="0.7"
        strokeWidth="1.1"
      />

      {/* ---------- Cejas serias ---------- */}
      <path d="M188 210 C200 203 214 204 222 210" stroke="#2a1620" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M242 210 C250 204 264 203 276 210" stroke="#2a1620" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* ---------- Ojos rojizos ---------- */}
      <g>
        <path d="M190 236 C196 222 212 219 221 229 C213 240 199 243 190 236 Z" fill="#fdf3ea" />
        <ellipse cx="207" cy="230" rx="6.4" ry="7.6" fill={`url(#${g('eye')})`} />
        <ellipse cx="207" cy="230" rx="2.6" ry="4" fill="#1a0206" />
        <circle cx="204.6" cy="226.4" r="1.7" fill="#ffffff" fillOpacity="0.92" />
        <circle cx="209.4" cy="233" r="1" fill="#ffd27a" fillOpacity="0.85" />
        <path d="M190 235 C198 220 214 218 222 229" stroke="#1a1216" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path d="M190 235 L184 238" stroke="#1a1216" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g>
        <path d="M243 236 C251 222 267 219 274 229 C267 240 253 243 243 236 Z" fill="#fdf3ea" />
        <ellipse cx="257" cy="230" rx="6.4" ry="7.6" fill={`url(#${g('eye')})`} />
        <ellipse cx="257" cy="230" rx="2.6" ry="4" fill="#1a0206" />
        <circle cx="254.6" cy="226.4" r="1.7" fill="#ffffff" fillOpacity="0.92" />
        <circle cx="259.4" cy="233" r="1" fill="#ffd27a" fillOpacity="0.85" />
        <path d="M242 235 C250 220 266 218 274 229" stroke="#1a1216" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path d="M274 235 L280 238" stroke="#1a1216" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* ---------- Nariz y boca ---------- */}
      <path d="M236 248 C231 258 230 264 235 266" stroke="#b98271" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.75" />
      <path d="M218 280 C226 284 238 284 246 279" stroke="#7d3b42" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M221 286 C228 289 236 289 243 286" stroke="#c88f7b" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" fill="none" />

      {/* ---------- Pendientes hanafuda ---------- */}
      <g>
        <path d="M176 248 L170 258" stroke="#e0b45c" strokeWidth="1.4" />
        <rect x="158" y="256" width="20" height="36" rx="3" fill="#f6e7c6" stroke="#c9a24a" strokeWidth="1.4" />
        <circle cx="168" cy="270" r="5.4" fill="#c8102e" />
        <path d="M168 264 v12M162 270 h12" stroke="#f6e7c6" strokeWidth="0.9" strokeOpacity="0.7" />
        <path d="M158 284 H178" stroke="#1a1216" strokeWidth="2" />
        <path d="M160 292 H176" stroke="#8a6220" strokeWidth="1.2" />
      </g>
      <g>
        <path d="M288 248 L294 258" stroke="#e0b45c" strokeWidth="1.4" />
        <rect x="282" y="256" width="20" height="36" rx="3" fill="#f6e7c6" stroke="#c9a24a" strokeWidth="1.4" />
        <circle cx="292" cy="270" r="5.4" fill="#c8102e" />
        <path d="M292 264 v12M286 270 h12" stroke="#f6e7c6" strokeWidth="0.9" strokeOpacity="0.7" />
        <path d="M282 284 H302" stroke="#1a1216" strokeWidth="2" />
        <path d="M284 292 H300" stroke="#8a6220" strokeWidth="1.2" />
      </g>

      {/* ---------- Luces de contorno ---------- */}
      <g filter={`url(#${g('glow')})`} opacity="0.55">
        <path
          d="M136 228 C132 296 118 362 104 432 C92 490 92 556 100 626"
          stroke="#ff3b45"
          strokeWidth="3"
          fill="none"
        />
        <path d="M176 208 C176 246 186 278 204 296" stroke="#ff6a5a" strokeWidth="2.4" fill="none" opacity="0.65" />
      </g>
      <g filter={`url(#${g('glow')})`} opacity="0.45">
        <path
          d="M328 228 C332 296 346 362 360 432 C372 490 372 556 364 626"
          stroke="#38e1ff"
          strokeWidth="2.6"
          fill="none"
        />
      </g>

      {/* ---------- Brazo y empuñadura ---------- */}
      <path
        d="M292 400 C322 412 344 442 352 472 L322 490 C312 460 296 436 278 424 Z"
        fill={`url(#${g('uniform')})`}
        stroke="#e0b45c"
        strokeOpacity="0.16"
        strokeWidth="1"
      />

      {/* ---------- Katana ---------- */}
      <path d="M350 466 C384 408 412 350 434 294" stroke="#9fd8ff" strokeOpacity="0.45" strokeWidth="7" fill="none" filter={`url(#${g('glow')})`} />
      <path
        d="M350 466 C384 408 412 350 434 294 C416 352 390 410 358 474 Z"
        fill={`url(#${g('blade')})`}
        stroke="#f2fbff"
        strokeOpacity="0.85"
        strokeWidth="1"
      />
      <path
        d="M356 468 C388 410 414 352 432 300"
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="1.2"
        fill="none"
        strokeDasharray="6 4"
      />
      <ellipse cx="352" cy="470" rx="14" ry="6" transform="rotate(-28 352 470)" fill={`url(#${g('gold')})`} stroke="#7a5a1c" strokeWidth="1" />
      <path d="M350 474 L322 536" stroke="#161019" strokeWidth="15" strokeLinecap="round" />
      <g stroke="#e0b45c" strokeOpacity="0.45" strokeWidth="1.6">
        <path d="M343 482 L333 484M340 492 L330 494M337 502 L327 504M334 512 L324 514M331 522 L321 524" />
      </g>
      <path d="M322 536 L318 546" stroke={`url(#${g('gold')})`} strokeWidth="5" strokeLinecap="round" />

      {/* Mano sobre la empuñadura */}
      <ellipse cx="338" cy="504" rx="15" ry="17" transform="rotate(-20 338 504)" fill={`url(#${g('skin')})`} stroke="#a86b5f" strokeOpacity="0.6" strokeWidth="1" />
      <g stroke="#b98271" strokeOpacity="0.5" strokeWidth="1.4">
        <path d="M330 494 L348 498M328 504 L346 508M330 514 L347 517" />
      </g>

      {/* ---------- Energía de la katana ---------- */}
      <g filter={`url(#${g('fire')})`} opacity="0.75">
        <path
          className="yo-energy"
          d="M340 500 C382 442 404 372 430 306"
          stroke={`url(#${g('energy')})`}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          className="yo-energy yo-energy-b"
          d="M352 512 C396 456 416 384 440 320"
          stroke={`url(#${g('energy')})`}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* ---------- Brasas y partículas ---------- */}
      <g fill="#ff7a3c">
        <circle className="yo-ember" cx="118" cy="512" r="3" />
        <circle className="yo-ember yo-ember-2" cx="392" cy="470" r="2.4" />
        <circle className="yo-ember yo-ember-3" cx="150" cy="440" r="2" />
        <circle className="yo-ember yo-ember-4" cx="418" cy="560" r="2.8" />
        <circle className="yo-ember yo-ember-5" cx="96" cy="580" r="2.2" />
      </g>
      <g fill="#38e1ff" fillOpacity="0.8">
        <circle className="yo-spark" cx="132" cy="300" r="2" />
        <circle className="yo-spark yo-spark-2" cx="402" cy="352" r="1.8" />
        <circle className="yo-spark yo-spark-3" cx="356" cy="212" r="2.2" />
      </g>
      <ellipse cx="240" cy="628" rx="148" ry="12" fill="#c8102e" fillOpacity="0.18" filter={`url(#${g('soft')})`} />
    </svg>
  );
}
