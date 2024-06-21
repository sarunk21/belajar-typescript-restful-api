import {User} from "@prisma/client";
import {AddressResponse, CreateAddressRequest, toAddressResponse} from "../model/address-model";
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

    static async get(user: User, contactId: number, addressId: number): Promise<AddressResponse> {
        const getRequest = Validation.validate(AddressValidation.GET, {contact_id: contactId, id: addressId});
        await ContactService.checkContactMustExist(user.username, getRequest.contact_id);

        const address = await prismaClient.address.findUnique({
            where: {
                id: getRequest.id,
                contact_id: getRequest.contact_id
            }
        });

        if (!address) {
            throw new ResponseError(404, "Address not found")
        }

        return toAddressResponse(address);
    }
}