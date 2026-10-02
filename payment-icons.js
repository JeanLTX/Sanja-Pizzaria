const PAYMENT_ICONS = {
  pix: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><path d="M14 14h3v3h-3z"></path><path d="M18 18h3v3h-3z"></path><path d="M18 14h3"></path><path d="M14 18v3"></path></svg>',
  cash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2.5"></circle><path d="M6 10h.01"></path><path d="M18 14h.01"></path></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"></rect><path d="M2 10h20"></path><path d="M6 15h4"></path></svg>'
};

export function hydratePaymentIcons(root) {
  root.querySelector('.payment-icon-pix')?.insertAdjacentHTML('afterbegin', PAYMENT_ICONS.pix);
  root.querySelector('.payment-icon-cash')?.insertAdjacentHTML('afterbegin', PAYMENT_ICONS.cash);
  root.querySelector('.payment-icon-card')?.insertAdjacentHTML('afterbegin', PAYMENT_ICONS.card);
}
