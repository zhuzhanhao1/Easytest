from easy.config.Status import *
from easy.common.jsonPath import GetValueByJsonpath
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

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
