import { CommonPrefillData } from "../Lib/StorageType";

export const INPUT_MAP: InputMap = {
    givenName: {
        label: [],
        input: [".*fname.*", ".*first_name.*", ".*first.*name.*"]
    },
    familyName: {
        label: [],
        input: [".*lname.*", ".*last_name.*", ".*last.*name.*"]
    },
    additionalName: {
        label: [],
        input: [".*pref.*name"]
    },
    email: {
        label: [],
        input: [".*email.*"]
    },
    address: {
        label: [],
        input: [".*loc.*"]
    },
    phone: {
        label: [],
        input: [".*phone.*"]
    }
};

export type InputMap = {
    [Property in keyof CommonPrefillData]: {
        label: string[],
        input: string[]
    }
}