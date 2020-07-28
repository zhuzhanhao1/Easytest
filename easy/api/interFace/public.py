from easy.config.Status import *
from easy.common.jsonPath import GetValueByJsonpath
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
from pyecharts.globals import CurrentConfig

#设置src="../static/js/echarts.min.js"加载在本地路径
CurrentConfig.ONLINE_HOST  = "../static/js/"
from pyecharts import options as opts
from pyecharts.charts import Bar


class JsonPathGetValue(APIView):
    '''
        通过JSONPATH取值
    '''
    def post(self ,request, *args, **kwargs):
        data = request.data
        key = data.get('key',"")
        value = data.get('value', "")
        try:
            res = GetValueByJsonpath(value,key)
        except Exception as e:
            error_code["error"] = "参数异常"
            return Response(error_code, status=status.HTTP_400_BAD_REQUEST)
        if res:
            right_code["msg"] = "JSONPATH提取成功"
            right_code["data"] = res
            return Response(right_code)
        else:
            error_code["error"] = "JSONPATH提取失败"
            error_code["data"] = res
            return Response(error_code)


class ExportReport(APIView):
    '''
        echar图表
    '''
    def post(self, request, *args, **kwargs):
        '''
        导出Echart报表
        '''
        ret = {"code": 1000}
        datas = request.data
        content = json.loads(datas.get("request", ""))
        url_list = []
        duration_list = []
        for i in content:
            url_list.append(i["url"].split("/")[-1])
            duration_list.append(i["duration"])
        print(url_list)
        duration_list = [0 if i==None else i for i in duration_list]
        print(duration_list)
        try:
            # 纵向柱状图
            c = (
                Bar()
                    .add_xaxis(url_list)
                    .add_yaxis("Duration", duration_list)
                    .set_global_opts(
                    xaxis_opts=opts.AxisOpts(axislabel_opts=opts.LabelOpts(rotate=-15)),
                    title_opts=opts.TitleOpts(title="接口响应时长分布图", subtitle="单位：毫秒（ms）"),
                    toolbox_opts=opts.ToolboxOpts(),
                    legend_opts=opts.LegendOpts(is_show=False),
                    datazoom_opts=opts.DataZoomOpts(),

                )
                .render("./easy/templates/pyEchartReport.html")
            )
            ret["msg"] = "生成报表成功"
        except Exception as e:
            print(e)
            ret["code"] = 1001
            ret["error"] = "生成报表异常"
        return Response(ret)


