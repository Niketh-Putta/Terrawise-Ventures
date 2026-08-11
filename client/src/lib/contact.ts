/** Canonical customer contact numbers for Terrawise / Property Path. */
export const CONTACT_PHONES = [
  {
    display: "+91 6364467941",
    tel: "+916364467941",
    digits: "916364467941",
  },
  {
    display: "+91 63644 67942",
    tel: "+916364467942",
    digits: "916364467942",
  },
] as const;

export const PRIMARY_PHONE = CONTACT_PHONES[0];

export const CONTACT_PHONE_DISPLAYS = CONTACT_PHONES.map((phone) => phone.display);

export const WHATSAPP_URL = `https://wa.me/${PRIMARY_PHONE.digits}`;

export function callPrimaryPhone() {
  window.location.href = `tel:${PRIMARY_PHONE.tel}`;
}

export function openWhatsApp() {
  window.open(WHATSAPP_URL, "_blank");
}
