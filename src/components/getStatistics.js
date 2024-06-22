const getLowestWavesList = (data) => {
    const sortedData = JSON.parse(JSON.stringify(data)).sort((a, b) => a[2] > b[2] ? 1 : a[2] < b[2] ? -1 : 0)
    const firstEl = sortedData[0]
    const lowest = sortedData.filter((item)=>item[2]===firstEl[2])
    const lowestList = lowest.map((item)=>{return item[0]}).join(", ")
    return lowestList
}

export function getStat(data) {
    let dataArr = JSON.parse(JSON.stringify(data))
    dataArr.forEach((row) => {
        row.push(Math.ceil(row[1] / row[2]))
    })
    dataArr.sort((a, b) => a[a.length - 1] > b[a.length - 1] ? 1 : a[a.length - 1] < b[a.length - 1] ? -1 : 0)
    const topArr = dataArr.splice(0,5)
    const recList = [
        {
            tip: "recommended by score",
            data: topArr[0][0],
        },
        {
            tip: "recommended by waves",
            data: JSON.parse(JSON.stringify(topArr)).sort((a, b) => a[2] < b[2] ? 1 : a[2] > b[2] ? -1 : 0)[0][0]
        },
        {
            tip: "recommended by price",
            data: JSON.parse(JSON.stringify(topArr)).sort((a, b) => a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0)[0][0],
            divider: true
        },
        {
            tip: "worse score",
            data: dataArr[dataArr.length-1][0]
        },
        {
            tip: "least of all waves",
            data: getLowestWavesList(dataArr)
        }
    ]
    return {
        topArr: topArr,
        recList: recList
    }
}