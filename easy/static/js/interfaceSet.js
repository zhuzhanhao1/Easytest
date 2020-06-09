//增加headers行列
$(function () {
    $("#addheaders").click(function () {
        $("#headers").append("<li style=\"margin-bottom:1px;\">" +
            "<input class=\"myinput\" type=\"text\" name=\"headers_key\" style=\"margin-right:4px;line-height: 1.3;border-width:1px;border-style:solid;border-radius:2px;border-color:#e6e6e6;\"  placeholder=\"Key\"  />" +
            "<input class=\"myinput\"  type=\"text\" name=\"headers_value\"  style=\"line-height: 1.3;border-width:1px;border-style:solid;border-radius:2px;border-color:#e6e6e6;\"  placeholder=\"Value\" />" +
            "<input id=\"delheaders\" type=\"button\" class=\"layui-btn layui-btn-danger mybtn delheader\" style=\"width: 36px;font-size: 20px;margin-left: 5px;\" value=\"-\">" +
            "</li>");
    });
    $("#delheaders").click(function () {
        console.log("我是下级删除按钮");
        if ($("#headers li").length > 1) {
            $("#headers li:last").remove();
        }
    });
    $("#headers").on('click', '.delheader', function () {
        this.remove()
    })
    $("#headers").on('click', 'li', function () {
        if (this.children.length < 3) {
            this.remove()
        }
    })

});
//增加formdata行列
$(function () {
    $("#addformdata").click(function () {
        $("#formdatas").append("<li style=\"margin-bottom:1px;\">" +
            "<input class=\"myinput\" type=\"text\" name=\"formdatas_key\" style=\"margin-right:4px;line-height: 1.3;border-width:1px;border-style:solid;border-radius:2px;border-color:#e6e6e6;\" placeholder=\"Key\"  />" +
            "<input  class=\"myinput\" type=\"text\" style=\"line-height: 1.3;border-width:1px;border-style:solid;border-radius:2px;border-color:#e6e6e6;\" name=\"formdatas_value\" placeholder=\"Value\" />" +
            "<input id=\"delheaders\" type=\"button\" class=\"layui-btn layui-btn-danger mybtn delheader\" style=\"width: 36px;font-size: 20px;margin-left: 5px;\" value=\"-\">" +
            "</li>");
    });
    $("#delformdata").click(function () {
        if ($("#formdatas li").length > 1) {
            $("#formdatas li:last").remove();
        }
    })
    $("#formdatas").on('click', '.delheader', function () {
        this.remove()
    })
    $("#formdatas").on('click', 'li', function () {
        if (this.children.length < 3) {
            this.remove()
        }
    })
});
//提交快速测试的数据
$("#addsubmitBtn").click(function () {
    var objone = {};
    var a = document.querySelectorAll("input[name='headers_key']");
    var b = document.querySelectorAll("input[name='headers_value']");
    for (var i = 0; i < a.length; i++) {
        var keyone = a[i].value;
        var valueone = b[i].value;
        objone[keyone] = valueone;
    }
    objonestring = JSON.stringify(objone);
    $("#addmergeheaders").val(objonestring);
    console.info(objonestring);

    var objthree = {};
    var e = document.querySelectorAll("input[name='formdatas_key']");
    var f = document.querySelectorAll("input[name='formdatas_value']");
    for (var k = 0; k < e.length; k++) {
        var keythree = e[k].value;
        var valuethree = f[k].value;
        objthree[keythree] = valuethree;
    }
    objthreestring = JSON.stringify(objthree);
    $("#addmergeformdatas").val(objthreestring);
});
//打开json.cn
$("#jsoncn").click(function () {
    var copyRes = $("#responses").select();
    document.execCommand("Copy");
    layer.msg("复制成功，打开json.cn", {icon: 6, offset: 't'});
    layer.open({
        type: 2,
        title: "json.cn",
        skin: 'layui-layer-rim',
        maxmin: true,
        moveOut: true,
        area: ['90%', '90%'],
        content: "https://www.json.cn",
        success: function () {
            console.log("aaaaaaaa");
        }
    })
})


layui.use(['element', 'layer'], function () {
    var element = layui.element;
    var layer = layui.layer;

    //监听折叠
    element.on('collapse(test)', function (data) {
        console.log(data.show);
        //layer.msg('查看结果：' + data.show);
    });
});
