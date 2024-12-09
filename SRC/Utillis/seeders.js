import {CustomerModel} from "../../DB/Models/customer.model.js";
import {CategoryModel, ProductModel} from "../../DB/Models/product.model.js";
import {CartModel} from "../../DB/Models/cart.model.js";
import {OrderModel} from "../../DB/Models/order.model.js";
import {hashPassword} from "./hashPassword.js";
import {dbConnection, sequelize} from "../../DB/connections.js";


const getRandomNumber = (min, max, notFloat = false) => {
    let num = Math.random() * (max - min) + min;
    if(notFloat){
        return Math.floor(num);
    }
    return num;    
}


const createCustomers = async () => {
    let arrOfCustomers = [
        {firstName: "mario", lastName: "malak", email: "mario@gmail.com"},
        {firstName: "malak", lastName: "alabd", email: "malak@gmail.com"},
        {firstName: "alabd", lastName: "sefen", email: "alabd@gmail.com"},
        {firstName: "sefen", lastName: "soliman", email: "sefen@gmail.com"},
    ]

    for (let index = 0; index < arrOfCustomers.length; index++) {
        let hashedPassword = await hashPassword(arrOfCustomers[index].firstName + arrOfCustomers[index].lastName + "123");
        await CustomerModel.create({firstName: arrOfCustomers[index].firstName, lastName: arrOfCustomers[index].lastName, email: arrOfCustomers[index].email, phone: `012101048${getRandomNumber(1, 10, true)}${getRandomNumber(1, 10, true)}`, password: hashedPassword});
    }
}


const createCategories = async () => {
    for (let index = 1; index <= 4; index++) {
        await CategoryModel.create({name : `category${index}`});
    }
}

const createProducts = async () => {
    for (let index = 1; index <= 15; index++) {
        await ProductModel.create({name : `product${index}`, price: getRandomNumber(1, 1000), quantity: getRandomNumber(1, 200, true), categoryID: getRandomNumber(1, 4, true)});
    }
}

const createCarts = async () => {
    for (let index = 0; index < 20; index++) {
        await CartModel.create({customerID: getRandomNumber(1, 4, true)});
    }
}


const createOrders = async () => {
    for (let i = 1; i < 21; i++) {
        const cart = await CartModel.findByPk(i);
        let total = 0;

        let numberOfOrdersInCart = getRandomNumber(1, 15, true);
        
        for (let j = 0; j < numberOfOrdersInCart; j++) {
            const product = await getRandomNumber(1, 15, true);

            const order = await OrderModel.create({product: product, amount: getRandomNumber(1, 15, true), cartID: cart.id});
            total += order.amount * product.price;
        }
        cart.total = total;
        await cart.save();
    }
}

const removeAllData = async () => {
    // await OrderModel.destroy({truncate: true});
    // await ProductModel.destroy({truncate: true});
    await CartModel.destroy({truncate: true, cascade: true});
    await CategoryModel.destroy({truncate: true, cascade: true});
    await CustomerModel.destroy({truncate: true, cascade: true});
}


const main = async () => {
    // await removeAllData();
    await dbConnection();
    await createCustomers();
    await createCategories();
    await createProducts();
    await createCarts();
    await createOrders();
}


main().then(() => {
    console.log("Done");
});