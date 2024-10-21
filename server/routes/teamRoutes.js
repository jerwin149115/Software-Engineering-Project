const express = require('express');
const { register, login, fetchNames, updateTeam, deleteTeam, logout } = require('../controllers/TeamController');
const auth = require('../middleware/teamJWTMiddleware')
const router = express.Router();

router.post('/teamLogin', login);
router.post('/teamRegister', register);
router.get('/fetchNames', fetchNames)
router.put('/updateTeam/:id', updateTeam)
router.put('/teamLogout', auth, logout)
router.delete('/deleteTeam/:id', deleteTeam)

module.exports = router;