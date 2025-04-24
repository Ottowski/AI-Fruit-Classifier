const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
app.use(express.json());
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});
let fruits = [];
// POST 
app.post('/fruit', (req, res) => {
    const { name, color } = req.body;
    if (!name || !color) {
        return res.status(400).json({ message: 'Name and color are required' });
    }
    const fruit = { id: fruits.length + 1, name, color };
    fruits.push(fruit);
    res.status(201).json({ message: 'Fruit added!', fruit });
});
// GET 
app.get('/fruits', (req, res) => {
    res.json(fruits);
});
// Frukt baserat på vädret
async function createFruitBasedOnWeather() {
    const weatherData = await getWeatherData();
    if (weatherData) {
        const { main: weatherCondition } = weatherData.weather[0];
        if (weatherCondition.toLowerCase() === 'clear') {
            const sunnyFruit = { id: fruits.length + 1, name: 'Solig Frukt', color: 'Yellow' };
            fruits.push(sunnyFruit);
            console.log('Created a "Solig Frukt" because the weather is clear.');
        }
    }
}
// Hämtar väderdata från OpenWeatherMap API
async function getWeatherData() {
    const apiKey = 'd7b75f77ece57509bea8e378d44317d7'; // Min API-nyckel
    const city = 'Stockholm';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}
createFruitBasedOnWeather();
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",  // OpenAPI version
        info: {
            title: "Fruitbasket API",
            version: "1.0.0",
            description: "A simple Express API to manage fruits.",
        },
    },
    apis: ["index.js"],  
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


/**
 * @swagger
 * /fruit:
 *   post:
 *     summary: Adds a new fruit
 *     description: This will add a new fruit to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - color
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fruit added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fruit:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     color:
 *                       type: string
 *       400:
 *         description: Invalid input
 *
 * 
 /fruits:
 *   get:
 *     summary: Get all fruits
 *     description: This will return all fruits in the database
 *     responses:
 *       200:
 *         description: A list of fruits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   color:
 *                     type: string
 *       500:
 *         description: Internal server error
 */