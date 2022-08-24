import { CommonPrefillData } from "../Lib/StorageType";

export const INPUT_MAP: InputMap = {
    givenName: {
        label: [/first(\\s|_)*name/i, /given(\\s|_)*name/i],
        input: [/.*fname.*/i, /.*first_name.*/i, /.*first.*name.*/i]
    },
    familyName: {
        label: [/last(\\s|_)*name/i, /family(\\s|n)*name/i, /surname/i],
        input: [/.*lname.*/, /.*last_name.*/, /.*last.*name.*/]
    },
    additionalName: {
        label: [/additional(\\s|_)*name/i, /preffered(\\s|_)*name/i,],
        input: [/.*pref.*name/]
    },
    email: {
        label: [/email/i],
        input: [/.*email.*/]
    },
    address: {
        label: [/address/i, /location/i],
        input: [/.*loc.*/]
    },
    phone: {
        label: [/phone/i, /contact\s*n(o\.|um).*/i],
        input: [/.*phone.*/]
    },
    sex: {
        label: [/sex/i, /gender/i,],
        input: []
    },
    university: {
        label: [/university/i, /school/i, /education/i],
        input: []
    },
    degree: {
        label: [/degree/i, /discipline/i],
        input: []
    },
    yearOfGrad: {
        label: [],
        input: []
    },
    dateOfBirth: {
        label: [],
        input: []
    },
    postalCode: {
        label: [],
        input: []
    },
    github: {
        label: [/github\surl/i],
        input: []
    },
    linkedin: {
        label: [/LinkedIn\sURL/i],
        input: []
    },
    fullname: {
        label: [/full\s*name/i],
        input: []
    },
};

export type InputMap = {
    [Property in keyof CommonPrefillData | 'fullname']: {
        label: RegExp[],
        input: RegExp[]
    }
}