
// 自定义模块
layui.config({
    base: './../static/js/layui2.5.5/lay/modules/',   // 模块目录
    version: 'v1.3.28'
}).extend({             // 模块别名
    soulTable: 'soulTable'
});

layui.use(['table', "soulTable",'util'], function (data) {
    var table = layui.table;
    var util = layui.util;
    soulTable = layui.soulTable;
    //第一个实例
    var layer = layui.layer;
    var index = layer.load(0); //添加laoding,0-2两种方式
    var myTable = table.render({
        elem: '#test'
        , url: '/api/v1/singleapi/list/' //数据接口"exports"
        , toolbar: '#toolbarDemo'
        , defaultToolbar: [
            {title: '批量删除', layEvent: 'batch_delete', icon: 'layui-icon-delete'},
            {title: '导出数据', layEvent: 'export_case', icon: 'layui-icon-download-circle'},
            {title: '全屏显示', layEvent: 'fullScreen', icon: 'layui-icon-top'},
            {title: '导入数据', layEvent: 'import_case', icon: 'layui-icon-upload-circle'},
            'filter', 'print'
        ]
        , title: '接口测试'
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
                        "type": "single"
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
        , size: 'lg'	//大尺寸 /sm小尺寸
        , skin: 'line' //行边框风格 /row列表框风格 /nob无边框风格
        , limit: 10
        , limits: [10, 20, 30, 100, 200, 500]
        , where: {//额外参数
            belong: '{{ belong }}',
            system: '{{ system }}'
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
            , {title: '操作', toolbar: '#barDemo', width: 80, align: "left"}
            // {#, {field: 'caseid', title: '序号', width: 60, align: "left"}#}
            // {#, {field: 'belong', title: '', width: 60,  align: "left"}#}
            , {field: 'identity', title: '角色', width: 170, align: "left"}//, templet: "#identityTpl"
            , {
                field: 'casename',
                title: '接口名称',
                width: 220,
                align: "left",
                excel: {color: '0040ff', bgColor: 'f3fef3'},
                templet: "#casenameTpl",
                children: [
                    {
                        elem: '#child'
                        , url: "/api/v1/singleapi/parameter_details/"
                        , where: function (row) {
                            return {caseid: row.caseid}
                        }
                        , title: "请求参数详情"
                        , skin: 'line'
                        , size: "lg"
                        // {#, toolbar: '#toolbarchiildDemo'#}
                        ,toolbar:
                            '<div>' +
                            ' <a class="layui-btn layui-btn-normal layui-btn-sm" lay-event="add_parameter">添加参数</a>' +
                            '<a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="reload">重载表格</a>' +
                            ' <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="close">关闭表格</a>' +
                            '</div>'
                        //, height: 'full-10'
                        , cols: [[
                            {type: 'checkbox'}
                            , {title: '操作', width: 120, templet: function(row) {
                               return '<a class="layui-btn layui-btn-xs" lay-event="childEdit">编辑</a>' +
                                '<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="childDel">删除</a>'
                            }}
                            , {
                                field: 'id',
                                title: '序号',
                                width: 100,
                                align: "left"
                            }
                            , {
                                field: 'area',
                                title: '所在位置',
                                width: 150,
                                align: "left"
                            }
                            , {
                                field: 'isMust',
                                title: '是否必须',
                                width: 150,
                                align: "left",
                                sort: true,
                                templet: function (res) {
                                    if (res.isMust == "必填") {
                                        return '<span style="color: red;">' + "必填项" + '</span>'
                                    } else {
                                        return '<span style="color: yellow;">' + "非必填项" + '</span>'
                                    }
                                }
                            }
                            , {
                                field: 'parameter_field',
                                title: '参数名',
                                width: 220,
                                align: "left"
                            }
                            , {
                                field: 'parameter_that',
                                title: '参数说明',
                                align: "left"
                            }
                            , {
                                field: 'sample',
                                title: '示例',
                                align: "left"
                                // {#style: 'background-color: #e8ebf2;'#}
                            }
                        ]]
                        , rowEvent: function (obj, pobj) {
                            // 单击行事件
                            // obj 子表当前行对象
                            // pobj 父表当前行对象
                            obj.tr.css({'background': '#5FB878'}).siblings().removeAttr('style')
                            console.log(obj.tr) //得到当前行元素对象
                            console.log(obj.data) //得到当前行数据
                            console.log(pobj) //得到当前行数据
                            //obj.del(); //删除当前行
                            //obj.update(fields) //修改当前行数据
                        }
                        , toolEvent: function (obj, pobj) {
                            // obj 子表当前行对象
                            // pobj 父表当前行对象

                            var childId = this.id; // 通过 this 对象获取当前子表的id

                            if (obj.event === 'childEdit') {
                                console.log(obj.data.id);//子表数据行的id
                                console.log(this.id);//子表id
                                var a = layer.open({
                                    type: 1,
                                    title: "编辑请求参数",
                                    area: ['30%', ""],
                                    skin: "layui-layer-molv",
                                    shada: 0.6,
                                    content: $("#add_update_parameter").html(),
                                    success: function () {
                                        layui.use(['form', 'jquery'], function () {
                                            var form = layui.form;
                                            $ = layui.$;
                                            var caseid = obj.data.id;
                                            form.val("add_update_parameter", {
                                                "parameter_field": obj.data.parameter_field,
                                                "parameter_that": obj.data.parameter_that,
                                                "area": obj.data.area,
                                                "isMust": obj.data.isMust,
                                                "sample": obj.data.sample
                                            });
                                            //监听编辑用户信息，
                                            form.on('submit(add_update_parameter)', function (data) {
                                                console.log(data.field);
                                                $.ajax({
                                                    cache: false,
                                                    url: "/api/v1/singleapi/update_parameter/" + caseid + "/",
                                                    type: 'PUT',
                                                    data: {
                                                        "parameter_field": data.field.parameter_field,
                                                        "parameter_that": data.field.parameter_that,
                                                        "area": data.field.area,
                                                        "isMust": data.field.isMust,
                                                        "sample": data.field.sample
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
                                                        table.reload(childId);
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
                            } else if (obj.event === 'childDel') {
                                layer.confirm('真的要删除此行么', {icon: 2, title: "删除提示"}, function (index) {
                                    var id = obj.data.id;
                                    console.log(id);
                                    $.ajax({
                                        cache: false,
                                        url: "/api/v1/singleapi/del_parameter/" + id + "/",
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
                                            table.reload(childId);
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

                        }
                        , toolbarEvent: function (obj, pobj) {
                            var childId = this.id;
                            // obj 子表当前行对象
                            // pobj 父表当前行对象
                            if (obj.event === 'reload') {
                                //重载子表
                                table.reload(this.id);
                                layer.msg('重载成功！')
                            } else if (obj.event === 'delete') {
                                //删除父行
                                pobj.del()
                            } else if (obj.event === 'update') {
                                //更新父行数据
                                pobj.update({dynasty: pobj.data.dynasty + '+1'})
                            } else if (obj.event === 'close') {
                                //关闭子表
                                pobj.close()
                            } else if (obj.event === "add_parameter") {
                                var parent_id = pobj.data.caseid;
                                var Create_apicase = layer.open({
                                    //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                                    type: 1,
                                    title: "添加请求参数",
                                    skin: "layui-layer-molv",
                                    shade: 0.6,
                                    area: ['30%', ''],
                                    content: $("#add_update_parameter").html(),
                                    success: function () {
                                        layui.use(['form', 'jquery'], function () {
                                            var form = layui.form,
                                                $ = layui.$;
                                            //监听编辑用户信息，
                                            form.on('submit(add_update_parameter)', function (data) {
                                                $.ajax({
                                                    cache: false,
                                                    url: "/api/v1/singleapi/add_parameter/",
                                                    type: 'POST',
                                                    data: {
                                                        "parameter_field": data.field.parameter_field,
                                                        "parameter_that": data.field.parameter_that,
                                                        "area": data.field.area,
                                                        "isMust": data.field.isMust,
                                                        "sample": data.field.sample,
                                                        "parent_id": parent_id
                                                    },
                                                    beforeSend: function () {
                                                        l_index = layer.load(0, {shade: [0.5, '#DBDBDB']});
                                                    },
                                                    success: function (data) {
                                                        if (data.code === 1000) {
                                                            layer.msg(data.msg, {
                                                                icon: 6, offset: "t"
                                                            });
                                                            //table.reload(this.id);
                                                        } else {
                                                            layer.msg(data.error, {
                                                                icon: 5, offset: "t"
                                                            })
                                                        }
                                                        table.reload(childId);
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
                        }
                        , checkboxEvent: function (obj, pobj) {
                            // obj 子表当前行对象
                            // pobj 父表当前行对象
                            layer.msg('子表checkbox事件，当前是否选中：' + obj.checked)
                        }
                        , editEvent: function (obj, pobj) {
                            // obj 子表当前行对象
                            // pobj 父表当前行对象
                            layer.msg(obj.oldValue + " 已成功改为：" + obj.value);
                        }
                        , done: function (data) {
                            //console.log(data);
                            soulTable.render(this);
                        }

                    }

                ]
            }// filter: true
            , {
                field: 'url', title: '请求路径', width: 220, align: "left", templet: function (res) {
                    console.log(res.url);
                    var a = res.url.split("/");
                    return '<span>' + a[a.length - 1] + '</span>'
                }
            }
            , {field: 'method', title: '请求方式', width: 90, align: "left", templet: "#methodTpl"}
            , {field: 'params', title: 'Query参数', align: "left", event: 'params'}
            , {field: 'body', title: 'Body参数', event: 'body', align: "left"}
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
                    if (res.result == null || res.result == "") {
                        return '<span>' + res.result + '</span>'
                    } else if (res.result.indexOf("message") != -1 && res.result.indexOf("error") != -1) {
                        let b = JSON.parse(res.result);
                        return '<span style="color: red;">' + JSON.stringify(b["message"]) + '</span>'
                    } else {
                        return '<span>' + util.escape(res.result) + '</span>'
                    }
                }
            }
            , {field: 'head', title: '负责人', width: 80, align: "left", event: "head"}//merge: true行合并

        ]]
        , filter: {
            items: ['column', 'editCondition', 'excel'] // 只显示表格列和导出excel两个菜单项
        }
        , id: 'testReload'
        , rowEvent: function (obj) {
            obj.tr.css({'background': '#5FB878', 'color': 'white'}).siblings().removeAttr('style')
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
                , where: {
                    casename: demoReload.val()
                }
            }, 'data');
        }
    };

    $('.demoTable .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //头工具栏事件
    table.on('toolbar(test)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        //console.log(checkStatus);
        switch (obj.event) {
            //执行用例
            case 'run_case':
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
                        dic["caseid"] = data[i]["caseid"];
                        dic['identity'] = data[i]['identity'];
                        dic['casename'] = data[i]['casename'];
                        dic["url"] = data[i]['url'];
                        dic['method'] = data[i]['method'];
                        dic['params'] = data[i]['params'];
                        dic['body'] = data[i]['body'];
                        l.push(dic);
                    }
                    console.log(l);
                    $.ajax({
                        cache: false,
                        url: "/api/v1/singleapi/run/",
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
                                res = JSON.stringify(data.msg, null, 4);
                                layer.prompt({
                                    formType: 2,//多行文本
                                    value: res,
                                    title: '响应结果',
                                    maxmin: true, //允许全屏最小化
                                    anim: 4,//从左滚动进来
                                    //shade: 0.6, //遮罩透明度
                                    skin: "layui-layer-rim",
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
                                    area: ['800px', '600px'] //自定义文本域宽高
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
                    layer.confirm("你确定要发送接口请求结果给相应的负责人吗？\n注意:钉钉机器人发送，不可撤回！", {
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
                                    "isprocess": "no"
                                },
                                //请求前的处理,加载loading
                                beforeSend: function () {
                                    // {#document.getElementById("Dingding").setAttribute("disabled", true);#}
                                    // {#document.getElementById("Dingding").innerHTML = "loading...";#}
                                    l_index = layer.load(0, {
                                        shade: [0.5, '#DBDBDB'] //0.1透明度的白色背景
                                    });
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
                                    // {#document.getElementById("Dingding").removeAttribute("disabled");#}
                                    // {#document.getElementById("Dingding").innerHTML = "钉钉通知";#}
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
                    content: $("#importCase").html()
                });
                break;
            //批量删除用例
            case "batch_delete":
                var data = checkStatus.data;
                layer.confirm('真的删除行么', function (index) {
                    console.log(data);
                    layer.close(index);
                    var l = [];
                    for (i = 0; i < data.length; i++) {
                        l.push(data[i]["caseid"]);
                    }
                    console.log(l);
                    $.ajax({
                        cache: false,
                        url: "/api/v1/singleapi/del_case/0/",
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
                            layer.msg("回调失败", {
                                icon: 5,
                                offset: 't'
                            });
                        },
                    });
                });
                break;
            //重复执行
            case 'repeat_run':
                var data = checkStatus.data;
                console.log(data);
                if (data.length == 0) {
                    layer.close(index);
                    layer.msg("请先选中需要执行的用例", {
                        icon: 4,
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
                        l.push(dic);
                    }
                    console.log(l);
                    var repeat = layer.open({
                        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                        type: 1,
                        title: "重复执行",
                        area: ['30%', '40%'],
                        skin: "layui-layer-rim",
                        shade: 0.6,
                        content: $("#repeat_run").html(),
                        success: function (layero, index) {
                            layui.use('form', function () {
                                var form = layui.form;
                                form.val("repeat");
                                form.on('submit(repeat)', function (data) {
                                    if (data.field.concurrency != "") {
                                        var datas = {
                                            "request": JSON.stringify(l),
                                            "runtime": data.field.runtime,
                                            "concurrency": data.field.concurrency
                                        }
                                    } else {
                                        var datas = {
                                            "request": JSON.stringify(l),
                                            "runtime": data.field.runtime,
                                        }
                                    }
                                    $.ajax({
                                        cache: false,
                                        url: "/api/v1/singleapi/repeatrun/",
                                        dataType: 'json',
                                        type: 'POST',
                                        data: datas,
                                        //请求前的处理,加载loading
                                        beforeSend: function () {
                                            layer.close(repeat);
                                            l_index = layer.msg('执行接口中，小伙伴请稍候~~', {
                                                icon: 16,
                                                time: false,
                                                shade: 0.5
                                            });
                                            var process = layer.open({
                                                //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                                                type: 1,
                                                title: false,
                                                area: ['50%', ''],
                                                skin: "layui-layer-rim",
                                                offset: "b",
                                                content: $("#jindutiao").html(),
                                                success: function () {
                                                    layui.use('element', function () {
                                                        var $ = layui.jquery
                                                            , element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
                                                        console.log("come in ");
                                                        var sitv = setInterval(function () {
                                                            $.ajax({
                                                                cache: false,
                                                                url: "/api/v1/singleapi/repeatrun/",
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
                                                                    layer.msg("进度条读取失败", {
                                                                        offset: 't',
                                                                        icon: 5
                                                                    });
                                                                }
                                                            });
                                                        }, 250);// 每10毫秒查询一次后台进度
                                                    });
                                                }
                                            });

                                        },
                                        success: function (data) {
                                            if (data.status_code == 500 || data.status_code == 401) {
                                                layer.msg(data.msg, {icon: 5, offset: "t"});
                                            } else {
                                                var strjson = JSON.stringify(data, null, 4);
                                                console.log(strjson);
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
                                                    area: ['800px', '600px'], //自定义文本域宽高
                                                    btn: ["json.cn", "关闭"],
                                                    yes: function () {
                                                        layer.open({
                                                            type: 2,
                                                            title: "json.cn",
                                                            //shadeClose: true,
                                                            shade: false,
                                                            zIndex: layer.zIndex,
                                                            maxmin: true, //开启最大化最小化按钮
                                                            area: ['50%', '50%'],
                                                            content: 'https://www.json.cn',
                                                            success: function () {
                                                                layer.setTop(layero);
                                                            }
                                                        });
                                                    },
                                                    btn2: function (index, layro) {//这里就是你要的
                                                        layer.close(index);
                                                        //layer.closeAll();
                                                        $(".layui-laypage-btn").click();
                                                    }
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
                                            layer.close(l_index);

                                        }
                                    });
                                    return false;//阻止表单跳转
                                });
                            });
                        }
                    });
                }
                break;
            //性能测试
            case 'locust':
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
                        dic["caseid"] = i;
                        dic['identity'] = data[i]['identity'];
                        dic["url"] = data[i]['url'];
                        dic['method'] = data[i]['method'];
                        dic['params'] = data[i]['params'];
                        dic['body'] = data[i]['body'];
                        l.push(dic);
                    }
                    console.log(l);
                    $.ajax({
                        cache: false,
                        url: "/api/v1/singleapi/locust/1/",
                        dataType: 'json',
                        type: 'PUT',
                        data: {
                            "request": JSON.stringify(l)
                        },
                        //请求前的处理,加载loading
                        beforeSend: function () {
                            var locust_test = layer.open({
                                type: 1
                                , title: ["locust接口性能测试"]
                                , skin: "layui-layer-lan"
                                , shade: 0.6
                                , shadeClose: true
                                , moveOut: true
                                , area: ["30%", '33%'] //自定义文本域宽高
                                , content: $("#locust").html(),
                                success: function () {
                                    layui.use('form', function () {
                                        var form = layui.form;
                                        //关闭locust，
                                        form.on('submit(locust)', function (data) {
                                            $.ajax({
                                                cache: false,
                                                url: "/api/v1/singleapi/close_locust/",
                                                type: 'GET',
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
                                                    layer.close(locust_test);
                                                }

                                            });
                                            return false;//阻止表单跳转
                                        });
                                    })
                                }

                            });
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
                        }
                    });
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
                        url: "/api/v1/singleapi/export_report/",
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
        //响应结果详情
        if (obj.event === 'detail') {
            console.log(data.result);
            layer.prompt({
                formType: 2,//多行文本
                value: data.result,
                shade: false,
                title: data.casename + "响应结果",
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
                        content: "/detail/?singleid=" + data.caseid,
                    });
                    layer.full(index);
                },
                btn2: function (index) {
                    layer.close(index);
                }
            });
        }
        //删除用例
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
                    url: "/api/v1/singleapi/del_case/" + id + "/",
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
        //编辑Query请求参数
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
                    url: "/api/v1/singleapi/update_case/" + obj.data['caseid'] + '/',
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
                        // {#$(".layui-laypage-btn").click();#}
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
        //编辑body请求数据
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
                    url: "/api/v1/singleapi/update_case/" + obj.data['caseid'] + '/',
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
                        // {#$(".layui-laypage-btn").click();#}
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
        //编辑整个用例
        else if (obj.event === 'update_case') {
            //获取系统模块参数
            get_belong_by_system();
            //获取系统角色
            get_role_by_system("option","identity");
            var a = layer.open({
                type: 1,
                title: "编辑用例",
                area: ['35%', ""],
                skin: "layui-layer-molv",
                shada: 0.6,
                content: $("#add_update_case").html(),
                success: function () {
                    layui.use(['form', 'jquery'], function () {
                        var form = layui.form;
                        $ = layui.$;
                        var caseid = data.caseid;
                        form.val("add_update_case", {
                            "casename": data.casename,
                            "identity": data.identity,
                            "url": data.url,
                            "method": data.method,
                            "belong": data.belong,
                            "params": data.params,
                            "body": data.body,
                            "head": data.head
                        });
                        //监听编辑用户信息，
                        form.on('submit(add_update_case)', function (data) {
                            console.log(data.field);
                            $.ajax({
                                cache: false,
                                url: "/api/v1/singleapi/update_case/" + String(caseid) + "/",
                                type: 'PUT',
                                data: {
                                    "belong": data.field.belong,
                                    "body": data.field.body,
                                    //"caseID": data.field.caseID,
                                    "casename": data.field.casename,
                                    "identity": data.field.identity,
                                    "method": data.field.method,
                                    "params": data.field.params,
                                    "system": '{{ system }}',
                                    "url": data.field.url,
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
        //编辑责任者
        else if (obj.event === 'head') {
            var update_apicase = layer.open({
                type: 1
                , value: data.head
                , title: ["编辑负责人"]
                , skin: "layui-layer-lan"
                , shade: 0.6
                , shadeClose: true
                , moveOut: true
                , area: ["30%", '40%'] //自定义文本域宽高
                , content: $("#head").html(),
                success: function () {
                    layui.use('form', function () {
                        var form = layui.form;
                        form.val("head", {
                            //我是对了对抗重置按钮来的
                        });
                        //监听编辑用户信息，
                        form.on('submit(update_apicase)', function (data) {
                            $.ajax({
                                cache: false,
                                url: "/api/v1/singleapi/update_case/" + obj.data['caseid'] + '/',
                                type: 'GET',
                                data: {
                                    "head": data.field.head
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
                                    layer.close(update_apicase);
                                }

                            });
                            return false;//阻止表单跳转
                        });
                    })
                }

            });

        }
    });
});


//获取模块参数
function get_belong_by_system() {
    //var res = {};
    $.ajax({
        //cache: false,
        url: "/api/v1/menu/get_belong_by_system/",
        type: 'GET',
        async: false,
        data: {
            "system": '{{ system }}'
        },
        success: function (data) {
            //res = data;
            var str = '';
            //data是数组时，index是当前元素的位置，value是值
            $.each(data,function(index,value){
                str += "<option value='"+value+"'>"+value+"</option>";
            });
            console.log(str);
            $('#belong').empty();
            $('#belong').append(str);

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
function get_role_by_system(attrtype,id) {
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
            $.each(data,function(index,value){
                console.log(index);
                console.log(value);
                if(attrtype=="option"){
                    console.log("我渲染的"+id);
                    str += "<option value='"+value+"'>"+value+"</option>";
                    $('#'+id).empty();
                    $('#'+id).append(str);
                }else if(attrtype=="input"){
                    console.log("我渲染的"+id);
                    str += "<input type=\"radio\" name=\"identity\" value='"+value+"' title='"+value+"'>";
                    $('#'+id).empty();
                    $('#'+id).append(str);
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

//新建用例
function add_case() {
    get_role_by_system("option","identity");
    get_belong_by_system();
    var Create_apicase = layer.open({
        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        type: 1,
        title: "新建用例",
        skin: "layui-layer-molv",
        shade: 0.6,
        area: ['35%', ''],
        content: $("#add_update_case").html(),
        success: function () {
            layui.use(['form', 'jquery'], function () {
                var form = layui.form,
                    $ = layui.$;
                //监听编辑用户信息，
                form.val("add_update_case");
                form.on('submit(add_update_case)', function (data) {
                    $.ajax({
                        cache: false,
                        url: "/api/v1/singleapi/add_case/",
                        type: 'POST',
                        data: {
                            "belong": data.field.belong,
                            "body": data.field.body,
                            "casename": data.field.casename,
                            "identity": data.field.identity,
                            "method": data.field.method,
                            "params": data.field.params,
                            "system": '{{ system }}',
                            "url": data.field.url,
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
                    "role":"【】",
                    "password": "Y+zilsR88g9SZI8WOeHJlA=="
                });
                //监听编辑用户信息，
                // {#form.on('radio', function (data) {#}
                // {#    console.log(data.elem); //得到radio原始DOM对象#}
                // {#    console.log(data.value); //被点击的radio的value#}
                // {#    if (data.value == "erms") {#}
                // {#        $(".erms").show();#}
                // {#        $(".tdr").hide();#}
                // {#    } else if (data.value == "tdr") {#}
                // {#        $(".tdr").show();#}
                // {#        $(".erms").hide();#}
                // {#    }#}
                //});
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
                            "ip":data.field.url,
                            "token":data.field.token
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
function get_user_info(){
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
                    , page:true
                    , initSort: {
                        field: "system",
                        type: "desc"
                    },
                    where:{
                        "system":"{{ system }}"
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
                    //编辑整个用例
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
                                        "role":data.role,
                                        "system":data.system,
                                        "url":data.ip,
                                        "token":data.token,
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
                                                "role":data.field.role,
                                                "system":data.field.system,
                                                "ip":data.field.url,
                                                "token":data.field.token,
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
                        case 'add_role':
                            add_role();
                            break;
                        case "get_token":
                            var res = checkStatus.data;
                            console.log(res);
                            $.ajax({
                                cache: false,
                                url: "/api/v1/systemrole/get_token_by_id/" + res[0]["id"] + "/",
                                type: 'PUT',
                                success: function (data) {
                                    layer.closeAll();
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
