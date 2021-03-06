var bookmarkRepo = require('data/bookmark-repository'),
    tagGroupRepo = require('data/tag-group-repository');

module.exports = {
    name: 'AddCtrl',
    controller: function($scope, $location) {

        function getActiveTab() {
            if (chrome.tabs) {
                chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
                    // since only one tab should be active and in the current window at once
                    // the return variable should only have one entry
                    var activeTab = arrayOfTabs[0];
                    $scope.url = activeTab.url;
                    $scope.title = activeTab.title;
                });
            } else {
                $scope.url = window.location.href;
                $scope.title = window.document.title;
            }
        }

        tagGroupRepo.loadAllTagsToCache({});

        getActiveTab();

        $scope.getTags = function () {
            return tagGroupRepo.getAllTags();
        };

        $scope.go = function (path) {
            $location.path(path);
        };

        $scope.save = function () {
            tagGroupRepo.add($scope.selectedTags, {
                success: function (tagGroup) {
                    bookmarkRepo.add({
                        title: $scope.title,
                        url: $scope.url,
                        dateAdded: new Date(),
                        tagGroupId: tagGroup.id
                    }, {
                        success: function () {
                            go('/actions');
                        },
                        failure: function (results) {
                            console.log(results);
                        }
                    });
                }
            })
        };
    }
};

