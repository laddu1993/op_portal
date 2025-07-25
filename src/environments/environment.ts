const hostname = window.location.hostname;

const getBaseUrls = (hostname: string) => {
  const isLocal = hostname === 'localhost';
  const isHusqvarna = hostname.includes('crmapps-tst.husqvarnagroup.com');

  const base = isLocal
    ? 'http://localhost'
    : isHusqvarna
    ? 'https://crmapps-tst.husqvarnagroup.com'
    : '';

  return {
    uatApiBaseUrl: `${base}/uat_op_portal/api/rest/v1.0/`,
    uatOpPortalApiBaseUrl: `${base}/uat_op_portal/api/`,
    prodApiBaseUrl: `${base}/op_portal/api/rest/v1.0/`,
    prodOpPortalApiBaseUrl: `${base}/op_portal/api/`
  };
};

const {
  uatApiBaseUrl,
  uatOpPortalApiBaseUrl,
  prodApiBaseUrl,
  prodOpPortalApiBaseUrl
} = getBaseUrls(hostname);

export const environment = {
  production: true,
  enableUrlEncryption: true,
  assetUrl: '/assets/', // Update this path based on your actual setup
  name: '(UAT)',
  CRMURL: 'https://husqvarna.custhelp.com/cc/husqvarna_api/',
  uatApiBaseUrl,
  uatOpPortalApiBaseUrl,
  prodApiBaseUrl,
  prodOpPortalApiBaseUrl,
  tokenGenerationEnabled: false
};