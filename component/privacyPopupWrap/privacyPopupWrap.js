import privacyBus from '../privacyPopup/privacyBus';

Component({
  data: {
    needAuthorization: true,
  },
  lifetimes: {
    attached() {
        if(typeof wx.getPrivacySetting === 'function') {
            wx.getPrivacySetting({
                success: res => {
                    if(res.needAuthorization) {
                        privacyBus.on(this.handleNeedAuthorization, this);
                    } else {
                        this.setData({
                            needAuthorization: res.needAuthorization,
                        })    
                    }
                },
            })
        } else {
            this.setData({
                needAuthorization: false,
            })    
        }
    },
    detached() {
        privacyBus.off(this.handleNeedAuthorization);
    },
  },
  methods: {
    handleNeedAuthorization() {
        this.setData({
            needAuthorization: false
        })
        privacyBus.off(this.handleNeedAuthorization);
    },
    handleTouchInput() {
        wx.requirePrivacyAuthorize({
            success: () => {
                // 用户同意了隐私协议 或 无需用户同意隐私协议
                this.handleNeedAuthorization();
                this.triggerEvent('success');
            },
            fail: () => {
                // 用户拒绝了隐私协议
                this.triggerEvent('fail');
            }
        })
    },
  }
})