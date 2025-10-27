export interface LoginResponse {
  refresh: string
  access: string
  exp: string
  data: {
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
    phone: string
    is_superuser: boolean
    is_staff: boolean
  }
}

export function setAuthTokens(tokens: { access: string; refresh: string }) {
  // Set cookies for server-side access
  const isProduction = process.env.NODE_ENV === 'production'
  const cookieOptions = isProduction 
    ? 'path=/; max-age=604800; secure; samesite=strict' // 7 days
    : 'path=/; max-age=604800; samesite=strict' // 7 days, no secure in dev
  
  document.cookie = `access_token=${tokens.access}; ${cookieOptions}`
  document.cookie = `refresh_token=${tokens.refresh}; path=/; max-age=2592000; ${isProduction ? 'secure; ' : ''}samesite=strict` // 30 days
  
  // Also store in localStorage for client-side access
  localStorage.setItem("access_token", tokens.access)
  localStorage.setItem("refresh_token", tokens.refresh)
}

export function getAuthTokens() {
  return {
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token"),
  }
}

export function clearAuthTokens() {
  // Clear cookies
  document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  
  // Clear localStorage
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user_data")
}

export function setUserData(data: LoginResponse["data"]) {
  localStorage.setItem("user_data", JSON.stringify(data))
}

export function getUserData(): LoginResponse["data"] | null {
  const data = localStorage.getItem("user_data")
  return data ? JSON.parse(data) : null
}

export function isAuthenticated(): boolean {
  return !!getAuthTokens().access
}
