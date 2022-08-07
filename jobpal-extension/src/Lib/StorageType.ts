export interface PrefillData {
    common: CommonPrefillData,
    specific: {
        [url: string]: SpecificPrefillData,
    }
}

export interface CommonPrefillData {
    givenName: string,
    additionalName?: string,
    familyName: string,
    email: string,
    sex: 'M'| 'F' | 'X',
    dateOfBirth: Date,
    address: string,
    postalCode?: string,
    university: string,
    degree: string,
    yearOfGrad: string,
    github?: string,
    linkedin?: string,
    additional: {
        [other: string]: string
    }
}

export interface SpecificPrefillData {
    companyName: string,
    role: string,
    shortcut?: string,
    additional: {
        [other: string]: string
    }
}
