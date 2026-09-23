// src/data/dakarNeighborhoods.ts

export interface Neighborhood {
  name: string;
  zoneId: 'zone1' | 'zone2' | 'zone3';
  zoneName: string;
  price: number; // en FCFA
}

export const DAKAR_ZONES = {
  zone1: { id: 'zone1', name: 'Dakar Centre & Proche', price: 1000 },
  zone2: { id: 'zone2', name: 'Banlieue Proche', price: 1500 },
  zone3: { id: 'zone3', name: 'Grande Banlieue & Rufisque', price: 2500 },
};

// ⚠️ L'annotation ": Neighborhood[]" est ici, sur le tableau brut, AVANT le
// .sort() — c'est ce qui permet à TypeScript de comprendre que chaque
// "zoneId: 'zone1'" doit être pris comme le type précis 'zone1' | 'zone2' | 'zone3',
// et non comme un simple `string`. Si on annotait seulement la constante finale
// (après le .sort()), ce narrowing ne se ferait pas et TypeScript soulignerait
// une erreur de type.
const rawNeighborhoods: Neighborhood[] = [
  { name: 'Almadies', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Amitié 1 à 3', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Bargny', zoneId: 'zone3', zoneName: DAKAR_ZONES.zone3.name, price: DAKAR_ZONES.zone3.price },
  { name: 'Bel Air', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Cité Keur Gorgui', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Cité Mixta', zoneId: 'zone2', zoneName: DAKAR_ZONES.zone2.name, price: DAKAR_ZONES.zone2.price },
  { name: 'Cité TAC', zoneId: 'zone2', zoneName: DAKAR_ZONES.zone2.name, price: DAKAR_ZONES.zone2.price },
  { name: 'Colobane', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Dakar-Plateau', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Derklé', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Diamniadio', zoneId: 'zone3', zoneName: DAKAR_ZONES.zone3.name, price: DAKAR_ZONES.zone3.price },
  { name: 'Dieuppeul', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Fann Hock', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Fann Résidence', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Fass', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Grand Dakar', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Grand Yoff', zoneId: 'zone2', zoneName: DAKAR_ZONES.zone2.name, price: DAKAR_ZONES.zone2.price },
  { name: 'Guédiawaye', zoneId: 'zone2', zoneName: DAKAR_ZONES.zone2.name, price: DAKAR_ZONES.zone2.price },
  { name: 'Hann Maristes', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'HLM', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Keur Massar', zoneId: 'zone3', zoneName: DAKAR_ZONES.zone3.name, price: DAKAR_ZONES.zone3.price },
  { name: 'Liberté 1 à 6', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Mermoz', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Médina', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Ngor', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Ngaparou / Saly (Hors Dakar)', zoneId: 'zone3', zoneName: DAKAR_ZONES.zone3.name, price: 3500 },
  { name: 'Ouakam', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Parcelles Assainies (Unités 1 à 26)', zoneId: 'zone2', zoneName: DAKAR_ZONES.zone2.name, price: DAKAR_ZONES.zone2.price },
  { name: 'Patte d\'Oie', zoneId: 'zone2', zoneName: DAKAR_ZONES.zone2.name, price: DAKAR_ZONES.zone2.price },
  { name: 'Pikine', zoneId: 'zone2', zoneName: DAKAR_ZONES.zone2.name, price: DAKAR_ZONES.zone2.price },
  { name: 'Point E', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Rufisque', zoneId: 'zone3', zoneName: DAKAR_ZONES.zone3.name, price: DAKAR_ZONES.zone3.price },
  { name: 'Sacré-Cœur 1, 2, 3', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Sebikotane', zoneId: 'zone3', zoneName: DAKAR_ZONES.zone3.name, price: DAKAR_ZONES.zone3.price },
  { name: 'Simbock / Yeumbeul', zoneId: 'zone3', zoneName: DAKAR_ZONES.zone3.name, price: DAKAR_ZONES.zone3.price },
  { name: 'Yoff', zoneId: 'zone1', zoneName: DAKAR_ZONES.zone1.name, price: DAKAR_ZONES.zone1.price },
  { name: 'Zack Mbao', zoneId: 'zone3', zoneName: DAKAR_ZONES.zone3.name, price: DAKAR_ZONES.zone3.price },
];

// Liste complète, triée par ordre alphabétique
export const DAKAR_NEIGHBORHOODS: Neighborhood[] = rawNeighborhoods.sort((a, b) =>
  a.name.localeCompare(b.name, 'fr')
);
