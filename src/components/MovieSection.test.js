import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieSection from './MovieSection';

// Mock the movie database
jest.mock('../data/movies.json', () => ({
  "japan": [
    {
      "id": "spirited_away",
      "title": "Spirited Away",
      "year": 2001,
      "genre": ["Animation", "Adventure", "Fantasy"],
      "duration": 125,
      "rating": 8.6,
      "description": "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.",
      "category": "Oscar Winner",
      "director": "Hayao Miyazaki",
      "emoji": "👻",
      "awards": ["Academy Award for Best Animated Feature"],
      "cultural_significance": "Considered one of the greatest animated films ever made, it showcases Japanese animation excellence and traditional folklore."
    },
    {
      "id": "seven_samurai",
      "title": "Seven Samurai",
      "year": 1954,
      "genre": ["Action", "Drama", "Adventure"],
      "duration": 207,
      "rating": 8.6,
      "description": "A poor village under attack by bandits recruits seven unemployed samurai to help them defend themselves.",
      "category": "Classic",
      "director": "Akira Kurosawa",
      "emoji": "⚔️",
      "awards": ["Silver Lion at Venice Film Festival"],
      "cultural_significance": "Revolutionary film that influenced countless action movies and established Kurosawa as a master filmmaker."
    }
  ],
  "italy": [
    {
      "id": "life_is_beautiful",
      "title": "Life Is Beautiful",
      "year": 1997,
      "genre": ["Comedy", "Drama", "Romance"],
      "duration": 116,
      "rating": 8.6,
      "description": "When an open-minded Jewish librarian and his son become victims of the Holocaust, he uses a perfect mixture of will, humor, and imagination to protect his son from the dangers around their camp.",
      "category": "Oscar Winner",
      "director": "Roberto Benigni",
      "emoji": "❤️",
      "awards": ["Academy Award for Best Actor", "Academy Award for Best Foreign Language Film"],
      "cultural_significance": "Unique Holocaust film that combines humor with tragedy, showcasing Italian resilience and creativity."
    }
  ],
  "france": [
    {
      "id": "amelie",
      "title": "Amélie",
      "year": 2001,
      "genre": ["Comedy", "Romance"],
      "duration": 122,
      "rating": 8.3,
      "description": "Amélie, an innocent and naive girl in Paris, with her own sense of justice, decides to help those around her and along the way, discovers love.",
      "category": "Recent Hit",
      "director": "Jean-Pierre Jeunet",
      "emoji": "💚",
      "awards": ["Academy Award nominations for Best Foreign Language Film", "Best Original Screenplay"],
      "cultural_significance": "Whimsical love letter to Paris that captured the world's imagination with its magical realism."
    }
  ]
}));

describe('MovieSection Component', () => {
  const mockCountry = {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    region: 'Asia'
  };

  test('component can be imported', () => {
    expect(MovieSection).toBeDefined();
    expect(typeof MovieSection).toBe('function');
  });

  test('renders without crashing', () => {
    render(<MovieSection selectedCountry={mockCountry} />);
    expect(screen.getByText('Cinema & Films')).toBeInTheDocument();
  });

  test('displays country-specific movies', () => {
    render(<MovieSection selectedCountry={mockCountry} />);

    expect(screen.getByText('Spirited Away')).toBeInTheDocument();
    expect(screen.getByText('Seven Samurai')).toBeInTheDocument();
    // Director is rendered inline with year and duration
    expect(screen.getByText(/Hayao Miyazaki/)).toBeInTheDocument();
    expect(screen.getByText(/Akira Kurosawa/)).toBeInTheDocument();
  });

  test('shows movie emojis', () => {
    render(<MovieSection selectedCountry={mockCountry} />);

    expect(screen.getByText('👻')).toBeInTheDocument();
    expect(screen.getByText('⚔️')).toBeInTheDocument();
  });

  test('expands movie details', async () => {
    const user = userEvent.setup();
    render(<MovieSection selectedCountry={mockCountry} />);

    // Click on a movie to expand
    const movieCard = screen.getByText('Spirited Away').closest('[role="button"]');
    await user.click(movieCard);

    // Should show expanded content
    expect(screen.getByText('Plot Summary')).toBeInTheDocument();
    expect(screen.getByText('Cultural Significance')).toBeInTheDocument();
  });

  test('collapses movie details', async () => {
    const user = userEvent.setup();
    render(<MovieSection selectedCountry={mockCountry} />);

    // Expand a movie
    const movieCard = screen.getByText('Spirited Away').closest('[role="button"]');
    await user.click(movieCard);

    // Should show expanded content
    expect(screen.getByText('Plot Summary')).toBeInTheDocument();

    // Click again to collapse
    await user.click(movieCard);

    // Should hide expanded content
    await waitFor(() => {
      expect(screen.queryByText('Plot Summary')).not.toBeInTheDocument();
    });
  });

  test('handles country with no movies', () => {
    const countryWithNoMovies = {
      id: 'antarctica',
      name: 'Antarctica',
      flag: '🇦🇶',
      region: 'Antarctica'
    };

    render(<MovieSection selectedCountry={countryWithNoMovies} />);

    expect(screen.getByText('No movie information available for this country.')).toBeInTheDocument();
  });

  test('maintains dark theme styling', () => {
    render(<MovieSection selectedCountry={mockCountry} />);

    // Movie cards use the 'card' class
    const movieCard = screen.getByText('Spirited Away').closest('[role="button"]');
    expect(movieCard).toHaveClass('card');
  });

  test('displays proper card layout', () => {
    render(<MovieSection selectedCountry={mockCountry} />);

    // Check that movies are displayed in a grid layout
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
  });

  test('shows plot summary in expanded view', async () => {
    const user = userEvent.setup();
    render(<MovieSection selectedCountry={mockCountry} />);

    // Expand a movie
    const movieCard = screen.getByText('Spirited Away').closest('[role="button"]');
    await user.click(movieCard);

    // Should show plot summary
    expect(screen.getByText('Plot Summary')).toBeInTheDocument();
    expect(screen.getByText(/During her family's move to the suburbs/)).toBeInTheDocument();
  });

  test('shows cultural significance in expanded view', async () => {
    const user = userEvent.setup();
    render(<MovieSection selectedCountry={mockCountry} />);

    // Expand a movie
    const movieCard = screen.getByText('Spirited Away').closest('[role="button"]');
    await user.click(movieCard);

    // Should show cultural significance from mock data
    expect(screen.getByText('Cultural Significance')).toBeInTheDocument();
    expect(screen.getByText(/Considered one of the greatest animated films ever made/)).toBeInTheDocument();
  });

  test('handles multiple countries correctly', () => {
    const italyCountry = {
      id: 'italy',
      name: 'Italy',
      flag: '🇮🇹',
      region: 'Europe'
    };

    render(<MovieSection selectedCountry={italyCountry} />);

    expect(screen.getByText('Life Is Beautiful')).toBeInTheDocument();
    expect(screen.getByText(/Roberto Benigni/)).toBeInTheDocument();
  });

  test('displays proper accessibility features', () => {
    render(<MovieSection selectedCountry={mockCountry} />);

    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Cinema & Films')).toBeInTheDocument();
  });

  test('maintains responsive design classes', () => {
    render(<MovieSection selectedCountry={mockCountry} />);

    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2');
  });

  test('shows no country selected state', () => {
    render(<MovieSection selectedCountry={null} />);

    expect(screen.getByText('Select a country to explore its movie culture')).toBeInTheDocument();
    expect(screen.getByText('🎬')).toBeInTheDocument();
  });

  test('shows no country id state', () => {
    render(<MovieSection selectedCountry={{}} />);

    expect(screen.getByText('Select a country to explore its movie culture')).toBeInTheDocument();
    expect(screen.getByText('🎬')).toBeInTheDocument();
  });
});
