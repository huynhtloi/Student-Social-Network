function getCurrentTime(startTime, endTime){
    let passTime = Math.floor((endTime - startTime) / 1000)
    let outputTime = ""
    if (passTime < 60)
        outputTime = passTime + " giây trước"
    else if (passTime < (60 * 60))
        outputTime = Math.floor(passTime / 60) + " phút trước"
    else if (passTime < (60 * 60 * 24))
        outputTime = Math.floor(passTime / (60 * 60)) + " giờ trước"
    else if (passTime < (60 * 60 * 60 * 24 * 30))
        outputTime = Math.floor(passTime / (60 * 60 * 24)) + " ngày trước"
    else if (passTime < (60 * 60 * 60 * 24 * 30 * 365))
        outputTime = Math.floor(passTime / (60 * 60 * 24 * 30)) + " tháng trước"
    return outputTime
}

module.exports = {getCurrentTime}