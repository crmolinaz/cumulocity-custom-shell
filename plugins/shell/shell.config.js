(function () {
  'use strict';

  angular
    .module('angularjs.my-custom-shell')
    .config(configure);

  configure.$inject = [
    'c8yViewsProvider'
  ];

  function configure(
    c8yViewsProvider
  ) {
     
    c8yViewsProvider
      .when('/device/:deviceId/shell', { 
          templateUrl: ':::PLUGIN_PATH:::/views/shell.html', 
          controller: 'ShellController',
          controllerAs: 'ctrl'
      });
  }
}());