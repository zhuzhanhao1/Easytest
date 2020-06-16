import jsonpath
import json
'''
  $	        跟节点
  @	        现行节点
  . or []	取子节点
  n/a	    就是不管位置，选择所有符合条件的条件
  *	        匹配所有元素节点
  []	    迭代器标示(可以在里面做简单的迭代操作，如数组下标，根据内容选值等)
  [,]	    支持迭代器中做多选
  ?()	    支持过滤操作
  ()	    支持表达式计算
'''

book_store = {
    "store": {
        "book": [
            {
                "category": "reference",
                "author": "Nigel Rees",
                "title": "Sayings of the Century",
                "price": 8.95
            },
            {
                "category": "fiction",
                "author": "Evelyn Waugh",
                "title": "Sword of Honour",
                "price": 12.99
            },
            {
                "category": "fiction",
                "author": "Herman Melville",
                "title": "Moby Dick",
                "isbn": "0-553-21311-3",
                "price": 8.99
            },
            {
                "category": "fiction",
                "author": "J. R. R. Tolkien",
                "title": "The Lord of the Rings",
                "isbn": "0-395-19395-8",
                "price": 22.99
            }
        ],
        "bicycle": {
            "color": "red",
            "price": 19.95
        }
    },
    "expensive": 10
}
'''
    $.store.book[*].author	                获取json中store下book下的所有author值
    $..author	                            获取所有json中所有author的值
    $.store.*	                            所有的东西，书籍和自行车
    $.store..price	                        获取json中store下所有price的值
    $..book[2]	                            获取json中book数组的第3个值
    $..book[-2]	                            倒数的第二本书
    $..book[0,1]	                        前两本书
    $..book[:2]	                            从索引0（包括）到索引2（排除）的所有图书
    $..book[1:2]	                        从索引1（包括）到索引2（排除）的所有图书
    $..book[-2:]	                        获取json中book数组的最后两个值
    $..book[2:]	                            获取json中book数组的第3个到最后一个的区间值
    $..book[?(@.isbn)]	                    获取json中book数组中包含isbn的所有值
    $.store.book[?(@.price < 10)]	        获取json中book数组中price<10的所有值
    $..book[?(@.price <= $['expensive'])]	获取json中book数组中price<=expensive的所有值
    $..book[?(@.author =~ /.*REES/i)]	    获取json中book数组中的作者以REES结尾的所有值（REES不区分大小写）
    $..*	                                逐层列出json中的所有值，层级由外到内
    $..book.length()	                    获取json中book数组的长度
'''


def GetValueByJsonpath(value,key):
    result = jsonpath.jsonpath(json.loads(value), key)
    print(result)
    return result


GetValueByJsonpath('{"id":"5529aa67-d20f-4859-9532-13fe256fdb3b","description":"",'
                   '"schemeName":"接收登记表(件)","code":null,"aggregationLevel":"件",'
                   '"creator":"admin","modifier":null,"creationDate":"2020-06-05",'
                   '"modifyDate":null,"newVersionNo":null}','$.id')

    