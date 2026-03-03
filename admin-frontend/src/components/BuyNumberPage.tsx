import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, Phone, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  mobileCode: string;
}

interface NumberAvailability {
  country: string;
  available: boolean;
  price: string;
  operators: string[];
  count: number;
}

const BuyNumberPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availability, setAvailability] = useState<NumberAvailability | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);

  // Countries data - this could be fetched from API later
  const allCountries: Country[] = [
    { code: 'US', name: 'United States', mobileCode: '1' },
    { code: 'UK', name: 'United Kingdom', mobileCode: '44' },
    { code: 'NG', name: 'Nigeria', mobileCode: '234' },
    { code: 'AF', name: 'Afghanistan', mobileCode: '93' },
    { code: 'AL', name: 'Albania', mobileCode: '355' },
    { code: 'DZ', name: 'Algeria', mobileCode: '213' },
    { code: 'AS', name: 'American Samoa', mobileCode: '1684' },
    { code: 'AD', name: 'Andorra', mobileCode: '376' },
    { code: 'AO', name: 'Angola', mobileCode: '244' },
    { code: 'AI', name: 'Anguilla', mobileCode: '1264' },
    { code: 'AQ', name: 'Antarctica', mobileCode: '672' },
    { code: 'AG', name: 'Antigua and Barbuda', mobileCode: '1268' },
    { code: 'AR', name: 'Argentina', mobileCode: '54' },
    { code: 'AM', name: 'Armenia', mobileCode: '374' },
    { code: 'AW', name: 'Aruba', mobileCode: '297' },
    { code: 'AU', name: 'Australia', mobileCode: '61' },
    { code: 'AT', name: 'Austria', mobileCode: '43' },
    { code: 'AZ', name: 'Azerbaijan', mobileCode: '994' },
    { code: 'BS', name: 'Bahamas', mobileCode: '1242' },
    { code: 'BH', name: 'Bahrain', mobileCode: '973' },
    { code: 'BD', name: 'Bangladesh', mobileCode: '880' },
    { code: 'BB', name: 'Barbados', mobileCode: '1246' },
    { code: 'BY', name: 'Belarus', mobileCode: '375' },
    { code: 'BE', name: 'Belgium', mobileCode: '32' },
    { code: 'BZ', name: 'Belize', mobileCode: '501' },
    { code: 'BJ', name: 'Benin', mobileCode: '229' },
    { code: 'BM', name: 'Bermuda', mobileCode: '1441' },
    { code: 'BT', name: 'Bhutan', mobileCode: '975' },
    { code: 'BO', name: 'Bolivia', mobileCode: '591' },
    { code: 'BA', name: 'Bosnia and Herzegovina', mobileCode: '387' },
    { code: 'BW', name: 'Botswana', mobileCode: '267' },
    { code: 'BR', name: 'Brazil', mobileCode: '55' },
    { code: 'IO', name: 'British Indian Ocean Territory', mobileCode: '246' },
    { code: 'BN', name: 'Brunei Darussalam', mobileCode: '673' },
    { code: 'BG', name: 'Bulgaria', mobileCode: '359' },
    { code: 'BF', name: 'Burkina Faso', mobileCode: '226' },
    { code: 'BI', name: 'Burundi', mobileCode: '257' },
    { code: 'KH', name: 'Cambodia', mobileCode: '855' },
    { code: 'CM', name: 'Cameroon', mobileCode: '237' },
    { code: 'CA', name: 'Canada', mobileCode: '1' },
    { code: 'CV', name: 'Cape Verde', mobileCode: '238' },
    { code: 'KY', name: 'Cayman Islands', mobileCode: '345' },
    { code: 'CF', name: 'Central African Republic', mobileCode: '236' },
    { code: 'TD', name: 'Chad', mobileCode: '235' },
    { code: 'CL', name: 'Chile', mobileCode: '56' },
    { code: 'CN', name: 'China', mobileCode: '86' },
    { code: 'CX', name: 'Christmas Island', mobileCode: '61' },
    { code: 'CC', name: 'Cocos (Keeling) Islands', mobileCode: '61' },
    { code: 'CO', name: 'Colombia', mobileCode: '57' },
    { code: 'KM', name: 'Comoros', mobileCode: '269' },
    { code: 'CG', name: 'Congo', mobileCode: '242' },
    { code: 'CD', name: 'The Democratic Republic of the Congo', mobileCode: '243' },
    { code: 'CK', name: 'Cook Islands', mobileCode: '682' },
    { code: 'CR', name: 'Costa Rica', mobileCode: '506' },
    { code: 'CI', name: "Cote d'Ivoire", mobileCode: '225' },
    { code: 'HR', name: 'Croatia', mobileCode: '385' },
    { code: 'CU', name: 'Cuba', mobileCode: '53' },
    { code: 'CY', name: 'Cyprus', mobileCode: '357' },
    { code: 'CZ', name: 'Czech Republic', mobileCode: '420' },
    { code: 'DK', name: 'Denmark', mobileCode: '45' },
    { code: 'DJ', name: 'Djibouti', mobileCode: '253' },
    { code: 'DM', name: 'Dominica', mobileCode: '1767' },
    { code: 'DO', name: 'Dominican Republic', mobileCode: '1849' },
    { code: 'EC', name: 'Ecuador', mobileCode: '593' },
    { code: 'EG', name: 'Egypt', mobileCode: '20' },
    { code: 'SV', name: 'El Salvador', mobileCode: '503' },
    { code: 'GQ', name: 'Equatorial Guinea', mobileCode: '240' },
    { code: 'ER', name: 'Eritrea', mobileCode: '291' },
    { code: 'EE', name: 'Estonia', mobileCode: '372' },
    { code: 'ET', name: 'Ethiopia', mobileCode: '251' },
    { code: 'FK', name: 'Falkland Islands (Malvinas)', mobileCode: '500' },
    { code: 'FO', name: 'Faroe Islands', mobileCode: '298' },
    { code: 'FJ', name: 'Fiji', mobileCode: '679' },
    { code: 'FI', name: 'Finland', mobileCode: '358' },
    { code: 'FR', name: 'France', mobileCode: '33' },
    { code: 'GF', name: 'French Guiana', mobileCode: '594' },
    { code: 'PF', name: 'French Polynesia', mobileCode: '689' },
    { code: 'GA', name: 'Gabon', mobileCode: '241' },
    { code: 'GM', name: 'Gambia', mobileCode: '220' },
    { code: 'GE', name: 'Georgia', mobileCode: '995' },
    { code: 'DE', name: 'Germany', mobileCode: '49' },
    { code: 'GH', name: 'Ghana', mobileCode: '233' },
    { code: 'GI', name: 'Gibraltar', mobileCode: '350' },
    { code: 'GR', name: 'Greece', mobileCode: '30' },
    { code: 'GL', name: 'Greenland', mobileCode: '299' },
    { code: 'GD', name: 'Grenada', mobileCode: '1473' },
    { code: 'GP', name: 'Guadeloupe', mobileCode: '590' },
    { code: 'GU', name: 'Guam', mobileCode: '1671' },
    { code: 'GT', name: 'Guatemala', mobileCode: '502' },
    { code: 'GG', name: 'Guernsey', mobileCode: '44' },
    { code: 'GN', name: 'Guinea', mobileCode: '224' },
    { code: 'GW', name: 'Guinea-Bissau', mobileCode: '245' },
    { code: 'GY', name: 'Guyana', mobileCode: '595' },
    { code: 'HT', name: 'Haiti', mobileCode: '509' },
    { code: 'VA', name: 'Holy See (Vatican City State)', mobileCode: '379' },
    { code: 'HN', name: 'Honduras', mobileCode: '504' },
    { code: 'HK', name: 'Hong Kong', mobileCode: '852' },
    { code: 'HU', name: 'Hungary', mobileCode: '36' },
    { code: 'IS', name: 'Iceland', mobileCode: '354' },
    { code: 'IN', name: 'India', mobileCode: '91' },
    { code: 'ID', name: 'Indonesia', mobileCode: '62' },
    { code: 'IR', name: 'Iran, Islamic Republic of Persian Gulf', mobileCode: '98' },
    { code: 'IQ', name: 'Iraq', mobileCode: '964' },
    { code: 'IE', name: 'Ireland', mobileCode: '353' },
    { code: 'IM', name: 'Isle of Man', mobileCode: '44' },
    { code: 'IL', name: 'Israel', mobileCode: '972' },
    { code: 'IT', name: 'Italy', mobileCode: '39' },
    { code: 'JM', name: 'Jamaica', mobileCode: '1876' },
    { code: 'JP', name: 'Japan', mobileCode: '81' },
    { code: 'JE', name: 'Jersey', mobileCode: '44' },
    { code: 'JO', name: 'Jordan', mobileCode: '962' },
    { code: 'KZ', name: 'Kazakhstan', mobileCode: '77' },
    { code: 'KE', name: 'Kenya', mobileCode: '254' },
    { code: 'KI', name: 'Kiribati', mobileCode: '686' },
    { code: 'KP', name: "Democratic People's Republic of Korea", mobileCode: '850' },
    { code: 'KR', name: 'Republic of South Korea', mobileCode: '82' },
    { code: 'KW', name: 'Kuwait', mobileCode: '965' },
    { code: 'KG', name: 'Kyrgyzstan', mobileCode: '996' },
    { code: 'LA', name: 'Laos', mobileCode: '856' },
    { code: 'LV', name: 'Latvia', mobileCode: '371' },
    { code: 'LB', name: 'Lebanon', mobileCode: '961' },
    { code: 'LS', name: 'Lesotho', mobileCode: '266' },
    { code: 'LR', name: 'Liberia', mobileCode: '231' },
    { code: 'LY', name: 'Libyan Arab Jamahiriya', mobileCode: '218' },
    { code: 'LI', name: 'Liechtenstein', mobileCode: '423' },
    { code: 'LT', name: 'Lithuania', mobileCode: '370' },
    { code: 'LU', name: 'Luxembourg', mobileCode: '352' },
    { code: 'MO', name: 'Macao', mobileCode: '853' },
    { code: 'MK', name: 'Macedonia', mobileCode: '389' },
    { code: 'MG', name: 'Madagascar', mobileCode: '261' },
    { code: 'MW', name: 'Malawi', mobileCode: '265' },
    { code: 'MY', name: 'Malaysia', mobileCode: '60' },
    { code: 'MV', name: 'Maldives', mobileCode: '960' },
    { code: 'ML', name: 'Mali', mobileCode: '223' },
    { code: 'MT', name: 'Malta', mobileCode: '356' },
    { code: 'MH', name: 'Marshall Islands', mobileCode: '692' },
    { code: 'MQ', name: 'Martinique', mobileCode: '596' },
    { code: 'MR', name: 'Mauritania', mobileCode: '222' },
    { code: 'MU', name: 'Mauritius', mobileCode: '230' },
    { code: 'YT', name: 'Mayotte', mobileCode: '262' },
    { code: 'MX', name: 'Mexico', mobileCode: '52' },
    { code: 'FM', name: 'Federated States of Micronesia', mobileCode: '691' },
    { code: 'MD', name: 'Moldova', mobileCode: '373' },
    { code: 'MC', name: 'Monaco', mobileCode: '377' },
    { code: 'MN', name: 'Mongolia', mobileCode: '976' },
    { code: 'ME', name: 'Montenegro', mobileCode: '382' },
    { code: 'MS', name: 'Montserrat', mobileCode: '1664' },
    { code: 'MA', name: 'Morocco', mobileCode: '212' },
    { code: 'MZ', name: 'Mozambique', mobileCode: '258' },
    { code: 'MM', name: 'Myanmar', mobileCode: '95' },
    { code: 'NA', name: 'Namibia', mobileCode: '264' },
    { code: 'NR', name: 'Nauru', mobileCode: '674' },
    { code: 'NP', name: 'Nepal', mobileCode: '977' },
    { code: 'NL', name: 'Netherlands', mobileCode: '31' },
    { code: 'AN', name: 'Netherlands Antilles', mobileCode: '599' },
    { code: 'NC', name: 'New Caledonia', mobileCode: '687' },
    { code: 'NZ', name: 'New Zealand', mobileCode: '64' },
    { code: 'NI', name: 'Nicaragua', mobileCode: '505' },
    { code: 'NE', name: 'Niger', mobileCode: '227' },
    { code: 'NU', name: 'Niue', mobileCode: '683' },
    { code: 'NF', name: 'Norfolk Island', mobileCode: '672' },
    { code: 'MP', name: 'Northern Mariana Islands', mobileCode: '1670' },
    { code: 'NO', name: 'Norway', mobileCode: '47' },
    { code: 'OM', name: 'Oman', mobileCode: '968' },
    { code: 'PK', name: 'Pakistan', mobileCode: '92' },
    { code: 'PW', name: 'Palau', mobileCode: '680' },
    { code: 'PS', name: 'Palestinian Territory', mobileCode: '970' },
    { code: 'PA', name: 'Panama', mobileCode: '507' },
    { code: 'PG', name: 'Papua New Guinea', mobileCode: '675' },
    { code: 'PY', name: 'Paraguay', mobileCode: '595' },
    { code: 'PE', name: 'Peru', mobileCode: '51' },
    { code: 'PH', name: 'Philippines', mobileCode: '63' },
    { code: 'PN', name: 'Pitcairn', mobileCode: '872' },
    { code: 'PL', name: 'Poland', mobileCode: '48' },
    { code: 'PT', name: 'Portugal', mobileCode: '351' },
    { code: 'PR', name: 'Puerto Rico', mobileCode: '1939' },
    { code: 'QA', name: 'Qatar', mobileCode: '974' },
    { code: 'RO', name: 'Romania', mobileCode: '40' },
    { code: 'RU', name: 'Russia', mobileCode: '7' },
    { code: 'RW', name: 'Rwanda', mobileCode: '250' },
    { code: 'RE', name: 'Reunion', mobileCode: '262' },
    { code: 'BL', name: 'Saint Barthelemy', mobileCode: '590' },
    { code: 'SH', name: 'Saint Helena', mobileCode: '290' },
    { code: 'KN', name: 'Saint Kitts and Nevis', mobileCode: '1869' },
    { code: 'LC', name: 'Saint Lucia', mobileCode: '1758' },
    { code: 'MF', name: 'Saint Martin', mobileCode: '590' },
    { code: 'PM', name: 'Saint Pierre and Miquelon', mobileCode: '508' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines', mobileCode: '1784' },
    { code: 'WS', name: 'Samoa', mobileCode: '685' },
    { code: 'SM', name: 'San Marino', mobileCode: '378' },
    { code: 'ST', name: 'Sao Tome and Principe', mobileCode: '239' },
    { code: 'SA', name: 'Saudi Arabia', mobileCode: '966' },
    { code: 'SN', name: 'Senegal', mobileCode: '221' },
    { code: 'RS', name: 'Serbia', mobileCode: '381' },
    { code: 'SC', name: 'Seychelles', mobileCode: '248' },
    { code: 'SL', name: 'Sierra Leone', mobileCode: '232' },
    { code: 'SG', name: 'Singapore', mobileCode: '65' },
    { code: 'SK', name: 'Slovakia', mobileCode: '421' },
    { code: 'SI', name: 'Slovenia', mobileCode: '386' },
    { code: 'SB', name: 'Solomon Islands', mobileCode: '677' },
    { code: 'SO', name: 'Somalia', mobileCode: '252' },
    { code: 'ZA', name: 'South Africa', mobileCode: '27' },
    { code: 'SS', name: 'South Sudan', mobileCode: '211' },
    { code: 'GS', name: 'South Georgia and the South Sandwich Islands', mobileCode: '500' },
    { code: 'ES', name: 'Spain', mobileCode: '34' },
    { code: 'LK', name: 'Sri Lanka', mobileCode: '94' },
    { code: 'SD', name: 'Sudan', mobileCode: '249' },
    { code: 'SR', name: 'Suriname', mobileCode: '597' },
    { code: 'SJ', name: 'Svalbard and Jan Mayen', mobileCode: '47' },
    { code: 'SZ', name: 'Swaziland', mobileCode: '268' },
    { code: 'SE', name: 'Sweden', mobileCode: '46' },
    { code: 'CH', name: 'Switzerland', mobileCode: '41' },
    { code: 'SY', name: 'Syrian Arab Republic', mobileCode: '963' },
    { code: 'TW', name: 'Taiwan', mobileCode: '886' },
    { code: 'TJ', name: 'Tajikistan', mobileCode: '992' },
    { code: 'TZ', name: 'Tanzania', mobileCode: '255' },
    { code: 'TH', name: 'Thailand', mobileCode: '66' },
    { code: 'TL', name: 'Timor-Leste', mobileCode: '670' },
    { code: 'TG', name: 'Togo', mobileCode: '228' },
    { code: 'TK', name: 'Tokelau', mobileCode: '690' },
    { code: 'TO', name: 'Tonga', mobileCode: '676' },
    { code: 'TT', name: 'Trinidad and Tobago', mobileCode: '1868' },
    { code: 'TN', name: 'Tunisia', mobileCode: '216' },
    { code: 'TR', name: 'Turkey', mobileCode: '90' },
    { code: 'TM', name: 'Turkmenistan', mobileCode: '993' },
    { code: 'TC', name: 'Turks and Caicos Islands', mobileCode: '1649' },
    { code: 'TV', name: 'Tuvalu', mobileCode: '688' },
    { code: 'UG', name: 'Uganda', mobileCode: '256' },
    { code: 'UA', name: 'Ukraine', mobileCode: '380' },
    { code: 'AE', name: 'United Arab Emirates', mobileCode: '971' },
    { code: 'UY', name: 'Uruguay', mobileCode: '598' },
    { code: 'UZ', name: 'Uzbekistan', mobileCode: '998' },
    { code: 'VU', name: 'Vanuatu', mobileCode: '678' },
    { code: 'VE', name: 'Venezuela', mobileCode: '58' },
    { code: 'VN', name: 'Vietnam', mobileCode: '84' },
    { code: 'VG', name: 'British Virgin Islands', mobileCode: '1284' },
    { code: 'VI', name: 'U.S. Virgin Islands', mobileCode: '1340' },
    { code: 'WF', name: 'Wallis and Futuna', mobileCode: '681' },
    { code: 'YE', name: 'Yemen', mobileCode: '967' },
    { code: 'ZM', name: 'Zambia', mobileCode: '260' },
    { code: 'ZW', name: 'Zimbabwe', mobileCode: '263' }
  ];

  useEffect(() => {
    setCountries(allCountries);
    
    // Auto-check availability if country is pre-selected
    if (selectedCountry) {
      checkAvailability(selectedCountry);
    }
  }, [selectedCountry]);

  // Mock API function for checking availability
  // This will be replaced with actual 5Sim API integration later
  const checkAvailability = async (countryCode: string) => {
    setIsCheckingAvailability(true);
    setError(null);
    setAvailability(null);

    try {
      // Simulate API call to 5Sim API
      // In the future, this will be a real API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock response - replace with actual 5Sim API response
      const mockResponse: NumberAvailability = {
        country: countryCode,
        available: true,
        price: '₦500',
        operators: ['WhatsApp', 'Telegram', 'Instagram', 'Facebook', 'Twitter'],
        count: Math.floor(Math.random() * 100) + 50
      };

      setAvailability(mockResponse);
    } catch (err) {
      setError('Failed to check availability. Please try again.');
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry) {
      setError('Please select a country');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check availability first
      await checkAvailability(selectedCountry);
      
      // Navigate to number selection page with country info
      navigate(`/select-number?country=${selectedCountry}&price=${availability?.price || '₦500'}`);
    } catch (err) {
      setError('Failed to process request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setError(null);
    setAvailability(null);
    
    // Update URL
    const params = new URLSearchParams();
    if (countryCode) {
      params.set('country', countryCode);
    }
    navigate(`${window.location.pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="font-bold text-xl md:text-2xl text-gray-900">
          Get a Number
        </h2>
      </div>

      {/* Country Selection Form */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-900">
              Select Country
            </label>
            <select
              id="country"
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-nova-primary focus:border-nova-primary"
              required
            >
              <option value="">Choose a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} (+{country.mobileCode})
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !selectedCountry}
            className="text-white bg-nova-navy hover:bg-nova-secondary font-medium rounded-md text-sm px-8 py-3 text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Availability Results */}
      {isCheckingAvailability && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin text-nova-primary" />
            <span className="ml-3 text-gray-600">Checking availability...</span>
          </div>
        </div>
      )}

      {availability && !isCheckingAvailability && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Numbers Available for {countries.find(c => c.code === availability.country)?.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Available Numbers</p>
                <p className="text-2xl font-bold text-gray-900">{availability.count}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Starting Price</p>
                <p className="text-2xl font-bold text-gray-900">{availability.price}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Supported Services</p>
                <p className="text-2xl font-bold text-gray-900">{availability.operators.length}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Supported Services:</p>
              <div className="flex flex-wrap gap-2">
                {availability.operators.map((operator, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-nova-primary/20 text-nova-navy rounded-full text-sm font-medium"
                  >
                    {operator}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate(`/select-number?country=${availability.country}&price=${availability.price}`)}
                className="w-full bg-gradient-to-r from-nova-primary to-nova-secondary text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <span>Select Number</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popular Countries */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Countries</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['US', 'UK', 'NG', 'CA', 'AU', 'DE', 'FR', 'IN'].map((code) => {
            const country = countries.find(c => c.code === code);
            if (!country) return null;
            
            return (
              <button
                key={code}
                onClick={() => handleCountryChange(code)}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedCountry === code 
                    ? 'border-nova-primary bg-nova-primary/10 text-nova-navy' 
                    : 'border-gray-200 hover:border-nova-primary hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-medium">{country.name}</div>
                <div className="text-xs text-gray-500">+{country.mobileCode}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-nova-primary/10 to-nova-secondary/10 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Globe className="w-6 h-6 text-nova-primary mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">About Our Numbers</h4>
            <p className="text-sm text-gray-600 mb-3">
              We provide high-quality virtual numbers from 500+ countries worldwide. All numbers are non-VoIP and compatible with major services like WhatsApp, Telegram, and more.
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Instant delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>100% compatible with all services</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>24/7 customer support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNumberPage;
