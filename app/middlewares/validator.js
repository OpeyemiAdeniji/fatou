import Validator from 'validatorjs';
import { errorResponse } from '../helpers/response';
import mongoose from 'mongoose';

const registerCustomRules = () => {
	Validator.registerAsync(
		'exists',
		// eslint-disable-next-line no-unused-vars
		async (value, requirement, attribute, passes) => {
			if (!requirement) {
				return passes(false, 'exists requirements are expected.');
			}
			const requirements = requirement.split(',');
			if (requirements.length !== 2) {
				return passes(false, 'exists requirements must be exactly 2.');
			}
			const modelName = requirements[0];
			const modelField = requirements[1];
			const formattedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
			const Model = mongoose.connection.model(formattedModelName);
			const foundModel = await Model.findOne({ [modelField]: value });
			if (!foundModel) {
				return passes(false, `The ${attribute} does not exist.`);
			}
			return passes();
		}
	);
	Validator.registerAsync(
		'unique',
		// eslint-disable-next-line no-unused-vars
		async (value, requirement, attribute, passes) => {
			if (!requirement) {
				return passes(false, 'unique requirements are expected.');
			}
			const requirements = requirement.split(',');
			if (requirements.length !== 2) {
				return passes(false, 'unique requirements must be exactly 2.');
			}
			const modelName = requirements[0];
			const modelField = requirements[1];
			const formattedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
			const Model = mongoose.connection.model(formattedModelName);
			const foundModel = await Model.findOne({ [modelField]: value });
			if (foundModel) {
				return passes(false, `The ${attribute} already exists.`);
			}
			return passes();
		}
	);
	Validator.registerAsync(
		'file',
		// eslint-disable-next-line no-unused-vars
		(value, requirement, attribute, passes) => {
			if (!value.isFile) {
				return passes(false, `The ${attribute} is not a file.`);
			}
			if (value.size > process.env.MAX_FILE_UPLOAD) {
				return passes(false, `The ${attribute} file size exceeds ${process.env.MAX_FILE_UPLOAD}.`);
			}
			return passes();
		}
	);
	Validator.registerAsync('mime', (value, requirement, attribute, passes) => {
		if (!requirement) {
			return passes(false, 'mime type requirements are expected.');
		}
		if (!value.mimetype || !value.mimetype.startsWith(requirement)) {
			return passes(false, `The ${attribute} is not a(n) ${requirement}.`);
		}
		return passes();
	});
};

registerCustomRules();

const validator = async (body, rules, customMessages, callback) => {
	const validation = new Validator(body, rules, customMessages);
	validation.passes(() => callback(null, true));
	validation.fails(() => callback(validation.errors, false));
	validation.checkAsync(
		() => callback(null, true),
		() => callback(validation.errors, false)
	);
};

const validate = (req, res, next) => {
	req.validated = () => {
		return {};
	};
	req.validate = async (rules, locations = ['params', 'query', 'body', 'files'], customMessages = {}) => {
		// eslint-disable-next-line no-unused-vars
		return await new Promise((resolve, reject) => {
			let dataToValidate = getFieldsToValidate(req, locations);
			validator(dataToValidate, rules, customMessages, (err, status) => {
				if (!status) {
					return errorResponse(next, convertValidationErrorsToString(err), 422);
				}
				req.validated = () => getValidatedFields(rules, dataToValidate);
				resolve();
			});
		});
	};
	next();
};

const getFieldsToValidate = (req, locations) => {
	const possibleFields = ['params', 'query', 'body', 'files'];
	let fields = {};
	possibleFields.forEach((possibleField) => {
		if (locations.length > 0 && locations.includes(possibleField)) {
			fields = { ...fields, ...req[possibleField] };
		}
	});
	return fields;
};

const getValidatedFields = (rules, dataToValidate) => {
	var validatedObject = {};

	Object.keys(dataToValidate).forEach((key) => {
		if (dataToValidate[key] !== undefined && Object.keys(rules).includes(key)) {
			validatedObject[key] = dataToValidate[key];
		}
	});

	return validatedObject;
};

const convertValidationErrorsToString = (err) => {
	let errorString = '';
	let errors = [];

	// eslint-disable-next-line no-unused-vars
	Object.entries(err.errors).forEach(([key, value]) => {
		if (value.length > 1) {
			value.forEach((combinedError) => {
				errors = errors.concat(combinedError + ' ');
			});
		} else {
			errors = errors.concat(value + ' ');
		}
	});
	errors.forEach((errorValue) => {
		let errorValueWithoutPeriod = errorValue.split('. ')[0];
		if (errors.indexOf(errorValue) != errors.length - 1) {
			errorValueWithoutPeriod += ', ';
		}
		errorString += errorValueWithoutPeriod;
	});

	return errorString;
};

export default validate;
