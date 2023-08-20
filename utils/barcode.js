const { customAlphabet } = import("nanoid");
const Product = require("../models/Product");

const alphabet =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
const barcodeLength = 8;
const uid = customAlphabet(alphabet, barcodeLength);

async function check(barcode) {
	const product = await Product.findOne({ barcode });
	return product ? true : false;
}

exports.generate = async function () {
	const barcode = uid();

	while (await check(barcode)) {
		barcode = uid();
	}
	return barcode;
};
