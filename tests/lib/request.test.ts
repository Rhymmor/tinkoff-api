import {RequestManager} from '../../src/lib/request';
import nock = require('nock');
import { joi } from '../../src/lib/validation';
import * as baseRequest from 'request-promise-native';

describe('RequestManager tests', () => {
    const url = 'http://test.test';
    const request = new RequestManager(baseRequest.defaults({
        json: true,
        baseUrl: url
    }));
    const responseGet = {a: 1};
    const responsePost = {b: 'test'};

    beforeEach(() => {
        nock(url)
            .get('/')
            .reply(200, responseGet);

        nock(url)
            .post('/')
            .reply(200, responsePost);
    });

    test('Successful GET request without validation', async () => {
        const res = await request.send({url: '/'});
        expect(res).toBeDefined();
        expect(res).toEqual(responseGet);
    });

    test('Successful GET request with validation', async () => {
        const res = await request.send({url: '/'}, {a: joi.number().required()});
        expect(res).toBeDefined();
        expect(res).toEqual(responseGet);
    });

    test('GET request with failed validation', async () => {
        expect.hasAssertions();
        try {
            await request.send({url: '/'}, {a: joi.string().required()});
        } catch (e) {
            expect(e).toHaveProperty('error');
            expect(e.error).toBeDefined();
            expect(e.error).toHaveProperty('name');
            expect(e.error.name).toBe('ValidationError');

            expect(e).toHaveProperty('response');
            expect(e.response).toEqual(responseGet);

            expect(e).toHaveProperty('message');
        }
    });

    test('Successful POST request without validation', async () => {
        const res = await request.send({url: '/', method: 'POST'});
        expect(res).toBeDefined();
        expect(res).toEqual(responsePost);
    });
});