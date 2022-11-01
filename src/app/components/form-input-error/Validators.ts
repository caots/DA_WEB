import { AbstractControl, FormGroup, ValidationErrors, Validators as AGL_Validators } from '@angular/forms';
import { PhoneNumberValidator } from 'src/app/directives/phone-number.validator';

export const ValidatorMessage = {
    required: 'This field is required.',
    number: 'Please enter a valid number.',
    digits: "Please enter only digits.",
    equalTo: "Please enter the same value again.",
    maxlength: "Please enter no more than {0} characters.",
    minlength: "Please enter at least {0} characters.",
    rangelength: "Please enter a value between {0} and {1} characters long.",
    min: "Please enter a value greater than or equal to {0}.",
    minStrict: "Please enter a value greater than or equal to {0}.",
    max: "Please enter a value less than or equal to {0}.",
    maxStrict: "Please enter a value less than or equal to {0}.",
    range: "Please enter a value between {0} and {1}.",
    email: "Please enter a valid email address.",
    phoneVN: "Please enter a valid phone.",
    url: "Please enter a valid URL.",
    date: "Please enter a valid date.",
    dateISO: "Please enter a valid date (ISO).",
}
export const ValidatorGetMessage = (name, params = []) => {
    var message = ValidatorMessage[name];
    message = message.replace(/{(\d+)}/g, function (match, number) {
        return typeof params[number] != 'undefined'
            ? params[number]
            : match;
    })
    return message;
}
export const Validators = {
    required: (control: AbstractControl): ValidationErrors | null => AGL_Validators.required(control),
    requiredFunc: (checkRequired: (value: any) => boolean): ValidationErrors | null => {
        return (control: AbstractControl) => {
            return checkRequired(control.value) ? { required: true } : null
        }
    },
    number: (control: AbstractControl): ValidationErrors | null => !/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(control.value) ? { number: true } : null,
    digits: (control: AbstractControl): ValidationErrors | null => !/^\d+$/.test(control.value) ? { digits: true } : null,
    equalTo: ({ form, field }) => (control: AbstractControl): ValidationErrors | null => control.value != (form as FormGroup).get(field) ? { equalTo: true } : null,
    maxlength: (_maxlength: number) => (control: AbstractControl): ValidationErrors | null => control.value != null && control.value.constructor == String && control.value.length > _maxlength ? { maxlength: [_maxlength] } : null,
    minlength: (_minlength: number) => (control: AbstractControl): ValidationErrors | null => control.value != null && control.value.constructor == String && control.value.length < _minlength ? { minlength: [_minlength] } : null,
    rangelength: (from: number, to: number) => (control: AbstractControl): ValidationErrors | null => control.value != null && (control.value.length < from || control.value.length > to) ? { rangelength: [from, to] } : null,
    min: (min: number) => (control: AbstractControl): ValidationErrors | null => control.value != null && !isNaN(control.value) && eval(control.value) < min ? { min: [min] } : null,
    minStrict: (min: number) => (control: AbstractControl): ValidationErrors | null => control.value != null && !isNaN(control.value) && eval(control.value) <= min ? { minStrict: [min] } : null,
    max: (max: number) => (control: AbstractControl): ValidationErrors | null => control.value != null && !isNaN(control.value) && eval(control.value) > max ? { max: [max] } : null,
    maxStrict: (max: number) => (control: AbstractControl): ValidationErrors | null => control.value != null && !isNaN(control.value) && eval(control.value) >= max ? { maxStrict: [max] } : null,
    range: (min: number, max: number) => (control: AbstractControl): ValidationErrors | null => control.value != null && !isNaN(control.value) && (eval(control.value) > max || eval(control.value) < min) ? { range: [min, max] } : null,
    email: (control: AbstractControl): ValidationErrors | null => control.value != null && !/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(control.value) ? { email: true } : null,
    phoneVN: (control: AbstractControl): ValidationErrors | null => control.value != null && !/(03[2|3|4|5|6|7|8|9]|05[2|6|8|9]|06[7]|07[0|6|7|8|9]|08[1|2|3|4|5|6|8|9]|09[0|1|2|3|4|6|7|8|9])+([0-9]{7})\b/.test(control.value) ? { email: true } : null,
    url: (control: AbstractControl): ValidationErrors | null => control.value != null && !/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(control.value) ? { phoneVN: true } : null,
    date: (control: AbstractControl): ValidationErrors | null => control.value != null && /Invalid|NaN/.test(new Date(control.value).toString()) ? { date: true } : null,
    dateISO: (control: AbstractControl): ValidationErrors | null => control.value != null && !/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(control.value) ? { dateISO: true } : null,
    phone: (countryConfig: any) => (control: AbstractControl) => {
        const config = typeof (countryConfig) == 'function' ? countryConfig() : countryConfig;
        if (config == null) return null;
        var valid = PhoneNumberValidator(config.code)(control);
        return valid == null ? null : { phoneWrongFormat: [config.placeholder], phoneWrongFormatMessage: 'Please enter phone number in format {0}' }
    }
}