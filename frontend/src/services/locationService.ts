export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationInfo {
  coordinates: LocationCoordinates;
  address?: {
    city?: string;
    region?: string;
    country?: string;
    formatted?: string;
  };
  timestamp: number;
}

export interface LocationError {
  code: number;
  message: string;
}

class LocationService {
  private static instance: LocationService;

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Get current location using browser's geolocation API
   */
  async getCurrentLocation(): Promise<LocationInfo> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: 0,
          message: 'Geolocation is not supported by this browser.'
        } as LocationError);
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationInfo: LocationInfo = {
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            },
            timestamp: Date.now()
          };
          resolve(locationInfo);
        },
        (error) => {
          const locationError: LocationError = {
            code: error.code,
            message: this.getErrorMessage(error.code)
          };
          reject(locationError);
        },
        options
      );
    });
  }

  /**
   * Reverse geocode coordinates to get address information
   */
  async reverseGeocode(coordinates: LocationCoordinates): Promise<LocationInfo['address']> {
    try {
      // Using a public geocoding service (in production, use a proper API key)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();
      
      return {
        city: data.city || data.locality || '',
        region: data.principalSubdivision || data.region || '',
        country: data.countryName || '',
        formatted: data.locality ? 
          `${data.locality}, ${data.principalSubdivision || data.region || ''}, ${data.countryName || ''}` :
          `${data.principalSubdivision || data.region || ''}, ${data.countryName || ''}`
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return {
        city: '',
        region: '',
        country: '',
        formatted: 'Location unavailable'
      };
    }
  }

  /**
   * Get current location with address information
   */
  async getCurrentLocationWithAddress(): Promise<LocationInfo> {
    try {
      const locationInfo = await this.getCurrentLocation();
      const address = await this.reverseGeocode(locationInfo.coordinates);
      
      return {
        ...locationInfo,
        address
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if geolocation is available and permissions are granted
   */
  async checkPermissions(): Promise<{
    available: boolean;
    permission: 'granted' | 'denied' | 'prompt' | 'unknown';
  }> {
    if (!navigator.geolocation) {
      return {
        available: false,
        permission: 'unknown'
      };
    }

    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return {
          available: true,
          permission: permission.state as 'granted' | 'denied' | 'prompt'
        };
      } catch (error) {
        return {
          available: true,
          permission: 'unknown'
        };
      }
    }

    return {
      available: true,
      permission: 'unknown'
    };
  }

  private getErrorMessage(code: number): string {
    switch (code) {
      case 1:
        return 'Location access denied by user.';
      case 2:
        return 'Location information is unavailable.';
      case 3:
        return 'Location request timed out.';
      default:
        return 'An unknown error occurred while retrieving location.';
    }
  }
}

export const locationService = LocationService.getInstance();