'use strict';

class Q2Controller {
  constructor(Auth, $state, $scope, $rootScope) {

    this.Auth = Auth;
    this.$state = $state;

    $scope.months = [
      {'label': 'January', 'value': '01'}, 
      {'label': 'February', 'value': '02'}, 
      {'label': 'March', 'value': '03'}, 
      {'label': 'April', 'value': '04'}, 
      {'label': 'May', 'value': '05'}, 
      {'label': 'June', 'value': '06'}, 
      {'label': 'July', 'value': '07'}, 
      {'label': 'August', 'value': '08'}, 
      {'label': 'September', 'value': '09'}, 
      {'label': 'October', 'value': '10'}, 
      {'label': 'November', 'value': '11'}, 
      {'label': 'December', 'value': '12'}, 
    ];
    $scope.days = [
      {'label': '01', 'value': '01'},
      {'label': '02', 'value': '02'},
      {'label': '03', 'value': '03'},
      {'label': '04', 'value': '04'},
      {'label': '05', 'value': '05'},
      {'label': '06', 'value': '06'},
      {'label': '08', 'value': '08'},
      {'label': '09', 'value': '09'},
      {'label': '10', 'value': '10'},
      {'label': '11', 'value': '11'},
      {'label': '12', 'value': '12'},
      {'label': '13', 'value': '13'},
      {'label': '14', 'value': '14'},
      {'label': '15', 'value': '15'},
      {'label': '16', 'value': '16'},
      {'label': '17', 'value': '17'},
      {'label': '18', 'value': '18'},
      {'label': '19', 'value': '19'},
      {'label': '20', 'value': '20'},
      {'label': '21', 'value': '21'},
      {'label': '22', 'value': '22'},
      {'label': '23', 'value': '23'},
      {'label': '24', 'value': '24'},
      {'label': '25', 'value': '25'},
      {'label': '26', 'value': '26'},
      {'label': '27', 'value': '27'},
      {'label': '28', 'value': '28'},
      {'label': '29', 'value': '29'},
      {'label': '30', 'value': '30'},
      {'label': '31', 'value': '31'}
    ]
    $scope.years = [
      {'label': 2016},
      {'label': 2017},
      {'label': 2018},
      {'label': 2019},
      {'label': 2020}
    ]
    $scope.adminYears = [
      {'label': 2005},
      {'label': 2006},
      {'label': 2007},
      {'label': 2008},
      {'label': 2009},
      {'label': 2010},
      {'label': 2011},
      {'label': 2012},
      {'label': 2013},
      {'label': 2014},
      {'label': 2015},
      {'label': 2016},
      {'label': 2017},
      {'label': 2018},
      {'label': 2019},
      {'label': 2020}
    ]
    $scope.$isAdmin = this.Auth.isAdmin();

    $scope.$project.endDate = $scope.$project.endDate ? $scope.$project.endDate : {}

  }

}

angular.module('concludeApp')
  .controller('Q2Controller', Q2Controller);
