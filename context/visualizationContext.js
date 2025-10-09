import { createContext, useState, useContext } from 'react';

const VisualizationContext = createContext();

export function VisualizationProvider({ children }) {
    const [visualization, setVisualization] = useState(true);
    

    const updateVisualization = async () => {

        setVisualization(!visualization);
    };

    return (
        <VisualizationContext.Provider value={{
            visualization,
            updateVisualization
        }}>
            {children}
        </VisualizationContext.Provider>
    );
}

export function useVisualizationContext() {
    return useContext(VisualizationContext);
}