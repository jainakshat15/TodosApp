import React, {createContext} from 'react'

import { useState } from 'react';

export const AccountContext = createContext();

export const AccountProvider = ({children}) => {

    const [user,setUser] = useState();
    

   
    return (
        <AccountContext.Provider value= {{
            user,
            setUser
            
        }}>
            {children}
        </AccountContext.Provider>
        
    )
}
