import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import cloudinary from "../utils/cloudinary.js";

export const getProducts = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Product.findAll({
        attributes: [
          "uuid",
          "createdAt",
          "kematian",
          "pakan",
          "bobot",
          "image",
        ],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Product.findAll({
        attributes: [
          "uuid",
          "createdAt",
          "kematian",
          "pakan",
          "bobot",
          "image",
        ],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin") {
      response = await Product.findOne({
        attributes: [
          "uuid",
          "createdAt",
          "kematian",
          "pakan",
          "bobot",
          "image",
        ],
        where: {
          id: product.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Product.findOne({
        attributes: [
          "uuid",
          "createdAt",
          "kematian",
          "pakan",
          "bobot",
          "image",
        ],
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { createdAt, kematian, bobot, pakan, image } = req.body;
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "majumapan",
      // width: 300,
      // crop: "scale"
    });
    await Product.create({
      createdAt: createdAt,
      kematian: kematian,
      bobot: bobot,
      pakan: pakan,
      image: result.url,
      userId: req.userId,
    });
    // console.log(result)
    res.status(201).json({ msg: "Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { name, price, createdAt, kematian, pakan, bobot, image } = req.body;
    if (req.role === "admin") {
      await Product.update(
        { createdAt, kematian, pakan, bobot, image },
        {
          where: {
            id: product.id,
          },
        }
      );
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Product.update(
        { name, price, createdAt, kematian, pakan, bobot, image },
        {
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Product updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { name, price } = req.body;
    if (req.role === "admin") {
      await Product.destroy({
        where: {
          id: product.id,
        },
      });
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Product.destroy({
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Product deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
