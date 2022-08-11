import { CommonPrefillData } from "../Lib/StorageType";

export const INPUT_MAP: InputMap = {
    "first_name": ".*f.*name",
    "last_name": ".*l.*name",
    "preferred_name": ".*pref.*name",
    "email": ".*email.*",
    "phone": ".*phone.*",
    "location": ".*loc.*"
};

interface InputMap {
    [field: keyof CommonPrefillData]: string
}