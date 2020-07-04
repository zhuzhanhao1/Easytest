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
        , url: '/api/v1/menu_manage/main_list/' //数据接口"exports"
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
            , {
                field: '', title: '下级菜单', width: 120, align: "left"
                , collapse: true
                , icon: ['layui-icon layui-icon-star', 'layui-icon layui-icon-star-fill']
                , childTitle: false
                , children: [
                    {
                        elem: '#templateTable'
                        , url: "/api/v1/menu_manage/children_list/"
                        , where: function (row) {
                            console.log(row);
                            return {id: row.id}
                        }
                        , skin: 'line'
                        , size: "lg"
                        , toolbar:
                            '<div>' +
                            ' <a class="layui-btn layui-btn-normal layui-btn-sm" lay-event="add_children_menu">添加子菜单</a>' +
                            '</div>'
                        //, height: 'full-10'
                        , cols: [[
                            {
                                title: '操作', width: 120, templet: function (row) {
                                    return'<a class="layui-icon layui-icon-tips" lay-event="update_children_menu"\n' +
                                        'style="color: #797979;font-size: 20px;padding:0 2px;vertical-align:middle;font-weight: lighter;"></a>\n'+
                                        '<a class="fa fa-trash-o" lay-event="del_children_menu"\n' +
                                        'style="color: #797979;font-size: 20px;padding:0 2px;vertical-align:middle;font-weight: lighter;"></a>'
                                }
                            },
                              {field: 'title', title: '一级菜单', align: "left", excel: {color: '0040ff', bgColor: 'f3fef3'}}
                            , {field: 'icon', title: '菜单图标', align: "left", excel: {color: '0040ff', bgColor: 'f3fef3'},templet:function (res) {
                                return "<span>" +res.icon + "</span>"
                                }}
                            , {field: 'href', title: '连接地址'}
                            , {field: 'spread', title: '是否展开',  align: "left"}
                        ]]
                        , rowEvent: function (obj, pobj) {
                            // 单击行事件
                            // obj 子表当前行对象
                            // pobj 父表当前行对象
                            obj.tr.css({'background': '#ECEFFC'}).siblings().removeAttr('style');
                            // console.log(obj.tr) //得到当前行元素对象
                            // console.log(obj.data) //得到当前行数据
                            // console.log(pobj) //得到当前行数据
                        }
                        , toolEvent: function (obj, pobj) {
                            // obj 子表当前行对象
                            // pobj 父表当前行对象
                            var childId = this.id; // 通过 this 对象获取当前子表的id
                            console.log(childId);
                            if (obj.event === 'del_children_menu') {
                                layer.confirm('真的要删除此行么', {icon: 2, title: "删除提示"}, function (index) {
                                    var id = obj.data.id;
                                    console.log(id);
                                    $.ajax({
                                        url: "/api/v1/menu_manage/del_children_menu/" + id + "/",
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
                            else if (obj.event === 'update_children_menu') {
                                let id = obj.data.id;
                                var a = layer.open({
                                    type: 1,
                                    title: "编辑子菜单",
                                    area: ['35%',""],
                                    skin: "layui-layer-molv",
                                    shada: 0.6,
                                    content: $("#add_update_case").html(),
                                    success: function () {
                                        layui.use(['form', "jquery"], function (data) {
                                            var form = layui.form,
                                                $ = layui.$;
                                            console.log(data);
                                            form.val("add_update_case", {
                                                "title": data.title,
                                                "icon": data.icon,
                                                "href": data.href,
                                                "spread": data.spread,
                                            });
                                            form.on('submit(add_update_case)', function (data) {
                                                $.ajax({
                                                    url: "/api/v1/menu_manage/update_children_menu/" + id + "/",
                                                    type: 'PUT',
                                                    data: {
                                                        "title": data.field.title,
                                                        "icon": data.field.icon,
                                                        "href": data.field.href,
                                                        "spread": data.field.spread,
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
                                                        table.reload(childId);
                                                    }

                                                });
                                                return false;//阻止表单跳转
                                            });
                                        });
                                    }
                                });

                            }
                        }
                        , toolbarEvent: function (obj, pobj) {
                            var childId = this.id;
                            // obj 子表当前行对象
                            // pobj 父表当前行对象
                            console.log(pobj.data);
                            if (obj.event === "add_children_menu") {
                                var parent_id = pobj.data.id;
                                var Create_apicase = layer.open({
                                    //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                                    type: 1,
                                    title: "添加子菜单",
                                    skin: "layui-layer-molv",
                                    shade: 0.6,
                                    area: ['30%', ''],
                                    content: $("#add_update_case").html(),
                                    success: function () {
                                        layui.use(['form', 'jquery'], function () {
                                            var form = layui.form,
                                                $ = layui.$;
                                            //监听编辑用户信息，
                                            form.val("add_update_case", {});
                                            form.on('submit(add_update_case)', function (data) {
                                                $.ajax({
                                                    url: "/api/v1/menu_manage/add_children_menu/",
                                                    type: 'POST',
                                                    data: {
                                                        "classification":parent_id,
                                                        "title": data.field.title,
                                                        "icon": data.field.icon,
                                                        "href": data.field.href,
                                                        "spread": data.field.spread,
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
                        , done: function (data) {
                            //console.log(data);
                            soulTable.render(this);
                        }

                    }
                ]
            }
            , {field: 'title', title: '一级菜单', align: "left", excel: {color: '0040ff', bgColor: 'f3fef3'}, edit: "text"}
            , {field: 'icon', title: '菜单图标', align: "left", excel: {color: '0040ff', bgColor: 'f3fef3'}, edit: "text"}
            , {field: 'href', title: '连接地址',  align: "left"}
            , {field: 'spread', title: '是否展开',  align: "left", edit: "text"}
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
                , where: {title: demoReload.val()}
            }, 'data');
        }
    };

    $('.demoTable .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    //监听行工具事件
    table.on('tool(test)', function (obj) {
        var data = obj.data;
        var id = data['id'];
        console.log(obj);
        //删除接口用例
        if (obj.event === 'del_main_menu') {
            layer.confirm('你确定要删除吗' + '？', {
                    btn: ['取消', '确定'] //按钮
                },
                function () {
                    layer.msg('幸亏没删除，删除就彻底找不回咯！', {icon: 0,offset:"t"});
                },
                function () {
                    $.ajax({
                        url: "/api/v1/menu_manage/del_main_menu/" + id + "/",
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
        else if (obj.event === 'update_main_menu') {
            console.log(data);
            var a = layer.open({
                type: 1,
                title: "编辑主菜单",
                area: ['35%',""],
                skin: "layui-layer-molv",
                shada: 0.6,
                content: $("#add_update_case").html(),
                success: function () {
                    layui.use(['form', "jquery"], function () {
                        var form = layui.form,
                            $ = layui.$;
                        let id = data.id;
                        form.val("add_update_case", {
                            "title": data.title,
                            "icon": data.icon,
                            "href": data.href,
                            "spread": data.spread,
                        });

                        form.on('submit(add_update_case)', function (data) {
                            $.ajax({
                                url: "/api/v1/menu_manage/update_main_menu/" + id + "/",
                                type: 'PUT',
                                data: {
                                    "title": data.field.title,
                                    "icon": data.field.icon,
                                    "href": data.field.href,
                                    "spread": data.field.spread,
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
});



function add_main_menu() {
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
            layui.use(['form', "jquery"], function () {
                var form = layui.form,
                    $ = layui.$;
                form.val("add_update_case", {});
                form.on('submit(add_update_case)', function (data) {
                    console.log(data.field);
                    $.ajax({
                        url: "/api/v1/menu_manage/add_main_menu/",
                        type: 'POST',
                        data: {
                            "title": data.field.title,
                            "icon": data.field.icon,
                            "href": data.field.href,
                            "spread": data.field.spread,
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
