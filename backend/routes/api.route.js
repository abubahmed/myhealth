const router = require("express").Router();
const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});
const verifyToken = require("../util/verifyToken");
require("dotenv").config();

router.route("/evaluate").post(verifyToken, async (req, res) => {
    let responseSent = false;
    const { prompt } = req.body;
    const message =
        "Read the following symptoms and provide me with several possible illnesses/conditions that could be the cause behind this. Briefly explain what the illness/condition is. If the symptoms are unlikely to be indicative of any illness, let me know. The symptoms are as follows: " +
        prompt.join(", ");

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "gpt-3.5-turbo",
        });
        const response = completion.choices[0].message.content;
        if (!responseSent) {
            responseSent = true;
            return res.status(200).json({
                success: true,
                data: response,
                message: "Evaluation successfully generated",
            });
        }
    } catch (error) {
        console.log(error);
        if (!responseSent) {
            responseSent = true;
            return res.status(400).json({
                success: false,
                message: "Error: " + error,
                data: "",
            });
        }
    }
});

router.route("/hospitals").post(verifyToken, async (req, res) => {
    let responseSent = false;
    const { state, zipCode } = req.body;

    try {
        const response = await fetch(`http://www.communitybenefitinsight.org/api/get_hospitals.php?state=${state}`);
        let data = await response.json();
        let returnData = [];
        if (zipCode === "") {
            returnData = data;
        } else {
            data.forEach((hospital) => {
                if (hospital.zip_code === zipCode) {
                    returnData.push(hospital);
                }
            });
        }
        if (returnData.length > 50) {
            returnData = returnData.slice(0, 50);
        }
        if (!responseSent) {
            responseSent = true;
            return res.status(200).json({
                success: true,
                message: "Hospitals successfully retrieved",
                data: returnData,
            });
        }
    } catch (error) {
        if (!responseSent) {
            responseSent = true;
            return res.status(400).json({
                success: false,
                message: "Error: " + error,
                data: [],
            });
        }
    }
});

module.exports = router;
