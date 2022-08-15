export interface ViewCommonData {
    givenName: string,
    additionalName: string,
    familyName: string,
    email: string,
    phone: string,
    sex: 'M'| 'F' | 'X'|'',
    dateOfBirth: string,
    address: string,
    postalCode: string,
    university: string,
    degree: string,
    yearOfGrad: string,
    github: string,
    linkedin: string
}

export type ViewAdditionalType = {id: number, key: string, value: string}[];

export interface ViewSpecificData {
    id: number,
    url: string,
    companyName: string,
    role: string,
    shortcut: string,
    additional: ViewAdditionalType
}