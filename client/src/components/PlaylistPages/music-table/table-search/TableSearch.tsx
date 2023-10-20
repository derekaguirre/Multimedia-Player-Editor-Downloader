//prettier-ignore
import React, { useEffect } from "react";
import { SongObject } from "../../../Contexts/SongsContext";
import SearchIcon from "./../../../../images/search.svg";
import "./TableSearch.scss";

interface SearchProps {
  songs: SongObject[];
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  setFilteredSongs: (filteredSongs: SongObject[]) => void;
}

const TableSearch: React.FC<SearchProps> = ({
  songs,
  searchQuery,
  setSearchQuery,
  setFilteredSongs,
}) => {
  // Local states
  // console.log("SEARCH SONGS", songs)

  // If search query is empty, show all songs, otherwise only show songs that match the search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(
        (song) =>
          // Queries the search will accept
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.album.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [songs, searchQuery]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  // Move search bar text a little more right
  return (
    <div className="searchContainer">
      <div className="searchInner">
        <div className="searchIcon">
          <img src={SearchIcon} width={30} height={30} />
        </div>
        <input
          className="searchBar"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
    </div>
  );
};

export default TableSearch;
