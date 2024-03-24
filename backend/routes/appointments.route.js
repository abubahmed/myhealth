const router = require("express").Router();
let Appointment = require("../models/appointment.model");
let User = require("../models/user.model");

router.route("/get").post(async (req, res) => {
    let responseSent = false;
    const username = req.body.username;

    try {
        const appointments = await Appointment.find({ username: username });
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

router.route("/add").post(async (req, res) => {
    let responseSent = false;
    const doctor = req.body.doctor;
    const description = req.body.description;
    const date = req.body.date;
    const username = req.body.username;

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
