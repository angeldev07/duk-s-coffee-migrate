import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeP',
  standalone: true
})
export class ActiveFormatoPipe implements PipeTransform {

  transform(active: boolean): string {
    return active ? 'Activo' : 'Desactivado';
  }

}
