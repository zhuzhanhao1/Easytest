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
        , url: '/api/v1/relevance_interface/list/' //数据接口"exports"
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter',  {title: '导入数据', layEvent: 'import_case', icon: 'layui-icon-upload-circle'}, 'print']
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
                    error: function (dataa) {
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
            , {
                field: 'interface_name',
                title: '接口名称',
                align: "left",
                excel: {color: '0040ff', bgColor: 'f3fef3'},
                edit: "text"
            }
            , {field: 'description', title: '描述', align: "left", edit: "text"}
            , {field: 'interface_id', title: '关联的接口id', align: "left"}
            , {field: 'duration', title: '响应时长', align: "left"}
            , {field: 'result', title: '响应结果', align: "left"}
            , {field: 'head', title: '负责人', align: "left",edit: "text"}
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
                , where: {interface_name: demoReload.val()}
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
            //导出用例
            case "export_interface":
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
                    layer.msg('前端的导出，没调取接口，需先勾选数据在导出，后期改为后台导出！', {icon: 0, offset: 't'});
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
            //导入接口
            case "import_interface":
                layer.open({
                    //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                    type: 1,
                    title: "导入接口",
                    area: ['35%', '30%'],
                    skin: "layui-layer-rim",
                    shade: 0.6,
                    content: $("#import_interface").html()
                });
                break;
            //批量删除
            case "batch_delete":
                var data = checkStatus.data;
                if (checkStatus.data.length > 0) {
                    layer.confirm('你确定要删除吗' + '？', {
                            btn: ['取消', '确定'] //按钮
                        },
                        function () {
                            layer.msg('幸亏没删除，删除就彻底找不回咯！', {icon: 0, offset: "t"});
                        },
                        function () {
                            layer.msg('请联系超级管理员删除！', {icon: 0, offset: "t"});
                        });
                }else{
                    layer.msg('请先勾选需要删除的接口哦！', {icon: 0, offset: "t"});
                }
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

    //监听行工具事件
    table.on('tool(test)', function (obj) {
        var data = obj.data;
        var id = data['id'];
        console.log(obj);
        //删除接口用例
       if (obj.event === 'del_interface') {
            layer.confirm('你确定要删除吗' + '？', {
                    btn: ['取消', '确定'] //按钮
                },
                function () {
                    layer.msg('幸亏没删除，删除就彻底找不回咯！', {icon: 0,offset:"t"});
                },
                function () {
                    $.ajax({
                        url: "/api/v1/relevance_interface/del_interface/" + id + "/",
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
                    });
                });
        }
        //编辑接口整体
        else if (obj.event === 'update_interface') {
            var a = layer.open({
                type: 1,
                title: "编辑关联的接口",
                area: ['40%', "100%"],
                skin: "layui-layer-molv",
                shada: 0.6,
                offset:"rb",
                content: $("#add_update_case").html(),
                success: function () {
                    layui.use(['form', "jquery"], function () {
                        var form = layui.form;
                        let interface_id = data["interface_id"];
                        let belong_module = data["belong_module"];
                        console.log(interface_id,belong_module);
                        form.val("add_update_case", {
                            "interface_name": data.relevance_interface_name,
                            "url": data.url,
                            "tcp": data.tcp,
                            "ip": data.ip,
                            "method": data.method,
                            "params": data.params,
                            "headers": data.headers,
                            "body": data.body,
                            "preprocessor": data.preprocessor,
                            "depend_id": data.depend_id,
                            "depend_key": data.depend_key,
                            "replace_key": data.replace_key,
                            "replace_position": data.replace_position,
                        });
                        //监听编辑用户信息，
                        form.on('radio(preprocessor)', function (data) {
                            console.log(data.elem); //得到radio原始DOM对象
                            console.log(data.value); //被点击的radio的value值
                            if (data.value == "True") {
                                $(".mydepend").css("display", "block");
                                console.log("我应该展现依赖相关内容")
                            } else {
                                $(".mydepend").css("display", "none")
                            }
                        });
                        form.render('radio', 'preprocessor'); //更新 lay-filter="preprocessor" 所在容器内的全部 radio 状态
                        form.on('submit(add_update_case)', function (data) {
                            $.ajax({
                                cache: false,
                                url: "/api/v1/interface_set/update_interface/" + interface_id + "/",
                                type: 'PUT',
                                data: {
                                    "interface_name": data.field.interface_name,
                                    "url": data.field.url,
                                    "tcp": data.field.tcp,
                                    "ip": data.field.ip,
                                    "method": data.field.method,
                                    "belong_module": belong_module,
                                    "params": data.field.params,
                                    "headers": data.field.headers,
                                    "preprocessor": data.field.preprocessor,
                                    "body": data.field.body,
                                    "depend_id": data.field.depend_id,
                                    "depend_key": data.field.depend_key,
                                    "replace_key": data.field.replace_key,
                                    "replace_position": data.field.replace_position,
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
                            "tcp": data.tcp,
                            "ip": data.ip,
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
                                    "tcp": data.field.tcp,
                                    "ip": data.field.ip,
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
                                    try {
                                        if (data.code === 1000) {
                                            layer.msg(data.msg, {
                                                icon: 6, offset: "t"
                                            })
                                        }
                                        else {
                                            layer.msg(data.error, {
                                                icon: 5, offset: "t"
                                            })
                                        }
                                    } catch(e) {
                                        console.log('捕获到异常：',e);
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
                                error: function (data) {
                                    try {
                                        if (data.responseJSON.code === 1001) {
                                            layer.msg(data.responseJSON.error, {
                                                icon: 5,
                                                offset: 't'
                                            });
                                        }
                                        else {
                                            layer.msg("回调失败", {
                                                icon: 5,
                                                offset: 't'
                                            });
                                        }
                                    } catch(e) {
                                        console.log('捕获到异常：',e);
                                        layer.msg(e, {
                                                icon: 5, offset: "t"
                                            })
                                    }

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
    table.on('edit(test)', function (obj) {
        var value = obj.value //得到修改后的值
            , data = obj.data //得到所在行所有键值
            , field = obj.field; //得到字段
        //layer.msg('[ID: '+ data.id +'] ' + field + ' 字段更改为：'+ value);
        if (field == "interface_name") {
            $.ajax({
                url: "/api/v1/relevance_interface/update_interface/" + data.id + '/',
                type: 'PUT',
                data: {
                    "interface_name": value
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
                }
            });
        }
        else if (field == "description") {
            $.ajax({
                url: "/api/v1/relevance_interface/update_interface/" + data.id + '/',
                type: 'PUT',
                data: {
                    "description": value
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
                }
            });
        }
        else if (field == "head") {
            $.ajax({
                url: "/api/v1/relevance_interface/update_interface/" + data.id + '/',
                type: 'PUT',
                data: {
                    "head": value
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
                }
            });
        }
    });
});

function add_relevance_interface() {
    var search_interface = layer.open({
        type: 2,
        title: "从接口库中搜索后添加",
        area: ['80%', "80%"],
        skin: 'layui-layer-molv',
        shade: 0.6,
        minmax:true,
        content: '/interface_search/?parentId='+parentId,
        success: function () {
            layer.msg('打开搜索界面成功！', {icon: 6, offset: 't'});
        },
        btn: ['关闭'],
        yes: function () {
            layer.close(search_interface);
        }

    });
}
