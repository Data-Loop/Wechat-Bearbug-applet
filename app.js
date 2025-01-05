// app.js
App({
  onLaunch() {

  },

  xuantu() {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        sourceType: ['album', 'camera'],
        sizeType: ['compressed', 'original'],
        count: 1,
        success: r => {
          let f = r.tempFiles[0]
          console.log('size' + f.size + 'path=' + f.path)
          resolve(f)
        },
      });
    });
  },
  urlencode(jsonArray) {
    return jsonArray.map(obj =>
      Object.keys(obj).map(key =>
        encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
      ).join('&')
    ).join('&');
  },

  extractWords(jsonArray) {
    return jsonArray.map(item => item.words);
  },
  
  wordPost(json) {
    return new Promise((a, b) => {
      wx.request({
        url: this.globalData.wordUrl + this.globalData.wordToken,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: json,
        success: r => {
          console.log('返回数据: ' + JSON.stringify(r.data))
          let temp = r.data.words_result
          a(temp)
        },
        fail: r => {
          console.log('失败:' + JSON.stringify(r))
        },
        complete: r => {
          wx.hideLoading()
        }, //对话框消失ss
      })
    });
  },
  // #从本地选图
  // xuantu(){
  //   wx.chooseImage({
  //     sourceType:['album','camera'],
  //     sizeType:['compressed','original'],
  //     count:1,
  //     success:r=>{
  //       let f=r.tempFiles[0]
  //       console.log('size'+f.size+'path='+ f.path)
  //     },
  //   })

  // 图像识别密钥
  globalData: {
    photo_apikey: 'FBcekI88IiG1Gsf3jrD1AwtP',
    photo_skey: 'fKGOazPwzmbd4hJ1Fj9Be7LTgpuKLpZy',
    token: '24.7182076cf56b3f066cd9704f4db9157e.2592000.1737620654.282335-116821460',
    cv: 'application/x-www-form-urlencoded',
    faceToken:'24.4cd38f2d615a485c27f2a2a4d705ea06.2592000.1737854320.282335-116862269',
    faceurl:'https://aip.baidubce.com/rest/2.0/face/v3/match?access_token=https://aip.baidubce.com/rest/2.0/face/v3/match?access_token=',
    wordToken: '24.0ed4de90323c2902de1d0d319251ba3d.2592000.1737887755.282335-116873380',
    wordUrl: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token='

  },   

     
  convert(file) {
    return new Promise((a, b) => {
      wx.getFileSystemManager().readFile({
        filePath: file,
        encoding: 'base64',
        success: r => {
          a(r.data)
        },
        fail: r => {}
      })
    })
  },
                              

  post(url, base64, token) {
    return new Promise((a, b) => {
      wx.request({
        url: url + '?access_token=' + token,
        method: 'POST',
        header: {
          'Content-Type': this.globalData.cv
        },
        data: {
          'image': base64
        },
        success: r => {
          let temp = r.data.result//取出结果中的数组
          for (let i = 0; i < temp.length; i++) {
            let k = temp[i]
            k.no = i + 1
            k.score = k.score * 100
            k.score = k.score.toFixed(1)
            k.score = k.score < 0.1 ? 0.1 : k.score
          }
          a(temp)
        },
        fail: r => {
          console.log('失败' + JSON.stringify(r))
        },
        complete: r => {
          wx.hideLoading(wx.hideLoading())
        },
      })
    })
  },
// 人脸对比
  facePost(jsonArray) {
    return new Promise((a, b) => {
      wx.request({
        url: this.globalData.faceurl +this.globalData.faceToken,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: jsonArray ,
        success: r => {
          console.log(JSON.stringify(r.data))
          let temp = r.data.result.score//取出结果中的数组
          a(temp)
        },
        fail: r => {
          console.log('失败' + JSON.stringify(r))
        },
        complete: r => {
          wx.hideLoading(wx.hideLoading())
        },
      })
    })
  },
})