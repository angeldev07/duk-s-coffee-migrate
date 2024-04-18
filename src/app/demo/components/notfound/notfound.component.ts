import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { style } from '@angular/animations';

@Component({
    selector: 'app-notfound',
    templateUrl: './notfound.component.html',
    standalone: true,
    imports: [RouterLink, ButtonModule],
})
export class NotfoundComponent { }
