const router = require("express").Router();
let Appointment = require("../models/appointment.model");
let User = require("../models/user.model");
const verifyToken = require("../util/verifyToken");

router.route("/get").post(verifyToken, async (req, res) => {
    let responseSent = false;
    const username = req.user?.username;

    try {
        const appointments = await Appointment.find({ username });
        if (!responseSent) {
            responseSent = true;
            return res.status(200).json({
                success: true,
                message: "Appointments successfully retrieved",
                data: appointments,
            });
        }
    } catch (error) {
        if (!responseSent) {
            responseSent = true;
            return res.status(400).json({
                success: false,
                message: "Error: " + error,
                data: null,
            });
        }
    }
});

router.route("/add").post(verifyToken, async (req, res) => {
    let responseSent = false;
    const { doctor, description, date } = req.body;
    const username = req.user?.username;

    try {
        const doctorUser = await User.findOne({ username: doctor });
        if (!doctorUser) {
            if (!responseSent) {
                responseSent = true;
                return res.status(200).json({
                    success: true,
                    message: "Failed to find doctor",
                });
            }
        }
        const newAppointment = new Appointment({ username, doctor, description, date });
        await newAppointment.save();
        if (!responseSent) {
            responseSent = true;
            return res.status(200).json({
                success: true,
                message: "Appointment successfully created",
            });
        }
    } catch (error) {
        console.log(error);
        if (!responseSent) {
            responseSent = true;
            return res.status(400).json({
                success: false,
                message: "Error: " + error,
            });
        }
    }
});

module.exports = router;
