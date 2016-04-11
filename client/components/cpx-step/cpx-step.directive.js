'use strict';


let initTime = Date.now();


angular.module('cpxApp')
  .directive('cpxStep', function ($timeout, cpx, smoothScroll, $log) {
    return {
      templateUrl: 'components/cpx-step/cpx-step.html',
      restrict: 'E',
      transclude: true,
      scope: {
        name: '@',
        title: '@',
        model: '=',
        fields: '=',
        step: '=',
        hideBack: '='
      },
      link: function (scope, element, attrs) {

        return init();

        function init(){
          $log.debug(scope.hideBack);
          scope.undo = cpx.uncompleteStep;
          scope.stepBack = cpx.stepBack.bind(scope.name);
          scope.getModel = getModel;
          scope.submit = submit;
          scope.scrollToStep = cpx.scrollToStep;


          if(Date.now() - initTime <= 500){
            //Has to be a nicer way to do this
            $timeout(() => window.scrollTo(0,0),200);
            $timeout(() => window.scrollTo(0,0),300);
          }

          //TODO ensure the container is there
          //Add a timeout to the scroll so the user can register their click
          $timeout(scrollIfNotComplete, 400);
        }

        function scrollIfNotComplete(){
          if( ! isStepComplete() && ! isFirstStep()) {
            $log.debug(`Scrolling to incomplete step ${scope.name}`);
            smoothScroll(element[0]);
          }
        }

        function isFirstStep(){
          return scope.name === 'welcome';
        }

        function isStepComplete(){
          if(scope.step && ! scope.step.isComplete){throw new Error(`Step does not have isComplete method : ${scope.name}`);}
          return scope.step && scope.step.isComplete();
        }


        function getModel(name){
          //return scope.model[name] ? scope.model[name] : scope.model[name] = {};
          return scope.model;
        }

        function submit(form) {

          $log.debug('form submit', scope.model, form.$valid);

          if(form.$valid) {

            //We want to reset the submitted state here so that error messages are not shown if the user tails back
            form.$submitted = false;

            return cpx.completeStep(scope.name);
          }
        }


      }
    };
  });
