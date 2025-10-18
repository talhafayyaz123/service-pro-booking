const domains = [
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com',
  'throwawaymail.com',
  'maildrop.cc',
  'temp-mail.org',
  'yopmail.com',
  'getnada.com',
  'dispostable.com',
  'mohmal.com',
  'mytrashmail.com',
  'trashmail.com',
  'tempmailo.com',
  'e4ward.com',
  'emailondeck.com',
  'burnermail.io',
  'fakeinbox.com',
  'spamex.com',
  'inboxbear.com',
  'tempmailaddress.com',
]

export const checkSingleDomainEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase()
  return domains.includes(domain)
}
