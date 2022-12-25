import { Sequelize } from "sequelize";

const db = new Sequelize ('auth_db', 'sulton', 'sulton', {
    host: "localhost",
    dialect: "mysql"
});

export default db;
