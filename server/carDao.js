'use strict';

const Car = require('./Car');
const db = require('./db');

exports.getCars = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM cars";
        db.all(sql, [], (err, rows) => {
           if(err) reject(err);
           else{
               let cars = rows.map((row) => new Car(row.id, row.category, row.brand, row.model));
               resolve(cars);
           }
        });
    });
}

exports.getCategories = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT DISTINCT category FROM cars";
        db.all(sql, [], (err, rows) => {
            if(err) reject(err);
            else resolve(rows);
        });
    });
}

exports.getBrands = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT DISTINCT brand FROM cars";
        db.all(sql, [], (err, rows) => {
            if(err) reject(err);
            else resolve(rows);
        });
    });
}

exports.getAvailableCars = function (params) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id FROM cars WHERE category=? AND id NOT IN (SELECT cid FROM rentals WHERE endDay > DATE(?) AND startingDay < DATE(?))";
        db.all(sql, [
            params.category,
            params.startingDay,
            params.endDay
        ], (err, rows) => {
            if(err) reject(err);
            else resolve(rows);
        });
    });
}

exports.getFinishedRentals = function (userId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) AS c FROM rentals WHERE uid = ? AND DATE(endDay) < CURRENT_DATE";
        db.get(sql, [userId], (err, row) => {
            // console.log(row.c);
            const value = row.c;
            if(err) reject(err);
            else resolve(value);
        });
    });
}

exports.getCarsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) AS c FROM cars WHERE category = ?";
        db.get(sql, [category], (err, row) => {
            const value = row.c;
            if(err) reject(err);
            else resolve(value);
        });
    });
}

exports.insertRental = function (params) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO rentals(cid, uid, startingDay, endDay, extraDrivers, extraInsurance, age, distance) VALUES(?, ?, DATE(?), DATE(?), ?, ?, ?, ?)';
        db.run(sql, [
            params.cid,
            params.uid,
            params.startingDay,
            params.endDay,
            params.extraDrivers,
            params.extraInsurance,
            params.age,
            params.distance
        ], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};

exports.getPastRentals = function (uid) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * from rentals as r, cars as c WHERE r.cid == c.id AND uid == ? AND DATE(endDay) < CURRENT_DATE";
        db.all(sql, [uid], (err, rows) => {
            if(err) reject(err);
            else resolve(rows);
        });
    });
}
