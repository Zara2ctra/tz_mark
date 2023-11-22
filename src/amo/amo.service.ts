import {Injectable} from '@nestjs/common';
import axios from 'axios';
import CustomRequest from "../express";

@Injectable()
export class AmoService {
    private apiUrl = process.env.API_URL;

    async getContact(request: CustomRequest): Promise<void> {
        try {
            const {name, email, phone} = request.body
            const accessToken = request.refreshedAccessToken;
            const existingContact = await this.findContact(accessToken, phone);
            let clientId: number;

            if (existingContact) {
                clientId = await this.updateContact(accessToken, existingContact.contacts[0].id, {name, email, phone});
            } else {
                clientId = await this.createContact(accessToken, {name, email, phone});
            }

            await this.createDeal(accessToken, clientId, {name, email, phone});
        } catch (error) {
            console.error('Ошибка при выполнении запроса к AmoCRM:', error.message);
            throw error;
        }
    }

    private async findContact(accessToken: string, phone: string): Promise<any | null> {
        try {
            const response = await axios.get(`${this.apiUrl}/contacts?query=${phone}`, {
                headers: {Authorization: `Bearer ${accessToken}`},
            });
            return response.data?._embedded;
        } catch (error) {
            console.log(error)
        }
    }

    private async createContact(accessToken: string, contactData: any): Promise<number> {
        try {
            const response = await axios.post(`${this.apiUrl}/contacts`, [
                {
                    "name": contactData.name,
                    "custom_fields_values": [
                        {
                            "field_name": "Телефон",
                            "field_code": "PHONE",
                            "field_type": 'multitext',
                            "values": [
                                {
                                    "value": contactData.phone,
                                    "enum_code": "WORK"
                                }
                            ]
                        }, {
                            "field_code": "EMAIL",
                            "values": [
                                {
                                    "value": contactData.email,
                                }
                            ]
                        }]
                }
            ], {
                headers: {Authorization: `Bearer ${accessToken}`},
            });
            return response.data._embedded.contacts[0].id
        } catch (error) {
            console.log(error.message)
        }
    }

    private async updateContact(accessToken: string, contactId: number, contactData: any): Promise<number> {
        try {
            const response = await axios.patch(`${this.apiUrl}/contacts/${contactId}`, {
                "id": contactId,
                "name": contactData.name,
                "custom_fields_values": [
                    {
                        "field_name": "Телефон",
                        "field_code": "PHONE",
                        "field_type": 'multitext',
                        "values": [
                            {
                                "value": contactData.phone,
                                "enum_code": "WORK"
                            }
                        ]
                    }, {
                        "field_code": "EMAIL",
                        "values": [
                            {
                                "value": contactData.email,
                            }
                        ]
                    },
                ]
            }, {
                headers: {Authorization: `Bearer ${accessToken}`},
            });
            return response.data.id
        } catch (error) {
            console.log(error)
        }
    }

    private async createDeal(accessToken: string, clientId: number, contactData: any): Promise<void> {
        const response = await axios.post(`${this.apiUrl}/leads`, [
            {
                "name": `Сделка с ${contactData.name}`,
                "_embedded": {
                    "contacts": [
                        {
                            "id": clientId
                        }
                    ]
                }
            }
        ], {
            headers: {Authorization: `Bearer ${accessToken}`},
        });
        console.log('Создана новая сделка:', response.data._embedded);
    }
}