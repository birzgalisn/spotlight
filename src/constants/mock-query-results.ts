import type { SearchType } from '~/types';

/* prettier-ignore */
const MOCK_QUERY_RESULTS = {
  Users: [
    'Emily', 'James', 'Olivia', 'Liam', 'Sophia', 'Noah', 'Emma', 'Mason', 'Isabella', 'Logan',
    'Mia', 'Lucas', 'Ava', 'Ethan', 'Charlotte', 'Aiden', 'Amelia', 'Jackson', 'Harper', 'Sebastian',
    'Ella', 'Benjamin', 'Aria', 'Henry', 'Abigail', 'Daniel', 'Lily', 'Matthew', 'Chloe', 'Wyatt',
    'Grace', 'Jayden', 'Zoe', 'Carter', 'Stella', 'Julian', 'Hannah', 'Levi', 'Lillian', 'Nathan'
  ],
  Posts: [
    'Morning walk in the park', 'Baking cookies with grandma', 'Weekend beach trip', 'Trying a new coffee shop',
    'Rainy day reading', 'Favorite childhood movie', 'Neighborhood garage sale', 'Picnic at the lake',
    'Sunday brunch photos', 'Daily workout routine', 'Backyard gardening tips', 'Evening bike ride',
    'Making homemade pizza', 'Spring cleaning checklist', 'Family game night fun', 'Cute puppy moments',
    'Watching the sunset', 'Decorating the living room', 'Best ice cream flavors', 'Board games for rainy days',
    'Crafting with the kids', 'Mini road trip adventure', 'Fresh farmers market haul', 'Book recommendations for summer',
    'Lazy Sunday afternoon', 'Bird watching hobby', 'Learning to knit', 'DIY candle making',
    'New plant in the house', 'Favorite lunch spot downtown', 'Starry night sky', 'First snowfall pictures',
    'Trying watercolor painting', 'Birthday surprise party', 'Campfire stories', 'Breakfast in bed',
    'Daily journaling practice', 'Sunflower field visit', 'Local hiking trail', 'Movie night snacks'
  ],
  Tags: [
    'family', 'friends', 'home', 'food', 'nature', 'pets', 'travel', 'coffee', 'books', 'fitness',
    'cooking', 'sunset', 'shopping', 'hiking', 'music', 'photography', 'art', 'relaxation',
    'cleaning', 'baking', 'writing', 'reading', 'weekend', 'rain', 'sunny', 'kids', 'animals',
    'plants', 'inspiration', 'games', 'fun', 'vacation', 'memories', 'picnic', 'outdoors',
    'walk', 'bike', 'camping', 'DIY'
  ]
} as const satisfies Record<SearchType, string[]>;

export default MOCK_QUERY_RESULTS;
