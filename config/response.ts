export enum ResponseCodes {
  SUCCESS = 'SUCCESS',

  CLIENT_ERROR = 'CLIENT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  MAILER_ERROR = 'MAILER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
}

export enum ResponseMessages {
  /**
   * * Success
   */

  SUCCESS = 'Success',
  SUCCESS_SYNC_VIDEOS = 'All videos successful synced!',

  /**
   * * Auth
   */

  ACTIVATE_ACCOUNT = 'Thanks for registration, please activate your account, we sended instructions to your email!',
  ACCOUNT_ALREADY_ACTIVATED = 'Your account already activated, thanks, let\'s go to login!',
  TOKEN_ERROR = 'Token expired or undefined!',
  MISSING_AUTH_HEADERS = 'Missing several auth headers!',
  LOGOUT = 'You are logged out of your account!',

  /**
   * * Video
   */

  VIDEO_CREATED = 'Video has been created!',
  VIDEO_UPDATED = 'Video has been updated!',
  VIDEO_DELETED = 'Video has been deleted!',
  VIDEO_NOT_FOUND = 'Video is not found!',

  /**
   * * Genre
   */

  GENRE_CREATED = 'Genre has been created!',
  GENRE_UPDATED = 'Genre has been updated!',
  GENRE_DELETED = 'Genre has been deleted!',
  GENRE_NOT_FOUND = 'Genre is not found!',

  /**
   * * User
   */

  USER_ACTIVATED = 'Congratulations, account activated!',
  USER_UPDATED = 'Your profile successful updated!',

  USER_NOT_FOUND = 'User not found!',
  OLD_PASSWORD_INCORRECT = 'Your old password is incorrect!',

  /**
   * * Role
   */

  ROLE_NOT_FOUND = 'Role not found!',

  /**
   * * Error
   */

  ERROR = 'Something went wrong, please repeat!',
  VALIDATION_ERROR = 'Please fill all inputs correctly!',
}
