/*
 * Validation utilities for form inputs
 * - Provides reusable validation for username, email, password, profile name, gender, and more
 * - Includes login, signup, forgot password, and reset password form validation
 * - Returns error messages for invalid inputs
 */

import { 
  LoginFormData, 
  LoginFormErrors, 
  SignupFormData, 
  SignupFormErrors,
  ForgotPasswordFormData,
  ForgotPasswordFormErrors,
  ResetPasswordFormData,
  ResetPasswordFormErrors, 
  VerifyCodeFormData,
  VerifyCodeFormErrors
} from '@/types/auth';

/*
 * Validates an email address
 * - Checks if the email matches a standard email regex pattern
 * - Returns an error message if invalid, or undefined if valid
 */
export const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

/*
 * Validates a username
 * - Checks if the username is 3-30 characters long and contains only letters, numbers, or underscores
 * - Returns an error message if invalid, or undefined if valid
 */
export const validateUsername = (username: string): string | undefined => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  if (!username.trim()) {
    return 'Username is required';
  }
  if (!usernameRegex.test(username)) {
    return 'Username must be 3-30 characters long and contain only letters, numbers, or underscores';
  }
  return undefined;
};

/*
 * Validates a password
 * - Checks if password meets complexity requirements (8+ characters, uppercase, lowercase, number, special character)
 * - Returns an error message if invalid, or undefined if valid
 */
export const validatePassword = (password: string): string | undefined => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password.trim()) {
    return 'Please enter a password is required';
  }
  if (!passwordRegex.test(password)) {
    return 'Password must be at least 8 characters long and, include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&$)';
  }
  return undefined;
};

/*
 * Validates a profile name
 * - Checks if the profile name is valid 2-50 characters and contains only letters or spaces
 * - Returns an error message if invalid, or undefined if valid
 */
export const validateProfileName = (profileName: string): string | undefined => {
  const profileNameRegex = /^[a-zA-Z\s]{2,50}$/;
  if (!profileName.trim()) {
    return 'Profile name is required';
  }
  if (!profileNameRegex.test(profileName)) {
    return 'Profile name must be 2-50 characters long and contain only letters or spaces';
  }
  return undefined;
};

/*
 * Validates a gender selection
 * - Checks if gender is either MALE or FEMALE
 * - Returns an error message if invalid, or undefined if valid
 */
export const validateGender = (gender: string): string | undefined => {
  if (!gender) {
    return 'Gender is required';
  }
  if (!['MALE', 'FEMALE'].includes(gender)) {
    return 'Please select Male or Female';
  }
  return undefined;
};

/*
 * Validates a date of birth
 * - Checks if date is valid, not in the future, and the user is at least 13 years old
 * - Returns an error message if invalid, or undefined if valid
 */
export const validateDateOfBirth = (dateOfBirth: string): string | undefined => {
  if (!dateOfBirth) {
    return 'Date of birth is required';
  }
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();
  const adjustedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

  if (isNaN(dob.getTime())) {
    return 'Invalid date of birth';
  }
  if (adjustedAge < 13) {
    return 'You must be at least 13 years old';
  }
  if (dob > today) {
    return 'Date of birth cannot be in the future';
  }
  return undefined;
};

/*
 * Validates confirm password
 * - Checks if confirm password matches the password
 * - Returns an error message if invalid, or undefined if valid
 */
export const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
  if (!confirmPassword.trim()) {
    return 'Please confirm your password';
  }
  if (confirmPassword !== password) {
    return 'Passwords do not match';
  }
  return undefined;
};

/*
 * Validates login form data
 * - Checks username/email and password fields
 * - Supports both email and username input for the usernameOrEmail field
 * - Returns an object with error messages for invalid fields
 */
export const validateLoginForm = (data: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  // Validate usernameOrEmail (accepts either email or username)
  const emailError = validateEmail(data.usernameOrEmail);
  const usernameError = validateUsername(data.usernameOrEmail);
  if (emailError && usernameError) {
    errors.usernameOrEmail = 'Please enter a valid email or username (minimum 3 characters)';
  } else if (!data.usernameOrEmail.trim()) {
    errors.usernameOrEmail = 'Email or username is required';
  }

  // Validate password
  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};

/*
 * Validates signup form data
 * - Checks all signup form fields (profileName, username, email, password, confirmPassword, gender, dateOfBirth)
 * - Returns an object with error messages for invalid fields
 */
export const validateSignupForm = (data: SignupFormData): SignupFormErrors => {
  const errors: SignupFormErrors = {};

  // Validate profileName
  const profileNameError = validateProfileName(data.profileName);
  if (profileNameError) {
    errors.profileName = profileNameError;
  }

  // Validate username
  const usernameError = validateUsername(data.username);
  if (usernameError) {
    errors.username = usernameError;
  }

  // Validate email
  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  // Validate password
  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  // Validate confirmPassword
  const confirmPasswordError = validateConfirmPassword(data.confirmPassword, data.password);
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  // Validate gender
  const genderError = validateGender(data.gender);
  if (genderError) {
    errors.gender = genderError;
  }

  // Validate dateOfBirth
  const dateOfBirthError = validateDateOfBirth(data.dateOfBirth);
  if (dateOfBirthError) {
    errors.dateOfBirth = dateOfBirthError;
  }

  return errors;
};

/*
 * Validates forgot password form data
 * - Checks email field
 * - Returns an object with error messages for invalid fields
 */
export const validateForgotPasswordForm = (data: ForgotPasswordFormData): ForgotPasswordFormErrors => {
  const errors: ForgotPasswordFormErrors = {};

  // Validate email
  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  return errors;
};

/*
 * Validates reset password form data
 * - Checks resetToken, newPassword, and confirmPassword fields
 * - Returns an object with error messages for invalid fields
 */
export const validateResetPasswordForm = (data: ResetPasswordFormData): ResetPasswordFormErrors => {
  const errors: ResetPasswordFormErrors = {};

  // Validate resetToken
  if (!data.resetToken) {
    errors.resetToken = 'No valid reset token found. Please try again.';
  }

  // Validate password
  const passwordError = validatePassword(data.newPassword);
  if (passwordError) {
    errors.newPassword = passwordError;
  }

  // Validate confirmPassword
  const confirmPasswordError = validateConfirmPassword(data.confirmPassword, data.newPassword);
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  return errors;
};

/*
 * Validates verify code form data
 * - Checks email and code fields
 * - Returns an object with error messages for invalid fields
 */
export const validateVerifyCodeForm = (data: VerifyCodeFormData): VerifyCodeFormErrors => {
  const errors: VerifyCodeFormErrors = {};

  // Validate email
  if (!data.email) {
    errors.email = 'No valid email found. Please try again.';
  }

  // Validate code
  if (!data.code || data.code.length !==4) {
    errors.code = 'Please enter a valid 4-digit code';
  }

  return errors;
};