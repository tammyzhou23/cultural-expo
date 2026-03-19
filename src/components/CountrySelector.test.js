import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CountrySelector from './CountrySelector';

// Mock react-intersection-observer
jest.mock('react-intersection-observer', () => ({
  useInView: () => [jest.fn(), true]
}));

// Mock VirtualizedCountryList
jest.mock('./VirtualizedCountryList', () => {
  return function MockVirtualizedCountryList({ countries, onCountrySelect, exploredCountries }) {
    return (
      <div data-testid="country-list">
        {countries.map(country => (
          <div
            key={country.id}
            data-testid={`country-${country.id}`}
            onClick={() => onCountrySelect(country)}
            role="button"
            tabIndex={0}
          >
            <span>{country.flag}</span>
            <span>{country.name}</span>
            <span>{country.region}</span>
            <span>{country.capital}</span>
          </div>
        ))}
      </div>
    );
  };
});

// Mock countrySelector utils
const mockCountries = [
  { id: 'japan', name: 'Japan', flag: '🇯🇵', region: 'Asia', capital: 'Tokyo' },
  { id: 'italy', name: 'Italy', flag: '🇮🇹', region: 'Europe', capital: 'Rome' },
  { id: 'mexico', name: 'Mexico', flag: '🇲🇽', region: 'North America', capital: 'Mexico City' },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', region: 'Oceania', capital: 'Canberra' }
];

jest.mock('../utils/countrySelector', () => ({
  getAllCountries: () => mockCountries,
  getRegionStats: () => ({ 'Asia': 1, 'Europe': 1, 'North America': 1, 'Oceania': 1 })
}));

jest.mock('../utils/experienceManager', () => ({
  getAllExperiences: () => []
}));

describe('CountrySelector Component', () => {
  const mockOnCountrySelect = jest.fn();
  const mockOnRandomSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('component can be imported', () => {
    expect(CountrySelector).toBeDefined();
    expect(typeof CountrySelector).toBe('function');
  });

  test('renders without crashing', () => {
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} onRandomSelect={mockOnRandomSelect} />);
    expect(screen.getByText('Filter by Region')).toBeInTheDocument();
  });

  test('shows all countries initially', () => {
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} onRandomSelect={mockOnRandomSelect} />);

    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('Italy')).toBeInTheDocument();
    expect(screen.getByText('Mexico')).toBeInTheDocument();
    expect(screen.getByText('Australia')).toBeInTheDocument();
  });

  test('displays region filter tabs', () => {
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} onRandomSelect={mockOnRandomSelect} />);

    expect(screen.getByRole('tab', { name: /Filter by All region/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Filter by Asia region/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Filter by Europe region/ })).toBeInTheDocument();
  });

  test('filters countries by region', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} onRandomSelect={mockOnRandomSelect} />);

    // Click Asia filter
    const asiaTab = screen.getByRole('tab', { name: /Filter by Asia region/ });
    await user.click(asiaTab);

    // Should only show Japan
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.queryByText('Italy')).not.toBeInTheDocument();
    expect(screen.queryByText('Mexico')).not.toBeInTheDocument();
  });

  test('shows all countries when All filter is selected', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} onRandomSelect={mockOnRandomSelect} />);

    // Click Asia first
    const asiaTab = screen.getByRole('tab', { name: /Filter by Asia region/ });
    await user.click(asiaTab);

    // Then click All
    const allTab = screen.getByRole('tab', { name: /Filter by All region/ });
    await user.click(allTab);

    // Should show all countries
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('Italy')).toBeInTheDocument();
    expect(screen.getByText('Mexico')).toBeInTheDocument();
    expect(screen.getByText('Australia')).toBeInTheDocument();
  });

  test('calls onCountrySelect when country is clicked', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} onRandomSelect={mockOnRandomSelect} />);

    const japanCard = screen.getByTestId('country-japan');
    await user.click(japanCard);

    expect(mockOnCountrySelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'japan', name: 'Japan' })
    );
  });

  test('displays Surprise Me button', () => {
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} onRandomSelect={mockOnRandomSelect} />);

    expect(screen.getByText('Surprise Me')).toBeInTheDocument();
  });

  test('calls onRandomSelect when Surprise Me is clicked', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} onRandomSelect={mockOnRandomSelect} />);

    const surpriseButton = screen.getByText('Surprise Me').closest('button');
    await user.click(surpriseButton);

    expect(mockOnRandomSelect).toHaveBeenCalled();
  });

  test('displays country flags', () => {
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} onRandomSelect={mockOnRandomSelect} />);

    expect(screen.getByText('🇯🇵')).toBeInTheDocument();
    expect(screen.getByText('🇮🇹')).toBeInTheDocument();
    expect(screen.getByText('🇲🇽')).toBeInTheDocument();
    expect(screen.getByText('🇦🇺')).toBeInTheDocument();
  });

  test('accepts countries prop override', () => {
    const customCountries = [
      { id: 'france', name: 'France', flag: '🇫🇷', region: 'Europe', capital: 'Paris' }
    ];

    render(
      <CountrySelector
        onCountrySelect={mockOnCountrySelect}
        onRandomSelect={mockOnRandomSelect}
        countries={customCountries}
      />
    );

    expect(screen.getByText('France')).toBeInTheDocument();
  });
});
