import Vue from 'vue';
import { ValidationProvider, extend } from 'vee-validate';

import {
    required,
    email,
    min,
    alpha_num as alphaNum,
    confirmed,
    max_value as maxValue,
} from 'vee-validate/dist/rules';

extend('required', {
    ...required,
    message: '{_field_} is required.',
});

extend('email', {
    ...email,
    message: '{_field_} should be a valid email address.',
});

extend('min', {
    ...min,
    message: '{_field_} should have a minimum of {length} characters.',
});

extend('alpha_num', {
    ...alphaNum,
    message: '{_field_} can only contain letters and numbers.',
});

extend('confirmed', {
    ...confirmed,
    message: '{_field_} should be the same as the {_target_} field.',
});

extend('max_value', {
    ...maxValue,
    message: '{_field_} should not be more than {max}.',
});

Vue.component('ValidationProvider', ValidationProvider);
