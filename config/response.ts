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
  // * Success
  SUCCESS = 'Success',
  SUCCESS_SYNC_VIDEOS = 'All videos successful synced!',
  // * Success

  VIDEO_CREATED = 'Video has been created!',
  VIDEO_UPDATED = 'Video has been updated!',
  VIDEO_DELETED = 'Video has been deleted!',
  VIDEO_NOT_FOUND = 'Video is not found!',

  // * Error
  ERROR = 'Something went wrong, please repeat!',
  VALIDATION_ERROR = 'Please fill all inputs correctly!',
  // * Error
}
