export class Color {

  public static readonly Black = new Color(0, 0, 0);
  public static readonly White = new Color(255, 255, 255);
  public static readonly Red = new Color(255, 0, 0);
  public static readonly Green = new Color(0, 255, 0);
  public static readonly Blue = new Color(0, 0, 255);
  public static readonly Yellow = new Color(255, 255, 0);
  public static readonly Cyan = new Color(0, 255, 255);
  public static readonly Magenta = new Color(255, 0, 255);

  public readonly r: number;
  public readonly g: number;
  public readonly b: number;
  public readonly a: number;

  public constructor(r: number, g: number, b: number, a: number = 1) {
    if (!Color.IsValidChannel(r)) {
      throw new Error(`Invalid red channel value: ${r}`);
    }

    if (!Color.IsValidChannel(g)) {
      throw new Error(`Invalid green channel value: ${g}`);
    }

    if (!Color.IsValidChannel(b)) {
      throw new Error(`Invalid blue channel value: ${b}`);
    }

    if (!Color.IsValidChannel(a, true)) {
      throw new Error(`Invalid alpha channel value: ${a}`);
    }

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  public static IsValidChannel(v: number, isAlpha = false): boolean {
    const max = isAlpha ? 1 : 255

    if (v < 0 || v > max) {
      return false
    }

    if(!isAlpha && v % 1 !== 0){
      return false
    }

    return true
  }

  public static fromHex(hex: string): Color {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = parseInt(hex.slice(7, 9), 16) / 255;

    return new Color(r, g, b, a);
  }
  
  public static fromHsl(h: number, s: number, l: number, a: number = 1): Color {
    let r = 0;
    let g = 0;
    let b = 0;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return new Color(r * 255, g * 255, b * 255, a);
  }

  public static fromHsv(h: number, s: number, v: number, a: number = 1): Color {
    let r = 0;
    let g = 0;
    let b = 0;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    return new Color(r * 255, g * 255, b * 255, a);
  }

  public toHex(): string {
    const r = Math.round(this.r).toString(16).padStart(2, '0');
    const g = Math.round(this.g).toString(16).padStart(2, '0');
    const b = Math.round(this.b).toString(16).padStart(2, '0');
    const a = Math.round(this.a * 255).toString(16).padStart(2, '0');

    return `#${r}${g}${b}${a}`;
  }

  public toHsl(): { h: number; s: number; l: number; a: number } {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const a = this.a;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return { h, s, l, a };
  }

  public toHsv(): { h: number; s: number; v: number; a: number } {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const a = this.a;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    const s = max === 0 ? 0 : 1 - min / max;
    const v = max;

    if (max !== min) {
      switch (max) {
        case r:
          h = (g - b) / (max - min) + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / (max - min) + 2;
          break;
        case b:
          h = (r - g) / (max - min) + 4;
          break;
      }

      h /= 6;
    }

    return { h, s, v, a };
  }
}