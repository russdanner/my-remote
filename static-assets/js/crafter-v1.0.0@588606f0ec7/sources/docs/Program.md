
# Program API

Program Related Calls

**Table of Contents**
- [Create Program](#create-program)
- [Get Program by id](#get-program-by-id)
- [Update Program](#update-program)

<!-- 
************************************************************
************************************************************
************************************************************ 
-->

## Create Program

Create a [Program](../app/src/models/Program.ts).

**Request URL** [POST] `/api/1/program/create.json`

```typescript
interface CreateProgramRequest {
  channelId: string;
  title: string;
  description: string;
  startTime: TimeOfDay;
  endTime: TimeOfDay;
  saved: boolean;
  frequency: Array<string>;
  saveEndDate: string;
}
```

**Response**
```typescript
interface CreateProgramResponse {
  entry: Program;
}
```

<!-- 
************************************************************
************************************************************
************************************************************ 
-->

## Get Program by ID

Get a [Program](../app/src/models/Program.ts) by id

**Request URL** [GET] `/api/1/program/{programId}.json`

**Response**
```typescript
interface GetProgramByIdResponse {
  entry: Program;
}
```

<!-- 
************************************************************
************************************************************
************************************************************ 
-->

## Update Program

Update one or more of the [Program](../app/src/models/Program.ts) fields. 
Service to update only the properties sent on the request body.

**Request URL** [POST] `/api/1/program/{programId}.json`

**Request Body** KV pairs of Program Model properties
```typescript
interface UpdateProgramRequest {
  // All fields are optional
  title?: string;
  description?: string;
  startTime?: number;
  endTime?: number;
  saved?: boolean;
  frequency?: Array<string>;
  saveEndDate?: string;
}
```

**Response** — The updated [Program model](../app/src/models/Program.ts)
```typescript
interface UpdateProgramResponse {
  entry: Program
}
```
