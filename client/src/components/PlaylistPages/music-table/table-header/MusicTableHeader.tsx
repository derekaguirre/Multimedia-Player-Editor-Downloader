import React, { useState } from "react";
import "./MusicTableHeader.scss";

interface HeaderProps {
  columns: { Header: string; accessor: string }[];
  setSortingOrder: (sortingOrder: string) => void;
  setClickedHeader: (clickedHeader: string | null) => void;
}

//prettier-ignore
const MusicTableHeader: React.FC<HeaderProps> = ({ columns, setSortingOrder, setClickedHeader}) => {
  const [sortConfig, setSortConfig] = useState<{key: string;direction: "asc" | "desc" | "unsorted"}>({ key: "", direction: "asc" });

  // Toggle sorting direction when clicking on the same column
  const handleSort = (key: string) => {
    if (sortConfig.key === key) {
      let newDirection: "asc" | "desc" | "unsorted" = "asc"; // Initialized with a default value

      if (sortConfig.direction === "asc") {
        newDirection = "desc";
      } else if (sortConfig.direction === "desc") {
        newDirection = "unsorted";
      }
      setSortConfig({ key, direction: newDirection });
      localStorage.setItem("sortOrder", newDirection);
      // Pass the sorting order to the parent component
      setSortingOrder(newDirection);
    } else {
      // Start the cycle with ascending
      setSortConfig({ key, direction: "asc" });
      // Pass the sorting order to the parent component
      setSortingOrder("asc");
    }
  };

  return (
    <thead>
      <tr>
        {/* TODO remove text highlight on hover for #  */}
        <th>#</th>
        {columns.map((column) => (
          <th
            key={column.accessor}
            className="headerCells"
            onClick={() => {
              setClickedHeader(column.accessor);
              handleSort(column.accessor);
            }}
          >
            {column.Header}
            {sortConfig.key === column.accessor && (
              <span>{sortConfig.direction === "asc" ? " ▲" : sortConfig.direction === "desc" ? " ▼" : ""}</span>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default MusicTableHeader;