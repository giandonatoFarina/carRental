async function isAuthenticated(){
    let url = "/api/user";
    const response = await fetch(url);
    const userJson = await response.json();
    if(response.ok){
        return userJson;
    } else {
        let err = {status: response.status, errObj:userJson};
        throw err;  // An object with the error coming from the server
    }
};

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





const cars = [
    {id: 1, category: "A", brand: "Fiat", model: "Panda" },
    {id: 2, category: "A", brand: "Fiat", model: "500" },
    {id: 3, category: "A", brand: "Smart", model: "ForTwo" },
    {id: 4, category: "B", brand: "Citroën", model: "C3" },
    {id: 5, category: "B", brand: "Fiat", model: "Punto" },
];

const brands = [ "Fiat", "Smart", "Citroën" ];

const categories = [ "A", "B" ];

function getCars() {
    return cars;
}

function getBrands() {
    return brands;
}

function getCategories() {
    return categories;
}

const API = { isAuthenticated, userLogin, userLogout, getCars, getBrands, getCategories };
export default API;