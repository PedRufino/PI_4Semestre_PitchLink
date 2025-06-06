import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

interface ProposalData {
  id: number;
  created: string;
  modified: string;
  investor_id: number;
  investor_name: string;
  investor_img_url: string | null;
  sponsored_id: number;
  sponsored_name: string;
  sponsored_img_url: string | null;
  innovation_id: number;
  innovation_name: string;
  descricao: string;
  investimento_minimo: number;
  porcentagem_cedida: number;
  accepted: boolean;
  status: string;
  user_role: 'investor' | 'sponsored';
  paid: boolean;
}

@Component({
  selector: 'app-negocios-fechados',
  imports: [CommonModule],
  templateUrl: './negocios-fechados.component.html',
  styleUrl: './negocios-fechados.component.css'
})
export class NegociosFechadosComponent implements OnInit {
  private authService = inject(AuthService);
  
  proposals: ProposalData[] = [];
  filteredProposals: ProposalData[] = [];
  loading = true;
  error = '';
  selectedProposal: ProposalData | null = null;
  
  statusFilter = 'all';
  sortBy = 'date';
  
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;

  ngOnInit(): void {
    this.loadProposals();
  }

  loadProposals(): void {
    this.loading = true;
    this.authService.proposal().subscribe({
      next: (response) => {
        if (response.data) {
          this.proposals = response.data;
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar propostas:', error);
        this.error = 'Erro ao carregar negócios fechados';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.proposals];

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === this.statusFilter);
    }

    switch (this.sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        break;
      case 'value':
        filtered.sort((a, b) => b.investimento_minimo - a.investimento_minimo);
        break;
      case 'roi':
        filtered.sort((a, b) => b.porcentagem_cedida - a.porcentagem_cedida);
        break;
      case 'paid':
        filtered.sort((a, b) => Number(a.paid) - Number(b.paid));
        break;
    }

    this.filteredProposals = filtered;
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProposals.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  getPaginatedProposals(): ProposalData[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProposals.slice(startIndex, endIndex);
  }

  onStatusFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.statusFilter = target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value;
    this.applyFilters();
  }

  openModal(proposal: ProposalData): void {
    this.selectedProposal = proposal;
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(): void {
    this.selectedProposal = null;
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      case 'closed':
        return 'blue';
      default:
        return 'gray';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'accepted':
        return 'Aceito';
      case 'rejected':
        return 'Rejeitado';
      case 'closed':
        return 'Fechado';
      default:
        return 'Desconhecido';
    }
  }

  getPaymentStatus(proposal: ProposalData): string {
    return proposal.paid ? 'Pago' : 'Pendente';
  }

  getPaymentStatusColor(proposal: ProposalData): string {
    return proposal.paid ? 'text-green-400' : 'text-orange-400';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR');
  }

  getParticipantName(proposal: ProposalData): string {
    return proposal.user_role === 'investor' 
      ? proposal.sponsored_name 
      : proposal.investor_name;
  }

  getParticipantRole(proposal: ProposalData): string {
    return proposal.user_role === 'investor' 
      ? 'Criador da Ideia' 
      : 'Investidor';
  }

  getCurrentUserRole(proposal: ProposalData): string {
    return proposal.user_role === 'investor' 
      ? 'Investidor' 
      : 'Criador da Ideia';
  }

  downloadContract(contractType: string): void {
    console.log(`Download do contrato: ${contractType}`);
    
    const contractUrls = {
      'termo-investimento': '/assets/pdf/termo-investimento-modelo.pdf',
      'contrato-participacao': '/assets/pdf/contrato-participacao-modelo.pdf'
    };
    
    const url = contractUrls[contractType as keyof typeof contractUrls];
    if (url) {
      alert(`Download iniciado: ${contractType}.pdf\n\nEste é um modelo que você deve preencher e enviar de volta.`);
      
      
    }
  }

  generateReport(): void {
    console.log('Gerando relatório...');
    alert('Funcionalidade de relatório será implementada em breve.');
  }

  shareProposal(): void {
    if (!this.selectedProposal) return;
    
    console.log('Compartilhando proposta:', this.selectedProposal.id);
    
    // Implementar lógica de compartilhamento
    if (navigator.share) {
      navigator.share({
        title: `Negócio: ${this.selectedProposal.innovation_name}`,
        text: `Confira este negócio fechado: ${this.selectedProposal.innovation_name}`,
        url: window.location.href
      }).catch(err => console.log('Erro ao compartilhar:', err));
    } else {
      // Fallback para navegadores que não suportam Web Share API
      const shareText = `Negócio: ${this.selectedProposal.innovation_name}\nValor: ${this.formatCurrency(this.selectedProposal.investimento_minimo)}\nParticipação: ${this.selectedProposal.porcentagem_cedida}%`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Informações copiadas para a área de transferência!');
      });
    }
  }

  // Novo método para enviar documentos preenchidos
  uploadDocument(): void {
    if (!this.selectedProposal) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.multiple = false; // Apenas um arquivo por vez
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.processUploadedDocument(file);
      }
    };
    
    input.click();
  }

  private processUploadedDocument(file: File): void {
    if (!this.selectedProposal) return;
    
    console.log('Processando upload do documento:', file.name);
    console.log('Tamanho do arquivo:', file.size, 'bytes');
    console.log('Tipo:', file.type);
    
    // Validar se é PDF
    if (file.type !== 'application/pdf') {
      alert('Por favor, envie apenas arquivos PDF.');
      return;
    }
    
    // Validar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Arquivo muito grande. Máximo permitido: 10MB');
      return;
    }
    
    this.simulateUpload(file);
  }

  private simulateUpload(file: File): void {
    if (!this.selectedProposal) return;
    
    alert(`Enviando documento: ${file.name}\n\nO documento será analisado pela nossa equipe.`);
    
    
    
    console.log('Upload simulado concluído para proposta:', this.selectedProposal.id);
  }

  shouldShowPayButton(proposal: ProposalData): boolean {
    return !proposal.paid && proposal.user_role === 'investor';
  }

  getProfileImageUrl(imageUrl: string | null, name: string): string {
    if (imageUrl) {
      return imageUrl;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
  }

  getUserInitials(name: string): string {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      const altText = target.alt || 'User';
      target.src = this.getProfileImageUrl(null, altText);
    }
  }
}