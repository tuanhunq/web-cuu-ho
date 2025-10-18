// server/controllers/userController.js
import User from "../models/User.js";
import { generateToken } from "../utils/auth.js";

export async function register(req, res) {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email đã được sử dụng" });
    const user = new User({ name, email, password, phone });
    await user.save();
    const token = generateToken(user);
    res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Mật khẩu không đúng" });
    const token = generateToken(user);
    res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
}

export async function profile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
}
