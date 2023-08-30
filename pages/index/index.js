Page({
  handleGetNickname(e) {
    // 这里在工具上有bug，请使用手机扫码来验证
    console.log('nickname is', e.detail.value)
  },
  handleGetPhoneNumber(e) {
    // 这里在工具上有bug，请使用手机扫码来验证
    console.log('phone number is', e.detail.iv)
  },
  handleChooseImage() {
    wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          // tempFilePath可以作为img标签的src属性显示图片 
          console.log('choose image is', res.tempFilePaths)
        }
    })
  }
})
