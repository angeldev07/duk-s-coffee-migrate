import { Injectable } from '@angular/core';
import {
    AsyncValidator,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ClienteService } from 'src/app/clientes/services/cliente.service';

@Injectable({ providedIn: 'root' })
export class EmailValidator implements AsyncValidator {
    constructor(private customerService: ClienteService) {}

    validate( control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return this.customerService.checkEmailAvailability(control.value).pipe(
            map((isAvailable) => (!isAvailable ? null : { emailTaken: true })),
            catchError(() => of(null)) // Manejo de errores, puedes adaptarlo según tus necesidades
        );
    }
}
