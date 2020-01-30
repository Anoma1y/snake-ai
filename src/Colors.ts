import {TRGBArray, TRGBObject} from "./types";

class Colors {
  public static interpolationColors(color_1: string, color_2: string, steps: number): string[] {
    const colors: [TRGBArray, TRGBArray] = [
      this.getRGBFromString(color_1),
      this.getRGBFromString(color_2)
    ];

    if (steps === 1) return [`rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`];

    const factor = 1 / (steps - 1);
    const interpolatedColors: TRGBArray[] = [];

    for(let i = 0; i < steps; i++) {
      const interpolateColor = colors[0].slice();

      for (let j = 0; j < 3; j++) {
        interpolateColor[j] = Math.round(interpolateColor[j] + (factor * i) * (colors[1][j] - colors[0][j]));
      }

      interpolatedColors.push(interpolateColor as TRGBArray);
    }

    return interpolatedColors.map(color => this.getRGB(color));
  }

  public static getRGBFromString(color: string): TRGBArray {
    return (color.match(/\d+/g)!.map(Number) as TRGBArray)
  }

  public static getRGB(data: TRGBObject | TRGBArray) {
    if (Array.isArray(data)) {
      return `rgb(${data[0]}, ${data[1]}, ${data[2]})`
    }

    return `rgb(${data['red']}, ${data['green']}, ${data['blue']})`
  }
}

export default Colors;
