import { _ } from "core-js";

(function () {
    'use strict';
  
    angular
      .module('angularjs.my-custom-shell')
      .controller('ShellController', ShellController);
      
    /**
     * Main controler.
     */
    function ShellController (
      $scope,
      $http,
      $routeParams,
      c8yBase,
      c8yAlert,
      c8yDeviceControl
      ) { 
        
      var ctrl = this;
      ctrl.sendingCommand = false;

      ctrl.commandDeliveryType = 'CUSTOM_PROVIDER'; //default, you can put here whatever you want
      ctrl.standardDeliveryTypes = ['CUSTOM_PROVIDER']; //list of options displayed in the UI

      var MICRO_SERVICE_ENDPOINT = '';//example; 'service/nameoftheservice/method'; 
  
      ctrl.execute = function(command, commandDeliveryType) {

          console.log('Sending the operation and trigger the custom service', command, commandDeliveryType);

          ctrl.sendingCommand = true;

          //we use the operations variable from the child controller
          if(!$scope.$$childTail.operations) {
            $scope.$$childTail.operations = [];
          }

          var operation = createOperation(command, commandDeliveryType);

          c8yDeviceControl.createWithNotifications(operation).then(function (operationPromises) {

            ctrl.sendingCommand = false;
            c8yAlert.success('Command sent.');

            //for promise created, the value returned is the id of the operation
            operationPromises.created.then(function(operationId) {

                c8yAlert.success(operation.description + ' created.');

                console.log('operationResult', operationId, operation);

                c8yDeviceControl.detail(operationId).then(function (res) {
                  $scope.$$childTail.operations.push(res.data);
                });

                //we can call a service here using the operation id returned to trigger an action
                $http.get(
                  c8yBase.url(MICRO_SERVICE_ENDPOINT) + '?' + $.param({operationId: operationId}), 
                  {headers: c8yBase.contentHeaders(MICRO_SERVICE_ENDPOINT)}
                )
                .then(function(response){
                  console.log('response', response);                
                })
                .catch(function(error) {
    
                    ctrl.isLoading = false;
            
                    c8yAlert.danger('An error occurred trying to start the devices: <br> ' + error.data);
                    console.error(error);
                });
            });

            //for the promise completed
            operationPromises.completed.then(function (operationResult) {
              if (operationResult.status === c8yDeviceControl.status.SUCCESSFUL) {
                  console.log('Completed', operationResult);
              }
              else if (operationResult.status === c8yDeviceControl.status.FAILED) {
                  console.log('Failed', operationResult); 
              }
              c8yAlert.success('Command status updated.');
              _.assign(operation, operationResult);
            });
          });
      };

      function createOperation(command, deliveryType) {
        return {
            deviceId: $routeParams.deviceId,
            description: "Execute shell command",
            deliveryType: deliveryType,
            c8y_Command: {
                text: command.text
            }
        }
      }

      function init() {
          
      }
      init();
      
      //events
      $scope.$on('$destroy', function () {
  
      });
    }
  }());
  