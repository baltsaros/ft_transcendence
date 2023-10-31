
import { createContext, useContext, useEffect, useState } from 'react';
import { IChannel } from '../types/types';

const selectedChannelContext = createContext<{
    selectedChannel: IChannel | null;
    setSelectedChannel: (channel: IChannel | null) => void;
}>({
    selectedChannel: null,
    setSelectedChannel: () => {},
})

/* Provider component */
export const SelectedChannelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    /* Define the state/data to share along the React component tree */
    const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);
  /* Use the Provider to wrap the children and pass the shared data through value prop */
    return (
      <selectedChannelContext.Provider value={{selectedChannel, setSelectedChannel}}>
        {children}
        </selectedChannelContext.Provider>
    );
  }
  
  /* Create a custom hook for consuming the context */
  export const useChannel = () => {
    const context = useContext(selectedChannelContext);
    if (!context) {
      throw new Error('useChannel must be used within a ChannelProvider');
    }
    return context;
  };
  
