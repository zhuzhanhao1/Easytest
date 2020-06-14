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
        , url: '/api/v1/interface_set/search/' //数据接口"exports"
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter',  {title: '导入数据', layEvent: 'import_case', icon: 'layui-icon-upload-circle'}, 'print']
        , title: '接口流程测试'
        , page: {groups: 5} //开启分页
        , loading: false
        , height: 'full-120'
        , drag: {toolbar: true}//实现固定列与非固定列之间的转换
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
        , cols: [[
            {type: 'checkbox'},
            {title: '操作', toolbar: '#barDemo', width: 100, align: "left"}
            , {field: 'interface_name', title: '接口名称', align: "left"}
            , {field: 'url', title: '访问路径', align: "left"}
            , {field: 'method', title: '请求方式', align: "left"}
            , {field: 'belong_module', title: '所属模块', align: "left"}
            , {field: 'classification', title: '所属系统分类', align: "left"}
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
            var interfaceName = $('#interfaceName');
            var url = $('#url');
            var belongModule = $('#belongModule');
            var systemClassification = $('#systemClassification');
            console.log(interfaceName.val());
            //执行重载
            table.reload('testReload', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                , where: {
                    interfaceName: interfaceName.val(),
                    url: url.val(),
                    belongModule: belongModule.val(),
                    systemClassification: systemClassification.val(),
                }
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
            //添加接口
            case "add_interface":
                var data = checkStatus.data;
                if (checkStatus.data.length > 0) {
                    var l = [];
                    for (i = 0; i < data.length; i++) {
                        l.push(data[i]["id"]);
                    }
                    console.log(l);
                    $.ajax({
                        url: "/api/v1/relevance_interface/add_interface/",
                        type: 'POST',
                        data: {
                            "relevance_ids": JSON.stringify(l),
                            "parent":parentId,
                        },
                        //请求前的处理,加载loading
                        success: function (data) {
                            console.log(data);
                            if (data.code === 1000) {
                                layer.msg(data.msg, {
                                    icon: 6, offset: "t"
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
                        }
                    });
                } else {
                    layer.msg('需先勾选数据才能添加！', {icon: 0, offset: 't'});
                }
                break;
        }

    });
});

