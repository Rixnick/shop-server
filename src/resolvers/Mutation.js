import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
/**
 * Import From Models
 */
import UserModel from "../models/UserModel";
import ProductModel from "../models/ProductModel";
import Cart from "../models/CartModel";
import Profile from "../models/ProfileModel";
import ContactModel from "../models/Contact";
import CurrentAddressModle from "../models/CurrentAddressModel";
import HometownModel from "../models/hometownAddressModel";
import BrandModel from "../models/BrandModel";
import BankModel from "../models/BankModel";
import CategoryModel from "../models/CategoryModel";
import BannerModel from "../models/banner";
import OrderItem from "../models/OrderItems";
import Order from "../models/OrderModel";
import CheckoutModel from "../models/CheckOutMOdel";
// import {
//       createCharge,
//       createCustomer,
//       retrieveCustomer,
// } from "../utils/stripeUtil";
import {
  retrieveOmiseCustomer,
  createOmiseCustomer,
  createOmiseCharge,
} from "../utils/omiseUtil";
import User from "../models/UserModel";

//TODO:
// 1. install sendgrid,
// 2. Set Api Key to .env,
//3. Config mail send link to user
/**
 * Mutation user CUD to database
 */

//  console.log("Stripe APi:", stripe)
const Mutation = {
  signup: async (parent, args, context, info) => {
    //Check if not email
    const email = args.email.trim().toLowerCase();
    const currentUser = await UserModel.find({});
    const isEmailExist =
      currentUser.findIndex((user) => user.email === email) > -1;
    if (isEmailExist) {
      throw new Error("Email already exist...!");
    }
    //Check Validate password
    if (args.password.trim().length < 6) {
      throw new Error("Password must be least at 6 characters");
    }
    const password = await bcrypt.hash(args.password, 10);
    const newUser = await UserModel.create({
      ...args,
      email,
      password,
    });

    return newUser;
  },
  /**
   * ************* Signin ****************************
   */
  login: async (parent, args, context, info) => {
    const { email, password } = args;
    //Find User in database
    const user = await UserModel.findOne({ email })
      .populate({
        path: "products",
        populate: { path: "user" },
      })
      .populate({
        path: "carts",
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
      .populate({ path:"checkout" });
    if (!user) throw new Error("Email not found, Plz sign up...!");

    //Check Password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Invalid email or password...!");

    //Create Generate key token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET, {
      expiresIn: "1d",
    });
    return { user, jwt: token };
  },

  /**
   * *********** Request To Reset Password Mutation | Function ********************
   */
  requestResetPassword: async (parent, { email }, context, info) => {
    //1. Find user from database by email
    const user = await UserModel.findOne({ email });

    //2. if no user found, Throw Error
    if (!user) throw Error("Email not found, Please Sign up instead...!");

    //3. create reset password token and reset Token Expire
    const resetPasswordToken = randomBytes(32).toString("hex");
    const resetPasswordTokenExpiry = Date.now() + 30 * 60 * 10;

    //4. Update user (save reset password token and reset token expire)
    await UserModel.findByIdAndUpdate(user.id, {
      resetPasswordToken,
      resetPasswordTokenExpiry,
    });

    //5. Send Reset password link to user via email
    //Config mail Api key here

    const message = {
      from: "service-noreply@mail.com", //Web Email here
      to: user.email,
      subject: "Reset Password Link",
      html: `
          <div>
              <p>Please click the link below to reset your password.</p> \n\n
              <a href='http://localhost:3000/signin/resetpassword?resetToken=${resetPasswordToken}' target='_blank' style={{color: 'teal'}}>Click To Reset Password</a>
          </div>
        `,
    };

    //6. return message to frontend
    return {
      message: "Please check your email to proceed reset password...!",
    };
  },

  /**
   * ********************** Create user's Product ***********************
   */
  createProduct: async (parent, args, { userId }, info) => {
    //Check User logged in
    if (!userId) throw new Error("Plz Login to processed...!");
    if (
      !args.name ||
      !args.description ||
      !args.price ||
      !args.stockqty ||
      !args.imageUrl
    ) {
      throw new Error("Plz, provide all required field...!");
    }
    const product = await ProductModel.create({
      ...args,
      user: userId,
    });
    const user = await UserModel.findById(userId);
    if (!user.products) {
      user.products = [product];
    } else {
      user.products.push(product);
    }
    // console.log(user)
    await user.save();
    return ProductModel.findById(product.id).populate({
      path: "user",
      populate: { path: "products" },
    });
  },

  /**
   * ********************* Update Prodroct mutation ************************
   */
  updateProduct: async (parent, args, { userId }, info) => {
    const { id, name, description, price, imageUrl } = args;

    //TODO: Check if user login
    if (!userId) throw new Error("Plz, login to process");
    //GET QUERY Product from database
    const product = await ProductModel.findById(id);

    //TODO: Check User loged in is the onwer Product
    if (userId !== product.user.toString()) {
      throw new Error("You are not authorized...!");
    }

    const updateInfo = {
      name: !!name ? name : product.name,
      description: !!description ? description : product.description,
      price: !!price ? price : product.price,
      imageUrl: !!imageUrl ? imageUrl : product.imageUrl,
    };

    //Update Product information in database
    await ProductModel.findByIdAndUpdate(id, updateInfo);

    //Find the updated Product and return
    const updatedProduct = await ProductModel.findById(id).populate({
      path: "user",
    });

    return updatedProduct;
  },
  /**
   * ****************************User Profile********************************
   * ****************** Create User Profile Mutation **************************
   */
  createProfile: async (parent, args, { userId }, info) => {
    ///const userId = '5f8ff4203691c32a725e0b26'
    if (!userId) throw new Error("Plz,login to proceed...!");
    if (
      !args.firstname ||
      !args.lastname ||
      !args.birthdate ||
      !args.age ||
      !args.gender ||
      !args.mentalStatus ||
      !args.profileImage ||
      !args.coverImage
    ) {
      throw new Error("Plz, provide all required field...!");
    }
    const profile = await Profile.create({
      ...args,
      user: userId,
    });
    const user = await UserModel.findById(userId);
    // console.log(profile)
    if (!user.profile) {
      user.profile = profile;
    } else {
      user.profiles.push(profile);
    }
    //console.log(user)
    await user.save();
    return Profile.findById(profile.id).populate({
      path: "user",
      populate: { path: "profile" },
    });
  },
  /**
   *************************Contact ******************************************
   */
  createContact: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("Plz, login to proceed ...!");
    if (
      !args.type ||
      !args.contactNo ||
      !args.conditionEmail1 ||
      !args.conditionEmail2
    ) {
      throw new Error("Plz, Provider all require fields...!");
    }
    const contact = await ContactModel.create({
      ...args,
      user: userId,
    });
    //console.log('Contact', contact)
    const user = await UserModel.findById(userId);
    if (!user.contacts) {
      user.contact = contact;
    } else {
      user.contacts.push(contact);
    }
    //console.log("user data:", user)
    await user.save();
    return ContactModel.findById(contact.id).populate({
      path: "user",
      populate: { path: "contacts" },
    });
  },
  /**
   * ******************** User Current Address *********************************
   */
  createCurrentAddress: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("Plz, login to proceed...!");
    if (
      !args.address1 ||
      !args.address2 ||
      !args.village ||
      !args.city ||
      !args.province
    ) {
      //throw new Error("Plz, Provide all required fields");
    }
    const currentAddress = await CurrentAddressModle.create({
      ...args,
      user: userId,
    });
    //console.log("Current Address", currentAddress);
    const user = await UserModel.findById(userId);
    if (!user.currentAddress) {
      user.currentAddress = currentAddress;
    } else {
      user.currentAddress.push(currentAddress);
    }
    await user.save();
    return CurrentAddressModle.findById(currentAddress.id).populate({
      path: "user",
      populate: { path: "currentAddress" },
    });
  },
  /**
   * ******************** User Hometown Address *********************************
   */
  createHometownAddress: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("Plz, login to proceed...!");
    if (
      !args.address1 ||
      !args.address2 ||
      !args.village ||
      !args.city ||
      !args.province
    ) {
      //throw new Error("Plz, Provide all required fields");
    }
    const hometownAddress = await HometownModel.create({
      ...args,
      user: userId,
    });
    //console.log("Hometown Address", hometownAddress);
    const user = await UserModel.findById(userId);

    if (!user.hometownAddress) {
      user.hometownAddress = hometownAddress;
    } else {
      user.hometownAddress.push(hometownAddress);
    }
    await user.save();
    return HometownModel.findById(hometownAddress.id).populate({
      path: "user",
      populate: { path: "currentAddress" },
    });
  },

  /**
   * ******************** User Product  Brands *********************************
   */
  createUserBrand: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("Plz, login to proceed...!");
    if (!args.name || !args.desc || !args.logo) {
      throw new Error("Plz, Provider  requirement fields...!");
    }
    const brand = await BrandModel.create({ ...args, user: userId });
    //console.log("brand:", brand);
    const user = await UserModel.findById(userId);
    if (!user.brands) {
      user.brand = [brand];
    } else {
      user.brands.push(brand);
    }
    //console.log("user data:", user)
    await user.save();
    return BrandModel.findById(brand.id).populate({
      path: "user",
      populate: { path: "brands" },
    });
  },

  /**
   * ******************** User  Product  Categories *********************************
   */
  createUserCategory: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("Plz, login to proceed...!");
    if (!args.name || !args.desc || !args.imageUrl) {
      throw new Error("Plz, Provider all required fields...!");
    }

    const category = await CategoryModel.create({
      ...args,
      user: userId,
    });
    //console.log("Category", category);
    const user = await UserModel.findById(userId);
    if (!user.categories) {
      user.category = [category];
    } else {
      user.categories.push(category);
    }
    await user.save();
    return CategoryModel.findById(category.id).populate({
      path: "user",
      populate: { path: "categories" },
    });
  },
  /**
   * ******************** User  Payment Methods || Bank Account provider *********************************
   */
  createBankAccount: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("Plz, login to proceed...!");
    if (
      !args.bankName ||
      !args.accountName ||
      !args.accountNo ||
      !args.qrcodeUrl
    ) {
      throw new Error("Plz, provider all required fields...!");
    }
    const bankAccount = await BankModel.create({
      ...args,
      user: userId,
    });
    // console.log("Bank:", bankAccount);
    const user = await UserModel.findById(userId);
    if (!user.bankAccounts) {
      user.bankAccount = bankAccount;
    } else {
      user.bankAccounts.push(bankAccount);
    }
    await user.save();
    return BankModel.findById(bankAccount.id).populate({
      path: "user",
      populate: { path: "bankAccounts" },
    });
  },

  /**
   * ****************************Cart Items***********************************
   */
  addToCart: async (parent, args, { userId }, info) => {
    //id ---> ProductId
    const { id } = args;
    //Find User Who preformed added To cart-- Full logical is userId from login
    if (!userId) throw new Error("Plz, Login to process");
    try {
      //Check if the new addToCart items is already user.carts
      const user = await UserModel.findById(userId).populate({
        path: "carts",
        populate: { path: "product" },
      });

      const findCartItemIndex = user.carts.findIndex(
        (cartItem) => cartItem.product.id === id
      );

      if (findCartItemIndex > -1) {
        //A. the new addToCart item is already Exist is Carts
        //A.1 Find the itemCart from databade /Update
        const CartList = (user.carts[findCartItemIndex].quantity += 1);
        await Cart.findByIdAndUpdate(user.carts[findCartItemIndex].id, {
          quantity: CartList,
        }); //Get From Cart Item ID from index

        //A.2 Find Updated cartItem
        const updateCartItem = await Cart.findById(
          user.carts[findCartItemIndex].id
        )
          .populate({ path: "product" })
          .populate({ path: "user" });

        return updateCartItem;
      } else {
        //B. the new addToCart is not in Cart yet
        const cartItem = await Cart.create({
          product: id,
          quantity: 1,
          user: userId,
        });
        //B.1 Create new cart
        const newCartItem = await Cart.findById(cartItem.id)
          .populate({ path: "product" })
          .populate({ path: "user" });
        //B.2 Update user.cart
        await UserModel.findByIdAndUpdate(userId, {
          carts: [...user.carts, newCartItem],
        });
        return newCartItem;
      }
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * **************************** Delete Cart *****************************************
   */
  deleteCart: async (parent, args, { userId }, info) => {
    const { id } = args;
    //Check ID to match Cart.id
    const cart = await Cart.findById(id);
    //Check if user logged in
    if (!userId) throw new Error("Plz, Login to Process...!");

    const user = await UserModel.findById(userId);

    //Check Ownership CartItem
    if (cart.user.toString() !== userId) {
      throw new Error("you are not authorized...!");
    }

    //Delete Cart item
    const deletedCart = await Cart.findByIdAndRemove(id);

    const updatedUserCart = user.carts.filter(
      (cartId) => cartId.toString() !== deletedCart.id.toString()
    );

    await UserModel.findByIdAndUpdate(userId, {
      carts: updatedUserCart,
    });

    return deletedCart;
  },

  /**
   * **************************Website banner *****************************************
   */

  createBanner: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("Plz, login to proceed...!");
    if (!args.name || !args.title || !args.description || !args.imageUrl) {
      throw new Error("Plz, Provider all required fields...!");
    }

    const banner = await BannerModel.create({ ...args, user: userId });
    // console.log("Banner: ", banner)
    const user = await UserModel.findById(userId);
    if (!user.banners) {
      user.banner = [banner];
    } else {
      user.banners.push(banner);
    }
    await user.save();
    return BannerModel.findById(banner.id).populate({
      path: "user",
      populate: { path: "banners" },
    });
  },

  /**
   * *******************Create User Order *********************************************
   */
  createOrder: async (parent, { amount, cardId, token }, { userId }, info) => {
    //Check User already login
    if (!userId) throw new Error("Plz, login to proceed...!");

    //Query User from data
    const user = await UserModel.findById(userId).populate({
      path: "carts",
      populate: { path: "product" },
    });

    //create charge with Omise; -->user.cards[0] && user.cards[0].id
    let customer;
    //User use the existing card
    if (cardId && !token) {
      const cust = await retrieveOmiseCustomer(cardId);
      if (!cust) throw new Error("Cannot Processed payments");

      customer = cust;
    }
    //Create  Orders with new credits card
    if (token && !cardId) {
      const newCustomer = await createOmiseCustomer(
        user.email,
        user.name,
        token
      );
      if (!newCustomer) throw new Error("Cannot Process payments");
      customer = newCustomer;

      //Update user cards's fields
      const {
        id,
        expiration_month,
        expiration_year,
        brand,
        last_digits,
      } = newCustomer.cards.data[0];

      const newCard = {
        id: newCustomer.id,
        cardInfo: {
          id,
          expiration_month,
          expiration_year,
          brand,
          last_digits,
        },
      };
      await UserModel.findByIdAndUpdate(userId, {
        cards: [newCard, ...user.cards],
      });
    }

    //create Charge
    const charge = await createOmiseCharge(amount, customer.id);
    if (!charge)
      throw new Error(
        "Something went wrong with payment, Plz try again later...!"
      );

    //Convert CartItem to OrderItem;
    const convertCartToOrder = async () => {
      return Promise.all(
        user.carts.map((cart) =>
          OrderItem.create({
            product: cart.product,
            qualtity: cart.qualtity,
            user: cart.user,
          })
        )
      );
    };

    //Create Order;
    const orderItems = await convertCartToOrder();
    const order = await Order.create({
      user: userId,
      items: orderItems.map((orderItem) => orderItem.id),
    });

    //Delete cartItem from the database;
    const deleteCartItem = async () => {
      return Promise.all(
        user.carts.map((cart) => Cart.findByIdAndRemove(cart.id))
      );
    };
    await deleteCartItem();

    //Update User info in the database (Del  Item  from Cart then Add to Order);
    await UserModel.findByIdAndUpdate(userId, {
      carts: [],
      orders: !user.orders ? [order.id] : [...user.orders, order.id],
    });

    //Return Order
    return Order.findById(order.id)
      .populate({ path: "user" })
      .populate({ path: "items", populate: { path: "product" } });
  },

  createCheckout: async (parent, args, { userId }, info) => {
    //Check User already login
    if (!userId) throw new Error("Plz, login to proceed...!");
    
    //Create Checkout information
    if (
      !args.fullname ||
      !args.address ||
      !args.city ||
      !args.province ||
      !args.country ||
      !args.contact ||
      !args.postcode
    ) {
      throw new Error("Plz, Provider  requirement fields...!");
    }
    const checkout = await CheckoutModel.create({
      ...args,
      user: userId,
    });

    //Query User from data
    const user = await UserModel.findById(userId);
    
    if(!user.checkout){
      user.checkout = checkout;
    }else{
      user.checkouts.push(checkout);
    }

    await user.save();

    return await CheckoutModel.findById(checkout.id).populate({path: "user", populate: { path: "checkout" }})
  },

  //Customer Check
  custOrder: async (parent, args, { userId }, info) => {
    
    const { amount, checkoutId } = args;


    //Check User already login
    if (!userId) throw new Error("Plz, login to proceed...!");

    //Query User from data
    const user = await User.findById(userId).populate({
      path: "carts",
      populate: { path: "product" },
    });

    if (!user) throw new Error("Plz, Login to proceed...!");

    //Find Checkout Id to proceed create customer Order NEXT
    const checkout = await CheckoutModel.findById(checkoutId);

    console.log("Checkout", checkout._id);

    if (!checkout._id)
      throw new Error("Plz, fill checkout information required...");

    //Create bank charge

    //Convert CartItem to OrderItem;
    const convertCartToOrder = async () => {
      return Promise.all(
        user.carts.map((cart) =>
          OrderItem.create({
            product: cart.product,
            quantity: cart.quantity,
            user: cart.user,
          })
        )
      );
    };

    //Create Order to database
    const orderitemArr = await convertCartToOrder();

    const order = await Order.create({
      user: userId,
      items: orderitemArr.map((orderItem) => orderItem.id),
      checkout: checkoutId,
      amount: amount
    });

    //Delete Cart Items from the database
    const deleteCartItem = async () => {
      return Promise.all(
        user.carts.map((cart) => Cart.findByIdAndRemove(cart.id))
      );
    };

    await deleteCartItem();

    //Update User order in database
    await User.findByIdAndUpdate(userId, {
      checkout: checkoutId,
      carts: [],
      orders: !user.orders ? [order.id] : [...user.orders, order.id],
    });

    //return order
    return await Order.findById(order.id)
      .populate({ path: 'user' })
      .populate({ path: 'items', populate: { path: 'product' }});
  },
};

export default Mutation;
