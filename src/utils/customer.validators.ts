import {AbstractControl, FormControl, ValidationErrors} from '@angular/forms';

export class ValidacionesPropias {
    static parientesTelefonos(control: AbstractControl) {
        let repetidos = [];
        control['controls'].filter((value, index) => {
            let errors = value['controls']['telefono']['errors'] || {};
            delete errors?.['validoPas'];
            if (Object.entries(errors).length === 0) {
                value['controls']['telefono']['errors'] = null;
            } else {
                value['controls']['telefono']['errors'] = errors;
            }
            control['controls'].filter((value2, index2) => {
                if (index != index2) {
                    if (value['controls']['telefono']['value'] === value2['controls']['telefono']['value']) {
                        repetidos.push(index);
                    }
                }
            });
        });

        if (repetidos.length > 2) {
            repetidos.forEach(index => {
                let errors = control['controls'][index]['controls']['telefono']['errors'] || {};
                errors.validoPas = false;
                control['controls'][index]['controls']['telefono']['errors'] = errors;
            });
            return {multiplo5: true};
        } else {
            return null;
        }
    }

    static padres(control: AbstractControl) {
        const referencias = control['controls'];
        const padres = [];
        const madres = [];

        referencias.filter((value, index) => {
            let errors = value['controls']['referenciaSolicitante']['errors'] || {};
            delete errors?.['validoPas5'];
            if (Object.entries(errors).length === 0) {
                value['controls']['referenciaSolicitante']['errors'] = null;
            } else {
                value['controls']['referenciaSolicitante']['errors'] = errors;
            }

            if (value['controls']['referenciaSolicitante']['value'] === 'Padre') {
                padres.push(index);
            }
            if (value['controls']['referenciaSolicitante']['value'] === 'Madre') {
                madres.push(index);
            }
        });
        if (padres.length > 1) {
            padres.forEach(index => {
                let errors = control['controls'][index]['controls']['referenciaSolicitante']['errors'] || {};
                errors.validoPas5 = false;
                control['controls'][index]['controls']['referenciaSolicitante']['errors'] = errors;
            });
        }
        if (madres.length > 1) {
            madres.forEach(index => {
                let errors = control['controls'][index]['controls']['referenciaSolicitante']['errors'] || {};
                errors.validoPas5 = false;
                control['controls'][index]['controls']['referenciaSolicitante']['errors'] = errors;
            });
        }
        if (madres.length > 1 || padres.length > 1) {
            return {multiplo5: true};
        } else {
            return null;
        }
    }

}

// control['controls'].filter((value2, index2) => {
//     if (index != index2) {
//         if (value['controls']['telefono']['value'] === value2['controls']['telefono']['value']) {
//             console.log('errors', value['controls']['telefono']['errors']);
//             let errors = value['controls']['telefono']['errors'] || {};
//             errors.validoPas = false;
//             value['controls']['telefono']['errors'] = errors;
//         } else {
//             let errors = value['controls']['telefono']['errors'];
//             delete errors?.validoPas;
//             value['controls']['telefono']['errors'] = errors;
//         }
//     }
// });

