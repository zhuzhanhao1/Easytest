layui.config({
    base: './../static/layui2.5.5/lay/modules/',   // 模块目录
    version: 'v1.3.28'
}).extend({             // 模块别名
    soulTable: 'soulTable'
});

//获取用例集下用例表格
function get_table_by_title() {
    layui.use(["table", "soulTable"], function () {
        var table = layui.table,
            layer = layui.layer;
        soulTable = layui.soulTable;
        //获取li标签对应的文本内容
        $("li").unbind('click').click(function(){
            var title = jQuery(this).children("span").text();
            //改变list样式
            jQuery("li").css("background-color","");
            jQuery("li").css("color","#212529");
            jQuery(this).css("background-color","#5FB878");
            jQuery(this).css("color","#ffffff");
            //打开数据表格
            var index = layer.load(0); //添加laoding,0-2两种方式
            var tableIns = table.render({
                elem: '#treetable',
                url: '/api/v1/relevance_case_set/list/',
                toolbar: '#toolbarDemo',
                page: {groups: 5}, //开启分页
                // cellMinWidth : 95,
                height: "full-104",
                limit: 10,
                loading: false,
                limits: [10, 15, 20, 25],
                size: 'lg',
                contextmenu: {
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
        },
                where: {
                    "title": title
                },
                cols: [[
                    {title: '操作', toolbar: '#barDemo', width: 80, align: "left"}
                    , {field: 'interface_case_name', title: '接口用例名称', align: "left"}
                    , {field: 'description', title: '描述', align: "left"}
                ]]
                ,id: 'testReload'
                , rowEvent: function (obj) {
                    obj.tr.css({'background': '#ECEFFC'}).siblings().removeAttr('style')
                }
                , done: function (res) {   //返回数据执行回调函数
                    layer.close(index);    //返回数据关闭loading
                    soulTable.render(this);
                }
            });
             //搜索
            var $ = layui.$, active = {
                reload: function(){
                  var demoReload = $('#demoReload');

                  //执行重载
                  table.reload('testReload', {
                    page: {
                      curr: 1 //重新从第 1 页开始
                    }
                    ,where: {
                      key: {
                        interface_case_name: demoReload.val()
                      }
                    }
                  }, 'data');
                }
              };

              $('.demoTable .layui-btn').on('click', function(){
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
              });
            table.on('tool(treetable)', function (obj) {
                //编辑整个用例
                if (obj.event === 'del_module') {
                    layer.confirm('真的删除行么', {icon: 2, title: "删除提示"}, function (index) {
                        console.log(obj.data);
                        //layer.msg("确定删除",{icon:1});
                        obj.del();//删除对应行（tr）的DOM结构，并更新缓存
                        layer.close(index);
                        //向服务端发送删除指令
                        var id = obj.data["id"];
                        console.log(id);
                        $.ajax({
                            url: "/api/v1/relevance_case_set/del_case/" + id + "/",
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
                        var search_interface = layer.open({
                            type: 2,
                            title: "从接口用例库中搜索后添加",
                            area: ['70%', "70%"],
                            skin: 'layui-layer-molv',
                            shade: 0.6,
                            minmax:true,
                            content: '/interface_case_search/?parentId='+title,
                            // end:function(){
                            //   var index = parent.layer.getFrameIndex(window.name);
                            //       parent.layui.table.reload("linkListTab");
                            //       parent.layer.close(index)
                            // },
                            success: function () {
                                layer.msg('打开搜索界面成功！', {icon: 6, offset: 't'});
                            },
                            btn: ['关闭'],
                            yes: function () {
                                layer.close(search_interface);
                                $(".layui-laypage-btn").click();
                            }

                        });
                }
            });
        })

    });
    // });

}

//获取用例集
function get_classification(id) {
    var res = "";
    $.ajax({
        url: "/api/v1/interface_case_set_manage/list/",
        type: 'GET',
        async: false,
        success: function (data) {
            var str = '';
            //data是数组时，index是当前元素的位置，value是值
            $.each(data, function (index, value) {
                console.log(value);
                str +=  '<li class="list-group-item d-flex justify-content-between align-items-center">'+
                    '<span type="button" onclick="get_table_by_title()">'+value.interface_case_set_name+'</span>'+
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
    console.log(res);
    return res
}

//打开页面执行
$(document).ready(function(){
    get_table_by_title();
    get_classification("classification");
    $('ul').children("li").eq(0).css("background-color","#5FB878");
    $('ul').children("li").eq(0).css("color","#ffffff");
});

//删除用例集
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
                    url: "/api/v1/interface_case_set_manage/del_case_set/",
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
        return false;
    });
}
//添加用例集
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
                        url: "/api/v1/interface_case_set_manage/add_case_set/",
                        type: 'POST',
                        data: {
                            "interface_case_set_name": data.field.classification
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

