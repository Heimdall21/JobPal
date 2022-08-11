import { CommonPrefillData } from "../Lib/StorageType";

export const INPUT_MAP: InputMap = {
    givenName: ".*f.*name",
    familyName: ".*l.*name",
    additionalName: ".*pref.*name",
    email: ".*email.*",
    address: ".*loc.*"
    phone: ".*phone.*",
};

type InputMap = {
    [Property in keyof CommonPrefillData]: string
}