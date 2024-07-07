const mssql = require("mssql");
const { dbConfig, JWT_SECRET_KEY } = require("../config/dbCreds");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const executeSqlQuery = async (qry) => {
    try {
        const connection = await mssql.connect(dbConfig);
        let rows = await connection.query(qry);
        await connection.close();
        return rows;
    } catch (error) {
        return error;
    }

}

const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error while hashing password');
    }
}

const createNewEmployee = async (req, res) => {
    try {
        const payload = req.body;

        let hashedPass = await hashPassword(payload.password)

        await executeSqlQuery(`INSERT INTO EmployeeDetails (employee_name, password, email_address) values ('${payload.employeeName}', '${hashedPass}', '${payload.emailAddress}') ;`);
        res.status(200).send('User Created');

    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}

const employeeLogin = async (req, res) => {
    try {
        const payload = req.body;
        const result = await executeSqlQuery(`SELECT employee_id, employee_name, password, is_admin FROM EmployeeDetails WHERE email_address = '${payload.emailAddress}'`);
        if (result.recordset?.length === 0) {
            res.status(404).send('User not found');
        }

        const hashedPassword = result?.recordset[0]?.password;

        // Compare hashed password with user-provided password
        const passwordMatch = await bcrypt.compare(payload.password, hashedPassword);

        if (passwordMatch) {
            const token = jwt.sign({ id: result.recordset[0].employee_id, username: result.recordset[0].employee_name, admin: result.recordset[0].is_admin ? true : false }, JWT_SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ token });
        } else {
            res.status(401).send('Authentication failed');
        }
    } catch (error) {
        res.status(401).send('Authentication failed');
    }
}

module.exports = {
    createNewEmployee, employeeLogin
}
