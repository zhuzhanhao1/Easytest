//打开页面执行
$(document).ready(function(){
    //获取分类,默认获取第一个分类
    var res = get_classification("classification");
    //给选择的分类增加样式
    $('ul').children("li").eq(0).css("background-color","#5FB878");
    $('ul').children("li").eq(0).css("color","#ffffff");
    //渲染模块数据表格
    get_table(res);

});
//渲染模块表格
function get_table_by_title() {
    //获取li标签对应的文本内容
    $("li").unbind('click').click(function(){
        var title = $(this).children("span").text();
        //改变list样式
        $("li").css("background-color","");
        $("li").css("color","#212529");
        $(this).css("background-color","#5FB878");
        $(this).css("color","#ffffff");
        //获取表格
        get_table(title)
    })
}
//获取表格
function get_table(value){
    layui.use(["table"], function () {
        var table = layui.table,
            layer = layui.layer;
        table.render({
            elem: '#treetable',
            url: '/api/v1/interface_manager/puisne_module_list/',
            toolbar: '#toolbarDemo',
            page: {groups: 5}, //开启分页
            // cellMinWidth : 95,
            height: "full-104",
            limit: 10,
            limits: [10, 15, 20, 25],
            id: "linkListTab",
            size: 'lg',
            //skin: 'line', //行边框风格 /row列表框风格 /nob无边框风格
            where: {
                "title": value
            },
            cols: [[
                {type: 'checkbox'},
                {title: '操作', toolbar: '#barDemo', width: 100, align: "left"},
                {field: 'puisne_module', title: '模块标题', templet: function (d) {
                        return '<a class="layui-blue" href="/interface_set?parentId=' + d.id +'">' + d.puisne_module + '</a>';
                    }},
                {field: 'description', title: '描述'},
                {field: 'create_data', title: '创建时间'},
            ]]
        });
        //打开数据表格
        table.on('tool(treetable)', function (obj) {
            //编辑整个用例
            if (obj.event === 'update_module') {
                var data = obj.data;
                console.log(data);
                let update_module_id = data.id;
                var update_childmenu = layer.open({
                    //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                    type: 1,
                    title: "编辑字菜单",
                    area: ['40%', ''],
                    shade: 0.6,
                    skin: "layui-layer-rim",
                    content: $("#add_update_module").html(),
                    success: function () {
                        layui.use(['form', 'jquery'], function () {
                            var form = layui.form,
                                $ = layui.$;
                            form.val("add_update_module", {
                                "puisne_module": data.puisne_module,
                                "description": data.description,
                            });
                            form.on('submit(add_update_module)', function (data) {
                                $.ajax({
                                    url: "/api/v1/interface_manager/update_puisne_module/" + update_module_id + "/",
                                    type: 'PUT',
                                    data: {
                                        "puisne_module": data.field.puisne_module,
                                        "description": data.field.description
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
                                        layer.close(update_childmenu)

                                    }
                                });
                                return false;//阻止表单跳转
                            });


                        });
                    }
                });

            }
            else if (obj.event === 'del_module') {
                layer.confirm('真的删除行么', {icon: 2, title: "删除提示"}, function (index) {
                    console.log(obj.data);
                    //layer.msg("确定删除",{icon:1});
                    obj.del();//删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    var id = obj.data["id"];
                    console.log(id);
                    $.ajax({
                        url: "/api/v1/interface_manager/del_puisne_module/" + id + "/",
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
        table.on('toolbar(treetable)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'add_module':
                    var res = checkStatus.data;
                    console.log(res.length);
                    console.log(title);
                    var add_childmenu = layer.open({
                        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                        type: 1,
                        title: "添加模块",
                        area: ['40%', ''],
                        shade: 0.6,
                        skin: "layui-layer-rim",
                        content: $("#add_update_module").html(),
                        success: function () {
                            layui.use(['form', 'jquery'], function () {
                                var form = layui.form,
                                    $ = layui.$;
                                form.val("add_update_module");
                                form.on('submit(add_update_module)', function (data) {
                                    $.ajax({
                                        url: "/api/v1/interface_manager/add_puisne_module/",
                                        type: 'POST',
                                        data: {
                                            "parent": title,
                                            "puisne_module": data.field.puisne_module,
                                            "description": data.field.description,
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
                                            layer.close(add_childmenu)

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
}
//获取分类
function get_classification(id) {
    var res = "";
    $.ajax({
        url: "/api/v1/interface_manager/get_classification/",
        type: 'GET',
        async: false,
        success: function (data) {
            var str = '';
            //data是数组时，index是当前元素的位置，value是值
            $.each(data, function (index, value) {
                str +=  '<li class="list-group-item d-flex justify-content-between align-items-center">'+
                    '<span type="button" onclick="get_table_by_title()">'+value+'</span>'+
                    '<a type="button" onclick="del_classification()" class="fa fa-trash-o my_del_btn"></a>'+
                    '</li>';
                if(index === 0){
                    res = value;
                }
            });
            console.log(str);
            $('#'+id).empty();
            $('#'+id).append(str);

        },
        error: function () {
            layer.msg("回调失败", {
                icon: 5,
                offset: 't'
            });
        },
    });
    //console.log(res);
    return res
}
//删除分类
function del_classification() {
    $("a").click(function() {
        console.log($(this));
        title = $(this).siblings("span").text();
        console.log("标题:" + title);
        layer.confirm('你确定要删除'+title+'？', {
                btn: ['取消','确定'] //按钮
            },
            function(){
                layer.msg('辛亏没删除，删除就彻底找不回咯！', {icon: 1});
            },
            function(){
                $.ajax({
                    url: "/api/v1/interface_manager/del_classification/",
                    type: 'DELETE',
                    async: false,
                    data: {
                        title: title
                    },
                    success: function (data) {
                        get_classification("classification");
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
            });
        //阻止事件冒泡
        return false;
    });
}
//添加分类
function add_classification() {
    var add_classification = layer.open({
        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        type: 1,
        title: "添加系统分类",
        skin: "layui-layer-molv",
        shade: 0.6,
        area: ['35%', ''],
        content: $("#add_classification").html(),
        success: function () {
            layui.use(['form', 'jquery'], function () {
                var form = layui.form,
                    $ = layui.$;
                //监听编辑用户信息，
                form.val("add_classification");
                form.on('submit(add_classification)', function (data) {
                    $.ajax({
                        cache: false,
                        url: "/api/v1/interface_manager/add_classification/",
                        type: 'POST',
                        data: {
                            "classification": data.field.classification
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
                            get_classification("classification");
                        },
                        error: function () {
                            layer.msg("回调失败", {
                                icon: 5,
                                offset: 't'
                            });
                        },
                        complete: function () {
                            layer.close(add_classification);
                        }

                    });
                    return false;//阻止表单跳转
                });
            });
        }
    });
}

