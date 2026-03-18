/**
 * Skenario pengujian E2E alur login:
 * - harus menampilkan halaman login
 * - harus menampilkan error ketika login dengan kredensial salah
 * - harus bisa navigasi ke halaman register
 * - harus bisa navigasi ke halaman threads
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

  it('harus menampilkan error ketika login dengan kredensial salah', () => {
    cy.get('input[placeholder="Email"]').type('salah@email.com');
    cy.get('input[placeholder="Password"]').type('passwordsalah');
    cy.get('input[placeholder="Password"]').type('{enter}');
    cy.get('.auth-error', { timeout: 15000 }).should('be.visible');
  });

  it('harus bisa navigasi ke halaman register', () => {
    cy.get('a').contains('Daftar di sini').click();
    cy.url().should('include', '/register');
  });

  it('harus bisa navigasi ke halaman threads dari bottom nav', () => {
    cy.get('a').contains('Threads').click();
    cy.url().should('eq', 'http://localhost:5173/');
  });
});
