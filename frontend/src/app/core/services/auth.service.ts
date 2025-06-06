import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { api, socialAccounts } from '../../../providers';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { UserProfile, ProfileFormData } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.getBaseUrl();
  private readonly httpOptions = { withCredentials: true };
  private token = '';
  needsProfileCompletion = false;

  setNeedsProfileCompletion(value: boolean): void {
    this.needsProfileCompletion = value;
  }

  getNeedsProfileCompletion(): boolean {
    return this.needsProfileCompletion;
  }
  
  loginWithGoogle(): void {
    window.location.href = `${this.baseUrl}${socialAccounts.google}`;
  }

  loginWithLinkedin(): void {
    window.location.href = `${this.baseUrl}${socialAccounts.linkedin}`;
  }

  loadTokenFromUrl(): void {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('jwt_token', token);
      this.token = token;
    }
  }

  checkAuth(): Observable<any> {
    const token = this.token || localStorage.getItem('jwt_token');

    if (!token) {
      return of({ status: 401, message: 'Token não encontrado' });
    }

    return this.http.get(
      `${this.baseUrl}${api.check}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).pipe(
      map(response => ({ status: 200, data: response })),
      catchError(error => of({ status: error.status, message: error.message }))
    );
  }

  logout(): Observable<any> {
    localStorage.removeItem('jwt_token');
    this.token = '';
    return this.http.get(
      `${this.baseUrl}${api.logout}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.baseUrl}${api.DTO}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  DTO(): Observable<any> {
    return this.getUserProfile();
  }

  saveFullProfile(profileData: ProfileFormData): Observable<any> {
    return this.http.post(
      `${this.baseUrl}${api.save}`,
      profileData,
      {
        ...this.httpOptions,
        observe: 'response' as const
      }
    ).pipe(
      map((response: any) => {
        if (response.token) {
          localStorage.setItem('jwt_token', response.token);
          this.token = response.token;
        }
        return response;
      }),
      catchError(this.handleHttpError)
    );
  }

  image(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.image}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error(error);
    return of(error);
  }

  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    console.error(error);
    return throwError(() => error);
  }

  setToken(token: string): void {
    this.token = token;
  }

  postCreateInnovation(innovationData: any): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.post(`${this.baseUrl}${api.postCreateInnovation}`, innovationData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getUser(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.getUser}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getInnovation(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.getInnovation}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getInnovationDetails(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.getInnovationDetails}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getNegociacao(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.getNegociacao}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  postCreateProposalInnovation(payload: any): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.post(`${this.baseUrl}${api.postCreateProposalInnovation}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getProposalInnovations(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.getProposalInnovations}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  postSearchProposalInnovations(payload: any): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.post(`${this.baseUrl}${api.postSearchProposalInnovations}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  userProposalsInnovationsRequests(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.userProposalsInnovationsRequests}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  userProposalsInnovationsProposals(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.userProposalsInnovationsProposals}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getMensagens(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.getMensagens}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  postEnterNegotiationRoom(payload: { id: string }): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.post(`${this.baseUrl}${api.postEnterNegotiationRoom}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getAllRooms(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.getAllRooms}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  postSearchMensagensRelated(payload: { id: string }): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.post(`${this.baseUrl}${api.postSearchMensagensRelated}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  postSearchInnovation(payload: { id: Number }): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.post(`${this.baseUrl}${api.postSearchInnovation}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  postAcceptProposalInnovation(id: number): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    const payload = { id };
    return this.http.post(`${this.baseUrl}${api.postAcceptProposalInnovation}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  postAcceptProposalInnovationProposal(id: number): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    const payload = { id };
    return this.http.post(`${this.baseUrl}${api.postAcceptProposalInnovationProposal}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  postRejectProposalInnovation(id: number): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    const payload = { id };
    return this.http.post(`${this.baseUrl}${api.postRejectProposalInnovation}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  createRoom(payload: any): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.post(`${this.baseUrl}${api.createRoom}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  getUserInnovations(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.getUserInnovations}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  postUpdateInnovationDetails(formData: FormData): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.post(`${this.baseUrl}${api.postUpdateInnovationDetails}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  getInnovationImages(innovationId: number): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.getInnovationimages}/${innovationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getPaymentPlans(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.getPaymentPlans}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  createPaymentIntent(plan: string): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    const payload = { plan };
    return this.http.post(`${this.baseUrl}${api.postCreatePaymentIntent}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  }

  confirmPayment(plan: string, paymentIntentId: string): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    const payload = { 
      plan: plan, 
      payment_method_id: paymentIntentId
    };
    return this.http.post(`${this.baseUrl}${api.postConfirmPayment}`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
  }


  createCreditPaymentIntent(amount: string): Observable<any> {
  const token = localStorage.getItem('jwt_token');
  const payload = { amount: parseFloat(amount) };
  return this.http.post(`${this.baseUrl}${api.createCreditPaymentIntent}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
}

postConfirmCreditPayment(plan: string, payment_intent_id: string): Observable<any> {
  const token = localStorage.getItem('jwt_token');
  const payload = { 
    payment_intent_id: payment_intent_id
  };
  return this.http.post(`${this.baseUrl}${api.postConfirmCreditPayment}`, payload, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
}

  proposalOpenSponsored(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.proposalOpenSponsored}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  proposalCanceledSponsored(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.proposalCanceledSponsored}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  proposalClosedSponsored(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.proposalClosedSponsored}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  
  proposalRejectedSponsored(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.proposalRejectedSponsored}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getUserBalance(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.getUserBalance}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getCreditHistory(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.getCreditHistory}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  cancelInovation(innovation_id: number): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    const payload = { id: innovation_id.toString() };
    return this.http.post(`${this.baseUrl}${api.cancelInovation}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  proposalOpenSponsoredInvestor(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.proposalOpenSponsoredInvestor}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  proposalCanceledSponsoredInvestor(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.proposalCanceledSponsoredInvestor}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  proposalClosedSponsoredInvestor(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.proposalClosedSponsoredInvestor}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  
  proposalRejectedSponsoredInvestor(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.proposalRejectedSponsoredInvestor}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  proposal(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}${api.proposal}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

}