import { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useData } from "../contexts/DataContext";
import Filter, { type FilterOptions } from "./Filter";

const Graph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [filters, setFilters] = useState<FilterOptions>({
    selectedPersonIds: [],
    selectedTagIds: [],
    showIsolatedNodes: true,
    bondStrengthRange: [0, 100],
  });

  // Get data from context
  const { persons, connections, tags } = useData();

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    // Initial resize
    resize();

    // Use ResizeObserver for better performance and accuracy
    const resizeObserver = new ResizeObserver(resize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Fallback for older browsers
    window.addEventListener("resize", resize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Convert data to graph format with filtering
  const getFilteredGraphData = () => {
    let filteredConnections = connections;
    let filteredPersons = persons;

    // Filter by bond strength range
    filteredConnections = filteredConnections.filter(
      (connection) =>
        connection.bondStrength >= filters.bondStrengthRange[0] &&
        connection.bondStrength <= filters.bondStrengthRange[1]
    );

    // Filter by selected tags
    if (filters.selectedTagIds.length > 0) {
      filteredConnections = filteredConnections.filter((connection) =>
        connection.tagIds.some((tagId) =>
          filters.selectedTagIds.includes(tagId)
        )
      );
    }

    // Filter by selected persons
    if (filters.selectedPersonIds.length > 0) {
      filteredConnections = filteredConnections.filter(
        (connection) =>
          filters.selectedPersonIds.includes(connection.person1Id) ||
          filters.selectedPersonIds.includes(connection.person2Id)
      );
    }

    // Get persons that are involved in filtered connections
    const connectedPersonIds = new Set<string>();
    filteredConnections.forEach((connection) => {
      connectedPersonIds.add(connection.person1Id);
      connectedPersonIds.add(connection.person2Id);
    });

    // Filter persons based on connections and isolation setting
    if (!filters.showIsolatedNodes) {
      filteredPersons = persons.filter((person) =>
        connectedPersonIds.has(person.id)
      );
    } else if (filters.selectedPersonIds.length > 0) {
      // If specific persons are selected, show only those and their connections
      const relevantPersonIds = new Set(filters.selectedPersonIds);
      filteredConnections.forEach((connection) => {
        relevantPersonIds.add(connection.person1Id);
        relevantPersonIds.add(connection.person2Id);
      });
      filteredPersons = persons.filter((person) =>
        relevantPersonIds.has(person.id)
      );
    }

    return {
      nodes: filteredPersons.map((person) => ({
        id: person.id,
        name: person.name,
        description: person.description,
        image: person.image,
        color: "#3B82F6", // Default blue color for persons
      })),
      links: filteredConnections.map((connection) => {
        // Calculate link color based on tags
        const connectionTags = tags.filter((tag) =>
          connection.tagIds.includes(tag.id)
        );
        const linkColor =
          connectionTags.length > 0 ? connectionTags[0].color : "#6B7280";

        // Calculate link width based on bond strength
        const linkWidth = Math.max(1, (connection.bondStrength / 100) * 8);

        return {
          source: connection.person1Id,
          target: connection.person2Id,
          bondStrength: connection.bondStrength,
          tags: connectionTags,
          color: linkColor,
          width: linkWidth,
        };
      }),
    };
  };

  const graphData = getFilteredGraphData();

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full w-full relative bg-black overflow-hidden"
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <ForceGraph2D
          key={`${dimensions.width}-${dimensions.height}`} // Force re-render on dimension change
          onNodeDragEnd={(node) => {
            node.fx = node.x;
            node.fy = node.y;
          }}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          linkWidth={(link) => link.width || 1}
          linkColor={(link) => link.color || "#6B7280"}
          backgroundColor="rgba(0,0,0,0)"
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.name;

            const nodeRadius = 40 / globalScale; // Sabit radius, zoom'a göre küçülür/büyür
            let fontSize = 16 / globalScale; // Başlangıç fontu

            ctx.font = `${fontSize}px Sans-Serif`;
            let textWidth = ctx.measureText(label).width;

            // Eğer yazı node'un çapından büyükse fontu küçült
            while (textWidth > nodeRadius * 2 && fontSize > 4) {
              fontSize -= 1 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              textWidth = ctx.measureText(label).width;
            }

            // Node circle
            ctx.beginPath();
            ctx.arc(
              node.x || 0,
              node.y || 0,
              nodeRadius,
              0,
              2 * Math.PI,
              false
            );
            ctx.fillStyle = node.color || "#3B82F6";
            ctx.fill();
            ctx.strokeStyle = "#1F2937";
            ctx.lineWidth = 1 / globalScale;
            ctx.stroke();

            // Node label
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, node.x || 0, node.y || 0);
          }}
        />
      )}

      {/* Graph stats and Filter */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col items-end gap-2">
        <div className="bg-gray-800 border border-gray-600 text-white p-2 md:p-3 rounded-lg shadow-lg">
          <div className="text-xs md:text-sm font-medium mb-1">
            Graf İstatistikleri
          </div>
          <div className="text-xs text-gray-300">
            Kişiler: {graphData.nodes.length} / {persons.length}
          </div>
          <div className="text-xs text-gray-300">
            Bağlantılar: {graphData.links.length} / {connections.length}
          </div>
          <div className="text-xs text-gray-300">Etiketler: {tags.length}</div>
        </div>

        <Filter onFilterChange={setFilters} />
      </div>

      {/* Instructions */}
      {graphData.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-gray-400 text-center">
            <div className="text-xl mb-2">🔗</div>
            {persons.length === 0 ? (
              <>
                <div className="text-lg font-medium mb-1">Graf Boş</div>
                <div className="text-sm">
                  {window.innerWidth >= 768
                    ? "Soldaki menüden kişiler ekleyip bağlantılar oluşturun"
                    : "Menü butonundan kişiler ekleyip bağlantılar oluşturun"}
                </div>
              </>
            ) : (
              <>
                <div className="text-lg font-medium mb-1">
                  Filtre Sonucu Boş
                </div>
                <div className="text-sm">
                  Mevcut filtreler hiçbir sonuç döndürmedi.
                  <br />
                  Filtreleri temizleyerek tüm verileri görüntüleyebilirsiniz.
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Graph;
