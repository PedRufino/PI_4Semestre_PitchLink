import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Plano } from '../../../interface/IPlanos.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { PLANOS } from '../../../data/planos';
import { CommonModule, NgClass } from '@angular/common';
import { HeaderComponent } from '../../../../../pitchlink/components/header/header.component';
import { ModalLoginComponent } from '../../../../../pitchlink/components/modal-login/modal-login.component';

@Component({
  selector: 'app-planos',
  imports: [HeaderComponent, NgClass, CommonModule, ModalLoginComponent],
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.css']
})
export class PlanosComponent implements OnInit {
  planosKeys: string[] = [];
  planos: Record<string, Plano> = PLANOS;

  constructor(
    private route: ActivatedRoute, 
    private sanitizer: DomSanitizer, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const keysParam = params.get('parametro');
      this.planosKeys = keysParam ? keysParam.split(',') : [];
    });
  }

  isInAppRoute(): boolean {
    return this.router.url.includes('/app');
  }

  // Método para navegar para pagamento
  goToPayment(planoNome: string) {
    this.router.navigate(['/app/test'], { queryParams: { plan: planoNome.toLowerCase() } });
  }

  getStatusIcon(status: boolean) {
    let svg;
    if (status) {
      svg = `
        <svg class="w-6 h-6 mx-auto text-gray-800 dark:text-white" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 11.917 9.724 16.5 19 7.5" />
        </svg>
      `;
    } else {
      svg = `
        <svg class="w-6 h-6 mx-auto text-gray-800 dark:text-white" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd"
                d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"
                clip-rule="evenodd" />
        </svg>
      `;
    }
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}