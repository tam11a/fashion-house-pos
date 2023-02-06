const axios = require("axios");
const ErrorResponse = require("../utils/errorResponse");

exports.sendSMS = async (to, msg, throwError) => {
  //
  // api_key -> process.env.SMS_TOKEN
  // msg -> msg
  // to -> to

  const res = await axios.get(
    `https://api.sms.net.bd/sendsms?api_key=${process.env.SMS_TOKEN}&msg=${msg}&to=${to}`
  );
  if (throwError && res.data.error === 416)
    throw new ErrorResponse(res.data.msg);
};
