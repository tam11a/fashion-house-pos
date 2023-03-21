const base32 = require("base32");
const Admin = require("../../models/Admin");
const ErrorResponse = require("../../utils/errorResponse");
const Role = require("../../models/Role");

exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password)
		return next(ErrorResponse("Please provide email and password", 400));

	try {
		const user = await Admin.findOne({
			email,
		}).select("+password");

		// Send Error if No User Found
		if (!user) return next(new ErrorResponse("No user found", 401));
		// Send Error if User is not verified
		if (!user.isVerified)
			return next(new ErrorResponse("User is not verified", 401));
		// Send Error if User is inactive
		if (!user.isActive)
			return next(new ErrorResponse("User is not active", 401));

		// Check if the password is corrent
		const isMatch = await user.matchPasswords(password);
		if (!isMatch) return next(new ErrorResponse("Incorrect password", 401));

		// Send Success Response
		sendToken(user, 200, res);
		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

const sendToken = (user, statusCode, res) => {
	res.status(statusCode).json({
		success: true,
		token: user.getSignedToken(), // generates token
		message: `Welcome ${user.fullName}!`,
	});
};

exports.validate = async (req, res, next) => {
	if (req.user) {
		const role = await Role.findById(req.user._doc.role).populate([
			{
				path: "permissions",
				select: "keyword -createdBy -updatedBy",
			},
		]);
		res.json({
			success: true,
			data: {
				...req.user._doc,
				role: role
					? {
							_id: role._id,
							name: role.name,
					  }
					: null,
				permissions: role?.permissions?.flatMap?.((r) => r.keyword) || [],
			},
		});
	} else {
		next(ErrorResponse("No user found!", 404));
	}
};

exports.updateProfile = async (req, res, next) => {
	if (req.user) {
		// Get Values
		const {
			userName,
			firstName,
			lastName,
			gender,
			phone,
			email,
			address,
			dob,
			hireDate,
			workTime,
			salary,
			bank,
			bKash,
		} = req.body;
		try {
			await Admin.findByIdAndUpdate(req.user._id, {
				userName,
				firstName,
				lastName,
				gender,
				phone,
				email,
				address,
				dob,
				hireDate,
				workTime,
				salary,
				bank,
				bKash,
				...req.updatedBy,
			});
			res.status(201).json({
				success: true,
				message: "Informations updated sucessfully",
			});
			// On Error
		} catch (error) {
			// Send Error Response
			next(error);
		}
	} else {
		next(ErrorResponse("No user found!", 404));
	}
};

exports.forgetpassword = async (req, res, next) => {
	const { email } = req.body;
	try {
		const user = await Admin.findOne({
			email,
			isVerified: true,
			isActive: true,
		}).select("+verificationKey");
		if (user) await sendOTP(user, 200, res);
		else
			next(
				new ErrorResponse(
					"Account not found. This maybe unavailable, suspended or not verified yet.",
					401
				)
			);
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

const sendOTP = async (user, statusCode, res, message) => {
	res.status(statusCode).json({
		success: true,
		token: await user.getBase32ID(), // otp._id,
		otp: await user.getTOTP(),
		message: message || `OTP sent to ${user.email}`,
	});
};

exports.resetpassword = async (req, res, next) => {
	const { token, otp, password } = req.body;

	const uid = base32.decode(token);

	try {
		const user = await Admin.findById(uid).select("+verificationKey");

		if (!user) return next(new ErrorResponse("No user found", 404));

		if (!(await user.verifyTOTP(otp)))
			next(new ErrorResponse("Invalid OTP", 401));

		await user.updatePassword(password);

		res.status(204).json({
			success: true,
			message: "Reseted password sucessfully",
		});
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

