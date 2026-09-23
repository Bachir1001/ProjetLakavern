import React, { useState } from 'react';
import { DAKAR_NEIGHBORHOODS, type Neighborhood } from '../data/dakarNeighborhoods';
import { MapPin, Truck, CheckCircle } from 'lucide-react';

interface DeliverySelectorProps {
  onSelectDeliveryFee: (fee: number, neighborhoodName: string) => void;
}

export const DeliverySelector: React.FC<DeliverySelectorProps> = ({ onSelectDeliveryFee }) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setSelectedNeighborhood(null);
      onSelectDeliveryFee(0, '');
      return;
    }

    const found = DAKAR_NEIGHBORHOODS.find((n) => n.name === value);
    if (found) {
      setSelectedNeighborhood(found);
      onSelectDeliveryFee(found.price, found.name);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
        <MapPin className="w-5 h-5 text-[#00c8db]" />
        <h3>Adresse de livraison à Dakar</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionnez votre quartier :
        </label>
        <select
          onChange={handleChange}
          defaultValue=""
          className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#00c8db] focus:ring-1 focus:ring-[#00c8db]"
        >
          <option value="" disabled>
            -- Choisissez un quartier à Dakar --
          </option>
          {DAKAR_NEIGHBORHOODS.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Résumé du calcul du tarif */}
      {selectedNeighborhood && (
        <div className="bg-[#00c8db]/10 border border-[#00c8db]/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-[#00c8db]" />
            <div>
              <p className="text-sm font-bold text-gray-900">
                Quartier sélectionné : <span className="text-[#00c8db]">{selectedNeighborhood.name}</span>
              </p>
              <p className="text-xs text-gray-600">
                Zone : {selectedNeighborhood.zoneName}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 block">Frais de livraison</span>
            <span className="text-lg font-extrabold text-gray-900">
              {selectedNeighborhood.price.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>
      )}
    </div>
  );
};