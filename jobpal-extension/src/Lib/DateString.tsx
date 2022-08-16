export class DateString {
    static validate(str: string): string|null {
        if (str === '' || isNaN(new Date(str).getTime())) {
            return null;
        } else {
            return str;
        }
    }
}
