import {colors} from './colors';

export type PaletteColors = Record<keyof typeof colors, string>;
export const palettes = {
  sand: {label: 'Trắng & Than chì', colors: {...colors, accent: '#9A5700'}},
  ocean: {label: 'Xanh biển & Trắng', colors: {...colors, background: '#F1F6FD', surface: '#FFFFFF', primary: '#183B66', primaryText: '#FFFFFF', secondary: '#93C5FD', accent: '#235FA4', accentSoft: '#DFECFC', text: '#17324F', textMuted: '#52677D', border: '#CEDCEC', muted: '#E5EDF7'}},
  forest: {label: 'Xanh rừng & Trắng', colors: {...colors, background: '#FFFFFF', surface: '#FFFFFF', primary: '#284D3A', primaryText: '#FFFFFF', secondary: '#BAD49C', accent: '#3F6A37', accentSoft: '#E3EDD7', text: '#243D2E', textMuted: '#586756', border: '#D0DCC5', muted: '#E8EDDF'}},
  rose: {label: 'Hồng đất & Ngà', colors: {...colors, background: '#FCF3F0', surface: '#FFFCFA', primary: '#713F45', primaryText: '#FFFFFF', secondary: '#EAB7B1', accent: '#9A4552', accentSoft: '#F7E1DE', text: '#503237', textMuted: '#796167', border: '#E9D2CE', muted: '#F2E5E1'}},
} satisfies Record<string, {label: string; colors: PaletteColors}>;
export type PaletteId = keyof typeof palettes;
