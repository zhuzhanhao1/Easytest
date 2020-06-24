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
        , url: '/api/v1/excute_plan/list/' //数据接口"exports"
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter',  {title: '导入数据', layEvent: 'import_case', icon: 'layui-icon-upload-circle'}, 'print']
        , title: '执行任务列表'
        , page: {groups: 5} //开启分页
        , loading: false
        , height: 'full-80'
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
                field: 'plan_name',
                title: '计划名称',
                align: "left",
                excel: {color: '0040ff', bgColor: 'f3fef3'},
                edit: "text"
                //templet: "#casenameTpl"
            }
            , {field: 'description', title: '描述', width: 200, align: "left", edit: "text"}
            , {field: 'ploy', title: '策略', width: 200, align: "left", edit: "text"}
            , {
                field: 'notification', title: '是否通知', align: "left"
            }
            , {field: 'status', title: '当前状态', width: 90, align: "left", templet: "#methodTpl"}
            , {
                field: '', title: '前置处理', width: 90, align: "left"
                , isChild: function (row) {
                    return row.preprocessor == 'True'
                }
                , collapse: true
                , icon: ['layui-icon layui-icon-star', 'layui-icon layui-icon-star-fill']
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
                            {
                                field: 'replace_position',
                                title: '替换区域(params:0,body:1,all:2)',
                                align: "left",
                                edit: 'text'
                            }
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
                            if (obj.field == "depend_id") {
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
                                        table.reload(this.id);
                                    }
                                });
                            } else if (obj.field == "depend_key") {
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
                                        table.reload(this.id);
                                    }
                                });
                            } else if (obj.field == "replace_key") {
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
                                        table.reload(this.id);
                                    }
                                });
                            } else if (obj.field == "replace_position") {
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
                                        table.reload(this.id);
                                    }
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
            , {
                field: 'start_time', title: '开始时间', align: "left", templet: function (res) {
                    let date = new Date(+new Date(res.start_time) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                    console.log(date);
                    console.log(typeof (date));
                    return '<span>'+date+'</span>'
                }
            }
            , {field: 'end_time', title: '结束时间', align: "left", templet: function (res) {
                    let date = new Date(+new Date(res.start_time) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                    console.log(date);
                    console.log(typeof (date));
                    return '<span>'+date+'</span>'
                }}
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
                , where: {plan_name: demoReload.val()}
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
        }

    });

    //监听行工具事件
    table.on('tool(test)', function (obj) {
        var data = obj.data;
        var id = data['id'];
        console.log(obj);
        //删除接口用例
       if (obj.event === 'del_plan') {
            layer.confirm('你确定要删除吗' + '？', {
                    btn: ['取消', '确定'] //按钮
                },
                function () {
                    layer.msg('幸亏没删除，删除就彻底找不回咯！', {icon: 0,offset:"t"});
                },
                function () {
                    $.ajax({
                        url: "/api/v1/excute_plan/del_plan/" + id + "/",
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
        else if (obj.event === 'update_plan') {
            var a = layer.open({
                type: 1,
                title: "编辑计划任务",
                area: ['35%',""],
                skin: "layui-layer-molv",
                shada: 0.6,
                content: $("#add_update_case").html(),
                success: function () {
                    layui.use(['form', "jquery",'laydate'], function () {
                        var form = layui.form,
                            $ = layui.$;
                        var laydate = layui.laydate;
                        let id = data.id;
                        form.val("add_update_case", {
                            "plan_name": data.plan_name,
                            "description": data.description,
                            "ploy": data.ploy,
                            "notification": data.notification,
                            "status": data.status,
                            "start_time": data.start_time,
                            "end_time": data.end_time,
                        });
                        lay('.test-item').each(function(){
                            laydate.render({
                              elem: this
                              ,trigger: 'click'
                              ,type: 'datetime'
                            });
                          });

                        console.log(data);
                        form.on('submit(add_update_case)', function (data) {
                            $.ajax({
                                url: "/api/v1/excute_plan/update_plan/" + id + "/",
                                type: 'PUT',
                                data: {
                                    "plan_name": data.field.plan_name,
                                    "description": data.field.description,
                                    "ploy": data.field.ploy,
                                    "notification": data.field.notification,
                                    "status": data.field.status,
                                    "start_time": data.field.start_time,
                                    "end_time": data.field.end_time,
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
    });
    table.on('edit(test)', function (obj) {
        var value = obj.value //得到修改后的值
            , data = obj.data //得到所在行所有键值
            , field = obj.field; //得到字段
        //layer.msg('[ID: '+ data.id +'] ' + field + ' 字段更改为：'+ value);
        if (field == "plan_name") {
            $.ajax({
                url: "/api/v1/excute_plan/update_plan/" + data.id + '/',
                type: 'PUT',
                data: {
                    "plan_name": value
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
                url: "/api/v1/excute_plan/update_plan/" + data.id + '/',
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
    });
});


//新建用例
function add_plan() {
    var add_interface = layer.open({
        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        type: 1,
        title: "添加计划任务",
        skin: "layui-layer-molv",
        shade: 0.6,
        area: ['35%',],
        //offset: 't',
        content: $("#add_update_case").html(),
        success: function () {
            layui.use(['form', "jquery", "laydate"], function () {
                var form = layui.form,
                    $ = layui.$;
                var laydate = layui.laydate;
                form.val("add_update_case", {});
                lay('.test-item').each(function(){
                    laydate.render({
                      elem: this
                      ,trigger: 'click'
                      ,type: 'datetime'
                      ,isInitValue: false
                    });
                  });
                form.on('submit(add_update_case)', function (data) {
                    console.log(data.field);
                    $.ajax({
                        url: "/api/v1/excute_plan/add_plan/",
                        type: 'POST',
                        data: {
                            "plan_name": data.field.plan_name,
                            "description": data.field.description,
                            "ploy": data.field.ploy,
                            "notification": data.field.notification,
                            "status": data.field.status,
                            "start_time": data.field.start_time,
                            "end_time": data.field.end_time,
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
                            layer.close(add_interface);
                        }

                    });
                    return false;//阻止表单跳转
                });
            });
        }
    });
}

