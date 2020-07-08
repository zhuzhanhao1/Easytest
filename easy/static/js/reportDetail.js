layui.use(['tree', "table"], function () {
    var tree = layui.tree
        , layer = layui.layer;
    var table = layui.table;
    $.ajax({
        url: "/api/v1/report_detail/tree/",
        type: 'GET',
        data : {
            "parentId":parentId
        },
        success: function (data) {
            tree.render({
                elem: '#test'
                , data: data
                //,showCheckbox: true  //是否显示复选框
                //, edit: ['add', 'update', 'del'] //操作节点的图标
                , id: 'demoId1'
                , isJump: true //是否允许点击节点时弹出新窗口跳转
                //, onlyIconControl: true  //是否仅允许节点左侧图标控制展开收缩
                , click: function (obj) {
                    console.log($(this));
                    var data = obj.data;  //获取当前点击的节点数据
                    console.log(data);
                    var nodes = document.getElementsByClassName("layui-tree-txt");
                    for(var i=0;i<nodes.length;i++){
                        if(nodes[i].innerHTML === obj.data.title)
                            nodes[i].style.color = "#5FB878";
                        else
                            nodes[i].style.color= "#555";
                    }
                    //layer.msg('状态：' + obj.state + '<br>节点数据：' + JSON.stringify(data.title));
                    var title = data.title;
                    var tableIns = table.render({
                        elem: '#treetable',
                        url: '/api/v1/report_detail/list/',
                        toolbar: '#toolbarDemo',
                        page: {groups: 5}, //开启分页
                        // cellMinWidth : 95,
                        height: "full-310",
                        limit: 10,
                        limits: [10, 15, 20, 25],
                        id: "linkListTab",
                        size: 'lg',
                        skin: 'line', //行边框风格 /row列表框风格 /nob无边框风格
                        where: {
                            "id": data.id
                        },
                        cols: [[{type: 'checkbox'},
                            {
                                field: 'interface_name',
                                title: '接口名称',
                                align: "left",
                                excel: {color: '0040ff', bgColor: 'f3fef3'},
                            }
                            , {field: 'url', title: '访问路径', align: "left"}
                            , {field: 'belong_module', title: '所属模块', align: "left"}
                            , {
                                field: 'duration', title: '响应时长', align: "left",
                                templet: function (res) {
                                    return '<span>' + String(res.duration)+"ms" + '</span>'
                                }
                            }
                            , {field: 'result', title: '响应结果', align: "left"}
                            // , {field: 'head', title: '负责人', align: "left"}
                        ]]
                    });
                    table.on('toolbar(treetable)', function (obj) {
                        var checkStatus = table.checkStatus(obj.config.id);
                        switch (obj.event) {
                            case 'export_report':
                                var data = checkStatus.data;
                                console.log(data);
                                if (data.length == 0) {
                                    layer.msg("请先选中需要执行的用例", {
                                        icon: 2,
                                        offset: "t"
                                    });
                                }
                                else {
                                    var l = [];
                                    for (i = 0; i < data.length; i++) {
                                        var dic = {};
                                        console.log(data[i]);
                                        dic["url"] = data[i]["url"];
                                        dic['duration'] = data[i]['duration'];
                                        l.push(dic);
                                    }
                                    console.log(l);
                                }
                                $.ajax({
                                    cache: false,
                                    url: "/api/v1/public/export_report/",
                                    type: 'POST',
                                    data: {
                                        "request": JSON.stringify(l)
                                    },
                                    //请求前的处理,加载loading
                                    beforeSend: function () {
                                        l_index = layer.msg('转换图表中，小伙伴请稍候~~', {
                                            icon: 16,
                                            time: false,
                                            shade: 0.5
                                        });
                                    },
                                    success: function (data) {
                                        console.log(data);
                                        if (data.code === 1000) {
                                            layer.msg(data.msg, {
                                                icon: 6, offset: "t"
                                            });
                                            layer.open({
                                                type: 2,
                                                title: "pycharts图表",
                                                shadeClose: true,
                                                shade: false,
                                                zIndex: layer.zIndex,
                                                maxmin: true, //开启最大化最小化按钮
                                                area: ['950px', '600px'],
                                                content: '/echart_report/',
                                                success: function () {
                                                    layer.setTop(layero);
                                                }
                                            });
                                        } else {
                                            layer.msg(data.error, {
                                                icon: 5, offset: "t"
                                            })
                                        }

                                    },
                                    error: function (data) {
                                        if (data.responseJSON.code === 1001) {
                                            layer.msg(data.responseJSON.error, {
                                                icon: 5,
                                                offset: 't'
                                            });
                                        } else {
                                            layer.msg("回调失败", {
                                                icon: 5,
                                                offset: 't'
                                            });
                                        }
                                    },
                                    complete: function () {
                                        layer.close(l_index);
                                    }
                                });
                                break;


                        }
                    });
                }
            });
        },
        error: function () {
            layer.msg("回调失败", {
                icon: 5,
                offset: 't'
            });
        },
    });
});



$(function () {
    $.ajax({
        url: "/api/v1/report_detail/echarts/",
        type: 'GET',
        data: {
            "reportId": reportId,
            "id": "cases"
        },
        //请求前的处理,加载loading
        success: function (data) {
            console.log(data);
            Highcharts.chart('highcaseset', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '用例数据统计'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        size:"100%",
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: '用例',
                    colorByPoint: true,
                    data: data
                }]
            });
        },
        error: function (data) {
            console.log(data);
            alert("出错了，请查看控制台！")

        }
    });
    $.ajax({
        url: "/api/v1/report_detail/echarts/",
        type: 'GET',
        data: {
            "reportId": reportId,
            "id": "interface"
        },
        //请求前的处理,加载loading
        success: function (data) {
            console.log(data);
            Highcharts.chart('highcases', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '接口数据统计'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        size:"100%",
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: '接口',
                    colorByPoint: true,
                    data: data
                }]
            });
        },
        error: function (data) {
            console.log(data);
            alert("出错了，请查看控制台！")

        }
    });
})

