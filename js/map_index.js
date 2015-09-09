(function () {
      var app = angular.module('app', []);

      var dataset = [];
      var city = {};
      var select_scope;

      var map;

      app.controller('select', function ($scope) {
            $scope.citys = city;
            $scope.city_select = "";
            //console.log($scope.city);
            select_scope = $scope;
            $scope.change_map = function () {
                  map.tinyMap('clear');
                  map.tinyMap('modify', {
                        marker: city[$scope.city_select]
                  });
                  map.tinyMap('panTo', $scope.city_select);
                  //alert(1);
            };
      });

      $(function () {
            map = $('#map').tinyMap({
                  'center': '台灣',
                  'zoom': 7,
                  // 'marker': dataset
            });


            var datajson = $.getJSON('data.json', function (data) {
                  $.each(data, function (i, marker) {

                        var a = marker.Coordinate.split(',');
                        //console.log(a);
                        if (a[0]) {

                              var obj = {};
                              obj.text = marker.Name + "<BR/>" + marker.City + "<BR/>" + marker.Feature;
                              obj.addr = [a[0], a[1]];
                              
                              //$('#map').gmap('openInfoWindow', { 'content': marker.Name }, this);
                              if (marker.City == "") {
                                    marker.City = "無縣市資訊";
                              }
                              if (!city[marker.City]) {
                                    city[marker.City] = [];
                                    city[marker.City].push(obj);
                              } else {
                                    city[marker.City].push(obj);
                              }

                        }
                  });
            });

            var datajson2 = $.getJSON('data3.json', function (data) {
                  $.each(data.Infos.Info, function (i, marker) {

                        var obj = {};
                        obj.text = marker.Name + "<BR/>" + marker.Region + "<BR/>" + marker.Toldescribe;
                        obj.addr = [marker.Py, marker.Px];
                        dataset.push(obj);
                        if (marker.Region == "") {
                              marker.Region = "無縣市資訊";
                        }
                        if (!city[marker.Region]) {
                              city[marker.Region] = [];
                              city[marker.Region].push(obj);
                        } else {
                              city[marker.Region].push(obj);
                        }         
                        //$('#map').gmap('openInfoWindow', { 'content': marker.Name }, this);					

                  });
            });

            $.when(datajson, datajson2).done(function () {

                  $(".bs-docs-featurette-title").click(function () {
                        map.tinyMap('clear');
                  });
                  select_scope.city_select = Object.keys(city)[0];

                  var city_array = Object.keys(city);
                  //console.log(city_array);
                  
                  for (var i in city["無縣市資訊"]) {
                        var content = city["無縣市資訊"][i].text;
                        var find_index = 0;
                        var choice_city = '';
                        for (var j in city_array) {
                              //console.log(city_array[i]);
                              
                              var find = content.indexOf(city_array[j].substring(0, 2));
                              if (find != -1 && (find < find_index || find_index == 0)) {
                                    find_index = find;
                                    choice_city = j;
                              }

                        }
                        if (city_array[choice_city]) {
                              city[city_array[choice_city]].push(city["無縣市資訊"][i]);
                        }

                  }

                  delete city["無縣市資訊"];
                  select_scope.$apply();

                  map.tinyMap('modify', {
                        marker: city[select_scope.city_select]
                  });
                  map.tinyMap('panTo', select_scope.city_select);
                  select_scope.$apply();

            });
      });


})();
