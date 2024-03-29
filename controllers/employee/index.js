const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");
const ErrorResponse = require("../../utils/errorResponse");

exports.register = async (req, res, next) => {
  // Get Values
  const {
    userName,
    firstName,
    lastName,
    gender,
    phone,
    email,
    password,
    role,
  } = req.body;

  try {
    // Store Admin to DB
    const user = await Admin.create({
      userName,
      firstName,
      lastName,
      gender,
      phone,
      email,
      password,
      role,
      ...req.createdBy,
    });

    // Send Success Response
    res.status(201).json({
      success: true,
      message: `${user.firstName} ${user.lastName} is registered as an employee successfully`,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  const { gender, isVerified, isActive } = req.query;
  try {
    res.status(200).json({
      success: true,
      message: "Employee list fetched successfully",
      ...(await Admin.paginate(
        {
          ...(req.search && {
            $or: [
              ...queryObjectBuilder(
                req.search,
                ["userName", "firstName", "lastName", "phone", "email"],
                true
              ),
            ],
          }),
          ...fieldsQuery({
            isVerified,
            isActive,
            gender,
          }),
        },
        {
          ...req.pagination,
          populate: [
            {
              path: "role",
              select: "name -createdBy -updatedBy",
            },
            {
              path: "createdBy",
              select: "firstName lastName fullName userName",
            },
            {
              path: "updatedBy",
              select: "firstName lastName fullName userName",
            },
          ],
          select:
            "userName firstName lastName phone email gender dob hireDate workHour salary bank bKash role isActive isVerified createdAt updatedAt deletedAt createdBy updatedBy deletedBy",
          sort: req.pagination.sort || "-updatedAt -createdAt",
          customLabels: {
            docs: "data",
            totalDocs: "total",
          },
        }
      )),
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.byID = async (req, res, next) => {
  // Get Values
  const { employee_id } = req.params;

  // mongoose.Types.ObjectId.isValid(id)
  if (!employee_id || !mongoose.Types.ObjectId.isValid(employee_id))
    return next(new ErrorResponse("Please provide valid employee id", 400));

  try {
    const user = await Admin.findById(employee_id)
      .select(
        "userName firstName lastName phone email gender dob hireDate workHour salary bank bKash role isActive isVerified createdAt updatedAt deletedAt createdBy updatedBy deletedBy"
      )
      .populate([
        {
          path: "role",
          select: "name -createdBy -updatedBy",
        },
        {
          path: "createdBy",
          select: "firstName lastName fullName userName",
        },
        {
          path: "updatedBy",
          select: "firstName lastName fullName userName",
        },
      ]);

    if (!user) return next(new ErrorResponse("No employee found", 404));

    res.status(200).json({
      success: true,
      data: user,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.resetpassword = async (req, res, next) => {
  const { uid, password } = req.body;

  try {
    const user = await Admin.findById(uid).select("+verificationKey");

    if (!user) return next(new ErrorResponse("No user found", 404));

    await user.updatePassword(password);

    res.status(200).json({
      success: true,
      message: "Reseted password sucessfully",
    });
  } catch (error) {
    // Send Error Response
    next(error);
  }
};
exports.activeInactive = async (req, res, next) => {
  // Get Values
  const { employee_id } = req.params;

  if (!employee_id || !mongoose.Types.ObjectId.isValid(employee_id))
    return next(new ErrorResponse("Please provide valid employee id", 400));

  try {
    // Update User to DB
    const user = await Admin.findById(employee_id);

    if (!user) return next(new ErrorResponse("No employee found", 404));

    await user.updateOne({
      isActive: !user.isActive,
      ...req.updatedBy,
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: `Employee ${
        user.isActive ? "deactivated" : "activated"
      } successfully`,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.update = async (req, res, next) => {
  // Get Values
  const { employee_id } = req.params;

  if (!employee_id || !mongoose.Types.ObjectId.isValid(employee_id))
    return next(new ErrorResponse("Please provide valid employee id", 400));

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
    role,
  } = req.body;

  try {
    // Update employee to DB
    const employee = await Admin.findByIdAndUpdate(employee_id, {
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
      role,
      ...req.updatedBy,
    });

    if (employee)
      res.status(200).json({
        success: true,
        message: "Employee informations updated successfully",
        // data: employee,
      });
    else return next(new ErrorResponse("Employee not found", 404));

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};
