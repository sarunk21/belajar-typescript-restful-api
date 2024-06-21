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