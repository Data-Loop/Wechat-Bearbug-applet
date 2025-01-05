// index.js
const app = getApp();

Page({
  data: {
    errorMsg: '请选择一张清晰且带有文字的图片。',
    icon: 'head.jpg',
    tu: '/images/unload.png',
    rs: [],
    base64: ''
  },

  // 生命周期函数：页面加载时设置标题
  onLoad() {
    wx.setNavigationBarTitle({
      title: '文字识别',
    });
  },

  async xuan() {
    let f = await app.xuantu();
    // 设置选中的图片路径
    let ma = await app.convert(f.path);
    // 去掉 base64 编码头部信息
    ma = ma.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    this.setData({
      tu: f.path,
      base64: ma,
    });
  },

  async shibie() {
    // 检查是否选过图片
    if (this.data.base64 === '') {
      wx.showToast({
        title: '你小子图放了吗',
        icon: 'error'
      });
      return;
    }
    wx.showLoading({
      title: '正在识别...',
      mask: true,
    });
    // 对 base64 数据进行 URL 编码
    let encodedData = await app.urlencode([{ image: this.data.base64 }]);
    // 调用 wordPost 发起请求
    let aaa = await app.wordPost(encodedData);
    let res = JSON.stringify(aaa);
    let wordsList = await app.extractWords(aaa);
    // console.log('识别结果: ' + res);

    this.setData({
      rs: wordsList,
      base64: ''  // 清空 base64 数据
    });
  },

});
