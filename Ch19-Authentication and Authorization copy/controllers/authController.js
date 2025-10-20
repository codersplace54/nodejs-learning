const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

    exports.getLogin = (req, res, next) => {
        res.render("auth/login", {
            pageTitle: "Login",
            currentPage: "login",
            isLoggedIn: false,
            user : {}
        });
    }

    exports.getSignup =
        (req, res, next) => {
            res.render("auth/signup", {
                pageTitle: "Signup",
                currentPage: "signup",
                isLoggedIn: false,
                errors: [],
                user : {},
                oldInput: {
                    firstName: "",
                    lastName: "",
                    email: "",
                    userType: "guest",
                    terms: false
                }
            });
        }

    exports.postSignup = [
        check("firstName")
            .trim()
            .isLength({ min: 2 }).withMessage("First name must be at least 2 characters long.")
            .matches(/^[A-Za-z]+$/).withMessage("First name must contain only letters."),

        check("lastName")
            .trim()
            .isLength({ min: 2 }).withMessage("Last name must be at least 2 characters long.")
            .matches(/^[A-Za-z]+$/).withMessage("Last name must contain only letters."),

        check("email")
            .isEmail().withMessage("Please enter a valid email address.")
            .normalizeEmail()
            .bail()
            .custom(async (value) => {
                const exists = await User.findOne({ email: value });
                if (exists) throw new Error("Email already in use.");
                return true;
            }),

        check("password")
            .isLength({ min: 5 }).withMessage("Password must be at least 5 characters long.")
            .matches(/\d/).withMessage("Password must contain at least one number."),

        check("confirmPassword")
            .custom((value, { req }) => {
                if (value !== req.body.password) throw new Error("Passwords do not match.");
                return true;
            }),

        check("userType")
            .trim()
            .isIn(["guest", "host"]).withMessage("User type must be either 'guest' or 'host'."),

        check("terms").equals("on").withMessage("You must accept the terms and conditions."),

        // Handler
        async (req, res) => {
            const { firstName, lastName, email, password, userType } = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).render("auth/signup", {
                    pageTitle: "Signup",
                    currentPage: "signup",
                    isLoggedIn: false,
                    errors: errors.array(),
                    user : {},
                    oldInput: {
                        firstName,
                        lastName,
                        email,
                        userType,
                        terms: !!req.body.terms
                    }
                });
            }

            try {
                const hashed = await bcrypt.hash(password, 12);
                const user = new User({
                    firstName,
                    lastName,
                    email,
                    password: hashed,   
                    userType
                });
                await user.save();
                return res.redirect("/login");
            } catch (err) {
                console.error(err);
                return res.status(500).render("auth/signup", {
                    pageTitle: "Signup",
                    currentPage: "signup",
                    isLoggedIn: false,
                    errors: [{ msg: "Something went wrong. Please try again." }],
                    oldInput: {
                        firstName,
                        lastName,
                        email,
                        userType,
                        terms: !!req.body.terms
                    },
                    user : {}
                });
            }
        }
    ];

    exports.postLogin = async (req, res, next) => {
        console.log(req.body);
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(422).render("auth/login",{
                "pageTitle" : "Login",
                "currentPage" : "login",
                "isLoggedIn" : false,
                "errors" : ["User does't exist"],
                "oldInput" : {email},
                user : {}
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(422).render("auth/login",{
                "pageTitle" : "Login",
                "currentPage" : "login",
                "isLoggedIn" : false,
                "errors" : ["Invalid password"],
                "oldInput" : {email},
                user : {}
            })
        }

        req.session.isLoggedIn = true;
        req.session.user = user;
        res.redirect("/");
    }

    exports.postLogout = (req, res, next) => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    }