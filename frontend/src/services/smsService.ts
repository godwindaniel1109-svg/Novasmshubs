// SMS Service with Multiple Providers and Fallback
interface SMSProvider {
  name: string;
  baseUrl: string;
  apiKey: string;
  isActive: boolean;
  priority: number;
}

interface NumberRequest {
  serviceId: string;
  country: string;
  userId: string;
}

interface NumberResponse {
  success: boolean;
  number?: string;
  id?: string;
  error?: string;
  provider?: string;
  banned?: boolean;
  requiresVerification?: boolean;
}

interface CodeRequest {
  numberId: string;
  serviceId: string;
  userId: string;
}

interface CodeResponse {
  success: boolean;
  code?: string;
  error?: string;
  provider?: string;
  deducted?: boolean;
  amount?: number;
}

class SMSService {
  private providers: SMSProvider[] = [
    {
      name: '5Sim',
      baseUrl: 'https://5sim.net/v1',
      apiKey: process.env.REACT_APP_5SIM_API_KEY || '',
      isActive: true,
      priority: 1
    },
    {
      name: 'SMS-Activate',
      baseUrl: 'https://sms-activate.org/stubs/handler_api.php',
      apiKey: process.env.REACT_APP_SMS_ACTIVATE_API_KEY || '',
      isActive: true,
      priority: 2
    },
    {
      name: 'Virtual-Number',
      baseUrl: 'https://virtual-number.com/api',
      apiKey: process.env.REACT_APP_VIRTUAL_NUMBER_API_KEY || '',
      isActive: true,
      priority: 3
    }
  ];

  private getAuthHeaders(provider: SMSProvider) {
    return {
      'Authorization': `Bearer ${provider.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // Get active providers sorted by priority
  private getActiveProviders(): SMSProvider[] {
    return this.providers
      .filter(p => p.isActive && p.apiKey)
      .sort((a, b) => a.priority - b.priority);
  }

  // Request number from providers with fallback
  async requestNumber(request: NumberRequest): Promise<NumberResponse> {
    const providers = this.getActiveProviders();
    
    if (providers.length === 0) {
      return {
        success: false,
        error: 'No active SMS providers available'
      };
    }

    let lastError = '';

    for (const provider of providers) {
      try {
        console.log(`Trying provider: ${provider.name}`);
        
        let response;
        switch (provider.name) {
          case '5Sim':
            response = await this.requestFrom5Sim(provider, request);
            break;
          case 'SMS-Activate':
            response = await this.requestFromSMSActivate(provider, request);
            break;
          case 'Virtual-Number':
            response = await this.requestFromVirtualNumber(provider, request);
            break;
          default:
            continue;
        }

        if (response.success) {
          return {
            ...response,
            provider: provider.name
          };
        } else {
          lastError = response.error || 'Unknown error';
          console.log(`Provider ${provider.name} failed: ${lastError}`);
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Provider error';
        console.log(`Provider ${provider.name} error: ${lastError}`);
      }
    }

    return {
      success: false,
      error: lastError || 'All providers failed'
    };
  }

  // 5Sim Provider
  private async requestFrom5Sim(provider: SMSProvider, request: NumberRequest): Promise<NumberResponse> {
    try {
      const response = await fetch(`${provider.baseUrl}/user/buy/activation/${request.country}/${request.serviceId}`, {
        headers: this.getAuthHeaders(provider),
        method: 'GET'
      });

      const data = await response.json();

      if (data.phone) {
        // Check if number is banned
        const isBanned = await this.checkNumberBanned(data.phone);
        
        return {
          success: true,
          number: data.phone,
          id: data.id,
          banned: isBanned,
          requiresVerification: !isBanned
        };
      } else {
        return {
          success: false,
          error: data.error || 'No number available'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '5Sim API error'
      };
    }
  }

  // SMS-Activate Provider
  private async requestFromSMSActivate(provider: SMSProvider, request: NumberRequest): Promise<NumberResponse> {
    try {
      const params = new URLSearchParams({
        api_key: provider.apiKey,
        action: 'getNumber',
        service: request.serviceId,
        country: request.country
      });

      const response = await fetch(`${provider.baseUrl}?${params}`, {
        method: 'GET'
      });

      const data = await response.text();

      if (data.startsWith('ACCESS_NUMBER')) {
        const parts = data.split(':');
        const numberId = parts[1];
        const phoneNumber = parts[2];

        // Check if number is banned
        const isBanned = await this.checkNumberBanned(phoneNumber);

        return {
          success: true,
          number: phoneNumber,
          id: numberId,
          banned: isBanned,
          requiresVerification: !isBanned
        };
      } else {
        return {
          success: false,
          error: this.parseSMSActivateError(data)
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'SMS-Activate API error'
      };
    }
  }

  // Virtual-Number Provider (Mock implementation)
  private async requestFromVirtualNumber(provider: SMSProvider, request: NumberRequest): Promise<NumberResponse> {
    try {
      const response = await fetch(`${provider.baseUrl}/numbers/request`, {
        headers: this.getAuthHeaders(provider),
        method: 'POST',
        body: JSON.stringify({
          service: request.serviceId,
          country: request.country,
          user_id: request.userId
        })
      });

      const data = await response.json();

      if (data.success && data.number) {
        // Check if number is banned
        const isBanned = await this.checkNumberBanned(data.number);

        return {
          success: true,
          number: data.number,
          id: data.id,
          banned: isBanned,
          requiresVerification: !isBanned
        };
      } else {
        return {
          success: false,
          error: data.error || 'No number available'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Virtual-Number API error'
      };
    }
  }

  // Check if number is banned
  private async checkNumberBanned(phoneNumber: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/numbers/check-banned/${phoneNumber}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      return data.banned || false;
    } catch (error) {
      console.error('Error checking banned status:', error);
      return false;
    }
  }

  // Request code/OTP for a number
  async requestCode(request: CodeRequest): Promise<CodeResponse> {
    try {
      const response = await fetch('/api/numbers/request-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(request)
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          code: data.code,
          provider: data.provider,
          deducted: data.deducted,
          amount: data.amount
        };
      } else {
        return {
          success: false,
          error: data.error
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to request code'
      };
    }
  }

  // Replace banned number
  async replaceBannedNumber(numberId: string, userId: string): Promise<NumberResponse> {
    try {
      const response = await fetch('/api/numbers/replace-banned', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ numberId, userId })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to replace number'
      };
    }
  }

  // Parse SMS-Activate errors
  private parseSMSActivateError(response: string): string {
    const errorMap: { [key: string]: string } = {
      'NO_NUMBER': 'No numbers available',
      'NO_BALANCE': 'Insufficient balance',
      'BAD_ACTION': 'Invalid action',
      'BAD_SERVICE': 'Invalid service',
      'BAD_KEY': 'Invalid API key',
      'ERROR_SQL': 'Database error',
      'BANNED': 'Number is banned'
    };

    for (const [key, message] of Object.entries(errorMap)) {
      if (response.includes(key)) {
        return message;
      }
    }

    return 'Unknown error occurred';
  }

  // Get available services
  async getServices(country: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/services?country=${country}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      return data.services || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }

  // Get available countries
  async getCountries(): Promise<any[]> {
    try {
      const response = await fetch('/api/countries', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      return data.countries || [];
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  }
}

export default new SMSService();
