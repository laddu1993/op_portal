export const environment = {
    production: false,
    enableUrlEncryption: true,
    assetUrl: '/assets/', // Update this path based on your actual setup
    name: "(UAT)",
    CRMURL: `https://husqvarna.custhelp.com/cc/husqvarna_api/`,
    uatApiBaseUrl: `https://crmapps.husqvarnagroup.com/uat_op_portal/api/rest/v1.0/`,
    prodApiBaseUrl: `https://crmapps.husqvarnagroup.com/op_portal/api/rest/v1.0/`,
    uatOpPortalApiBaseUrl: `https://crmapps.husqvarnagroup.com/uat_op_portal/api/`,
    prodOpPortalApiBaseUrl: `https://crmapps.husqvarnagroup.com/op_portal/api/`,
    tokenGenerationEnabled: false // Change to `false` if you want to disable token usage
}