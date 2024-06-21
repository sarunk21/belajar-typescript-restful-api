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

describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able update contact', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}`)
            .set('X-API-TOKEN', 'test')
            .send({
                first_name: 'Kautsar',
                last_name: 'Panggawa',
                email: 'kautsar@gmail.com',
                phone: '08123456789',
            });

        logger.debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.id).toEqual(contact.id);
        expect(response.body.data.first_name).toEqual('Kautsar');
        expect(response.body.data.last_name).toEqual('Panggawa');
        expect(response.body.data.email).toEqual('kautsar@gmail.com');
        expect(response.body.data.phone).toEqual('08123456789');
    });

    it('should reject update contact if request is invalid', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .put(`/api/contacts/${contact.id + 1}`)
            .set('X-API-TOKEN', 'test')
            .send({
                first_name: '',
                last_name: 'Panggawa',
                email: 'kautsar@gmail.com',
                phone: '08123456789',
            });

        logger.debug(response.body);
        expect(response.status).toEqual(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject update contact if contact is not found', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .put(`/api/contacts/${contact.id + 1}`)
            .set('X-API-TOKEN', 'test')
            .send({
                first_name: 'Kautsar',
                last_name: 'Panggawa',
                email: 'kautsar@gmail.com',
                phone: '08123456789',
            });

        logger.debug(response.body);
        expect(response.status).toEqual(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to delete contact', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id}`)
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data).toEqual('OK');
    });

    it('should reject delete contact if contact is not found', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id + 1}`)
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to search contact', async () => {
        const response = await supertest(web)
            .get('/api/contacts')
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.paging.current_page).toEqual(1);
        expect(response.body.paging.total_page).toEqual(1);
        expect(response.body.paging.size).toEqual(10);
    });

    it('should be able to search contact using name', async () => {
        const response = await supertest(web)
            .get('/api/contacts')
            .query({
                name: 'test'
            })
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.paging.current_page).toEqual(1);
        expect(response.body.paging.total_page).toEqual(1);
        expect(response.body.paging.size).toEqual(10);
    });

    it('should be able to search contact using email', async () => {
        const response = await supertest(web)
            .get('/api/contacts')
            .query({
                email: 'test@mail.com'
            })
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.paging.current_page).toEqual(1);
        expect(response.body.paging.total_page).toEqual(1);
        expect(response.body.paging.size).toEqual(10);
    });

    it('should be able to search contact using phone', async () => {
        const response = await supertest(web)
            .get('/api/contacts')
            .query({
                phone: '08123456789'
            })
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.paging.current_page).toEqual(1);
        expect(response.body.paging.total_page).toEqual(1);
        expect(response.body.paging.size).toEqual(10);
    });

    it('should be able to search contact no result', async () => {
        const response = await supertest(web)
            .get('/api/contacts')
            .query({
                name: 'salah'
            })
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(0);
        expect(response.body.paging.current_page).toEqual(1);
        expect(response.body.paging.total_page).toEqual(0);
        expect(response.body.paging.size).toEqual(10);
    });

    it('should be able to search with paging', async () => {
        const response = await supertest(web)
            .get('/api/contacts')
            .query({
                page: 2,
                size: 1
            })
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(0);
        expect(response.body.paging.current_page).toEqual(2);
        expect(response.body.paging.total_page).toEqual(1);
        expect(response.body.paging.size).toEqual(1);
    });
});