const Product = require("../models/Product");

const customAlphabet = (alphabet, defaultSize = 21) => {
	return (size = defaultSize) => {
		let id = "";
		let i = size;
		while (i--) {
			id += alphabet[(Math.random() * alphabet.length) | 0];
		}
		return id;
	};
};

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
