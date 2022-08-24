import { CommonPrefillData } from "../Lib/StorageType";

export const INPUT_MAP: InputMap = {
    givenName: {
        label: [/first(\\s|_)*name/i, /given(\\s|_)*name/i],
    input: [/.*fname.*/i, /.*first_name.*/i, /.*first.*name.*/i]
    },
    familyName: {
        label: [/last(\\s|_)*name/, /family(\\s|n)*name/],
        input: [/.*lname.*/, /.*last_name.*/, /.*last.*name.*/]
    },
    additionalName: {
        label: [/additional(\\s|_)*name/i, /preffered(\\s|_)*name/i, ],
        input: [/.*pref.*name/i]
    },
    email: {
        label: [/email/i],
        input: [/.*email.*/i]
    },
    address: {
        label: [/address/i, /location/i],
        input: [/.*loc.*/i]
    },
    phone: {
        label: [/phone/i, /contact\s*n(o\.|um).*/i],
        input: [/.*phone.*/]
    }
};

export type InputMap = {
    [Property in keyof CommonPrefillData]: {
        label: RegExp[],
        input: RegExp[]
    }
}