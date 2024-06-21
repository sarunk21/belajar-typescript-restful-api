import {ContactTest, UserTest} from "./test-util";
import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";

describe('POST /api/contacts', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should create new contact', async () => {
        const response = await supertest(web)
            .post('/api/contacts')
            .set('X-API-TOKEN', 'test')
            .send({
                first_name: 'Muhammad Kautsar',
                last_name: 'Panggawa',
                email: 'kautsarmkp@gmail.com',
                phone: '08123456789',
            });

        logger.debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toEqual('Muhammad Kautsar');
        expect(response.body.data.last_name).toEqual('Panggawa');
        expect(response.body.data.email).toEqual('kautsarmkp@gmail.com');
        expect(response.body.data.phone).toEqual('08123456789');
    });

    it('should reject create new contact if data is invalid', async () => {
        const response = await supertest(web)
            .post('/api/contacts')
            .set('X-API-TOKEN', 'test')
            .send({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
            });

        logger.debug(response.body);
        expect(response.status).toEqual(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able get contact', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}`)
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.id).toEqual(contact.id);
        expect(response.body.data.first_name).toEqual(contact.first_name);
        expect(response.body.data.last_name).toEqual(contact.last_name);
        expect(response.body.data.email).toEqual(contact.email);
    });

    it('should reject get contact if contact is not found', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 1}`)
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(404);
        expect(response.body.errors).toBeDefined();
    });
});