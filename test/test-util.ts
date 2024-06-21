import {prismaClient} from "../src/application/database";
import bcrypt from "bcrypt";
import {Address, Contact, User} from "@prisma/client";

export class UserTest {
    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                username: 'test'
            }
        })
    }

    static async create() {
        await prismaClient.user.create({
            data: {
                username: 'test',
                name: 'test',
                password: await bcrypt.hash('test', 10),
                token: 'test'
            }
        });
    }

    static async get(): Promise<User> {
        const user = await prismaClient.user.findFirst({
            where: {
                username: 'test'
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
}

export class ContactTest {
    static async deleteAll() {
        await prismaClient.contact.deleteMany({
            where: {
                username: 'test'
            }
        });
    }

    static async create() {
        await prismaClient.contact.create({
            data: {
                first_name: 'test',
                last_name: 'test',
                email: 'test@mail.com',
                phone: '08123456789',
                username: 'test'
            }
        });
    }

    static async get(): Promise<Contact> {
        const contact = await prismaClient.contact.findFirst({
            where: {
                username: 'test'
            }
        });

        if (!contact) {
            throw new Error('Contact not found');
        }

        return contact;
    }
}

export class AddressTest {
    static async deleteAll() {
        await prismaClient.address.deleteMany({
            where: {
                contact: {
                    username: 'test'
                }
            }
        });
    }

    static async create() {
        const contact = await ContactTest.get();
        await prismaClient.address.create({
            data: {
                contact_id: contact.id,
                street: 'Jl. Test',
                city: 'Test',
                province: 'Test',
                country: 'Test',
                postal_code: '12345'
            }
        });
    }

    static async get(): Promise<Address> {
        const address = await prismaClient.address.findFirst({
            where: {
                contact: {
                    username: 'test'
                }
            }
        });

        if (!address) {
            throw new Error('Address not found');
        }

        return address;
    }
}