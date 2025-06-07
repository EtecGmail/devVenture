export interface Filters {
  userType?: 'aluno' | 'professor';
  curso?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

export function applyFilters<T extends { type?: string; curso?: string; createdAt?: string; name?: string; email?: string; ra?: string; cpf?: string }>(
  users: T[],
  filters: Filters
): T[] {
  return users.filter(u => {
    if (filters.userType && u.type !== filters.userType) return false;
    if (filters.curso && u.curso !== filters.curso) return false;
    if (filters.startDate && u.createdAt && u.createdAt < filters.startDate) return false;
    if (filters.endDate && u.createdAt && u.createdAt > filters.endDate) return false;
    if (filters.search) {
      const term = filters.search.toLowerCase();
      const fields = [u.name, u.email, u.ra, u.cpf];
      if (!fields.some(f => f && f.toLowerCase().includes(term))) return false;
    }
    return true;
  });
}

export function sortList<T>(list: T[], config: SortConfig<T> | null): T[] {
  if (!config) return list;
  const { key, direction } = config;
  const sorted = [...list].sort((a, b) => {
    const av = (a as Record<string, unknown>)[key] as number | string;
    const bv = (b as Record<string, unknown>)[key] as number | string;
    if (av === undefined || bv === undefined) return 0;
    if (av < bv) return direction === 'asc' ? -1 : 1;
    if (av > bv) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
}

export function paginate<T>(list: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return list.slice(start, start + perPage);
}
