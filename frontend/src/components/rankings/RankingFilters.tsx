import React, { useState, useEffect } from 'react';
import { SelectField } from '../forms/SelectField';
import { Button } from '../ui/Button';

interface RankingFiltersProps {
  onFiltersChange: (filters: {
    category: string;
    rankingType: string;
    stateId?: number;
    ageGroup?: string;
    gender?: string;
  }) => void;
  initialFilters?: {
    category?: string;
    rankingType?: string;
    stateId?: number;
    ageGroup?: string;
    gender?: string;
  };
}

interface State {
  id: number;
  name: string;
  abbreviation: string;
}

export const RankingFilters: React.FC<RankingFiltersProps> = ({
  onFiltersChange,
  initialFilters
}) => {
  const [category, setCategory] = useState(initialFilters?.category || 'national');
  const [rankingType, setRankingType] = useState(initialFilters?.rankingType || 'overall');
  const [stateId, setStateId] = useState<number | undefined>(initialFilters?.stateId);
  const [ageGroup, setAgeGroup] = useState<string | undefined>(initialFilters?.ageGroup);
  const [gender, setGender] = useState<string | undefined>(initialFilters?.gender);
  const [states, setStates] = useState<State[]>([]);

  // Category options
  const categoryOptions = [
    { value: 'national', label: 'Nacional' },
    { value: 'state', label: 'Estatal' },
    { value: 'age_group', label: 'Grupo de Edad' },
    { value: 'gender', label: 'Género' }
  ];

  // Ranking type options
  const rankingTypeOptions = [
    { value: 'overall', label: 'General' },
    { value: 'singles', label: 'Singles' },
    { value: 'doubles', label: 'Dobles' },
    { value: 'mixed_doubles', label: 'Dobles Mixtos' }
  ];

  // Age group options
  const ageGroupOptions = [
    { value: '', label: 'Todas las edades' },
    { value: 'Under 19', label: 'Menores de 19' },
    { value: '19-34', label: '19-34 años' },
    { value: '35-49', label: '35-49 años' },
    { value: '50-64', label: '50-64 años' },
    { value: '65+', label: '65+ años' }
  ];

  // Gender options
  const genderOptions = [
    { value: '', label: 'Ambos géneros' },
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Femenino' }
  ];

  // Fetch states for state filter
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/data/states', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStates(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchStates();
  }, []);

  // Handle filter changes
  useEffect(() => {
    const filters = {
      category,
      rankingType,
      ...(stateId && { stateId }),
      ...(ageGroup && { ageGroup }),
      ...(gender && { gender })
    };
    
    onFiltersChange(filters);
  }, [category, rankingType, stateId, ageGroup, gender, onFiltersChange]);

  const handleReset = () => {
    setCategory('national');
    setRankingType('overall');
    setStateId(undefined);
    setAgeGroup(undefined);
    setGender(undefined);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Filtros de Ranking</h3>
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
        >
          Resetear
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Category */}
        <SelectField
          label="Categoría"
          value={category}
          onChange={(value) => {
            setCategory(value);
            // Reset dependent filters when category changes
            if (value !== 'state') setStateId(undefined);
            if (value !== 'age_group') setAgeGroup(undefined);
            if (value !== 'gender') setGender(undefined);
          }}
          options={categoryOptions}
          required
        />

        {/* Ranking Type */}
        <SelectField
          label="Tipo de Ranking"
          value={rankingType}
          onChange={setRankingType}
          options={rankingTypeOptions}
          required
        />

        {/* State (only show when category is 'state') */}
        {category === 'state' && (
          <SelectField
            label="Estado"
            value={stateId?.toString() || ''}
            onChange={(value) => setStateId(value ? parseInt(value) : undefined)}
            options={[
              { value: '', label: 'Seleccionar estado' },
              ...states.map(state => ({
                value: state.id.toString(),
                label: state.name
              }))
            ]}
            required
          />
        )}

        {/* Age Group (only show when category is 'age_group' or when filtering) */}
        {(category === 'age_group' || category === 'national' || category === 'state') && (
          <SelectField
            label="Grupo de Edad"
            value={ageGroup || ''}
            onChange={(value) => setAgeGroup(value || undefined)}
            options={ageGroupOptions}
            required={category === 'age_group'}
          />
        )}

        {/* Gender (only show when category is 'gender' or when filtering) */}
        {(category === 'gender' || category === 'national' || category === 'state' || category === 'age_group') && (
          <SelectField
            label="Género"
            value={gender || ''}
            onChange={(value) => setGender(value || undefined)}
            options={genderOptions}
            required={category === 'gender'}
          />
        )}
      </div>

      {/* Filter Summary */}
      <div className="mt-4 text-sm text-gray-600">
        <span className="font-medium">Mostrando:</span>
        {` ${categoryOptions.find(c => c.value === category)?.label} - ${rankingTypeOptions.find(r => r.value === rankingType)?.label}`}
        {stateId && states.length > 0 && ` - ${states.find(s => s.id === stateId)?.name}`}
        {ageGroup && ` - ${ageGroup}`}
        {gender && ` - ${genderOptions.find(g => g.value === gender)?.label}`}
      </div>
    </div>
  );
};