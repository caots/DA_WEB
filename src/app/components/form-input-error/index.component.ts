import { Component, ElementRef, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ValidatorMessage } from './Validators';

@Component({
    selector: '[form-input-error]',
    template: `
    {{errorMessage}}
  `,
    styleUrls: ['./index.component.scss'],
})
export class FormInputError {
    @Input() control: FormControl;
    @Input() form: FormGroup;
    constructor(private el: ElementRef) {
        this.el.nativeElement.classList.toggle('d-none', true);
    }

    get errorMessage(): string {
        for (let errorKey in this.control.errors) {
            if ((this.control.touched || this.control.dirty) && this.control.invalid) {
                // return 'true';
                this.el.nativeElement.classList.toggle('d-none', false);
                this.el.nativeElement.classList.toggle('help-block', true);
                this.el.nativeElement.closest('.form-group').classList.toggle('has-error', true);

                var params = this.control.errors[errorKey];
                var customMessage = this.control.errors[`${errorKey}Message`];
                var message = customMessage != null ? customMessage : (ValidatorMessage[errorKey] || 'Field invalid.');
                message = params.constructor == Array && params.length > 0 ? message.replace(/{(\d+)}/g, function (match, number) {
                    return typeof params[number] != 'undefined'
                        ? params[number]
                        : match;
                }) : message;
                return message
            }
        }

        this.el.nativeElement.classList.toggle('d-none', true);
        this.el.nativeElement.closest('.form-group').classList.toggle('has-error', false);
        return null;
    }
}