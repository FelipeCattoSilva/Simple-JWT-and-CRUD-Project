const express = require("express")
const fs = require("fs")
const path = require("path")
const bcrypt = require("bcrypt")
const cors = require("cors")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const jwt_secret = process.env.JWT_SECRET

const app = express()
const PORT = 8000

app.use(cors())
app.use(express.json())

const dataUsersPath = path.join(__dirname, "data/users.json")
const dataProductsPath = path.join(__dirname, "data/products.json")
const getUsers = () => {
    const data = fs.readFileSync(dataUsersPath, "utf-8")
    return JSON.parse(data)
}
const getProducts = () => {
    const data = fs.readFileSync(dataProductsPath, "utf-8")
    return JSON.parse(data)
}

const saveUser = (users) => {
    fs.writeFileSync(dataUsersPath, JSON.stringify(users, null, 4))
}
const saveProduct = (products) => {
    fs.writeFileSync(dataProductsPath, JSON.stringify(products, null, 4))
}

const tokenAuthentication = (req, res, next) => {
    const auth = req.headers[`authorization`]
    const token = auth && auth.split(" ")[1]

    if (!token) return res.status(401).json({ message: `Access denied! No token.` })

    jwt.verify(token, jwt_secret, async (err, user) => {
        if (err) return res.status(403).json({ message: `Access denied!` })

        req.user = user
        next()
    })
}

app.post("/register", async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ message: `Invalid request! Email and Password required` })

    const users = getUsers()
    if (users.find(user => user.email == email)) {
        return res.status(400).json({ message: `Email already in use` })
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = {
        id: Date.now(),
        email,
        password: hashPassword
    }

    users.push(newUser)
    saveUser(users)
    res.status(200).json({ message: `User created!` })
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ message: `Invalid request! email and password are required` })

    const users = getUsers()
    const user = users.find(user => user.email == email)
    if (!user) return res.status(400).json({ message: `Invalid Email` })
    const hashPassword = await bcrypt.compare(password, user.password)
    if (!hashPassword) return res.status(400).json({ message: `Invalid Password` })

    const token = jwt.sign({ id: user.id, email: user.email }, jwt_secret, { expiresIn: "15m" })
    res.status(200).json({ message: `User logged!`, token: token })
})

app.get("/dashboard", tokenAuthentication, (req, res) => {
    res.json({ message: `Welcome user`, user: req.user, products: getProducts() })
})

app.post("/product", tokenAuthentication, async (req, res) => {
    const { name, description, price } = req.body

    if (!name || !description || !price) return res.status(400).json({ message: `Invalid request! name, description and price are required` })

    const products = getProducts()

    const newProduct = {
        id: Date.now(),
        name,
        description,
        price
    }

    products.push(newProduct)
    saveProduct(products)
    res.status(200).json({ message: `Product created!`, data: newProduct })
})

app.get("/product", (req, res) => {
    res.json({ message: `Products found successfully`, products: getProducts() })
})

app.patch("/product", async (req, res) => {
    const { id, name, description, price } = req.body

    if (!id) return res.status(400).json({ message: `Invalid request! id is required` })

    const products = getProducts()
    const index = products.findIndex(p => p.id == id)
    if (index === -1) return res.status(404).json({ message: `Product not found` })

    if (name) products[index].name = name
    if (description) products[index].description = description
    if (price) products[index].price = price

    saveProduct(products)
    res.status(200).json({ message: `Product updated!`, data: products[index] })
})

app.delete("/product/:id", (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: `Invalid request! id is required` })
    const products = getProducts()
    const index = products.findIndex(p => p.id == id)
    if (index === -1) return res.status(404).json({ message: `Product not found` })

    const deleted = products.splice(index, 1)[0]
    saveProduct(products)
    res.status(200).json({ message: `Product deleted!`, data: deleted })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})