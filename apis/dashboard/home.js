import db from "../../models/index.js";

export const getUser = async (req, res) => {

    try {
        const user = await db.user.findByPk(req.user?.id);
        const { name, email } = user;

        if (user === null) {
            return res.status(400).json({ success: false, message: "User Not Authorised" });
        } else {
            return res.status(201).json({ success: true, message: `Welcome to Dashboard ${user.name}`, userData: { name, email } });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}