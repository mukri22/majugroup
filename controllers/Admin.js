import User from "../models/UserModel.js";
import Admin from "../models/AdminModel.js";
import {Op} from "sequelize";

export const getAdmins = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await Admin.findAll({
                attributes:['uuid', 'isi', 'populasi', 'doc'],
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Admin.findAll({
                attributes:['uuid', 'isi', 'populasi', 'doc'],
                where:{
                    userId: req.userId
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getAdminById = async(req, res) =>{
    try {
        const admin = await Admin.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!admin) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Admin.findOne({
                attributes:['uuid','isi', 'populasi', 'doc'],
                where:{
                    id: admin.id
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Admin.findOne({
                attributes:['uuid','isi', 'populasi', 'doc'],
                where:{
                    [Op.and]:[{id: admin.id}, {userId: req.userId}]
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createAdmin = async(req, res) =>{
    const {isi, populasi, doc} = req.body;
    try {
        await Admin.create({
            isi: isi,
            populasi: populasi,
            doc: doc,
            userId: req.userId
        });
        res.status(201).json({msg: "Admin Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateAdmin = async(req, res) =>{
    try {
        const admin = await Admin.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!admin) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {isi, populasi, doc} = req.body;
        if(req.role === "admin"){
            await Admin.update({createdAt, kematian, pakan, bobot},{
                where:{
                    id: admin.id
                }
            });
        }else{
            if(req.userId !== admin.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Admin.update({isi, populasi, doc},{
                where:{
                    [Op.and]:[{id: admin.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Admin updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteAdmin = async(req, res) =>{
    try {
        const admin = await Admin.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!admin) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {isi, populasi, doc} = req.body;
        if(req.role === "admin"){
            await Admin.destroy({
                where:{
                    id: admin.id
                }
            });
        }else{
            if(req.userId !== admin.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Admin.destroy({
                where:{
                    [Op.and]:[{id: admin.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Admin deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}