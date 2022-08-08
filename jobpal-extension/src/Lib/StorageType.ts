export interface PrefillData {
    common: ExtendedCommonPrefillData,
    specific: {
        [url: string]: ExtendedSpecificPrefillData,
    }
}

export interface ExtendedCommonPrefillData extends CommonPrefillData {
    additional: AdditionalPrefillData
}

export interface ExtendedSpecificPrefillData extends SpecificPrefillData {
    additional: AdditionalPrefillData
}

export interface AdditionalPrefillData {
    [other: string]: string
}

export interface CommonPrefillData {
    givenName?: string,
    additionalName?: string,
    familyName?: string,
    email?: string,
    sex?: 'M'| 'F' | 'X',
    dateOfBirth?: Date,
    address?: string,
    postalCode?: string,
    university?: string,
    degree?: string,
    yearOfGrad?: number,
    github?: string,
    linkedin?: string
}

export interface SpecificPrefillData {
    companyName?: string,
    role?: string,
    shortcut?: string
}
