import React, {useEffect, useState} from 'react';
import Cars from "./components/Cars";
import MyNavbar from "./components/Navbar";
import {Route} from 'react-router-dom';
import {Switch} from 'react-router';
import API from "./api/API";
import LoginPage from "./components/LoginPage";
import RentalForm from "./components/NewRental";
import PastRentalsTable from "./components/PastRentals";
import FutureRentalsTable from "./components/FutureRentals";

function App(props) {
    const [authUser, setAuthUser] = useState(undefined)
    const [authErr, setAuthErr] = useState(undefined);
    const [logged , setLogged] = useState(false);

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect( () => {
        API.getCategories()
            .then( (categories) => setCategories(categories) )
            .catch( (errorObj) => handleErrors(errorObj) );
        API.getBrands()
            .then( (brands) => setBrands(brands) )
            .catch( (errorObj) => handleErrors(errorObj) );
    }, []);

    useEffect(() => {
        API.isAuthenticated()
            .then((user) => {
                setAuthUser(user)
                setLogged(true);
            })
            .catch((err) => setAuthErr(err.errObj.errors[0]));
    }, []);

    const login = (usr, pwd) => {
        API.userLogin(usr, pwd)
            .then((user) => {
                console.log(user);
                setAuthUser(user);
                setAuthErr(undefined);
                setLogged(true);
            })
            .catch((errorObj) => {
                const err0 = errorObj.errors[0];
                setAuthErr(err0);
            });
    };

    const logout = () => {
        API.userLogout().then(() => {
            setAuthUser(undefined);
            setAuthErr(undefined);
            setLogged(false);
        });
    };

    const handleErrors = (err) => {
        if (err) {
            if (err.status && err.status === 401)
                setAuthErr(err.errObj.errors[0]);
            if (err.status && err.status === 500)
                err.errObj.errors[0].msg = "Internal Server Error"
        }
    }

    const value = {
        logged: logged,
        authUser: authUser,
        authErr: authErr,
        loginUser: login,
        logoutUser: logout,
        handleErrors: handleErrors
    };

    return <>
        <MyNavbar value={value}/>
        <Switch>
            <Route path="/login">
                <LoginPage value={value}/>
            </Route>
            <Route path="/newrental">
                <RentalForm value={value}
                           categories={categories}/>
            </Route>
            <Route path="/pastrentals">
                <PastRentalsTable value={value}/>
            </Route>
            <Route path="/futurerentals">
                <FutureRentalsTable value={value}/>
            </Route>
            <Route path="/">
                <Cars handleErrors={handleErrors}
                      categories={categories}
                      brands={brands}/>
            </Route>
        </Switch>
    </>;
}

export default App;
