(function () {
      var app = angular.module('app', []);

      var dataset = [];
      var city = {};
      var select_scope;
      var city_weather = {};
      var map;

      var sce;

      app.controller('select', function ($scope, $sce) {
            $scope.citys = city;
            $scope.city_select = "新竹市";
            //console.log($scope.city);
            select_scope = $scope;
            $scope.weather_infoshow = "";
            sce = $sce;
            $scope.change_map = function () {
                  map.tinyMap('clear');
                  map.tinyMap('modify', {
                        marker: city[$scope.city_select]
                  });
                  map.tinyMap('panTo', $scope.city_select);
                  //alert(1);
                  
                  var go_city = $scope.city_select.replace('台', '臺');
                  if($scope.city_select == "桃園縣"){
                        go_city = "桃園市";
                  }
                  //console.log(city_weather);
                  if (city_weather[go_city]) {
                        var info_w = city_weather[go_city].split('||');
                        $scope.weather_infoshow = $sce.trustAsHtml(go_city + ' 今日天氣' + "<BR/>" + "溫度 : " + info_w[0] + "下雨機率 : " + info_w[1]);
                  } else {
                        $scope.weather_infoshow = "";
                  }



            };
      });

      $(function () {
            map = $('#map').tinyMap({
                  'center': '台灣',
                  'zoom': 7,
                  // 'marker': dataset
            });

            var get_city = $.get("http://www.cwb.gov.tw/V7/forecast/f_index.htm", function (data) {
                  /* data.responseText即為所在該URL的網頁內容 */
                  //console.log(data);
                  var text_dom = data.responseText;
                  var weather_tb = text_dom.match(/<tbody>(.)*<\/tbody>/g);
                  //$('body').html($(weather_tb).html());

                  for (var i in weather_tb) {

                        var search = weather_tb[i].match(/<a\b[^>]*>([\s\S]*?)<\/a>/gm);
                        //console.log(search);
                        var x = 1;
                        var now_city = "";
                        for (var j in search) {


                              if (x % 4 == 0) {
                                    x = 1;
                                    now_city = "";
                                    continue;
                              }


                              var search2 = search[j].match(/<a[^>]*>([\s\S]*?)<\/a>/);
                              if (x == 1) {
                                    now_city = search2[1];
                                    //console.log(search2[1]);
                              }
                              if (x == 1 && !city[search2[1]]) {
                                    city[search2[1]];
                              }

                              if (x == 2) {
                                    city_weather[now_city] = search2[1];
                              }
                              if (x == 3) {
                                    city_weather[now_city] += "||" + search2[1];
                              }
                              x++;                       	 		
                              //console.log(search2);
                        }




                  }
                  select_scope.$apply();
                  // console.log(city_weather);
            });


            var datajson = $.getJSON('data.json', function (data) {
                  $.each(data, function (i, marker) {

                        var a = marker.Coordinate.split(',');
                        //console.log(a);
                        if (a[0]) {

                              var obj = {};
                              obj.text = marker.Name + "<BR/>" + marker.City + "<BR/>" + marker.Feature;
                              obj.addr = [a[0], a[1]];
                              dataset.push(obj);
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
                  select_scope.$apply();
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
                  select_scope.$apply();
            });
            var datajson3 = $.getJSON('data4.json', function (data) {
                  $.each(data, function (i, marker) {

                        var a = marker.Coordinate.split(',');
                        //console.log(a);
                        if (a[0]) {

                              var obj = {};
                              obj.text = marker.Name + "<BR/>" + marker.City + "<BR/>" + marker.FoodFeature;
                              obj.addr = [a[0], a[1]];
                              dataset.push(obj);
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
                  select_scope.$apply();
            });


            $.when(map, get_city, datajson,datajson2, datajson3).done(function () {

                  $(".bs-docs-featurette-title").click(function () {
                        map.tinyMap('clear');
                  });
                  select_scope.city_select = Object.keys(city)[0];

                  var city_array = Object.keys(city);
                  //console.log(dataset);
                  
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

                  var go_city = select_scope.city_select.replace('台', '臺');

                  if (city_weather[go_city]) {
                        var info_w = city_weather[go_city].split('||');
                        select_scope.weather_infoshow = sce.trustAsHtml(go_city + ' 今日天氣' + "<BR/>" + "溫度 : " + info_w[0] + "下雨機率 : " + info_w[1]);
                  } else {
                        select_scope.weather_infoshow = "";
                  }

                  select_scope.$apply();

                  map.tinyMap('modify', {
                        marker: city[select_scope.city_select]
                  });
                  map.tinyMap('panTo', select_scope.city_select);
                  //select_scope.$apply();

            });
      });


})();
