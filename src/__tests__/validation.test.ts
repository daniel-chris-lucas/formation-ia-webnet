import { describe, it, expect } from 'vitest';
import { validateTitle, validateDescription, validateComment, validateDueDate } from '../services/taskService.js';

describe('validateTitle', () => {
  it('refuse un titre vide', () => {
    expect(validateTitle('')).toBeTruthy();
  });
  it('refuse un titre de moins de 3 caractères', () => {
    expect(validateTitle('ab')).toBeTruthy();
  });
  it('refuse un titre de plus de 100 caractères', () => {
    expect(validateTitle('x'.repeat(101))).toBeTruthy();
  });
  it('accepte un titre valide', () => {
    expect(validateTitle('Ma tâche')).toBeNull();
  });
  it('accepte un titre de exactement 3 caractères', () => {
    expect(validateTitle('abc')).toBeNull();
  });
  it('accepte un titre de exactement 100 caractères', () => {
    expect(validateTitle('x'.repeat(100))).toBeNull();
  });
});

describe('validateDescription', () => {
  it('accepte une description vide', () => {
    expect(validateDescription('')).toBeNull();
  });
  it('refuse une description de plus de 500 caractères', () => {
    expect(validateDescription('x'.repeat(501))).toBeTruthy();
  });
  it('accepte une description de 500 caractères', () => {
    expect(validateDescription('x'.repeat(500))).toBeNull();
  });
});

describe('validateComment', () => {
  it('refuse un commentaire vide', () => {
    expect(validateComment('')).toBeTruthy();
  });
  it('refuse un commentaire de plus de 1000 caractères', () => {
    expect(validateComment('x'.repeat(1001))).toBeTruthy();
  });
  it('accepte un commentaire valide', () => {
    expect(validateComment('Super travail !')).toBeNull();
  });
});

describe('validateDueDate', () => {
  it('refuse une date vide', () => {
    expect(validateDueDate('', true)).toBeTruthy();
  });
  it('accepte une date future à la création', () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    expect(validateDueDate(future.toISOString().split('T')[0], true)).toBeNull();
  });
  it('accepte une date passée à l\'édition', () => {
    expect(validateDueDate('2020-01-01', false)).toBeNull();
  });
});
