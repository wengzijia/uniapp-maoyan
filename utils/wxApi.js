exports.getSystemInfo = function(){
    return new Promise((resolve,reject)=>{
        wx.getSystemInfo({
            success:resolve,
            fail:reject
        })
    })
}

exports.wxlogin = function(){
    return new Promise((resolve,reject)=>{
        wx.login({
            success:resolve,
            fail:reject
        })
    })
}


