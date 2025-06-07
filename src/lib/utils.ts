import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { StoredUser, Filters } from '@/types/admin'; // Ensure correct path
import { parseISO, isWithinInterval } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function applyFilters(users: StoredUser[], filters: Filters): StoredUser[] {
  let filteredUsers = [...users];

  // Filter by userType
  if (filters.userType) {
    filteredUsers = filteredUsers.filter(user => user.type === filters.userType);
  }

  // Filter by curso (only for 'aluno')
  if (filters.curso && (!filters.userType || filters.userType === 'aluno')) {
    filteredUsers = filteredUsers.filter(user => {
      if (user.type === 'aluno') {
        return user.curso?.toLowerCase().includes(filters.curso!.toLowerCase());
      }
      // If userType filter is active and it's 'professor', they shouldn't be filtered out by 'curso'
      return filters.userType === 'professor' ? true : false;
    });
  } else if (filters.curso && filters.userType === 'aluno') {
      filteredUsers = filteredUsers.filter(user =>
        user.type === 'aluno' && user.curso?.toLowerCase().includes(filters.curso!.toLowerCase())
    );
  }


  // Filter by createdAt date range
  const { startDate, endDate } = filters;
  if (startDate || endDate) {
    filteredUsers = filteredUsers.filter(user => {
      if (!user.createdAt) return false;
      try {
        const createdAtDate = parseISO(user.createdAt);
        if (startDate && endDate) {
          return isWithinInterval(createdAtDate, { start: parseISO(startDate), end: parseISO(endDate) });
        }
        if (startDate) {
          return createdAtDate >= parseISO(startDate);
        }
        if (endDate) {
          return createdAtDate <= parseISO(endDate);
        }
      } catch (e) {
        console.error("Error parsing date for filtering:", user.createdAt, e);
        return false;
      }
      return true;
    });
  }

  // Filter by search term (name, email, ra, cpf)
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredUsers = filteredUsers.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(searchTerm);
      const emailMatch = user.email.toLowerCase().includes(searchTerm);
      const raMatch = user.type === 'aluno' && user.ra?.toLowerCase().includes(searchTerm);
      const cpfMatch = user.type === 'professor' && user.cpf?.toLowerCase().includes(searchTerm);
      return nameMatch || emailMatch || !!raMatch || !!cpfMatch;
    });
  }

  return filteredUsers;
}

export function sortList<T>(
  items: T[],
  config: { key: keyof T; direction: 'ascending' | 'descending' } | null
): T[] {
  if (!config) {
    return [...items]; // Return a copy if no sort config
  }

  const sortedItems = [...items]; // Work on a copy

  sortedItems.sort((a, b) => {
    const valA = a[config.key];
    const valB = b[config.key];

    // Handle undefined or null values by pushing them to the end
    if (valA == null && valB == null) return 0;
    if (valA == null) return 1; // valA is null/undefined, sort b before a
    if (valB == null) return -1; // valB is null/undefined, sort a before b


    let comparison = 0;
    if (typeof valA === 'string' && typeof valB === 'string') {
      comparison = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      comparison = valA - valB;
    } else if (typeof valA === 'boolean' && typeof valB === 'boolean') {
      comparison = valA === valB ? 0 : (valA ? -1 : 1);
    } else {
      // Fallback for other types or mixed types (convert to string for basic comparison)
      comparison = String(valA).localeCompare(String(valB), undefined, { numeric: true, sensitivity: 'base' });
    }

    return config.direction === 'ascending' ? comparison : -comparison;
  });

  return sortedItems;
}

export function paginate<T>(
  items: T[],
  pagination: { currentPage: number; itemsPerPage: number }
): T[] {
  const { currentPage, itemsPerPage } = pagination;
  if (itemsPerPage <= 0) return [...items]; // Or throw an error

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return items.slice(startIndex, endIndex);
}
