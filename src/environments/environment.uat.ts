export const environment = {
  production: true,
  reCaptchaV3SiteKey: '6Lc7Q9QZAAAAAFqsvvkI2k8ILZGL_Pwbsp71gPuS',
  api_url_short: '',
  host: 'https://api.uat.measuredskill.uat4.pgtest.co',
  api_url: 'https://api.uat.measuredskill.uat4.pgtest.co/v1/',
  url_webapp: 'http://webapp.uat.measuredskill.uat4.pgtest.co/',
  converge_ssl_vendor_id: 'sc777515',
  converge_host_payment: 'https://api.demo.convergepay.com/hosted-payments',
  converge_merchant_id: '0021507',
  converge_user_id: 'apiuser',
  converge_pin: 'MQC538YHVJ7ABKNHKPYIKSU6QLHALGQOHWS0CNIVJ1NWLKK02Y9X09DCCUGPOO5D',
  nationalPhone: ['us', 'ca', 'vn'],
  ga: 'G-RGW0J0C2L1',
  GTM_UAT: 'GTM-TJ76L76',
  api_s3: 'https://cdns.measuredskills.com',
  phoneList: [
    {
      code: 'us',
      formatReg: new RegExp('/d+'),
      placeholder: '(xxx) xxx-xxxx'
    },
    {
      code: 'ca',
      formatReg: new RegExp('/d+'),
      placeholder: 'xxxxxxxxxx'
    },
    {
      code: 'vn',
      formatReg: new RegExp('/d+'),
      placeholder: 'xxxxxxxxxx'
    },
  ],
};
