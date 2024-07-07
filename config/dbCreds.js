const dbConfig = {
    user: "sa",
    password: "Admin123",
    server: "DESKTOP-MRT4EGH\\SQLEXPRESS",
    database: "BikeAssemblyService",
    port: 1433,
    options: {
        trustServerCertificate: true
    }
}

const JWT_SECRET_KEY = 'hmac1081243';

module.exports = { dbConfig, JWT_SECRET_KEY };
