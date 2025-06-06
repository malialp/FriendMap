import { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";

interface FilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  selectedPersonIds: string[];
  selectedTagIds: string[];
  showIsolatedNodes: boolean;
  bondStrengthRange: [number, number];
}

const Filter = ({ onFilterChange }: FilterProps) => {
  const { persons, tags } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);

  // Handle modal opening/closing animation
  const handleToggleModal = () => {
    if (isOpen) {
      // Kapanma animasyonu
      setIsAnimating(false);
      setTimeout(() => setIsOpen(false), 200); // 200ms transition süresi
    } else {
      // Açılma animasyonu
      setIsOpen(true);
      setTimeout(() => setIsAnimating(true), 10); // DOM'un update olması için kısa bekleme
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [showIsolatedNodes, setShowIsolatedNodes] = useState(true);
  const [bondStrengthRange, setBondStrengthRange] = useState<[number, number]>([
    0, 100,
  ]);

  const handlePersonToggle = (personId: string) => {
    const newSelectedPersonIds = selectedPersonIds.includes(personId)
      ? selectedPersonIds.filter((id) => id !== personId)
      : [...selectedPersonIds, personId];

    setSelectedPersonIds(newSelectedPersonIds);
    onFilterChange({
      selectedPersonIds: newSelectedPersonIds,
      selectedTagIds,
      showIsolatedNodes,
      bondStrengthRange,
    });
  };

  const handleTagToggle = (tagId: string) => {
    const newSelectedTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];

    setSelectedTagIds(newSelectedTagIds);
    onFilterChange({
      selectedPersonIds,
      selectedTagIds: newSelectedTagIds,
      showIsolatedNodes,
      bondStrengthRange,
    });
  };

  const handleShowIsolatedToggle = () => {
    const newShowIsolated = !showIsolatedNodes;
    setShowIsolatedNodes(newShowIsolated);
    onFilterChange({
      selectedPersonIds,
      selectedTagIds,
      showIsolatedNodes: newShowIsolated,
      bondStrengthRange,
    });
  };

  const handleBondStrengthChange = (index: number, value: number) => {
    const newRange: [number, number] = [...bondStrengthRange];
    newRange[index] = value;

    // Ensure min <= max
    if (index === 0 && value > newRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < newRange[0]) {
      newRange[0] = value;
    }

    setBondStrengthRange(newRange);
    onFilterChange({
      selectedPersonIds,
      selectedTagIds,
      showIsolatedNodes,
      bondStrengthRange: newRange,
    });
  };

  const clearAllFilters = () => {
    setSelectedPersonIds([]);
    setSelectedTagIds([]);
    setShowIsolatedNodes(true);
    setBondStrengthRange([0, 100]);
    onFilterChange({
      selectedPersonIds: [],
      selectedTagIds: [],
      showIsolatedNodes: true,
      bondStrengthRange: [0, 100],
    });
  };

  const hasActiveFilters =
    selectedPersonIds.length > 0 ||
    selectedTagIds.length > 0 ||
    !showIsolatedNodes ||
    bondStrengthRange[0] > 0 ||
    bondStrengthRange[1] < 100;

  return (
    <div className="relative">
      <button
        onClick={handleToggleModal}
        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-gray-600"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
          />
        </svg>
        Filtrele
        {hasActiveFilters && (
          <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {selectedPersonIds.length +
              selectedTagIds.length +
              (bondStrengthRange[0] > 0 || bondStrengthRange[1] < 100 ? 1 : 0) +
              (!showIsolatedNodes ? 1 : 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto transition-all duration-200 ease-in-out transform ${
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2"
          }`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">Filtreler</h3>
              <button
                onClick={clearAllFilters}
                className="text-gray-400 hover:text-white text-sm"
              >
                Temizle
              </button>
            </div>

            {/* Bond Strength Range */}
            <div className="mb-4">
              <h4 className="text-gray-300 font-medium mb-2 text-sm">
                Bağ Gücü Aralığı:
              </h4>

              {/* Quick presets */}
              <div className="flex gap-1 mb-2">
                <button
                  onClick={() => {
                    handleBondStrengthChange(0, 0);
                    handleBondStrengthChange(1, 33);
                  }}
                  className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Zayıf (0-33%)
                </button>
                <button
                  onClick={() => {
                    handleBondStrengthChange(0, 34);
                    handleBondStrengthChange(1, 66);
                  }}
                  className="text-xs px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
                >
                  Orta (34-66%)
                </button>
                <button
                  onClick={() => {
                    handleBondStrengthChange(0, 67);
                    handleBondStrengthChange(1, 100);
                  }}
                  className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Güçlü (67-100%)
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs w-8">Min:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bondStrengthRange[0]}
                    onChange={(e) =>
                      handleBondStrengthChange(0, parseInt(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span className="text-gray-300 text-xs w-8">
                    {bondStrengthRange[0]}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs w-8">Max:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bondStrengthRange[1]}
                    onChange={(e) =>
                      handleBondStrengthChange(1, parseInt(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span className="text-gray-300 text-xs w-8">
                    {bondStrengthRange[1]}%
                  </span>
                </div>
              </div>
            </div>

            {/* Show Isolated Nodes Toggle */}
            <div className="mb-4">
              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={showIsolatedNodes}
                  onChange={handleShowIsolatedToggle}
                  className="mr-2 rounded"
                />
                İzole düğümleri göster
              </label>
            </div>

            {/* Person Filters */}
            <div className="mb-4">
              <h4 className="text-gray-300 font-medium mb-2 text-sm">
                Kişiler:
              </h4>
              <div className="max-h-32 overflow-y-auto">
                {persons.length === 0 ? (
                  <p className="text-gray-500 text-xs">Henüz kişi eklenmemiş</p>
                ) : (
                  persons.map((person) => (
                    <label
                      key={person.id}
                      className="flex items-center text-sm text-gray-300 mb-1"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPersonIds.includes(person.id)}
                        onChange={() => handlePersonToggle(person.id)}
                        className="mr-2 rounded"
                      />
                      <span className="truncate">{person.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Tag Filters */}
            <div>
              <h4 className="text-gray-300 font-medium mb-2 text-sm">
                Etiketler:
              </h4>
              <div className="max-h-32 overflow-y-auto">
                {tags.length === 0 ? (
                  <p className="text-gray-500 text-xs">
                    Henüz etiket eklenmemiş
                  </p>
                ) : (
                  tags.map((tag) => (
                    <label
                      key={tag.id}
                      className="flex items-center text-sm text-gray-300 mb-1"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTagIds.includes(tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                        className="mr-2 rounded"
                      />
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color || "#6B7280" }}
                        />
                        <span className="truncate">{tag.name}</span>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
