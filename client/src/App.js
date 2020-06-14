import React, {useEffect, useState} from 'react';
import Cars from "./Cars";
import MyNavbar from "./Navbar";
import {Redirect, Route,Link} from 'react-router-dom';
import {Switch} from 'react-router';
import API from "./api/API";
import {AuthContext} from './auth/authContext';
import LoginPage from "./LoginPage";


function App(props) {
    const [logged, setLogged] = useState(undefined);
    const [authErr, setAuthErr] = useState(undefined);

    useEffect( ()=> {
        API.isAuthenticated()
            .then((user) => setLogged(user))
            .catch((err) => {
            setAuthErr(err.errorObj);
            // props.history.push("/login");
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

    const handleErrors = (err) => {
        if (err) {
            if (err.status && err.status === 401) {
                setAuthErr(err.errorObj);
                // this.props.history.push("/login");
            }
        }
    }

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
              <LoginPage/>
          </Route>
          <Route path="/">
              <Cars handleErrors={handleErrors}/>
          </Route>
        </Switch>
    </AuthContext.Provider>;
}

export default App;
