import { User } from '@/types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAge = (age: number): boolean => {
  return age >= 0 && age <= 150;
};

export const validateName = (name: string): boolean => {
  return name.trim().length > 0 && name.trim().length <= 100;
};

export const validateRole = (role: string): boolean => {
  return role.trim().length > 0 && role.trim().length <= 50;
};

export const validateUserData = (user: Partial<User>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!validateName(user.name || '')) {
    errors.push('Name is required and should be less than 100 characters');
  }

  if (!validateEmail(user.email || '')) {
    errors.push('Valid email is required');
  }

  if (!validateAge(user.age || 0)) {
    errors.push('Age must be between 0 and 150');
  }

  if (!validateRole(user.role || '')) {
    errors.push('Role is required and should be less than 50 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};