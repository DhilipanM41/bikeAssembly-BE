const express = require('express')
const app = express();
const cors = require('cors');
const { createNewEmployee, employeeLogin } = require('./repo/login');
const { JWT_SECRET_KEY } = require('./config/dbCreds');
const jwt = require('jsonwebtoken');
const { getBikeDetails, mapBikeAssemblytoEmployee, getAllBikeAssemblyData, updateBikeAssemblyStatus } = require('./repo/repo');


app.use(cors())
app.use(express.json())

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

// Handle login and create employee creds
app.post('/addNewEmployee', createNewEmployee);

app.post('/login', employeeLogin);

// Authenticate user based on JWT token
app.use(authenticateToken);

app.post('/getbikes', getBikeDetails);

app.post('/mapBikeAssembly', mapBikeAssemblytoEmployee);

app.post('/getAllAssemblyDetails', getAllBikeAssemblyData);

app.post('/updateAssemblyStatus', updateBikeAssemblyStatus);


app.listen(8080, () => console.log('listening 8080 port'))