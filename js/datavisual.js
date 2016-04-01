/**
 * Created by admin on 2016/3/31.
 */
function undefine2arr(arr) {
    //空数组添加一个数组元素
    //arr[0] = arr.length ? arr[0]:arr[0]=[];
    //将未定义的元素定义为数组
    for (var i= 0;i<arr.length;i++){
        arr[i] = arr[i] ? arr[i]:[]
    }
    return arr;
}

function fishArr(all_arr,index_arr){
//    根据index_arr数组中的索引在all_arr中选取元素并重新返回新的数组
    var arr = [];
    //all_arr = undefine2arr(all_arr);
    index_arr.forEach(function(val,key){
        arr.push(all_arr[val]);
       //console.log(val);
    });
    //console.log("fishArr: " );
    //console.log(arr);
    return undefine2arr(arr);
}

function compareCanonically(a, b) {
    //数值大小比较
    return a < b ? -1:(a > b ? 1:0);
}

function boxplot(file_name, title, sam_days) {
    Papa.parse(file_name,{
        download: true,
        header: true,
        complete: function(results) {
            //console.log(results.data);
            var goodData = [];
            var interData = [];
            var poorData = [];
            for (var i=0; i<results.data.length; i++){
                var record = results.data[i];
                //                    alert(record.Day);
                //                    console.log("index" + i);
                //                    console.log(record.Day);

                switch (record.Quanlity) {
                    case 'good':
                        goodData[record.Day] = goodData[record.Day] ? goodData[record.Day]:[];
                        goodData[record.Day].push(record.Abun);
                        break;
                    case 'intermediate':
                        interData[record.Day] = interData[record.Day] ? interData[record.Day]:[];
                        interData[record.Day].push(record.Abun);
                        break;
                    case 'poor':
                        poorData[record.Day] = poorData[record.Day] ? poorData[record.Day]:[];
                        poorData[record.Day].push(record.Abun);
                        break;
                }
            }
            //console.log(goodData);
            goodData = fishArr(goodData,sam_days);
            //console.log(goodData);
            //console.log(interData);
            interData = fishArr(interData,sam_days);
            //console.log(interData);
            poorData = fishArr(poorData,sam_days);

            //                箱型图生成
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));

            // Generate data.
            data = [];
            data.push(echarts.dataTool.prepareBoxplotData(goodData));
            data.push(echarts.dataTool.prepareBoxplotData(interData));
            data.push(echarts.dataTool.prepareBoxplotData(poorData));
            //console.log(data[0]);
            var arr_min = [];
            var arr_max = [];
            data.forEach(function (val, key) {
                //console.log(val);
                val.boxData.forEach(function(val, key){
                    //console.log(val)
                    console.log(val.slice(0,1)[0]);
                    val.slice(0,1)[0] ? arr_min.push(val.slice(0,1)[0]):0;
                    val.slice(-1)[0] ? arr_max.push(val.slice(-1)[0]):0;
                })
            });
            console.log(data)
            console.log(arr_min);
            var min = arr_min.sort(compareCanonically).slice(0,1);
            console.log(min);
            console.log(arr_max);
            var max = arr_max.sort(compareCanonically).slice(-1);
            console.log(max);

            option = {
                title: {
                    text: title + "相对丰度箱型图",
                    left: 'center',
                },
                legend: {
                    y: '10%',
                    data: ['好', '一般', '差']
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '10%',
                    top: '20%',
                    right: '10%',
                    bottom: '15%'
                },
                xAxis: {
                    type: 'category',
                    data: sam_days  ,
                    boundaryGap: true,
                    nameGap: 30,
                    splitArea: {
                        show: true
                    },
                    axisLabel: {
                        formatter: '{value}天'
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'Value',
                    min: min,
                    max: max,
                    splitArea: {
                        show: false
                    }
                },
                dataZoom: [
                    {
                        type: 'inside',
                        start: 0,
                        end: 100
                    },
                    {
                        show: true,
                        height: 20,
                        type: 'slider',
                        top: '90%',
                        xAxisIndex: [0],
                        start: 0,
                        end: 100
                    }
                ],
                series: [
                    {
                        name: '好',
                        type: 'boxplot',
                        data: data[0].boxData,
                        tooltip: {formatter: formatter}
                    },
                    {
                        name: '一般',
                        type: 'boxplot',
                        data: data[1].boxData,
                        tooltip: {formatter: formatter}
                    },
                    {
                        name: '差',
                        type: 'boxplot',
                        data: data[2].boxData,
                        tooltip: {formatter: formatter}
                    }
                ]
            };

            function formatter(param) {
                return [
                    '天数 ' + param.name + '天: ',
                    'lower: ' + param.data[0],
                    'Q1: ' + param.data[1],
                    'median: ' + param.data[2],
                    'Q3: ' + param.data[3],
                    'upper: ' + param.data[4]
                ].join('<br/>')
            }

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
    });
}
