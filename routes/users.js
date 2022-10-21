const router = require("express").Router();

const {
  getUsers,
  createUser,
  getUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/:userId", getUser); /* возвращает пользователя по _id */
router.post("/users", createUser);
router.patch("/users/me", updateProfile);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;