const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        doctor: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        date: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
);

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;
