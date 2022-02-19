import React, { useContext } from 'react'
import { AccountContext } from './AccountProvider';

import {GoogleLogin} from 'react-google-login';
const API_BASE = 'https://todos-jainakshat.herokuapp.com';
const clientId = "758184751451-m05lfil43vbgafu97ra6ble9f2v1q7dd.apps.googleusercontent.com";

export const Login = () => {

    const {setUser} = useContext(AccountContext);


    const addUser = async(data) =>{
        await fetch(API_BASE+ "/user/new",{
            method: "POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                googleId: data.googleId,
                name: data.name
            })
        })
        
        
       
    }

    const onLoginSuccess = async (res) => {
        console.log('login successfull');
        await addUser(res.profileObj);
        setUser(res.profileObj);
    }

    const onLoginFailure = () => {
        console.log('login Failure');
    }

    return (
        <div className='login'>
            <div className="text">
            <h1>Welcome to My Todos App</h1>
            <h3># You can Sign-In using this Google Sign-In button.</h3>
            <h3># This Website is built using MERN stack with ❤ by Akshat Jain.</h3>
            </div>
            
            <div className="googleLogin">
            <GoogleLogin
                        clientId={clientId}
                        buttonText="Google Sign-In"
                        isSignedIn={true}
                        onSuccess={onLoginSuccess}
                        onFailure={onLoginFailure}
                        cookiePolicy={'single_host_origin'}
                        style={{background: '#ededed'}}
                    />
            </div>

        </div>
    )
}
