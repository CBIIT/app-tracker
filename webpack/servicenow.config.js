const servicenowConfig = {
  /**
   * This is a default prefix for all ServiceNow APIs
   * should not be changed
   */
  REST_API_PATH: '/api',
  /**
   * ServiceNow instance URL for REST calls
   * it is being used in DEVELOPMENT mode only
   * This should be the instance where React application will be deployed to
   */
  SERVICENOW_INSTANCE: 'https://service-dev2.nci.nih.gov/',
  /**
   * User Name for API requests
   * it is being used for sending REST calls in DEVELOPMENT mode only
   * no need to provide credentials for PRODUCTION
   */
  REACT_APP_USER: '',
  /**
   * 
   * User password, for DEVELOPMENT mode only
   */
  REACT_APP_PASSWORD: '',
  /**
   * 
   * ServiceNow path to GET resource which serves javascript files
   * Current configuration does not produce CSS files
   * CSS code will be embedded into javascript files
   */
  JS_API_PATH: 'api/x_g_nci_app_tracke/container/js/',
  /**
   * ServiceNow path to GET resource which serves
   * Image files (png, jpg, gif)
   * SVG files will be embedded into javascript files
   */
  IMG_API_PATH: 'api/x_g_nci_app_tracke/container/img/',
  /**
   * ServiceNow path to GET resource which serves
   * other files, like fonts etc.
   */
  ASSETS_API_PATH: 'api/x_g_nci_app_tracke/container/other_assets/',
  /**
   * fonts and images below this size will be put inside
   * JS chunks, instead of being saved as separate files
   */
  ASSET_SIZE_LIMIT: 10000,
}

module.exports = servicenowConfig
