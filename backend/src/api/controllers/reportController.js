import Report from '../models/Report.js';
import { validateReport } from '../utils/validate.js';
import { calculateDistance } from '../utils/location.js';

export const createReport = async (req, res) => {
    try {
        const { error } = validateReport(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const report = new Report({
            ...req.body,
            userId: req.user.id
        });

        await report.save();
        res.status(201).json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};

export const getReports = async (req, res) => {
    try {
        const { lat, lon, radius, type, status, sort = '-createdAt' } = req.query;
        
        let query = {};
        
        // Filter by type
        if (type) {
            query.type = type;
        }
        
        // Filter by status
        if (status) {
            query.status = status;
        }

        // Filter by location if coordinates and radius provided
        if (lat && lon && radius) {
            const coords = [parseFloat(lon), parseFloat(lat)];
            query['location.coords'] = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: coords
                    },
                    $maxDistance: parseInt(radius) * 1000 // Convert km to meters
                }
            };
        }

        const reports = await Report.find(query)
            .sort(sort)
            .populate('userId', 'name phone')
            .populate('assignedTeam', 'name phone');

        res.json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};

export const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assignedTeam } = req.body;

        const report = await Report.findById(id);
        if (!report) return res.status(404).json({ error: 'Không tìm thấy báo cáo' });

        // Only admin or rescue team can update status
        if (req.user.role !== 'admin' && req.user.role !== 'rescue') {
            return res.status(403).json({ error: 'Không có quyền thực hiện' });
        }

        if (status) report.status = status;
        if (assignedTeam) report.assignedTeam = assignedTeam;

        await report.save();
        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};

export const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        
        const report = await Report.findById(id);
        if (!report) return res.status(404).json({ error: 'Không tìm thấy báo cáo' });

        // Only admin or report creator can delete
        if (req.user.role !== 'admin' && report.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Không có quyền thực hiện' });
        }

        await report.remove();
        res.json({ message: 'Đã xóa báo cáo thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};