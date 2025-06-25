if(process.env.NODE_ENV != "production"){ // this will check if the environment is not production, then it will load the .env file production is when we have deployed the application and we don't want to expose our environment variables to everyone so we dont use them in production phase
    require('dotenv').config() // this will load the environment variables from the .env file into process.env
}
const axios = require("axios");

const sendEmailOTP = async (email, otp) => {
    const data = {
        sender: { email: process.env.BREVO_SENDER_EMAIL },
        to: [{ email }],
        subject: "Your OTP Code",
        textContent: `Your OTP is: ${otp}`
    };

    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            data,
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        );
        console.log("OTP email sent successfully:", response.data);
    } catch (error) {
        console.error("Error sending OTP email:", error.response?.data || error.message);
    }
};
module.exports = { sendEmailOTP };