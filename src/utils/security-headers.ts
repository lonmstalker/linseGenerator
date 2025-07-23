/**
 * Security headers configuration for MCP server
 */

export const SecurityHeaders = {
  /**
   * Content Security Policy
   */
  CSP: {
    'default-src': "'self'",
    'script-src': "'self'",
    'style-src': "'self' 'unsafe-inline'",
    'img-src': "'self' data:",
    'font-src': "'self'",
    'connect-src': "'self'",
    'media-src': "'none'",
    'object-src': "'none'",
    'frame-src': "'none'",
    'worker-src': "'none'",
    'form-action': "'self'",
    'base-uri': "'self'",
    'manifest-src': "'none'"
  },

  /**
   * Permissions Policy - only include valid features
   */
  PermissionsPolicy: {
    'accelerometer': '()',
    'camera': '()',
    'geolocation': '()',
    'gyroscope': '()',
    'magnetometer': '()',
    'microphone': '()',
    'payment': '()',
    'usb': '()',
    'interest-cohort': '()',
    'attribution-reporting': '()',
    'browsing-topics': '()',
    'compute-pressure': '()',
    'display-capture': '()',
    'encrypted-media': '()',
    'fullscreen': '(self)',
    'gamepad': '()',
    'midi': '()',
    'picture-in-picture': '()',
    'publickey-credentials-get': '()',
    'screen-wake-lock': '()',
    'serial': '()',
    'sync-xhr': '()',
    'xr-spatial-tracking': '()'
  },

  /**
   * Other security headers
   */
  Other: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  }
};

/**
 * Generate Permissions-Policy header string
 */
export function generatePermissionsPolicy(): string {
  return Object.entries(SecurityHeaders.PermissionsPolicy)
    .map(([feature, value]) => `${feature}=${value}`)
    .join(', ');
}

/**
 * Generate Content-Security-Policy header string
 */
export function generateCSP(): string {
  return Object.entries(SecurityHeaders.CSP)
    .map(([directive, value]) => `${directive} ${value}`)
    .join('; ');
}