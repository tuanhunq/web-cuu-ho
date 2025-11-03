import Team from '../models/Team.js';
import { validateTeam } from '../utils/validate.js';

export const createTeam = async (req, res) => {
    try {
        // Only admin can create teams
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện' });
        }

        const { error } = validateTeam(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const team = new Team(req.body);
        await team.save();
        
        res.status(201).json(team);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};

export const getTeams = async (req, res) => {
    try {
        const { available, type } = req.query;
        
        let query = {};
        
        if (available === 'true') {
            query.available = true;
        }
        
        if (type) {
            query.specialties = type;
        }

        const teams = await Team.find(query)
            .populate('members', 'name phone')
            .sort('name');

        res.json(teams);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};

export const updateTeamStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { available, location } = req.body;

        // Only admin or team member can update
        const team = await Team.findById(id);
        if (!team) return res.status(404).json({ error: 'Không tìm thấy đội cứu hộ' });

        if (req.user.role !== 'admin' && !team.members.includes(req.user.id)) {
            return res.status(403).json({ error: 'Không có quyền thực hiện' });
        }

        if (typeof available === 'boolean') team.available = available;
        if (location) team.location = location;

        await team.save();
        res.json(team);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};

export const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;

        // Only admin can delete teams
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Không có quyền thực hiện' });
        }

        const team = await Team.findById(id);
        if (!team) return res.status(404).json({ error: 'Không tìm thấy đội cứu hộ' });

        await team.remove();
        res.json({ message: 'Đã xóa đội cứu hộ thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};