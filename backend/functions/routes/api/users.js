const router = require("express").Router();

const userController = require("../../controllers/userController");

router.get("/", userController.userTestProductServer);
router.get("/count", userController.getUserCountServer);
router.get("/list", userController.getUserListServer);
router.get("/:userId", userController.getUserByIdServer);
router.get("/get/email", userController.getUserByEmailServer);
router.get("/role/:userId", userController.getUserRoleServer);

router.post("/setAdminRole/:userId", userController.setAdminRoleServer);
router.post("/setUserRole/:userId", userController.setUserRoleServer);

router.delete("/:userId", userController.deleteUserByIdServer);

router.post("/auth/loginUser", userController.loginUserServer);
router.post("/auth/registerUser", userController.registerUserServer);
router.post("/auth/signOut", userController.logOutUserServer);

module.exports = router;
