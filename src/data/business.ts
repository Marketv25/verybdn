// Datos del responsable del sitio. Se usan en las páginas legales y en los footers.
// La Ley 1581 de 2012 (Decreto 1377 de 2013, art. 13) y la Ley 1480 de 2011 (art. 50)
// exigen publicar nombre o razón social, identificación, dirección, correo y teléfono.
// Los campos vacíos no se muestran, pero el build avisa en consola hasta completarlos.
export const business = {
  brand: 'verybdn',
  lodgeName: 'Entre Río y Fuego',
  ownerDisplayName: 'Honey',
  legalName: '',      // PENDIENTE: nombre completo o razón social del responsable
  idNumber: '',       // PENDIENTE: cédula o NIT
  address: '',        // PENDIENTE: dirección física (vereda / predio)
  city: 'Minca, Santa Marta, Magdalena, Colombia',
  email: '',          // PENDIENTE: correo para solicitudes de datos personales
  whatsapp: '+57 311 714 7765',
  whatsappLink: 'https://wa.me/573117147765',
  rnt: '',            // PENDIENTE: número de Registro Nacional de Turismo del lodge
  site: 'https://verybdn.com',
  lastUpdated: { es: '29 de septiembre de 2026', en: 'September 29, 2026' },
};

const missing = (['legalName', 'idNumber', 'address', 'email', 'rnt'] as const).filter(k => !business[k]);
if (missing.length) {
  console.warn(`[business.ts] Faltan datos legales del negocio: ${missing.join(', ')}`);
}
