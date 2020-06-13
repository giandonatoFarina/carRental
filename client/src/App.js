import React, {useEffect, useState} from 'react';
import Cars from "./Cars";
import MyNavbar from "./Navbar";
import {Redirect, Route,Link} from 'react-router-dom';
import {Switch} from 'react-router';
import API from "./API";
import {AuthContext} from './auth/authContext';


function App(props) {
    const [logged, setLogged] = useState({});
    const [authErr, setAuthErr] = useState({});

    useEffect( ()=> {
        API.isAuthenticated().then(
            (user) => {
                setLogged({authUser: user});
            }
        ).catch((err) => {
            setAuthErr({authErr: err.errorObj});
            props.history.push("/login");
        });
    });

    const login = (usr, pwd) => {
        API.userLogin(usr, pwd).then(
            (user) => {
                setLogged(user);
                setAuthErr({})
            }
        ).catch(
            (errorObj) => {
                const err0 = errorObj.errors[0];
                setAuthErr({authErr: err0});
        });
    };

    const logout = () => {
        API.userLogout().then(() => {
            setLogged({});
            setAuthErr({});
        });
    };

    const value = {
        authUser: logged,
        authErr: authErr,
        loginUser: login,
        logoutUser: logout
    };

    return <AuthContext.Provider value={value}>
        <MyNavbar logged={logged}/>
        <Switch>
          <Route path="/login">

          </Route>
          <Route path="/">
              <Cars/>
          </Route>
        </Switch>
    </AuthContext.Provider>;
}

export default App;
