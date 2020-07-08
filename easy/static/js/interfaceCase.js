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
        , url: '/api/v1/interface_case_manage/list/' //数据接口"exports"
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter',  {title: '导入数据', layEvent: 'import_case', icon: 'layui-icon-upload-circle'}, 'print']
        , title: '接口用例'
        , page: {groups: 5} //开启分页
        , loading: false
        , height: 'full-70'
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
            //, {field: 'id', title: '序号', width: 60, align: "left"}
            , {
                field: 'interface_case_name',
                title: '用例名称',
                align: "left",
                excel: {color: '0040ff', bgColor: 'f3fef3'},
                edit: "text"
            }
            , {field: 'description', title: '描述', align: "left", edit: "text"}
            , {
                field: 'pass_rate', title: '接口通过率', align: "left",
                templet: function (res) {
                    if (res.pass_rate == 100) {
                        let a = String(res.pass_rate) + "%";
                        return '<span style="color: #5FB878;">' + a + '</span>'
                    } else {
                        let b = String(res.pass_rate) + "%";
                        return '<span style="color: red;">' + b + '</span>'
                    }
                }
            }
            , {field: 'create_data', title: '创建时间', align: "left"}
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
                , where: {interface_case_name: demoReload.val()}
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
            //执行接口用例
            case "interface_case_run":
                var data = checkStatus.data;
                var len = data.length;
                console.log(data);
                if (len == 0) {
                    layer.close(index);
                    layer.msg("请先选中需要执行的接口用例", {
                        icon: 2,
                        offset: "t"
                    });
                } else {
                    let l = [];
                    for (i = 0; i < len; i++) {
                        l.push(data[i]["id"]);
                    }
                    console.log(l);

                    //创建socket连接,首先判断是否 支持 WebSocket
                    if('WebSocket' in window) {
                        ws = new WebSocket("ws://127.0.0.1:8000/api/v1/interface_case_manage/run/");
                    }

                    //
                    ws.onopen = function () {
                        // Web Socket 已连接上，使用 send() 方法发送数据
                        if (ws.readyState === WebSocket.OPEN){
                            ws.send(JSON.stringify(l));
                        }
                        // try{
                        //     var sitv = setInterval(function () {
                        //         //readyState报告websocket的连接状态
                        //         if (ws.readyState === WebSocket.OPEN){
                        //             ws.send("查询运行进度");
                        //         }
                        //         else {
                        //             clearInterval(sitv);
                        //         }
                        //     },
                        //     1500);// 每500毫秒查询一次后台进度
                        // }catch (e) {
                        //     console.log(e);
                        //     clearInterval(sitv);
                        // }
                    };
                    //接收数据
                    var process = layer.open({
                        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                        type: 1,
                        title: false,
                        area: ['30%', '20%'],
                        skin: "layui-layer-rim",
                        offset: "rb",
                        //shade:false,
                        content: $("#jindutiao").html(),
                        success: function () {
                            ws.onmessage = function (evt) {
                                let data = JSON.parse(evt.data);
                                let num_progress = data.num_progress;
                                console.log(data);
                                console.log(typeof (data));

                                let interface_execute_now = data.interface_execute_now;
                                let status_code = data.status_code;
                                $('.interface_name').empty();
                                $('.interface_name').append('<span>'+interface_execute_now+"："+status_code+'</span>');

                                // $("#interface_execute_now").html(interface_execute_now);
                                //渲染进度条
                                layui.use('element', function(){
                                  var $ = layui.jquery
                                  ,element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
                                    element.progress('demo', num_progress + '%');
                                    //根据不同阶段，对进度条颜色进行渲染
                                    if (num_progress > 33 && num_progress < 66) {
                                        $(".layui-progress-bar").addClass("layui-bg-orange");
                                    } else if (num_progress >= 66 && num_progress < 100) {
                                        $(".layui-progress-bar").removeClass("layui-bg-orange");
                                        $(".layui-progress-bar").addClass("layui-bg-red");
                                    } else if (num_progress == 100) {
                                        $(".layui-progress-bar").removeClass("layui-bg-red");
                                        layer.close(process);
                                        ws.close()

                                    };
                                })
                            }

                        }
                    });


                    ws.onclose = function () {
                        // 关闭 websocket
                        layer.msg('用例执行完成，websocket连接即将关闭！', {icon: 6, offset: "t"});
                        $(".layui-laypage-btn").click();
                    };

                }
                break
            //批量修改
            case "bacth_update":
                var data = checkStatus.data;
                var id_list = [];
                if (data.length > 0) {
                    for(var i = 0; i < data.length ; i++){
                        id_list.push(data[i]["id"]);
                        layer.msg('只对选中多选框用例进行修改哦！', {icon: 6, offset: "t"});
                    }
                }else{
                    layer.msg('没选择多选框将对所有用例关联的接口做修改操作哦！', {icon: 0, offset: "t"});
                }
                var jsonpath = layer.open({
                    //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                    type: 1,
                    title: "批量修改",
                    skin: "layui-layer-molv",
                    area: ['40%',],
                    content: $("#bacth_update").html(),
                    success: function () {
                        layui.use(['form', "jquery"], function () {
                            var form = layui.form,
                                $ = layui.$;

                            form.val("bacth_update", {
                                "admin_url":"http://app.amberdata.cn/adminapi/user/login",
                                "password":"Y+zilsR88g9SZI8WOeHJlA=="
                            });
                            form.on('select(key)', function(data){
                                console.log(data.value); //得到被选中的值
                                if(data.value == "请求头Headers") {
                                    $(".my_token").css("display","block");
                                    form.render('select');
                                } else{
                                    $(".my_token").css("display","none");
                                    $(".my_value").css("margin-top","-30px")
                                    form.render('select');
                                }
                            });
                            // form.render();
                            form.on('submit(get_token)', function (data) {
                                $.ajax({
                                    url: "/api/v1/interface_case_manage/get_token/",
                                    type: 'GET',
                                    data: {
                                        "admin_url": data.field.admin_url,
                                        "username": data.field.username,
                                        "password": data.field.password,
                                    },
                                    beforeSend: function () {
                                        l_index = layer.load(0, {shade: [0.5, '#DBDBDB']});
                                    },
                                    success: function (data) {
                                        form.val("bacth_update", {
                                            "value":data.data
                                        });
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
                                        try {
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
                                        } catch (e) {
                                            console.log('捕获到异常：', e);
                                            layer.msg('捕获到异常,查看控制台', {icon: 5, offset: "t"})
                                        }

                                    },
                                    complete: function () {
                                        layer.close(l_index);
                                    }

                                });
                                return false;//阻止表单跳转
                            });
                            form.on('submit(bacth_update)', function (data) {
                                $.ajax({
                                    url: "/api/v1/interface_case_manage/bacth_update/",
                                    type: 'POST',
                                    data: {
                                        "key": data.field.key,
                                        "value": data.field.value,
                                        "id_list":JSON.stringify(id_list)
                                    },
                                    beforeSend: function () {
                                        l_index = layer.load(0, {shade: [0.5, '#DBDBDB']});
                                    },
                                    success: function (data) {
                                        if (data.code === 1000) {
                                            layer.close(jsonpath);
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
                                        try {
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
                                        } catch (e) {
                                            console.log('捕获到异常：', e);
                                            layer.msg('捕获到异常,查看控制台', {icon: 5, offset: "t"})
                                        }

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
                break

        }

    });

    //监听行工具事件
    table.on('tool(test)', function (obj) {
        var data = obj.data;
        var id = data['id'];
        console.log(obj);
        //删除接口用例
        if (obj.event === 'del_case') {
            layer.confirm('你确定要删除吗' + '？', {
                    btn: ['取消', '确定'] //按钮
                },
                function () {
                    layer.msg('幸亏没删除，删除就彻底找不回咯！', {icon: 0,offset:"t"});
                },
                function () {
                    $.ajax({
                        url: "/api/v1/interface_case_manage/del_case/" + id + "/",
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
        else if(obj.event === "join"){
            var href = "/relevance_interface?parentId=" + id;
            console.log(href);
            //$(window).attr('location',href);
            $(location).attr('href', href);
        }
    });
    table.on('edit(test)', function (obj) {
        var value = obj.value //得到修改后的值
            , data = obj.data //得到所在行所有键值
            , field = obj.field; //得到字段
        //layer.msg('[ID: '+ data.id +'] ' + field + ' 字段更改为：'+ value);
        if (field == "interface_case_name") {
            $.ajax({
                url: "/api/v1/interface_case_manage/update_case/" + data.id + '/',
                type: 'PUT',
                data: {
                    "interface_case_name": value
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
                url: "/api/v1/interface_case_manage/update_case/" + data.id + '/',
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
function add_case() {
    var add_interface = layer.open({
        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        type: 1,
        title: "新建用例",
        skin: "layui-layer-molv",
        shade: 0.6,
        area: ['35%', '30%'],
        //offset: 't',
        content: $("#add_update_case").html(),
        success: function () {
            layui.use(['form', "jquery"], function () {
                var form = layui.form,
                    $ = layui.$;
                form.val("add_update_case", {});
                form.render('radio', 'preprocessor'); //更新 lay-filter="depend" 所在容器内的全部 radio 状态
                form.on('submit(add_update_case)', function (data) {
                    console.log(data.field);
                    $.ajax({
                        cache: false,
                        url: "/api/v1/interface_case_manage/add_case/",
                        type: 'POST',
                        data: {
                            "interface_case_name": data.field.interface_case_name,
                            "description": data.field.description,
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

