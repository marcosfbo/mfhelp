import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { SignIn } from "../screens/SignIn";
import { AppRoutes } from "./app.routes";

export function Routes(){
    const [loading, setIsLoading] = useState();
    const [user, setUser] = useState<FirebaseAuthTypes.User>();

    useEffect(() => {
        const subscriber = auth()
        .onAuthStateChanged(response => {
            setUser(response);
            setIsLoading(false);
        });
    },[]);

    return(
        <NavigationContainer>
            <SignIn />
        </NavigationContainer>
    )
}