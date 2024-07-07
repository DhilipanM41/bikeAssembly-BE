const mssql = require("mssql");
const { dbConfig } = require("../config/dbCreds");

const executeSqlQuery = async (qry) => {
    try {
        const connection = await mssql.connect(dbConfig);
        let rows = await connection.query(qry);
        await connection.close();
        return rows
    } catch (error) {
        return error;
    }
}

const getBikeDetails = async (req, res) => {
    try {

        let payload = req.body;
        let getBikeData;

        getBikeData = await executeSqlQuery(`SELECT t1.assembly_map_id, t1.bike_id, bike_name, assembly_hours, assembly_minutes, status FROM BikeAssemblyDetails t1 inner join BikeDetails t2 on t1.bike_id = t2.bike_id where t1.employee_id = ${payload.id}`);

        if (getBikeData.rowsAffected[0] > 0) {
            let structureData = {
                records: getBikeData.recordset,
                recordCounts: getBikeData.rowsAffected[0],
                selectBike: false
            }
            res.status(200).send(structureData);
        } else {
            getBikeData = await executeSqlQuery(`SELECT bike_id, bike_name, assembly_hours, assembly_minutes FROM BikeDetails;`);
            let structureData = {
                records: getBikeData.recordset,
                recordCounts: getBikeData.rowsAffected[0],
                selectBike: true
            }
            res.status(200).send(structureData);

        }


    } catch (error) {
        res.status(400).send(error.message);
    }
}


const mapBikeAssemblytoEmployee = async (req, res) => {
    try {
        let payload = req.body;
        const result = await executeSqlQuery(`INSERT INTO BikeAssemblyDetails (employee_id, bike_id, status) VALUES ('${payload.employeeID}', '${payload.bikeID}', '${payload.status}');`);
        if (result.rowsAffected[0] === 1) res.status(200).send("Success");
        else res.status(400).send("Insert failed");

    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateBikeAssemblyStatus = async (req, res) => {
    try {
        let payload = req.body;
        const result = await executeSqlQuery(`update BikeAssemblyDetails set status = '${payload.assemblyStatus}' where assembly_map_id = ${payload.assemblyMapId};`);
        if (result.rowsAffected[0] === 1) res.status(200).send("Success");
        else res.status(400).send("Update failed");

    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllBikeAssemblyData = async (req, res) => {
    try {
        let payload = req.body;
        const result = await executeSqlQuery(`SELECT t1.employee_id, t1.bike_id, bike_name, assembly_hours, assembly_minutes, status, t1.created_at FROM BikeAssemblyDetails t1 inner join BikeDetails t2 on t1.bike_id = t2.bike_id;`);

        const numOfBikesResult = await executeSqlQuery(
            `SELECT COUNT(t1.bike_id) as bike_count, bike_name
        FROM BikeAssemblyDetails t1 
        inner join BikeDetails t2 
        on t1.bike_id = t2.bike_id
        WHERE t1.created_at between '${payload.fromDate || ''}' and '${payload.toDate || ''}' or ('${payload.fromDate || ''}' = '')
        GROUP BY t1.bike_id, bike_name;
        `)


        let structureData = {
            pieChartData: result.recordset,
            lineChartData: numOfBikesResult.recordset
        }
        res.status(200).send(structureData);

    } catch (error) {
        res.status(400).send(error.message);
    }
}



module.exports = {
    getBikeDetails, mapBikeAssemblytoEmployee, getAllBikeAssemblyData, updateBikeAssemblyStatus
}