function getApiUrls(hostname: string) {
  if (hostname === 'localhost') {
    return {
      uatApiBaseUrl: 'http://localhost/uat_op_portal/api/rest/v1.0/',
      prodApiBaseUrl: 'http://localhost/op_portal/api/rest/v1.0/',
      uatOpPortalApiBaseUrl: 'http://localhost/uat_op_portal/api/',
      prodOpPortalApiBaseUrl: 'http://localhost/op_portal/api/',
    };
  }

  const base = hostname.includes('crmapps-tst') 
    ? 'https://crmapps-tst.husqvarnagroup.com'
    : 'https://crmapps.husqvarnagroup.com';

  return {
    uatApiBaseUrl: `${base}/uat_op_portal/api/rest/v1.0/`,
    prodApiBaseUrl: `${base}/op_portal/api/rest/v1.0/`,
    uatOpPortalApiBaseUrl: `${base}/uat_op_portal/api/`,
    prodOpPortalApiBaseUrl: `${base}/op_portal/api/`,
  };
}

const {
  uatApiBaseUrl,
  prodApiBaseUrl,
  uatOpPortalApiBaseUrl,
  prodOpPortalApiBaseUrl
} = getApiUrls(window.location.hostname);

export const environment = {
  production: false,
  enableUrlEncryption: true,
  assetUrl: '/assets/',
  name: '(UAT)',
  CRMURL: 'https://husqvarna.custhelp.com/cc/husqvarna_api/',
  uatApiBaseUrl,
  prodApiBaseUrl,
  uatOpPortalApiBaseUrl,
  prodOpPortalApiBaseUrl,
  tokenGenerationEnabled: false
};