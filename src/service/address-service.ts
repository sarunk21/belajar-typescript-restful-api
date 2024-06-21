import {Address, User} from "@prisma/client";
import {AddressResponse, CreateAddressRequest, toAddressResponse, UpdateAddressRequest} from "../model/address-model";
import {Validation} from "../validation/validation";
import {AddressValidation} from "../validation/address-validation";
import {ContactService} from "./contact-service";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";

export class AddressService {
    static async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
        const createRequest = Validation.validate(AddressValidation.CREATE, request);
        await ContactService.checkContactMustExist(user.username, createRequest.contact_id);

        const address = await prismaClient.address.create({
            data: createRequest
        });

        return toAddressResponse(address);
    }

    static async checkAddressMustExist(contactId: number, addressId: number): Promise<Address> {
        const address = await prismaClient.address.findUnique({
            where: {
                id: addressId,
                contact_id: contactId
            }
        });

        if (!address) {
            throw new ResponseError(404, "Address not found");
        }

        return address;
    }

    static async get(user: User, contactId: number, addressId: number): Promise<AddressResponse> {
        const getRequest = Validation.validate(AddressValidation.GET, {contact_id: contactId, id: addressId});
        await ContactService.checkContactMustExist(user.username, getRequest.contact_id);

        const address = await this.checkAddressMustExist(getRequest.contact_id, getRequest.id);

        return toAddressResponse(address);
    }

    static async update(user: User, request: UpdateAddressRequest): Promise<AddressResponse> {
        const updateRequest = Validation.validate(AddressValidation.UPDATE, request);
        await ContactService.checkContactMustExist(user.username, request.contact_id);
        await this.checkAddressMustExist(updateRequest.contact_id, updateRequest.id);

        const address = await prismaClient.address.update({
            where: {
                id: updateRequest.id,
                contact_id: updateRequest.contact_id
            },
            data: updateRequest
        });

        return toAddressResponse(address);
    }
}