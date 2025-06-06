import { Routes } from '@angular/router';

// Page Components
import { HomeComponent } from './modules/pitchlink/pages/home/home.component';
import { PerfilComponent } from './modules/user/pages/perfil/perfil.component';
import { SwingComponent } from './modules/views/cards/pages/swing/swing.component';
import { LayoutComponent } from './modules/views/aplicacao/pages/layout/layout.component';
import { authGuardNotFoundGuard } from './core/guards/not-found/auth-guard-not-found.guard';
import { authGuardSuccessGuard } from './core/guards/success/auth-guard-success.guard';
import { IdeiaComponent } from './modules/user/pages/ideia/ideia.component';
import { MensagensComponent } from './modules/views/mensagens/mensagens.component';
import { SubscriptionComponent } from './modules/views/aplicacao/components/subscription/subscription.component';
import { PlanosComponent } from './modules/views/aplicacao/components/subscription/planos/planos.component';
import { SobreComponent } from './modules/pitchlink/pages/sobre/sobre.component';
import { ContatoComponent } from './modules/pitchlink/pages/contato/contato.component';
import { PoliticasPrivacidadeComponent } from './modules/pitchlink/pages/politicas-privacidade/politicas-privacidade.component';
import { LicenciamentoComponent } from './modules/pitchlink/pages/licenciamento/licenciamento.component';
import { TermosCondicoesComponent } from './modules/pitchlink/pages/termos-condicoes/termos-condicoes.component';
import { ListaIdeiasComponent } from './modules/views/aplicacao/components/lista-ideias/lista-ideias.component';
import { RegrasComunidadeComponent } from './modules/views/aplicacao/pages/regras-comunidade/regras-comunidade.component';
import { SegurancaPoliticaComponent } from './modules/views/aplicacao/pages/seguranca-politica/seguranca-politica.component';
import { PoliticaCookiesComponent } from './modules/views/aplicacao/pages/politica-cookies/politica-cookies.component';
import { DicasSegurancaComponent } from './modules/views/aplicacao/pages/dicas-seguranca/dicas-seguranca.component';
import { PaymentComponent } from './modules/user/components/payment/payment.component';
import { SetupPropostasComponent } from './modules/views/setup-propostas/setup-propostas.component';
import { SetupEnviadasComponent } from './modules/views/setup-enviadas/setup-enviadas.component';
import { FinanceiroComponent } from './modules/views/financeiro/financeiro.component';
import { NegociosFechadosComponent } from './modules/views/negocios-fechados/negocios-fechados.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'empresa',
        children: [
            {
                path: 'sobre',
                component: SobreComponent,
                title: 'Sobre Nós | PitchLink'
            },
            {
                path: 'contato',
                component: ContatoComponent,
                title: 'Contato | PitchLink'
            },
            {
                path: 'politicas',
                data: { hide: true },
                component: PoliticasPrivacidadeComponent,
                title: 'Políticas de Privacidade | PitchLink'
            },
            {
                path: 'licenciamento',
                component: LicenciamentoComponent,
                title: 'Licenciamento | PitchLink'
            },
            {
                path: 'termos',
                component: TermosCondicoesComponent,
                data: { hide: true },
                title: 'Termos e Condições | PitchLink'
            },
        ]
    },
    {
        path:'subscription', 
        component: SubscriptionComponent, 
        title: 'Minha assinatura | PitchLink',
    },
    {
        path:'subscription/:parametro', 
        component: PlanosComponent, 
        title: 'Planos | PitchLink',
    },
    {
        path: 'perfil',
        component: PerfilComponent,
        data: { hideNav: true },
        title: 'Meu Perfil | PitchLink'
    },
    {
        path: 'app',
        component: LayoutComponent,
        canActivate: [authGuardSuccessGuard],
        children: [
            {
                path:'recs', 
                component: SwingComponent
            },
            {
                title: 'Propostas Recebidas | PitchLink',
                path:'proposta-recebidas', 
                component: SetupPropostasComponent
            },
            {
                title: 'Propostas Enviadas | PitchLink',
                path:'proposta-enviadas', 
                component: SetupEnviadasComponent
            },
            {
                title: 'Planos | PitchLink',
                path:'payment', 
                component: PaymentComponent
            },
            {
                title: 'Financeiro | PitchLink',
                path:'financeiro', 
                component: FinanceiroComponent
            },
            {
                title: 'Negócios Fechados | PitchLink',
                path:'negocios-fechados', 
                component: NegociosFechadosComponent
            },
            {
                path:'perfil', 
                component: PerfilComponent, 
                data: { hideNav: false },
                title: 'Meu Perfil | PitchLink'
            },
            {
                path:'mensagens', 
                component: MensagensComponent, 
                title: 'Mensagens | PitchLink'
            },
            {
                path:'listar_ideias', 
                component: ListaIdeiasComponent, 
                title: 'Lista de Ideias | PitchLink'
            },
            {
                path:'subscription', 
                component: SubscriptionComponent, 
                title: 'Minha assinatura | PitchLink',
            },
            {
                path:'subscription/:parametro', 
                component: PlanosComponent, 
                title: 'Mensagens | PitchLink',
            },
            {
                path:'regras-comunidade', 
                component: RegrasComunidadeComponent, 
                title: 'Regras da Comunidade | PitchLink',
            },
            {
                path:'seguranca-politica', 
                component: SegurancaPoliticaComponent, 
                title: 'Regras da Comunidade | PitchLink',
            },
            {
                path:'dicas-seguranca', 
                component: DicasSegurancaComponent, 
                title: 'Regras da Comunidade | PitchLink',
            },
            {
                path:'politica-cookies', 
                component: PoliticaCookiesComponent, 
                title: 'Regras da Comunidade | PitchLink',
            },
            {
                path: 'politicas-privacidade',
                component: PoliticasPrivacidadeComponent,
                data: { hide: false },
                title: 'Políticas de Privacidade | PitchLink'
            },
            {
                path: 'termos-servico',
                component: TermosCondicoesComponent,
                data: { hide: false },
                title: 'Termos e Condições | PitchLink'
            },
            { 
                path: 'ideia', 
                component: IdeiaComponent
            },
        ]
    },
        
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
