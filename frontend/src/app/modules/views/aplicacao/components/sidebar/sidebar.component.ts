import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { initFlowbite } from 'flowbite';
import { environment } from '../../../../../../environments/environment.prod';
import { MensagensPropostaComponent } from './mensagens-proposta/mensagens-proposta.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { AuthService } from '../../../../../core/services/auth.service';
import { MensagensComponent } from '../../../mensagens/mensagens.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MensagensPropostaComponent,
    ConfiguracoesComponent,
    MensagensComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent implements OnInit {

  isRecs = false;
  isPerfil = false;

  nome: string = '';
  sobrenome: string = '';
  email: string = '';
  data_nasc: string = '';
  categories: string = '';
  plan: string = '';

  imagem: string = '';

  constructor(
    public router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    initFlowbite();

    // Atualiza estado baseado na rota sempre que ela muda
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        this.isRecs = url.includes('/app/recs') || url.includes('/app/mensagens');
        this.isPerfil = url.includes('/app/perfil');
      });

    // Também define uma vez no carregamento inicial
    const url = this.router.url;
    this.isRecs = url.includes('/app/recs') || url.includes('/app/mensagens');
    this.isPerfil = url.includes('/app/perfil') || 
    url.includes('/app/subscription')  || 
    url.includes( '/app/ideia') ||
    url.includes( '/app/listar_ideias') ||
    url.includes( '/app/regras-comunidade') ||
    url.includes( '/app/seguranca-politica') ||
    url.includes( '/app/dicas-seguranca') ||
    url.includes( '/app/politicas-privacidade') ||
    url.includes( '/app/termos-servico') ||
    url.includes( '/app/payment') ||
    url.includes( '/app/proposta-recebidas') ||
    url.includes( '/app/proposta-enviadas') ||
    url.includes( '/app/financeiro') ||
    url.includes( '/app/negocios-fechados') ||
    url.includes( '/app/politica-cookies');

    // Dados do usuário
    this.authService.image().subscribe(
      imageResponse => {
        if (imageResponse.image_url.startsWith('http')) {
          this.imagem = imageResponse.image_url;
        } else {
          this.imagem = `${environment.getBaseUrl()}${imageResponse.image_url}`;
        }
      },
      error => console.error(error)
    );

    this.authService.getUser().subscribe(
      dataResponse => {
        
        this.nome = dataResponse.data.first_name;
        this.sobrenome = dataResponse.data.last_name;
        this.email = dataResponse.data.email;
        this.plan = dataResponse.data.plan
        this.data_nasc = dataResponse.data.data_nasc;
        this.categories = dataResponse.data.categories;
      },
      error => console.error(error)
    );
  }
  abrirModalPagamento(): void {
    
    console.log('Abrindo modal de pagamento...');
}
}
