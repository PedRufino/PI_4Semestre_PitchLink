import { createComponent, createNgModuleRef } from "@angular/core"

const prefix = '/api'

export const api = {

    save: prefix + '/full-profile',
    check: prefix + '/check-auth',
    DTO : prefix + '/obter-perfil-social-usuario',
    logout: prefix + '/logout',
    image : prefix + '/get-image',
    postCreateInnovation: prefix + '/post-create-innovation', 
    getInnovation: prefix + '/get-innovation',
    getInnovationDetails: prefix + '/get-innovation-details',
    postSearchInnovation: prefix + '/post-search-innovation',
    getUser: prefix + '/get-perfil',
    createRoom: prefix + '/create-room',
    sendMessage: prefix + '/send-message',
    getNegociacao: prefix + '/get-negotiation-room',
    getMensagens: prefix + '/get-messages',
    postCreateProposalInnovation: prefix+ "/post-create-proposal-innovation",
    getProposalInnovations: prefix + '/get-proposal-innovations',
    postSearchProposalInnovations: prefix + '/post-search-proposal-innovations',
    userProposalsInnovationsRequests : prefix + '/get-user-proposals-innovations-requests',
    userProposalsInnovationsProposals : prefix + '/get-user-proposals-innovations-proposals',
    postEnterNegotiationRoom: prefix + '/post-enter-negotiation-room',
    getAllRooms: prefix+'/get-all-rooms',
    postSearchMensagensRelated :prefix+'/post-search-mensagens-related',
    postAcceptProposalInnovation : prefix + "/post-accept-proposal-innovation",
    postAcceptProposalInnovationProposal : prefix + "/post-accept-proposal-innovation-proposal",
    postRejectProposalInnovation : prefix + "/post-reject-proposal-innovation",
    getUserInnovations: prefix + "/get-user-innovations",
    postUpdateInnovationDetails: prefix + "/post-update-innovation-details",
    getInnovationimages: prefix + '/get-innovation-images',
    getPaymentPlans: prefix + '/get-payment-plans',
    postCreatePaymentIntent: prefix + '/post-create-payment-intent',
    postConfirmPayment: prefix + '/post-confirm-payment',
    getPaymentHistory: prefix + '/get-payment-history',
    stripeWebhook: prefix + '/stripe-webhook',
    proposalOpenSponsored: prefix + '/proposal-open-sponsored',
    proposalCanceledSponsored: prefix + '/proposal-canceled-sponsored',
    proposalClosedSponsored: prefix + '/proposal-closed-sponsored',
    proposalRejectedSponsored: prefix + '/proposal-rejected-sponsored',
    createCreditPaymentIntent: prefix +'/post-create-credit-payment-intent',
    postConfirmCreditPayment : prefix + '/post-confirm-credit-payment',
    getUserBalance : prefix + '/get-user-balance',
    getCreditHistory : prefix + '/get-credit-history',
    cancelInovation: prefix + '/cancel-innovation',
    proposalOpenSponsoredInvestor: prefix + '/proposal-open-sponsored-investor',
    proposalCanceledSponsoredInvestor: prefix + '/proposal-canceled-sponsored-investor',
    proposalClosedSponsoredInvestor: prefix + '/proposal-closed-sponsored-investor',
    proposalRejectedSponsoredInvestor: prefix + '/proposal-rejected-sponsored-investor',
    proposal: prefix + '/proposal',
    getProposalCompleted: prefix + '',
}

export const socialAccounts = {

    google: '/accounts/google/login/',
    linkedin: '/accounts/oidc/linkedin-server/login/?process=login'
    
}