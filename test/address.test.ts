import {AddressTest, ContactTest, UserTest} from "./test-util";
import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";

describe('POST /api/address/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to create address', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: "Jl. Test",
                city: "Test",
                province: "Test",
                country: "Test",
                postal_code: "12345"
            });

        logger.debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.street).toEqual("Jl. Test");
        expect(response.body.data.city).toEqual("Test");
        expect(response.body.data.province).toEqual("Test");
        expect(response.body.data.country).toEqual("Test");
        expect(response.body.data.postal_code).toEqual("12345");
    });

    it('should reject create new address if request is invalid', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: "Jl. Test",
                city: "Test",
                province: "Test",
                country: "",
                postal_code: ""
            });

        logger.debug(response.body);
        expect(response.status).toEqual(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject create new address if contact not found', async () => {
        const response = await supertest(web)
            .post(`/api/contacts/9999/addresses`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: "Jl. Test",
                city: "Test",
                province: "Test",
                country: "Test",
                postal_code: "12345"
            });

        logger.debug(response.body);
        expect(response.status).toEqual(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/address/:contactId/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to get address', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.id).toEqual(address.id);
        expect(response.body.data.street).toEqual(address.street);
        expect(response.body.data.city).toEqual(address.city);
        expect(response.body.data.province).toEqual(address.province);
        expect(response.body.data.country).toEqual(address.country);
        expect(response.body.data.postal_code).toEqual(address.postal_code);
    });

    it('should reject get address if address not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(404);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject get address if contact is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('PUT /api/address/:contactId/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to update', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: "Jl. Test Updated",
                city: "Test Updated",
                province: "Test Updated",
                country: "Test Updated",
                postal_code: "54321"
            });

        logger.debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data.id).toEqual(address.id);
        expect(response.body.data.street).toEqual("Jl. Test Updated");
        expect(response.body.data.city).toEqual("Test Updated");
        expect(response.body.data.province).toEqual("Test Updated");
        expect(response.body.data.country).toEqual("Test Updated");
        expect(response.body.data.postal_code).toEqual("54321");
    });

    it('should reject update address if data is invalid', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: "Jl. Test Updated",
                city: "Test Updated",
                province: "Test Updated",
                country: "",
                postal_code: ""
            });

        logger.debug(response.body);
        expect(response.status).toEqual(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject update address if address not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: "Jl. Test Updated",
                city: "Test Updated",
                province: "Test Updated",
                country: "Test Updated",
                postal_code: "54321"
            });

        logger.debug(response.body);
        expect(response.status).toEqual(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('DELETE /api/address/:contactId/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to remove address', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(200);
    });

    it('should reject remove address if address is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(404);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject remove address if contact is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/address/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to list address', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses`)
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toEqual(1);
    });

    it('should reject list address if contact is not found', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 1}/addresses`)
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toEqual(404);
        expect(response.body.errors).toBeDefined();
    });
});
