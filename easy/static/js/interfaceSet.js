//interfaceSet数据表格JS
layui.config({
    base: './../static/layui2.5.5/lay/modules/',   // 模块目录
    version: 'v1.3.28'
}).extend({             // 模块别名
    soulTable: 'soulTable'
});

layui.use(['table', "soulTable"], function (data) {
    var table = layui.table;
    soulTable = layui.soulTable;
    //第一个实例
    var layer = layui.layer;
    var index = layer.load(0); //添加laoding,0-2两种方式
    var myTable = table.render({
        elem: '#test'
        , url: '/api/v1/interface_set/list/' //数据接口"exports"
        , toolbar: '#toolbarDemo'
        , defaultToolbar: [
            'filter', {title: '导出数据', layEvent: 'export_case', icon: 'layui-icon-download-circle'}, {
                title: '全屏显示',
                layEvent: 'fullScreen',
                icon: 'layui-icon-top'
            }, {title: '导入数据', layEvent: 'import_case', icon: 'layui-icon-upload-circle'}, 'print']
        , title: '接口流程测试'
        , page: {groups: 5} //开启分页
        , loading: false
        , height: 'full-60'
        , drag: {toolbar: true}//实现固定列与非固定列之间的转换
        , rowDrag: {
            trigger: 'row', done: function (obj) {
                // 完成时（松开时）触发
                // 如果拖动前和拖动后无变化，则不会触发此方法
                console.log(obj.row);// 当前行数据
                console.log(obj.cache); // 改动后全表数据
                console.log(obj.oldIndex); // 原来的数据索引
                console.log(obj.newIndex); // 改动后数据索引
                var l = [];
                for (var i in obj.cache) {
                    l.push(obj.cache[i].caseid)
                }
                console.log(l);
                $.ajax({
                    cache: false,
                    url: "/api/v1/publicapi/sort/",
                    type: 'POST',
                    data: {
                        "caseids": JSON.stringify(l),
                        "belong": "{{ belong }}",
                        "system": "{{ system }}",
                        "type": "process"
                    },
                    success: function (data) {
                        if (data.code === 1000) {
                            layer.msg(data.msg, {
                                icon: 6, offset: "t"
                            })
                        } else {
                            layer.msg(data.error, {
                                icon: 5, offset: "t"
                            })
                        }
                        $(".layui-laypage-btn").click();
                    },
                    error: function () {
                        layer.msg("回调失败", {
                            icon: 5,
                            offset: 't'
                        });
                    },
                });
            }

        }//排序
        , size: 'lg'	//lg大尺寸 /sm小尺寸
        , skin: 'line' //行边框风格 /row列表框风格 /nob无边框风格
        , limit: 10
        , limits: [10, 20, 30, 50, 100, 200, 500]
        , where: {//额外参数
            parentId: parentId
        }
        , contextmenu: {
            // 表头右键菜单配置
            header: [
                {
                    name: '重载表格',
                    icon: 'layui-icon layui-icon-refresh-1',
                    click: function () {
                        table.reload(this.id)
                    }
                }
            ]
        }
        , cols: [[ //表头, fixed: 'left'
            {type: 'checkbox'}
            , {
                title: '操作', toolbar: '#barDemo', width: 120, align: "left"

            }
            , {field: 'id', title: '序号', width: 60, align: "left"}
            //, {field: 'identity', title: '角色', width: 170, align: "left"}
            , {
                field: 'interface_name',
                title: '接口名称',
                width: 220,
                align: "left",
                excel: {color: '0040ff', bgColor: 'f3fef3'},
                //templet: "#casenameTpl"
            }
            , {
                field: 'url', title: '请求路径', width: 220, align: "left", templet: function (res) {
                    var a = res.url.split("/");
                    return '<span>' + a[a.length - 1] + '</span>'
                }
            }
            , {field: 'method', title: '请求方式', width: 90, align: "left", templet: "#methodTpl"}
            , {field: '', title: '前置处理', width: 90,align: "left"
                , isChild: function(row){return row.preprocessor == 'True'}
                , collapse: true
                ,icon: ['layui-icon layui-icon-star', 'layui-icon layui-icon-star-fill']
                , childTitle: false
                , children: [
                    {
                        elem: '#templateTable'
                        , url: "/api/v1/interface_set/list/"
                        , where: function (row) {
                            console.log(row);
                            return {parentId: row.belong_module, id: row.id}
                        }
                        , title: "前置控制器"
                        , skin: 'line'
                        , size: "lg"
                        //, height: 'full-10'
                        , cols: [[
                            {field: 'depend_id', title: '前置的id', align: "left", edit: 'text'},
                            {field: 'depend_key', title: '前置结果jsonpath', align: "left", edit: 'text'},
                            {field: 'replace_key', title: '替换区域jsonpath', align: "left", edit: 'text'},
                            {field: 'replace_position', title: '替换区域(params:0,body:1,all:2)', align: "left", edit: 'text'}
                        ]]
                        , rowEvent: function (obj, pobj) {
                            // 单击行事件
                            // obj 子表当前行对象
                            // pobj 父表当前行对象
                            obj.tr.css({'background': '#ECEFFC'}).siblings().removeAttr('style');
                            console.log(obj.tr) //得到当前行元素对象
                            console.log(obj.data) //得到当前行数据
                            console.log(pobj) //得到当前行数据
                        }
                        , editEvent: function (obj, pobj) {
                            // obj 子表当前行对象
                            // pobj 父表当前行对象
                            let id = pobj.data.id;
                            if(obj.field == "depend_id"){
                                $.ajax({
                                    url: "/api/v1/interface_set/update_interface/" + id + '/',
                                    type: 'PUT',
                                    data: {
                                        "depend_id": obj.value
                                    },
                                    success: function (data) {
                                        if (data.code === 1000) {
                                            layer.msg(data.msg, {
                                                icon: 6, offset: "t"
                                            })
                                        } else {
                                            layer.msg(data.error, {
                                                icon: 5, offset: "t"
                                            })
                                        }
                                    },
                                    error: function () {
                                        layer.msg("回调失败", {
                                            icon: 5,
                                            offset: 't'
                                        });
                                    },
                                });
                            }
                            else if(obj.field == "depend_key"){
                                $.ajax({
                                    url: "/api/v1/interface_set/update_interface/" + id + '/',
                                    type: 'PUT',
                                    data: {
                                        "depend_key": obj.value
                                    },
                                    success: function (data) {
                                        if (data.code === 1000) {
                                            layer.msg(data.msg, {
                                                icon: 6, offset: "t"
                                            })
                                        } else {
                                            layer.msg(data.error, {
                                                icon: 5, offset: "t"
                                            })
                                        }
                                    },
                                    error: function () {
                                        layer.msg("回调失败", {
                                            icon: 5,
                                            offset: 't'
                                        });
                                    },
                                });
                            }
                            else if(obj.field == "replace_key"){
                                $.ajax({
                                    url: "/api/v1/interface_set/update_interface/" + id + '/',
                                    type: 'PUT',
                                    data: {
                                        "replace_key": obj.value
                                    },
                                    success: function (data) {
                                        if (data.code === 1000) {
                                            layer.msg(data.msg, {
                                                icon: 6, offset: "t"
                                            })
                                        } else {
                                            layer.msg(data.error, {
                                                icon: 5, offset: "t"
                                            })
                                        }
                                    },
                                    error: function () {
                                        layer.msg("回调失败", {
                                            icon: 5,
                                            offset: 't'
                                        });
                                    },
                                });
                            }
                            else if(obj.field == "replace_position"){
                                $.ajax({
                                    url: "/api/v1/interface_set/update_interface/" + id + '/',
                                    type: 'PUT',
                                    data: {
                                        "replace_position": obj.value
                                    },
                                    success: function (data) {
                                        if (data.code === 1000) {
                                            layer.msg(data.msg, {
                                                icon: 6, offset: "t"
                                            })
                                        } else {
                                            layer.msg(data.error, {
                                                icon: 5, offset: "t"
                                            })
                                        }
                                    },
                                    error: function () {
                                        layer.msg("回调失败", {
                                            icon: 5,
                                            offset: 't'
                                        });
                                    },
                                });
                            }
                        }
                        , done: function (data) {
                            //console.log(data);
                            soulTable.render(this);
                        }

                    }
                ]
            }
            //, {
            //    field: 'preprocessor', title: '前置控制器', width: 100, templet: function (d) {
            //        console.log(d.preprocessor);
            //        console.log(typeof (d.preprocessor))
            //        var preprocessor = "";
            //        if (d.preprocessor == "True") {
            //            preprocessor = "<input type='checkbox' value='" + d.preprocessor + "' id='preprocessor' lay-filter='preprocessor' checked='checked' name='preprocessor'  lay-skin='switch' lay-text='开启|关闭' >";
            //        } else {
            //           preprocessor = "<input type='checkbox' value='" + d.preprocessor + "' id='preprocessor' lay-filter='preprocessor'  name='preprocessor'  lay-skin='switch' lay-text='开启|关闭' >";
            //        }
            //        console.log(preprocessor);
            //        return preprocessor;
            //    }
            //}
            , {field: 'params', title: 'Query参数', align: "left", event: 'params'}
            , {field: 'body', title: 'Body参数', align: "left", event: 'body'}

            , {
                field: 'durantion',
                title: '响应时长',
                align: "left",
                sort: true,
                width: 100,
                event: "durantion",
                templet: function (res) {
                    if (res.duration < 1) {
                        let a = String(res.duration * 1000) + "毫秒";
                        return '<span>' + a + '</span>'
                    } else if (res.duration >= 1 && res.duration < 3) {
                        let b = String(res.duration) + "秒";
                        return '<span style="color: cornflowerblue;">' + b + '</span>'
                    } else {
                        let b = String(res.duration) + "秒";
                        return '<span style="color: deeppink;">' + b + '</span>'
                    }
                }
            }
            , {
                field: 'result', title: '响应结果', align: "left", event: "detail", templet: function (res) {
                    if (res.result == null) {
                        return '<span>' + res.result + '</span>'
                    } else if (res.result.indexOf("message") != -1 && res.result.indexOf("error") != -1) {
                        let b = JSON.parse(res.result);
                        return '<span style="color: red;">' + JSON.stringify(b["message"]) + '</span>'
                    } else {
                        return '<span>' + res.result + '</span>'
                    }
                }
            }
            , {field: 'head', title: '负责人', width: 80, event: "head", align: "left"}//merge: true行合并

        ]]
        , filter: {
            items: ['column', 'editCondition', 'excel'] // 只显示表格列和导出excel两个菜单项
        }
        , id: 'testReload'
        , rowEvent: function (obj) {
            obj.tr.css({'background': '#ECEFFC'}).siblings().removeAttr('style')
        }
        , done: function (res) {   //返回数据执行回调函数
            layer.close(index);    //返回数据关闭loading
            soulTable.render(this);
        }
    });

    //搜索
    layui.$, active = {
        reload: function () {
            var demoReload = $('#demoReload');
            console.log(demoReload.val());
            //执行重载
            table.reload('testReload', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                , where: {casename: demoReload.val()}
            }, 'data');
        }
    };

    $('.demoTable .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    //监听性别操作
    //头工具栏事件
    table.on('toolbar(test)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        console.log(checkStatus);
        switch (obj.event) {
            //执行用例
            case 'run_case':
                var data = checkStatus.data;
                var len = data.length;
                console.log(data);
                if (len == 0) {
                    layer.close(index);
                    layer.msg("请先选中需要执行的用例", {
                        icon: 2,
                        offset: "t"
                    });
                } else {
                    var l = [];
                    for (i = 0; i < data.length; i++) {
                        var dic = {};
                        dic["caseid"] = data[i]["caseid"];
                        dic['identity'] = data[i]['identity'];
                        dic['casename'] = data[i]['casename'];
                        dic["url"] = data[i]['url'];
                        dic['method'] = data[i]['method'];
                        dic['params'] = data[i]['params'];
                        dic['body'] = data[i]['body'];
                        dic['depend_id'] = data[i]['depend_id'];
                        dic['depend_key'] = data[i]['depend_key'];
                        dic['replace_key'] = data[i]['replace_key'];
                        dic['replace_position'] = data[i]['replace_position'];
                        l.push(dic);
                    }
                    console.log(l);
                    $.ajax({
                        cache: false,
                        url: "/api/v1/processapi/run/",
                        dataType: 'json',
                        type: 'POST',
                        data: {
                            "request": JSON.stringify(l)
                        },
                        //请求前的处理,加载loading
                        beforeSend: function () {
                            if (data.length > 1) {
                                document.getElementById("Runcase").setAttribute("disabled", true);
                                document.getElementById("Runcase").innerHTML = "loading...";
                                l_index = layer.msg('执行接口中，小伙伴请稍候~~', {icon: 16, time: false, shade: 0.5});
                                //l_index = layer.load(0, {shade: [0.5, '#DBDBDB']}); //0.1透明度的白色背景
                                var process = layer.open({
                                    type: 1,
                                    title: false,
                                    area: ['50%', ''],
                                    skin: "layui-layer-rim",
                                    //shade: 0.8,
                                    offset: "b",
                                    content: $("#progress_bar").html(),
                                    success: function () {
                                        layui.use('element', function () {
                                            var $ = layui.jquery
                                                , element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
                                            var sitv = setInterval(function () {
                                                $.ajax({
                                                    cache: false,
                                                    url: "/api/v1/processapi/run/",
                                                    dataType: 'JSON',
                                                    type: 'GET',
                                                    success: function (num_progress) {
                                                        console.log(num_progress);
                                                        element.progress('demo', num_progress + '%');
                                                        if (num_progress > 33 && num_progress < 66) {
                                                            $(".layui-progress-bar").addClass("layui-bg-orange");
                                                        } else if (num_progress >= 66 && num_progress < 100) {
                                                            $(".layui-progress-bar").removeClass("layui-bg-orange");
                                                            $(".layui-progress-bar").addClass("layui-bg-red");
                                                        } else if (num_progress == "100") {
                                                            $(".layui-progress-bar").removeClass("layui-bg-red");
                                                            clearInterval(sitv);
                                                            layer.close(process);
                                                        }
                                                    },
                                                    error: function (data) {
                                                        console.log(data);
                                                        layer.msg(data, {
                                                            offset: 't',
                                                            icon: 5
                                                        });
                                                    }
                                                });

                                            }, 250);// 每10毫秒查询一次后台进度
                                        });
                                    }
                                });
                            } else {
                                document.getElementById("Runcase").setAttribute("disabled", true);
                                document.getElementById("Runcase").innerHTML = "loading...";
                                l_index = layer.msg('执行接口中，小伙伴请稍候~~', {icon: 16, time: false, shade: 0.5});
                            }

                        },
                        success: function (data) {
                            console.log(data);//object
                            if (len > 0) {
                                if (data.errors > 0) {
                                    let failcases = data.failcases;
                                    let errors = data.errors;
                                    let pass = len - errors;
                                    console.log(typeof (errors))
                                    var result = layer.open({
                                        type: 1,
                                        title: false,
                                        shade: false,
                                        area: ['80%', '80%'],
                                        //content: $("#process_result").html(),
                                        content: '<div style="padding:15px;">' +
                                            //'<blockquote class="layui-elem-quote">所属项目：ERMS数字档案室系统</blockquote>'+
                                            '<fieldset class="layui-elem-field">' +
                                            '<legend>执行结果</legend>' +
                                            '<div class="layui-field-box">' +
                                            '<label>用例总数：</label>' +
                                            '<span style="color: blue" id="all_num"></span>、' +
                                            '<label>成功的用例数：</label>' +
                                            '<span style="color: yellowgreen" id="success_num"></span>、' +
                                            '<label>失败的用例数：</label>' +
                                            '<span style="color: red" id="fail_num"></span>' +
                                            '</div>' +
                                            '</fieldset>' +
                                            '<fieldset class="layui-elem-field layui-field-title">' +
                                            '<legend>执行失败的接口用例列表</legend>' +
                                            '<div class="layui-field-box" style="padding: 15px;">' +
                                            '<table class="layui-hide" id="templateTable"  lay-filter="templateTable"></table>' +
                                            '</div>' +
                                            '</fieldset>' +
                                            '</div>',
                                        success: function (data) {
                                            document.getElementById("all_num").innerText = len;
                                            $("#success_num").html(pass);
                                            $("#fail_num").html(errors);

                                            var myTable = table.render({
                                                elem: '#templateTable'
                                                , url: '/api/v1/processapi/result_list/'
                                                , page: true
                                                , toolbar: '#resultDemo'
                                                //, height: 'full-20'
                                                , limit: 10
                                                , cols: [[
                                                    {type: 'checkbox'}
                                                    , {field: 'casename', title: '接口名称', width: 300, align: "left"}
                                                    , {
                                                        field: 'duration', width: 100, title: '响应时长', align: "left",
                                                        templet: function (res) {
                                                            if (res.duration < 1) {
                                                                let a = String(res.duration * 1000) + "毫秒";
                                                                return '<span>' + a + '</span>'
                                                            } else if (res.duration >= 1 && res.duration < 3) {
                                                                let b = String(res.duration) + "秒";
                                                                return '<span style="color: cornflowerblue;">' + b + '</span>'
                                                            } else {
                                                                let b = String(res.duration) + "秒";
                                                                return '<span style="color: deeppink;">' + b + '</span>'
                                                            }
                                                        }
                                                    }
                                                    , {
                                                        field: 'result',
                                                        title: '响应结果',
                                                        width: 800,
                                                        align: "left",
                                                        event: "detail",
                                                        templet: function (res) {
                                                            if (res.result == null) {
                                                                return '<span>' + res.result + '</span>'
                                                            } else if (res.result.indexOf("message") != -1 && res.result.indexOf("error") != -1) {
                                                                let b = JSON.parse(res.result);
                                                                return '<span style="color: red;">' + JSON.stringify(b["message"]) + '</span>'
                                                            } else if (res.result != "") {
                                                                let a = JSON.parse(res.result);
                                                                return '<span>' + JSON.stringify(a) + '</span>'
                                                            } else {
                                                                return '<span>' + res.result + '</span>'
                                                            }
                                                        }
                                                    }
                                                    , {field: 'head', width: 90, title: '负责人', align: "left"}
                                                ]]
                                                , where: {
                                                    caseids: JSON.stringify(failcases),
                                                    system: "{{ system }}"
                                                }
                                            });
                                            //头工具栏事件
                                            table.on('toolbar(templateTable)', function (obj) {
                                                var checkStatus = table.checkStatus(obj.config.id);
                                                //console.log(checkStatus);
                                                switch (obj.event) {
                                                    //发送钉钉消息
                                                    case 'dingding':
                                                        var data = checkStatus.data;
                                                        console.log(data);
                                                        if (data.length == 0) {
                                                            layer.close(index);
                                                            layer.msg("请先选中需要发送的接口", {
                                                                icon: 2,
                                                                offset: "t"
                                                            });
                                                        } else {
                                                            layer.confirm("你确定要发送接口请求结果给相应的负责人吗？\n注意:请求正常发送所有结果信息，请求失败发送错误内容", {
                                                                    icon: 3,
                                                                    btn: ["确定", "取消"]
                                                                }, function () {
                                                                    var ids = "";
                                                                    for (i = 0; i < data.length; i++) {
                                                                        ids += data[i]["caseid"] + ",";
                                                                        console.log(ids);
                                                                    }
                                                                    $.ajax({
                                                                        cache: false,
                                                                        url: "/api/v1/ding_ding/",
                                                                        type: 'GET',
                                                                        data: {
                                                                            "caseid": ids,
                                                                            "isprocess": "yes"
                                                                        },
                                                                        //请求前的处理,加载loading
                                                                        beforeSend: function () {
                                                                            document.getElementById("Dingding").setAttribute("disabled", true);
                                                                            document.getElementById("Dingding").innerHTML = "loading...";
                                                                            l_index = layer.msg('发送钉钉中，小伙伴请稍候~~', {
                                                                                icon: 16,
                                                                                time: false,
                                                                                shade: 0.5
                                                                            });
                                                                            //l_index = layer.load(0, {shade: [0.5, '#DBDBDB']}); //0.1透明度的白色背景
                                                                        },
                                                                        success: function (data) {
                                                                            if (data.code === 1001) {
                                                                                layer.msg(data.msg, {
                                                                                    icon: 6,
                                                                                    offset: 't',
                                                                                });
                                                                            } else {
                                                                                layer.msg(data.error, {
                                                                                    icon: 5,
                                                                                    offset: 't',
                                                                                });
                                                                            }


                                                                        },
                                                                        error: function (data) {
                                                                            console.log(data);
                                                                            layer.msg("回调失败", {
                                                                                icon: 5,
                                                                                offset: 't'
                                                                            });
                                                                        },
                                                                        complete: function () {
                                                                            document.getElementById("Dingding").removeAttribute("disabled");
                                                                            document.getElementById("Dingding").innerHTML = "钉钉通知";
                                                                            layer.close(l_index);
                                                                        }
                                                                    });

                                                                }, function () {
                                                                    layer.msg(
                                                                        "取消发送钉钉消息",
                                                                        {icon: 1, offset: "t"}
                                                                    );
                                                                }
                                                            );
                                                        }
                                                        break;
                                                }

                                            });
                                            //监听行工具事件
                                            table.on('tool(templateTable)', function (obj) {
                                                var data = obj.data;
                                                //console.log(obj);
                                                if (obj.event === 'detail') {
                                                    console.log(data.result);
                                                    //var strjson = JSON.parse(data.result);
                                                    layer.prompt({
                                                        formType: 2,//多行文本
                                                        value: data.result,
                                                        shade: false,
                                                        title: data.casename + "响应结果",
                                                        maxmin: true,
                                                        skin: "layui-layer-rim",//hui
                                                        closeBtn: 0,
                                                        zIndex: layer.zIndex,
                                                        area: ['750px', '500px'], //自定义文本域宽高
                                                        btn: ["点我查看详情", "关闭"],
                                                        yes: function () {
                                                            var index = layer.open({
                                                                type: 2,
                                                                title: data.casename + "详细信息",
                                                                //shadeClose: true,
                                                                shade: false,
                                                                zIndex: layer.zIndex,
                                                                maxmin: true, //开启最大化最小化按钮
                                                                area: ['600px', '1200px'],
                                                                content: "/detail_process_api/?id=" + data.caseid,
                                                            });
                                                            layer.full(index);
                                                        },
                                                        btn2: function (index) {
                                                            layer.close(index);
                                                        }
                                                    });
                                                }

                                            });
                                        },
                                        btn: ['关闭'],
                                        yes: function () {
                                            layer.close(result);
                                            $(".layui-laypage-btn").click();
                                        }
                                    });
                                } else {
                                    layer.msg("接口执行全部成功", {
                                        icon: 6,
                                        offset: 't',
                                    })
                                    $(".layui-laypage-btn").click();
                                }
                            } else if (len == 1) {
                                //处理单个接口执行
                                let strjson = JSON.stringify(data, null, 4);
                                layer.prompt({
                                    formType: 2,//多行文本
                                    value: strjson,
                                    title: '响应结果',
                                    maxmin: true, //允许全屏最小化
                                    anim: 4,//从左滚动进来
                                    //shade: 0.6, //遮罩透明度
                                    skin: "layui-layer-rim",
                                    //监听取消按钮
                                    zIndex: layer.zIndex,
                                    shade: false,
                                    btn: ["json.cn", "关闭"],
                                    yes: function () {
                                        layer.open({
                                            type: 2,
                                            title: "json.cn",
                                            //shadeClose: true,
                                            shade: false,
                                            zIndex: layer.zIndex,
                                            maxmin: true, //开启最大化最小化按钮
                                            area: ['893px', '600px'],
                                            content: 'https://www.json.cn',
                                            success: function () {
                                                layer.setTop(layero);
                                            }
                                        });

                                    },
                                    btn2: function (index, layro) {//这里就是你要的
                                        layer.close(index);
                                        $(".layui-laypage-btn").click();
                                    },
                                    area: ['700px', '500px'] //自定义文本域宽高
                                });
                            } else if (data.status_code == 500 || data.status_code == 401) {
                                layer.msg(data.msg, {
                                    icon: 5,
                                    offset: 't',
                                });
                            }
                        },
                        error: function (data) {
                            layer.msg("NameError", {
                                icon: 5,
                                offset: 't',
                            });
                        },
                        complete: function () {
                            document.getElementById("Runcase").removeAttribute("disabled");
                            document.getElementById("Runcase").innerHTML = "执行用例";
                            layer.close(l_index);
                        }
                    });
                }
                break;
            //发送钉钉消息
            case 'ding_ding':
                var data = checkStatus.data;
                console.log(data);
                if (data.length == 0) {
                    layer.close(index);
                    layer.msg("请先选中需要发送的接口", {
                        icon: 2,
                        offset: "t"
                    });
                } else {
                    layer.confirm("你确定要发送接口请求结果给相应的负责人吗？\n注意:请求正常发送所有结果信息，请求失败发送错误内容", {
                            icon: 3,
                            btn: ["确定", "取消"]
                        }, function () {
                            var ids = "";
                            for (i = 0; i < data.length; i++) {
                                ids += data[i]["caseid"] + ",";
                                console.log(ids);
                            }
                            $.ajax({
                                cache: false,
                                url: "/api/v1/publicapi/dingding/",
                                type: 'GET',
                                data: {
                                    "caseid": ids,
                                    "isprocess": "yes"
                                },
                                //请求前的处理,加载loading
                                beforeSend: function () {
                                    l_index = layer.msg('发送钉钉中，小伙伴请稍候~~', {icon: 16, time: false, shade: 0.5});
                                    //l_index = layer.load(0, {shade: [0.5, '#DBDBDB']}); //0.1透明度的白色背景
                                },
                                success: function (data) {
                                    if (data.code === 1000) {
                                        layer.msg(data.msg, {
                                            icon: 6, offset: "t"
                                        })
                                    } else {
                                        layer.msg(data.error, {
                                            icon: 5, offset: "t"
                                        })
                                    }
                                },
                                error: function () {
                                    layer.msg("回调失败", {
                                        icon: 5,
                                        offset: 't'
                                    });
                                },
                                complete: function () {
                                    layer.close(l_index);
                                }
                            });

                        }, function () {
                            layer.msg(
                                "取消发送钉钉消息",
                                {icon: 1, offset: "t"}
                            );
                        }
                    );
                }
                break;
            //导出用例
            case "export_case":
                if (checkStatus.data.length > 0) {
                    soulTable.export(myTable, {
                        filename: '勾选数据.xlsx',
                        checked: true, // 只导出勾选数据
                        border: {
                            style: 'thin',
                            color: '000000'
                        },
                        head: { // 表头样式
                            family: 'helvetica', // 字体
                            size: 14, // 字号
                            color: 'FFFFFF', // 字体颜色
                            bgColor: 'ff8c00' // 背景颜色
                        },
                        font: { // 正文样式
                            family: 'Calibri', // 字体
                            size: 12, // 字号
                            color: '000000', // 字体颜色
                            bgColor: 'FFFFFF' //背景颜色t
                        }
                    });
                    layer.msg('操作成功', {icon: 6, offset: 't'});
                } else {
                    layer.msg('请先勾选数据在导出！', {icon: 0, offset: 't'});
                }
                break;
            //全屏显示
            case "fullScreen":
                var docE = document.documentElement;
                if (docE.requestFullScreen) {
                    docE.requestFullScreen();
                } else if (docE.mozRequestFullScreen) {
                    docE.mozRequestFullScreen();
                } else if (docE.webkitRequestFullScreen) {
                    docE.webkitRequestFullScreen();
                }
                break;
            //导入用例
            case "import_case":
                layer.open({
                    //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                    type: 1,
                    title: "导入用例",
                    area: ['35%', '30%'],
                    skin: "layui-layer-rim",
                    shade: 0.6,
                    content: $("#import_case").html()
                });
                break;
            //批量删除
            case "batch_delete":
                var data = checkStatus.data;
                layer.confirm('真的删除行么', function (index) {
                    console.log(data);
                    layer.close(index);
                    var l = [];
                    for (i = 0; i < data.length; i++) {
                        var dic = {};
                        dic["caseid"] = data[i]["caseid"];
                        l.push(dic);
                    }
                    console.log(l);
                    $.ajax({
                        cache: false,
                        url: "/api/v1/processapi/del_case/0/",
                        type: 'DELETE',
                        data: {
                            "ids": JSON.stringify(l),
                        },
                        success: function (data) {
                            if (data.code === 1000) {
                                layer.msg(data.msg, {
                                    icon: 6, offset: "t"
                                })
                            } else {
                                layer.msg(data.error, {
                                    icon: 5, offset: "t"
                                })
                            }
                            $(".layui-laypage-btn").click();
                        },
                        error: function (data) {
                            console.log(data);
                            layer.msg("回调失败", {
                                icon: 5,
                                offset: 't'
                            });
                        },
                    });
                });
                break;
            //导出报表
            case 'export_report':
                var data = checkStatus.data;
                console.log(data);
                if (data.length == 0) {
                    layer.msg("请先选中需要执行的用例", {
                        icon: 2,
                        offset: "t"
                    });
                } else {
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
                    url: "/api/v1/publicapi/export_report/",
                    type: 'POST',
                    data: {
                        "request": JSON.stringify(l)
                    },
                    //请求前的处理,加载loading
                    beforeSend: function () {
                        l_index = layer.msg('执行接口中，小伙伴请稍候~~', {
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
                    error: function () {
                        layer.msg("回调失败", {
                            icon: 5,
                            offset: 't'
                        });
                    },
                    complete: function () {
                        layer.close(l_index);
                    }
                });
        }

    });

    //监听行工具事件
    table.on('tool(test)', function (obj) {
        var data = obj.data;
        var id = data['caseid'];
        //点击result查看详情
        if (obj.event === 'detail') {
            console.log(data.result);
            //var strjson = JSON.parse(data.result);
            layer.prompt({
                formType: 2,//多行文本
                value: data.result,
                shade: false,
                title: data.casename + "响应结果",
                //anim: 4,//从左滚动进来
                maxmin: true,
                skin: "layui-layer-rim",//hui
                closeBtn: 0,
                zIndex: layer.zIndex,
                area: ['800px', '600px'], //自定义文本域宽高
                btn: ["详情", "关闭"],
                yes: function () {
                    var index = layer.open({
                        type: 2,
                        title: data.casename + "详细信息",
                        //shadeClose: true,
                        shade: false,
                        zIndex: layer.zIndex,
                        maxmin: true, //开启最大化最小化按钮
                        area: ['600px', '1200px'],
                        content: "/detail/?id=" + data.caseid,
                    });
                    layer.full(index);
                },
                btn2: function (index) {
                    layer.close(index);
                }
            });
        }
        //删除接口用例
        else if (obj.event === 'del_case') {
            layer.confirm('真的删除行么', {icon: 2, title: "删除提示"}, function (index) {
                console.log(obj.data);
                //layer.msg("确定删除",{icon:1});
                obj.del();//删除对应行（tr）的DOM结构，并更新缓存
                layer.close(index);
                //向服务端发送删除指令
                var id = obj.data["caseid"];
                console.log(id);
                $.ajax({
                    cache: false,
                    url: "/api/v1/processapi/del_case/" + id + "/",
                    type: 'DELETE',
                    success: function (data) {
                        if (data.code === 1000) {
                            layer.msg(data.msg, {
                                icon: 6, offset: "t"
                            })
                        } else {
                            layer.msg(data.error, {
                                icon: 5, offset: "t"
                            })
                        }
                        $(".layui-laypage-btn").click();
                    },
                    error: function () {
                        layer.msg("回调失败", {
                            icon: 5,
                            offset: 't'
                        });
                    },
                });
            });
        }
        //编辑请求Query
        else if (obj.event === 'params') {
            layer.prompt({
                formType: 2
                , value: data.params
                , title: ["编辑Query parmas"]
                , skin: "layui-layer-lan"
                , shade: false
                , area: ['500px', '300px'] //自定义文本域宽高

            }, function (value, index) {
                console.log(value);
                console.log(index);
                $.ajax({
                    cache: false,
                    url: "/api/v1/processapi/update_case/" + id + '/',
                    type: 'POST',
                    async: false,
                    data: {
                        "params": value
                    },
                    success: function (data) {
                        if (data.code === 1000) {
                            layer.msg(data.msg, {
                                icon: 6, offset: "t"
                            })
                        } else {
                            layer.msg(data.error, {
                                icon: 5, offset: "t"
                            })
                        }
                    },
                    error: function () {
                        layer.msg("回调失败", {
                            icon: 5,
                            offset: 't'
                        });
                    },
                });
                //同步更新缓存对应的值
                obj.update({
                    params: value
                });
                layer.close(index);
            });
        }
        //编辑请求体
        else if (obj.event === 'body') {
            layer.prompt({
                formType: 2
                , value: data.body
                , title: ["编辑data forms"]
                , skin: "layui-layer-lan"
                , shade: 0.6
                , area: ['600px', '400px'] //自定义文本域宽高
                , maxlength: 500000

            }, function (value, index) {
                console.log(value);
                console.log(index);
                $.ajax({
                    cache: false,
                    url: "/api/v1/processapi/update_case/" + id + '/',
                    type: 'POST',
                    async: false,
                    data: {
                        "body": value
                    },
                    success: function (data) {
                        if (data.code === 1000) {
                            layer.msg(data.msg, {
                                icon: 6, offset: "t"
                            })
                        } else {
                            layer.msg(data.error, {
                                icon: 5, offset: "t"
                            })
                        }
                    },
                    error: function () {
                        layer.msg("回调失败", {
                            icon: 5,
                            offset: 't'
                        });
                    },
                });
                //同步更新缓存对应的值
                obj.update({
                    body: value
                });
                layer.close(index);

            });
        }
        //编辑依赖的id
        else if (obj.event === 'depend_id') {
            layer.prompt({
                formType: 2
                , value: data.depend_id
                , title: ["编辑depend_id"]
                , skin: "layui-layer-lan"
                , shade: 0.6
                , area: ['300px', '150px'] //自定义文本域宽高
                , maxlength: 500000

            }, function (value, index) {
                $.ajax({
                    cache: false,
                    url: "/api/v1/processapi/update_case/" + id + '/',
                    type: 'GET',
                    async: false,
                    data: {
                        "depend_id": value
                    },
                    success: function (data) {
                        if (data.code === 1000) {
                            layer.msg(data.msg, {
                                icon: 6, offset: "t"
                            })
                        } else {
                            layer.msg(data.error, {
                                icon: 5, offset: "t"
                            })
                        }
                    },
                    error: function () {
                        layer.msg("回调失败", {
                            icon: 5,
                            offset: 't'
                        });
                    },
                });
                //同步更新缓存对应的值
                obj.update({
                    depend_id: value
                });
                layer.close(index);

            });
        }
        //编辑依赖的key
        else if (obj.event === 'depend_key') {
            layer.prompt({
                formType: 2
                , value: data.depend_key
                , title: ["编辑depend_key"]
                , skin: "layui-layer-lan"
                , shade: 0.6
                , area: ['300px', '150px'] //自定义文本域宽高
                , maxlength: 500000

            }, function (value, index) {
                console.log(value);
                console.log(index);
                $.ajax({
                    cache: false,
                    url: "/api/v1/processapi/update_case/" + id + '/',
                    type: 'GET',
                    async: false,
                    data: {
                        "depend_key": value
                    },
                    success: function (data) {
                        if (data.code === 1000) {
                            layer.msg(data.msg, {
                                icon: 6, offset: "t"
                            })
                        } else {
                            layer.msg(data.error, {
                                icon: 5, offset: "t"
                            })
                        }
                    },
                    error: function () {
                        layer.msg("回调失败", {
                            icon: 5,
                            offset: 't'
                        });
                    },
                });
                //同步更新缓存对应的值
                obj.update({
                    depend_key: value
                });
                layer.close(index);

            });
        }
        //编辑替换的key
        else if (obj.event === 'replace_key') {
            layer.prompt({
                formType: 2
                , value: data.replace_key
                , title: ["编辑replace_key"]
                , skin: "layui-layer-lan"
                , shade: 0.6
                , area: ['300px', '150px'] //自定义文本域宽高
                , maxlength: 500000

            }, function (value, index) {
                $.ajax({
                    cache: false,
                    url: "/api/v1/processapi/update_case/" + id + '/',
                    type: 'GET',
                    async: false,
                    data: {
                        "replace_key": value
                    },
                    success: function (data) {
                        if (data.code === 1000) {
                            layer.msg(data.msg, {
                                icon: 6, offset: "t"
                            })
                        } else {
                            layer.msg(data.error, {
                                icon: 5, offset: "t"
                            })
                        }
                    },
                    error: function () {
                        layer.msg("回调失败", {
                            icon: 5,
                            offset: 't'
                        });
                    },
                });
                //同步更新缓存对应的值
                obj.update({
                    replace_key: value
                });
                layer.close(index);

            });
        }
        //编辑替换的区域
        else if (obj.event === 'replace_position') {
            var update_head = layer.open({
                type: 1
                , title: ["编辑替换区域"]
                , skin: "layui-layer-lan"
                , shade: 0.6
                , shadeClose: true
                , moveOut: true
                , area: ["30%", '25%'] //自定义文本域宽高
                , content: $("#replace_position").html(),
                success: function () {
                    layui.use('form', function () {
                        var form = layui.form;
                        //console.log(data.replace_position);
                        //let l = JSON.parse(data.replace_position);
                        //let res = [];
                        //if(l.length == 2){
                        //res.push(true);
                        //res.push(true)
                        //}else if(l.length == 1){
                        //    if (l[0] == "params") {
                        //        res.push(true);
                        //        res.push(false)
                        //    }else{
                        //        res.push(false);
                        //        res.push(true)
                        //    }
                        //}else {
                        //    res.push(false);
                        //    res.push(false)
                        //}
                        form.val("replace_position", {
                            //"params":res[0],
                            //"body":res[1]
                        });
                        //监听编辑用户信息，
                        form.on('submit(replace_position)', function (data) {
                            let position_arr = ["params", "body"];
                            let par = [];
                            position_arr.map(function (data) {
                                //console.log($("input[name^=" + data + "]").next("div").hasClass("layui-form-checked"));
                                if ($("input[name^=" + data + "]").next("div").hasClass("layui-form-checked")) {
                                    par.push(data);
                                }
                            });
                            console.log(par);
                            let num = "";
                            if (par.length == 2) {
                                num = 2
                            } else if (par.length == 1 && par.indexOf("params") == 0) {
                                num = 0
                            } else if (par.length == 1 && par.indexOf("body") == 0) {
                                num = 1
                            }
                            console.log("请求的replace_position为：" + String(num));
                            $.ajax({
                                url: "/api/v1/processapi/update_case/" + obj.data['caseid'] + '/',
                                type: 'GET',
                                data: {
                                    "replace_position": num
                                },
                                success: function (data) {
                                    if (data.code === 1000) {
                                        layer.msg(data.msg, {
                                            icon: 6, offset: "t"
                                        })
                                    } else {
                                        layer.msg(data.error, {
                                            icon: 5, offset: "t"
                                        })
                                    }
                                    $(".layui-laypage-btn").click();
                                },
                                error: function () {
                                    layer.msg("回调失败", {
                                        icon: 5,
                                        offset: 't'
                                    });
                                },
                                complete: function () {
                                    layer.close(update_head);
                                }

                            });
                            return false;//阻止表单跳转
                        });
                    })
                }

            });
        }
        //编辑接口整体
        else if (obj.event === 'update_case') {
            get_role_by_system("option", "identity");
            get_belong_by_system("belong");
            get_head("head");
            var a = layer.open({
                type: 1,
                title: "编辑用例",
                area: ['35%', "80%"],
                skin: "layui-layer-molv",
                shada: 0.6,
                content: $("#add_update_case").html(),
                success: function () {
                    layui.use(['form', "jquery"], function () {
                        var form = layui.form;
                        var caseid = data.caseid;
                        console.log(data);
                        form.val("add_update_case", {
                            "caseID": data.caseid,
                            "casename": data.casename,
                            "identity": data.identity,
                            "url": data.url,
                            "method": data.method,
                            "belong": data.belong,
                            "params": data.params,
                            "body": data.body,
                            "head": data.head,
                            //"isprocess": data.isprocess,
                            "dependid": data.depend_id,
                            "dependkey": data.depend_key,
                            "replacekey": data.replace_key,
                            //"replaceposition": data.replace_position,
                        });
                        //监听编辑用户信息，
                        form.on('radio(depend)', function (data) {
                            console.log(data.elem); //得到radio原始DOM对象
                            console.log(data.value); //被点击的radio的value值
                            if (data.value == "exist") {
                                $(".mydepend").css("display", "block")
                                console.log("我应该展现依赖相关内容")
                            } else {
                                $(".mydepend").css("display", "none")
                            }
                        });
                        form.render('radio', 'depend'); //更新 lay-filter="depend" 所在容器内的全部 radio 状态
                        form.on('submit(add_update_case)', function (data) {
                            console.log(data.field);
                            let position_arr = ["params", "body"];
                            let par = [];
                            position_arr.map(function (data) {
                                //console.log($("input[name^=" + data + "]").next("div").hasClass("layui-form-checked"));
                                if ($("input[name^=" + data + "]").next("div").hasClass("layui-form-checked")) {
                                    par.push(data);
                                }
                            });
                            console.log(par);
                            let num = "";
                            if (par.length == 2) {
                                num = 2
                            } else if (par.length == 1 && par.indexOf("params") == 0) {
                                num = 0
                            } else if (par.length == 1 && par.indexOf("body") == 0) {
                                num = 1
                            }
                            console.log("请求的replace_position为：" + String(num));
                            $.ajax({
                                cache: false,
                                url: "/api/v1/processapi/update_case/" + id + "/",
                                type: 'PUT',
                                data: {
                                    "identity": data.field.identity,
                                    "casename": data.field.casename,
                                    "url": data.field.url,
                                    "caseID": data.field.caseID,
                                    "method": data.field.method,
                                    "belong": data.field.belong,
                                    "params": data.field.params,
                                    "isprocess": data.field.isprocess,
                                    "body": data.field.body,
                                    "depend_id": data.field.dependid,
                                    "depend_key": data.field.dependkey,
                                    "replace_key": data.field.replacekey,
                                    "replace_position": num,
                                    "system": "{{ system }}",
                                    "head": data.field.head

                                },
                                beforeSend: function () {
                                    l_index = layer.load(0, {shade: [0.5, '#DBDBDB']});
                                },
                                success: function (data) {
                                    if (data.code === 1000) {
                                        layer.msg(data.msg, {
                                            icon: 6, offset: "t"
                                        })
                                    } else {
                                        layer.msg(data.error, {
                                            icon: 5, offset: "t"
                                        })
                                    }
                                    $(".layui-laypage-btn").click();
                                },
                                error: function () {
                                    layer.msg("回调失败", {
                                        icon: 5,
                                        offset: 't'
                                    });
                                },
                                complete: function () {
                                    layer.close(l_index);
                                    layer.close(a);
                                }

                            });
                            return false;//阻止表单跳转
                        });
                    });
                }
            });

        }
        //接口调试
        else if (obj.event === "interface_debug") {
            console.log(data);
            var debug = layer.open({
                //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                type: 1,
                title: "接口调试",
                skin: "layui-layer-molv",
                area: ['40%', '100%'],
                offset: 'lb',
                content: $("#interface_debug").html(),
                success: function () {
                    layui.use(['form', "jquery"], function () {
                        var form = layui.form,
                            $ = layui.$;
                        form.val("interface_debug", {
                            "url": data.url,
                            "params": data.params,
                            "body": data.body,
                            "method": data.method,
                            "headers": data.header
                        });
                        form.on('submit(interface_debug)', function (data) {
                            console.log(typeof (data.field.headers));
                            console.log(data.field.headers);
                            $.ajax({
                                cache: false,
                                url: "/api/v1/interface_set/debug_test/",
                                type: 'POST',
                                data: {
                                    "url": data.field.url,
                                    "method": data.field.method,
                                    "headers": data.field.headers,
                                    "params": data.field.params,
                                    "body": data.field.body,
                                },
                                beforeSend: function () {
                                    l_index = layer.load(0, {shade: [0.5, '#DBDBDB']});
                                },
                                success: function (data) {
                                    let duration = data.duration;
                                    $("#duration").html(duration);
                                    let status_code = data.status_code;
                                    $("#status_code").html(status_code);
                                    let response_headers = JSON.stringify(data.response_headers, null, 4);
                                    $("#response_headers").html(response_headers);
                                    let response_body = JSON.stringify(data.response_body, null, 4);
                                    $("#response_body").html(response_body);
                                    if (data.code === 1000) {
                                        layer.msg(data.msg, {
                                            icon: 6, offset: "t"
                                        })
                                    } else {
                                        layer.msg(data.error, {
                                            icon: 5, offset: "t"
                                        })
                                    }
                                    layer.open({
                                        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                                        type: 1,
                                        title: "响应体",
                                        skin: "layui-layer-molv",
                                        area: ['40%', '100%'],
                                        offset: 'rb',
                                        content: $("#response_info").html(),
                                        success: function () {
                                            //console.log(res);
                                        }
                                    })

                                },
                                error: function () {
                                    layer.msg("回调失败", {
                                        icon: 5,
                                        offset: 't'
                                    });

                                },
                                complete: function () {

                                    layer.close(l_index);
                                    //layer.close(debug);
                                }

                            });
                            return false;//阻止表单跳转
                        });
                    });
                }
            });
        }
    });
});


//获取责任者
function get_head(id) {
    $.ajax({
        url: "/api/v1/publicapi/get_head/",
        type: 'GET',
        async: false,
        success: function (data) {
            var str = '';
            //data是数组时，index是当前元素的位置，value是值
            $.each(data, function (index, value) {
                str += "<option value='" + value + "'>" + value + "</option>";
            });
            console.log(str);
            $('#' + id).empty();
            $('#' + id).append(str);

        },
        error: function () {
            layer.msg("回调失败", {
                icon: 5,
                offset: 't'
            });
        },
    });
    //console.log(res);
    //return res
}

//新建用例
function add_case() {
    get_role_by_system("option", "identity");
    get_belong_by_system("belong");
    get_head("head");
    var Create_apicase = layer.open({
        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        type: 1,
        title: "新建用例",
        skin: "layui-layer-molv",
        shade: 0.6,
        area: ['35%', '80%'],
        //offset: 't',
        content: $("#add_update_case").html(),
        success: function () {
            layui.use(['form', "jquery"], function () {
                var form = layui.form,
                    $ = layui.$;
                form.val("add_update_case", {
                    "depend": "unexist"
                });
                form.on('radio(depend)', function (data) {
                    console.log(data.elem); //得到radio原始DOM对象
                    console.log(data.value); //被点击的radio的value值
                    if (data.value == "exist") {
                        $(".mydepend").css("display", "block")
                        console.log("我应该展现依赖相关内容")
                    } else {
                        $(".mydepend").css("display", "none")
                    }
                });
                form.render('radio', 'depend'); //更新 lay-filter="depend" 所在容器内的全部 radio 状态
                form.on('submit(add_update_case)', function (data) {
                    console.log(data.field);
                    let position_arr = ["params", "body"];
                    let par = [];
                    position_arr.map(function (data) {
                        //console.log($("input[name^=" + data + "]").next("div").hasClass("layui-form-checked"));
                        if ($("input[name^=" + data + "]").next("div").hasClass("layui-form-checked")) {
                            par.push(data);
                        }
                    });
                    console.log(par);
                    let num = "";
                    if (par.length == 2) {
                        num = 2
                    } else if (par.length == 1 && par.indexOf("params") == 0) {
                        num = 0
                    } else if (par.length == 1 && par.indexOf("body") == 0) {
                        num = 1
                    }
                    console.log("请求的replace_position为：" + String(num));
                    $.ajax({
                        cache: false,
                        url: "/api/v1/processapi/add_case/",
                        type: 'POST',
                        data: {
                            "identity": data.field.identity,
                            "casename": data.field.casename,
                            "url": data.field.url,
                            "method": data.field.method,
                            "belong": '{{ belong }}',
                            "params": data.field.params,
                            "body": data.field.body,
                            "depend_id": data.field.dependid,
                            "depend_key": data.field.dependkey,
                            "replace_key": data.field.replacekey,
                            "replace_position": num,
                            "system": "{{ system }}",
                            "head": data.field.head
                        },
                        beforeSend: function () {
                            l_index = layer.load(0, {shade: [0.5, '#DBDBDB']});
                        },
                        success: function (data) {
                            if (data.code === 1000) {
                                layer.msg(data.msg, {
                                    icon: 6, offset: "t"
                                })
                            } else {
                                layer.msg(data.error, {
                                    icon: 5, offset: "t"
                                })
                            }
                            $(".layui-laypage-btn").click();
                        },
                        error: function () {
                            layer.msg("回调失败", {
                                icon: 5,
                                offset: 't'
                            });
                        },
                        complete: function () {
                            layer.close(l_index);
                            layer.close(Create_apicase);
                        }

                    });
                    return false;//阻止表单跳转
                });
            });
        }
    });
}

//获取模块参数
function get_belong_by_system(id) {
    //var res = {};
    $.ajax({
        //cache: false,
        url: "/api/v1/menu/get_belong_by_system/",
        type: 'GET',
        async: false,
        data: {
            "system": '{{ system }}',
            "area": "process"
        },
        success: function (data) {
            //res = data;
            var str = '';
            //data是数组时，index是当前元素的位置，value是值
            $.each(data, function (index, value) {
                str += "<option value='" + value + "'>" + value + "</option>";
            });
            console.log(str);
            $('#' + id).empty();
            $('#' + id).append(str);

        },
        error: function () {
            layer.msg("回调失败", {
                icon: 5,
                offset: 't'
            });
        },
    });
    //console.log(res);
    //return res
}

//获取系统角色
function get_role_by_system(attrtype, id) {
    //attrtype：什么标签
    //id:父标签的id属性值
    $.ajax({
        //cache: false,
        url: "/api/v1/systemrole/get_role_by_system/",
        type: 'GET',
        async: false,
        data: {
            "system": '{{ system }}'
        },
        success: function (data) {
            console.log(data);
            console.log(typeof (data));
            var str = '';
            //data是obj时，index是key，value是值
            $.each(data, function (index, value) {
                console.log(index);
                console.log(value);
                if (attrtype == "option") {
                    console.log("我渲染的" + id);
                    str += "<option value='" + value + "'>" + value + "</option>";
                    $('#' + id).empty();
                    $('#' + id).append(str);
                } else if (attrtype == "input") {
                    console.log("我渲染的" + id);
                    str += "<input type=\"radio\" name=\"identity\" value='" + value + "' title='" + value + "'>";
                    $('#' + id).empty();
                    $('#' + id).append(str);
                }

            });
            console.log(str);

        },
        error: function () {
            layer.msg("回调失败", {
                icon: 5,
                offset: 't'
            });
        },
    });
}

//添加用户角色
function add_role() {
    var add_role = layer.open({
        type: 1,
        title: "添加用户角色",
        area: ['40%', ''],
        shade: 0.6,
        skin: "layui-layer-rim",
        content: $("#add_update_role").html(),
        success: function () {
            layui.use(['form', "jquery"], function () {
                var form = layui.form;
                $ = layui.$;
                form.val("add_update_role", {
                    "role": "【】",
                    "password": "Y+zilsR88g9SZI8WOeHJlA=="
                });
                //监听编辑用户信息，
                form.on('submit(add_update_role)', function (data) {
                    $.ajax({
                        cache: false,
                        url: "/api/v1/systemrole/add_role/",
                        type: 'POST',
                        data: {
                            "system": "{{ system }}",
                            "role": data.field.role,
                            "username": data.field.username,
                            "password": data.field.password,
                            "ip": data.field.url,
                            "token": data.field.token
                        },
                        success: function (data) {
                            if (data.code === 1000) {
                                layer.msg(data.msg, {
                                    icon: 6, offset: "t"
                                })
                            } else {
                                layer.msg(data.error, {
                                    icon: 5, offset: "t"
                                })
                            }
                            $(".layui-laypage-btn").click();

                        },
                        error: function () {
                            layer.msg("回调失败", {
                                icon: 5,
                                offset: 't'
                            });
                        },
                        complete: function () {
                            layer.close(add_role)

                        }
                    });
                    return false;//阻止表单跳转
                });


            });
        }
    });

}

//获取用户信息
function get_user_info() {
    var userinfo = layer.open({
        type: 1,
        title: "用户信息",
        area: ['70%', "70%"],
        skin: 'layui-layer-molv',
        shade: 0.6,
        content: '<div style="padding:15px;"><table id="roletable" lay-filter="roletable"></table></div>',
        success: function () {
            layui.use(["table"], function () {
                var table = layui.table
                    , layer = layui.layer;
                table.render({
                    elem: '#roletable'
                    , url: "/api/v1/systemrole/list/"
                    , limit: 10
                    , toolbar: '#roletoolbarDemo'
                    , height: 'full-420'
                    , page: true
                    , initSort: {
                        field: "system",
                        type: "desc"
                    },
                    where: {
                        "system": "{{ system }}"
                    },
                    id: "roletable"
                    , size: 'lg'
                    , cols: [[
                        {type: 'checkbox'},
                        {title: '操作', toolbar: '#rolebarDemo', width: 100, align: "left"}
                        , {field: 'role', title: '角色名', align: "left"}
                        , {field: 'username', title: '用户名', align: "left"}
                        , {field: 'password', title: '用户密码', align: "left"}
                        , {field: 'token', title: '请求令牌', align: "left"}
                        , {field: 'system', title: '所属系统', align: "left"}
                        , {field: 'ip', title: 'ip地址', align: "left"}
                    ]]
                });
                table.on('tool(roletable)', function (obj) {
                    //编辑角色
                    if (obj.event === 'update_role') {
                        var data = obj.data;
                        console.log(data);
                        var update_role = layer.open({
                            type: 1,
                            title: "编辑用户信息",
                            area: ['40%', ''],
                            shade: 0.6,
                            skin: "layui-layer-rim",
                            content: $("#add_update_role").html(),
                            success: function () {
                                layui.use(['form', "jquery"], function () {
                                    var form = layui.form;
                                    $ = layui.$;
                                    form.val("add_update_role", {
                                        "role": data.role,
                                        "system": data.system,
                                        "url": data.ip,
                                        "token": data.token,
                                        "username": data.username,
                                        "password": data.password
                                    });
                                    let id = data.id;
                                    form.on('submit(add_update_role)', function (data) {
                                        $.ajax({
                                            cache: false,
                                            url: "/api/v1/systemrole/update_role/" + id + "/",
                                            type: 'PUT',
                                            data: {
                                                "role": data.field.role,
                                                "system": data.field.system,
                                                "ip": data.field.url,
                                                "token": data.field.token,
                                                "username": data.field.username,
                                                "password": data.field.password
                                            },
                                            success: function (data) {
                                                if (data.code === 1000) {
                                                    layer.msg(data.msg, {
                                                        icon: 6, offset: "t"
                                                    })
                                                } else {
                                                    layer.msg(data.error, {
                                                        icon: 5, offset: "t"
                                                    })
                                                }
                                                $(".layui-laypage-btn").click();
                                            },
                                            error: function () {
                                                layer.msg("回调失败", {
                                                    icon: 5,
                                                    offset: 't'
                                                });
                                            },
                                            complete: function () {
                                                layer.close(update_role)

                                            }
                                        });
                                        return false;//阻止表单跳转
                                    });


                                });
                            }
                        });

                    } else if (obj.event === 'del_role') {
                        layer.confirm('真的删除行么', {icon: 2, title: "删除提示"}, function (index) {
                            console.log(obj.data);
                            //layer.msg("确定删除",{icon:1});
                            obj.del();//删除对应行（tr）的DOM结构，并更新缓存
                            layer.close(index);
                            //向服务端发送删除指令
                            var id = obj.data["id"];
                            console.log(id);
                            $.ajax({
                                url: "/api/v1/systemrole/del_role/" + id + "/",
                                type: 'DELETE',
                                success: function (data) {
                                    if (data.code === 1000) {
                                        layer.msg(data.msg, {
                                            icon: 6, offset: "t"
                                        })
                                    } else {
                                        layer.msg(data.error, {
                                            icon: 5, offset: "t"
                                        })
                                    }
                                    $(".layui-laypage-btn").click();
                                },
                                error: function () {
                                    layer.msg("回调失败", {
                                        icon: 5,
                                        offset: 't'
                                    });
                                },
                            });
                        });
                    }

                });
                table.on('toolbar(roletable)', function (obj) {
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        //添加角色
                        case 'add_role':
                            add_role();
                            break;
                        case "get_token":
                            //获取token
                            var res = checkStatus.data;
                            console.log(res);
                            let list_id = [];
                            for (i = 0; i < res.length; i++) {
                                list_id.push(res[i].id)
                            }
                            console.log(list_id);
                            $.ajax({
                                cache: false,
                                url: "/api/v1/systemrole/get_token_by_id/",
                                type: 'PUT',
                                data: {
                                    ids: JSON.stringify(list_id)
                                },
                                success: function (data) {
                                    //layer.closeAll();
                                    if (data.code === 1000) {
                                        layer.msg(data.msg, {
                                            icon: 6, offset: "t"
                                        })
                                    } else {
                                        layer.msg(data.error, {
                                            icon: 5, offset: "t"
                                        })
                                    }
                                    $(".layui-laypage-btn").click();
                                },
                                error: function () {
                                    layer.msg("回调失败", {
                                        icon: 5,
                                        offset: 't'
                                    });
                                }

                            });
                    }
                });
            });
        },
        btn: ['关闭'],
        yes: function () {
            layer.close(userinfo);
        }

    });
}