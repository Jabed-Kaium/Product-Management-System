import { createContext, useState } from "react";

const UserContext = createContext();

//global context for User state
//wrap all components
//here, children are all the components inside <UserContextProvider>
export const UserContextProvider = ({children}) => {

    const [role, setRole] = useState("");
    const [token, setToken] = useState("");
    const [name, setName] = useState("");

    return (
        //all child components of <UserContextProvider> can use the items of this value properties
        <UserContext.Provider value={{role, setRole, token, setToken, name, setName}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;