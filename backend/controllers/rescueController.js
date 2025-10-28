import Report from "../models/Report.js";

export async function createReport(req, res) {
  try {
    const { type, phone, location, description } = req.body;
    const report = new Report({
      userId: req.user?.id || null,
      type, phone, location, description
    });
    await report.save();
    res.json({ message: "Yêu cầu đã được gửi", report });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
}

export async function listReports(req, res) {
  try {
    const { status, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) filter.description = { $regex: q, $options: "i" };
    const reports = await Report.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
}

export async function updateReportStatus(req, res) {
  try {
    const id = req.params.id;
    const { status, assignedTeam } = req.body;
    const r = await Report.findByIdAndUpdate(id, { status, assignedTeam }, { new: true });
    res.json({ report: r });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
}