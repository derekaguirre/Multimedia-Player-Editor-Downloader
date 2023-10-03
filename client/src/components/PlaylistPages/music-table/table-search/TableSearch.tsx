//prettier-ignore
import React, { useContext, useEffect } from "react";
import { SongObject, SongsContext } from "./../../../SongsContext";
import "./TableSearch.scss";

// TODO Add search to a div that will include sort functionality
interface SearchProps {
  songs: SongObject[];
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  setFilteredSongs: (filteredSongs: SongObject[]) => void;
}

const TableSearch: React.FC<SearchProps> = ({songs, searchQuery, setSearchQuery, setFilteredSongs }) => {

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

  return (
    <input
      type="text"
      placeholder="Search..."
      value={searchQuery}
      onChange={handleSearchInputChange}
    />
  );
};

export default TableSearch;