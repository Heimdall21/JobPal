export class ViewCommonData {
    givenName: string
    additionalName: string
    familyName: string
    email: string
    phone: string
    sex: 'M'| 'F' | 'X'|''
    dateOfBirth: string
    address: string
    postalCode: string
    university: string
    degree: string
    yearOfGrad: string
    github: string
    linkedin: string

    constructor() {
        this.givenName = '';
        this.additionalName = '';
        this.familyName = '';
        this.phone = '';
        this.email = '';
        this.sex = '';
        this.dateOfBirth = '';
        this.address = '';
        this.postalCode = '';
        this.university = '';
        this.degree = '';
        this.yearOfGrad = '';
        this.github = '';
        this.linkedin = '';
    }
}

export function ViewCommonKeys(): (keyof ViewCommonData)[] {
    // Note: we need to type cast the list of keys as Object.keys returns string[]
    // instead of (keyof ViewCommonData)[]
    return Object.keys(new ViewCommonData()) as (keyof ViewCommonData)[];
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