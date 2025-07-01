import DOMPurify from "dompurify";
import validator from "validator";

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim());
};

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePhone = (phone: string): boolean => {
  return validator.isMobilePhone(phone, "id-ID");
};

export const hashPassword = async (password: string): Promise<string> => {
  // Simple hash simulation (in real app, use bcrypt)
  return btoa(password + "salt");
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return btoa(password + "salt") === hash;
};

export const generateCSRFToken = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
