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