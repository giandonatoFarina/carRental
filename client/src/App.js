import React, {useEffect, useState} from 'react';
import Cars from "./components/Cars";
import MyNavbar from "./components/Navbar";
import {Redirect, Route,Link} from 'react-router-dom';
import {Switch} from 'react-router';
import API from "./api/API";
import LoginPage from "./components/LoginPage";
import NewRental from "./components/NewRental";


function App(props) {
    const [logged, setLogged] = useState(false);
    const [authUser, setAuthUser] = useState(undefined)
    const [authErr, setAuthErr] = useState(undefined);

    useEffect(() => {
        API.isAuthenticated()
            .then((user) => {
                setAuthUser(user);
                setLogged(true);
            })
            .catch((err) => {
            setAuthErr(err.errObj);
            // props.history.push("/login");
        });
    }, []);

    const login = (usr, pwd) => {
        API.userLogin(usr, pwd).then(
            (user) => {
                setAuthUser(user);
                setAuthErr(undefined)
            }
        ).catch(
            (errorObj) => {
                const err0 = errorObj.errors[0];
                setAuthErr(err0);
        });
    };

    const logout = () => {
        API.userLogout().then(() => {
            setLogged(false);
            setAuthUser(undefined);
            setAuthErr(undefined);
        });
    };

    const handleErrors = (err) => {
        if (err) {
            if (err.status && err.status === 401) {
                setAuthErr(err.errObj);
                // this.props.history.push("/login");
            }
        }
    }

    const value = {
        authUser: authUser,
        authErr: authErr,
        loginUser: login,
        logoutUser: logout
    };

    return <>
        <MyNavbar value={value}/>
        <Switch>
            <Route path="/login">
                <LoginPage value={value}/>
            </Route>
            <Route path="/newrental">
                <NewRental value={value}/>
            </Route>
            <Route path="/">
                <Cars handleErrors={handleErrors}/>
            </Route>
        </Switch>
    </>;
}

export default App;
