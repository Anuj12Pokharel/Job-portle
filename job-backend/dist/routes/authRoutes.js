<<<<<<< HEAD
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const googleAuthController_1 = require("../controller/googleAuthController");
const router = (0, express_1.Router)();
router.post("/register", authController_1.registerUser);
router.post("/login", authController_1.loginUser);
router.post("/login-otp/send", authController_1.sendLoginOtp);
router.post("/login-otp/verify", authController_1.verifyLoginOtp);
router.post("/forgot-password", authController_1.forgotPassword);
router.post("/reset-password", authController_1.resetPassword);
router.post("/google", googleAuthController_1.googleSignIn);
exports.default = router;
=======
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const googleAuthController_1 = require("../controller/googleAuthController");
const router = (0, express_1.Router)();
router.post("/register", authController_1.registerUser);
router.post("/login", authController_1.loginUser);
router.post("/login-otp/send", authController_1.sendLoginOtp);
router.post("/login-otp/verify", authController_1.verifyLoginOtp);
router.post("/forgot-password", authController_1.forgotPassword);
router.post("/reset-password", authController_1.resetPassword);
router.post("/google", googleAuthController_1.googleSignIn);
exports.default = router;
>>>>>>> origin/updated-feature
