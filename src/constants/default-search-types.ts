import type { SearchType } from '~/types';

const DEFAULT_SEARCH_TYPES = [
  'Users',
  'Posts',
  'Tags',
] as const satisfies SearchType[];

export default DEFAULT_SEARCH_TYPES;
