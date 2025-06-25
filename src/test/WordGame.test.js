import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import WordGame from '../pages/WordGame';

// Mock fetch pour simuler l'API de dictionnaire
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('valid')) {
      return Promise.resolve({ ok: true });
    }
    return Promise.resolve({ ok: false });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('WordGame', () => {
  test('show 5 empty cases and the keyboard', () => {
    render(<WordGame />);
    const squares = screen.getAllByText('', { selector: '.square' });
    expect(squares).toHaveLength(5);
    expect(screen.getByText('Q')).toBeInTheDocument();
    expect(screen.getByText('ENTER')).toBeInTheDocument();
    expect(screen.getByText('⌫')).toBeInTheDocument();
  });

  test('add letters in the cases by clicking on the keyboard', () => {
    render(<WordGame />);
    fireEvent.click(screen.getByText('A'));
    fireEvent.click(screen.getByText('B'));
    fireEvent.click(screen.getByText('C'));
    const squares = screen.getAllByText(/A|B|C|^$/, { selector: '.square' });
    expect(squares[0]).toHaveTextContent('A');
    expect(squares[1]).toHaveTextContent('B');
    expect(squares[2]).toHaveTextContent('C');
  });

  test('the backspace button deletes the last letter', () => {
    render(<WordGame />);
    fireEvent.click(screen.getByText('A'));
    fireEvent.click(screen.getByText('B'));
    fireEvent.click(screen.getByText('⌫'));
    const squares = screen.getAllByText(/A|^$/, { selector: '.square' });
    expect(squares[0]).toHaveTextContent('A');
    expect(squares[1]).toHaveTextContent('');
  });

  test('the ENTER button validates an existing word (success)', async () => {
    render(<WordGame />);
    fireEvent.click(screen.getByText('V'));
    fireEvent.click(screen.getByText('A'));
    fireEvent.click(screen.getByText('L'));
    fireEvent.click(screen.getByText('I'));
    fireEvent.click(screen.getByText('D'));
    fireEvent.click(screen.getByText('ENTER'));
    await waitFor(() => {
      const squares = screen.getAllByText(/V|A|L|I|D/, { selector: '.square.success' });
      expect(squares).toHaveLength(5);
    });
  });

  test('the ENTER button colors in red if the word is invalid', async () => {
    render(<WordGame />);
    fireEvent.click(screen.getByText('Q'));
    fireEvent.click(screen.getByText('W'));
    fireEvent.click(screen.getByText('E'));
    fireEvent.click(screen.getByText('R'));
    fireEvent.click(screen.getByText('T'));
    fireEvent.click(screen.getByText('ENTER'));
    await waitFor(() => {
      const squares = screen.getAllByText(/Q|W|E|R|T/, { selector: '.square.error' });
      expect(squares).toHaveLength(5);
    });
  });
}); 