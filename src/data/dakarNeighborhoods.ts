// src/data/dakarNeighborhoods.ts

export interface Neighborhood {
  name: string;
  zoneId:
    | 'zone1'
    | 'zone2'
    | 'zone3'
    | 'zone4'
    | 'zone5'
    | 'zone6';
  zoneName: string;
  price: number; // en FCFA
}

export const DAKAR_ZONES = {
  zone1: {
    id: 'zone1',
    name: 'Dakar Centre',
    price: 1000,
  },

  zone2: {
    id: 'zone2',
    name: 'Mermoz & Proche',
    price: 1500,
  },

  zone3: {
    id: 'zone3',
    name: 'Dakar Intermédiaire',
    price: 2000,
  },

  zone4: {
    id: 'zone4',
    name: 'Pikine, Guédiawaye & Parcelles',
    price: 2500,
  },

  zone5: {
    id: 'zone5',
    name: 'Thiaroye, Diamaguène & Diacksao',
    price: 3000,
  },

  zone6: {
    id: 'zone6',
    name: 'Grande Banlieue',
    price: 6000,
  },
} as const;


// Tableau des quartiers
const rawNeighborhoods: Neighborhood[] = [

  // =====================================================
  // ZONE 1 — 1 000 FCFA
  // Centenaire, Médina, Fass, Gueule Tapée,
  // Colobane, Point E, Ville
  // =====================================================

  {
    name: 'Centenaire',
    zoneId: 'zone1',
    zoneName: DAKAR_ZONES.zone1.name,
    price: DAKAR_ZONES.zone1.price,
  },
  {
    name: 'Colobane',
    zoneId: 'zone1',
    zoneName: DAKAR_ZONES.zone1.name,
    price: DAKAR_ZONES.zone1.price,
  },
  {
    name: 'Dakar-Plateau',
    zoneId: 'zone1',
    zoneName: DAKAR_ZONES.zone1.name,
    price: DAKAR_ZONES.zone1.price,
  },
  {
    name: 'Fass',
    zoneId: 'zone1',
    zoneName: DAKAR_ZONES.zone1.name,
    price: DAKAR_ZONES.zone1.price,
  },
  {
    name: 'Gueule Tapée',
    zoneId: 'zone1',
    zoneName: DAKAR_ZONES.zone1.name,
    price: DAKAR_ZONES.zone1.price,
  },
  {
    name: 'Médina',
    zoneId: 'zone1',
    zoneName: DAKAR_ZONES.zone1.name,
    price: DAKAR_ZONES.zone1.price,
  },
  {
    name: 'Point E',
    zoneId: 'zone1',
    zoneName: DAKAR_ZONES.zone1.name,
    price: DAKAR_ZONES.zone1.price,
  },


  // =====================================================
  // ZONE 2 — 1 500 FCFA
  // Mermoz, Amitié 3, École Normale, Sea Plaza, Port
  // =====================================================

  {
    name: 'Amitié 3',
    zoneId: 'zone2',
    zoneName: DAKAR_ZONES.zone2.name,
    price: DAKAR_ZONES.zone2.price,
  },
  {
    name: 'École Normale',
    zoneId: 'zone2',
    zoneName: DAKAR_ZONES.zone2.name,
    price: DAKAR_ZONES.zone2.price,
  },
  {
    name: 'Grand Dakar',
    zoneId: 'zone2',
    zoneName: DAKAR_ZONES.zone2.name,
    price: DAKAR_ZONES.zone2.price,
  },
  {
    name: 'Mermoz',
    zoneId: 'zone2',
    zoneName: DAKAR_ZONES.zone2.name,
    price: DAKAR_ZONES.zone2.price,
  },
  {
    name: 'Port',
    zoneId: 'zone2',
    zoneName: DAKAR_ZONES.zone2.name,
    price: DAKAR_ZONES.zone2.price,
  },
  {
    name: 'Sea Plaza',
    zoneId: 'zone2',
    zoneName: DAKAR_ZONES.zone2.name,
    price: DAKAR_ZONES.zone2.price,
  },


  // =====================================================
  // ZONE 3 — 2 000 FCFA
  // Tous les secteurs affichés à 2 000 FCFA
  // =====================================================

  {
    name: 'Almadies',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Dieuppeul',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Derklé',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Foire',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Grand Yoff',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'HLM',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Keur Yoff',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Liberté 6',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Mamelles',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Mariste',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Ngor',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Ouakam',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Patte d\'Oie',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Sacré-Cœur',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Sicap Foire',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Sicap Liberté',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'VDN',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Yoff',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Zone de Captage',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },
  {
    name: 'Zone Industrielle',
    zoneId: 'zone3',
    zoneName: DAKAR_ZONES.zone3.name,
    price: DAKAR_ZONES.zone3.price,
  },


  // =====================================================
  // ZONE 4 — 2 500 FCFA
  // Pikine, Guédiawaye, Cité Aliou Sow, Golf, Parcelles
  // =====================================================

  {
    name: 'Cité Aliou Sow',
    zoneId: 'zone4',
    zoneName: DAKAR_ZONES.zone4.name,
    price: DAKAR_ZONES.zone4.price,
  },
  {
    name: 'Golf',
    zoneId: 'zone4',
    zoneName: DAKAR_ZONES.zone4.name,
    price: DAKAR_ZONES.zone4.price,
  },
  {
    name: 'Guédiawaye',
    zoneId: 'zone4',
    zoneName: DAKAR_ZONES.zone4.name,
    price: DAKAR_ZONES.zone4.price,
  },
  {
    name: 'Parcelles Assainies',
    zoneId: 'zone4',
    zoneName: DAKAR_ZONES.zone4.name,
    price: DAKAR_ZONES.zone4.price,
  },
  {
    name: 'Pikine',
    zoneId: 'zone4',
    zoneName: DAKAR_ZONES.zone4.name,
    price: DAKAR_ZONES.zone4.price,
  },


  // =====================================================
  // ZONE 5 — 3 000 FCFA
  // Thiaroye, Diamaguène, Diacksao
  // =====================================================

  {
    name: 'Diacksao',
    zoneId: 'zone5',
    zoneName: DAKAR_ZONES.zone5.name,
    price: DAKAR_ZONES.zone5.price,
  },
  {
    name: 'Diamaguène',
    zoneId: 'zone5',
    zoneName: DAKAR_ZONES.zone5.name,
    price: DAKAR_ZONES.zone5.price,
  },
  {
    name: 'Thiaroye',
    zoneId: 'zone5',
    zoneName: DAKAR_ZONES.zone5.name,
    price: DAKAR_ZONES.zone5.price,
  },


  // =====================================================
  // ZONE 6 — 6 000 FCFA
  // Keur Massar, Mbao, Fass Mbao, Yeumbeul,
  // Tivaouane Peulh
  // =====================================================

  {
    name: 'Fass Mbao',
    zoneId: 'zone6',
    zoneName: DAKAR_ZONES.zone6.name,
    price: DAKAR_ZONES.zone6.price,
  },
  {
    name: 'Keur Massar',
    zoneId: 'zone6',
    zoneName: DAKAR_ZONES.zone6.name,
    price: DAKAR_ZONES.zone6.price,
  },
  {
    name: 'Mbao',
    zoneId: 'zone6',
    zoneName: DAKAR_ZONES.zone6.name,
    price: DAKAR_ZONES.zone6.price,
  },
  {
    name: 'Tivaouane Peulh',
    zoneId: 'zone6',
    zoneName: DAKAR_ZONES.zone6.name,
    price: DAKAR_ZONES.zone6.price,
  },
  {
    name: 'Diamniadio',
    zoneId: 'zone6',
    zoneName: DAKAR_ZONES.zone6.name,
    price: DAKAR_ZONES.zone6.price,
  },
  {
    name: 'Yeumbeul',
    zoneId: 'zone6',
    zoneName: DAKAR_ZONES.zone6.name,
    price: DAKAR_ZONES.zone6.price,
  },
];


// Liste complète triée par ordre alphabétique
export const DAKAR_NEIGHBORHOODS: Neighborhood[] =
  rawNeighborhoods.sort((a, b) =>
    a.name.localeCompare(b.name, 'fr')
  );