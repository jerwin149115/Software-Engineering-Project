const Team = require('../models/TeamModel')
const jwt = require('jsonwebtoken');
const ReportLogs = require('../models/reportLogs')

const register = async(req, res) => {
    const { username, password } = req.body;
    const roles = 'staff'
    try {
        const team = new Team({ username, password, roles });
        await team.save();
        res.status(201).json({ message: 'Team successfully registered'});
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error);
    }
};


const login = async(req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Team.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        user.status = 'online';
        await user.save();

        const token = jwt.sign(
            { id: user._id, username: user.username },
            'wow',
        );

        const newLog = new ReportLogs({
            eventType: 'login',
            teamId: user._id, 
            username: user.username,
            timestamp: Date.now(),
            remarks: 'Successfully logged In',
        });

        await newLog.save();
        res.json({ token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const logout = async (req, res) => {
    const teamId = req.user?.teamId;

    if (!teamId) {
        return res.status(400).json({ message: 'User not authenticated or teamId missing' });
    }

    const status = 'offline';

    try {
        const logout = await Team.findByIdAndUpdate(teamId, { status }, { new: true });
        const newLog = new ReportLogs({
            eventType: 'logout',
            teamId: req.user.teamId,
            username: req.user.username,
            timestamp: Date.now(),
            remarks: 'Successfully logged out', 
        });

        await newLog.save();

        res.status(200).json(logout);
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: error.message });
    }
};


const updateTeam = async(req, res) => {
    const { id } = req.params;
    const { username, password, roles } = req.body;
    try {
        const updateTeam = await Team.findByIdAndUpdate( id, { username, password, roles }, { new: true})
        res.status(200).json(updateTeam);
    } catch {
        res.status(500).json({ message: error.message })
    }
}

const deleteTeam = async(req, res) => {
    const { id } = req.params;
    try {
        await Team.findByIdAndDelete(id);
        res.status(200).json({ message: 'Team deleted'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const fetchNames = async(req, res) => {
    const { username } = req.query;

    try {
        const team = username ? await Team.find({ username: { $regex: username, $options: 'i'} }) : await Team.find();
        res.status(200).json(team);
    } catch (error) { 
        res.status(500).json({ message: error.message });
    }
}

module.exports = { register, login, fetchNames, updateTeam, deleteTeam, logout }