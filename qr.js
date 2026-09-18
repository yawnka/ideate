// QR rendering for the audience vote link.
//
// Wraps `qrcode-generator` (the UTF-8 build, ~4KB) rather than hand-rolling
// an encoder. A QR code either scans or the demo dies in front of an
// audience, so this is deliberately the one place we take a dependency.

import qrcode from 'qrcode-generator';

// The bundled stringToBytes is latin-1 (charCodeAt & 0xff). Vote URLs are
// ASCII so it would work today, but swapping in a real UTF-8 encoder means
// a non-ASCII story id or hostname can never silently corrupt the code.
qrcode.stringToBytes = s => Array.from(new TextEncoder().encode(s));

/**
 * Renders `text` as a crisp, scalable SVG QR code.
 * Type 0 auto-sizes to the payload; 'M' error correction tolerates a
 * projector's glare and a phone camera's bad angle.
 */
export function qrSvg(text, { size = 220, quiet = 4, dark = '#201533', light = '#ffffff' } = {}) {
  const qr = qrcode(0, 'M');
  qr.addData(text, 'Byte');
  qr.make();

  const count = qr.getModuleCount();
  const dim = count + quiet * 2;

  let path = '';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) path += `M${c + quiet} ${r + quiet}h1v1h-1z`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${dim} ${dim}" shape-rendering="crispEdges" role="img" aria-label="QR code to join the vote"><rect width="${dim}" height="${dim}" fill="${light}"/><path d="${path}" fill="${dark}"/></svg>`;
}

/** The raw module grid, for callers that want to draw it themselves. */
export function qrMatrix(text) {
  const qr = qrcode(0, 'M');
  qr.addData(text, 'Byte');
  qr.make();
  const count = qr.getModuleCount();
  return Array.from({ length: count }, (_, r) =>
    Array.from({ length: count }, (_, c) => (qr.isDark(r, c) ? 1 : 0))
  );
}
