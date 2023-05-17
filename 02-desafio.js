import fs from 'fs'

class ProductManager {
    #path
    #format
    #products
    constructor(path) {
        this.#path = path
        this.#products = []
        this.#format= 'utf-8'
    }

    #generateId = async () => {
        const products = await this.getProducts()
        return products.length === 0 ? 1 : products[products.length - 1].id + 1
    }

    #validateProduct = async (product) => {
        for (const key in product) {
            if (!product[key]) {
                console.log("Todos los campos son obligatorios")
                return false
            }
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        const products = await this.getProducts()

        const existingProduct = products.find(
            (product) => product.title === title && product.code === code)

        if (!existingProduct) {
            products.push({ id: await this.#generateId(), title, description, price, thumbnail, code, stock })
            return await fs.promises.writeFile(this.#path, JSON.stringify(products,null, '\t'))
        } 
    }

    getProducts = async () => {
        return JSON.parse(await fs.promises.readFile(this.#path, this.#format))
    }

    getProductById = async (id) => {
        const products = await this.getProducts()
        return products.find((product) => product.id === id) || `El producto con el id ${id} no existe`
    }

    updateProduct = async (id, update) => {
        const products = await this.getProducts()
        const index = products.findIndex((prod) => prod.id === id)
        if (index !== -1) {
        const isValid = await this.#validateProduct(update)
        if (!isValid) {
            return console.log("Error al actualizar: actualización inválida")
        }
        products[index] = { ...products[index], ...update }
        await fs.promises.writeFile(
            this.#path,
            JSON.stringify(products, null, "\t"),
            this.#format
        )
        this.products = products
        return console.log("Producto Actualizado", products[index]);
        }
        return console.log("Error al actualizar: Producto no encontrado");
    }

    deleteProduct = async (id) => {
        const products = await this.getProducts();
        const newProducts = products.filter(product => product.id !== id)
            await fs.promises.writeFile(this.#path, JSON.stringify(newProducts, null, '\t'));
    }
}

// Se creará una instancia de la clase “ProductManager”
const manager = new ProductManager("./products.json")

// Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
//console.log(await manager.getProducts())

// Se llamará al método “addProduct” con los campos requeridos y se agregará un producto:
// await manager.addProduct(
//     "producto 1",
//     "Descripción del producto 1",
//     100,
//     "ruta-imagen-1.jpg",
//     "001",
//     25
// )

// await manager.addProduct(
//     "Producto 2",
//     "Descripción del Producto 2",
//     200,
//     "ruta-imagen-2.jpg",
//     "002",
//     10
// )

// await manager.addProduct(
//     "Producto 3",
//     "Descripción del Producto 3",
//     300,
//     "ruta-imagen-3.jpg",
//     "003",
//     15
// )

// Se llamará nuevamente al método 'getProducts' para obtener la lista actualizada de productos:
// console.log(await manager.getProducts())

// Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error:
// console.log(await manager.getProductById(1))

// Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización:

// await manager.updateProduct(1, {
//     title: "Producto 1",
//     description: "Descripción del Producto 1",
//     price: 400,
//     thumbnail: "ruta-imagen-1.jpg",
//     code: "001",
//     stock: 50
// })

// Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir:
// console.log(await manager.deleteProduct(1))

