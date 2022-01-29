import path from 'path';
import fs from 'fs';

const createCustomFileName = (model, file) => {
	return `${model._id}_${Date.now()}${path.parse(file.name).ext}`;
};

const saveFile = (file, fileName, folder) => {
	const dir = `${process.env.FILE_UPLOAD_PATH}/${folder}/`;
	fs.mkdir(dir, { recursive: true }, (err) => {
		if (err) throw err;
		file.mv(`${dir}${fileName}`, async (err) => {
			if (err) {
				console.log(err);
				throw 'problem with file upload';
			}
		});
	});
};

export const deleteExistingFile = (existingFileName, folder) => {
	fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${folder}/${existingFileName}`, (err) => {
		if (err) {
			console.log('file not found');
		}
	});
};

export const storeVcImage = (logo, Vc) => {
	let response = { status: true, name: '', error: '' };

	response.name = `vc_${createCustomFileName(Vc, logo)}`;

	try {
		saveFile(logo, response.name, 'vc');
	} catch (error) {
		response.status = false;
		response.error = error;
	}

	return response;
};

export const updateVcImage = (logo, Vc) => {
	let response = { status: true, name: '', error: '' };

	response.name = `vc_${createCustomFileName(Vc, logo)}`;

	try {
		saveFile(logo, response.name);
	} catch (error) {
		response.status = false;
		response.error = error;
	}

	deleteExistingFile(Vc.logo, 'vc');

	return response;
};
