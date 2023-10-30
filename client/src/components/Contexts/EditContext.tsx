import React, { createContext, useContext, useState } from "react";

export const EditContext = createContext<{
  isEdited: boolean;
  setIsEdited: (isEdited: boolean) => void;
}>({
  isEdited: false,
  setIsEdited: () => {},
});

export const usePlayingContext = () => useContext(EditContext);

// prettier-ignore
export const EditProvider: React.FC<{ children: React.ReactNode }> = ({children,}) => {
  const [isEdited, setIsEdited] = useState<boolean>(false);

  return (
    <EditContext.Provider value={{ isEdited, setIsEdited }}>
      {children}
    </EditContext.Provider>
  );
};

export const useEdit = () => useContext(EditContext);

