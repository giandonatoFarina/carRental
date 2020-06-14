class Car{
    constructor(id, category, brand, model) {
        this.id = id;
        this.category = category;
        this.brand = brand;
        this.model = model;
    }

    static from(json) {
        return Object.assign(new Car(), json);
    }
}

export default  Car;