Tinkoff Bank REST API client 
[![npm version](https://badge.fury.io/js/tinkoff-api.svg)](https://badge.fury.io/js/tinkoff-api)
[![Build Status](https://travis-ci.org/Rhymmor/tinkoff-api.svg?branch=master)](https://travis-ci.org/Rhymmor/tinkoff-api)
================
[![codebeat badge](https://codebeat.co/badges/bafa0d61-8772-4122-9c30-a8c6906361ae)](https://codebeat.co/projects/github-com-rhymmor-tinkoff-api-master)
[![BCH compliance](https://bettercodehub.com/edge/badge/Rhymmor/tinkoff-api?branch=master)](https://bettercodehub.com/)
[![CodeFactor](https://www.codefactor.io/repository/github/rhymmor/tinkoff-api/badge)](https://www.codefactor.io/repository/github/rhymmor/tinkoff-api)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f90d894ac45c4265b9c360c49a594ab2)](https://www.codacy.com/app/anatoly.belonog/tinkoff-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Rhymmor/tinkoff-api&amp;utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/github/rhymmor/tinkoff-api/badge.svg)](https://snyk.io/test/github/rhymmor/tinkoff-api)

Node.js implementation of [Tinkoff](https://www.tinkoff.ru/) REST API

### Installation:

```
npm i tinkoff-api --save
```

### Requirements:

- Node >= 6

### Implemented commands:

- `session` - get a new session ID to use it in all following commands
- `session_status` - get the status of a current session by ID
- `sign_up` - request signing up by phone or credentials
- `confirm` - confirm signing up by an SMS pin
- `level_up` - enhance session access rights after signing up confirmation
- `operations` - get client operations for a certain period of time (requires signing up)

### Example:

Start signing up:

```
import { TinkoffApi } from "../src";

const api = new TinkoffApi();
const {payload: sessionId} = await api.initializeSession();
console.log(`Session ID = ${sessionId}`);

const {operationTicket} = await api.signUp(sessionId, {username: 'Username', password: 'Password'});

// You will need Ticket ID to confirm signing up
console.log(`Ticket ID = ${operationTicket}`);
```

Then user will receive sms with 4-digits PIN. It will be used to continue registration:

```
const smsId = '0000'; // 4-digits PIN
await api.confirmSignUp(sessionId, operationTicket, smsId);
await api.levelUp(sessionId);
const {payload: {accessLevel}} = await api.checkSessionStatus(sessionId);

// Should be equal to CLIENT
console.log('Session access level = ${accessLevel}');
```
