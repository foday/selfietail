import {createContext, useState} from "react";

export const LoginContext = createContext()

export function LoginProvider({children}) {
    const [emails, setEmails] = useState([])
    const [passwords, setPasswords] = useState([])

    async function fetchEmails() {}
    async function fetchPasswords() {}

    async function createEmails() {}
    async function createPasswords() {} 

    async function updateEmails() {}
    async function updatePasswords() {} 

    async function deleteEmails() {}
    async function deletePasswords() {} 

    return (
        <LoginContext.Provider 
        value={{emails, passwords, fetchEmails, fetchPasswords, createEmails, createPasswords, updateEmails, updatePasswords, deleteEmails, deletePasswords}}>
            {children}
        </LoginContext.Provider>
    )
}