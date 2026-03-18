/**
 * Skenario pengujian E2E alur login:
 * - harus menampilkan halaman login
 * - harus gagal login dengan kredensial salah
 * - harus berhasil login dengan kredensial benar
 * - harus bisa logout setelah login
 */

describe('Alur Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('harus menampilkan halaman login dengan form', () => {
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button').contains('Login').should('be.visible');
  });

  it('harus gagal login dengan kredensial salah', () => {
    cy.get('input[placeholder="Email"]').type('salah@email.com');
    cy.get('input[placeholder="Password"]').type('passwordsalah');
    cy.get('input[placeholder="Password"]').type('{enter}');
    cy.get('.auth-error', { timeout: 15000 }).should('be.visible');
  });

  it('harus berhasil login dan redirect ke halaman utama', () => {
    cy.get('input[placeholder="Email"]').type('nawaw@gmail.com');
    cy.get('input[placeholder="Password"]').type('nawaw123');
    cy.get('input[placeholder="Password"]').type('{enter}');
    cy.url({ timeout: 15000 }).should('eq', 'http://localhost:5173/');
  });

  it('harus bisa logout setelah login', () => {
    cy.get('input[placeholder="Email"]').type('nawaw@gmail.com');
    cy.get('input[placeholder="Password"]').type('nawaw123');
    cy.get('input[placeholder="Password"]').type('{enter}');
    cy.url({ timeout: 15000 }).should('eq', 'http://localhost:5173/');
    cy.get('button').contains('Logout').click();
    cy.url().should('include', '/');
  });
});
