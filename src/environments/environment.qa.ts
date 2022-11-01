export const environment = {
  production: true,
  reCaptchaV3SiteKey: '6Lc7Q9QZAAAAAFqsvvkI2k8ILZGL_Pwbsp71gPuS',
  api_url: 'https://api.qa.measuredskill.uat4.pgtest.co/v1/',
  api_url_short: '',
  host: 'https://api.qa.measuredskill.uat4.pgtest.co',
  url_webapp: 'http://webapp.qa.measuredskill.uat4.pgtest.co/',
  converge_ssl_vendor_id: 'sc777515',
  converge_host_payment: 'https://api.demo.convergepay.com/hosted-payments',
  converge_merchant_id: '0021507',
  converge_user_id: 'apiuser',
  converge_pin: 'KUHFSUCNH85L8P6FG50KD7VMHLVLXIVSPDLRXE1I1QJMW3O0ZZTCK1X2GC0QD7F7',
  nationalPhone: ['us', 'ca', 'vn'],
  ga: 'G-WDCECT02H3',
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
