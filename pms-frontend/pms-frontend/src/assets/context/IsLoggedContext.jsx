import { createContext, useState} from "react";

const IsLoggedContext = createContext();

//global context for login logout state
//wrap all components
//here, children are all the components inside <IsLoggedProvider>
export const IsLoggedProvider = ({children}) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        //all child components of <IsLoggedProvider> can use the items of this value properties
        <IsLoggedContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
            {children}
        </IsLoggedContext.Provider>
    );
};

export default IsLoggedContext;