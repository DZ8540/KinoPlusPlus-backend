export type AuthConfig = {
  access: {
    key: string,
    expire: string,
  },
  refresh: {
    key: string,
    expire: string,
  },
  emailVerify: {
    key: string,
    expire: string,
  }
}

export type AuthHeaders = {
  userAgent: string,
  fingerprint: string,
  ip: string,
}
