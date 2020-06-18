import Car from "./Car";

const baseURL = "/api";

async function isAuthenticated(){
    let url = baseURL + "/user";
    const response = await fetch(url);
    const userJson = await response.json();
    if(response.ok){
        return userJson;
    } else {
        let err = {status: response.status, errObj: userJson};
        throw err;  // An object with the error coming from the server
    }
}

async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, password: password}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogout(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

async function getCars() {
    const response = await fetch(baseURL + "/cars");
    const carsJson = await response.json();
    if(response.ok) return carsJson.map((c) => Car.from(c));
    else {
        let err = { status: response.status, errObj: carsJson };
        throw err;
    }
}

async function getBrands() {
    const response = await fetch(baseURL + "/brands");
    const brandsJson = await response.json();
    if(response.ok) return brandsJson.map( (obj) => obj.brand);
    else {
        let err = { status: response.status, errObj: brandsJson };
        throw err;
    }
}

async  function getCategories() {
    const response = await fetch(baseURL + "/categories");
    const categoriesJson = await response.json();
    if(response.ok) return categoriesJson.map( (obj) => obj.category );
    else {
        let err = { status: response.status, errObj:categoriesJson };
        throw err;
    }
}

async function getAvailableCars(params) {
    const distance = { "50": 0, "150": 1, "unlimited": 2};

    const response = await fetch(baseURL
        +"/configurator?category="+params.category
        +"&startingDay="+params.startingDay
        +"&endDay="+params.endDay
        +"&age="+params.age
        +"&distance="+params.distance
        +"&extraDrivers="+params.extraDrivers
        +"&extraInsurance="+params.extraInsurance);
    const responseJson = await response.json();
    if(response.ok) return  responseJson;
    else{
        let err = { status: response.status, errObj:responseJson };
        throw err;
    }
}

const API = { isAuthenticated, userLogin, userLogout, getCars, getBrands, getCategories, getAvailableCars };
export default API;