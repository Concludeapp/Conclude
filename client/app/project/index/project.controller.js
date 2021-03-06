'use strict';

class ProjectController {

  constructor(Auth, $state, $scope, $http, $stateParams, $anchorScroll, $location, $uibModal, project, $window) {
    this.Auth = Auth;
    this.$state = $state;
    this.$http = $http;
    this.$scope = $scope;
    this.$window = $window;
    this.modal = $uibModal;

    this.project = project.data
    this.implicationsTab = 'Product'

    // this.viewPersona(project.data.personas[0])

    var me = this.me = Auth.getCurrentUser()
    var self = this;

    var blurAll = function() {
      var tmp = document.createElement("input");
      tmp.className = 'blur'
      document.body.appendChild(tmp);
      tmp.focus();
      document.body.removeChild(tmp);
    }
    /*
    $scope.$DragControls = {
      // accept: function (sourceItemHandleScope, destSortableScope) {return true},
      accept: false,
      containerPositioning: 'relative',
      containment: '#section-8'
    }
    */
    $scope.$DragControls = {
      'ui-floating': false,
      handle: '.move',
      tolerance: 'pointer',
      disabled: $scope.enableDrag,
      placeholder: 'ui-sortable-placeholder'
    }
    $scope.persona_search = []
    $scope.method_search = []
    $scope.textConfig = {
      inline: true,
      menubar: false,
      toolbar: "bold italic underline strikethrough | bullist numlist outdent indent | blockquote hr link image | undo redo | cancel save",
      skin: "minimal",
      plugins: "autoresize code fullscreen",
      setup: function (editor) {
        editor.addButton('cancel', {
          icon: 'close',
          title: 'Cancel Changes',
          onclick: function () {
            return blurAll()
          }
        });
        editor.addButton('save', {
          icon: 'save',
          title: 'Save Project',
          onclick: function () {
            self.quickSave()
            return blurAll()
          }
        });
        editor.on('keydown', function(e) {
          if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
            self.quickSave()
            return blurAll()
          }
        });
      }
    }
    $scope.titleConfig = {
      inline: true,
      menubar: false,
      toolbar: "undo redo | cancel save",
      skin: "minimal",
      plugins: "autoresize code",
      setup: function (editor) {
        editor.addButton('cancel', {
          icon: 'close',
          title: 'Cancel',
          onclick: function () {
            return blurAll()
          }
        });
        editor.addButton('save', {
          icon: 'save',
          title: 'Save',
          onclick: function () {
            self.quickSave()
            return blurAll()
          }
        });
        editor.on('keydown', function(e) {
          if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
            self.quickSave()
            return blurAll()
          }
        });
      }
    }
    $scope.slickConfig = {
      adaptiveHeight: true,
      autoplay: false,
      draggable: false,
      arrows: false,
      dots: true,
      slide: '.quote'
    }

    if (this.project.users.length > 1) {
      var index = _.findIndex(this.project.users, function(u) {
        return u.user._id === me._id;
      });
      if (index > -1) {
        this.project.user = this.project.users[index]._id;
        this.project.notifications = this.project.users[index].notifications ? this.project.users[index].notifications : '';
        this.project.users[index].notifications = this.project.notifications;
      }
    }
    /* Edit Project */
    $scope.fileTypes = [
      {
        label: 'Text',
        value: 'text'
      },
      {
        label: 'Video',
        value: 'video'
      },
      {
        label: 'Audio',
        value: 'audio'
      },
      {
        label: 'Image',
        value: 'image'
      },
      {
        label: 'PDF',
        value: 'pdf'
      },
      {
        label: 'Spreadsheet',
        value: 'spreadsheet'
      },
      {
        label: 'Presentation',
        value: 'presentation'
      },
      {
        label: 'Folder',
        value: 'folder'
      }
    ];
    $scope.$watch('$prjct.show', function(n,o) {
      var goTo = angular.element('#section-'+angular.element('[data-section].active').attr('data-section'));
      if (n === 'EditProject') {
        $scope.loading = true;
        $http.get('/api/personas')
          .then(res => {
            return $scope.personas = res.data;
          })
        $http.get('/api/taxonomy/categories')
          .then(res => {
            return $scope.$categories = res.data;
          })
        $http.get('/api/taxonomy/subcategories')
          .then(res => {
            return $scope.$subcategories = res.data;
          })
        $http.get('/api/products')
          .then(res => {
            return $scope.$products = res.data;
          });
        $http.get('/api/research-methods')
          .then(res => {
            return $scope.$methods = res.data;
          });
        $http.get('/api/users')
          .then(res => {
            if (project.data.researcher) {
              $scope.selected = _.findIndex(res.data, {_id: project.data.researcher._id});
            }
            return $scope.$users = res.data;
          });
        $http.get('/api/tags')
          .then(res => {
            $scope.theTags = res.data;
            $scope.loadTags = function(v) {
              var theTags = res.data
              return _.filter(theTags, function(o) { return o.pretty.includes(v) })
            }
          })
        setTimeout(function() {
          $window.dispatchEvent(new Event('resize'));
        }, 100)
        setTimeout(function() {
          return $scope.loading = false;
        }, 300)
      }
    });

    /*
    $scope.$watch('$prjct.project.notifications', function(n,o) {
      if (n!=o) {
        $scope.$prjct.updatingNotifications = true;
        $scope.$prjct.project.users[index].notifications = $scope.$prjct.project.notifications;
        $http.put('/api/projects/'+$scope.$prjct.project._id, $scope.$prjct.project)
          .then(res => {
            $scope.$prjct.updatingNotifications = false;
            return $scope.$prjct.project.__v = res.data.__v;
          });
      }
    });
    */
  }

  setNotificationSettings() {
    var self = this;
    self.updatingNotifications = true;
    if (self.project.users.length > 1) {
      var index = _.findIndex(self.project.users, function(u) {
        return u.user._id === self.me._id;
      });
      self.project.users[index].notifications = self.project.notifications;
    } else {
      self.project.users.push({user: self.me._id, notifications: self.project.notifications});
    }
    return self.$http.put('/api/projects/'+self.project._id, self.project)
      .then(res => {
        self.updatingNotifications = false;
        return this.project.__v = res.data.__v;
      });
  }

  showMenuItem(item) {
    this.ShowSidebar = false;
    if (item === 'EditProject') {
      this.$scope.enableDrag = true;
    } else {
      this.$scope.enableDrag = false;
    }
    return this.show = (this.show === item ? '' : item);
  }

  saveProject() {
    this.$scope.loading = true
    this.$http.put('/api/projects/'+this.project._id, this.project)
      .then(res => {
        this.show = '';
        this.$http.get('/api/projects/'+res.data._id)
          .then(res => {
            this.$scope.slickConfig.enabled = true;
            this.show = '';
            this.ShowSidebar = false;
            this.project = res.data;
            var self = this;
            return setTimeout(function() {
              self.$scope.loading = false;
            }, 300)
          })
      })
  }

  quickSave() {
    // this.$scope.loading = true
    this.$http.put('/api/projects/'+this.project._id, this.project)
      .then(res => {
        this.project.__v = res.__v;
        this.project.updatedAt = res.data.updatedAt;
        // console.log(this.project.updatedAt, res.updatedAt)
        return document.activeElement.blur()
      })
  }

  cancelEdits() {
    this.$scope.loading = true
    this.$http.get('/api/projects/'+this.project._id)
      .then(res => {
        this.ShowSidebar = false;
        this.show = '';
        this.project = res.data;
        var self = this;
        return setTimeout(function() {
          self.$scope.loading = false;
        }, 300)
      })
  }

  addComment() {
    if (!this.comment) {
      return this.NoComment = true
    }
    var comment = {
      user: this.me.name,
      comment: this.comment
    }
    this.project.comments.push(comment);
    this.saveProject()
    return this.NoComment = this.comment = null;
  }

  addKeyFindings() {
    var self = this
    this.modal.open({
      templateUrl: '/components/key-findings/key-findings.html',
      controller: 'KeyFindingsModalController',
      resolve: {
        params: function() {
          return {'project': self.project}
        }
      }
    })
  }

  addDirectQuotes() {
    var self = this
    this.modal.open({
      templateUrl: '/components/direct-quotes/direct-quotes.html',
      controller: 'DirectQuotesModalController',
      resolve: {
        params: function() {
          return {'project': self.project}
        }
      }
    })
  }

  addDecisions() {
    var self = this
    this.modal.open({
      templateUrl: '/components/decisions/decisions.html',
      controller: 'DecisionsModalController',
      resolve: {
        params: function() {
          return {'project': self.project}
        }
      }
    })
  }

  addImplications() {
    var self = this
    this.modal.open({
      templateUrl: '/components/implications/implications.html',
      controller: 'ImplicationsModalController',
      resolve: {
        params: function() {
          return {'project': self.project}
        }
      }
    })
  }

  viewPersona(persona) {
    var self = this
    this.modal.open({
      templateUrl: '/components/persona/persona.html',
      controller: 'PersonaModalController',
      size: 'lg',
      resolve: {
        params: function() {
          return {'project': persona}
        }
      }
    })
  }

  createTag(tag) {
    if (!_.include(this.theTags, tag.pretty)) {
      this.$http.post('/api/tags', tag)
        .then((res) => {
          var index = _.findIndex(this.project.taxonomy.tags, function(o) { return o.pretty == res.data.pretty; })
          this.project.taxonomy.tags.splice(index, 1);
          this.project.taxonomy.tags.push(res.data);
          return res.data;
        })
    }
    return
  }

  setTab(title) {
    return this.implicationsTab = title;
  }

  sendNotifications() {
    this.$http.get('/api/projects/notifications')
      .then(res => {
        return console.log(res)
      })
  }

  setFocus(section) {
    angular.element('#'+section).find('[contenteditable]')[0].focus()
    return this.$scope.editSection = section;
  }

}

angular.module('concludeApp')
  .controller('ProjectController', ProjectController);