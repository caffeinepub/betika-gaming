export type CarrierType = 'Safaricom' | 'Airtel' | 'MTN' | 'Vodacom' | 'Orange' | 'Glo' | 'Airtel Africa' | 'Unknown';

interface CountryPhonePattern {
  country: string;
  countryCode: string;
  patterns: RegExp[];
  carriers?: string[];
}

// Pan-African phone validation patterns
const africanCountries: CountryPhonePattern[] = [
  {
    country: 'Kenya',
    countryCode: '254',
    patterns: [/^07\d{8}$/, /^(\+?254)7\d{8}$/],
    carriers: ['Safaricom', 'Airtel'],
  },
  {
    country: 'Nigeria',
    countryCode: '234',
    patterns: [/^0[789]\d{9}$/, /^(\+?234)[789]\d{9}$/],
    carriers: ['MTN', 'Glo', 'Airtel', '9mobile'],
  },
  {
    country: 'South Africa',
    countryCode: '27',
    patterns: [/^0[6-8]\d{8}$/, /^(\+?27)[6-8]\d{8}$/],
    carriers: ['Vodacom', 'MTN', 'Cell C'],
  },
  {
    country: 'Ghana',
    countryCode: '233',
    patterns: [/^0[25]\d{8}$/, /^(\+?233)[25]\d{8}$/],
    carriers: ['MTN', 'Vodafone', 'AirtelTigo'],
  },
  {
    country: 'Tanzania',
    countryCode: '255',
    patterns: [/^0[67]\d{8}$/, /^(\+?255)[67]\d{8}$/],
    carriers: ['Vodacom', 'Airtel', 'Tigo'],
  },
  {
    country: 'Uganda',
    countryCode: '256',
    patterns: [/^0[37]\d{8}$/, /^(\+?256)[37]\d{8}$/],
    carriers: ['MTN', 'Airtel'],
  },
  {
    country: 'Rwanda',
    countryCode: '250',
    patterns: [/^07\d{8}$/, /^(\+?250)7\d{8}$/],
    carriers: ['MTN', 'Airtel'],
  },
  {
    country: 'Ethiopia',
    countryCode: '251',
    patterns: [/^09\d{8}$/, /^(\+?251)9\d{8}$/],
    carriers: ['Ethio Telecom'],
  },
  {
    country: 'Egypt',
    countryCode: '20',
    patterns: [/^01[0125]\d{8}$/, /^(\+?20)1[0125]\d{8}$/],
    carriers: ['Vodafone', 'Orange', 'Etisalat'],
  },
  {
    country: 'Morocco',
    countryCode: '212',
    patterns: [/^0[67]\d{8}$/, /^(\+?212)[67]\d{8}$/],
    carriers: ['Maroc Telecom', 'Orange', 'Inwi'],
  },
  {
    country: 'Zambia',
    countryCode: '260',
    patterns: [/^09[567]\d{7}$/, /^(\+?260)9[567]\d{7}$/],
    carriers: ['MTN', 'Airtel', 'Zamtel'],
  },
  {
    country: 'Zimbabwe',
    countryCode: '263',
    patterns: [/^07[1378]\d{7}$/, /^(\+?263)7[1378]\d{7}$/],
    carriers: ['Econet', 'NetOne', 'Telecel'],
  },
  {
    country: 'Cameroon',
    countryCode: '237',
    patterns: [/^6[5-9]\d{7}$/, /^(\+?237)6[5-9]\d{7}$/],
    carriers: ['MTN', 'Orange'],
  },
  {
    country: 'Senegal',
    countryCode: '221',
    patterns: [/^7[0678]\d{7}$/, /^(\+?221)7[0678]\d{7}$/],
    carriers: ['Orange', 'Free', 'Expresso'],
  },
  {
    country: 'Ivory Coast',
    countryCode: '225',
    patterns: [/^0[1-9]\d{8}$/, /^(\+?225)[0-9]\d{8}$/],
    carriers: ['MTN', 'Orange', 'Moov'],
  },
  {
    country: 'Mozambique',
    countryCode: '258',
    patterns: [/^8[2-7]\d{7}$/, /^(\+?258)8[2-7]\d{7}$/],
    carriers: ['Vodacom', 'Movitel', 'TMcel'],
  },
];

/**
 * Validates phone numbers from African countries
 * Accepts both local and international formats
 */
export function validateAfricanPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '');
  
  for (const country of africanCountries) {
    for (const pattern of country.patterns) {
      if (pattern.test(cleaned)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Detects the country from a phone number
 */
export function detectCountry(phone: string): string | null {
  const cleaned = phone.replace(/[\s-]/g, '');
  
  for (const country of africanCountries) {
    for (const pattern of country.patterns) {
      if (pattern.test(cleaned)) {
        return country.country;
      }
    }
  }
  
  return null;
}

/**
 * Detects the carrier type based on the phone number prefix (Kenya-specific)
 * For other countries, returns 'Unknown'
 */
export function detectCarrier(phone: string): CarrierType {
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Extract the first 4 digits after country code or 0
  let prefix = '';
  if (cleaned.startsWith('+254') || cleaned.startsWith('254')) {
    // Kenya
    if (cleaned.startsWith('+254')) {
      prefix = cleaned.substring(4, 8);
    } else {
      prefix = cleaned.substring(3, 7);
    }
    
    // Airtel prefixes
    const airtelPrefixes = ['0710', '0711', '0712', '0713', '0714', '0715', '0716', '0717', '0718', '0719',
                            '0730', '0731', '0732', '0733', '0734', '0735', '0736', '0737', '0738', '0739',
                            '0750', '0751', '0752', '0753', '0754', '0755', '0756', '0757', '0758', '0759',
                            '0780', '0781', '0782', '0783', '0784', '0785', '0786', '0787', '0788', '0789'];
    
    if (airtelPrefixes.includes(prefix)) {
      return 'Airtel';
    }
    
    if (prefix.startsWith('07')) {
      return 'Safaricom';
    }
  } else if (cleaned.startsWith('07')) {
    // Kenya local format
    prefix = cleaned.substring(0, 4);
    
    const airtelPrefixes = ['0710', '0711', '0712', '0713', '0714', '0715', '0716', '0717', '0718', '0719',
                            '0730', '0731', '0732', '0733', '0734', '0735', '0736', '0737', '0738', '0739',
                            '0750', '0751', '0752', '0753', '0754', '0755', '0756', '0757', '0758', '0759',
                            '0780', '0781', '0782', '0783', '0784', '0785', '0786', '0787', '0788', '0789'];
    
    if (airtelPrefixes.includes(prefix)) {
      return 'Airtel';
    }
    
    if (prefix.startsWith('07')) {
      return 'Safaricom';
    }
  }
  
  return 'Unknown';
}

/**
 * Formats phone number to display format
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '');
  const country = detectCountry(cleaned);
  
  if (country === 'Kenya') {
    // Convert to local format if international
    let localNumber = cleaned;
    if (cleaned.startsWith('+254')) {
      localNumber = '0' + cleaned.substring(4);
    } else if (cleaned.startsWith('254')) {
      localNumber = '0' + cleaned.substring(3);
    }
    
    // Format as 07XX XXX XXX
    if (localNumber.length === 10 && localNumber.startsWith('07')) {
      return `${localNumber.substring(0, 4)} ${localNumber.substring(4, 7)} ${localNumber.substring(7)}`;
    }
  }
  
  // For other countries, return with country code
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // Try to add country code
  for (const countryData of africanCountries) {
    for (const pattern of countryData.patterns) {
      if (pattern.test(cleaned)) {
        if (cleaned.startsWith('0')) {
          return `+${countryData.countryCode}${cleaned.substring(1)}`;
        }
        return `+${cleaned}`;
      }
    }
  }
  
  return phone;
}

/**
 * Normalizes phone number to international format for backend storage
 */
export function normalizePhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // If already in international format, return as is
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // Try to detect country and convert to international format
  for (const country of africanCountries) {
    for (const pattern of country.patterns) {
      if (pattern.test(cleaned)) {
        // If starts with 0, replace with country code
        if (cleaned.startsWith('0')) {
          return `+${country.countryCode}${cleaned.substring(1)}`;
        }
        // If starts with country code without +, add +
        if (cleaned.startsWith(country.countryCode)) {
          return `+${cleaned}`;
        }
      }
    }
  }
  
  return cleaned;
}

/**
 * Gets the country code from a phone number
 */
export function getCountryCode(phone: string): string | null {
  const cleaned = phone.replace(/[\s-]/g, '');
  
  for (const country of africanCountries) {
    for (const pattern of country.patterns) {
      if (pattern.test(cleaned)) {
        return country.countryCode;
      }
    }
  }
  
  return null;
}
