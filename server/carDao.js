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