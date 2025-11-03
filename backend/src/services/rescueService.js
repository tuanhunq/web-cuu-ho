import Report from '../models/Report.js';

export class RescueService {
    static async createReport(reportData, userId = null) {
        const report = new Report({
            userId,
            ...reportData
        });
        return await report.save();
    }

    static async listReports(filters = {}) {
        const query = {};
        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.q) {
            query.$or = [
                { type: new RegExp(filters.q, 'i') },
                { description: new RegExp(filters.q, 'i') }
            ];
        }
        return await Report.find(query).sort({ createdAt: -1 });
    }

    static async updateReportStatus(reportId, status) {
        const report = await Report.findById(reportId);
        if (!report) {
            throw new Error('Report not found');
        }
        report.status = status;
        return await report.save();
    }
}