import UserModel from "../models/UserModel";
import ProductModel from "../models/ProductModel";
import ProfileModel from "../models/ProfileModel";
import ContactModel from "../models/BrandModel";
import CurrentAddressModel from "../models/CurrentAddressModel";
import HometownAddressModel from "../models/hometownAddressModel";
import BrandModel from "../models/BrandModel";
import CategoryModel from "../models/CategoryModel";
import BannerModel from "../models/banner";
//Query user from the database
const Query = {
  //Query User All information**********************************************
  user: (parent, args, { userId }, info) => {
    //Check User loged in
    if (!userId) throw new Error("Plz login...!");
    // if(userId) throw new Error('You are not authorized...!')//!== args.id
    return UserModel.findById(userId)
      .populate({
        path: "products",
        options: { sort: { createdAt: "desc" } },
        populate: { path: "user" },
      })
      .populate({
        path: "carts",
        options: { sort: { createdAt: "desc" } },
        populate: { path: "product" },
      })
      .populate({
        path: "orders",
        options: { sort: { createAt: "desc" } },
        populate: {
          path: "items",
          populate: { path: "product" },
        },
      })
      .populate({ path: "profile" })
      .populate({ path: "contact" })
      .populate({ path: "currentAddress" })
      .populate({ path: "hometownAddress" })
      .populate({
        path: "brands",
        options: { sort: { createAt: "desc" } },
        populate: { path: "products" },
      })
      .populate({
        path: "categories",
        options: { sort: { createAt: "desc" } },
        populate: { path: "products" },
      })
      .populate({
        path: "bankAccounts",
        options: { sort: { createAt: "desc" } },
        populate: "user",
      }); //, populate: { path: "user" }
  },

  users: (parent, args, context, info) =>
    UserModel.find({})
      .populate({
        path: "products",
        options: { sort: { createdAt: "desc" } },
        populate: { path: "user" },
      })
      .populate({
        path: "carts",
        populate: { path: "product" },
      }),

  product: (parent, args, context, info) =>
    ProductModel.findById(args.id).populate({
      path: "user",
      options: { sort: { createdAt: "desc" } },
      populate: { path: "products" },
    }),

  products: (parent, args, context, info) =>
    ProductModel.find().populate({
      path: "user",
      options: { sort: { createdAt: "desc" } },
      populate: { path: "products" },
    }),

  profile: (parent, args, context, info) =>
    ProfileModel.findById(args.id).populate({
      path: "user",
      populate: { path: "profile" },
    }),
  contact: (parent, args, context, info) =>
    ContactModel.findById(args.id).populate({
      path: "user",
      populate: { path: "contacts" },
    }),
  currentAddress: (parent, args, context, info) =>
    CurrentAddressModel.findById(args.id).populate({
      path: "user",
      populate: { path: "currentAddress" },
    }),
  hometownAddress: (parent, args, context, info) =>
    HometownAddressModel.findById(args.id).populate({
      path: "user",
      populate: { path: "hometownAddress" },
    }),
  brands: (parent, args, context, info) =>
    BrandModel.find().populate({
      path: "user",
      path: "products",
      populate: { path: "user" },
    }),
  categories: (parent, args, context, info) =>
    CategoryModel.find().populate({
      path: "user",
      path: "products",
      populate: { path: "user" },
    }),

  banners: (parent, args, context, info) =>
    BannerModel.find().populate({
      path: "user",
      options: { sort: { createdAt: "desc" } },
      populate: { path: "banners" },
    }),
};
export default Query;
