import React, { useContext } from "react";
import { SongsContext } from "./../../../SongsContext";
import "./MusicTableHeader.scss";
// import ContextMenu from "../context-menu/ContextMenu";
// import SearchBar from "../search-bar/SearchBar";

const API_URL = "http://localhost:4000";

interface HeaderProps {
  columns: { Header: string; accessor: string }[];
}


//Migrate fetch to own file and invoke at:
// startup TODO
// playlist selection (implemented here but can move to sidebar now)
// adding songs DONE (implemented inside of PlaylistMain)

const MusicTableHeader: React.FC<HeaderProps> = ({ columns }) => {
  //Local states

  //Coordinate States

  // const SortArrow: React.FC<SortArrowProps> = ({ order }) => (
  //   <span>{order === "asc" ? "▲" : order === "desc" ? "▼" : ""}</span>
  // );

  //Logic for sorting
  // const handleSort = (column: keyof SongObject) => {
  //   if (!column) return;

  //   setSongs((prevSongs) => {
  //     const isAsc = sortColumn === column && sortDirection === "asc";
  //     const sortedSongs = [...prevSongs].sort((a, b) => {
  //       const aValue =
  //         typeof a[column] === "number" ? a[column]?.toString() : a[column];
  //       const bValue =
  //         typeof b[column] === "number" ? b[column]?.toString() : b[column];

  //       if (aValue && bValue) {
  //         if (aValue < bValue) return isAsc ? -1 : 1;
  //         if (aValue > bValue) return isAsc ? 1 : -1;
  //       }
  //       return 0;
  //     });

  //     sortedSongs.forEach((song) => {
  //       song.sortOrder = song === sortedSongs[0] ? sortDirection : undefined;
  //     });

  //     return sortedSongs;
  //   });

  //   setSortColumn(column);
  //   //prettier-ignore
  //   setSortDirection(sortColumn === column ? (sortDirection === "asc" ? "desc" : "asc") : "asc");
  // };

  //prettier-ignore
  // const handleContextMenu = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
  //   e.preventDefault();
  //   const { pageX, pageY } = e
  //   setContextMenu({ show: true, x: pageX, y: pageY })
  // }
  // const contextMenuClose = () => setContextMenu(initialContextMenu);
  // TODO states that handle which data the columns show, select name, title, album and only those show, add more options for other metadata
  // prettier-ignore
  // {/* {contextMenu.show && (<ContextMenu x={contextMenu.x} y={contextMenu.y} closeContextMenu={contextMenuClose}/>)} */}
  // {/* TODO className="playlistTable" onContextMenu={(e) => { handleHEADERContextMenu(e); */}

  return (
    <thead>
      <tr>
        <th></th>
        {columns.map((column) => (
          <th key={column.accessor} className="headerCells">
            {column.Header}
          </th>
        ))}
        {/* TODO apply to dynamic renderer for the columns  */}
        {/* <th onClick={() => handleSort("_id")}>File ID{" "}<SortArrow order={sortColumn === "_id" ? sortDirection : undefined}/></th> */}
        {/* <th onClick={() => handleSort("fileNameOriginal")}>File Name{" "}<SortArrow order={sortColumn === "fileNameOriginal" ? sortDirection : undefined}/></th> */}
        {/* <th onClick={() => handleSort("title")}>Title{" "}<SortArrow order={sortColumn === "title" ? sortDirection : undefined}/></th> */}
        {/* <th onClick={() => handleSort("album")}>Album{" "}<SortArrow order={sortColumn === "album" ? sortDirection : undefined}/></th> */}
        {/* <th onClick={() => handleSort("artist")}>Artist{" "}<SortArrow order={sortColumn === "artist" ? sortDirection : undefined}/></th> */}
        {/* TODO entry for date added */}
        {/* <th onClick={() => handleSort("filePath")}>File Path{" "}<SortArrow order={sortColumn === "filePath" ? sortDirection : undefined}/></th> */}
      </tr>
    </thead>

  );
};

export default MusicTableHeader;
