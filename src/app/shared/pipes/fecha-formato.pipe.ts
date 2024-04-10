import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaFormato',
  standalone: true
})
export class FechaFormatoPipe implements PipeTransform {

    transform(fecha: string): string {
        const fechaParseada = new Date(fecha);
        const dia = fechaParseada.getDate().toString().padStart(2, '0');
        const mes = (fechaParseada.getMonth() + 1).toString().padStart(2, '0');
        const anio = fechaParseada.getFullYear();
        return `${dia}/${mes}/${anio}`;
    }
}
