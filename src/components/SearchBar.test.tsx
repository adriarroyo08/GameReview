import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from './SearchBar';
import React from 'react';

describe('SearchBar', () => {
  it('renders correctly', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByPlaceholderText('Search for a game...')).toBeDefined();
    expect(screen.getByRole('button', { name: /search/i })).toBeDefined();
  });

  it('allows input', () => {
    render(<SearchBar onSearch={() => {}} />);
    const input = screen.getByPlaceholderText('Search for a game...');
    fireEvent.change(input, { target: { value: 'Batman' } });
    expect((input as HTMLInputElement).value).toBe('Batman');
  });

  it('calls onSearch when form is submitted', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    const input = screen.getByPlaceholderText('Search for a game...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'Batman' } });
    fireEvent.click(button);

    expect(handleSearch).toHaveBeenCalledWith('Batman');
  });

  it('does not call onSearch if input is empty', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.click(button);

    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('is disabled when loading', () => {
    render(<SearchBar onSearch={() => {}} isLoading={true} />);
    expect(screen.getByPlaceholderText('Search for a game...')).toBeDisabled();
    expect(screen.getByRole('button', { name: /searching/i })).toBeDisabled();
  });
});
