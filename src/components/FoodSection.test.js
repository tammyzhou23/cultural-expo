import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FoodSection from './FoodSection';

// Mock the food database
jest.mock('../data/authenticFoodDatabase.json', () => ({
  dishes: {
    'japan': [
      {
        name: 'Sushi',
        type: 'main',
        description: 'Vinegared rice with raw fish, vegetables, or other ingredients',
        difficulty: 'Hard'
      },
      {
        name: 'Ramen',
        type: 'main',
        description: 'Traditional noodle soup with rich broth, often with pork, eggs, and vegetables',
        difficulty: 'Medium'
      }
    ],
    'italy': [
      {
        name: 'Risotto alla Milanese',
        type: 'main',
        description: 'Creamy saffron risotto with bone marrow and parmesan',
        difficulty: 'Medium'
      }
    ]
  }
}));

describe('FoodSection Component', () => {
  const mockCountry = {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    region: 'Asia'
  };

  test('component can be imported', () => {
    expect(FoodSection).toBeDefined();
    expect(typeof FoodSection).toBe('function');
  });

  test('renders without crashing', () => {
    render(<FoodSection selectedCountry={mockCountry} />);
    expect(screen.getByText('Traditional Cuisine')).toBeInTheDocument();
  });

  test('displays country-specific dishes', () => {
    render(<FoodSection selectedCountry={mockCountry} />);

    expect(screen.getByText('Sushi')).toBeInTheDocument();
    expect(screen.getByText('Ramen')).toBeInTheDocument();
    expect(screen.getByText('Vinegared rice with raw fish, vegetables, or other ingredients')).toBeInTheDocument();
    expect(screen.getByText('Traditional noodle soup with rich broth, often with pork, eggs, and vegetables')).toBeInTheDocument();
  });

  test('shows dish emojis', () => {
    render(<FoodSection selectedCountry={mockCountry} />);

    // Each dish card has a 🍽️ emoji
    const emojis = screen.getAllByText('🍽️');
    expect(emojis.length).toBeGreaterThanOrEqual(1);
  });

  test('expands recipe details', async () => {
    const user = userEvent.setup();
    render(<FoodSection selectedCountry={mockCountry} />);

    // Click on a dish card to expand
    const dishCard = screen.getByText('Sushi').closest('[role="button"]');
    await user.click(dishCard);

    // Should show expanded content
    expect(screen.getByText('Cultural Story')).toBeInTheDocument();
    expect(screen.getByText('Dish Information')).toBeInTheDocument();
    expect(screen.getByText('Cooking Tips')).toBeInTheDocument();
  });

  test('collapses recipe details', async () => {
    const user = userEvent.setup();
    render(<FoodSection selectedCountry={mockCountry} />);

    // Expand a recipe
    const dishCard = screen.getByText('Sushi').closest('[role="button"]');
    await user.click(dishCard);

    // Should show expanded content
    expect(screen.getByText('Cultural Story')).toBeInTheDocument();

    // Click again to collapse
    await user.click(dishCard);

    // Should hide expanded content
    await waitFor(() => {
      expect(screen.queryByText('Cultural Story')).not.toBeInTheDocument();
    });
  });

  test('handles country with no dishes', () => {
    const countryWithNoDishes = {
      id: 'antarctica',
      name: 'Antarctica',
      flag: '🇦🇶',
      region: 'Antarctica'
    };

    render(<FoodSection selectedCountry={countryWithNoDishes} />);

    expect(screen.getByText('No Dishes Found')).toBeInTheDocument();
    expect(screen.getByText('No dish information available for this country.')).toBeInTheDocument();
  });

  test('maintains dark theme styling', () => {
    render(<FoodSection selectedCountry={mockCountry} />);

    // The dish cards use the 'card' class
    const dishCard = screen.getByText('Sushi').closest('[role="button"]');
    expect(dishCard).toHaveClass('card');
  });

  test('displays proper card layout', () => {
    render(<FoodSection selectedCountry={mockCountry} />);

    // Check that dishes are displayed in a grid layout
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
  });

  test('shows cultural story in expanded view', async () => {
    const user = userEvent.setup();
    render(<FoodSection selectedCountry={mockCountry} />);

    // Click the dish card to expand
    const dishCard = screen.getByText('Sushi').closest('[role="button"]');
    await user.click(dishCard);

    // Should show cultural story
    expect(screen.getByText(/is a beloved traditional dish/)).toBeInTheDocument();
    expect(screen.getByText(/represents the authentic flavors/)).toBeInTheDocument();
  });

  test('shows dish information in expanded view', async () => {
    const user = userEvent.setup();
    render(<FoodSection selectedCountry={mockCountry} />);

    // Click the dish card to expand
    const dishCard = screen.getByText('Sushi').closest('[role="button"]');
    await user.click(dishCard);

    // Should show dish information
    expect(screen.getByText('Dish Information')).toBeInTheDocument();
  });

  test('shows cooking tips in expanded view', async () => {
    const user = userEvent.setup();
    render(<FoodSection selectedCountry={mockCountry} />);

    // Click the dish card to expand
    const dishCard = screen.getByText('Sushi').closest('[role="button"]');
    await user.click(dishCard);

    // Should show cooking tips
    expect(screen.getByText('Cooking Tips')).toBeInTheDocument();
    expect(screen.getByText(/focus on using fresh, local ingredients/)).toBeInTheDocument();
  });

  test('handles multiple countries correctly', () => {
    const italyCountry = {
      id: 'italy',
      name: 'Italy',
      flag: '🇮🇹',
      region: 'Europe'
    };

    render(<FoodSection selectedCountry={italyCountry} />);

    expect(screen.getByText('Risotto alla Milanese')).toBeInTheDocument();
    expect(screen.getByText('Creamy saffron risotto with bone marrow and parmesan')).toBeInTheDocument();
  });

  test('displays proper accessibility features', () => {
    render(<FoodSection selectedCountry={mockCountry} />);

    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Traditional Cuisine')).toBeInTheDocument();
  });

  test('maintains responsive design classes', () => {
    render(<FoodSection selectedCountry={mockCountry} />);

    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');
  });
});
