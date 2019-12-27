//Declaring Global Variables
var currPage;
var bookCoverImg;   

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');
}

//Initiate Angular JS
var dlampWeb = angular.module('dlampWeb', []);

//Angualr JS Ajax Services - {Start}
dlampWeb.service('ajaxService', ['$http', '$q', function ($http, $q) {
    this.getresdata = function (url, method, dataparam) {
        var resdata = undefined;
        var deferred = $q.defer();
        var config = {
            url: url,
            method: method,
        }
        var dataconfig = {
            url: url,
            method: method,
            data: dataparam
        }
        var ajaxConfigdata = (dataparam) ? dataconfig : config;
        $http(ajaxConfigdata).then(function (result) {
            resdata = result.data;
            deferred.resolve(resdata);
        }, function (error) {
            resdata = error;
            deferred.reject(error);
        });
        resdata = deferred.promise;
        return $q.when(resdata);
    };
}]);
//Angualr JS Ajax Services - {End}

//FileModel Directive - {Starts}
dlampWeb.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
//FileModel Directive - {Ends}

//File Preview Directive - {Start}
dlampWeb.directive('fileinput', ['$parse', function ($parse) {
    return {
        scope: {
            fileinput: "=",
            filepreview: "=",
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.fileinput = changeEvent.target.files[0];
                if (/\.(jpe?g|png|gif)$/i.test(scope.fileinput.name)) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.filepreview = loadEvent.target.result;
                        });
                    };
                    if (scope.fileinput) {
                        reader.readAsDataURL(scope.fileinput);
                    } else {
                        scope.filepreview = '';
                    }
                }
            });
        }
    };
}]);
//File Preview Directive - {Ends}

//Angular JS Main Contoller - {Start}
dlampWeb.controller('mainController', ['$scope', 'ajaxService', function ($scope, ajaxService) {

    $scope.Search = false;

    $scope.testPush = function () {
        alert("pp");
        Push.create('Success');
    }

    var urlpath = window.location.pathname.toLocaleLowerCase(), userAliasName = $('#alias').val(), userfullname = $('#userName').val(), systemip = '', uploadImgFlag = false;
    //If it is home page - fetch booksList,eventsList,articlesList

    switch (urlpath) {
        case '/':
        case '/home/index':
            $scope.currTab = 0;
            $scope.currTabName = "d.l.amp";
            currPage = "Index";
            setImportantNotice();
            getRawData("courses");
            getRawData("books");
            getRawData("articles");
            firstTime = false;
            //getEventsList();
            break;

        case '/home/books':
            
            $scope.currTab = 2;
            $scope.currTabName = "Good Reads";
            currPage = "Good Reads";
            getRawData("books");
            createFilters("books");
            break;

        case '/home/eventsconf':
            $scope.currTab = 3;
            $scope.currTabName = "Events";
            currPage = "Events";
            getEventsList();
            break;

        case '/home/dojo':
            $scope.currTab = 1;
            $scope.currTabName = "Learning";
            currPage = "Learning";
            getRawData("courses");
            createFilters("courses");
            break;

        case '/home/articles':
            //$scope.currTab = 0;
            getRawData("articles");
            createFilters("articles");
            break;

        case '/home/newjoinee':
            break;
    }

    function setImportantNotice() {
        $scope.ang_noticeList = getImportantNotice();
    }

    function getImportantNotice() {
        data = [
            {
                tag: "Highly Recommended Training",
                title: "Introduction to Leadership Principles for Everyone",
                source: " MS Learning",
                bgImg: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            },
            {
                tag: "Highly Recommended Training",
                title: "Introduction to Leadership Principles for Everyone",
                source: " MS Learning",
                bgImg: "https://images.unsplash.com/photo-1552084117-56a987666449?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            },
            {
                tag: "Highly Recommended Training",
                title: "Introduction to Leadership Principles for Everyone",
                source: " MS Learning",
                bgImg: "https://images.unsplash.com/photo-1571056578894-51e67d466d44?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            },
            {
                tag: "Highly Recommended Training",
                title: "Introduction to Leadership Principles for Everyone",
                source: " MS Learning",
                bgImg: "https://images.unsplash.com/photo-1541977849862-fc84f7a42cf5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            }

        ];

        return data;

       // var importantNotice = { data: [{ "title": "testTitle1", "caption": "testCaption1" }, { "title": "testTitle2", "caption": "testCaption2" }] };
       // return importantNotice;


    }

    function getEventsList(eventID, getViewUpdateInfo) {
        ajaxService.getresdata('/Home/eventsList', 'POST').then(function (response) {
            if (response) {
                console.log(response);
                $scope.ang_eventsList = response;
            }
            else {
                console.log("failed");
            }
        });
    };

    function getRawData(segment) {

        switch (segment) {

            case "books":
                ajaxService.getresdata('/Home/booksList', 'POST').then(function (response) {
                    if (response) {
                        console.log("booksRawData = " + response);
                        renderTiles(response, "books");
                    }
                    else {
                        console.log("failed");
                    }
                });
                break;

            case "courses":
                ajaxService.getresdata('/Home/coursesList', 'POST').then(function (response) {
                    if (response) {
                        console.log("coursesRawData = " + response);
                        renderTiles(response, "courses");
                    }
                    else {
                        console.log("failed");
                    }
                });
                break;

            case "articles":
                ajaxService.getresdata('/Home/articlesList', 'POST').then(function (response) {
                    if (response) {
                        console.log("articlesRawData = " + response);
                        renderTiles(response, "articles");
                    }
                    else {
                        console.log("failed");
                    }
                });
                break;
        }

    }

    function createFilters(segment) {
        switch (segment) {

            case "books":
                $scope.bookTypes = [
                    { bookType: "All Types", value:"" },
                    { bookType: "e-books", value:"e-books" }
                ];

                $scope.bookCategories = [
                    { bookCategory: "All Categories", value:"" },
                    { bookCategory: "Others", value:"Others" }
                ];

                $scope.bookAuthors = [
                    { bookAuthor: "All Authors", value:"" },
                    { bookAuthor: "John Whalen", value:"John Whalen" }
                ];
                break;

            case "courses":
                $scope.courseTypes = [
                    { courseType: "All Courses", value:"" },
                    { courseType: "Soft Skills", value:"Soft Skills"},
                    { courseType: "Specialized Skills", value:"Specialized Skills"},
                    { courseType: "Tools Training", value:"Tools Training"},
                    { courseType: "Bing Specific", value:"Bing Specific" }
                ];

                $scope.courseSources = [
                    { courseSource: "All Sources", value:"" },
                    { courseSource: "LinkedIn", value:"LinkedIn" },
                    { courseSource: "Coursera", value:"Coursera" },
                    { courseSource: "Udemy", value:"Udemy" }
                ];
                break;

            case "articles":
                $scope.articleCategories = [
                    { articleCategory: "All Categories", value:""}
                ];

                $scope.articleSharedBys = [
                    { articleSharedBy: "All Folks", value:""}
                ];
                break;

        }
        
    }

    function renderTiles(tileData, segment) {
        var data = [];

        switch (segment) {
            case "books":
                for (i = 0; i < tileData.length; i++) {
                    data.push($scope.initParsing(tileData[i].BK_URL, tileData[i].BK_SharedBy, "books", tileData[i].BK_Type));
                }
                $scope.ang_booksList = data;
                break;

            case "courses":
                for (i = 0; i < tileData.length; i++) {
                        data.push($scope.initParsing(tileData[i].CR_URL, tileData[i].CR_SharedBy, "courses", tileData[i].CR_Type));
                        
                }
                $scope.ang_coursesList = data;

                break;

            case "articles":
                for (i = 0; i < tileData.length; i++) {
                    data.push($scope.initParsing(tileData[i].AR_URL, tileData[i].AR_SharedBy, "articles"));
                }
                $scope.ang_articlesList = data;
                break;
        }
        
    }

    function collectUserInputs(segment) {
        var data = [];
        switch (segment) {
            case "books":
                {
                    console.log("GettingUserInputsForBook...");

                    data = [{
                        BK_Title: $scope.BK_Title,
                        BK_Desc: $scope.BK_Desc,
                        BK_Author: $scope.BK_Author,
                        BK_SharedBy: userAliasName,
                        BK_Category: $scope.BK_Category,
                        BK_CoverImg:'' ,
                        BK_Type: $scope.BK_Type,
                        BK_URL: $scope.inputURL,
                        BK_Source: $scope.BK_Site
                    }];
                }
                break;
            case "articles":
                {
                    console.log("GettingUserInputsForArticle...");

                    data = [{
                        AR_URL: $scope.inputURL,
                        AR_SharedBy: userAliasName,
                        AR_Category: $scope.AR_Category
                    }];
                }
                break;

            case "courses":
                {
                    console.log("GettingUserInputsForCourse...");

                    data = [{
                        CR_URL: $scope.inputURL,
                        CR_SharedBy: userAliasName,
                        CR_Category: $scope.CR_Category,
                        CR_Type: $scope.CR_Type
                    }];
                }
                break;
        }

        return JSON.stringify(data[0]);
    }

    $scope.initParsing = function (URL, sharedBy, type, courseType) {
        console.log("parsing...");
        var parseURL = null;

        if (URL != null && URL != "") {
            parseURL = URL;
        }
        else if ($scope.inputURL != null && $scope.inputURL != '') {
            parseURL = $scope.inputURL;
        }
        else if ($scope.inputURL == '') {
            $scope.isLoading = false;
        }

        var data = new Object();

        if (parseURL != null) {

            $scope.isLoading = true;

            switch (type) {
                case "books":
                    ajaxService.getresdata('/Home/metaDataURL?url=' + parseURL, 'POST').then(function (response) {

                        $scope.isLoading = false;

                        // This is for parsing course whiling adding it.
                        if (URL == null || URL == "") {
                            $scope.BK_Title = response.Title;
                            $scope.BK_Desc = response.Description;
                            $scope.BK_Author = response.Author;
                            $scope.BK_ImgURL = response.ImgURL;
                            $scope.BK_Site = response.SiteName;
                        }
                        // This is for parsing everycourse tile whiling rendering.
                        else {
                            data.BK_Title = response.Title;
                            data.BK_Desc = response.Description;
                            data.BK_Author = response.Author;
                            data.BK_ImgURL = response.ImgURL;
                            data.BK_SharedBy = sharedBy;
                            data.BK_URL = parseURL;
                            data.BK_Category = response.BK_Category;
                            data.BK_Source = response.BK_Source;
                        }
                    });
                    break;
                case "articles":
                    ajaxService.getresdata('/Home/metaDataURL?url=' + parseURL, 'POST').then(function (response) {

                        $scope.isLoading = false;

                        // This is for parsing article whiling adding it.
                        if (URL == null || URL == "") {
                            $scope.AR_Title = response.Title;
                            $scope.AR_Desc = response.Description;
                            $scope.AR_ImgURL = response.ImgURL;
                            $scope.AR_SharedBy = userAliasName;
                        }
                        else {
                            data.AR_Title = response.Title;
                            data.AR_Desc = response.Description;
                            data.AR_BookAuthor = response.BookAuthor;
                            data.AR_ImgURL = response.ImgURL;
                            data.AR_SharedBy = sharedBy;
                            data.AR_URL = parseURL;
                        }
                    });
                    break;
                case "courses":
                    ajaxService.getresdata('/Home/metaDataURL?url=' + parseURL, 'POST').then(function (response) {

                        $scope.isLoading = false;

                        // This is for parsing course whiling adding it.
                        if (URL == null || URL == "") {
                            $scope.CR_Title = response.Title;
                            $scope.CR_Desc = response.Description;
                            $scope.CR_BookAuthor = response.BookAuthor;
                            $scope.CR_ImgURL = response.ImgURL;
                        }
                        // This is for parsing everycourse tile whiling rendering.
                        else {
                            sourceDetails = findWebsite(parseURL);

                            data.CR_Title=response.Title;
                            data.CR_Desc =response.Description;
                            data.CR_BookAuthor = response.BookAuthor;
                            data.CR_ImgURL = response.ImgURL;
                            data.CR_SharedBy = sharedBy;
                            data.CR_URL = parseURL;
                            data.CR_Type = courseType;
                            data.CR_Website = sourceDetails.website;
                            data.CR_Badge = sourceDetails.badge;
                        }
                    });
                    break;
            }

            return data;
        }

    }

    function findWebsite(url) {
        if (url.includes("linkedin")) {
            return {
                website: "LinkedIn",
                badge: "badge_linkedin.png"
            }
        }
        else if (url.includes("coursera")) {
            return {
                website: "Coursera",
                badge: "badge_coursera.png"
            }
        }
        else if (url.includes("udemy")) {
            return {
                website: "Udemy",
                badge: "badge_udemy.png"
            }
        }
        else {
            return "Other";
        }

    }

    $scope.postToDB = function (segment) {
        switch (segment) {
            case "books":
                var data = collectUserInputs("books");

                ajaxService.getresdata('/Home/postBook', 'POST', data).then(function (response) {
                    console.log(response);
                    location.reload();
                });
                break;

            case "articles":
                var data = collectUserInputs("articles");

                ajaxService.getresdata('/Home/postArticle', 'POST', data).then(function (response) {
                    console.log(response);
                    location.reload();
                });
                break;

            case "courses":
                var data = collectUserInputs("courses");
                console.log(data);
                ajaxService.getresdata('/Home/postCourse', 'POST', data).then(function (response) {
                    console.log(response);
                    location.reload();
                });
                break;
                
        }
    }

    // Modal Related Functions

    $scope.toggleModal = function (title, id, tertiaryBtn, secondaryBtn, primaryBtn, itemID, $event) {

        $scope.modalTitle = title;
        $scope.tertiaryBtn = tertiaryBtn;
        $scope.secondaryBtn = secondaryBtn;
        $scope.primaryBtn = primaryBtn;
        $scope.filepreview = '';
        $scope.id = id;

        switch (id) {

            case 'addBook':
                console.log("adding");
                $scope.form = {};
                $scope.form.bookSharedBy = userAliasName;
                break;

            case 'editBook':
                console.log("editing");
                $scope.form = {};
                getBookDetail(itemID);
                break;

        }

        $scope.primaryCallBack = function (action) {

            switch (primaryBtn) {

                case 'Add Book':
                    addBookToBooksList();
                    break;

                case 'Update Changes':
                    updateBookToBooksList(itemID);
                    break;

            }

        };

        $scope.secondaryCallBack = function () {

            switch (secondaryBtn) {

                case 'Remove Book':
                    removeBookFromList(itemID);
                    break;

            }

        };

    };

    closeFormModal = function () {
        var element = document.getElementById("formCloseBtn");
        element.click();
    }

    $scope.search = function (action) {
        
        switch (action) {
            case "all":
                $scope.Search = true;
                break;
            case "close":
                $scope.Search = false;
                break;
        }
    }

    ////Utilities

    $scope.isSuperUser = function() {
        if (userAliasName == 'prarjuna') {
            return true;
        }
        else {
            return false;
        }
    }




}]);
//Angular JS Main Contoller - {Ends}







