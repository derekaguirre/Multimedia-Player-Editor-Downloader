import React, { createContext, useContext, useEffect, useState } from "react";

interface PlaylistContextProps {
    currentPlaylistId: string;
    setCurrentPlaylistId: (id: string) => void;
    currentPlaylistName: string;
    setCurrentPlaylistName: (name: string) => void;
}

export const PlaylistContext = createContext<PlaylistContextProps>({
    currentPlaylistId: "",
    setCurrentPlaylistId: () => { },
    currentPlaylistName: "",
    setCurrentPlaylistName: () => { },
});

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [currentPlaylistId, setCurrentPlaylistId] = useState<string>("");
    const [currentPlaylistName, setCurrentPlaylistName] = useState<string>("");

    useEffect(() => {
        console.log("PLAYLIST CONTEXT LOADED");
        const storedPlaylistId = localStorage.getItem("currentPlaylistId");
        const storedPlaylistName = localStorage.getItem("currentPlaylistName");

        if (storedPlaylistId && storedPlaylistName) {
            console.log("Context Playlist ID:", storedPlaylistId);
            console.log("Context Playlist Name:", storedPlaylistName);
            setCurrentPlaylistId(storedPlaylistId);
            setCurrentPlaylistName(storedPlaylistName);
        }
    }, []);

    //TODO values with set may be superfluous
    return (
        <PlaylistContext.Provider
            value={{
                currentPlaylistId,
                setCurrentPlaylistId,
                currentPlaylistName,
                setCurrentPlaylistName,
            }}
        >
            {children}
        </PlaylistContext.Provider>
    );
};

export const usePlaylist = () => useContext(PlaylistContext);
