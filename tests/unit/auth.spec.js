import ApiHelper from '../helpers/apiHelper';
import assert from 'assert';
import mongoose from 'mongoose';
import { getRandomString } from '../helpers/helperFunctions';

const helper = new ApiHelper();
const urlPrefix = '/v1/auth';

const emailBody = getRandomString(10);

describe('Mock Auth Endpoints', () => {
	it('POST /v1/auth/signup should respond with a success json containing a data/user object and a non-null token field', async (done) => {
		const response = await helper.apiServer.post(`${urlPrefix}/signup`).send({
			email: `email@${emailBody}.com`,
			password: 'secret',
			password_confirmation: 'secret',
		});
		let body = response.body;
		console.log('response body ---------', response.body);
		response.expect(200);
		assert(body.success, true);
		assert(body).toHaveProperty('data');
		assert(body.data).toHaveProperty('_id');
		assert(body.data).toHaveProperty('email');
		expect(body).toHaveProperty('token');
		expect(body.token).any(String);
		// done();
	});

	it('POST /v1/auth/signup should respond with an error json', async () => {
		return helper.apiServer
			.post(`${urlPrefix}/signup`)
			.send({
				email: `email@${emailBody}.com`,
				password: 'secret',
				password_confirmation: 'not-secret',
			})
			.expect(422)
			.then(({ body }) => {
				assert(body.success, false);
				expect(body).toHaveProperty('error');
			})
			.catch((err) => err);
	});

	it('POST /v1/auth/signin should respond with a success json containing a data/user object and a non-null token field', async () => {
		return helper.apiServer
			.post(`${urlPrefix}/signin`)
			.send({ email: `email@${emailBody}.com`, password: 'secret' })
			.expect(200)
			.then(({ body }) => {
				assert(body.success, true);
				assert(body.data, {});
			})
			.catch((err) => err);
	});

	it('POST /v1/auth/signin should respond with an error json', async () => {
		return helper.apiServer
			.post(`${urlPrefix}/signup`)
			.send({ email: `email@${emailBody}.com`, password: 'not-secret' })
			.expect(422)
			.then(({ body }) => {
				assert(body.success, false);
				expect(body).toHaveProperty('error');
			})
			.catch((err) => err);
	});

	it("POST /v1/auth/forgot-password should respond with a success json containing the message 'Email Sent'", async () => {
		return helper.apiServer
			.post(`${urlPrefix}/forgot-password`)
			.send({ email: `email@${emailBody}.com` })
			.expect(200)
			.then(({ body }) => {
				assert(body.success, true);
				expect(body).toHaveProperty('data');
				expect(body).toHaveProperty('message');
				assert(body.message, 'Email sent');
			})
			.catch((err) => err);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
