from django.core.paginator import Paginator
from rest_framework import status
from easy.models import MainMenu,ChildMenu
from .menuSer import  MenuAppendSer,MainMenuSer,ChildMenuSer,MainMenuAllSer,UpdatteChildMenuSer
from rest_framework.views import APIView
from rest_framework.response import Response
from easy.config.Status import right_code,error_code



class MenuManageMainList(APIView):

    def get(self, request, *args, **kwargs):
        '''
            主菜单列表
        '''
        title = request.GET.get("title","")
        obj = MainMenu.objects.filter()
        if title:
            obj = MainMenu.objects.filter(title__contains=title)
        serializer = MainMenuAllSer(obj, many=True)
        pageindex = request.GET.get('page', 1)  # 页数
        pagesize = request.GET.get("limit", 10)  # 每页显示数量
        pageInator = Paginator(serializer.data, pagesize)
        # 分页
        contacts = pageInator.page(pageindex)
        res = []
        for contact in contacts:
            res.append(contact)
        return Response(data={"code": 0,"msg": "","count": len(serializer.data),"data": res})

    def put(self, request, pk, *args, **kwargs):
        '''
            编辑主菜单
        '''
        data = request.data
        try:
            obj = MainMenu.objects.filter(id=pk).first()
            serializer = MainMenuSer(obj, data=data)
            if serializer.is_valid():
                serializer.save()
                right_code["msg"] = "编辑主菜单成功"
                return Response(right_code)
            else:
                error_code['error'] = '编辑主菜单失败'
        except Exception as e:
            print(e)
            error_code["error"] = "编辑主菜单失败"
        return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        '''
            删除主菜单
        '''
        try:
            obj = MainMenu.objects.filter(id=pk)
            obj.delete()
            right_code["msg"] = "删除主菜单成功"
            return Response(right_code)
        except Exception as e:
            print(e)
            error_code["error"] = "删除主菜单失败"
            return Response(error_code, status=status.HTTP_400_BAD_REQUEST)


class MenuManageChildrenList(APIView):

    def get(self, request, *args, **kwargs):
        '''
            子菜单列表
        '''
        id = request.GET.get("id","")
        obj = ChildMenu.objects.filter(classification=id)
        serializer = ChildMenuSer(obj, many=True)
        pageindex = request.GET.get('page', 1)  # 页数
        pagesize = request.GET.get("limit", 10)  # 每页显示数量
        pageInator = Paginator(serializer.data, pagesize)
        # 分页
        contacts = pageInator.page(pageindex)
        res = []
        for contact in contacts:
            res.append(contact)
        return Response(data={"code": 0,"msg": "","count": len(serializer.data),"data": res})

    def post(self, request, *args, **kwargs):
        '''
            创建子菜单
        '''
        data = request.data
        print(data)
        try:
            serializer = ChildMenuSer(data=data)
            if serializer.is_valid():
                serializer.save()
                right_code["msg"] = "添加子菜单成功"
                return Response(right_code)
            error_code["error"] = "添加子菜单保存数据库异常"
        except Exception as e:
            error_code["error"] = "添加子菜单失败"
        return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, *args, **kwargs):
        '''
            编辑子菜单
        '''
        data = request.data
        try:
            obj = ChildMenu.objects.filter(id=pk).first()
            serializer = UpdatteChildMenuSer(obj, data=data)
            if serializer.is_valid():
                serializer.save()
                right_code["msg"] = "编辑子菜单成功"
                return Response(right_code)
            else:
                error_code['error'] = '编辑子菜单保存失败'
        except Exception as e:
            print(e)
            error_code["error"] = "编辑子菜单失败"
        return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        '''
            删除子菜单
        '''
        try:
            obj = ChildMenu.objects.filter(id=pk)
            obj.delete()
            right_code["msg"] = "删除子菜单成功"
            return Response(right_code)
        except Exception as e:
            print(e)
            error_code["error"] = "删除子菜单失败"
            return Response(error_code, status=status.HTTP_400_BAD_REQUEST)


class MainMenuApi(APIView):
    '''
        左侧导航菜单
    '''
    def get(self, request, *args, **kwargs):
        obj = MainMenu.objects.filter()
        menu_data = MenuAppendSer(obj, many=True).data
        return Response(menu_data)

    def post(self, request, *args, **kwargs):
        '''
            新增主菜单
        '''
        data = request.data
        if len(data) == 4:
            print(data)
            try:
                serializer = MainMenuSer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    right_code["msg"] = "添加主菜单成功"
                    return Response(right_code)
                error_code["error"] = "添加主菜单保存数据库异常"
            except Exception as e:
                error_code["error"] = "添加主菜单失败"
            return Response(error_code, status=status.HTTP_400_BAD_REQUEST)
        #新建子菜单
        else:
            print(data)
            try:
                serializer = ChildMenuSer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    right_code["msg"] = "添加子菜单成功"
                    return Response(right_code)
                error_code["error"] = "添加子菜单保存数据库异常"
            except Exception as e:
                error_code["error"] = "添加子菜单失败"
            return Response(error_code, status=status.HTTP_400_BAD_REQUEST)