/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React, {createContext, useState} from 'react';

const SidebarContext = createContext();

const SidebarProvider = ({children}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{isOpen, setIsOpen}}>
      {children}
    </SidebarContext.Provider>
  );
};

export {SidebarContext, SidebarProvider};
