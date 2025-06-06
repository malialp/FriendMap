import { useState } from "react";
import { useData } from "../contexts/DataContext";
import toast from "react-hot-toast";

interface MenuProps {
  onClose?: () => void;
}

const Menu = ({ onClose }: MenuProps) => {
  const { persons, connections, tags, addPerson, addConnection, addTag } =
    useData();
  const [activeTab, setActiveTab] = useState<"person" | "connection" | "tag">(
    "person"
  );

  // Form states
  const [personForm, setPersonForm] = useState({
    name: "",
    description: "",
    image: "",
  });

  const [connectionForm, setConnectionForm] = useState({
    person1Id: "",
    person2Id: "",
    bondStrength: 50,
    tagIds: [] as string[],
  });

  const [tagForm, setTagForm] = useState({
    name: "",
    color: "#3B82F6",
  });

  // Person operations
  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personForm.name.trim()) return;

    addPerson({
      name: personForm.name.trim(),
      description: personForm.description.trim() || undefined,
      image: personForm.image.trim() || undefined,
    });

    setPersonForm({ name: "", description: "", image: "" });
    toast.success(`${personForm.name} başarıyla eklendi!`);
  };

  // Connection operations
  const handleAddConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectionForm.person1Id || !connectionForm.person2Id) return;
    if (connectionForm.person1Id === connectionForm.person2Id) return;

    const success = addConnection({
      person1Id: connectionForm.person1Id,
      person2Id: connectionForm.person2Id,
      bondStrength: connectionForm.bondStrength,
      tagIds: connectionForm.tagIds,
    });

    if (!success) {
      toast.error("Bu iki kişi arasında zaten bir bağlantı mevcut!");
      return;
    }

    const person1 = persons.find((p) => p.id === connectionForm.person1Id);
    const person2 = persons.find((p) => p.id === connectionForm.person2Id);
    toast.success(
      `${person1?.name} ve ${person2?.name} arasında bağlantı oluşturuldu!`
    );

    setConnectionForm({
      person1Id: "",
      person2Id: "",
      bondStrength: 50,
      tagIds: [],
    });
  };

  // Tag operations
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagForm.name.trim()) return;

    addTag({
      name: tagForm.name.trim(),
      color: tagForm.color,
    });

    setTagForm({ name: "", color: "#3B82F6" });
    toast.success(`"${tagForm.name}" etiketi eklendi!`);
  };

  const handleTagSelection = (tagId: string) => {
    const currentTags = connectionForm.tagIds;
    const updatedTags = currentTags.includes(tagId)
      ? currentTags.filter((id) => id !== tagId)
      : [...currentTags, tagId];

    setConnectionForm({ ...connectionForm, tagIds: updatedTags });
  };

  return (
    <div className="h-full bg-gray-900 p-4 md:p-6 overflow-y-auto w-full">
      {/* Mobile Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 left-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg shadow-lg transition-colors z-50"
          aria-label="Close menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Header */}
      <div className={`mb-6 md:mb-8 ${onClose ? "mt-16 md:mt-0" : ""}`}>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          FriendGraph
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Arkadaşlık ağınızı görselleştirin. Kişilerinizi, aralarındaki
          bağlantıları ve ilişki türlerini tanımlayarak sosyal çevrenizi
          keşfedin.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("person")}
          className={`flex-1 py-2 px-2 md:px-3 rounded-md text-xs md:text-sm font-medium transition-colors ${
            activeTab === "person"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Kişi Ekle
        </button>
        <button
          onClick={() => setActiveTab("connection")}
          className={`flex-1 py-2 px-2 md:px-3 rounded-md text-xs md:text-sm font-medium transition-colors ${
            activeTab === "connection"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Bağlantı
        </button>
        <button
          onClick={() => setActiveTab("tag")}
          className={`flex-1 py-2 px-2 md:px-3 rounded-md text-xs md:text-sm font-medium transition-colors ${
            activeTab === "tag"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Etiket
        </button>
      </div>

      {/* Person Form */}
      {activeTab === "person" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Yeni Kişi Ekle</h3>
          <form onSubmit={handleAddPerson} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                İsim *
              </label>
              <input
                type="text"
                value={personForm.name}
                onChange={(e) =>
                  setPersonForm({ ...personForm, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kişinin adını girin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Açıklama
              </label>
              <textarea
                value={personForm.description}
                onChange={(e) =>
                  setPersonForm({ ...personForm, description: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Kişi hakkında kısa açıklama"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Profil Resmi URL
              </label>
              <input
                type="url"
                value={personForm.image}
                onChange={(e) =>
                  setPersonForm({ ...personForm, image: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://örnek.com/resim.jpg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Kişi Ekle
            </button>
          </form>

          {/* Person List */}
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-300 mb-3">
              Mevcut Kişiler ({persons.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {persons.map((person) => (
                <div
                  key={person.id}
                  className="bg-gray-800 p-2 rounded text-sm"
                >
                  <span className="text-white font-medium">{person.name}</span>
                  {person.description && (
                    <p className="text-gray-400 text-xs mt-1">
                      {person.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Connection Form */}
      {activeTab === "connection" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Bağlantı Ekle</h3>
          <form onSubmit={handleAddConnection} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                İlk Kişi *
              </label>
              <select
                value={connectionForm.person1Id}
                onChange={(e) =>
                  setConnectionForm({
                    ...connectionForm,
                    person1Id: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Kişi seçin</option>
                {persons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                İkinci Kişi *
              </label>
              <select
                value={connectionForm.person2Id}
                onChange={(e) =>
                  setConnectionForm({
                    ...connectionForm,
                    person2Id: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Kişi seçin</option>
                {persons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Bağ Gücü: {connectionForm.bondStrength}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={connectionForm.bondStrength}
                onChange={(e) =>
                  setConnectionForm({
                    ...connectionForm,
                    bondStrength: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Zayıf</span>
                <span>Güçlü</span>
              </div>
            </div>

            {/* Tag Selection */}
            {tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  İlişki Etiketleri
                </label>
                <div className="space-y-2 max-h-24 overflow-y-auto">
                  {tags.map((tag) => (
                    <label
                      key={tag.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={connectionForm.tagIds.includes(tag.id)}
                        onChange={() => handleTagSelection(tag.id)}
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      ></span>
                      <span className="text-sm text-gray-300">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={persons.length < 2}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Bağlantı Ekle
            </button>
          </form>

          {/* Connection List */}
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-300 mb-3">
              Mevcut Bağlantılar ({connections.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {connections.map((connection) => {
                const person1 = persons.find(
                  (p) => p.id === connection.person1Id
                );
                const person2 = persons.find(
                  (p) => p.id === connection.person2Id
                );
                const connectionTags = tags.filter((tag) =>
                  connection.tagIds.includes(tag.id)
                );
                return (
                  <div
                    key={connection.id}
                    className="bg-gray-800 p-2 rounded text-sm flex items-center justify-between"
                  >
                    <div>
                      <span className="text-white">
                        {person1?.name} ↔ {person2?.name}
                      </span>
                      <span className="text-gray-400 ml-2">
                        ({connection.bondStrength}%)
                      </span>
                    </div>
                    {connectionTags.length > 0 && (
                      <div className="flex space-x-1">
                        {connectionTags.map((tag) => (
                          <span
                            key={tag.id}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          ></span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tag Form */}
      {activeTab === "tag" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Etiket Ekle</h3>
          <form onSubmit={handleAddTag} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Etiket Adı *
              </label>
              <input
                type="text"
                value={tagForm.name}
                onChange={(e) =>
                  setTagForm({ ...tagForm, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Arkadaş, Aile, İş vb."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Renk
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={tagForm.color}
                  onChange={(e) =>
                    setTagForm({ ...tagForm, color: e.target.value })
                  }
                  className="w-12 h-10 border border-gray-700 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={tagForm.color}
                  onChange={(e) =>
                    setTagForm({ ...tagForm, color: e.target.value })
                  }
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Etiket Ekle
            </button>
          </form>

          {/* Tag List */}
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-300 mb-3">
              Mevcut Etiketler ({tags.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="bg-gray-800 p-2 rounded text-sm flex items-center space-x-3"
                >
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  ></span>
                  <span className="text-white">{tag.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
