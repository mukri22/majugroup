import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Admin = db.define('admin',{

    isi:{
        type: DataTypes.DATE,
        allowNull: true,
        validate:{
            notEmpty: false,
            len: [3, 100]
        }
    },
    populasi:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: false
        }
    },
    doc:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    }


});

export default Admin;